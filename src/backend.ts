/// <reference types="lumiverse-spindle-types" />
import type { MacroInterceptorCtxDTO, MacroInterceptorResultDTO, SpindleAPI } from 'lumiverse-spindle-types'
import { toggleLayout, type TogglesReply } from './toggles'
import { alreadySynced, backgroundStyles, fixFor, isRisuImported, revertFor, type ImportedScript } from './regex-sync'
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

async function intercept(ctx: MacroInterceptorCtxDTO): Promise<MacroInterceptorResultDTO> {
  const template = ctx.template
  if (!template.includes('{{')) return undefined

  const extra = (ctx.env.extra ?? {}) as Record<string, unknown>
  const characterId = typeof extra.characterId === 'string' ? extra.characterId : undefined
  if (!characterId) return undefined
  // Looked up (cached) even without Risu syntax so the card's regex gets repaired early.
  const info = await cardInfo(characterId, ctx.userId)
  if (!info.isRisu || !hasRisuSyntax(template)) return undefined

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
const SYNC_EVERY_MS = 60_000

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
  if (!ext.risuai || ext.risubridge?.regex === false) return 0
  const styles = backgroundStyles(ext.risuai.backgroundHTML)
  let fixed = 0
  for (const s of await characterScripts(characterId, userId)) {
    if (!force && alreadySynced(s)) continue
    if (s.can_mutate === false) continue
    const fix = fixFor(s, styles)
    await spindle.regex_scripts.update(s.id, fix as never, userId)
    fixed++
  }
  if (fixed) spindle.log.info(`[risubridge] repaired ${fixed} Risu regex script(s) for ${ch?.name ?? characterId}`)
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
  return { total: all.length, synced: all.filter(alreadySynced).length, active: all.filter((s) => alreadySynced(s) && !s.disabled).length }
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
  }
}

async function setRegexOptOut(characterId: string, userId: string, off: boolean) {
  const ch = await spindle.characters.get(characterId, userId)
  if (!ch) return
  const ext = { ...((ch.extensions ?? {}) as Record<string, any>) }
  ext.risubridge = { ...(ext.risubridge ?? {}), regex: off ? false : true }
  await spindle.characters.update(characterId, { extensions: ext } as never, userId)
}

spindle.onFrontendMessage(async (payload, userId) => {
  const msg = (payload ?? {}) as Record<string, unknown>
  const chatId = typeof msg.chatId === 'string' ? msg.chatId : ''
  // Trust only the chat id; the character comes from the chat itself.
  const chat = chatId ? await spindle.chats.get(chatId, userId).catch(() => null) : null
  const characterId = (chat as { character_id?: string } | null)?.character_id ?? ''
  if (!chat || !characterId) {
    spindle.sendToFrontend({ type: 'toggles_error', error: 'no_chat' }, userId)
    return
  }
  try {
    if (msg.type === 'set_toggle' && typeof msg.key === 'string' && typeof msg.value === 'string') {
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
    spindle.sendToFrontend(await buildTogglesReply(chatId, characterId, userId), userId)
  } catch (err) {
    spindle.sendToFrontend({ type: 'toggles_error', error: err instanceof Error ? err.message : String(err) }, userId)
  }
})

spindle.registerMacroInterceptor(intercept, 10)
spindle.log.info('[risubridge] RisuAI CBS interpreter ready')
setTimeout(() => { void syncAll() }, 3000)
