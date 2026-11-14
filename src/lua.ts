/**
 * Small RisuAI Lua runtime on top of fengari (Lua 5.3 in pure JS).
 *
 * Covers what card selectors and menus use: chat/global variables, display reload,
 * `async` / `:await()`, alert prompts, the last messages, and `listenEdit` hooks.
 * Every call gets a fresh Lua state, so cards cannot leak state into each other.
 */
// @ts-expect-error fengari ships without types
import * as fengari from 'fengari'

const { lua, lauxlib, lualib, to_luastring } = fengari as any

export interface LuaHost {
  getChatVar(key: string): string
  setChatVar(key: string, value: string): void
  getGlobalVar(key: string): string
  /** Ask the viewer for text (alertInput) or just show a notice (alertNormal). */
  prompt?(message: string, kind: 'input' | 'normal' | 'select', options?: string[]): Promise<string | null>
  userLastMessage(): string
  charLastMessage(): string
  names: { user: string; char: string }
  reloadDisplay(): void
  log(text: string): void
}

export interface EditListener { kind: string; ref: number }

const PRELUDE = `
local __yield = coroutine.yield
Promise = {}
Promise.__index = Promise
function Promise:await()
  if self.__resolved then return table.unpack(self.__resolved, 1, self.__resolved.n) end
  return __yield(self)
end
function async(fn)
  return function(...)
    local r = table.pack(fn(...))
    return setmetatable({ __resolved = r }, Promise)
  end
end
function __pending(id) return setmetatable({ __pid = id }, Promise) end
json = json or {}
`

const MAX_STEPS = 5_000_000

/** Push a JS value onto the Lua stack. */
function push(L: any, v: unknown, depth = 0): void {
  if (v === null || v === undefined || depth > 20) { lua.lua_pushnil(L); return }
  if (typeof v === 'boolean') { lua.lua_pushboolean(L, v); return }
  if (typeof v === 'number') { Number.isInteger(v) ? lua.lua_pushinteger(L, v) : lua.lua_pushnumber(L, v); return }
  if (typeof v === 'string') { lua.lua_pushstring(L, to_luastring(v)); return }
  if (Array.isArray(v)) {
    lua.lua_createtable(L, v.length, 0)
    v.forEach((item, i) => { push(L, item, depth + 1); lua.lua_rawseti(L, -2, i + 1) })
    return
  }
  if (typeof v === 'object') {
    lua.lua_newtable(L)
    for (const [k, val] of Object.entries(v as Record<string, unknown>)) {
      push(L, val, depth + 1)
      lua.lua_setfield(L, -2, to_luastring(k))
    }
    return
  }
  lua.lua_pushnil(L)
}

/** Read the Lua value at `idx` as a JS value. */
function toJs(L: any, idx: number, depth = 0): unknown {
  const t = lua.lua_type(L, idx)
  switch (t) {
    case lua.LUA_TNIL: case lua.LUA_TNONE: return null
    case lua.LUA_TBOOLEAN: return lua.lua_toboolean(L, idx)
    case lua.LUA_TNUMBER: return lua.lua_tonumber(L, idx)
    case lua.LUA_TSTRING: return lua.lua_tojsstring(L, idx)
    case lua.LUA_TTABLE: {
      if (depth > 20) return null
      const abs = lua.lua_absindex(L, idx)
      const obj: Record<string, unknown> = {}
      const keys: Array<string | number> = []
      lua.lua_pushnil(L)
      while (lua.lua_next(L, abs) !== 0) {
        const kt = lua.lua_type(L, -2)
        const key = kt === lua.LUA_TNUMBER ? lua.lua_tonumber(L, -2) : lua.lua_tojsstring(L, -2)
        keys.push(key)
        obj[String(key)] = toJs(L, -1, depth + 1)
        lua.lua_pop(L, 1)
      }
      const n = keys.length
      const isArray = n > 0 && keys.every((k) => typeof k === 'number' && Number.isInteger(k) && k >= 1 && k <= n)
      if (isArray) return Array.from({ length: n }, (_, i) => obj[String(i + 1)])
      return obj
    }
    default: return null
  }
}

const str = (L: any, i: number) => {
  const t = lua.lua_type(L, i)
  if (t === lua.LUA_TNIL || t === lua.LUA_TNONE) return ''
  return lauxlib.luaL_tolstring(L, i) ? (() => { const s = lua.lua_tojsstring(L, -1); lua.lua_pop(L, 1); return s })() : ''
}

export class RisuLua {
  private L: any
  private promises = new Map<number, Promise<unknown>>()
  private nextPid = 1
  readonly listeners: EditListener[] = []
  readonly errors: string[] = []

  constructor(private host: LuaHost) {
    const L = lauxlib.luaL_newstate()
    this.L = L
    lualib.luaL_openlibs(L)
    // No file / process access for card code.
    for (const lib of ['io', 'package', 'debug', 'dofile', 'loadfile', 'require']) {
      lua.lua_pushnil(L)
      lua.lua_setglobal(L, to_luastring(lib))
    }
    lua.lua_getglobal(L, to_luastring('os'))
    for (const f of ['execute', 'exit', 'remove', 'rename', 'tmpname', 'getenv']) {
      lua.lua_pushnil(L)
      lua.lua_setfield(L, -2, to_luastring(f))
    }
    lua.lua_pop(L, 1)
    this.installHost()
    this.exec(PRELUDE, 'prelude')
  }

  private def(name: string, fn: (L: any) => number) {
    lua.lua_pushjsfunction(this.L, fn)
    lua.lua_setglobal(this.L, to_luastring(name))
  }

  private pending(L: any, p: Promise<unknown>): number {
    const id = this.nextPid++
    this.promises.set(id, p)
    lua.lua_getglobal(L, to_luastring('__pending'))
    lua.lua_pushinteger(L, id)
    lua.lua_call(L, 1, 1)
    return 1
  }

  private installHost() {
    const h = this.host
    const ret = (L: any, v: unknown) => { push(L, v); return 1 }
    this.def('getChatVar', (L) => ret(L, h.getChatVar(str(L, 2))))
    this.def('setChatVar', (L) => { h.setChatVar(str(L, 2), str(L, 3)); return 0 })
    this.def('getGlobalVar', (L) => ret(L, h.getGlobalVar(str(L, 2))))
    this.def('setGlobalVar', (L) => { h.setChatVar(str(L, 2), str(L, 3)); return 0 })
    this.def('getState', (L) => {
      const raw = h.getChatVar(`__${str(L, 2)}`)
      try { return ret(L, raw && raw !== 'null' ? JSON.parse(raw) : null) } catch { return ret(L, null) }
    })
    this.def('setState', (L) => { h.setChatVar(`__${str(L, 2)}`, JSON.stringify(toJs(L, 3))); return 0 })
    this.def('reloadDisplay', () => { h.reloadDisplay(); return 0 })
    this.def('reloadChat', () => { h.reloadDisplay(); return 0 })
    this.def('getUserLastMessage', (L) => ret(L, h.userLastMessage()))
    this.def('getCharacterLastMessage', (L) => ret(L, h.charLastMessage()))
    this.def('getName', (L) => ret(L, h.names.char))
    this.def('getPersonaName', (L) => ret(L, h.names.user))
    this.def('log', (L) => { h.log(str(L, 1)); return 0 })
    this.def('print', (L) => {
      const n = lua.lua_gettop(L)
      const parts: string[] = []
      for (let i = 1; i <= n; i++) parts.push(str(L, i))
      h.log(parts.join('\t'))
      return 0
    })
    const ask = (kind: 'input' | 'normal' | 'select') => (L: any) => {
      const message = str(L, 2)
      const options = kind === 'select' ? (toJs(L, 2) as string[] | null) ?? [] : undefined
      const p = h.prompt ? h.prompt(kind === 'select' ? '' : message, kind, options) : Promise.resolve(null)
      return this.pending(L, kind === 'select' ? p.then((v) => (v === null ? null : Number(v))) : p)
    }
    this.def('alertInput', ask('input'))
    this.def('alertNormal', ask('normal'))
    this.def('alertError', ask('normal'))
    this.def('alertSelect', ask('select'))
    this.def('listenEdit', (L) => {
      const kind = str(L, 1)
      if (lua.lua_type(L, 2) !== lua.LUA_TFUNCTION) return 0
      lua.lua_pushvalue(L, 2)
      const ref = lauxlib.luaL_ref(L, lua.LUA_REGISTRYINDEX)
      this.listeners.push({ kind, ref })
      return 0
    })
    // Not supported here: these quietly do nothing so the rest of the script still runs.
    for (const name of ['setChat', 'addChat', 'cutChat', 'removeChat', 'stopChat', 'setDescription', 'setCharacterFirstMessage', 'upsertLocalLoreBook', 'LLM', 'axLLM', 'simpleLLM', 'request']) {
      this.def(name, (L) => this.pending(L, Promise.resolve(null)))
    }
    this.def('getChatLength', (L) => ret(L, 0))
  }

  private exec(code: string, name: string): boolean {
    const L = this.L
    if (lauxlib.luaL_loadbuffer(L, to_luastring(code), null, to_luastring(name)) !== lua.LUA_OK) {
      this.errors.push(lua.lua_tojsstring(L, -1))
      lua.lua_pop(L, 1)
      return false
    }
    if (lua.lua_pcall(L, 0, 0, 0) !== lua.LUA_OK) {
      this.errors.push(lua.lua_tojsstring(L, -1))
      lua.lua_pop(L, 1)
      return false
    }
    return true
  }

  /** Run the card's script body (defines functions, registers listeners). */
  load(code: string): boolean {
    return this.exec(code, 'card')
  }

  hasFunction(name: string): boolean {
    lua.lua_getglobal(this.L, to_luastring(name))
    const ok = lua.lua_type(this.L, -1) === lua.LUA_TFUNCTION
    lua.lua_pop(this.L, 1)
    return ok
  }

  /** Call a global function (or a registry ref) inside a coroutine, resolving awaits. */
  async call(fn: string | number, args: unknown[]): Promise<unknown> {
    const L = this.L
    const co = lua.lua_newthread(L)
    const coRef = lauxlib.luaL_ref(L, lua.LUA_REGISTRYINDEX) // keep the thread alive
    try {
      if (typeof fn === 'number') lua.lua_rawgeti(co, lua.LUA_REGISTRYINDEX, fn)
      else lua.lua_getglobal(co, to_luastring(fn))
      if (lua.lua_type(co, -1) !== lua.LUA_TFUNCTION) { lua.lua_settop(co, 0); return undefined }
      for (const a of args) push(co, a)
      let nargs = args.length
      for (let guard = 0; guard < 1000; guard++) {
        const status = lua.lua_resume(co, L, nargs)
        if (status === lua.LUA_OK) {
          const n = lua.lua_gettop(co)
          const result = n > 0 ? toJs(co, 1) : undefined
          lua.lua_settop(co, 0)
          return result
        }
        if (status !== lua.LUA_YIELD) {
          this.errors.push(lua.lua_tojsstring(co, -1))
          return undefined
        }
        // Yielded a Promise table: { __pid = n }
        let value: unknown = null
        if (lua.lua_type(co, -1) === lua.LUA_TTABLE) {
          lua.lua_getfield(co, -1, to_luastring('__pid'))
          const pid = lua.lua_tointeger(co, -1)
          lua.lua_pop(co, 1)
          const p = this.promises.get(pid)
          this.promises.delete(pid)
          value = p ? await p : null
        }
        lua.lua_settop(co, 0)
        push(co, value)
        nargs = 1
      }
      return undefined
    } finally {
      lauxlib.luaL_unref(L, lua.LUA_REGISTRYINDEX, coRef)
    }
  }

  async runListeners(kind: string, data: unknown, extra: unknown[] = []): Promise<unknown> {
    let current = data
    for (const l of this.listeners) {
      if (l.kind !== kind) continue
      const out = await this.call(l.ref, ['risubridge', current, ...extra])
      if (out !== undefined && out !== null) current = out
    }
    return current
  }
}

export { MAX_STEPS }
