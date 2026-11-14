import { describe, expect, test } from 'bun:test'
import { existsSync } from 'node:fs'
import { renderCbs, parseToggles, defaultToggleValue, evalMath, hasRisuSyntax, type CbsEnv } from '../src/cbs'

const base = (over: Partial<CbsEnv> = {}, vars: Record<string, string> = {}, toggles: Record<string, string> = {}): CbsEnv => ({
  phase: 'display',
  getChatVar: (k) => vars[k],
  toggle: (k) => toggles[k] ?? '0',
  names: { user: 'U', char: 'C' },
  chatIndex: 0,
  lastMessageId: 0,
  ...over,
})
const r = (src: string, env = base()) => renderCbs(src, env).text

describe('blocks', () => {
  test('#when keeps inline spacing and supports toggle ops', () => {
    expect(r('Luan{{#when::lu::tis::1}} (루안){{/}}!', base({}, {}, { lu: '1' }))).toBe('Luan (루안)!')
    expect(r('Luan{{#when::lu::tis::1}} (루안){{/}}!')).toBe('Luan!')
    expect(r('{{#when::x::vis::a}}A{{:else}}B{{/when}}', base({}, { x: 'a' }))).toBe('A')
    expect(r('{{#when::not::{{getvar::x}}}}N{{/}}')).toBe('N')
    expect(r('{{#when::1::and::0}}Y{{:else}}N{{/}}')).toBe('N')
    expect(r('{{#when::5::>::3}}Y{{/}}')).toBe('Y')
  })
  test('#if trims, #if_pure keeps whitespace, nested', () => {
    expect(r('{{#if {{? 3>2}}}}\n   yes\n{{:else}}no{{/if}}')).toBe('yes')
    expect(r('{{#if_pure 1}}\n  a {{/if_pure}}')).toBe('\n  a ')
    expect(r('{{#if 1}}{{#if 0}}x{{/}}y{{/}}')).toBe('y')
  })
  test('#each, slot, filter, spread, random', () => {
    expect(r('{{#each ["a","b"] as it}} [{{slot::it}}] {{/each}}')).toBe('[a][b]')
    const env = base({ assetNames: () => ['Human.happy.1', 'Wolf.x', 'Human.happy.2'], assetUrl: (n) => `u/${n}`, random: () => 0.99 })
    expect(r('{{img::{{random::{{spread::{{filter::{{split::{{#each {{assetlist}} a}} {{#if {{startswith::{{slot::a}}::Human.happy}}}} {{slot::a}}$$ {{/if}} {{/each}}::$$}}}}}}}}}}', env))
      .toBe('<img src="u/Human.happy.2" alt="Human.happy.2" class="risu-asset">')
  })
  test('#func / call / arg', () => {
    expect(r('{{#func f}}{{#if {{calc:: {{arg::1}} <= 30 }} }}low{{/if}}{{#if {{calc:: {{arg::1}} > 30 }} }}high{{/if}}{{/func}}[{{call::f::{{? {{getvar::v}}??50}}}}]')).toBe('[high]')
    expect(r('{{#func f}}{{arg::1}}{{/func}}{{call::f::7}}')).toBe('7')
  })
})

describe('values', () => {
  test('variables, defaults and setvar', () => {
    const sets: string[] = []
    const env = base({ defaultVariables: { hp: '10' }, onSetChatVar: (k, v) => sets.push(`${k}=${v}`) }, { mp: '3' })
    expect(r('{{getvar::hp}}/{{getvar::mp}}/{{getvar::none}}', env)).toBe('10/3/null')
    expect(r('{{addvar::hp::5}}{{getvar::hp}}{{setvar::s::a::b}}{{getvar::s}}', env)).toBe('15a::b')
    expect(sets).toEqual(['hp=15', 's=a::b'])
  })
  test('tempvars, split, arrayelement, trim, lower', () => {
    const env = base({ previousCharChat: 'x |NPC: 수인 Wolf] y' })
    expect(r('{{settempvar::s::{{trim::{{arrayelement::{{split::{{arrayelement::{{split::{{previouscharchat}}::|NPC:}}::1}}::]}}::0}}}}}}{{lower::{{gettempvar::s}}}}', env)).toBe('수인 wolf')
  })
  test('comparisons and math', () => {
    expect(r('{{equal::a::a}}{{not_equal::a::a}}{{greater_equal::3::3}}{{all::1::1}}{{any::0::0}}{{contains::abc::b}}')).toBe('101101')
    expect(evalMath('1+2*3')).toBe('7')
    expect(evalMath('(2>1) && (3<1)')).toBe('0')
    expect(evalMath('null??50')).toBe('50')
    expect(evalMath('7/2')).toBe('3.5')
  })
  test('toggles via getglobalvar, hiddenkey by phase', () => {
    expect(r('{{getglobalvar::toggle_job}}', base({}, {}, { job: '2' }))).toBe('2')
    expect(r('a{{hiddenkey::k}}b')).toBe('ab')
    expect(r('a{{hiddenkey::k}}b', base({ phase: 'prompt' }))).toBe('a<!-- k -->b')
  })
  test('host macros are left for Lumiverse', () => {
    expect(r('{{time::HH:mm}} {{trim}} {{user}} {{getvar::x}}', base({}, { x: '1' }))).toBe('{{time::HH:mm}} {{trim}} U 1')
    expect(hasRisuSyntax('{{time::HH:mm}} {{user}}')).toBe(false)
    expect(hasRisuSyntax('{{#when::a}}x{{/}}')).toBe(true)
  })
  test('toggle definitions', () => {
    const defs = parseToggles('=G=group\nk=Job=select=a,b\n=cap=caption\nh=Korean\nt=Name=text')
    expect(defs.map((d) => `${d.key}:${d.type}:${d.options.length}`)).toEqual(['k:select:2', 'h:checkbox:0', 't:text:0'])
    expect(defaultToggleValue(defs[0])).toBe('0')
  })
})

// Real-card regression: original Luan card rendered with its toggles must equal the
// version that was baked and checked by hand earlier (ignoring outer whitespace).
const LUAN = '/home/claude/cards/luan.json'
const LUAN_REF = '/home/claude/cards/conv_Luan/card.json'
const LUAN_MOD = '/home/claude/cards/luan.module.json'
describe.skipIf(!existsSync(LUAN) || !existsSync(LUAN_REF) || !existsSync(LUAN_MOD))('Luan card regression', () => {
  test('description, post-history and every lorebook entry', async () => {
    const o = (await Bun.file(LUAN).json()).data
    const ref = (await Bun.file(LUAN_REF).json()).data
    const mod = await Bun.file(LUAN_MOD).json()
    const defs = parseToggles(o.extensions.risuai.toggles)
    const env = base({ phase: 'prompt', names: { user: '{{user}}', char: '{{char}}' }, toggle: (k) => (k === 'lu-hanchul' ? '1' : defaultToggleValue(defs.find((d) => d.key === k))) })
    expect(r(o.description, env)).toBe(ref.description)
    expect(r(o.post_history_instructions, env).trim()).toBe(ref.post_history_instructions.trim())
    const src = [...o.character_book.entries, ...mod.lorebook]
    let checked = 0
    for (const e of ref.character_book.entries) {
      const s = src.find((x: any) => (x.comment || x.name) === (e.comment || e.name))
      if (!s) continue
      expect(r(s.content, env).trim()).toBe(e.content.trim())
      checked++
    }
    expect(checked).toBeGreaterThan(15)
  })
})

import { toggleLayout } from '../src/toggles'
describe('toggle panel layout', () => {
  test('keeps headers and captions, fills current values', () => {
    const rows = toggleLayout('=⭐=group\nk=Job=select=a,b,c\n=hint=caption\n=More=divider\nh=Korean\nt=Name=text', (k) => (k === 'k' ? '2' : undefined))
    expect(rows.map((r) => r.kind)).toEqual(['group', 'select', 'caption', 'divider', 'checkbox', 'text'])
    expect(rows[1]).toMatchObject({ value: '2', isDefault: false, options: ['a', 'b', 'c'] })
    expect(rows[4]).toMatchObject({ value: '0', isDefault: true })
  })
})

import { fixFor, revertFor, backgroundStyles, alreadySynced } from '../src/regex-sync'
describe('Risu regex repair', () => {
  const base = { id: 'x', name: 'n', find_regex: 'a', flags: 'gs', placement: ['ai_output'], target: ['display'], substitute_macros: 'none' }
  test('turns working scripts on, keeps creator-disabled ones off, maps targets', () => {
    const d = fixFor({ ...base, replace_string: '<div class="s">$1</div>', disabled: true, metadata: { source: 'risuai_module', original_type: 'editdisplay' } }, '<style>.s{}</style>')
    expect(d).toMatchObject({ disabled: false, target: 'display', flags: 'g', substitute_macros: 'none', placement: ['ai_output', 'user_input'] })
    expect(d.replace_string).toBe('<style>.s{}</style>\n<div class="s">$1</div>')
    const off = fixFor({ ...base, replace_string: 'x', disabled: false, metadata: { source: 'risuai_module', original_type: 'disabled' } }, '')
    expect(off.disabled).toBe(true)
    expect(fixFor({ ...base, replace_string: 'y', disabled: true, metadata: { original_type: 'editprocess' } }, '').target).toBe('prompt')
    expect(fixFor({ ...base, replace_string: 'y', disabled: true, metadata: { original_type: 'editoutput' } }, '').target).toBe('response')
  })
  test('plain-text output gets no stylesheet; revert restores the import', () => {
    const s = { ...base, replace_string: ']', disabled: true, metadata: { source: 'risuai_module', original_type: 'editdisplay' } }
    const d = fixFor(s, '<style>x</style>')
    expect(d.replace_string).toBe(']')
    const synced = { ...s, ...d, target: [d.target as string] }
    expect(alreadySynced(synced)).toBe(true)
    expect(revertFor(synced)).toMatchObject({ replace_string: ']', flags: 'gs', disabled: true, substitute_macros: 'none' })
    expect(backgroundStyles('<style>a</style><div></div><style>b</style>')).toBe('<style>a</style>\n<style>b</style>')
  })
})

import { RisuLua } from '../src/lua'
import { runSimpleTrigger, findManualTrigger } from '../src/triggers'
describe('Lua and triggers', () => {
  const mkHost = (vars: Record<string, string>) => ({
    getChatVar: (k: string) => vars[k] ?? 'null', setChatVar: (k: string, v: string) => { vars[k] = v }, getGlobalVar: () => 'null',
    prompt: async () => 'typed', userLastMessage: () => '', charLastMessage: () => '', names: { user: 'U', char: 'C' }, reloadDisplay: () => {}, log: () => {},
  })
  test('functions, onButtonClick with async + alertInput:await()', async () => {
    const vars: Record<string, string> = {}
    const rt = new RisuLua(mkHost(vars))
    expect(rt.load(`
      function pick(id) setChatVar(id, "lang", "en") end
      onButtonClick = async(function(id, code)
        local v = alertInput(id, "say"):await()
        setChatVar(id, "btn", code .. ":" .. v)
      end)
      listenEdit("editRequest", function(id, data) data[#data].content = data[#data].content .. "!" ; return data end)`)).toBe(true)
    await rt.call('pick', ['t'])
    await rt.call('onButtonClick', ['t', 'a;b'])
    expect(vars).toEqual({ lang: 'en', btn: 'a;b:typed' })
    expect(await rt.runListeners('editRequest', [{ role: 'user', content: 'hi' }])).toEqual([{ role: 'user', content: 'hi!' }])
  })
  test('card code cannot reach files or the OS shell', () => {
    const rt = new RisuLua(mkHost({}))
    rt.load('x = io') ; rt.load('os.execute("ls")')
    expect(rt.errors.length).toBe(1)
  })
  test('manual v2 triggers set variables', () => {
    const vars: Record<string, string> = { n: '2' }
    const triggers = [{ comment: 'l1', type: 'manual', effect: [{ type: 'v2SetVar', operator: '=', var: 'tiger', value: '0', valueType: 'value' }, { type: 'v2SetVar', operator: '+=', var: 'n', value: '3', valueType: 'value' }] }]
    runSimpleTrigger(findManualTrigger(triggers, 'l1')!, mkHost(vars))
    expect(vars).toEqual({ n: '5', tiger: '0' })
  })
})

import { moveTop, risuFlags } from '../src/regex-sync'
test('move_top puts the replacement first', () => {
  const m = moveTop('\\[(.*?)\\|(.*?)\\]', '<b>$1/$2</b>')
  expect('x [A|B] y'.replace(new RegExp(m.find, risuFlags({ in: '', flag: 'g<move_top>i', ableFlag: true }).flags), m.out)).toBe('<b>A/B</b>x  y')
})

test('x-risu- prefixes are normalised in styles and HTML', () => {
  const d = fixFor({ id: 'x', name: 'n', find_regex: 'a', flags: 'g', placement: [], target: ['display'], substitute_macros: 'none', disabled: true, replace_string: '<span class="x-risu-on">$1</span>', metadata: { original_type: 'editdisplay' } }, '<style>.a.x-risu-on{}</style>')
  expect(d.replace_string).toBe('<style>.a.on{}</style>\n<span class="on">$1</span>')
})

import { cssFor } from '../src/regex-sync'
test('only the stylesheet rules a replacement uses are copied', () => {
  const css = '<style>.chat{color:red} .card{x:1} img{y:2} @media (max-width:1px){.card{z:3} .chat{w:4}} @font-face{font-family:A}</style>'
  expect(cssFor(css, '<div class="chat">$1</div>')).toBe('<style>.chat{color:red} img{y:2} @media (max-width:1px){ .chat{w:4}} @font-face{font-family:A}</style>')
})

test('scripts with macros keep the macro pass', () => {
  const d = fixFor({ id: 'x', name: 'n', find_regex: 'a', flags: 'g', placement: [], target: ['display'], substitute_macros: 'none', disabled: true, replace_string: '{{getvar::x}}$1', metadata: { original_type: 'editdisplay' } }, '')
  expect(d.substitute_macros).toBe('raw')
})

test('a card\'s scripts are grouped in one folder (and ungrouped on revert)', () => {
  const s = { id: 'x', name: 'n', find_regex: 'a', flags: 'gs', placement: [], target: ['display'], substitute_macros: 'none', disabled: true, replace_string: 'y', folder: '', metadata: { original_type: 'editdisplay' } }
  const d = fixFor(s, '', undefined, 'ALTAIS')
  expect(d.folder).toBe('리스 · ALTAIS')
  expect(revertFor({ ...s, ...d, target: ['display'] })?.folder).toBe('')
  expect(fixFor({ ...s, folder: '내 폴더' }, '', undefined, 'ALTAIS').folder).toBeUndefined()
})

// ─────────── lorebook rules ───────────
import { loreFixFor, loreRevertFor, parseDecorators, matchCardEntry, type LoreEntry } from '../src/lore-sync'

const loreEntry = (over: Partial<LoreEntry> = {}): LoreEntry => ({
  id: 'e1', key: ['/프로필'], keysecondary: [], content: '## Generate Adoption Profile', comment: '입양프로필 명령어',
  position: 0, depth: 4, role: null, constant: false, disabled: false, selective: false, selective_logic: 0,
  scan_depth: null, probability: 100, use_probability: false, match_whole_words: false, prevent_recursion: false,
  extensions: {}, ...over,
})

test('lore: command entries only scan the card depth', () => {
  const fix = loreFixFor(loreEntry(), 5)!
  expect(fix.scan_depth).toBe(5)
  expect(fix.content).toBeUndefined()
  expect(loreFixFor(loreEntry(), undefined)!.scan_depth).toBe(5)
})

test('lore: decorators are applied and stripped', () => {
  const e = loreEntry({ key: ['/생성'], content: '@@depth 0\n@@scan_depth 1\n@@recursive\n\n{{hiddenkey::x}}\nBody' })
  const fix = loreFixFor(e, 5)!
  expect(fix.content).toBe('{{hiddenkey::x}}\nBody')
  expect(fix.position).toBe(4)
  expect(fix.depth).toBe(0)
  expect(fix.scan_depth).toBe(1)
  expect(fix.prevent_recursion).toBe(false)
  const synced = { ...e, ...fix } as LoreEntry
  expect(loreFixFor(synced, 5)).toBeNull()
  expect(matchCardEntry(synced, [{ content: e.content, comment: e.comment }])).toBeTruthy()
  const back = loreRevertFor(synced)!
  expect(back.content).toBe(e.content)
  expect(back.scan_depth).toBeNull()
})

test('lore: keeps a hand-set scan depth', () => {
  expect(loreFixFor(loreEntry({ scan_depth: 1 }), 5)!.scan_depth).toBeUndefined()
})

test('lore: keys and role decorators', () => {
  const d = parseDecorators('@@role user\n@@additional_keys a, b\n@@activate\ntext').decorators
  expect(d.role).toBe('user')
  expect(d.additionalKeys).toEqual(['a', 'b'])
  expect(d.activate).toBe(true)
  const fix = loreFixFor(loreEntry({ content: '@@exclude_keys x\nT' }), 5)!
  expect(fix.selective).toBe(true)
  expect(fix.keysecondary).toEqual(['x'])
  expect(fix.selective_logic).toBe(1)
})

import { stripImports } from '../src/regex-sync'
test('css: @import with ; in the URL is removed whole', () => {
  const css = "<style>\n@import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;700&display=swap');\n.a{color:red}</style>"
  expect(stripImports(css)).toBe('<style>\n.a{color:red}</style>')
})

import { fixFor } from '../src/regex-sync'
test('regex resync keeps the user on/off choice', () => {
  const base = { id: 'r', name: 'x', find_regex: 'a', replace_string: 'b', flags: 'g', placement: ['ai_output'], target: 'display', substitute_macros: 'none', metadata: { source: 'risuai_module', original_type: 'disabled' } } as any
  const first = fixFor({ ...base, disabled: false }, '')
  expect(first.disabled).toBe(true)
  const userOn = { ...base, ...first, disabled: false, metadata: { ...first.metadata, risubridge: { ...(first.metadata as any).risubridge, version: 1 } } }
  expect(fixFor(userOn, '').disabled).toBe(false)
})

import { keepAboveInput } from '../src/regex-sync'
test('css: full-height panels stop above the input bar', () => {
  expect(keepAboveInput('max-height:calc(100dvh - 40px);height:100vh;width:100vw'))
    .toBe('max-height:calc(calc(100dvh - var(--risu-safe-bottom, 0px)) - 40px);height:calc(100vh - var(--risu-safe-bottom, 0px));width:100vw')
})
