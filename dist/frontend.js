// src/frontend.ts
var ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="6" width="22" height="12" rx="6"/><circle cx="16" cy="12" r="3"/></svg>';
var CSS = `
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
.rb-btn{padding:6px 12px;border-radius:8px;border:1px solid color-mix(in srgb,currentColor 25%,transparent);background:transparent;color:inherit;font:inherit;cursor:pointer}
.rb-empty{opacity:.7}
`;
function setup(ctx) {
  let modal = null;
  let body = null;
  let currentChat = null;
  const action = ctx.ui.registerInputBarAction({
    id: "risubridge-toggles",
    label: "리스 토글",
    subtitle: "이 채팅의 카드 설정",
    iconSvg: ICON
  });
  const send = (payload) => ctx.sendToBackend(payload);
  function open() {
    const active = ctx.getActiveChat();
    if (!active.chatId) {
      ctx.ui.showModal({ title: "리스 토글" }).root.textContent = "채팅을 먼저 열어 주세요.";
      return;
    }
    currentChat = active.chatId;
    modal = ctx.ui.showModal({ title: "리스 토글", width: 460, maxHeight: 640 });
    const style = document.createElement("style");
    style.textContent = CSS;
    body = document.createElement("div");
    body.className = "rb-wrap";
    body.textContent = "불러오는 중…";
    modal.root.append(style, body);
    modal.onDismiss(() => {
      modal = null;
      body = null;
    });
    send({ type: "get_toggles", chatId: currentChat });
  }
  function rowEl(row) {
    const el = document.createElement("div");
    if (row.kind === "group" || row.kind === "divider" || row.kind === "caption") {
      el.className = `rb-${row.kind}`;
      el.textContent = row.label;
      return el;
    }
    el.className = "rb-row";
    const label = document.createElement("label");
    label.textContent = row.label;
    if (!row.isDefault) {
      const mark = document.createElement("span");
      mark.className = "rb-changed";
      mark.textContent = "변경됨";
      label.append(mark);
    }
    const id = `rb-${row.key}`;
    label.htmlFor = id;
    let input;
    if (row.kind === "select") {
      const sel = document.createElement("select");
      row.options.forEach((opt, i) => {
        const o = document.createElement("option");
        o.value = String(i);
        o.textContent = opt;
        sel.append(o);
      });
      sel.value = row.value;
      sel.addEventListener("change", () => send({ type: "set_toggle", chatId: currentChat, key: row.key, value: sel.value }));
      input = sel;
    } else if (row.kind === "checkbox") {
      const cb = document.createElement("input");
      cb.type = "checkbox";
      cb.checked = row.value === "1";
      cb.addEventListener("change", () => send({ type: "set_toggle", chatId: currentChat, key: row.key, value: cb.checked ? "1" : "0" }));
      input = cb;
    } else {
      const tx = document.createElement("input");
      tx.type = "text";
      tx.value = row.value;
      tx.addEventListener("change", () => send({ type: "set_toggle", chatId: currentChat, key: row.key, value: tx.value }));
      input = tx;
    }
    input.id = id;
    el.append(label, input);
    return el;
  }
  function render(reply) {
    if (!body || reply.chatId !== currentChat)
      return;
    body.replaceChildren();
    const head = document.createElement("div");
    head.className = "rb-head";
    if (!reply.isRisu) {
      head.textContent = `${reply.characterName || "이 캐릭터"}는 리스(RisuAI)에서 가져온 카드가 아니에요.`;
      body.append(head);
      return;
    }
    const settable = reply.rows.filter((r) => r.kind === "select" || r.kind === "checkbox" || r.kind === "text");
    if (!settable.length) {
      head.className = "rb-empty";
      head.textContent = `${reply.characterName} 카드에는 토글이 없어요.`;
      body.append(head);
      return;
    }
    head.textContent = `${reply.characterName} · 이 채팅에만 적용돼요. 다음 답변부터 반영됩니다.`;
    body.append(head, ...reply.rows.map(rowEl));
    const foot = document.createElement("div");
    foot.className = "rb-foot";
    const reset = document.createElement("button");
    reset.className = "rb-btn";
    reset.textContent = "기본값으로";
    reset.addEventListener("click", () => send({ type: "reset_toggles", chatId: currentChat }));
    const done = document.createElement("button");
    done.className = "rb-btn";
    done.textContent = "닫기";
    done.addEventListener("click", () => modal?.dismiss());
    foot.append(reset, done);
    body.append(foot);
  }
  const offClick = action.onClick(open);
  const offMsg = ctx.onBackendMessage((payload) => {
    const msg = payload;
    if (msg?.type === "toggles")
      render(payload);
    else if (msg?.type === "toggles_error" && body)
      body.textContent = msg.error === "no_chat" ? "채팅을 찾을 수 없어요." : `오류: ${msg.error}`;
  });
  return () => {
    offClick();
    offMsg();
    action.destroy();
    modal?.dismiss();
  };
}
export {
  setup
};
