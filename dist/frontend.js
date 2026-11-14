// node_modules/fflate/esm/browser.js
var u8 = Uint8Array;
var u16 = Uint16Array;
var i32 = Int32Array;
var fleb = new u8([0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0, 0, 0, 0]);
var fdeb = new u8([0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13, 0, 0]);
var clim = new u8([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]);
var freb = function(eb, start) {
  var b = new u16(31);
  for (var i = 0;i < 31; ++i) {
    b[i] = start += 1 << eb[i - 1];
  }
  var r = new i32(b[30]);
  for (var i = 1;i < 30; ++i) {
    for (var j = b[i];j < b[i + 1]; ++j) {
      r[j] = j - b[i] << 5 | i;
    }
  }
  return { b, r };
};
var _a = freb(fleb, 2);
var fl = _a.b;
var revfl = _a.r;
fl[28] = 258, revfl[258] = 28;
var _b = freb(fdeb, 0);
var fd = _b.b;
var revfd = _b.r;
var rev = new u16(32768);
for (i = 0;i < 32768; ++i) {
  x = (i & 43690) >> 1 | (i & 21845) << 1;
  x = (x & 52428) >> 2 | (x & 13107) << 2;
  x = (x & 61680) >> 4 | (x & 3855) << 4;
  rev[i] = ((x & 65280) >> 8 | (x & 255) << 8) >> 1;
}
var x;
var i;
var hMap = function(cd, mb, r) {
  var s = cd.length;
  var i = 0;
  var l = new u16(mb);
  for (;i < s; ++i) {
    if (cd[i])
      ++l[cd[i] - 1];
  }
  var le = new u16(mb);
  for (i = 1;i < mb; ++i) {
    le[i] = le[i - 1] + l[i - 1] << 1;
  }
  var co;
  if (r) {
    co = new u16(1 << mb);
    var rvb = 15 - mb;
    for (i = 0;i < s; ++i) {
      if (cd[i]) {
        var sv = i << 4 | cd[i];
        var r_1 = mb - cd[i];
        var v = le[cd[i] - 1]++ << r_1;
        for (var m = v | (1 << r_1) - 1;v <= m; ++v) {
          co[rev[v] >> rvb] = sv;
        }
      }
    }
  } else {
    co = new u16(s);
    for (i = 0;i < s; ++i) {
      if (cd[i]) {
        co[i] = rev[le[cd[i] - 1]++] >> 15 - cd[i];
      }
    }
  }
  return co;
};
var flt = new u8(288);
for (i = 0;i < 144; ++i)
  flt[i] = 8;
var i;
for (i = 144;i < 256; ++i)
  flt[i] = 9;
var i;
for (i = 256;i < 280; ++i)
  flt[i] = 7;
var i;
for (i = 280;i < 288; ++i)
  flt[i] = 8;
var i;
var fdt = new u8(32);
for (i = 0;i < 32; ++i)
  fdt[i] = 5;
var i;
var flrm = /* @__PURE__ */ hMap(flt, 9, 1);
var fdrm = /* @__PURE__ */ hMap(fdt, 5, 1);
var max = function(a) {
  var m = a[0];
  for (var i = 1;i < a.length; ++i) {
    if (a[i] > m)
      m = a[i];
  }
  return m;
};
var bits = function(d, p, m) {
  var o = p / 8 | 0;
  return (d[o] | d[o + 1] << 8) >> (p & 7) & m;
};
var bits16 = function(d, p) {
  var o = p / 8 | 0;
  return (d[o] | d[o + 1] << 8 | d[o + 2] << 16) >> (p & 7);
};
var shft = function(p) {
  return (p + 7) / 8 | 0;
};
var slc = function(v, s, e) {
  if (s == null || s < 0)
    s = 0;
  if (e == null || e > v.length)
    e = v.length;
  return new u8(v.subarray(s, e));
};
var ec = [
  "unexpected EOF",
  "invalid block type",
  "invalid length/literal",
  "invalid distance",
  "stream finished",
  "no stream handler",
  ,
  "no callback",
  "invalid UTF-8 data",
  "extra field too long",
  "date not in range 1980-2099",
  "filename too long",
  "stream finishing",
  "invalid zip data"
];
var err = function(ind, msg, nt) {
  var e = new Error(msg || ec[ind]);
  e.code = ind;
  if (Error.captureStackTrace)
    Error.captureStackTrace(e, err);
  if (!nt)
    throw e;
  return e;
};
var inflt = function(dat, st, buf, dict) {
  var sl = dat.length, dl = dict ? dict.length : 0;
  if (!sl || st.f && !st.l)
    return buf || new u8(0);
  var noBuf = !buf;
  var resize = noBuf || st.i != 2;
  var noSt = st.i;
  if (noBuf)
    buf = new u8(sl * 3);
  var cbuf = function(l) {
    var bl = buf.length;
    if (l > bl) {
      var nbuf = new u8(Math.max(bl * 2, l));
      nbuf.set(buf);
      buf = nbuf;
    }
  };
  var final = st.f || 0, pos = st.p || 0, bt = st.b || 0, { l: lm, d: dm, m: lbt, n: dbt } = st;
  var tbts = sl * 8;
  do {
    if (!lm) {
      final = bits(dat, pos, 1);
      var type = bits(dat, pos + 1, 3);
      pos += 3;
      if (!type) {
        var s = shft(pos) + 4, l = dat[s - 4] | dat[s - 3] << 8, t = s + l;
        if (t > sl) {
          if (noSt)
            err(0);
          break;
        }
        if (resize)
          cbuf(bt + l);
        buf.set(dat.subarray(s, t), bt);
        st.b = bt += l, st.p = pos = t * 8, st.f = final;
        continue;
      } else if (type == 1)
        lm = flrm, dm = fdrm, lbt = 9, dbt = 5;
      else if (type == 2) {
        var hLit = bits(dat, pos, 31) + 257, hcLen = bits(dat, pos + 10, 15) + 4;
        var tl = hLit + bits(dat, pos + 5, 31) + 1;
        pos += 14;
        var ldt = new u8(tl);
        var clt = new u8(19);
        for (var i = 0;i < hcLen; ++i) {
          clt[clim[i]] = bits(dat, pos + i * 3, 7);
        }
        pos += hcLen * 3;
        var clb = max(clt), clbmsk = (1 << clb) - 1;
        var clm = hMap(clt, clb, 1);
        for (var i = 0;i < tl; ) {
          var r = clm[bits(dat, pos, clbmsk)];
          pos += r & 15;
          var s = r >> 4;
          if (s < 16) {
            ldt[i++] = s;
          } else {
            var c = 0, n = 0;
            if (s == 16)
              n = 3 + bits(dat, pos, 3), pos += 2, c = ldt[i - 1];
            else if (s == 17)
              n = 3 + bits(dat, pos, 7), pos += 3;
            else if (s == 18)
              n = 11 + bits(dat, pos, 127), pos += 7;
            while (n--)
              ldt[i++] = c;
          }
        }
        var lt = ldt.subarray(0, hLit), dt = ldt.subarray(hLit);
        lbt = max(lt);
        dbt = max(dt);
        lm = hMap(lt, lbt, 1);
        dm = hMap(dt, dbt, 1);
      } else
        err(1);
      if (pos > tbts) {
        if (noSt)
          err(0);
        break;
      }
    }
    if (resize)
      cbuf(bt + 131072);
    var lms = (1 << lbt) - 1, dms = (1 << dbt) - 1;
    var lpos = pos;
    for (;; lpos = pos) {
      var c = lm[bits16(dat, pos) & lms], sym = c >> 4;
      pos += c & 15;
      if (pos > tbts) {
        if (noSt)
          err(0);
        break;
      }
      if (!c)
        err(2);
      if (sym < 256)
        buf[bt++] = sym;
      else if (sym == 256) {
        lpos = pos, lm = null;
        break;
      } else {
        var add = sym - 254;
        if (sym > 264) {
          var i = sym - 257, b = fleb[i];
          add = bits(dat, pos, (1 << b) - 1) + fl[i];
          pos += b;
        }
        var d = dm[bits16(dat, pos) & dms], dsym = d >> 4;
        if (!d)
          err(3);
        pos += d & 15;
        var dt = fd[dsym];
        if (dsym > 3) {
          var b = fdeb[dsym];
          dt += bits16(dat, pos) & (1 << b) - 1, pos += b;
        }
        if (pos > tbts) {
          if (noSt)
            err(0);
          break;
        }
        if (resize)
          cbuf(bt + 131072);
        var end = bt + add;
        if (bt < dt) {
          var shift = dl - dt, dend = Math.min(dt, end);
          if (shift + bt < 0)
            err(3);
          for (;bt < dend; ++bt)
            buf[bt] = dict[shift + bt];
        }
        for (;bt < end; ++bt)
          buf[bt] = buf[bt - dt];
      }
    }
    st.l = lm, st.p = lpos, st.b = bt, st.f = final;
    if (lm)
      final = 1, st.m = lbt, st.d = dm, st.n = dbt;
  } while (!final);
  return bt != buf.length && noBuf ? slc(buf, 0, bt) : buf.subarray(0, bt);
};
var et = /* @__PURE__ */ new u8(0);
var b2 = function(d, b) {
  return d[b] | d[b + 1] << 8;
};
var b4 = function(d, b) {
  return (d[b] | d[b + 1] << 8 | d[b + 2] << 16 | d[b + 3] << 24) >>> 0;
};
var b8 = function(d, b) {
  return b4(d, b) + b4(d, b + 4) * 4294967296;
};
function inflateSync(data, opts) {
  return inflt(data, { i: 2 }, opts && opts.out, opts && opts.dictionary);
}
var td = typeof TextDecoder != "undefined" && /* @__PURE__ */ new TextDecoder;
var tds = 0;
try {
  td.decode(et, { stream: true });
  tds = 1;
} catch (e) {}
var dutf8 = function(d) {
  for (var r = "", i = 0;; ) {
    var c = d[i++];
    var eb = (c > 127) + (c > 223) + (c > 239);
    if (i + eb > d.length)
      return { s: r, r: slc(d, i - 1) };
    if (!eb)
      r += String.fromCharCode(c);
    else if (eb == 3) {
      c = ((c & 15) << 18 | (d[i++] & 63) << 12 | (d[i++] & 63) << 6 | d[i++] & 63) - 65536, r += String.fromCharCode(55296 | c >> 10, 56320 | c & 1023);
    } else if (eb & 1)
      r += String.fromCharCode((c & 31) << 6 | d[i++] & 63);
    else
      r += String.fromCharCode((c & 15) << 12 | (d[i++] & 63) << 6 | d[i++] & 63);
  }
};
function strFromU8(dat, latin1) {
  if (latin1) {
    var r = "";
    for (var i = 0;i < dat.length; i += 16384)
      r += String.fromCharCode.apply(null, dat.subarray(i, i + 16384));
    return r;
  } else if (td) {
    return td.decode(dat);
  } else {
    var _a = dutf8(dat), { s, r } = _a;
    if (r.length)
      err(8);
    return s;
  }
}
var slzh = function(d, b) {
  return b + 30 + b2(d, b + 26) + b2(d, b + 28);
};
var zh = function(d, b, z) {
  var fnl = b2(d, b + 28), fn = strFromU8(d.subarray(b + 46, b + 46 + fnl), !(b2(d, b + 8) & 2048)), es = b + 46 + fnl, bs = b4(d, b + 20);
  var _a = z && bs == 4294967295 ? z64e(d, es) : [bs, b4(d, b + 24), b4(d, b + 42)], sc = _a[0], su = _a[1], off = _a[2];
  return [b2(d, b + 10), sc, su, fn, es + b2(d, b + 30) + b2(d, b + 32), off];
};
var z64e = function(d, b) {
  for (;b2(d, b) != 1; b += 4 + b2(d, b + 2))
    ;
  return [b8(d, b + 12), b8(d, b + 4), b8(d, b + 20)];
};
function unzipSync(data, opts) {
  var files = {};
  var e = data.length - 22;
  for (;b4(data, e) != 101010256; --e) {
    if (!e || data.length - e > 65558)
      err(13);
  }
  var c = b2(data, e + 8);
  if (!c)
    return {};
  var o = b4(data, e + 16);
  var z = o == 4294967295 || c == 65535;
  if (z) {
    var ze = b4(data, e - 12);
    z = b4(data, ze) == 101075792;
    if (z) {
      c = b4(data, ze + 32);
      o = b4(data, ze + 48);
    }
  }
  var fltr = opts && opts.filter;
  for (var i = 0;i < c; ++i) {
    var _a = zh(data, o, z), c_2 = _a[0], sc = _a[1], su = _a[2], fn = _a[3], no = _a[4], off = _a[5], b = slzh(data, off);
    o = no;
    if (!fltr || fltr({
      name: fn,
      size: sc,
      originalSize: su,
      compression: c_2
    })) {
      if (!c_2)
        files[fn] = slc(data, b, b + sc);
      else if (c_2 == 8)
        files[fn] = inflateSync(data.subarray(b, b + sc), { out: new u8(su) });
      else
        err(14, "unknown compression type " + c_2);
    }
  }
  return files;
}

// src/risu-file.ts
var RPACK_DECODE_MAP = new Uint8Array([
  44,
  247,
  132,
  139,
  201,
  101,
  251,
  182,
  159,
  174,
  179,
  3,
  45,
  1,
  105,
  116,
  31,
  228,
  163,
  236,
  238,
  92,
  52,
  33,
  147,
  74,
  15,
  106,
  226,
  98,
  2,
  158,
  34,
  156,
  253,
  60,
  252,
  113,
  199,
  198,
  173,
  89,
  103,
  5,
  112,
  109,
  138,
  68,
  18,
  250,
  36,
  134,
  95,
  175,
  209,
  122,
  71,
  206,
  254,
  80,
  99,
  221,
  81,
  6,
  111,
  24,
  224,
  82,
  168,
  9,
  157,
  86,
  115,
  76,
  184,
  83,
  108,
  195,
  160,
  14,
  25,
  207,
  62,
  13,
  126,
  7,
  50,
  104,
  70,
  234,
  72,
  249,
  153,
  46,
  171,
  164,
  73,
  32,
  94,
  85,
  53,
  56,
  12,
  188,
  211,
  177,
  88,
  22,
  121,
  40,
  10,
  26,
  225,
  242,
  205,
  196,
  57,
  219,
  162,
  186,
  96,
  114,
  118,
  125,
  149,
  239,
  127,
  200,
  192,
  222,
  55,
  148,
  191,
  181,
  20,
  129,
  146,
  37,
  69,
  172,
  231,
  245,
  102,
  167,
  43,
  54,
  90,
  193,
  19,
  227,
  75,
  58,
  232,
  141,
  131,
  27,
  124,
  39,
  176,
  154,
  66,
  235,
  135,
  170,
  220,
  84,
  142,
  120,
  38,
  210,
  87,
  41,
  212,
  183,
  248,
  47,
  143,
  137,
  117,
  240,
  65,
  119,
  194,
  30,
  255,
  216,
  21,
  17,
  229,
  4,
  151,
  23,
  243,
  49,
  208,
  155,
  0,
  215,
  202,
  180,
  79,
  42,
  59,
  217,
  178,
  107,
  218,
  93,
  161,
  63,
  48,
  97,
  189,
  145,
  61,
  78,
  230,
  223,
  190,
  77,
  130,
  140,
  29,
  35,
  16,
  152,
  100,
  244,
  133,
  51,
  123,
  144,
  67,
  187,
  169,
  136,
  241,
  214,
  165,
  28,
  246,
  204,
  110,
  185,
  91,
  11,
  150,
  237,
  213,
  233,
  197,
  203,
  8,
  166,
  128,
  64
]);
function decodeRisum(data) {
  if (data.length < 7 || data[0] !== 111 || data[1] !== 0)
    return null;
  const len = new DataView(data.buffer, data.byteOffset, data.byteLength).getUint32(2, true);
  if (6 + len > data.length)
    return null;
  const enc = data.subarray(6, 6 + len);
  const out = new Uint8Array(enc.length);
  for (let i = 0;i < enc.length; i++)
    out[i] = RPACK_DECODE_MAP[enc[i]];
  try {
    const parsed = JSON.parse(new TextDecoder().decode(out));
    return parsed?.type === "risuModule" ? parsed.module : null;
  } catch {
    return null;
  }
}
function zipStart(bytes) {
  for (let i = 0;i < bytes.length - 3; i++) {
    if (bytes[i] === 80 && bytes[i + 1] === 75 && bytes[i + 2] === 3 && bytes[i + 3] === 4)
      return i;
  }
  return -1;
}
function pngCardJson(bytes) {
  if (!(bytes[0] === 137 && bytes[1] === 80))
    return null;
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  let pos = 8;
  let chara = null;
  while (pos + 8 < bytes.length) {
    const len = view.getUint32(pos);
    const type = String.fromCharCode(...bytes.subarray(pos + 4, pos + 8));
    if (type === "tEXt") {
      const body = bytes.subarray(pos + 8, pos + 8 + len);
      const nul = body.indexOf(0);
      const key = new TextDecoder().decode(body.subarray(0, nul));
      const val = new TextDecoder("latin1").decode(body.subarray(nul + 1));
      if (key === "ccv3")
        chara = val;
      else if (key === "chara" && !chara)
        chara = val;
    }
    if (type === "IEND")
      break;
    pos += 12 + len;
  }
  if (!chara)
    return null;
  try {
    const bin = atob(chara);
    const u8 = Uint8Array.from(bin, (c) => c.charCodeAt(0));
    return JSON.parse(new TextDecoder().decode(u8));
  } catch {
    return null;
  }
}
function readRisuFile(bytes) {
  let card = null;
  let mod = null;
  const start = zipStart(bytes);
  if (start >= 0) {
    try {
      const files = unzipSync(bytes.subarray(start), { filter: (f) => f.name === "card.json" || f.name === "module.risum" });
      if (files["card.json"])
        card = JSON.parse(new TextDecoder().decode(files["card.json"]));
      if (files["module.risum"])
        mod = decodeRisum(files["module.risum"]);
    } catch {}
  }
  if (!card)
    card = pngCardJson(bytes);
  if (!card)
    return { error: "리스 카드 파일이 아니에요 (.charx / .png / .jpeg 원본을 골라 주세요)." };
  const data = card.data ?? card;
  const risu = data?.extensions?.risuai ?? {};
  const triggers = [...Array.isArray(mod?.trigger) ? mod.trigger : [], ...Array.isArray(risu.triggerscript) ? risu.triggerscript : []];
  const regex = [...Array.isArray(mod?.regex) ? mod.regex : [], ...Array.isArray(risu.customScripts) ? risu.customScripts : []];
  return {
    triggers,
    regex: regex.map((r) => ({ comment: r.comment, in: r.in, out: r.out, type: r.type, flag: r.flag, ableFlag: r.ableFlag })),
    lowLevelAccess: Boolean(mod?.lowLevelAccess || risu.lowLevelAccess),
    cardName: String(data?.name ?? ""),
    linkedAt: Date.now()
  };
}

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
.rb-btn{white-space:nowrap;flex-shrink:0;padding:6px 12px;border-radius:8px;border:1px solid color-mix(in srgb,currentColor 25%,transparent);background:transparent;color:inherit;font:inherit;cursor:pointer}
.rb-empty{opacity:.7}
.rb-regex{margin-top:6px;padding:10px;border-radius:10px;background:color-mix(in srgb,currentColor 6%,transparent);display:flex;flex-direction:column;gap:8px}
.rb-regex-row{display:flex;justify-content:space-between;align-items:center;gap:8px}
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
    } else {
      head.textContent = `${reply.characterName} · 이 채팅에만 적용돼요. 다음 답변부터 반영됩니다.`;
      body.append(head, ...reply.rows.map(rowEl));
    }
    if (reply.regex && reply.regex.total > 0) {
      const box = document.createElement("div");
      box.className = "rb-regex";
      const title = document.createElement("div");
      title.className = "rb-group";
      title.style.marginTop = "0";
      title.textContent = "상태창·화면 꾸미기";
      const line = document.createElement("div");
      line.className = "rb-regex-row";
      const info = document.createElement("span");
      const btn = document.createElement("button");
      btn.className = "rb-btn";
      if (reply.regexOptOut || reply.regex.synced === 0) {
        info.textContent = `${reply.regex.total}개 · 리스 방식으로 고치지 않음`;
        btn.textContent = "리스처럼 적용";
        btn.addEventListener("click", () => {
          btn.disabled = true;
          send({ type: "regex_apply", chatId: currentChat });
        });
      } else {
        info.textContent = `정상 작동 중 (${reply.regex.active}/${reply.regex.total}개 켜짐, 제작자가 꺼둔 건 꺼둠)`;
        btn.textContent = "원래대로";
        btn.addEventListener("click", () => {
          btn.disabled = true;
          send({ type: "regex_revert", chatId: currentChat });
        });
      }
      line.append(info, btn);
      box.append(title, line);
      body.append(box);
    }
    if (reply.isRisu && (reply.linked || reply.usesButtons))
      body.append(linkBox(reply));
    if (!settable.length && !(reply.regex && reply.regex.total > 0))
      return;
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
  function linkBox(reply) {
    const box = document.createElement("div");
    box.className = "rb-regex";
    const title = document.createElement("div");
    title.className = "rb-group";
    title.style.marginTop = "0";
    title.textContent = "카드 속 버튼";
    const line = document.createElement("div");
    line.className = "rb-regex-row";
    const info = document.createElement("span");
    const l = reply.linked;
    info.textContent = l ? `연결됨${l.lua ? " · Lua 있음" : ""}${l.manual ? ` · 버튼 트리거 ${l.manual}개` : ""}` : "이 카드의 버튼을 쓰려면 처음 가져왔던 원본 카드 파일을 한 번 골라 주세요. (확장을 켠 뒤에 가져온 카드는 자동으로 연결돼요)";
    const btn = document.createElement("button");
    btn.className = "rb-btn";
    btn.textContent = l ? "다시 연결" : "원본 파일 연결";
    btn.addEventListener("click", async () => {
      try {
        const files = await ctx.uploads.pickFile({ accept: [".charx", ".png", ".jpeg", ".jpg", ".risum"], maxSizeBytes: 200 * 1024 * 1024 });
        const f = files?.[0];
        if (!f)
          return;
        const data = readRisuFile(f.bytes);
        if ("error" in data) {
          info.textContent = data.error;
          return;
        }
        info.textContent = "연결하는 중…";
        btn.disabled = true;
        send({ type: "link_original", chatId: currentChat, data });
      } catch (err) {
        info.textContent = `파일을 읽지 못했어요: ${err instanceof Error ? err.message : String(err)}`;
      }
    });
    line.append(info, btn);
    box.append(title, line);
    return box;
  }
  function findRisuTarget(ev) {
    for (const node of ev.composedPath()) {
      if (!(node instanceof Element))
        continue;
      const btn = node.getAttribute("risu-btn");
      if (btn !== null)
        return { kind: "btn", value: btn };
      const trig = node.getAttribute("risu-trigger") ?? node.getAttribute("data-risu-trigger");
      if (trig !== null && trig !== "")
        return { kind: "trigger", value: trig };
    }
    return null;
  }
  const onDocClick = (ev) => {
    const hit = findRisuTarget(ev);
    if (!hit)
      return;
    const chatId = ctx.getActiveChat().chatId;
    if (!chatId)
      return;
    ev.preventDefault();
    ev.stopPropagation();
    send({ type: "risu_click", chatId, kind: hit.kind, value: hit.value });
  };
  document.addEventListener("click", onDocClick, true);
  function showPrompt(msg) {
    const m = ctx.ui.showModal({ title: msg.kind === "normal" ? "알림" : "입력", width: 420 });
    const wrap = document.createElement("div");
    wrap.className = "rb-wrap";
    const style = document.createElement("style");
    style.textContent = CSS;
    const text = document.createElement("div");
    text.style.whiteSpace = "pre-wrap";
    text.textContent = msg.message ?? "";
    wrap.append(text);
    let answered = false;
    const reply = (value) => {
      if (answered)
        return;
      answered = true;
      send({ type: "risu_prompt_reply", id: msg.id, value });
      m.dismiss();
    };
    const foot = document.createElement("div");
    foot.className = "rb-foot";
    if (msg.kind === "select") {
      (msg.options ?? []).forEach((opt, i) => {
        const b = document.createElement("button");
        b.className = "rb-btn";
        b.textContent = opt;
        b.addEventListener("click", () => reply(String(i)));
        wrap.append(b);
      });
    } else if (msg.kind === "input") {
      const input = document.createElement("textarea");
      input.rows = 3;
      input.style.cssText = "width:100%;box-sizing:border-box;padding:8px;border-radius:8px;background:transparent;color:inherit;border:1px solid color-mix(in srgb,currentColor 25%,transparent);font:inherit";
      wrap.append(input);
      const ok = document.createElement("button");
      ok.className = "rb-btn";
      ok.textContent = "확인";
      ok.addEventListener("click", () => reply(input.value));
      const cancel = document.createElement("button");
      cancel.className = "rb-btn";
      cancel.textContent = "취소";
      cancel.addEventListener("click", () => reply(null));
      foot.append(cancel, ok);
      setTimeout(() => input.focus(), 50);
    } else {
      const ok = document.createElement("button");
      ok.className = "rb-btn";
      ok.textContent = "확인";
      ok.addEventListener("click", () => reply(""));
      foot.append(document.createElement("span"), ok);
    }
    wrap.append(foot);
    m.root.append(style, wrap);
    m.onDismiss(() => reply(null));
  }
  function notice(message) {
    const m = ctx.ui.showModal({ title: "리스 버튼", width: 400 });
    const d = document.createElement("div");
    d.style.cssText = "font-size:14px;line-height:1.5";
    d.textContent = message;
    m.root.append(d);
  }
  function refreshDisplay() {
    try {
      ctx.display?.invalidate(["*"]);
    } catch {}
  }
  const CARD_EXT = /\.(charx|png|jpe?g|risum)$/i;
  async function inspectFiles(files) {
    for (const file of files) {
      if (!CARD_EXT.test(file.name) || file.size > 200 * 1024 * 1024)
        continue;
      try {
        const data = readRisuFile(new Uint8Array(await file.arrayBuffer()));
        if ("error" in data || !data.cardName)
          continue;
        if (!data.triggers.length && !data.regex.some((r) => r.ableFlag && r.flag))
          continue;
        send({ type: "pending_link", data });
      } catch {}
    }
  }
  const onFileChange = (ev) => {
    const input = ev.target;
    if (input?.type === "file" && input.files?.length)
      inspectFiles(Array.from(input.files));
  };
  const onDrop = (ev) => {
    const files = ev.dataTransfer?.files;
    if (files?.length)
      inspectFiles(Array.from(files));
  };
  document.addEventListener("change", onFileChange, true);
  document.addEventListener("drop", onDrop, true);
  const FIXED_RE = /position\s*:\s*fixed/i;
  function releaseFixed() {
    for (const host of Array.from(document.querySelectorAll("[data-lumiverse-html-island]"))) {
      const root = host.shadowRoot;
      if (!root)
        continue;
      const css = Array.from(root.querySelectorAll("style")).map((st) => st.textContent ?? "").join(`
`);
      if (!FIXED_RE.test(css) && !FIXED_RE.test(root.innerHTML.slice(0, 200000)))
        continue;
      for (let el = host.parentElement;el && el !== document.body; el = el.parentElement) {
        if (el.dataset.risuUncontained === "1")
          continue;
        const cs = getComputedStyle(el);
        if (cs.contain && cs.contain !== "none") {
          el.style.setProperty("contain", "none", "important");
          el.dataset.risuUncontained = "1";
        }
      }
    }
  }
  let fixedTimer = null;
  const scheduleRelease = () => {
    if (fixedTimer)
      return;
    fixedTimer = setTimeout(() => {
      fixedTimer = null;
      try {
        releaseFixed();
      } catch {}
    }, 400);
  };
  const fixedObserver = new MutationObserver(scheduleRelease);
  fixedObserver.observe(document.body, { childList: true, subtree: true });
  document.addEventListener("click", scheduleRelease, true);
  scheduleRelease();
  function measureInputBar() {
    let inset = 0;
    const ta = document.querySelector("textarea");
    for (let el = ta;el && el !== document.body; el = el.parentElement) {
      const r = el.getBoundingClientRect();
      if (r.bottom >= window.innerHeight - 8 && r.height < window.innerHeight / 2)
        inset = Math.max(inset, window.innerHeight - r.top);
    }
    document.documentElement.style.setProperty("--risu-safe-bottom", `${Math.round(inset)}px`);
  }
  const insetTimer = setInterval(measureInputBar, 1500);
  window.addEventListener("resize", measureInputBar);
  measureInputBar();
  const offClick = action.onClick(open);
  const offMsg = ctx.onBackendMessage((payload) => {
    const msg = payload;
    if (msg?.type === "risu_reload") {
      refreshDisplay();
      return;
    }
    if (msg?.type === "toggles") {
      render(payload);
      if (payload.changed)
        refreshDisplay();
    } else if (msg?.type === "risu_prompt")
      showPrompt(payload);
    else if (msg?.type === "risu_notice")
      notice(String(payload.message ?? ""));
    else if (msg?.type === "toggles_error" && body)
      body.textContent = msg.error === "no_chat" ? "채팅을 찾을 수 없어요." : `오류: ${msg.error}`;
  });
  return () => {
    offClick();
    offMsg();
    document.removeEventListener("click", onDocClick, true);
    document.removeEventListener("change", onFileChange, true);
    document.removeEventListener("drop", onDrop, true);
    document.removeEventListener("click", scheduleRelease, true);
    fixedObserver.disconnect();
    clearInterval(insetTimer);
    window.removeEventListener("resize", measureInputBar);
    if (fixedTimer)
      clearTimeout(fixedTimer);
    action.destroy();
    modal?.dismiss();
  };
}
export {
  setup
};
