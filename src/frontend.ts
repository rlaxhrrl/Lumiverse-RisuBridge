import type { SpindleFrontendContext, SpindleModalHandle } from 'lumiverse-spindle-types'
import type { ToggleRow, TogglesReply } from './toggles'
import { readRisuFile } from './risu-file'

const ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="6" width="22" height="12" rx="6"/><circle cx="16" cy="12" r="3"/></svg>'

const CSS = `
.rb-wrap{display:flex;flex-direction:column;gap:10px;font-size:14px;line-height:1.4}
.rb-head{opacity:.75;font-size:13px}
.rb-group{font-weight:700;font-size:15px;margin-top:6px}
.rb-divider{font-weight:600;margin-top:8px;padding-top:8px;border-top:1px solid color-mix(in srgb,currentColor 18%,transparent)}
.rb-caption{opacity:.65;font-size:12px;margin-top:-4px}
.rb-row{display:flex;align-items:center;justify-content:space-between;gap:12px}
.rb-row label{flex:1;min-width:0}
.rb-row select,.rb-row input[type=text]{max-width:55%;min-width:120px;padding:6px 8px;border-radius:8px;border:1px solid color-mix(in srgb,currentColor 25%,transparent);background:transparent;color:inherit;font:inherit}
.rb-row select option{color:#111}
.rb-row input[type=checkbox]{width:20px;height:20px}
.rb-changed{font-size:11px;opacity:.6;margin-left:6px}
.rb-foot{display:flex;justify-content:space-between;align-items:center;margin-top:8px;gap:8px}
.rb-btn{white-space:nowrap;flex-shrink:0;padding:6px 12px;border-radius:8px;border:1px solid color-mix(in srgb,currentColor 25%,transparent);background:transparent;color:inherit;font:inherit;cursor:pointer}
.rb-empty{opacity:.7}
.rb-regex{margin-top:6px;padding:10px;border-radius:10px;background:color-mix(in srgb,currentColor 6%,transparent);display:flex;flex-direction:column;gap:8px}
.rb-regex-row{display:flex;justify-content:space-between;align-items:center;gap:8px}
`

export function setup(ctx: SpindleFrontendContext) {
  let modal: SpindleModalHandle | null = null
  let body: HTMLElement | null = null
  let currentChat: string | null = null

  const action = ctx.ui.registerInputBarAction({
    id: 'risubridge-toggles',
    label: '리스 토글',
    subtitle: '이 채팅의 카드 설정',
    iconSvg: ICON,
  })

  const send = (payload: Record<string, unknown>) => ctx.sendToBackend(payload)

  function open() {
    const active = ctx.getActiveChat()
    if (!active.chatId) {
      ctx.ui.showModal({ title: '리스 토글' }).root.textContent = '채팅을 먼저 열어 주세요.'
      return
    }
    currentChat = active.chatId
    modal = ctx.ui.showModal({ title: '리스 토글', width: 460, maxHeight: 640 })
    const style = document.createElement('style')
    style.textContent = CSS
    body = document.createElement('div')
    body.className = 'rb-wrap'
    body.textContent = '불러오는 중…'
    modal.root.append(style, body)
    modal.onDismiss(() => { modal = null; body = null })
    send({ type: 'get_toggles', chatId: currentChat })
  }

  function rowEl(row: ToggleRow): HTMLElement {
    const el = document.createElement('div')
    if (row.kind === 'group' || row.kind === 'divider' || row.kind === 'caption') {
      el.className = `rb-${row.kind}`
      el.textContent = row.label
      return el
    }
    el.className = 'rb-row'
    const label = document.createElement('label')
    label.textContent = row.label
    if (!row.isDefault) {
      const mark = document.createElement('span')
      mark.className = 'rb-changed'
      mark.textContent = '변경됨'
      label.append(mark)
    }
    const id = `rb-${row.key}`
    label.htmlFor = id
    let input: HTMLInputElement | HTMLSelectElement
    if (row.kind === 'select') {
      const sel = document.createElement('select')
      row.options.forEach((opt, i) => {
        const o = document.createElement('option')
        o.value = String(i)
        o.textContent = opt
        sel.append(o)
      })
      sel.value = row.value
      sel.addEventListener('change', () => send({ type: 'set_toggle', chatId: currentChat, key: row.key, value: sel.value }))
      input = sel
    } else if (row.kind === 'checkbox') {
      const cb = document.createElement('input')
      cb.type = 'checkbox'
      cb.checked = row.value === '1'
      cb.addEventListener('change', () => send({ type: 'set_toggle', chatId: currentChat, key: row.key, value: cb.checked ? '1' : '0' }))
      input = cb
    } else {
      const tx = document.createElement('input')
      tx.type = 'text'
      tx.value = row.value
      tx.addEventListener('change', () => send({ type: 'set_toggle', chatId: currentChat, key: row.key, value: tx.value }))
      input = tx
    }
    input.id = id
    el.append(label, input)
    return el
  }

  function render(reply: TogglesReply) {
    if (!body || reply.chatId !== currentChat) return
    body.replaceChildren()
    const head = document.createElement('div')
    head.className = 'rb-head'
    if (!reply.isRisu) {
      head.textContent = `${reply.characterName || '이 캐릭터'}는 리스(RisuAI)에서 가져온 카드가 아니에요.`
      body.append(head)
      return
    }
    const settable = reply.rows.filter((r) => r.kind === 'select' || r.kind === 'checkbox' || r.kind === 'text')
    if (!settable.length) {
      head.className = 'rb-empty'
      head.textContent = `${reply.characterName} 카드에는 토글이 없어요.`
      body.append(head)
    } else {
      head.textContent = `${reply.characterName} · 이 채팅에만 적용돼요. 다음 답변부터 반영됩니다.`
      body.append(head, ...reply.rows.map(rowEl))
    }
    if (reply.regex && reply.regex.total > 0) {
      const box = document.createElement('div')
      box.className = 'rb-regex'
      const title = document.createElement('div')
      title.className = 'rb-group'
      title.style.marginTop = '0'
      title.textContent = '상태창·화면 꾸미기'
      const line = document.createElement('div')
      line.className = 'rb-regex-row'
      const info = document.createElement('span')
      const btn = document.createElement('button')
      btn.className = 'rb-btn'
      if (reply.regexOptOut || reply.regex.synced === 0) {
        info.textContent = `${reply.regex.total}개 · 리스 방식으로 고치지 않음`
        btn.textContent = '리스처럼 적용'
        btn.addEventListener('click', () => { btn.disabled = true; send({ type: 'regex_apply', chatId: currentChat }) })
      } else {
        info.textContent = `정상 작동 중 (${reply.regex.active}/${reply.regex.total}개 켜짐, 제작자가 꺼둔 건 꺼둠)`
        btn.textContent = '원래대로'
        btn.addEventListener('click', () => { btn.disabled = true; send({ type: 'regex_revert', chatId: currentChat }) })
      }
      line.append(info, btn)
      box.append(title, line)
      body.append(box)
    }
    if (reply.isRisu) body.append(linkBox(reply))
    if (!settable.length && !(reply.regex && reply.regex.total > 0)) return
    const foot = document.createElement('div')
    foot.className = 'rb-foot'
    const reset = document.createElement('button')
    reset.className = 'rb-btn'
    reset.textContent = '기본값으로'
    reset.addEventListener('click', () => send({ type: 'reset_toggles', chatId: currentChat }))
    const done = document.createElement('button')
    done.className = 'rb-btn'
    done.textContent = '닫기'
    done.addEventListener('click', () => modal?.dismiss())
    foot.append(reset, done)
    body.append(foot)
  }

  function linkBox(reply: TogglesReply): HTMLElement {
    const box = document.createElement('div')
    box.className = 'rb-regex'
    const title = document.createElement('div')
    title.className = 'rb-group'
    title.style.marginTop = '0'
    title.textContent = '카드 속 버튼'
    const line = document.createElement('div')
    line.className = 'rb-regex-row'
    const info = document.createElement('span')
    const l = reply.linked
    info.textContent = l
      ? `연결됨${l.lua ? ' · Lua 있음' : ''}${l.manual ? ` · 버튼 트리거 ${l.manual}개` : ''}`
      : '이 카드의 버튼을 쓰려면 처음 가져왔던 원본 카드 파일을 한 번 골라 주세요. (확장을 켠 뒤에 가져온 카드는 자동으로 연결돼요)'
    const btn = document.createElement('button')
    btn.className = 'rb-btn'
    btn.textContent = l ? '다시 연결' : '원본 파일 연결'
    btn.addEventListener('click', async () => {
      try {
        const files = await ctx.uploads.pickFile({ accept: ['.charx', '.png', '.jpeg', '.jpg', '.risum'], maxSizeBytes: 200 * 1024 * 1024 })
        const f = files?.[0]
        if (!f) return
        const data = readRisuFile(f.bytes)
        if ('error' in data) { info.textContent = data.error; return }
        info.textContent = '연결하는 중…'
        btn.disabled = true
        send({ type: 'link_original', chatId: currentChat, data })
      } catch (err) {
        info.textContent = `파일을 읽지 못했어요: ${err instanceof Error ? err.message : String(err)}`
      }
    })
    line.append(info, btn)
    box.append(title, line)
    return box
  }

  // ── Risu buttons inside messages ──
  function findRisuTarget(ev: Event): { kind: 'btn' | 'trigger'; value: string } | null {
    for (const node of ev.composedPath()) {
      if (!(node instanceof Element)) continue
      const btn = node.getAttribute('risu-btn')
      if (btn !== null) return { kind: 'btn', value: btn }
      const trig = node.getAttribute('risu-trigger') ?? node.getAttribute('data-risu-trigger')
      if (trig !== null && trig !== '') return { kind: 'trigger', value: trig }
    }
    return null
  }
  const onDocClick = (ev: Event) => {
    const hit = findRisuTarget(ev)
    if (!hit) return
    const chatId = ctx.getActiveChat().chatId
    if (!chatId) return
    ev.preventDefault()
    ev.stopPropagation()
    send({ type: 'risu_click', chatId, kind: hit.kind, value: hit.value })
  }
  document.addEventListener('click', onDocClick, true)

  function showPrompt(msg: { id: string; message?: string; kind?: string; options?: string[] }) {
    const m = ctx.ui.showModal({ title: msg.kind === 'normal' ? '알림' : '입력', width: 420 })
    const wrap = document.createElement('div')
    wrap.className = 'rb-wrap'
    const style = document.createElement('style')
    style.textContent = CSS
    const text = document.createElement('div')
    text.style.whiteSpace = 'pre-wrap'
    text.textContent = msg.message ?? ''
    wrap.append(text)
    let answered = false
    const reply = (value: string | null) => { if (answered) return; answered = true; send({ type: 'risu_prompt_reply', id: msg.id, value }); m.dismiss() }
    const foot = document.createElement('div')
    foot.className = 'rb-foot'
    if (msg.kind === 'select') {
      (msg.options ?? []).forEach((opt, i) => {
        const b = document.createElement('button')
        b.className = 'rb-btn'
        b.textContent = opt
        b.addEventListener('click', () => reply(String(i)))
        wrap.append(b)
      })
    } else if (msg.kind === 'input') {
      const input = document.createElement('textarea')
      input.rows = 3
      input.style.cssText = 'width:100%;box-sizing:border-box;padding:8px;border-radius:8px;background:transparent;color:inherit;border:1px solid color-mix(in srgb,currentColor 25%,transparent);font:inherit'
      wrap.append(input)
      const ok = document.createElement('button')
      ok.className = 'rb-btn'
      ok.textContent = '확인'
      ok.addEventListener('click', () => reply(input.value))
      const cancel = document.createElement('button')
      cancel.className = 'rb-btn'
      cancel.textContent = '취소'
      cancel.addEventListener('click', () => reply(null))
      foot.append(cancel, ok)
      setTimeout(() => input.focus(), 50)
    } else {
      const ok = document.createElement('button')
      ok.className = 'rb-btn'
      ok.textContent = '확인'
      ok.addEventListener('click', () => reply(''))
      foot.append(document.createElement('span'), ok)
    }
    wrap.append(foot)
    m.root.append(style, wrap)
    m.onDismiss(() => reply(null))
  }

  function notice(message: string) {
    const m = ctx.ui.showModal({ title: '리스 버튼', width: 400 })
    const d = document.createElement('div')
    d.style.cssText = 'font-size:14px;line-height:1.5'
    d.textContent = message
    m.root.append(d)
  }

  /** Re-render chat messages after variables changed (Risu's reloadDisplay). */
  function refreshDisplay() {
    try { (ctx as unknown as { display?: { invalidate(v: string[]): void } }).display?.invalidate(['*']) } catch { /* older host */ }
  }

  // ── Remember Risu card files picked anywhere in Lumiverse (e.g. character import) ──
  // so buttons and Lua work without linking the file again by hand.
  const CARD_EXT = /\.(charx|png|jpe?g|risum)$/i
  async function inspectFiles(files: Iterable<File>) {
    for (const file of files) {
      if (!CARD_EXT.test(file.name) || file.size > 200 * 1024 * 1024) continue
      try {
        const data = readRisuFile(new Uint8Array(await file.arrayBuffer()))
        if ('error' in data || !data.cardName) continue
        if (!data.triggers.length && !data.regex.some((r) => r.ableFlag && r.flag)) continue
        send({ type: 'pending_link', data })
      } catch { /* not a card */ }
    }
  }
  const onFileChange = (ev: Event) => {
    const input = ev.target as HTMLInputElement | null
    if (input?.type === 'file' && input.files?.length) void inspectFiles(Array.from(input.files))
  }
  const onDrop = (ev: DragEvent) => {
    const files = ev.dataTransfer?.files
    if (files?.length) void inspectFiles(Array.from(files))
  }
  document.addEventListener('change', onFileChange, true)
  document.addEventListener('drop', onDrop, true)

  const offClick = action.onClick(open)
  const offMsg = ctx.onBackendMessage((payload) => {
    const msg = payload as { type?: string; error?: string }
    if (msg?.type === 'risu_reload') { refreshDisplay(); return }
    if (msg?.type === 'toggles') { render(payload as TogglesReply); if ((payload as { changed?: boolean }).changed) refreshDisplay() }
    else if (msg?.type === 'risu_prompt') showPrompt(payload as { id: string; message?: string; kind?: string; options?: string[] })
    else if (msg?.type === 'risu_notice') notice(String((payload as { message?: string }).message ?? ''))
    else if (msg?.type === 'toggles_error' && body) body.textContent = msg.error === 'no_chat' ? '채팅을 찾을 수 없어요.' : `오류: ${msg.error}`
  })

  return () => {
    offClick()
    offMsg()
    document.removeEventListener('click', onDocClick, true)
    document.removeEventListener('change', onFileChange, true)
    document.removeEventListener('drop', onDrop, true)
    action.destroy()
    modal?.dismiss()
  }
}
