/// <reference types="lumiverse-spindle-types" />
import type { MacroInterceptorCtxDTO, MacroInterceptorResultDTO, SpindleAPI } from 'lumiverse-spindle-types'
import { toggleLayout, type TogglesReply } from './toggles'
import { alreadySynced, backgroundStyles, fixFor, isRisuImported, matchOriginal, revertFor, type ImportedScript } from './regex-sync'
import type { LinkedRisuData } from './risu-file'
import { isLoreSynced, loreFixFor, matchCardEntry, type CardLoreEntry, type LoreEntry } from './lore-sync'
import { findManualTrigger, loadLua, runSimpleTrigger, type RisuTrigger } from './triggers'
import type { LuaHost } from './lua'
import { renderCbs, hasRisuSyntax, parseToggles, defaultToggleValue, parseDefaultVariables, type ToggleDef, type CbsPhase } from './cbs'

declare const spindle: SpindleAPI

interface RisuCardInfo {
  isRisu: boolean
  toggles: ToggleDef[]
  defaults: Record<string, string>
  /** Risu asset name (lower-cased, also without extension) -> Lumiverse image id */
  assets: Map<string, string>
  assetNames: string[]
  charImageId: string | null
  fetchedAt: number
}

function assetMapOf(ext: Record<string, any>): { map: Map<string, string>; names: string[] } {
  const map = new Map<string, string>()
  const names: string[] = []
  const add = (name: string, id: unknown) => {
    if (typeof id !== 'string' || !id) return
    if (!names.includes(name)) names.push(name)
    for (const k of [name, name.replace(/\.[a-z0-9]+$/i, '')]) {
      const low = k.toLowerCase()
      if (!map.has(low)) map.set(low, id)
    }
  }
  for (const [k, v] of Object.entries((ext.risu_asset_map ?? {}) as Record<string, unknown>)) add(k, v)
  for (const [k, v] of Object.entries((ext.expressions?.mappings ?? {}) as Record<string, unknown>)) add(k, v)
  return { map, names }
}

const imageUrl = (id: string) => `/api/v1/images/${encodeURIComponent(id)}`

const CACHE_MS = 15_000
const cardCache = new Map<string, RisuCardInfo>()

async function cardInfo(characterId: string, userId: string | undefined): Promise<RisuCardInfo> {
  const key = `${userId ?? ''}:${characterId}`
  const hit = cardCache.get(key)
  if (hit && Date.now() - hit.fetchedAt < CACHE_MS) return hit
  let info: RisuCardInfo = { isRisu: false, toggles: [], defaults: {}, assets: new Map(), assetNames: [], charImageId: null, fetchedAt: Date.now() }
  try {
    const ch = await spindle.characters.get(characterId, userId)
    const ext = (ch?.extensions ?? {}) as Record<string, any>
    const risu = ext.risuai
    const disabled = ext.risubridge?.enabled === false
    if (risu && typeof risu === 'object' && !disabled) {
      info = {
        isRisu: true,
        toggles: parseToggles(typeof risu.toggles === 'string' ? risu.toggles : ''),
        defaults: parseDefaultVariables(typeof risu.defaultVariables === 'string' ? risu.defaultVariables : ''),
        ...(() => { const a = assetMapOf(ext); return { assets: a.map, assetNames: a.names } })(),
        charImageId: (ch as { image_id?: string | null } | null)?.image_id ?? null,
        fetchedAt: Date.now(),
      }
      scheduleSync(characterId, userId)
    }
  } catch (err) {
    spindle.log.warn(`[risubridge] could not read character ${characterId}: ${err instanceof Error ? err.message : String(err)}`)
  }
  cardCache.set(key, info)
  return info
}

/** `{{setchatvar}}` call that Lumiverse runs right after us, so the value is persisted the normal way. */
function persistMacro(key: string, value: string): string {
  if (value.includes('{{') || value.includes('}}')) return '' // never smuggle macros into the host
  if (value.includes('::')) return `{{setchatvar::${key}}}${value}{{/setchatvar}}`
  return `{{setchatvar::${key}::${value}}}`
}

/**
 * Risu numbers chat messages without the greeting (greeting = -1); Lumiverse
 * counts the greeting as message 0. Convert both indices to Risu's scheme.
 */
function riskIndex(env: MacroInterceptorCtxDTO['env'], messages: Array<{ is_user?: boolean }>) {
  const offset = messages.length > 0 && messages[0] && !messages[0].is_user ? 1 : 0
  const chat = env.chat as Record<string, unknown>
  const lumiLast = typeof chat.lastMessageId === 'number' ? chat.lastMessageId : messages.length - 1
  const dyn = Number(env.dynamicMacros?.chat_index)
  const lumiIndex = Number.isFinite(dyn) && env.dynamicMacros?.chat_index !== undefined ? dyn : lumiLast
  return { chatIndex: lumiIndex - offset, lastMessageId: lumiLast - offset }
}

// Cheap self-timing so slowness can be traced from the server log.
const perf = { calls: 0, risu: 0, ms: 0 }
setInterval(() => {
  if (perf.risu) spindle.log.info(`[risubridge:perf] ${perf.risu}/${perf.calls} macro passes handled in ${perf.ms.toFixed(0)}ms`)
  perf.calls = 0; perf.risu = 0; perf.ms = 0
}, 10_000)

async function intercept(ctx: MacroInterceptorCtxDTO): Promise<MacroInterceptorResultDTO> {
  perf.calls++
  const started = performance.now()
  try { return await interceptInner(ctx) } finally { perf.ms += performance.now() - started }
}

async function interceptInner(ctx: MacroInterceptorCtxDTO): Promise<MacroInterceptorResultDTO> {
  const template = ctx.template
  if (!template.includes('{{')) return undefined

  const extra = (ctx.env.extra ?? {}) as Record<string, unknown>
  const characterId = typeof extra.characterId === 'string' ? extra.characterId : undefined
  if (!characterId) return undefined
  // Looked up (cached) even without Risu syntax so the card's regex gets repaired early.
  const info = await cardInfo(characterId, ctx.userId)
  if (!info.isRisu || !hasRisuSyntax(template)) return undefined
  perf.risu++

  const chatVars = ctx.env.variables.chat ?? {}
  const globalVars = ctx.env.variables.global ?? {}
  const toggleDefs = new Map(info.toggles.map((t) => [t.key, t]))
  const messages = Array.isArray(extra.messages) ? (extra.messages as Array<{ content?: string; is_user?: boolean }>) : []
  const idx = riskIndex(ctx.env, messages)

  const sets: Array<[string, string]> = []
  const result = renderCbs(template, {
    phase: ctx.phase as CbsPhase,
    getChatVar: (k) => chatVars[k],
    onSetChatVar: (k, v) => { sets.push([k, v]) },
    getGlobalVar: (k) => globalVars[k],
    toggle: (name) => chatVars[`toggle_${name}`] ?? globalVars[`toggle_${name}`] ?? defaultToggleValue(toggleDefs.get(name)),
    defaultVariables: info.defaults,
    names: { user: ctx.env.names.user ?? 'User', char: ctx.env.names.char ?? '' },
    chatIndex: idx.chatIndex,
    lastMessageId: idx.lastMessageId,
    previousCharChat: [...messages].reverse().find((m) => m && !m.is_user)?.content ?? '',
    previousUserChat: [...messages].reverse().find((m) => m && m.is_user)?.content ?? '',
    assetUrl: (name) => {
      if (name === '__source_char') return info.charImageId ? imageUrl(info.charImageId) : undefined
      if (name.startsWith('__source_')) return undefined
      const id = info.assets.get(name.toLowerCase()) ?? info.assets.get(name.toLowerCase().replace(/\.[a-z0-9]+$/i, ''))
      return id ? imageUrl(id) : undefined
    },
    assetNames: () => info.assetNames,
  })

  let text = result.text
  if (ctx.commit && ctx.phase !== 'prompt' && sets.length) {
    const last = new Map(sets)
    text += [...last].map(([k, v]) => persistMacro(k, v)).join('')
  }
  return { text, touchedVars: [...result.touched], volatile: result.volatile }
}

// ─────────── stage 3: repair imported Risu regex scripts ───────────

const lastSync = new Map<string, number>()
const SYNC_EVERY_MS = 10 * 60_000

function scheduleSync(characterId: string, userId: string | undefined) {
  const key = `${userId ?? ''}:${characterId}`
  const at = lastSync.get(key) ?? 0
  if (Date.now() - at < SYNC_EVERY_MS) return
  lastSync.set(key, Date.now())
  void syncCharacterRegex(characterId, userId).catch((err) =>
    spindle.log.warn(`[risubridge] regex sync failed for ${characterId}: ${err instanceof Error ? err.message : String(err)}`))
}

async function characterScripts(characterId: string, userId: string | undefined): Promise<ImportedScript[]> {
  const out: ImportedScript[] = []
  for (let offset = 0; ; offset += 200) {
    const page = await spindle.regex_scripts.list({ scope: 'character', scopeId: characterId, limit: 200, offset, ...(userId ? { userId } : {}) })
    out.push(...(page.data as unknown as ImportedScript[]))
    if (page.data.length < 200) break
  }
  return out.filter(isRisuImported)
}

/** Returns how many scripts were repaired. Characters opted out via the panel are left alone. */
async function syncCharacterRegex(characterId: string, userId: string | undefined, force = false): Promise<number> {
  const ch = await spindle.characters.get(characterId, userId)
  const ext = (ch?.extensions ?? {}) as Record<string, any>
  if (!ext.risuai) return 0
  if (ext.risubridge?.regex === false) { await syncCharacterLore(ch, userId, force).catch(() => 0); return 0 }
  const styles = backgroundStyles(ext.risuai.backgroundHTML)
  const linked = ext.risubridge?.module as LinkedRisuData | undefined
  let fixed = 0
  for (const s of await characterScripts(characterId, userId)) {
    if (!force && alreadySynced(s, Boolean(linked))) continue
    if (s.can_mutate === false) continue
    const fix = fixFor(s, styles, matchOriginal(s, linked?.regex), ch?.name)
    await spindle.regex_scripts.update(s.id, fix as never, userId)
    fixed++
  }
  if (fixed) spindle.log.info(`[risubridge] repaired ${fixed} Risu regex script(s) for ${ch?.name ?? characterId}`)
  await syncCharacterLore(ch, userId, force).catch((err) =>
    spindle.log.warn(`[risubridge] lorebook sync failed for ${ch?.name ?? characterId}: ${err instanceof Error ? err.message : String(err)}`))
  return fixed
}

/**
 * Give the card's lorebook Risu's activation rules: scan only the last few messages and
 * honour `@@decorators`. Only entries that still match the card's own lorebook are touched.
 */
async function syncCharacterLore(ch: Awaited<ReturnType<SpindleAPI['characters']['get']>>, userId: string | undefined, force = false): Promise<number> {
  const ext = (ch?.extensions ?? {}) as Record<string, any>
  const book = ext.character_book as { scan_depth?: number; entries?: CardLoreEntry[] } | undefined
  if (!ch || !ext.risuai || !book?.entries?.length || !(spindle as any).world_books) return 0
  const cardDepth = typeof book.scan_depth === 'number' ? book.scan_depth : undefined
  let fixed = 0
  for (const bookId of ch.world_book_ids ?? []) {
    for (let offset = 0; ; offset += 200) {
      const page = await spindle.world_books.entries.list(bookId, { limit: 200, offset, ...(userId ? { userId } : {}) })
      for (const e of page.data as unknown as LoreEntry[]) {
        if (!force && isLoreSynced(e)) continue
        if (!matchCardEntry(e, book.entries)) continue
        const fix = loreFixFor(e, cardDepth)
        if (!fix) continue
        await spindle.world_books.entries.update(e.id, fix as never, userId)
        fixed++
      }
      if (page.data.length < 200) break
    }
  }
  if (fixed) spindle.log.info(`[risubridge] applied Risu lorebook rules to ${fixed} entr${fixed === 1 ? 'y' : 'ies'} for ${ch.name}`)
  return fixed
}

async function revertCharacterRegex(characterId: string, userId: string | undefined): Promise<number> {
  let n = 0
  for (const s of await characterScripts(characterId, userId)) {
    const rev = revertFor(s)
    if (!rev || s.can_mutate === false) continue
    await spindle.regex_scripts.update(s.id, rev as never, userId)
    n++
  }
  return n
}

async function regexStatus(characterId: string, userId: string) {
  const all = await characterScripts(characterId, userId)
  return { total: all.length, synced: all.filter((s) => alreadySynced(s)).length, active: all.filter((s) => alreadySynced(s) && !s.disabled).length }
}

/** Sweep every Risu card once at startup (covers cards imported before the extension). */
async function syncAll() {
  try {
    for (let offset = 0; ; offset += 100) {
      const page = await spindle.characters.list({ limit: 100, offset })
      for (const ch of page.data) {
        if ((ch.extensions as Record<string, unknown> | undefined)?.risuai) {
          lastSync.set(`:${ch.id}`, Date.now())
          await syncCharacterRegex(ch.id, undefined).catch(() => 0)
        }
      }
      if (page.data.length < 100) break
    }
  } catch (err) {
    // Operator-scoped installs have no single user here; cards are repaired lazily on first use.
    void err
  }
}

// Imports create the character first and attach module regex right after; wait a moment.
spindle.on('CHARACTER_CREATED', (payload, userId) => {
  const p = payload as { id?: string; character?: { id?: string }; characterId?: string }
  const id = p?.character?.id ?? p?.characterId ?? p?.id
  if (!id) return
  setTimeout(() => { lastSync.delete(`${userId ?? ''}:${id}`); scheduleSync(id, userId) }, 5000)
})

// ─────────── toggle panel (frontend <-> backend) ───────────

async function buildTogglesReply(chatId: string, characterId: string, userId: string): Promise<TogglesReply> {
  const ch = await spindle.characters.get(characterId, userId)
  const risu = (ch?.extensions as Record<string, any> | undefined)?.risuai
  const vars = await spindle.variables.chat.list(chatId).catch(() => ({} as Record<string, string>))
  const src = risu && typeof risu.toggles === 'string' ? risu.toggles : ''
  return {
    type: 'toggles',
    chatId,
    characterName: ch?.name ?? '',
    isRisu: Boolean(risu),
    rows: toggleLayout(src, (k) => vars[`toggle_${k}`]),
    regex: risu ? await regexStatus(characterId, userId).catch(() => undefined) : undefined,
    regexOptOut: (ch?.extensions as Record<string, any> | undefined)?.risubridge?.regex === false,
    linked: linkedInfo((ch?.extensions as Record<string, any> | undefined)?.risubridge?.module),
  }
}

function linkedInfo(mod: LinkedRisuData | undefined) {
  if (!mod) return undefined
  const lua = (mod.triggers as RisuTrigger[]).some((t) => (t.effect ?? []).some((e) => e?.type === 'triggerlua' && String(e.code ?? '').trim()))
  const manual = (mod.triggers as RisuTrigger[]).filter((t) => t?.type === 'manual').length
  return { cardName: mod.cardName, linkedAt: mod.linkedAt, lua, manual }
}

// ─────────── stage 4: buttons, Lua, prompt hooks ───────────

const pendingPrompts = new Map<string, (value: string | null) => void>()

async function luaHostFor(chatId: string, characterId: string, userId: string, onReload: () => void) {
  const ch = await spindle.characters.get(characterId, userId)
  const ext = (ch?.extensions ?? {}) as Record<string, any>
  const mod = ext.risubridge?.module as LinkedRisuData | undefined
  const vars: Record<string, string> = { ...(await spindle.variables.chat.list(chatId).catch(() => ({}))) }
  const dirty = new Map<string, string>()
  const toggleDefs = new Map(parseToggles(typeof ext.risuai?.toggles === 'string' ? ext.risuai.toggles : '').map((t) => [t.key, t]))
  const defaults = parseDefaultVariables(typeof ext.risuai?.defaultVariables === 'string' ? ext.risuai.defaultVariables : '')
  const messages = (await spindle.chat.getMessages(chatId).catch(() => [])) as Array<{ content?: string; is_user?: boolean }>
  const host: LuaHost = {
    getChatVar: (k) => vars[k] ?? defaults[k] ?? 'null',
    setChatVar: (k, v) => { vars[k] = v; dirty.set(k, v) },
    getGlobalVar: (k) => {
      if (k.startsWith('toggle_')) return vars[k] ?? defaultToggleValue(toggleDefs.get(k.slice(7)))
      return 'null'
    },
    prompt: (message, kind, options) => new Promise((resolve) => {
      const id = crypto.randomUUID()
      pendingPrompts.set(id, resolve)
      spindle.sendToFrontend({ type: 'risu_prompt', id, chatId, message, kind, options }, userId)
      setTimeout(() => { if (pendingPrompts.delete(id)) resolve(null) }, 10 * 60_000)
    }),
    userLastMessage: () => [...messages].reverse().find((m) => m?.is_user)?.content ?? '',
    charLastMessage: () => [...messages].reverse().find((m) => m && !m.is_user)?.content ?? '',
    names: { user: 'User', char: ch?.name ?? '' },
    reloadDisplay: onReload,
    log: (t) => spindle.log.info(`[risubridge:lua] ${t}`),
  }
  const flush = async () => {
    for (const [k, v] of dirty) await spindle.variables.chat.set(chatId, k, v)
    const n = dirty.size
    dirty.clear()
    return n
  }
  return { host, flush, mod }
}

async function handleClick(chatId: string, characterId: string, userId: string, kind: string, value: string) {
  let reload = false
  const { host, flush, mod } = await luaHostFor(chatId, characterId, userId, () => { reload = true })
  if (!mod) {
    spindle.sendToFrontend({ type: 'risu_notice', chatId, message: '이 버튼을 쓰려면 ⋯ → 리스 토글에서 원본 카드 파일을 한 번 연결해 주세요.' }, userId)
    return
  }
  const triggers = mod.triggers as RisuTrigger[]
  const rt = loadLua(triggers, host)
  let handled = false
  if (kind === 'btn') {
    if (rt?.hasFunction('onButtonClick')) { await rt.call('onButtonClick', ['risubridge', value]); handled = true }
  } else {
    if (rt?.hasFunction(value)) { await rt.call(value, ['risubridge']); handled = true }
    else {
      const t = findManualTrigger(triggers, value)
      if (t) { runSimpleTrigger(t, host); handled = true }
    }
  }
  if (rt?.errors.length) spindle.log.warn(`[risubridge] Lua: ${rt.errors.join(' | ').slice(0, 500)}`)
  const changed = await flush()
  if (!handled) spindle.log.info(`[risubridge] no handler for ${kind} "${value}"`)
  if (changed || reload) spindle.sendToFrontend({ type: 'risu_reload', chatId }, userId)
}

/** Risu `listenEdit("editRequest")`: let card Lua edit the outgoing prompt (e.g. random events). */
spindle.registerInterceptor(async (messages, context) => {
  try {
    const chat = await spindle.chats.get(context.chatId, context.userId).catch(() => null) as Record<string, any> | null
    const characterId = chat?.character_id
    if (!characterId) return messages
    // Cheap check first: only cards whose linked Lua listens to editRequest pay for the rest.
    const ch = await spindle.characters.get(characterId, context.userId).catch(() => null)
    const linkedMod = ((ch?.extensions ?? {}) as Record<string, any>).risubridge?.module as LinkedRisuData | undefined
    if (!linkedMod || !JSON.stringify(linkedMod.triggers ?? []).includes('editRequest')) return messages
    const { host, flush, mod } = await luaHostFor(context.chatId, characterId, context.userId, () => {})
    if (!mod) return messages
    const rt = loadLua(mod.triggers as RisuTrigger[], host)
    if (!rt || !rt.listeners.some((l) => l.kind === 'editRequest')) return messages
    const data = messages.map((m) => ({ role: m.role, content: typeof m.content === 'string' ? m.content : m.content }))
    const out = await rt.runListeners('editRequest', data)
    if (!context.isDryRun) await flush()
    if (!Array.isArray(out)) return messages
    return out.map((m: any, i: number) => ({ ...(messages[i] ?? {}), role: m?.role ?? messages[i]?.role ?? 'user', content: typeof m?.content === 'string' ? m.content : (messages[i]?.content ?? '') })) as typeof messages
  } catch (err) {
    spindle.log.warn(`[risubridge] editRequest failed: ${err instanceof Error ? err.message : String(err)}`)
    return messages
  }
}, 50)

async function setRegexOptOut(characterId: string, userId: string, off: boolean) {
  const ch = await spindle.characters.get(characterId, userId)
  if (!ch) return
  const ext = { ...((ch.extensions ?? {}) as Record<string, any>) }
  ext.risubridge = { ...(ext.risubridge ?? {}), regex: off ? false : true }
  await spindle.characters.update(characterId, { extensions: ext } as never, userId)
}

async function saveLink(characterId: string, userId: string, data: LinkedRisuData) {
  const ch = await spindle.characters.get(characterId, userId)
  if (!ch) return false
  const ext = { ...((ch.extensions ?? {}) as Record<string, any>) }
  const slim: LinkedRisuData = {
    triggers: Array.isArray(data.triggers) ? data.triggers : [],
    regex: (Array.isArray(data.regex) ? data.regex : []).map((r) => ({ comment: r.comment, in: r.in, type: r.type, flag: r.flag, ableFlag: r.ableFlag })),
    lowLevelAccess: Boolean(data.lowLevelAccess),
    cardName: String(data.cardName ?? ''),
    linkedAt: Date.now(),
  }
  ext.risubridge = { ...(ext.risubridge ?? {}), module: slim }
  await spindle.characters.update(characterId, { extensions: ext } as never, userId)
  cardCache.clear()
  if (ext.risubridge.regex !== false) await syncCharacterRegex(characterId, userId, true)
  return true
}

/** Original files seen in the import dialog, waiting for their character to appear. */
const pendingLinks = new Map<string, { data: LinkedRisuData; at: number }>()
const PENDING_MS = 5 * 60_000

async function tryPendingLinks(userId: string) {
  const mine = [...pendingLinks.entries()].filter(([k, v]) => k.startsWith(`${userId}:`) && Date.now() - v.at < PENDING_MS)
  for (const [k, v] of pendingLinks) if (Date.now() - v.at >= PENDING_MS) pendingLinks.delete(k)
  if (!mine.length) return
  const names = new Map(mine.map(([k, v]) => [v.data.cardName, k]))
  for (let offset = 0; offset < 2000 && names.size; offset += 100) {
    const page = await spindle.characters.list({ limit: 100, offset, userId }).catch(() => null)
    if (!page) return
    for (const ch of page.data) {
      const key = names.get(ch.name)
      if (!key) continue
      const ext = (ch.extensions ?? {}) as Record<string, any>
      // Only fresh imports: a Risu card that has no linked file yet.
      if (!ext.risuai || ext.risubridge?.module) continue
      const entry = pendingLinks.get(key)
      if (!entry) continue
      if (await saveLink(ch.id, userId, entry.data).catch(() => false)) {
        spindle.log.info(`[risubridge] linked original file automatically for ${ch.name}`)
        pendingLinks.delete(key)
        names.delete(ch.name)
      }
    }
    if (page.data.length < 100) break
  }
}

spindle.onFrontendMessage(async (payload, userId) => {
  const msg = (payload ?? {}) as Record<string, unknown>
  if (msg.type === 'pending_link' && msg.data && typeof msg.data === 'object') {
    // The viewer just picked a Risu card file (likely in Lumiverse's import dialog).
    const data = msg.data as LinkedRisuData
    if (!data.cardName) return
    pendingLinks.set(`${userId}:${data.cardName}`, { data, at: Date.now() })
    for (const delay of [3000, 10_000, 30_000, 90_000]) setTimeout(() => { void tryPendingLinks(userId) }, delay)
    return
  }
  if (msg.type === 'risu_prompt_reply' && typeof msg.id === 'string') {
    const resolve = pendingPrompts.get(msg.id)
    pendingPrompts.delete(msg.id)
    resolve?.(typeof msg.value === 'string' ? msg.value : null)
    return
  }
  const chatId = typeof msg.chatId === 'string' ? msg.chatId : ''
  // Trust only the chat id; the character comes from the chat itself.
  const chat = chatId ? await spindle.chats.get(chatId, userId).catch(() => null) : null
  const characterId = (chat as { character_id?: string } | null)?.character_id ?? ''
  if (!chat || !characterId) {
    spindle.sendToFrontend({ type: 'toggles_error', error: 'no_chat' }, userId)
    return
  }
  try {
    if (msg.type === 'risu_click' && typeof msg.value === 'string' && (msg.kind === 'btn' || msg.kind === 'trigger')) {
      await handleClick(chatId, characterId, userId, msg.kind, msg.value.slice(0, 2000))
      return
    }
    if (msg.type === 'link_original' && msg.data && typeof msg.data === 'object') {
      await saveLink(characterId, userId, msg.data as LinkedRisuData)
    } else if (msg.type === 'set_toggle' && typeof msg.key === 'string' && typeof msg.value === 'string') {
      await spindle.variables.chat.set(chatId, `toggle_${msg.key}`, msg.value)
    } else if (msg.type === 'reset_toggles') {
      const vars = await spindle.variables.chat.list(chatId)
      for (const k of Object.keys(vars)) if (k.startsWith('toggle_')) await spindle.variables.chat.delete(chatId, k)
    } else if (msg.type === 'regex_apply') {
      await setRegexOptOut(characterId, userId, false)
      await syncCharacterRegex(characterId, userId, true)
    } else if (msg.type === 'regex_revert') {
      await setRegexOptOut(characterId, userId, true)
      await revertCharacterRegex(characterId, userId)
    } else if (msg.type !== 'get_toggles') {
      return
    }
    spindle.sendToFrontend({ ...(await buildTogglesReply(chatId, characterId, userId)), changed: msg.type !== 'get_toggles' }, userId)
  } catch (err) {
    spindle.sendToFrontend({ type: 'toggles_error', error: err instanceof Error ? err.message : String(err) }, userId)
  }
})

spindle.registerMacroInterceptor(intercept, 10)
spindle.log.info('[risubridge] RisuAI CBS interpreter ready')
setTimeout(() => { void syncAll() }, 3000)
