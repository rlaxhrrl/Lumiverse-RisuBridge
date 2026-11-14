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
