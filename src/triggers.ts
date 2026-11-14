/**
 * Stage 4: run what a Risu button asks for.
 *
 *  - `risu-btn="payload"`          -> Lua `onButtonClick(triggerId, payload)`
 *  - `risu-trigger="name"` / `{{button::label::name}}`
 *                                  -> Lua function `name`, or the manual trigger whose comment is `name`
 *  - `listenEdit("editRequest")`   -> runs on the outgoing prompt before each generation
 */
import { RisuLua, type LuaHost } from './lua'

export interface RisuTrigger {
  comment?: string
  type?: string
  conditions?: unknown[]
  effect?: Array<Record<string, any>>
  lowLevelAccess?: boolean
}

export function luaCodeOf(triggers: RisuTrigger[]): string[] {
  const out: string[] = []
  for (const t of triggers ?? []) {
    for (const e of t.effect ?? []) {
      if (e?.type === 'triggerlua' && typeof e.code === 'string' && e.code.trim()) out.push(e.code)
    }
  }
  return out
}

/** Load all of a card's Lua into one runtime. Returns null when the card has none. */
export function loadLua(triggers: RisuTrigger[], host: LuaHost): RisuLua | null {
  const codes = luaCodeOf(triggers)
  if (!codes.length) return null
  const rt = new RisuLua(host)
  for (const code of codes) rt.load(code)
  return rt
}

function applyOp(cur: string, op: string, value: string): string {
  const a = Number(cur), b = Number(value)
  const num = (x: number) => String(Number.isFinite(x) ? Math.round(x * 1e9) / 1e9 : 0)
  switch (op) {
    case '+=': return num((Number.isFinite(a) ? a : 0) + b)
    case '-=': return num((Number.isFinite(a) ? a : 0) - b)
    case '*=': return num((Number.isFinite(a) ? a : 0) * b)
    case '/=': return num((Number.isFinite(a) ? a : 0) / b)
    case '%=': return num((Number.isFinite(a) ? a : 0) % b)
    default: return value
  }
}

/** Run the simple (non-Lua) effects of a manual trigger: variable changes. */
export function runSimpleTrigger(trigger: RisuTrigger, host: Pick<LuaHost, 'getChatVar' | 'setChatVar'>): number {
  let done = 0
  for (const e of trigger.effect ?? []) {
    if (e?.type === 'v2SetVar' || e?.type === 'setvar') {
      const key = String(e.var ?? '')
      if (!key) continue
      let value = String(e.value ?? '')
      if (e.valueType === 'var') value = host.getChatVar(value)
      host.setChatVar(key, applyOp(host.getChatVar(key), String(e.operator ?? '='), value))
      done++
    }
  }
  return done
}

export function findManualTrigger(triggers: RisuTrigger[], name: string): RisuTrigger | undefined {
  return (triggers ?? []).find((t) => t && t.type === 'manual' && (t.comment ?? '') === name)
}
