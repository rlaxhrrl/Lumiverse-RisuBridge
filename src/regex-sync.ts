/**
 * Stage 3: make the RisuAI regex scripts that Lumiverse imported behave like they do in Risu.
 *
 * Lumiverse's importer reads Risu's `ableFlag` ("use custom flags") as "enabled", so most
 * working scripts arrive switched off and the ones the creator parked as `disabled` arrive
 * switched on. It also applies captures after macros and only to AI messages. We repair each
 * imported script in place and keep the original values so it can be restored.
 */

export interface ImportedScript {
  id: string
  name: string
  find_regex: string
  replace_string: string
  flags: string
  placement: string[]
  target: string[] | string
  substitute_macros: string
  disabled: boolean
  metadata?: Record<string, unknown> | null
  can_mutate?: boolean
}

import type { RisuRegexSource } from './risu-file'

export const SYNC_VERSION = 4

/** Number of capturing groups in a JS regex source. */
export function countGroups(src: string): number {
  let n = 0
  let inClass = false
  for (let i = 0; i < src.length; i++) {
    const c = src[i]
    if (c === '\\') { i++; continue }
    if (inClass) { if (c === ']') inClass = false; continue }
    if (c === '[') { inClass = true; continue }
    if (c !== '(') continue
    if (src[i + 1] !== '?') { n++; continue }
    if (src[i + 2] === '<' && src[i + 3] !== '=' && src[i + 3] !== '!') n++
  }
  return n
}

/**
 * Risu's `<move_top>` flag puts the replacement at the very top of the message.
 * Emulate it with one anchored match: (before)(match)(after) -> replacement + before + after.
 */
export function moveTop(find: string, out: string): { find: string; out: string } {
  const n = countGroups(find)
  const shifted = out.replace(/\$(\$|&|\d{1,2})/g, (m, g) => {
    if (g === '$') return '$$'
    if (g === '&') return '$2'
    return `$${Number(g) + 2}`
  })
  return { find: `^([\\s\\S]*?)(${find})([\\s\\S]*)$`, out: `${shifted}$1$${n + 3}` }
}

/** Flags Risu would actually use for this script. */
export function risuFlags(orig: RisuRegexSource | undefined): { flags: string; moveTop: boolean } {
  if (!orig || !orig.ableFlag || !orig.flag) return { flags: 'g', moveTop: false }
  const raw = orig.flag
  const moveTop = /<move_top>/i.test(raw)
  let letters = [...new Set(raw.replace(/<[^>]*>/g, '').replace(/[^gimsuy]/g, '').split(''))].join('')
  if (moveTop) letters = letters.replace(/[gm]/g, '')
  return { flags: letters, moveTop }
}

export interface ScriptFix {
  find_regex?: string
  replace_string: string
  flags: string
  placement: string[]
  target: string | string[]
  substitute_macros: string
  disabled: boolean
  metadata: Record<string, unknown>
}

const MACRO_RE = /\{\{|<(?:user|char|bot)>/i
const HTML_RE = /<(?:div|span|img|section|details|table|p|ul|button|label|svg|a)\b|\{\{\s*(?:img|image|asset|emotion)::/i

/** Collect every `<style>` block from the card's backgroundHTML. */
export function backgroundStyles(backgroundHTML: string | undefined): string {
  if (!backgroundHTML) return ''
  return (backgroundHTML.match(/<style[\s\S]*?<\/style>/gi) ?? []).join('\n')
}

export function isRisuImported(s: ImportedScript): boolean {
  return (s.metadata as Record<string, unknown> | null | undefined)?.source === 'risuai_module'
}

export function alreadySynced(s: ImportedScript, linked = false): boolean {
  const meta = (s.metadata ?? {}) as Record<string, any>
  return meta.risubridge?.version === SYNC_VERSION && (!linked || meta.risubridge?.linked === true)
}

/** Match an imported script to its entry in the original file (same order, same pattern). */
export function matchOriginal(s: ImportedScript, originals: RisuRegexSource[] | undefined): RisuRegexSource | undefined {
  if (!originals?.length) return undefined
  const meta = (s.metadata ?? {}) as Record<string, any>
  const find = meta.risubridge?.original?.find_regex ?? s.find_regex
  return originals.find((o) => o.in === find && (o.comment ?? '') === s.name.replace(/^Imported RisuAI Script \d+$/, ''))
    ?? originals.find((o) => o.in === find)
}

/** Compute the Risu-faithful settings for one imported script. */
export function fixFor(s: ImportedScript, bgStyles: string, orig?: RisuRegexSource): ScriptFix {
  const meta = { ...((s.metadata ?? {}) as Record<string, unknown>) }
  const type = String(meta.original_type ?? 'editdisplay')
  const original = (meta.risubridge as any)?.original ?? {
    replace_string: s.replace_string,
    flags: s.flags,
    placement: s.placement,
    target: s.target,
    substitute_macros: s.substitute_macros,
    disabled: s.disabled,
    find_regex: s.find_regex,
  }
  // Risu prefixes every class/id with `x-risu-` in both HTML and CSS; creators sometimes
  // write the prefix by hand. Drop it everywhere so HTML and CSS keep matching here.
  const unprefix = (t: string) => t.replace(/x-risu-/g, '')
  const out = unprefix(original.replace_string as string)
  bgStyles = unprefix(bgStyles)

  let target = 'display'
  let placement = ['ai_output', 'user_input']
  if (type === 'editoutput') { target = 'response'; placement = ['ai_output'] }
  else if (type === 'editinput') { target = 'response'; placement = ['user_input'] }
  else if (type === 'editprocess') { target = 'prompt'; placement = ['ai_output', 'user_input'] }

  // Display HTML is rendered in an isolated island; carry the card's stylesheet into it,
  // which also keeps rules like `img { ... }` from leaking into the rest of Lumiverse.
  const css = target === 'display' && bgStyles && HTML_RE.test(out) ? cssFor(bgStyles, out) : ''
  const withStyles = css ? `${css}\n${out}` : out
  const f = risuFlags(orig)
  const moved = f.moveTop ? moveTop(original.find_regex ?? s.find_regex, withStyles) : null

  return {
    ...(moved ? { find_regex: moved.find } : original.find_regex && original.find_regex !== s.find_regex ? { find_regex: original.find_regex } : {}),
    replace_string: moved ? moved.out : withStyles,
    flags: f.flags,
    placement,
    target,
    // Macro passes are the expensive part of display rendering; only pay for them when
    // the script actually contains macros. Plain scripts then run in the browser worker.
    substitute_macros: MACRO_RE.test(moved ? moved.out : withStyles) || MACRO_RE.test(original.find_regex ?? s.find_regex) ? 'raw' : 'none',
    disabled: type === 'disabled',
    metadata: { ...withoutQuarantine(meta), risubridge: { version: SYNC_VERSION, original, linked: Boolean(orig) } },
  }
}

/** A repaired script gets a fresh start: drop a quarantine earned by its old, heavier form. */
function withoutQuarantine(meta: Record<string, unknown>): Record<string, unknown> {
  const ev = meta.regex_evidence as Record<string, unknown> | undefined
  if (!ev || typeof ev !== 'object' || !('quarantined' in ev)) return meta
  const { quarantined: _q, ...rest } = ev
  return { ...meta, regex_evidence: rest }
}

/** Values that restore exactly what Lumiverse imported. */
export function revertFor(s: ImportedScript): Partial<ScriptFix> | null {
  const meta = { ...((s.metadata ?? {}) as Record<string, any>) }
  const original = meta.risubridge?.original
  if (!original) return null
  delete meta.risubridge
  return {
    ...(original.find_regex ? { find_regex: original.find_regex } : {}),
    replace_string: original.replace_string,
    flags: original.flags,
    placement: original.placement,
    target: original.target,
    substitute_macros: original.substitute_macros,
    disabled: original.disabled,
    metadata: meta,
  }
}

/**
 * Keep only the stylesheet rules a replacement can actually use. Cards often ship one big
 * stylesheet for everything; copying all of it into every match (e.g. each chat line)
 * makes messages huge and slow to render. A rule is kept when it has no class/id
 * selector, or when one of its classes/ids appears anywhere in the replacement.
 */
export function cssFor(styles: string, out: string): string {
  if (!styles) return ''
  const words = new Set(out.match(/[A-Za-z_][\w-]*/g) ?? [])
  const keepSelector = (sel: string) => {
    const names = sel.match(/[.#]([A-Za-z_][\w-]*)/g)
    if (!names) return true
    return names.some((n) => words.has(n.slice(1)))
  }
  const filterBlock = (css: string): string => {
    let outCss = ''
    let i = 0
    while (i < css.length) {
      const open = css.indexOf('{', i)
      if (open < 0) { outCss += css.slice(i); break }
      const head = css.slice(i, open)
      // find matching close brace
      let depth = 1, j = open + 1
      while (j < css.length && depth > 0) { if (css[j] === '{') depth++; else if (css[j] === '}') depth--; j++ }
      const body = css.slice(open + 1, j - 1)
      const h = head.trim()
      if (h.startsWith('@media') || h.startsWith('@supports') || h.startsWith('@container')) {
        const inner = filterBlock(body)
        if (inner.trim()) outCss += `${head}{${inner}}`
      } else if (h.startsWith('@')) {
        outCss += `${head}{${body}}` // @font-face, @keyframes, @import ... keep
      } else if (h.split(',').some(keepSelector)) {
        outCss += `${head}{${body}}`
      }
      i = j
    }
    return outCss
  }
  return styles.replace(/<style([^>]*)>([\s\S]*?)<\/style>/gi, (_m, attrs, css) => {
    const kept = filterBlock(css)
    return kept.trim() ? `<style${attrs}>${kept}</style>` : ''
  }).trim()
}
