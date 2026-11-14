/** Shared between backend and frontend: the toggle panel layout of a Risu card. */

export type ToggleRow =
  | { kind: 'group'; label: string }
  | { kind: 'divider'; label: string }
  | { kind: 'caption'; label: string }
  | { kind: 'select'; key: string; label: string; options: string[]; value: string; isDefault: boolean }
  | { kind: 'checkbox'; key: string; label: string; value: string; isDefault: boolean }
  | { kind: 'text'; key: string; label: string; value: string; isDefault: boolean }

/** Parse Risu's toggle text into rows, filling in each toggle's current value. */
export function toggleLayout(src: string, current: (key: string) => string | undefined): ToggleRow[] {
  const rows: ToggleRow[] = []
  for (const line of (src || '').split('\n')) {
    const parts = line.split('=')
    if (parts.length < 2) continue
    const key = parts[0].trim()
    const label = parts[1]
    const type = (parts[2] ?? '').trim().toLowerCase()
    if (!key) {
      if (type === 'group' || type === 'divider' || type === 'caption') rows.push({ kind: type, label })
      continue
    }
    const v = current(key)
    if (type === 'select') {
      const options = (parts.slice(3).join('=') || '').split(',')
      rows.push({ kind: 'select', key, label, options, value: v ?? '0', isDefault: v === undefined })
    } else if (type === 'text' || type === 'textarea') {
      rows.push({ kind: 'text', key, label, value: v ?? '', isDefault: v === undefined })
    } else if (type === 'group' || type === 'groupend' || type === 'divider' || type === 'caption') {
      continue
    } else {
      rows.push({ kind: 'checkbox', key, label, value: v ?? '0', isDefault: v === undefined })
    }
  }
  return rows
}

export interface TogglesReply {
  type: 'toggles'
  chatId: string
  characterName: string
  isRisu: boolean
  rows: ToggleRow[]
}
