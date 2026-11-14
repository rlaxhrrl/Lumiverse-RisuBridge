// @bun
// src/toggles.ts
function toggleLayout(src, current) {
  const rows = [];
  for (const line of (src || "").split(`
`)) {
    const parts = line.split("=");
    if (parts.length < 2)
      continue;
    const key = parts[0].trim();
    const label = parts[1];
    const type = (parts[2] ?? "").trim().toLowerCase();
    if (!key) {
      if (type === "group" || type === "divider" || type === "caption")
        rows.push({ kind: type, label });
      continue;
    }
    const v = current(key);
    if (type === "select") {
      const options = (parts.slice(3).join("=") || "").split(",");
      rows.push({ kind: "select", key, label, options, value: v ?? "0", isDefault: v === undefined });
    } else if (type === "text" || type === "textarea") {
      rows.push({ kind: "text", key, label, value: v ?? "", isDefault: v === undefined });
    } else if (type === "group" || type === "groupend" || type === "divider" || type === "caption") {
      continue;
    } else {
      rows.push({ kind: "checkbox", key, label, value: v ?? "0", isDefault: v === undefined });
    }
  }
  return rows;
}

// src/cbs.ts
var MAX_DEPTH = 40;
function tokenize(src) {
  const out = [];
  let i = 0;
  let textStart = 0;
  while (i < src.length) {
    const open = src.indexOf("{{", i);
    if (open < 0)
      break;
    let depth = 0;
    let j = open;
    let close = -1;
    while (j < src.length) {
      if (src.startsWith("{{", j)) {
        depth++;
        j += 2;
        continue;
      }
      if (src.startsWith("}}", j)) {
        depth--;
        if (depth === 0) {
          close = j;
          break;
        }
        j += 2;
        continue;
      }
      j++;
    }
    if (close < 0)
      break;
    if (open > textStart)
      out.push({ kind: "text", value: src.slice(textStart, open) });
    out.push({ kind: "macro", inner: src.slice(open + 2, close), start: open, end: close + 2 });
    i = close + 2;
    textStart = i;
  }
  if (textStart < src.length)
    out.push({ kind: "text", value: src.slice(textStart) });
  return out;
}
function splitArgs(s) {
  const parts = [];
  let depth = 0;
  let last = 0;
  for (let i = 0;i < s.length; i++) {
    if (s.startsWith("{{", i)) {
      depth++;
      i++;
      continue;
    }
    if (s.startsWith("}}", i)) {
      depth--;
      i++;
      continue;
    }
    if (depth === 0 && s.startsWith("::", i)) {
      parts.push(s.slice(last, i));
      last = i + 2;
      i++;
    }
  }
  parts.push(s.slice(last));
  return parts;
}
var norm = (name) => name.trim().toLowerCase().replace(/_/g, "");
var truthy = (v) => {
  const t = v.trim().toLowerCase();
  return t === "1" || t === "true";
};
var bool = (b) => b ? "1" : "0";
function trimLines(s) {
  return s.split(`
`).map((l) => l.trimStart()).join(`
`).trim();
}
function parseArray(s) {
  const t = s.trim();
  if (t.startsWith("[")) {
    try {
      const v = JSON.parse(t);
      if (Array.isArray(v))
        return v.map((x) => typeof x === "string" ? x : JSON.stringify(x));
    } catch {}
  }
  if (t === "")
    return [];
  return t.split("\xA7");
}
var makeArray = (a) => JSON.stringify(a);
function num(s) {
  const n = Number(String(s).trim());
  return Number.isFinite(n) ? n : NaN;
}
function fmt(n) {
  if (!Number.isFinite(n))
    return "NaN";
  return String(Math.round(n * 1e9) / 1e9);
}
function evalMath(expr) {
  const toks = expr.match(/\d+(?:\.\d+)?|\?\?|&&|\|\||<=|>=|==|!=|[-+*/%^()<>!]|[A-Za-z_][\w.]*/g) ?? [];
  let p = 0;
  const peek = () => toks[p];
  const next = () => toks[p++];
  const n0 = (v) => v === null || Number.isNaN(v) ? 0 : v;
  function primary() {
    const t = next();
    if (t === undefined)
      return null;
    if (t === "(") {
      const v = nullish();
      if (peek() === ")")
        p++;
      return v;
    }
    if (t === "-")
      return -n0(unary());
    if (t === "+")
      return n0(unary());
    if (t === "!")
      return Number(!n0(unary()));
    if (/^\d/.test(t))
      return Number(t);
    const l = t.toLowerCase();
    if (l === "true")
      return 1;
    if (l === "false")
      return 0;
    return null;
  }
  function unary() {
    return primary();
  }
  function power() {
    let a = unary();
    while (peek() === "^") {
      p++;
      const b = unary();
      a = Math.pow(n0(a), n0(b));
    }
    return a;
  }
  function mul() {
    let a = power();
    while (peek() === "*" || peek() === "/" || peek() === "%") {
      const op = next();
      const b = power();
      a = op === "*" ? n0(a) * n0(b) : op === "/" ? n0(a) / n0(b) : n0(a) % n0(b);
    }
    return a;
  }
  function add() {
    let a = mul();
    while (peek() === "+" || peek() === "-") {
      const op = next();
      const b = mul();
      a = op === "+" ? n0(a) + n0(b) : n0(a) - n0(b);
    }
    return a;
  }
  function cmp() {
    let a = add();
    while (["<", ">", "<=", ">=", "==", "!="].includes(peek())) {
      const op = next();
      const x = n0(a);
      const y = n0(add());
      a = Number(op === "<" ? x < y : op === ">" ? x > y : op === "<=" ? x <= y : op === ">=" ? x >= y : op === "==" ? x === y : x !== y);
    }
    return a;
  }
  function and() {
    let a = cmp();
    while (peek() === "&&") {
      p++;
      const b = cmp();
      a = Number(Boolean(n0(a)) && Boolean(n0(b)));
    }
    return a;
  }
  function or() {
    let a = and();
    while (peek() === "||") {
      p++;
      const b = and();
      a = Number(Boolean(n0(a)) || Boolean(n0(b)));
    }
    return a;
  }
  function nullish() {
    let a = or();
    while (peek() === "??") {
      p++;
      const b = or();
      if (a === null || Number.isNaN(a))
        a = b;
    }
    return a;
  }
  try {
    return fmt(n0(nullish()));
  } catch {
    return "0";
  }
}
var WHEN_BINARY = new Set(["and", "or", "is", "isnot", ">", "<", ">=", "<=", "vis", "visnot", "tis", "tisnot"]);
var WHEN_UNARY = new Set(["not", "var", "toggle"]);
function evalWhen(stmt, st) {
  const s = [...stmt];
  if (s.length === 0)
    return false;
  while (s.length > 1) {
    const right = s.pop();
    const op = s.pop();
    const opl = op.trim().toLowerCase();
    if (WHEN_UNARY.has(opl)) {
      if (opl === "not")
        s.push(bool(!truthy(right)));
      else if (opl === "var")
        s.push(bool(truthy(getVar(st, right.trim()))));
      else
        s.push(bool(truthy(st.env.toggle(right.trim()))));
      continue;
    }
    if (!WHEN_BINARY.has(opl) || s.length === 0) {
      return truthy(right);
    }
    const left = s.pop();
    let r;
    switch (opl) {
      case "and":
        r = truthy(left) && truthy(right);
        break;
      case "or":
        r = truthy(left) || truthy(right);
        break;
      case "is":
        r = left === right;
        break;
      case "isnot":
        r = left !== right;
        break;
      case ">":
        r = num(left) > num(right);
        break;
      case "<":
        r = num(left) < num(right);
        break;
      case ">=":
        r = num(left) >= num(right);
        break;
      case "<=":
        r = num(left) <= num(right);
        break;
      case "vis":
        r = getVar(st, left.trim()) === right;
        break;
      case "visnot":
        r = getVar(st, left.trim()) !== right;
        break;
      case "tis":
        r = st.env.toggle(left.trim()) === right;
        break;
      case "tisnot":
        r = st.env.toggle(left.trim()) !== right;
        break;
      default:
        r = false;
    }
    s.push(bool(r));
  }
  return truthy(s[0]);
}
function getVar(st, key) {
  st.touched.add(`chat:${key}`);
  if (st.vars.has(key))
    return st.vars.get(key);
  const v = st.env.getChatVar(key);
  if (v !== undefined)
    return v;
  const d = st.env.defaultVariables?.[key];
  if (d !== undefined)
    return d;
  return "null";
}
function setVar(st, key, value) {
  st.vars.set(key, value);
  st.env.onSetChatVar?.(key, value);
}
function getGlobal(st, key) {
  if (key.startsWith("toggle_")) {
    st.touched.add(`chat:${key}`);
    return st.env.toggle(key.slice(7));
  }
  st.touched.add(`global:${key}`);
  return st.env.getGlobalVar?.(key) ?? "null";
}
var BLOCK_CLOSE = /^\/(if|if_pure|when|each|func|)?\s*$/i;
function isBlockOpen(inner) {
  return /^#(if_pure|if|when|each|func)\b/i.test(inner.trimStart());
}
function isElse(inner) {
  return /^:else\s*$/i.test(inner.trim());
}
function findBlockEnd(nodes, i) {
  let depth = 0;
  let elseIdx = -1;
  for (let k = i + 1;k < nodes.length; k++) {
    const n = nodes[k];
    if (n.kind !== "macro")
      continue;
    if (isBlockOpen(n.inner)) {
      depth++;
      continue;
    }
    if (BLOCK_CLOSE.test(n.inner.trim())) {
      if (depth === 0)
        return { elseIdx, closeIdx: k };
      depth--;
      continue;
    }
    if (depth === 0 && elseIdx < 0 && isElse(n.inner))
      elseIdx = k;
  }
  return { elseIdx, closeIdx: -1 };
}
function render(src, st) {
  if (!src.includes("{{"))
    return src;
  if (st.depth > MAX_DEPTH)
    return src;
  st.depth++;
  try {
    const nodes = tokenize(src);
    let out = "";
    for (let i = 0;i < nodes.length; i++) {
      const n = nodes[i];
      if (n.kind === "text") {
        out += n.value;
        continue;
      }
      if (isBlockOpen(n.inner)) {
        const { elseIdx, closeIdx } = findBlockEnd(nodes, i);
        const endIdx = closeIdx < 0 ? nodes.length : closeIdx;
        const bodyEndPos = elseIdx >= 0 ? nodes[elseIdx].start : closeIdx < 0 ? src.length : nodes[closeIdx].start;
        const body = src.slice(n.end, bodyEndPos);
        const elseBody = elseIdx >= 0 ? src.slice(nodes[elseIdx].end, closeIdx < 0 ? src.length : nodes[closeIdx].start) : "";
        out += runBlock(n.inner, body, elseBody, st);
        i = endIdx;
        continue;
      }
      out += evalMacro(n.inner, st);
    }
    return out;
  } finally {
    st.depth--;
  }
}
function runBlock(header, body, elseBody, st) {
  const h = render(header, st).trimStart();
  const m = /^#(if_pure|if|when|each|func)/i.exec(h);
  const kind = m[1].toLowerCase();
  let rest = h.slice(m[0].length);
  if (kind === "func") {
    st.funcs.set(rest.replace(/^::/, "").trim(), body);
    return "";
  }
  if (kind === "each") {
    rest = rest.replace(/^::/, "").trim();
    const mm = /^([\s\S]*?)\s+(?:as\s+)?(\S+)\s*$/.exec(rest);
    const list = mm ? mm[1] : rest;
    const name = mm ? mm[2] : "item";
    const items = parseArray(list);
    let out = "";
    const tmpl = trimLines(body);
    for (const item of items) {
      st.slots.push({ [name]: item });
      try {
        out += render(tmpl, st);
      } finally {
        st.slots.pop();
      }
    }
    return out;
  }
  if (kind === "if" || kind === "if_pure") {
    const cond = rest.replace(/^::/, "").trim();
    const yes = truthy(cond);
    const chosen = yes ? body : elseBody;
    return kind === "if" ? render(trimLines(chosen), st) : render(chosen, st);
  }
  let stmt;
  if (rest.startsWith("::"))
    stmt = splitArgs(rest.slice(2));
  else
    stmt = [rest.trim()];
  let keep = false;
  let legacy = false;
  while (stmt.length > 1 && ["keep", "legacy"].includes(stmt[0].trim().toLowerCase())) {
    const f = stmt.shift().trim().toLowerCase();
    if (f === "keep")
      keep = true;
    else
      legacy = true;
  }
  const yes = evalWhen(stmt, st);
  const chosen = yes ? body : elseBody;
  return legacy ? render(trimLines(chosen), st) : render(chosen, st);
}
function evalMacro(innerRaw, st) {
  const trimmedRaw = innerRaw.trimStart();
  if (trimmedRaw.startsWith("//"))
    return "";
  if (trimmedRaw.startsWith("?")) {
    return evalMath(render(trimmedRaw.slice(1), st));
  }
  if (BLOCK_CLOSE.test(trimmedRaw.trim()) || isElse(trimmedRaw))
    return "";
  const inner = render(innerRaw, st);
  const parts = splitArgs(inner);
  const rawName = parts[0];
  const name = norm(rawName);
  const a = parts.slice(1);
  const env = st.env;
  const passthrough = () => `{{${inner}}}`;
  switch (name) {
    case "user":
      return a.length ? passthrough() : env.names.user;
    case "char":
    case "bot":
      return a.length ? passthrough() : env.names.char;
    case "getvar":
      return getVar(st, (a[0] ?? "").trim());
    case "setvar":
      setVar(st, (a[0] ?? "").trim(), a.slice(1).join("::"));
      return "";
    case "addvar": {
      const k = (a[0] ?? "").trim();
      const cur = num(getVar(st, k));
      setVar(st, k, fmt((Number.isNaN(cur) ? 0 : cur) + (num(a[1] ?? "0") || 0)));
      return "";
    }
    case "setdefaultvar": {
      const k = (a[0] ?? "").trim();
      if (getVar(st, k) === "null")
        setVar(st, k, a.slice(1).join("::"));
      return "";
    }
    case "getglobalvar":
      return getGlobal(st, (a[0] ?? "").trim());
    case "gettempvar":
      return st.temp.get((a[0] ?? "").trim()) ?? "";
    case "settempvar":
      st.temp.set((a[0] ?? "").trim(), a.slice(1).join("::"));
      return "";
    case "tempvar":
      return st.temp.get((a[0] ?? "").trim()) ?? "";
    case "slot": {
      const k = (a[0] ?? "").trim();
      for (let i = st.slots.length - 1;i >= 0; i--)
        if (k in st.slots[i])
          return st.slots[i][k];
      return "";
    }
    case "arg": {
      const frame = st.args[st.args.length - 1];
      if (!frame)
        return "";
      return frame[Number(a[0])] ?? "null";
    }
    case "call": {
      const fname = (a[0] ?? "").trim();
      const body = st.funcs.get(fname);
      if (body === undefined)
        return "";
      st.args.push([fname, ...a.slice(1)]);
      try {
        return render(trimLines(body), st);
      } finally {
        st.args.pop();
      }
    }
    case "equal":
      return bool((a[0] ?? "") === (a[1] ?? ""));
    case "notequal":
      return bool((a[0] ?? "") !== (a[1] ?? ""));
    case "greater":
      return bool(num(a[0]) > num(a[1]));
    case "less":
      return bool(num(a[0]) < num(a[1]));
    case "greaterequal":
      return bool(num(a[0]) >= num(a[1]));
    case "lessequal":
      return bool(num(a[0]) <= num(a[1]));
    case "and":
      return bool(truthy(a[0] ?? "") && truthy(a[1] ?? ""));
    case "or":
      return bool(truthy(a[0] ?? "") || truthy(a[1] ?? ""));
    case "not":
      return bool(!truthy(a[0] ?? ""));
    case "all": {
      const v = a.length === 1 ? parseArray(a[0]) : a;
      return bool(v.every(truthy));
    }
    case "any": {
      const v = a.length === 1 ? parseArray(a[0]) : a;
      return bool(v.some(truthy));
    }
    case "contains":
      return bool((a[0] ?? "").includes(a[1] ?? ""));
    case "startswith":
      return bool((a[0] ?? "").startsWith(a[1] ?? ""));
    case "endswith":
      return bool((a[0] ?? "").endsWith(a[1] ?? ""));
    case "iserror":
      return bool((a[0] ?? "").toLowerCase().startsWith("error:"));
    case "calc":
      return evalMath(a.join("::"));
    case "round":
      return fmt(Math.round(num(a[0])));
    case "floor":
      return fmt(Math.floor(num(a[0])));
    case "ceil":
      return fmt(Math.ceil(num(a[0])));
    case "abs":
      return fmt(Math.abs(num(a[0])));
    case "min": {
      const v = (a.length === 1 ? parseArray(a[0]) : a).map(num).filter((x) => !Number.isNaN(x));
      return fmt(v.length ? Math.min(...v) : 0);
    }
    case "max": {
      const v = (a.length === 1 ? parseArray(a[0]) : a).map(num).filter((x) => !Number.isNaN(x));
      return fmt(v.length ? Math.max(...v) : 0);
    }
    case "sum": {
      const v = (a.length === 1 ? parseArray(a[0]) : a).map(num).filter((x) => !Number.isNaN(x));
      return fmt(v.reduce((x, y) => x + y, 0));
    }
    case "trim":
      return a.length ? (a[0] ?? "").trim() : passthrough();
    case "lower":
      return (a[0] ?? "").toLowerCase();
    case "upper":
      return (a[0] ?? "").toUpperCase();
    case "capitalize": {
      const s = a[0] ?? "";
      return s.charAt(0).toUpperCase() + s.slice(1);
    }
    case "length":
      return String((a[0] ?? "").length);
    case "replace":
      return (a[0] ?? "").split(a[1] ?? "").join(a[2] ?? "");
    case "split":
      return makeArray((a[0] ?? "").split(a[1] ?? ""));
    case "join":
      return parseArray(a[0] ?? "").join(a[1] ?? "");
    case "arrayelement":
    case "element": {
      const arr = parseArray(a[0] ?? "");
      return arr[Number(a[1])] ?? "null";
    }
    case "arraylength":
      return String(parseArray(a[0] ?? "").length);
    case "arraypush":
      return makeArray([...parseArray(a[0] ?? ""), a[1] ?? ""]);
    case "filter":
      return makeArray(parseArray(a[0] ?? "").filter((x) => x.trim() !== ""));
    case "spread":
      return parseArray(a[0] ?? "").join("::");
    case "makearray":
    case "array":
    case "a":
      return makeArray(a);
    case "random": {
      st.volatile = true;
      const r = (env.random ?? Math.random)();
      if (a.length === 0)
        return String(r);
      const choices = a.length === 1 ? a[0].includes(",") ? a[0].split(",") : parseArray(a[0]) : a;
      return choices.length ? choices[Math.floor(r * choices.length)] : "";
    }
    case "pick":
    case "randint": {
      st.volatile = true;
      const lo = num(a[0]);
      const hi = num(a[1]);
      return String(Math.floor((env.random ?? Math.random)() * (hi - lo + 1)) + lo);
    }
    case "hiddenkey":
      return env.phase === "prompt" ? `<!-- ${a.join("::")} -->` : "";
    case "chatindex":
      return String(env.chatIndex);
    case "lastmessageid":
    case "lastmessageindex":
      return String(env.lastMessageId);
    case "previouscharchat":
    case "lastcharmessage":
      return env.previousCharChat ?? "";
    case "previoususerchat":
    case "lastusermessage":
      return env.previousUserChat ?? "";
    case "blank":
    case "none":
      return "";
    case "br":
    case "newline":
      return `
`;
    case "raw":
    case "path":
    case "source": {
      if (name === "source" && (a[0] === "user" || a[0] === "char"))
        return env.assetUrl?.(`__source_${a[0]}`) ?? "";
      return env.assetUrl?.((a[0] ?? "").trim()) ?? "";
    }
    case "img":
    case "image":
    case "asset":
    case "emotion":
    case "bg": {
      const url = env.assetUrl?.((a[0] ?? "").trim());
      return url ? `<img src="${url}" alt="${(a[0] ?? "").replace(/"/g, "&quot;")}" class="risu-asset">` : "";
    }
    case "assetlist":
      return makeArray(env.assetNames?.() ?? []);
    case "button": {
      const label = a[0] ?? "";
      const trig = (a[1] ?? "").replace(/"/g, "&quot;");
      return `<button class="risu-btn" data-risu-trigger="${trig}">${label}</button>`;
    }
    default:
      return passthrough();
  }
}
var RISU_HINT = /\{\{\s*(?:#(?:when|if|if_pure|each|func)\b|\/\s*\}\}|\/(?:when|if|if_pure|each|func)\s*\}\}|:else|\?|\/\/|(?:getvar|setvar|addvar|setdefaultvar|getglobalvar|gettempvar|settempvar|tempvar|equal|not_equal|greater|less|greater_equal|less_equal|all|any|contains|startswith|endswith|calc|hiddenkey|chat_?index|lastmessageid|previouscharchat|previoususerchat|split|arrayelement|filter|spread|call|slot|arg|button|raw|path|source|img|image|asset|assetlist|trim|lower|upper|and|or|not|random|blank|br)\s*(?:::|\}\}))/i;
function hasRisuSyntax(text) {
  return RISU_HINT.test(text);
}
function renderCbs(text, env) {
  const st = {
    env,
    vars: new Map,
    temp: new Map,
    funcs: new Map,
    slots: [],
    args: [],
    touched: new Set,
    volatile: false,
    depth: 0
  };
  const out = render(text, st);
  return { text: out, touched: st.touched, volatile: st.volatile, sets: st.vars };
}
function parseToggles(src) {
  if (!src)
    return [];
  const defs = [];
  for (const line of src.split(`
`)) {
    const parts = line.split("=");
    if (parts.length < 2 || !parts[0].trim())
      continue;
    const key = parts[0].trim();
    const label = parts[1];
    const t = (parts[2] ?? "").trim().toLowerCase();
    if (t === "select")
      defs.push({ key, label, type: "select", options: (parts.slice(3).join("=") || "").split(",") });
    else if (t === "text" || t === "textarea")
      defs.push({ key, label, type: t, options: [] });
    else if (t === "group" || t === "groupend" || t === "divider" || t === "caption")
      continue;
    else
      defs.push({ key, label, type: "checkbox", options: [] });
  }
  return defs;
}
function defaultToggleValue(def) {
  if (!def)
    return "0";
  if (def.type === "text" || def.type === "textarea")
    return "";
  return "0";
}
function parseDefaultVariables(src) {
  const out = {};
  if (!src)
    return out;
  for (const line of src.split(`
`)) {
    const at = line.indexOf("=");
    if (at <= 0)
      continue;
    out[line.slice(0, at).trim()] = line.slice(at + 1);
  }
  return out;
}

// src/backend.ts
var CACHE_MS = 15000;
var cardCache = new Map;
async function cardInfo(characterId, userId) {
  const key = `${userId ?? ""}:${characterId}`;
  const hit = cardCache.get(key);
  if (hit && Date.now() - hit.fetchedAt < CACHE_MS)
    return hit;
  let info = { isRisu: false, toggles: [], defaults: {}, fetchedAt: Date.now() };
  try {
    const ch = await spindle.characters.get(characterId, userId);
    const ext = ch?.extensions ?? {};
    const risu = ext.risuai;
    const disabled = ext.risubridge?.enabled === false;
    if (risu && typeof risu === "object" && !disabled) {
      info = {
        isRisu: true,
        toggles: parseToggles(typeof risu.toggles === "string" ? risu.toggles : ""),
        defaults: parseDefaultVariables(typeof risu.defaultVariables === "string" ? risu.defaultVariables : ""),
        fetchedAt: Date.now()
      };
    }
  } catch (err) {
    spindle.log.warn(`[risubridge] could not read character ${characterId}: ${err instanceof Error ? err.message : String(err)}`);
  }
  cardCache.set(key, info);
  return info;
}
function persistMacro(key, value) {
  if (value.includes("{{") || value.includes("}}"))
    return "";
  if (value.includes("::"))
    return `{{setchatvar::${key}}}${value}{{/setchatvar}}`;
  return `{{setchatvar::${key}::${value}}}`;
}
function riskIndex(env, messages) {
  const offset = messages.length > 0 && messages[0] && !messages[0].is_user ? 1 : 0;
  const chat = env.chat;
  const lumiLast = typeof chat.lastMessageId === "number" ? chat.lastMessageId : messages.length - 1;
  const dyn = Number(env.dynamicMacros?.chat_index);
  const lumiIndex = Number.isFinite(dyn) && env.dynamicMacros?.chat_index !== undefined ? dyn : lumiLast;
  return { chatIndex: lumiIndex - offset, lastMessageId: lumiLast - offset };
}
async function intercept(ctx) {
  const template = ctx.template;
  if (!template.includes("{{") || !hasRisuSyntax(template))
    return;
  const extra = ctx.env.extra ?? {};
  const characterId = typeof extra.characterId === "string" ? extra.characterId : undefined;
  if (!characterId)
    return;
  const info = await cardInfo(characterId, ctx.userId);
  if (!info.isRisu)
    return;
  const chatVars = ctx.env.variables.chat ?? {};
  const globalVars = ctx.env.variables.global ?? {};
  const toggleDefs = new Map(info.toggles.map((t) => [t.key, t]));
  const messages = Array.isArray(extra.messages) ? extra.messages : [];
  const idx = riskIndex(ctx.env, messages);
  const sets = [];
  const result = renderCbs(template, {
    phase: ctx.phase,
    getChatVar: (k) => chatVars[k],
    onSetChatVar: (k, v) => {
      sets.push([k, v]);
    },
    getGlobalVar: (k) => globalVars[k],
    toggle: (name) => chatVars[`toggle_${name}`] ?? globalVars[`toggle_${name}`] ?? defaultToggleValue(toggleDefs.get(name)),
    defaultVariables: info.defaults,
    names: { user: ctx.env.names.user ?? "User", char: ctx.env.names.char ?? "" },
    chatIndex: idx.chatIndex,
    lastMessageId: idx.lastMessageId,
    previousCharChat: [...messages].reverse().find((m) => m && !m.is_user)?.content ?? "",
    previousUserChat: [...messages].reverse().find((m) => m && m.is_user)?.content ?? ""
  });
  let text = result.text;
  if (ctx.commit && ctx.phase !== "prompt" && sets.length) {
    const last = new Map(sets);
    text += [...last].map(([k, v]) => persistMacro(k, v)).join("");
  }
  return { text, touchedVars: [...result.touched], volatile: result.volatile };
}
async function buildTogglesReply(chatId, characterId, userId) {
  const ch = await spindle.characters.get(characterId, userId);
  const risu = ch?.extensions?.risuai;
  const vars = await spindle.variables.chat.list(chatId).catch(() => ({}));
  const src = risu && typeof risu.toggles === "string" ? risu.toggles : "";
  return {
    type: "toggles",
    chatId,
    characterName: ch?.name ?? "",
    isRisu: Boolean(risu),
    rows: toggleLayout(src, (k) => vars[`toggle_${k}`])
  };
}
spindle.onFrontendMessage(async (payload, userId) => {
  const msg = payload ?? {};
  const chatId = typeof msg.chatId === "string" ? msg.chatId : "";
  const chat = chatId ? await spindle.chats.get(chatId, userId).catch(() => null) : null;
  const characterId = chat?.character_id ?? "";
  if (!chat || !characterId) {
    spindle.sendToFrontend({ type: "toggles_error", error: "no_chat" }, userId);
    return;
  }
  try {
    if (msg.type === "set_toggle" && typeof msg.key === "string" && typeof msg.value === "string") {
      await spindle.variables.chat.set(chatId, `toggle_${msg.key}`, msg.value);
    } else if (msg.type === "reset_toggles") {
      const vars = await spindle.variables.chat.list(chatId);
      for (const k of Object.keys(vars))
        if (k.startsWith("toggle_"))
          await spindle.variables.chat.delete(chatId, k);
    } else if (msg.type !== "get_toggles") {
      return;
    }
    spindle.sendToFrontend(await buildTogglesReply(chatId, characterId, userId), userId);
  } catch (err) {
    spindle.sendToFrontend({ type: "toggles_error", error: err instanceof Error ? err.message : String(err) }, userId);
  }
});
spindle.registerMacroInterceptor(intercept, 10);
spindle.log.info("[risubridge] RisuAI CBS interpreter ready");
