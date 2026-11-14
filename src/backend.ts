/// <reference types="lumiverse-spindle-types" />
import type { MacroInterceptorCtxDTO, MacroInterceptorResultDTO, SpindleAPI } from 'lumiverse-spindle-types'
import { toggleLayout, type TogglesReply } from './toggles'
import { renderCbs, hasRisuSyntax, parseToggles, defaultToggleValue, parseDefaultVariables, type ToggleDef, type CbsPhase } from './cbs'

declare const spindle: SpindleAPI

interface RisuCardInfo {
  isRisu: boolean
  toggles: ToggleDef[]
  defaults: Record<string, string>
  fetchedAt: number
}

const CACHE_MS = 15_000
const cardCache = new Map<string, RisuCardInfo>()

async function cardInfo(characterId: string, userId: string | undefined): Promise<RisuCardInfo> {
  const key = `${userId ?? ''}:${characterId}`
  const hit = cardCache.get(key)
  if (hit && Date.now() - hit.fetchedAt < CACHE_MS) return hit
  let info: RisuCardInfo = { isRisu: false, toggles: [], defaults: {}, fetchedAt: Date.now() }
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
        fetchedAt: Date.now(),
      }
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
  if (!template.includes('{{') || !hasRisuSyntax(template)) return undefined

  const extra = (ctx.env.extra ?? {}) as Record<string, unknown>
  const characterId = typeof extra.characterId === 'string' ? extra.characterId : undefined
  if (!characterId) return undefined
  const info = await cardInfo(characterId, ctx.userId)
  if (!info.isRisu) return undefined

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
  })

  let text = result.text
  if (ctx.commit && ctx.phase !== 'prompt' && sets.length) {
    const last = new Map(sets)
    text += [...last].map(([k, v]) => persistMacro(k, v)).join('')
  }
  return { text, touchedVars: [...result.touched], volatile: result.volatile }
}

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
  }
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
