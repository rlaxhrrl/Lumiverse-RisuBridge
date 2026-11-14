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

export const SYNC_VERSION = 1

export interface ScriptFix {
  replace_string: string
  flags: string
  placement: string[]
  target: string | string[]
  substitute_macros: string
  disabled: boolean
  metadata: Record<string, unknown>
}

const HTML_RE = /<(?:div|span|img|section|details|table|p|ul|button|label|svg|a)\b|\{\{\s*(?:img|image|asset|emotion)::/i

/** Collect every `<style>` block from the card's backgroundHTML. */
export function backgroundStyles(backgroundHTML: string | undefined): string {
  if (!backgroundHTML) return ''
  return (backgroundHTML.match(/<style[\s\S]*?<\/style>/gi) ?? []).join('\n')
}

export function isRisuImported(s: ImportedScript): boolean {
  return (s.metadata as Record<string, unknown> | null | undefined)?.source === 'risuai_module'
}

export function alreadySynced(s: ImportedScript): boolean {
  const meta = (s.metadata ?? {}) as Record<string, any>
  return meta.risubridge?.version === SYNC_VERSION
}

/** Compute the Risu-faithful settings for one imported script. */
export function fixFor(s: ImportedScript, bgStyles: string): ScriptFix {
  const meta = { ...((s.metadata ?? {}) as Record<string, unknown>) }
  const type = String(meta.original_type ?? 'editdisplay')
  const original = (meta.risubridge as any)?.original ?? {
    replace_string: s.replace_string,
    flags: s.flags,
    placement: s.placement,
    target: s.target,
    substitute_macros: s.substitute_macros,
    disabled: s.disabled,
  }
  const out = original.replace_string as string

  let target = 'display'
  let placement = ['ai_output', 'user_input']
  if (type === 'editoutput') { target = 'response'; placement = ['ai_output'] }
  else if (type === 'editinput') { target = 'response'; placement = ['user_input'] }
  else if (type === 'editprocess') { target = 'prompt'; placement = ['ai_output', 'user_input'] }

  // Display HTML is rendered in an isolated island; carry the card's stylesheet into it,
  // which also keeps rules like `img { ... }` from leaking into the rest of Lumiverse.
  const withStyles = target === 'display' && bgStyles && HTML_RE.test(out) ? `${bgStyles}\n${out}` : out

  return {
    replace_string: withStyles,
    flags: 'g',
    placement,
    target,
    substitute_macros: 'raw',
    disabled: type === 'disabled',
    metadata: { ...meta, risubridge: { version: SYNC_VERSION, original } },
  }
}

/** Values that restore exactly what Lumiverse imported. */
export function revertFor(s: ImportedScript): Partial<ScriptFix> | null {
  const meta = { ...((s.metadata ?? {}) as Record<string, any>) }
  const original = meta.risubridge?.original
  if (!original) return null
  delete meta.risubridge
  return {
    replace_string: original.replace_string,
    flags: original.flags,
    placement: original.placement,
    target: original.target,
    substitute_macros: original.substitute_macros,
    disabled: original.disabled,
    metadata: meta,
  }
}
