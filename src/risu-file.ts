/** RisuAI card/module file reading (runs in the browser when the user links the original file). */
import { unzipSync } from 'fflate'

// RPack byte table used by RisuAI's .risum format.
const RPACK_DECODE_MAP = new Uint8Array([
  0x2c,0xf7,0x84,0x8b,0xc9,0x65,0xfb,0xb6,0x9f,0xae,0xb3,0x03,0x2d,0x01,0x69,0x74,
  0x1f,0xe4,0xa3,0xec,0xee,0x5c,0x34,0x21,0x93,0x4a,0x0f,0x6a,0xe2,0x62,0x02,0x9e,
  0x22,0x9c,0xfd,0x3c,0xfc,0x71,0xc7,0xc6,0xad,0x59,0x67,0x05,0x70,0x6d,0x8a,0x44,
  0x12,0xfa,0x24,0x86,0x5f,0xaf,0xd1,0x7a,0x47,0xce,0xfe,0x50,0x63,0xdd,0x51,0x06,
  0x6f,0x18,0xe0,0x52,0xa8,0x09,0x9d,0x56,0x73,0x4c,0xb8,0x53,0x6c,0xc3,0xa0,0x0e,
  0x19,0xcf,0x3e,0x0d,0x7e,0x07,0x32,0x68,0x46,0xea,0x48,0xf9,0x99,0x2e,0xab,0xa4,
  0x49,0x20,0x5e,0x55,0x35,0x38,0x0c,0xbc,0xd3,0xb1,0x58,0x16,0x79,0x28,0x0a,0x1a,
  0xe1,0xf2,0xcd,0xc4,0x39,0xdb,0xa2,0xba,0x60,0x72,0x76,0x7d,0x95,0xef,0x7f,0xc8,
  0xc0,0xde,0x37,0x94,0xbf,0xb5,0x14,0x81,0x92,0x25,0x45,0xac,0xe7,0xf5,0x66,0xa7,
  0x2b,0x36,0x5a,0xc1,0x13,0xe3,0x4b,0x3a,0xe8,0x8d,0x83,0x1b,0x7c,0x27,0xb0,0x9a,
  0x42,0xeb,0x87,0xaa,0xdc,0x54,0x8e,0x78,0x26,0xd2,0x57,0x29,0xd4,0xb7,0xf8,0x2f,
  0x8f,0x89,0x75,0xf0,0x41,0x77,0xc2,0x1e,0xff,0xd8,0x15,0x11,0xe5,0x04,0x97,0x17,
  0xf3,0x31,0xd0,0x9b,0x00,0xd7,0xca,0xb4,0x4f,0x2a,0x3b,0xd9,0xb2,0x6b,0xda,0x5d,
  0xa1,0x3f,0x30,0x61,0xbd,0x91,0x3d,0x4e,0xe6,0xdf,0xbe,0x4d,0x82,0x8c,0x1d,0x23,
  0x10,0x98,0x64,0xf4,0x85,0x33,0x7b,0x90,0x43,0xbb,0xa9,0x88,0xf1,0xd6,0xa5,0x1c,
  0xf6,0xcc,0x6e,0xb9,0x5b,0x0b,0x96,0xed,0xd5,0xe9,0xc5,0xcb,0x08,0xa6,0x80,0x40,
]);


export interface RisuRegexSource {
  comment?: string
  in: string
  out?: string
  type?: string
  flag?: string
  ableFlag?: boolean
}

/** What the extension keeps from the original file: things Lumiverse's importer drops. */
export interface LinkedRisuData {
  triggers: unknown[]
  regex: RisuRegexSource[]
  lowLevelAccess: boolean
  cardName: string
  linkedAt: number
}

function decodeRisum(data: Uint8Array): Record<string, any> | null {
  if (data.length < 7 || data[0] !== 111 || data[1] !== 0) return null
  const len = new DataView(data.buffer, data.byteOffset, data.byteLength).getUint32(2, true)
  if (6 + len > data.length) return null
  const enc = data.subarray(6, 6 + len)
  const out = new Uint8Array(enc.length)
  for (let i = 0; i < enc.length; i++) out[i] = RPACK_DECODE_MAP[enc[i]]
  try {
    const parsed = JSON.parse(new TextDecoder().decode(out))
    return parsed?.type === 'risuModule' ? parsed.module : null
  } catch { return null }
}

function zipStart(bytes: Uint8Array): number {
  for (let i = 0; i < bytes.length - 3; i++) {
    if (bytes[i] === 0x50 && bytes[i + 1] === 0x4b && bytes[i + 2] === 3 && bytes[i + 3] === 4) return i
  }
  return -1
}

function pngCardJson(bytes: Uint8Array): Record<string, any> | null {
  if (!(bytes[0] === 0x89 && bytes[1] === 0x50)) return null
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength)
  let pos = 8
  let chara: string | null = null
  while (pos + 8 < bytes.length) {
    const len = view.getUint32(pos)
    const type = String.fromCharCode(...bytes.subarray(pos + 4, pos + 8))
    if (type === 'tEXt') {
      const body = bytes.subarray(pos + 8, pos + 8 + len)
      const nul = body.indexOf(0)
      const key = new TextDecoder().decode(body.subarray(0, nul))
      const val = new TextDecoder('latin1').decode(body.subarray(nul + 1))
      if (key === 'ccv3') chara = val
      else if (key === 'chara' && !chara) chara = val
    }
    if (type === 'IEND') break
    pos += 12 + len
  }
  if (!chara) return null
  try {
    const bin = atob(chara)
    const u8 = Uint8Array.from(bin, (c) => c.charCodeAt(0))
    return JSON.parse(new TextDecoder().decode(u8))
  } catch { return null }
}

/** Read a .charx / .jpeg (charx polyglot) / .png RisuAI card and keep its triggers and regex. */
export function readRisuFile(bytes: Uint8Array): LinkedRisuData | { error: string } {
  let card: Record<string, any> | null = null
  let mod: Record<string, any> | null = null
  const start = zipStart(bytes)
  if (start >= 0) {
    try {
      const files = unzipSync(bytes.subarray(start), { filter: (f) => f.name === 'card.json' || f.name === 'module.risum' })
      if (files['card.json']) card = JSON.parse(new TextDecoder().decode(files['card.json']))
      if (files['module.risum']) mod = decodeRisum(files['module.risum'])
    } catch { /* fall through */ }
  }
  if (!card) card = pngCardJson(bytes)
  if (!card) return { error: '리스 카드 파일이 아니에요 (.charx / .png / .jpeg 원본을 골라 주세요).' }
  const data = card.data ?? card
  const risu = data?.extensions?.risuai ?? {}
  const triggers = [...(Array.isArray(mod?.trigger) ? mod!.trigger : []), ...(Array.isArray(risu.triggerscript) ? risu.triggerscript : [])]
  const regex = [...(Array.isArray(mod?.regex) ? mod!.regex : []), ...(Array.isArray(risu.customScripts) ? risu.customScripts : [])]
  return {
    triggers,
    regex: regex.map((r: any) => ({ comment: r.comment, in: r.in, out: r.out, type: r.type, flag: r.flag, ableFlag: r.ableFlag })),
    lowLevelAccess: Boolean(mod?.lowLevelAccess || risu.lowLevelAccess),
    cardName: String(data?.name ?? ''),
    linkedAt: Date.now(),
  }
}
