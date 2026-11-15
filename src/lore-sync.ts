/**
 * Make a Risu card's lorebook activate the way it does in RisuAI.
 *
 * Lumiverse imports the entries but not Risu's activation rules:
 *  - Risu only scans the last N messages (the card's `scan_depth`, default 5); Lumiverse scans
 *    the whole chat by default, so a `/command` typed once keeps its entry active forever.
 *  - Risu `@@decorators` (`@@depth 0`, `@@scan_depth 1`, `@@role`, ...) at the start of an
 *    entry are not understood and get sent to the model as plain text.
 *
 * Each repaired entry keeps the values Lumiverse imported so the change can be undone.
 */

export const LORE_SYNC_VERSION = 2
/** RisuAI's default lorebook scan depth when the card does not set one. */
export const RISU_DEFAULT_SCAN_DEPTH = 5

export interface LoreEntry {
  id: string
  key: string[]
  keysecondary: string[]
  content: string
  comment: string
  position: number
  depth: number
  role: string | null
  constant: boolean
  disabled: boolean
  selective: boolean
  selective_logic: number
  scan_depth: number | null
  probability: number
  use_probability: boolean
  match_whole_words: boolean
  prevent_recursion: boolean
  extensions: Record<string, unknown>
}

export interface CardLoreEntry {
  content?: string
  comment?: string
  name?: string
  keys?: string[]
}

export type LoreUpdate = Partial<Omit<LoreEntry, 'id'>>

const FIELDS = ['content', 'position', 'depth', 'role', 'constant', 'disabled', 'selective', 'keysecondary',
  'selective_logic', 'scan_depth', 'probability', 'use_probability', 'match_whole_words', 'prevent_recursion'] as const

const DECORATOR_LINE = /^@@@?([a-z_]+)(?:[ \t]+(.*))?$/

export interface Decorators {
  depth?: number
  scanDepth?: number
  role?: 'system' | 'user' | 'assistant'
  activate?: boolean
  dontActivate?: boolean
  recursive?: boolean
  probability?: number
  fullWord?: boolean
  additionalKeys?: string[]
  excludeKeys?: string[]
  excludeAll?: boolean
}

/** Split Risu decorator lines off the content. Unknown decorators are dropped like Risu does. */
export function parseDecorators(content: string): { decorators: Decorators; content: string; found: boolean } {
  const d: Decorators = {}
  const kept: string[] = []
  let found = false
  for (const line of content.split('\n')) {
    const m = DECORATOR_LINE.exec(line.trim())
    if (!m || !line.trimStart().startsWith('@@')) { kept.push(line); continue }
    found = true
    const name = m[1]
    const args = (m[2] ?? '').split(',').map((a) => a.trim()).filter(Boolean)
    const int = parseInt(args[0] ?? '', 10)
    switch (name) {
      case 'depth': if (!Number.isNaN(int)) d.depth = int; break
      case 'end': d.depth = 0; break
      case 'scan_depth': if (!Number.isNaN(int)) d.scanDepth = int; break
      case 'role': if (args[0] === 'system' || args[0] === 'user' || args[0] === 'assistant') d.role = args[0]; break
      case 'activate': d.activate = true; break
      case 'dont_activate': d.dontActivate = true; break
      case 'recursive': d.recursive = true; break
      case 'unrecursive': d.recursive = false; break
      case 'probability': if (!Number.isNaN(int)) d.probability = int; break
      case 'match_full_word': d.fullWord = true; break
      case 'match_partial_word': d.fullWord = false; break
      case 'additional_keys': d.additionalKeys = args; break
      case 'exclude_keys': d.excludeKeys = args; break
      case 'exclude_keys_all': d.excludeKeys = args; d.excludeAll = true; break
      default: break
    }
  }
  // Decorators sit on top; drop the blank lines they leave behind.
  while (found && kept.length && kept[0].trim() === '') kept.shift()
  return { decorators: d, content: kept.join('\n'), found }
}

export function isLoreSynced(e: LoreEntry): boolean {
  return (e.extensions?.risubridge as any)?.version === LORE_SYNC_VERSION
}

/** Find the card's original entry for an imported Lumiverse entry. */
export function matchCardEntry(e: LoreEntry, card: CardLoreEntry[]): CardLoreEntry | undefined {
  const content = ((e.extensions?.risubridge as any)?.original?.content as string | undefined) ?? e.content
  return card.find((c) => (c.content ?? '') === content && (c.comment ?? c.name ?? '') === (e.comment ?? ''))
    ?? card.find((c) => (c.content ?? '') === content)
}

/** Settings that make one imported entry behave like it does in Risu, or null if nothing changes. */
export function loreFixFor(e: LoreEntry, cardScanDepth: number | undefined, cardRecursive?: boolean): LoreUpdate | null {
  const original = (e.extensions?.risubridge as any)?.original ?? Object.fromEntries(FIELDS.map((f) => [f, e[f]]))
  const base = { ...e, ...original } as LoreEntry
  const { decorators: d, content } = parseDecorators(base.content)
  const out: LoreUpdate = {}

  if (content !== base.content) out.content = content
  if (d.depth !== undefined) { out.position = 4; out.depth = d.depth }
  if (d.role) out.role = d.role
  if (d.activate) out.constant = true
  if (d.dontActivate) out.disabled = true
  if (d.recursive !== undefined) out.prevent_recursion = !d.recursive
  // Risu only scans lorebook text for more keywords when the card turns recursive scanning on.
  else if (cardRecursive === false) out.prevent_recursion = true
  if (d.probability !== undefined) { out.use_probability = true; out.probability = Math.max(0, Math.min(100, d.probability)) }
  if (d.fullWord !== undefined) out.match_whole_words = d.fullWord
  // Lumiverse has one secondary key list; only map it when the entry does not use one already.
  if (!base.selective || base.keysecondary.length === 0) {
    if (d.additionalKeys?.length) { out.selective = true; out.keysecondary = d.additionalKeys; out.selective_logic = 2 }
    else if (d.excludeKeys?.length) { out.selective = true; out.keysecondary = d.excludeKeys; out.selective_logic = d.excludeAll ? 3 : 1 }
  }
  // Risu only looks at the last few messages. Keep a depth the user already set by hand.
  if (base.scan_depth === null || base.scan_depth === undefined) {
    const depth = d.scanDepth ?? (cardScanDepth && cardScanDepth > 0 ? cardScanDepth : RISU_DEFAULT_SCAN_DEPTH)
    out.scan_depth = Math.max(1, depth)
  }

  const changed = Object.entries(out).some(([k, v]) => JSON.stringify((e as any)[k]) !== JSON.stringify(v))
  if (!changed && isLoreSynced(e)) return null
  return {
    ...out,
    extensions: { ...(e.extensions ?? {}), risubridge: { version: LORE_SYNC_VERSION, original } },
  }
}

/** Values that restore what Lumiverse imported. */
export function loreRevertFor(e: LoreEntry): LoreUpdate | null {
  const rb = (e.extensions?.risubridge as any)
  if (!rb?.original) return null
  const { risubridge: _drop, ...rest } = e.extensions
  return { ...rb.original, extensions: rest }
}
