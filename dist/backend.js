// @bun
var __defProp = Object.defineProperty;
var __commonJS = (cb, mod) => () => (mod || cb((mod = { exports: {} }).exports, mod), mod.exports);
var __exportCjs = (target, getters, setters) => {
  for (var name in getters)
    __defProp(target, name, {
      get: getters[name],
      set: setters[name],
      enumerable: true,
      configurable: true
    });
};

// node_modules/fengari/src/luaconf.js
var require_luaconf = __commonJS(function(exports, module) {
  var conf = {}.FENGARICONF ? JSON.parse({}.FENGARICONF) : {};
  var {
    LUA_VERSION_MAJOR,
    LUA_VERSION_MINOR,
    to_luastring
  } = require_defs();
  var LUA_PATH_SEP = ";";
  exports.LUA_PATH_SEP = LUA_PATH_SEP;
  var LUA_PATH_MARK = "?";
  exports.LUA_PATH_MARK = LUA_PATH_MARK;
  var LUA_EXEC_DIR = "!";
  exports.LUA_EXEC_DIR = LUA_EXEC_DIR;
  var LUA_VDIR = LUA_VERSION_MAJOR + "." + LUA_VERSION_MINOR;
  exports.LUA_VDIR = LUA_VDIR;
  if (typeof process === "undefined") {
    const LUA_DIRSEP = "/";
    exports.LUA_DIRSEP = LUA_DIRSEP;
    const LUA_LDIR = "./lua/" + LUA_VDIR + "/";
    exports.LUA_LDIR = LUA_LDIR;
    const LUA_JSDIR = LUA_LDIR;
    exports.LUA_JSDIR = LUA_JSDIR;
    const LUA_PATH_DEFAULT = to_luastring(LUA_LDIR + "?.lua;" + LUA_LDIR + "?/init.lua;" + "./?.lua;./?/init.lua");
    exports.LUA_PATH_DEFAULT = LUA_PATH_DEFAULT;
    const LUA_JSPATH_DEFAULT = to_luastring(LUA_JSDIR + "?.js;" + LUA_JSDIR + "loadall.js;./?.js");
    exports.LUA_JSPATH_DEFAULT = LUA_JSPATH_DEFAULT;
  } else if ({ platform: () => "linux", tmpdir: () => "/tmp", homedir: () => "/", EOL: `
` }.platform() === "win32") {
    const LUA_DIRSEP = "\\";
    exports.LUA_DIRSEP = LUA_DIRSEP;
    const LUA_LDIR = "!\\lua\\";
    exports.LUA_LDIR = LUA_LDIR;
    const LUA_JSDIR = "!\\";
    exports.LUA_JSDIR = LUA_JSDIR;
    const LUA_SHRDIR = "!\\..\\share\\lua\\" + LUA_VDIR + "\\";
    exports.LUA_SHRDIR = LUA_SHRDIR;
    const LUA_PATH_DEFAULT = to_luastring(LUA_LDIR + "?.lua;" + LUA_LDIR + "?\\init.lua;" + LUA_JSDIR + "?.lua;" + LUA_JSDIR + "?\\init.lua;" + LUA_SHRDIR + "?.lua;" + LUA_SHRDIR + "?\\init.lua;" + ".\\?.lua;.\\?\\init.lua");
    exports.LUA_PATH_DEFAULT = LUA_PATH_DEFAULT;
    const LUA_JSPATH_DEFAULT = to_luastring(LUA_JSDIR + "?.js;" + LUA_JSDIR + "..\\share\\lua\\" + LUA_VDIR + "\\?.js;" + LUA_JSDIR + "loadall.js;.\\?.js");
    exports.LUA_JSPATH_DEFAULT = LUA_JSPATH_DEFAULT;
  } else {
    const LUA_DIRSEP = "/";
    exports.LUA_DIRSEP = LUA_DIRSEP;
    const LUA_ROOT = "/usr/local/";
    exports.LUA_ROOT = LUA_ROOT;
    const LUA_ROOT2 = "/usr/";
    const LUA_LDIR = LUA_ROOT + "share/lua/" + LUA_VDIR + "/";
    const LUA_LDIR2 = LUA_ROOT2 + "share/lua/" + LUA_VDIR + "/";
    exports.LUA_LDIR = LUA_LDIR;
    const LUA_JSDIR = LUA_LDIR;
    exports.LUA_JSDIR = LUA_JSDIR;
    const LUA_JSDIR2 = LUA_LDIR2;
    const LUA_PATH_DEFAULT = to_luastring(LUA_LDIR + "?.lua;" + LUA_LDIR + "?/init.lua;" + LUA_LDIR2 + "?.lua;" + LUA_LDIR2 + "?/init.lua;" + "./?.lua;./?/init.lua");
    exports.LUA_PATH_DEFAULT = LUA_PATH_DEFAULT;
    const LUA_JSPATH_DEFAULT = to_luastring(LUA_JSDIR + "?.js;" + LUA_JSDIR + "loadall.js;" + LUA_JSDIR2 + "?.js;" + LUA_JSDIR2 + "loadall.js;" + "./?.js");
    exports.LUA_JSPATH_DEFAULT = LUA_JSPATH_DEFAULT;
  }
  var LUA_COMPAT_FLOATSTRING = conf.LUA_COMPAT_FLOATSTRING || false;
  var LUA_MAXINTEGER = 2147483647;
  var LUA_MININTEGER = -2147483648;
  var LUAI_MAXSTACK = conf.LUAI_MAXSTACK || 1e6;
  var LUA_IDSIZE = conf.LUA_IDSIZE || 60 - 1;
  var lua_integer2str = function(n) {
    return String(n);
  };
  var lua_number2str = function(n) {
    return String(Number(n.toPrecision(14)));
  };
  var lua_numbertointeger = function(n) {
    return n >= LUA_MININTEGER && n < -LUA_MININTEGER ? n : false;
  };
  var LUA_INTEGER_FRMLEN = "";
  var LUA_NUMBER_FRMLEN = "";
  var LUA_INTEGER_FMT = `%${LUA_INTEGER_FRMLEN}d`;
  var LUA_NUMBER_FMT = "%.14g";
  var lua_getlocaledecpoint = function() {
    return 46;
  };
  var luai_apicheck = function(l, e) {
    if (!e)
      throw Error(e);
  };
  var LUAL_BUFFERSIZE = conf.LUAL_BUFFERSIZE || 8192;
  var frexp = function(value) {
    if (value === 0)
      return [value, 0];
    var data = new DataView(new ArrayBuffer(8));
    data.setFloat64(0, value);
    var bits = data.getUint32(0) >>> 20 & 2047;
    if (bits === 0) {
      data.setFloat64(0, value * Math.pow(2, 64));
      bits = (data.getUint32(0) >>> 20 & 2047) - 64;
    }
    var exponent = bits - 1022;
    var mantissa = ldexp(value, -exponent);
    return [mantissa, exponent];
  };
  var ldexp = function(mantissa, exponent) {
    var steps = Math.min(3, Math.ceil(Math.abs(exponent) / 1023));
    var result = mantissa;
    for (var i = 0;i < steps; i++)
      result *= Math.pow(2, Math.floor((exponent + i) / steps));
    return result;
  };
  exports.LUAI_MAXSTACK = LUAI_MAXSTACK;
  exports.LUA_COMPAT_FLOATSTRING = LUA_COMPAT_FLOATSTRING;
  exports.LUA_IDSIZE = LUA_IDSIZE;
  exports.LUA_INTEGER_FMT = LUA_INTEGER_FMT;
  exports.LUA_INTEGER_FRMLEN = LUA_INTEGER_FRMLEN;
  exports.LUA_MAXINTEGER = LUA_MAXINTEGER;
  exports.LUA_MININTEGER = LUA_MININTEGER;
  exports.LUA_NUMBER_FMT = LUA_NUMBER_FMT;
  exports.LUA_NUMBER_FRMLEN = LUA_NUMBER_FRMLEN;
  exports.LUAL_BUFFERSIZE = LUAL_BUFFERSIZE;
  exports.frexp = frexp;
  exports.ldexp = ldexp;
  exports.lua_getlocaledecpoint = lua_getlocaledecpoint;
  exports.lua_integer2str = lua_integer2str;
  exports.lua_number2str = lua_number2str;
  exports.lua_numbertointeger = lua_numbertointeger;
  exports.luai_apicheck = luai_apicheck;
});

// node_modules/fengari/src/defs.js
var require_defs = __commonJS(function(exports, module) {
  var luastring_from;
  if (typeof Uint8Array.from === "function") {
    luastring_from = Uint8Array.from.bind(Uint8Array);
  } else {
    luastring_from = function(a) {
      let i = 0;
      let len = a.length;
      let r = new Uint8Array(len);
      while (len > i)
        r[i] = a[i++];
      return r;
    };
  }
  var luastring_indexOf;
  if (typeof new Uint8Array().indexOf === "function") {
    luastring_indexOf = function(s, v, i) {
      return s.indexOf(v, i);
    };
  } else {
    let array_indexOf = [].indexOf;
    if (array_indexOf.call(new Uint8Array(1), 0) !== 0)
      throw Error("missing .indexOf");
    luastring_indexOf = function(s, v, i) {
      return array_indexOf.call(s, v, i);
    };
  }
  var luastring_of;
  if (typeof Uint8Array.of === "function") {
    luastring_of = Uint8Array.of.bind(Uint8Array);
  } else {
    luastring_of = function() {
      return luastring_from(arguments);
    };
  }
  var is_luastring = function(s) {
    return s instanceof Uint8Array;
  };
  var luastring_eq = function(a, b) {
    if (a !== b) {
      let len = a.length;
      if (len !== b.length)
        return false;
      for (let i = 0;i < len; i++)
        if (a[i] !== b[i])
          return false;
    }
    return true;
  };
  var unicode_error_message = "cannot convert invalid utf8 to javascript string";
  var to_jsstring = function(value, from, to, replacement_char) {
    if (!is_luastring(value))
      throw new TypeError("to_jsstring expects a Uint8Array");
    if (to === undefined) {
      to = value.length;
    } else {
      to = Math.min(value.length, to);
    }
    let str = "";
    for (let i = from !== undefined ? from : 0;i < to; ) {
      let u0 = value[i++];
      if (u0 < 128) {
        str += String.fromCharCode(u0);
      } else if (u0 < 194 || u0 > 244) {
        if (!replacement_char)
          throw RangeError(unicode_error_message);
        str += "\uFFFD";
      } else if (u0 <= 223) {
        if (i >= to) {
          if (!replacement_char)
            throw RangeError(unicode_error_message);
          str += "\uFFFD";
          continue;
        }
        let u1 = value[i++];
        if ((u1 & 192) !== 128) {
          if (!replacement_char)
            throw RangeError(unicode_error_message);
          str += "\uFFFD";
          continue;
        }
        str += String.fromCharCode(((u0 & 31) << 6) + (u1 & 63));
      } else if (u0 <= 239) {
        if (i + 1 >= to) {
          if (!replacement_char)
            throw RangeError(unicode_error_message);
          str += "\uFFFD";
          continue;
        }
        let u1 = value[i++];
        if ((u1 & 192) !== 128) {
          if (!replacement_char)
            throw RangeError(unicode_error_message);
          str += "\uFFFD";
          continue;
        }
        let u2 = value[i++];
        if ((u2 & 192) !== 128) {
          if (!replacement_char)
            throw RangeError(unicode_error_message);
          str += "\uFFFD";
          continue;
        }
        let u = ((u0 & 15) << 12) + ((u1 & 63) << 6) + (u2 & 63);
        if (u <= 65535) {
          str += String.fromCharCode(u);
        } else {
          u -= 65536;
          let s1 = (u >> 10) + 55296;
          let s2 = u % 1024 + 56320;
          str += String.fromCharCode(s1, s2);
        }
      } else {
        if (i + 2 >= to) {
          if (!replacement_char)
            throw RangeError(unicode_error_message);
          str += "\uFFFD";
          continue;
        }
        let u1 = value[i++];
        if ((u1 & 192) !== 128) {
          if (!replacement_char)
            throw RangeError(unicode_error_message);
          str += "\uFFFD";
          continue;
        }
        let u2 = value[i++];
        if ((u2 & 192) !== 128) {
          if (!replacement_char)
            throw RangeError(unicode_error_message);
          str += "\uFFFD";
          continue;
        }
        let u3 = value[i++];
        if ((u3 & 192) !== 128) {
          if (!replacement_char)
            throw RangeError(unicode_error_message);
          str += "\uFFFD";
          continue;
        }
        let u = ((u0 & 7) << 18) + ((u1 & 63) << 12) + ((u2 & 63) << 6) + (u3 & 63);
        u -= 65536;
        let s1 = (u >> 10) + 55296;
        let s2 = u % 1024 + 56320;
        str += String.fromCharCode(s1, s2);
      }
    }
    return str;
  };
  var uri_allowed = ";,/?:@&=+$abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789,-_.!~*'()#".split("").reduce(function(uri_allowed, c) {
    uri_allowed[c.charCodeAt(0)] = true;
    return uri_allowed;
  }, {});
  var to_uristring = function(a) {
    if (!is_luastring(a))
      throw new TypeError("to_uristring expects a Uint8Array");
    let s = "";
    for (let i = 0;i < a.length; i++) {
      let v = a[i];
      if (uri_allowed[v]) {
        s += String.fromCharCode(v);
      } else {
        s += "%" + (v < 16 ? "0" : "") + v.toString(16);
      }
    }
    return s;
  };
  var to_luastring_cache = {};
  var to_luastring = function(str, cache) {
    if (typeof str !== "string")
      throw new TypeError("to_luastring expects a javascript string");
    if (cache) {
      let cached = to_luastring_cache[str];
      if (is_luastring(cached))
        return cached;
    }
    let len = str.length;
    let outU8Array = Array(len);
    let outIdx = 0;
    for (let i = 0;i < len; ++i) {
      let u = str.charCodeAt(i);
      if (u <= 127) {
        outU8Array[outIdx++] = u;
      } else if (u <= 2047) {
        outU8Array[outIdx++] = 192 | u >> 6;
        outU8Array[outIdx++] = 128 | u & 63;
      } else {
        if (u >= 55296 && u <= 56319 && i + 1 < len) {
          let v = str.charCodeAt(i + 1);
          if (v >= 56320 && v <= 57343) {
            i++;
            u = (u - 55296) * 1024 + v + 9216;
          }
        }
        if (u <= 65535) {
          outU8Array[outIdx++] = 224 | u >> 12;
          outU8Array[outIdx++] = 128 | u >> 6 & 63;
          outU8Array[outIdx++] = 128 | u & 63;
        } else {
          outU8Array[outIdx++] = 240 | u >> 18;
          outU8Array[outIdx++] = 128 | u >> 12 & 63;
          outU8Array[outIdx++] = 128 | u >> 6 & 63;
          outU8Array[outIdx++] = 128 | u & 63;
        }
      }
    }
    outU8Array = luastring_from(outU8Array);
    if (cache)
      to_luastring_cache[str] = outU8Array;
    return outU8Array;
  };
  var from_userstring = function(str) {
    if (!is_luastring(str)) {
      if (typeof str === "string") {
        str = to_luastring(str);
      } else {
        throw new TypeError("expects an array of bytes or javascript string");
      }
    }
    return str;
  };
  exports.luastring_from = luastring_from;
  exports.luastring_indexOf = luastring_indexOf;
  exports.luastring_of = luastring_of;
  exports.is_luastring = is_luastring;
  exports.luastring_eq = luastring_eq;
  exports.to_jsstring = to_jsstring;
  exports.to_uristring = to_uristring;
  exports.to_luastring = to_luastring;
  exports.from_userstring = from_userstring;
  var LUA_SIGNATURE = to_luastring("\x1BLua");
  var LUA_VERSION_MAJOR = "5";
  var LUA_VERSION_MINOR = "3";
  var LUA_VERSION_NUM = 503;
  var LUA_VERSION_RELEASE = "4";
  var LUA_VERSION = "Lua " + LUA_VERSION_MAJOR + "." + LUA_VERSION_MINOR;
  var LUA_RELEASE = LUA_VERSION + "." + LUA_VERSION_RELEASE;
  var LUA_COPYRIGHT = LUA_RELEASE + "  Copyright (C) 1994-2017 Lua.org, PUC-Rio";
  var LUA_AUTHORS = "R. Ierusalimschy, L. H. de Figueiredo, W. Celes";
  exports.LUA_SIGNATURE = LUA_SIGNATURE;
  exports.LUA_VERSION_MAJOR = LUA_VERSION_MAJOR;
  exports.LUA_VERSION_MINOR = LUA_VERSION_MINOR;
  exports.LUA_VERSION_NUM = LUA_VERSION_NUM;
  exports.LUA_VERSION_RELEASE = LUA_VERSION_RELEASE;
  exports.LUA_VERSION = LUA_VERSION;
  exports.LUA_RELEASE = LUA_RELEASE;
  exports.LUA_COPYRIGHT = LUA_COPYRIGHT;
  exports.LUA_AUTHORS = LUA_AUTHORS;
  var thread_status = {
    LUA_OK: 0,
    LUA_YIELD: 1,
    LUA_ERRRUN: 2,
    LUA_ERRSYNTAX: 3,
    LUA_ERRMEM: 4,
    LUA_ERRGCMM: 5,
    LUA_ERRERR: 6
  };
  var constant_types = {
    LUA_TNONE: -1,
    LUA_TNIL: 0,
    LUA_TBOOLEAN: 1,
    LUA_TLIGHTUSERDATA: 2,
    LUA_TNUMBER: 3,
    LUA_TSTRING: 4,
    LUA_TTABLE: 5,
    LUA_TFUNCTION: 6,
    LUA_TUSERDATA: 7,
    LUA_TTHREAD: 8,
    LUA_NUMTAGS: 9
  };
  constant_types.LUA_TSHRSTR = constant_types.LUA_TSTRING | 0 << 4;
  constant_types.LUA_TLNGSTR = constant_types.LUA_TSTRING | 1 << 4;
  constant_types.LUA_TNUMFLT = constant_types.LUA_TNUMBER | 0 << 4;
  constant_types.LUA_TNUMINT = constant_types.LUA_TNUMBER | 1 << 4;
  constant_types.LUA_TLCL = constant_types.LUA_TFUNCTION | 0 << 4;
  constant_types.LUA_TLCF = constant_types.LUA_TFUNCTION | 1 << 4;
  constant_types.LUA_TCCL = constant_types.LUA_TFUNCTION | 2 << 4;
  var LUA_OPADD = 0;
  var LUA_OPSUB = 1;
  var LUA_OPMUL = 2;
  var LUA_OPMOD = 3;
  var LUA_OPPOW = 4;
  var LUA_OPDIV = 5;
  var LUA_OPIDIV = 6;
  var LUA_OPBAND = 7;
  var LUA_OPBOR = 8;
  var LUA_OPBXOR = 9;
  var LUA_OPSHL = 10;
  var LUA_OPSHR = 11;
  var LUA_OPUNM = 12;
  var LUA_OPBNOT = 13;
  var LUA_OPEQ = 0;
  var LUA_OPLT = 1;
  var LUA_OPLE = 2;
  var LUA_MINSTACK = 20;
  var { LUAI_MAXSTACK } = require_luaconf();
  var LUA_REGISTRYINDEX = -LUAI_MAXSTACK - 1000;
  var lua_upvalueindex = function(i) {
    return LUA_REGISTRYINDEX - i;
  };
  var LUA_RIDX_MAINTHREAD = 1;
  var LUA_RIDX_GLOBALS = 2;
  var LUA_RIDX_LAST = LUA_RIDX_GLOBALS;

  class lua_Debug {
    constructor() {
      this.event = NaN;
      this.name = null;
      this.namewhat = null;
      this.what = null;
      this.source = null;
      this.currentline = NaN;
      this.linedefined = NaN;
      this.lastlinedefined = NaN;
      this.nups = NaN;
      this.nparams = NaN;
      this.isvararg = NaN;
      this.istailcall = NaN;
      this.short_src = null;
      this.i_ci = null;
    }
  }
  var LUA_HOOKCALL = 0;
  var LUA_HOOKRET = 1;
  var LUA_HOOKLINE = 2;
  var LUA_HOOKCOUNT = 3;
  var LUA_HOOKTAILCALL = 4;
  var LUA_MASKCALL = 1 << LUA_HOOKCALL;
  var LUA_MASKRET = 1 << LUA_HOOKRET;
  var LUA_MASKLINE = 1 << LUA_HOOKLINE;
  var LUA_MASKCOUNT = 1 << LUA_HOOKCOUNT;
  exports.LUA_HOOKCALL = LUA_HOOKCALL;
  exports.LUA_HOOKCOUNT = LUA_HOOKCOUNT;
  exports.LUA_HOOKLINE = LUA_HOOKLINE;
  exports.LUA_HOOKRET = LUA_HOOKRET;
  exports.LUA_HOOKTAILCALL = LUA_HOOKTAILCALL;
  exports.LUA_MASKCALL = LUA_MASKCALL;
  exports.LUA_MASKCOUNT = LUA_MASKCOUNT;
  exports.LUA_MASKLINE = LUA_MASKLINE;
  exports.LUA_MASKRET = LUA_MASKRET;
  exports.LUA_MINSTACK = LUA_MINSTACK;
  exports.LUA_MULTRET = -1;
  exports.LUA_OPADD = LUA_OPADD;
  exports.LUA_OPBAND = LUA_OPBAND;
  exports.LUA_OPBNOT = LUA_OPBNOT;
  exports.LUA_OPBOR = LUA_OPBOR;
  exports.LUA_OPBXOR = LUA_OPBXOR;
  exports.LUA_OPDIV = LUA_OPDIV;
  exports.LUA_OPEQ = LUA_OPEQ;
  exports.LUA_OPIDIV = LUA_OPIDIV;
  exports.LUA_OPLE = LUA_OPLE;
  exports.LUA_OPLT = LUA_OPLT;
  exports.LUA_OPMOD = LUA_OPMOD;
  exports.LUA_OPMUL = LUA_OPMUL;
  exports.LUA_OPPOW = LUA_OPPOW;
  exports.LUA_OPSHL = LUA_OPSHL;
  exports.LUA_OPSHR = LUA_OPSHR;
  exports.LUA_OPSUB = LUA_OPSUB;
  exports.LUA_OPUNM = LUA_OPUNM;
  exports.LUA_REGISTRYINDEX = LUA_REGISTRYINDEX;
  exports.LUA_RIDX_GLOBALS = LUA_RIDX_GLOBALS;
  exports.LUA_RIDX_LAST = LUA_RIDX_LAST;
  exports.LUA_RIDX_MAINTHREAD = LUA_RIDX_MAINTHREAD;
  exports.constant_types = constant_types;
  exports.lua_Debug = lua_Debug;
  exports.lua_upvalueindex = lua_upvalueindex;
  exports.thread_status = thread_status;
});

// node_modules/fengari/src/fengaricore.js
var require_fengaricore = __commonJS(function(exports, module) {
  var defs = require_defs();
  var FENGARI_VERSION_MAJOR = "0";
  var FENGARI_VERSION_MINOR = "1";
  var FENGARI_VERSION_NUM = 1;
  var FENGARI_VERSION_RELEASE = "4";
  var FENGARI_VERSION = "Fengari " + FENGARI_VERSION_MAJOR + "." + FENGARI_VERSION_MINOR;
  var FENGARI_RELEASE = FENGARI_VERSION + "." + FENGARI_VERSION_RELEASE;
  var FENGARI_AUTHORS = "B. Giannangeli, Daurnimator";
  var FENGARI_COPYRIGHT = FENGARI_RELEASE + "  Copyright (C) 2017-2018 " + FENGARI_AUTHORS + `
Based on: ` + defs.LUA_COPYRIGHT;
  exports.FENGARI_AUTHORS = FENGARI_AUTHORS;
  exports.FENGARI_COPYRIGHT = FENGARI_COPYRIGHT;
  exports.FENGARI_RELEASE = FENGARI_RELEASE;
  exports.FENGARI_VERSION = FENGARI_VERSION;
  exports.FENGARI_VERSION_MAJOR = FENGARI_VERSION_MAJOR;
  exports.FENGARI_VERSION_MINOR = FENGARI_VERSION_MINOR;
  exports.FENGARI_VERSION_NUM = FENGARI_VERSION_NUM;
  exports.FENGARI_VERSION_RELEASE = FENGARI_VERSION_RELEASE;
  exports.is_luastring = defs.is_luastring;
  exports.luastring_eq = defs.luastring_eq;
  exports.luastring_from = defs.luastring_from;
  exports.luastring_indexOf = defs.luastring_indexOf;
  exports.luastring_of = defs.luastring_of;
  exports.to_jsstring = defs.to_jsstring;
  exports.to_luastring = defs.to_luastring;
  exports.to_uristring = defs.to_uristring;
  exports.from_userstring = defs.from_userstring;
});

// node_modules/fengari/src/llimits.js
var require_llimits = __commonJS(function(exports, module) {
  var { luai_apicheck } = require_luaconf();
  var lua_assert = function(c) {
    if (!c)
      throw Error("assertion failed");
  };
  exports.lua_assert = lua_assert;
  exports.luai_apicheck = luai_apicheck || function(l, e) {
    return lua_assert(e);
  };
  var api_check = function(l, e, msg) {
    return luai_apicheck(l, e && msg);
  };
  exports.api_check = api_check;
  var LUAI_MAXCCALLS = 200;
  exports.LUAI_MAXCCALLS = LUAI_MAXCCALLS;
  var LUA_MINBUFFER = 32;
  exports.LUA_MINBUFFER = LUA_MINBUFFER;
  var luai_nummod = function(L, a, b) {
    let m = a % b;
    if (m * b < 0)
      m += b;
    return m;
  };
  exports.luai_nummod = luai_nummod;
  var MAX_INT = 2147483647;
  exports.MAX_INT = MAX_INT;
  var MIN_INT = -2147483648;
  exports.MIN_INT = MIN_INT;
});

// node_modules/fengari/src/ljstype.js
var require_ljstype = __commonJS(function(exports, module) {
  var { luastring_of } = require_defs();
  var luai_ctype_ = luastring_of(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 8, 8, 8, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 12, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 4, 4, 4, 4, 4, 4, 4, 21, 21, 21, 21, 21, 21, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 4, 4, 4, 4, 5, 4, 21, 21, 21, 21, 21, 21, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  var ALPHABIT = 0;
  var DIGITBIT = 1;
  var PRINTBIT = 2;
  var SPACEBIT = 3;
  var XDIGITBIT = 4;
  var lisdigit = function(c) {
    return (luai_ctype_[c + 1] & 1 << DIGITBIT) !== 0;
  };
  var lisxdigit = function(c) {
    return (luai_ctype_[c + 1] & 1 << XDIGITBIT) !== 0;
  };
  var lisprint = function(c) {
    return (luai_ctype_[c + 1] & 1 << PRINTBIT) !== 0;
  };
  var lisspace = function(c) {
    return (luai_ctype_[c + 1] & 1 << SPACEBIT) !== 0;
  };
  var lislalpha = function(c) {
    return (luai_ctype_[c + 1] & 1 << ALPHABIT) !== 0;
  };
  var lislalnum = function(c) {
    return (luai_ctype_[c + 1] & (1 << ALPHABIT | 1 << DIGITBIT)) !== 0;
  };
  exports.lisdigit = lisdigit;
  exports.lislalnum = lislalnum;
  exports.lislalpha = lislalpha;
  exports.lisprint = lisprint;
  exports.lisspace = lisspace;
  exports.lisxdigit = lisxdigit;
});

// node_modules/fengari/src/lstring.js
var require_lstring = __commonJS(function(exports, module) {
  var {
    is_luastring,
    luastring_eq,
    luastring_from,
    to_luastring
  } = require_defs();
  var { lua_assert } = require_llimits();

  class TString {
    constructor(L, str) {
      this.hash = null;
      this.realstring = str;
    }
    getstr() {
      return this.realstring;
    }
    tsslen() {
      return this.realstring.length;
    }
  }
  var luaS_eqlngstr = function(a, b) {
    lua_assert(a instanceof TString);
    lua_assert(b instanceof TString);
    return a == b || luastring_eq(a.realstring, b.realstring);
  };
  var luaS_hash = function(str) {
    lua_assert(is_luastring(str));
    let len = str.length;
    let s = "|";
    for (let i = 0;i < len; i++)
      s += str[i].toString(16);
    return s;
  };
  var luaS_hashlongstr = function(ts) {
    lua_assert(ts instanceof TString);
    if (ts.hash === null) {
      ts.hash = luaS_hash(ts.getstr());
    }
    return ts.hash;
  };
  var luaS_bless = function(L, str) {
    lua_assert(str instanceof Uint8Array);
    return new TString(L, str);
  };
  var luaS_new = function(L, str) {
    return luaS_bless(L, luastring_from(str));
  };
  var luaS_newliteral = function(L, str) {
    return luaS_bless(L, to_luastring(str));
  };
  exports.luaS_eqlngstr = luaS_eqlngstr;
  exports.luaS_hash = luaS_hash;
  exports.luaS_hashlongstr = luaS_hashlongstr;
  exports.luaS_bless = luaS_bless;
  exports.luaS_new = luaS_new;
  exports.luaS_newliteral = luaS_newliteral;
  exports.TString = TString;
});

// node_modules/fengari/src/ltable.js
var require_ltable = __commonJS(function(exports, module) {
  var {
    constant_types: {
      LUA_TBOOLEAN,
      LUA_TCCL,
      LUA_TLCF,
      LUA_TLCL,
      LUA_TLIGHTUSERDATA,
      LUA_TLNGSTR,
      LUA_TNIL,
      LUA_TNUMFLT,
      LUA_TNUMINT,
      LUA_TSHRSTR,
      LUA_TTABLE,
      LUA_TTHREAD,
      LUA_TUSERDATA
    },
    to_luastring
  } = require_defs();
  var { lua_assert } = require_llimits();
  var ldebug = require_ldebug();
  var lobject = require_lobject();
  var {
    luaS_hashlongstr,
    TString
  } = require_lstring();
  var lstate = require_lstate();
  var lightuserdata_hashes = new WeakMap;
  var get_lightuserdata_hash = function(v) {
    let hash = lightuserdata_hashes.get(v);
    if (!hash) {
      hash = {};
      lightuserdata_hashes.set(v, hash);
    }
    return hash;
  };
  var table_hash = function(L, key) {
    switch (key.type) {
      case LUA_TNIL:
        return ldebug.luaG_runerror(L, to_luastring("table index is nil", true));
      case LUA_TNUMFLT:
        if (isNaN(key.value))
          return ldebug.luaG_runerror(L, to_luastring("table index is NaN", true));
      case LUA_TNUMINT:
      case LUA_TBOOLEAN:
      case LUA_TTABLE:
      case LUA_TLCL:
      case LUA_TLCF:
      case LUA_TCCL:
      case LUA_TUSERDATA:
      case LUA_TTHREAD:
        return key.value;
      case LUA_TSHRSTR:
      case LUA_TLNGSTR:
        return luaS_hashlongstr(key.tsvalue());
      case LUA_TLIGHTUSERDATA: {
        let v = key.value;
        switch (typeof v) {
          case "string":
            return "*" + v;
          case "number":
            return "#" + v;
          case "boolean":
            return v ? "?true" : "?false";
          case "function":
            return get_lightuserdata_hash(v);
          case "object":
            if (v instanceof lstate.lua_State && v.l_G === L.l_G || v instanceof Table || v instanceof lobject.Udata || v instanceof lobject.LClosure || v instanceof lobject.CClosure) {
              return get_lightuserdata_hash(v);
            }
          default:
            return v;
        }
      }
      default:
        throw new Error("unknown key type: " + key.type);
    }
  };

  class Table {
    constructor(L) {
      this.id = L.l_G.id_counter++;
      this.strong = new Map;
      this.dead_strong = new Map;
      this.dead_weak = undefined;
      this.f = undefined;
      this.l = undefined;
      this.metatable = null;
      this.flags = ~0;
    }
  }
  var invalidateTMcache = function(t) {
    t.flags = 0;
  };
  var add = function(t, hash, key, value) {
    t.dead_strong.clear();
    t.dead_weak = undefined;
    let prev = null;
    let entry = {
      key,
      value,
      p: prev = t.l,
      n: undefined
    };
    if (!t.f)
      t.f = entry;
    if (prev)
      prev.n = entry;
    t.strong.set(hash, entry);
    t.l = entry;
  };
  var is_valid_weakmap_key = function(k) {
    return typeof k === "object" ? k !== null : typeof k === "function";
  };
  var mark_dead = function(t, hash) {
    let e = t.strong.get(hash);
    if (e) {
      e.key.setdeadvalue();
      e.value = undefined;
      let next = e.n;
      let prev = e.p;
      e.p = undefined;
      if (prev)
        prev.n = next;
      if (next)
        next.p = prev;
      if (t.f === e)
        t.f = next;
      if (t.l === e)
        t.l = prev;
      t.strong.delete(hash);
      if (is_valid_weakmap_key(hash)) {
        if (!t.dead_weak)
          t.dead_weak = new WeakMap;
        t.dead_weak.set(hash, e);
      } else {
        t.dead_strong.set(hash, e);
      }
    }
  };
  var luaH_new = function(L) {
    return new Table(L);
  };
  var getgeneric = function(t, hash) {
    let v = t.strong.get(hash);
    return v ? v.value : lobject.luaO_nilobject;
  };
  var luaH_getint = function(t, key) {
    lua_assert(typeof key == "number" && (key | 0) === key);
    return getgeneric(t, key);
  };
  var luaH_getstr = function(t, key) {
    lua_assert(key instanceof TString);
    return getgeneric(t, luaS_hashlongstr(key));
  };
  var luaH_get = function(L, t, key) {
    lua_assert(key instanceof lobject.TValue);
    if (key.ttisnil() || key.ttisfloat() && isNaN(key.value))
      return lobject.luaO_nilobject;
    return getgeneric(t, table_hash(L, key));
  };
  var luaH_setint = function(t, key, value) {
    lua_assert(typeof key == "number" && (key | 0) === key && value instanceof lobject.TValue);
    let hash = key;
    if (value.ttisnil()) {
      mark_dead(t, hash);
      return;
    }
    let e = t.strong.get(hash);
    if (e) {
      let tv = e.value;
      tv.setfrom(value);
    } else {
      let k = new lobject.TValue(LUA_TNUMINT, key);
      let v = new lobject.TValue(value.type, value.value);
      add(t, hash, k, v);
    }
  };
  var luaH_setfrom = function(L, t, key, value) {
    lua_assert(key instanceof lobject.TValue);
    let hash = table_hash(L, key);
    if (value.ttisnil()) {
      mark_dead(t, hash);
      return;
    }
    let e = t.strong.get(hash);
    if (e) {
      e.value.setfrom(value);
    } else {
      let k;
      let kv = key.value;
      if (key.ttisfloat() && (kv | 0) === kv) {
        k = new lobject.TValue(LUA_TNUMINT, kv);
      } else {
        k = new lobject.TValue(key.type, kv);
      }
      let v = new lobject.TValue(value.type, value.value);
      add(t, hash, k, v);
    }
  };
  var luaH_getn = function(t) {
    let i = 0;
    let j = t.strong.size + 1;
    while (j - i > 1) {
      let m = Math.floor((i + j) / 2);
      if (luaH_getint(t, m).ttisnil())
        j = m;
      else
        i = m;
    }
    return i;
  };
  var luaH_next = function(L, table, keyI) {
    let keyO = L.stack[keyI];
    let entry;
    if (keyO.type === LUA_TNIL) {
      entry = table.f;
      if (!entry)
        return false;
    } else {
      let hash = table_hash(L, keyO);
      entry = table.strong.get(hash);
      if (entry) {
        entry = entry.n;
        if (!entry)
          return false;
      } else {
        entry = table.dead_weak && table.dead_weak.get(hash) || table.dead_strong.get(hash);
        if (!entry)
          return ldebug.luaG_runerror(L, to_luastring("invalid key to 'next'"));
        do {
          entry = entry.n;
          if (!entry)
            return false;
        } while (entry.key.ttisdeadkey());
      }
    }
    lobject.setobj2s(L, keyI, entry.key);
    lobject.setobj2s(L, keyI + 1, entry.value);
    return true;
  };
  exports.invalidateTMcache = invalidateTMcache;
  exports.luaH_get = luaH_get;
  exports.luaH_getint = luaH_getint;
  exports.luaH_getn = luaH_getn;
  exports.luaH_getstr = luaH_getstr;
  exports.luaH_setfrom = luaH_setfrom;
  exports.luaH_setint = luaH_setint;
  exports.luaH_new = luaH_new;
  exports.luaH_next = luaH_next;
  exports.Table = Table;
});

// node_modules/fengari/src/lopcodes.js
var require_lopcodes = __commonJS(function(exports, module) {
  var OpCodes = [
    "MOVE",
    "LOADK",
    "LOADKX",
    "LOADBOOL",
    "LOADNIL",
    "GETUPVAL",
    "GETTABUP",
    "GETTABLE",
    "SETTABUP",
    "SETUPVAL",
    "SETTABLE",
    "NEWTABLE",
    "SELF",
    "ADD",
    "SUB",
    "MUL",
    "MOD",
    "POW",
    "DIV",
    "IDIV",
    "BAND",
    "BOR",
    "BXOR",
    "SHL",
    "SHR",
    "UNM",
    "BNOT",
    "NOT",
    "LEN",
    "CONCAT",
    "JMP",
    "EQ",
    "LT",
    "LE",
    "TEST",
    "TESTSET",
    "CALL",
    "TAILCALL",
    "RETURN",
    "FORLOOP",
    "FORPREP",
    "TFORCALL",
    "TFORLOOP",
    "SETLIST",
    "CLOSURE",
    "VARARG",
    "EXTRAARG"
  ];
  var OpCodesI = {
    OP_MOVE: 0,
    OP_LOADK: 1,
    OP_LOADKX: 2,
    OP_LOADBOOL: 3,
    OP_LOADNIL: 4,
    OP_GETUPVAL: 5,
    OP_GETTABUP: 6,
    OP_GETTABLE: 7,
    OP_SETTABUP: 8,
    OP_SETUPVAL: 9,
    OP_SETTABLE: 10,
    OP_NEWTABLE: 11,
    OP_SELF: 12,
    OP_ADD: 13,
    OP_SUB: 14,
    OP_MUL: 15,
    OP_MOD: 16,
    OP_POW: 17,
    OP_DIV: 18,
    OP_IDIV: 19,
    OP_BAND: 20,
    OP_BOR: 21,
    OP_BXOR: 22,
    OP_SHL: 23,
    OP_SHR: 24,
    OP_UNM: 25,
    OP_BNOT: 26,
    OP_NOT: 27,
    OP_LEN: 28,
    OP_CONCAT: 29,
    OP_JMP: 30,
    OP_EQ: 31,
    OP_LT: 32,
    OP_LE: 33,
    OP_TEST: 34,
    OP_TESTSET: 35,
    OP_CALL: 36,
    OP_TAILCALL: 37,
    OP_RETURN: 38,
    OP_FORLOOP: 39,
    OP_FORPREP: 40,
    OP_TFORCALL: 41,
    OP_TFORLOOP: 42,
    OP_SETLIST: 43,
    OP_CLOSURE: 44,
    OP_VARARG: 45,
    OP_EXTRAARG: 46
  };
  var OpArgN = 0;
  var OpArgU = 1;
  var OpArgR = 2;
  var OpArgK = 3;
  var iABC = 0;
  var iABx = 1;
  var iAsBx = 2;
  var iAx = 3;
  var luaP_opmodes = [
    0 << 7 | 1 << 6 | OpArgR << 4 | OpArgN << 2 | iABC,
    0 << 7 | 1 << 6 | OpArgK << 4 | OpArgN << 2 | iABx,
    0 << 7 | 1 << 6 | OpArgN << 4 | OpArgN << 2 | iABx,
    0 << 7 | 1 << 6 | OpArgU << 4 | OpArgU << 2 | iABC,
    0 << 7 | 1 << 6 | OpArgU << 4 | OpArgN << 2 | iABC,
    0 << 7 | 1 << 6 | OpArgU << 4 | OpArgN << 2 | iABC,
    0 << 7 | 1 << 6 | OpArgU << 4 | OpArgK << 2 | iABC,
    0 << 7 | 1 << 6 | OpArgR << 4 | OpArgK << 2 | iABC,
    0 << 7 | 0 << 6 | OpArgK << 4 | OpArgK << 2 | iABC,
    0 << 7 | 0 << 6 | OpArgU << 4 | OpArgN << 2 | iABC,
    0 << 7 | 0 << 6 | OpArgK << 4 | OpArgK << 2 | iABC,
    0 << 7 | 1 << 6 | OpArgU << 4 | OpArgU << 2 | iABC,
    0 << 7 | 1 << 6 | OpArgR << 4 | OpArgK << 2 | iABC,
    0 << 7 | 1 << 6 | OpArgK << 4 | OpArgK << 2 | iABC,
    0 << 7 | 1 << 6 | OpArgK << 4 | OpArgK << 2 | iABC,
    0 << 7 | 1 << 6 | OpArgK << 4 | OpArgK << 2 | iABC,
    0 << 7 | 1 << 6 | OpArgK << 4 | OpArgK << 2 | iABC,
    0 << 7 | 1 << 6 | OpArgK << 4 | OpArgK << 2 | iABC,
    0 << 7 | 1 << 6 | OpArgK << 4 | OpArgK << 2 | iABC,
    0 << 7 | 1 << 6 | OpArgK << 4 | OpArgK << 2 | iABC,
    0 << 7 | 1 << 6 | OpArgK << 4 | OpArgK << 2 | iABC,
    0 << 7 | 1 << 6 | OpArgK << 4 | OpArgK << 2 | iABC,
    0 << 7 | 1 << 6 | OpArgK << 4 | OpArgK << 2 | iABC,
    0 << 7 | 1 << 6 | OpArgK << 4 | OpArgK << 2 | iABC,
    0 << 7 | 1 << 6 | OpArgK << 4 | OpArgK << 2 | iABC,
    0 << 7 | 1 << 6 | OpArgR << 4 | OpArgN << 2 | iABC,
    0 << 7 | 1 << 6 | OpArgR << 4 | OpArgN << 2 | iABC,
    0 << 7 | 1 << 6 | OpArgR << 4 | OpArgN << 2 | iABC,
    0 << 7 | 1 << 6 | OpArgR << 4 | OpArgN << 2 | iABC,
    0 << 7 | 1 << 6 | OpArgR << 4 | OpArgR << 2 | iABC,
    0 << 7 | 0 << 6 | OpArgR << 4 | OpArgN << 2 | iAsBx,
    1 << 7 | 0 << 6 | OpArgK << 4 | OpArgK << 2 | iABC,
    1 << 7 | 0 << 6 | OpArgK << 4 | OpArgK << 2 | iABC,
    1 << 7 | 0 << 6 | OpArgK << 4 | OpArgK << 2 | iABC,
    1 << 7 | 0 << 6 | OpArgN << 4 | OpArgU << 2 | iABC,
    1 << 7 | 1 << 6 | OpArgR << 4 | OpArgU << 2 | iABC,
    0 << 7 | 1 << 6 | OpArgU << 4 | OpArgU << 2 | iABC,
    0 << 7 | 1 << 6 | OpArgU << 4 | OpArgU << 2 | iABC,
    0 << 7 | 0 << 6 | OpArgU << 4 | OpArgN << 2 | iABC,
    0 << 7 | 1 << 6 | OpArgR << 4 | OpArgN << 2 | iAsBx,
    0 << 7 | 1 << 6 | OpArgR << 4 | OpArgN << 2 | iAsBx,
    0 << 7 | 0 << 6 | OpArgN << 4 | OpArgU << 2 | iABC,
    0 << 7 | 1 << 6 | OpArgR << 4 | OpArgN << 2 | iAsBx,
    0 << 7 | 0 << 6 | OpArgU << 4 | OpArgU << 2 | iABC,
    0 << 7 | 1 << 6 | OpArgU << 4 | OpArgN << 2 | iABx,
    0 << 7 | 1 << 6 | OpArgU << 4 | OpArgN << 2 | iABC,
    0 << 7 | 0 << 6 | OpArgU << 4 | OpArgU << 2 | iAx
  ];
  var getOpMode = function(m) {
    return luaP_opmodes[m] & 3;
  };
  var getBMode = function(m) {
    return luaP_opmodes[m] >> 4 & 3;
  };
  var getCMode = function(m) {
    return luaP_opmodes[m] >> 2 & 3;
  };
  var testAMode = function(m) {
    return luaP_opmodes[m] & 1 << 6;
  };
  var testTMode = function(m) {
    return luaP_opmodes[m] & 1 << 7;
  };
  var SIZE_C = 9;
  var SIZE_B = 9;
  var SIZE_Bx = SIZE_C + SIZE_B;
  var SIZE_A = 8;
  var SIZE_Ax = SIZE_C + SIZE_B + SIZE_A;
  var SIZE_OP = 6;
  var POS_OP = 0;
  var POS_A = POS_OP + SIZE_OP;
  var POS_C = POS_A + SIZE_A;
  var POS_B = POS_C + SIZE_C;
  var POS_Bx = POS_C;
  var POS_Ax = POS_A;
  var MAXARG_Bx = (1 << SIZE_Bx) - 1;
  var MAXARG_sBx = MAXARG_Bx >> 1;
  var MAXARG_Ax = (1 << SIZE_Ax) - 1;
  var MAXARG_A = (1 << SIZE_A) - 1;
  var MAXARG_B = (1 << SIZE_B) - 1;
  var MAXARG_C = (1 << SIZE_C) - 1;
  var BITRK = 1 << SIZE_B - 1;
  var MAXINDEXRK = BITRK - 1;
  var NO_REG = MAXARG_A;
  var ISK = function(x) {
    return x & BITRK;
  };
  var INDEXK = function(r) {
    return r & ~BITRK;
  };
  var RKASK = function(x) {
    return x | BITRK;
  };
  var MASK1 = function(n, p) {
    return ~(~0 << n) << p;
  };
  var MASK0 = function(n, p) {
    return ~MASK1(n, p);
  };
  var GET_OPCODE = function(i) {
    return i.opcode;
  };
  var SET_OPCODE = function(i, o) {
    i.code = i.code & MASK0(SIZE_OP, POS_OP) | o << POS_OP & MASK1(SIZE_OP, POS_OP);
    return fullins(i);
  };
  var setarg = function(i, v, pos, size) {
    i.code = i.code & MASK0(size, pos) | v << pos & MASK1(size, pos);
    return fullins(i);
  };
  var GETARG_A = function(i) {
    return i.A;
  };
  var SETARG_A = function(i, v) {
    return setarg(i, v, POS_A, SIZE_A);
  };
  var GETARG_B = function(i) {
    return i.B;
  };
  var SETARG_B = function(i, v) {
    return setarg(i, v, POS_B, SIZE_B);
  };
  var GETARG_C = function(i) {
    return i.C;
  };
  var SETARG_C = function(i, v) {
    return setarg(i, v, POS_C, SIZE_C);
  };
  var GETARG_Bx = function(i) {
    return i.Bx;
  };
  var SETARG_Bx = function(i, v) {
    return setarg(i, v, POS_Bx, SIZE_Bx);
  };
  var GETARG_Ax = function(i) {
    return i.Ax;
  };
  var SETARG_Ax = function(i, v) {
    return setarg(i, v, POS_Ax, SIZE_Ax);
  };
  var GETARG_sBx = function(i) {
    return i.sBx;
  };
  var SETARG_sBx = function(i, b) {
    return SETARG_Bx(i, b + MAXARG_sBx);
  };
  var fullins = function(ins) {
    if (typeof ins === "number") {
      return {
        code: ins,
        opcode: ins >> POS_OP & MASK1(SIZE_OP, 0),
        A: ins >> POS_A & MASK1(SIZE_A, 0),
        B: ins >> POS_B & MASK1(SIZE_B, 0),
        C: ins >> POS_C & MASK1(SIZE_C, 0),
        Bx: ins >> POS_Bx & MASK1(SIZE_Bx, 0),
        Ax: ins >> POS_Ax & MASK1(SIZE_Ax, 0),
        sBx: (ins >> POS_Bx & MASK1(SIZE_Bx, 0)) - MAXARG_sBx
      };
    } else {
      let i = ins.code;
      ins.opcode = i >> POS_OP & MASK1(SIZE_OP, 0);
      ins.A = i >> POS_A & MASK1(SIZE_A, 0);
      ins.B = i >> POS_B & MASK1(SIZE_B, 0);
      ins.C = i >> POS_C & MASK1(SIZE_C, 0);
      ins.Bx = i >> POS_Bx & MASK1(SIZE_Bx, 0);
      ins.Ax = i >> POS_Ax & MASK1(SIZE_Ax, 0);
      ins.sBx = (i >> POS_Bx & MASK1(SIZE_Bx, 0)) - MAXARG_sBx;
      return ins;
    }
  };
  var CREATE_ABC = function(o, a, b, c) {
    return fullins(o << POS_OP | a << POS_A | b << POS_B | c << POS_C);
  };
  var CREATE_ABx = function(o, a, bc) {
    return fullins(o << POS_OP | a << POS_A | bc << POS_Bx);
  };
  var CREATE_Ax = function(o, a) {
    return fullins(o << POS_OP | a << POS_Ax);
  };
  var LFIELDS_PER_FLUSH = 50;
  exports.BITRK = BITRK;
  exports.CREATE_ABC = CREATE_ABC;
  exports.CREATE_ABx = CREATE_ABx;
  exports.CREATE_Ax = CREATE_Ax;
  exports.GET_OPCODE = GET_OPCODE;
  exports.GETARG_A = GETARG_A;
  exports.GETARG_B = GETARG_B;
  exports.GETARG_C = GETARG_C;
  exports.GETARG_Bx = GETARG_Bx;
  exports.GETARG_Ax = GETARG_Ax;
  exports.GETARG_sBx = GETARG_sBx;
  exports.INDEXK = INDEXK;
  exports.ISK = ISK;
  exports.LFIELDS_PER_FLUSH = LFIELDS_PER_FLUSH;
  exports.MAXARG_A = MAXARG_A;
  exports.MAXARG_Ax = MAXARG_Ax;
  exports.MAXARG_B = MAXARG_B;
  exports.MAXARG_Bx = MAXARG_Bx;
  exports.MAXARG_C = MAXARG_C;
  exports.MAXARG_sBx = MAXARG_sBx;
  exports.MAXINDEXRK = MAXINDEXRK;
  exports.NO_REG = NO_REG;
  exports.OpArgK = OpArgK;
  exports.OpArgN = OpArgN;
  exports.OpArgR = OpArgR;
  exports.OpArgU = OpArgU;
  exports.OpCodes = OpCodes;
  exports.OpCodesI = OpCodesI;
  exports.POS_A = POS_A;
  exports.POS_Ax = POS_Ax;
  exports.POS_B = POS_B;
  exports.POS_Bx = POS_Bx;
  exports.POS_C = POS_C;
  exports.POS_OP = POS_OP;
  exports.RKASK = RKASK;
  exports.SETARG_A = SETARG_A;
  exports.SETARG_Ax = SETARG_Ax;
  exports.SETARG_B = SETARG_B;
  exports.SETARG_Bx = SETARG_Bx;
  exports.SETARG_C = SETARG_C;
  exports.SETARG_sBx = SETARG_sBx;
  exports.SET_OPCODE = SET_OPCODE;
  exports.SIZE_A = SIZE_A;
  exports.SIZE_Ax = SIZE_Ax;
  exports.SIZE_B = SIZE_B;
  exports.SIZE_Bx = SIZE_Bx;
  exports.SIZE_C = SIZE_C;
  exports.SIZE_OP = SIZE_OP;
  exports.fullins = fullins;
  exports.getBMode = getBMode;
  exports.getCMode = getCMode;
  exports.getOpMode = getOpMode;
  exports.iABC = iABC;
  exports.iABx = iABx;
  exports.iAsBx = iAsBx;
  exports.iAx = iAx;
  exports.testAMode = testAMode;
  exports.testTMode = testTMode;
});

// node_modules/fengari/src/lvm.js
var require_lvm = __commonJS(function(exports, module) {
  var {
    LUA_MASKLINE,
    LUA_MASKCOUNT,
    LUA_MULTRET,
    constant_types: {
      LUA_TBOOLEAN,
      LUA_TLCF,
      LUA_TLIGHTUSERDATA,
      LUA_TLNGSTR,
      LUA_TNIL,
      LUA_TNUMBER,
      LUA_TNUMFLT,
      LUA_TNUMINT,
      LUA_TSHRSTR,
      LUA_TTABLE,
      LUA_TUSERDATA
    },
    to_luastring
  } = require_defs();
  var {
    INDEXK,
    ISK,
    LFIELDS_PER_FLUSH,
    OpCodesI: {
      OP_ADD,
      OP_BAND,
      OP_BNOT,
      OP_BOR,
      OP_BXOR,
      OP_CALL,
      OP_CLOSURE,
      OP_CONCAT,
      OP_DIV,
      OP_EQ,
      OP_EXTRAARG,
      OP_FORLOOP,
      OP_FORPREP,
      OP_GETTABLE,
      OP_GETTABUP,
      OP_GETUPVAL,
      OP_IDIV,
      OP_JMP,
      OP_LE,
      OP_LEN,
      OP_LOADBOOL,
      OP_LOADK,
      OP_LOADKX,
      OP_LOADNIL,
      OP_LT,
      OP_MOD,
      OP_MOVE,
      OP_MUL,
      OP_NEWTABLE,
      OP_NOT,
      OP_POW,
      OP_RETURN,
      OP_SELF,
      OP_SETLIST,
      OP_SETTABLE,
      OP_SETTABUP,
      OP_SETUPVAL,
      OP_SHL,
      OP_SHR,
      OP_SUB,
      OP_TAILCALL,
      OP_TEST,
      OP_TESTSET,
      OP_TFORCALL,
      OP_TFORLOOP,
      OP_UNM,
      OP_VARARG
    }
  } = require_lopcodes();
  var {
    LUA_MAXINTEGER,
    LUA_MININTEGER,
    lua_numbertointeger
  } = require_luaconf();
  var {
    lua_assert,
    luai_nummod
  } = require_llimits();
  var lobject = require_lobject();
  var lfunc = require_lfunc();
  var lstate = require_lstate();
  var {
    luaS_bless,
    luaS_eqlngstr,
    luaS_hashlongstr
  } = require_lstring();
  var ldo = require_ldo();
  var ltm = require_ltm();
  var ltable = require_ltable();
  var ldebug = require_ldebug();
  var luaV_finishOp = function(L) {
    let ci = L.ci;
    let base = ci.l_base;
    let inst = ci.l_code[ci.l_savedpc - 1];
    let op = inst.opcode;
    switch (op) {
      case OP_ADD:
      case OP_SUB:
      case OP_MUL:
      case OP_DIV:
      case OP_IDIV:
      case OP_BAND:
      case OP_BOR:
      case OP_BXOR:
      case OP_SHL:
      case OP_SHR:
      case OP_MOD:
      case OP_POW:
      case OP_UNM:
      case OP_BNOT:
      case OP_LEN:
      case OP_GETTABUP:
      case OP_GETTABLE:
      case OP_SELF: {
        lobject.setobjs2s(L, base + inst.A, L.top - 1);
        delete L.stack[--L.top];
        break;
      }
      case OP_LE:
      case OP_LT:
      case OP_EQ: {
        let res = !L.stack[L.top - 1].l_isfalse();
        delete L.stack[--L.top];
        if (ci.callstatus & lstate.CIST_LEQ) {
          lua_assert(op === OP_LE);
          ci.callstatus ^= lstate.CIST_LEQ;
          res = !res;
        }
        lua_assert(ci.l_code[ci.l_savedpc].opcode === OP_JMP);
        if (res !== (inst.A ? true : false))
          ci.l_savedpc++;
        break;
      }
      case OP_CONCAT: {
        let top = L.top - 1;
        let b = inst.B;
        let total = top - 1 - (base + b);
        lobject.setobjs2s(L, top - 2, top);
        if (total > 1) {
          L.top = top - 1;
          luaV_concat(L, total);
        }
        lobject.setobjs2s(L, ci.l_base + inst.A, L.top - 1);
        ldo.adjust_top(L, ci.top);
        break;
      }
      case OP_TFORCALL: {
        lua_assert(ci.l_code[ci.l_savedpc].opcode === OP_TFORLOOP);
        ldo.adjust_top(L, ci.top);
        break;
      }
      case OP_CALL: {
        if (inst.C - 1 >= 0)
          ldo.adjust_top(L, ci.top);
        break;
      }
    }
  };
  var RA = function(L, base, i) {
    return base + i.A;
  };
  var RB = function(L, base, i) {
    return base + i.B;
  };
  var RKB = function(L, base, k, i) {
    return ISK(i.B) ? k[INDEXK(i.B)] : L.stack[base + i.B];
  };
  var RKC = function(L, base, k, i) {
    return ISK(i.C) ? k[INDEXK(i.C)] : L.stack[base + i.C];
  };
  var luaV_execute = function(L) {
    let ci = L.ci;
    ci.callstatus |= lstate.CIST_FRESH;
    newframe:
      for (;; ) {
        lua_assert(ci === L.ci);
        let cl = ci.func.value;
        let k = cl.p.k;
        let base = ci.l_base;
        let i = ci.l_code[ci.l_savedpc++];
        if (L.hookmask & (LUA_MASKLINE | LUA_MASKCOUNT)) {
          ldebug.luaG_traceexec(L);
        }
        let ra = RA(L, base, i);
        let opcode = i.opcode;
        switch (opcode) {
          case OP_MOVE: {
            lobject.setobjs2s(L, ra, RB(L, base, i));
            break;
          }
          case OP_LOADK: {
            let konst = k[i.Bx];
            lobject.setobj2s(L, ra, konst);
            break;
          }
          case OP_LOADKX: {
            lua_assert(ci.l_code[ci.l_savedpc].opcode === OP_EXTRAARG);
            let konst = k[ci.l_code[ci.l_savedpc++].Ax];
            lobject.setobj2s(L, ra, konst);
            break;
          }
          case OP_LOADBOOL: {
            L.stack[ra].setbvalue(i.B !== 0);
            if (i.C !== 0)
              ci.l_savedpc++;
            break;
          }
          case OP_LOADNIL: {
            for (let j = 0;j <= i.B; j++)
              L.stack[ra + j].setnilvalue();
            break;
          }
          case OP_GETUPVAL: {
            let b = i.B;
            lobject.setobj2s(L, ra, cl.upvals[b]);
            break;
          }
          case OP_GETTABUP: {
            let upval = cl.upvals[i.B];
            let rc = RKC(L, base, k, i);
            luaV_gettable(L, upval, rc, ra);
            break;
          }
          case OP_GETTABLE: {
            let rb = L.stack[RB(L, base, i)];
            let rc = RKC(L, base, k, i);
            luaV_gettable(L, rb, rc, ra);
            break;
          }
          case OP_SETTABUP: {
            let upval = cl.upvals[i.A];
            let rb = RKB(L, base, k, i);
            let rc = RKC(L, base, k, i);
            settable(L, upval, rb, rc);
            break;
          }
          case OP_SETUPVAL: {
            let uv = cl.upvals[i.B];
            uv.setfrom(L.stack[ra]);
            break;
          }
          case OP_SETTABLE: {
            let table = L.stack[ra];
            let key = RKB(L, base, k, i);
            let v = RKC(L, base, k, i);
            settable(L, table, key, v);
            break;
          }
          case OP_NEWTABLE: {
            L.stack[ra].sethvalue(ltable.luaH_new(L));
            break;
          }
          case OP_SELF: {
            let rb = RB(L, base, i);
            let rc = RKC(L, base, k, i);
            lobject.setobjs2s(L, ra + 1, rb);
            luaV_gettable(L, L.stack[rb], rc, ra);
            break;
          }
          case OP_ADD: {
            let op1 = RKB(L, base, k, i);
            let op2 = RKC(L, base, k, i);
            let numberop1, numberop2;
            if (op1.ttisinteger() && op2.ttisinteger()) {
              L.stack[ra].setivalue(op1.value + op2.value | 0);
            } else if ((numberop1 = tonumber(op1)) !== false && (numberop2 = tonumber(op2)) !== false) {
              L.stack[ra].setfltvalue(numberop1 + numberop2);
            } else {
              ltm.luaT_trybinTM(L, op1, op2, L.stack[ra], ltm.TMS.TM_ADD);
            }
            break;
          }
          case OP_SUB: {
            let op1 = RKB(L, base, k, i);
            let op2 = RKC(L, base, k, i);
            let numberop1, numberop2;
            if (op1.ttisinteger() && op2.ttisinteger()) {
              L.stack[ra].setivalue(op1.value - op2.value | 0);
            } else if ((numberop1 = tonumber(op1)) !== false && (numberop2 = tonumber(op2)) !== false) {
              L.stack[ra].setfltvalue(numberop1 - numberop2);
            } else {
              ltm.luaT_trybinTM(L, op1, op2, L.stack[ra], ltm.TMS.TM_SUB);
            }
            break;
          }
          case OP_MUL: {
            let op1 = RKB(L, base, k, i);
            let op2 = RKC(L, base, k, i);
            let numberop1, numberop2;
            if (op1.ttisinteger() && op2.ttisinteger()) {
              L.stack[ra].setivalue(luaV_imul(op1.value, op2.value));
            } else if ((numberop1 = tonumber(op1)) !== false && (numberop2 = tonumber(op2)) !== false) {
              L.stack[ra].setfltvalue(numberop1 * numberop2);
            } else {
              ltm.luaT_trybinTM(L, op1, op2, L.stack[ra], ltm.TMS.TM_MUL);
            }
            break;
          }
          case OP_MOD: {
            let op1 = RKB(L, base, k, i);
            let op2 = RKC(L, base, k, i);
            let numberop1, numberop2;
            if (op1.ttisinteger() && op2.ttisinteger()) {
              L.stack[ra].setivalue(luaV_mod(L, op1.value, op2.value));
            } else if ((numberop1 = tonumber(op1)) !== false && (numberop2 = tonumber(op2)) !== false) {
              L.stack[ra].setfltvalue(luai_nummod(L, numberop1, numberop2));
            } else {
              ltm.luaT_trybinTM(L, op1, op2, L.stack[ra], ltm.TMS.TM_MOD);
            }
            break;
          }
          case OP_POW: {
            let op1 = RKB(L, base, k, i);
            let op2 = RKC(L, base, k, i);
            let numberop1, numberop2;
            if ((numberop1 = tonumber(op1)) !== false && (numberop2 = tonumber(op2)) !== false) {
              L.stack[ra].setfltvalue(Math.pow(numberop1, numberop2));
            } else {
              ltm.luaT_trybinTM(L, op1, op2, L.stack[ra], ltm.TMS.TM_POW);
            }
            break;
          }
          case OP_DIV: {
            let op1 = RKB(L, base, k, i);
            let op2 = RKC(L, base, k, i);
            let numberop1, numberop2;
            if ((numberop1 = tonumber(op1)) !== false && (numberop2 = tonumber(op2)) !== false) {
              L.stack[ra].setfltvalue(numberop1 / numberop2);
            } else {
              ltm.luaT_trybinTM(L, op1, op2, L.stack[ra], ltm.TMS.TM_DIV);
            }
            break;
          }
          case OP_IDIV: {
            let op1 = RKB(L, base, k, i);
            let op2 = RKC(L, base, k, i);
            let numberop1, numberop2;
            if (op1.ttisinteger() && op2.ttisinteger()) {
              L.stack[ra].setivalue(luaV_div(L, op1.value, op2.value));
            } else if ((numberop1 = tonumber(op1)) !== false && (numberop2 = tonumber(op2)) !== false) {
              L.stack[ra].setfltvalue(Math.floor(numberop1 / numberop2));
            } else {
              ltm.luaT_trybinTM(L, op1, op2, L.stack[ra], ltm.TMS.TM_IDIV);
            }
            break;
          }
          case OP_BAND: {
            let op1 = RKB(L, base, k, i);
            let op2 = RKC(L, base, k, i);
            let numberop1, numberop2;
            if ((numberop1 = tointeger(op1)) !== false && (numberop2 = tointeger(op2)) !== false) {
              L.stack[ra].setivalue(numberop1 & numberop2);
            } else {
              ltm.luaT_trybinTM(L, op1, op2, L.stack[ra], ltm.TMS.TM_BAND);
            }
            break;
          }
          case OP_BOR: {
            let op1 = RKB(L, base, k, i);
            let op2 = RKC(L, base, k, i);
            let numberop1, numberop2;
            if ((numberop1 = tointeger(op1)) !== false && (numberop2 = tointeger(op2)) !== false) {
              L.stack[ra].setivalue(numberop1 | numberop2);
            } else {
              ltm.luaT_trybinTM(L, op1, op2, L.stack[ra], ltm.TMS.TM_BOR);
            }
            break;
          }
          case OP_BXOR: {
            let op1 = RKB(L, base, k, i);
            let op2 = RKC(L, base, k, i);
            let numberop1, numberop2;
            if ((numberop1 = tointeger(op1)) !== false && (numberop2 = tointeger(op2)) !== false) {
              L.stack[ra].setivalue(numberop1 ^ numberop2);
            } else {
              ltm.luaT_trybinTM(L, op1, op2, L.stack[ra], ltm.TMS.TM_BXOR);
            }
            break;
          }
          case OP_SHL: {
            let op1 = RKB(L, base, k, i);
            let op2 = RKC(L, base, k, i);
            let numberop1, numberop2;
            if ((numberop1 = tointeger(op1)) !== false && (numberop2 = tointeger(op2)) !== false) {
              L.stack[ra].setivalue(luaV_shiftl(numberop1, numberop2));
            } else {
              ltm.luaT_trybinTM(L, op1, op2, L.stack[ra], ltm.TMS.TM_SHL);
            }
            break;
          }
          case OP_SHR: {
            let op1 = RKB(L, base, k, i);
            let op2 = RKC(L, base, k, i);
            let numberop1, numberop2;
            if ((numberop1 = tointeger(op1)) !== false && (numberop2 = tointeger(op2)) !== false) {
              L.stack[ra].setivalue(luaV_shiftl(numberop1, -numberop2));
            } else {
              ltm.luaT_trybinTM(L, op1, op2, L.stack[ra], ltm.TMS.TM_SHR);
            }
            break;
          }
          case OP_UNM: {
            let op = L.stack[RB(L, base, i)];
            let numberop;
            if (op.ttisinteger()) {
              L.stack[ra].setivalue(-op.value | 0);
            } else if ((numberop = tonumber(op)) !== false) {
              L.stack[ra].setfltvalue(-numberop);
            } else {
              ltm.luaT_trybinTM(L, op, op, L.stack[ra], ltm.TMS.TM_UNM);
            }
            break;
          }
          case OP_BNOT: {
            let op = L.stack[RB(L, base, i)];
            if (op.ttisinteger()) {
              L.stack[ra].setivalue(~op.value);
            } else {
              ltm.luaT_trybinTM(L, op, op, L.stack[ra], ltm.TMS.TM_BNOT);
            }
            break;
          }
          case OP_NOT: {
            let op = L.stack[RB(L, base, i)];
            L.stack[ra].setbvalue(op.l_isfalse());
            break;
          }
          case OP_LEN: {
            luaV_objlen(L, L.stack[ra], L.stack[RB(L, base, i)]);
            break;
          }
          case OP_CONCAT: {
            let b = i.B;
            let c = i.C;
            L.top = base + c + 1;
            luaV_concat(L, c - b + 1);
            let rb = base + b;
            lobject.setobjs2s(L, ra, rb);
            ldo.adjust_top(L, ci.top);
            break;
          }
          case OP_JMP: {
            dojump(L, ci, i, 0);
            break;
          }
          case OP_EQ: {
            if (luaV_equalobj(L, RKB(L, base, k, i), RKC(L, base, k, i)) !== i.A)
              ci.l_savedpc++;
            else
              donextjump(L, ci);
            break;
          }
          case OP_LT: {
            if (luaV_lessthan(L, RKB(L, base, k, i), RKC(L, base, k, i)) !== i.A)
              ci.l_savedpc++;
            else
              donextjump(L, ci);
            break;
          }
          case OP_LE: {
            if (luaV_lessequal(L, RKB(L, base, k, i), RKC(L, base, k, i)) !== i.A)
              ci.l_savedpc++;
            else
              donextjump(L, ci);
            break;
          }
          case OP_TEST: {
            if (i.C ? L.stack[ra].l_isfalse() : !L.stack[ra].l_isfalse())
              ci.l_savedpc++;
            else
              donextjump(L, ci);
            break;
          }
          case OP_TESTSET: {
            let rbIdx = RB(L, base, i);
            let rb = L.stack[rbIdx];
            if (i.C ? rb.l_isfalse() : !rb.l_isfalse())
              ci.l_savedpc++;
            else {
              lobject.setobjs2s(L, ra, rbIdx);
              donextjump(L, ci);
            }
            break;
          }
          case OP_CALL: {
            let b = i.B;
            let nresults = i.C - 1;
            if (b !== 0)
              ldo.adjust_top(L, ra + b);
            if (ldo.luaD_precall(L, ra, nresults)) {
              if (nresults >= 0)
                ldo.adjust_top(L, ci.top);
            } else {
              ci = L.ci;
              continue newframe;
            }
            break;
          }
          case OP_TAILCALL: {
            let b = i.B;
            if (b !== 0)
              ldo.adjust_top(L, ra + b);
            if (ldo.luaD_precall(L, ra, LUA_MULTRET)) {} else {
              let nci = L.ci;
              let oci = nci.previous;
              let nfunc = nci.func;
              let nfuncOff = nci.funcOff;
              let ofuncOff = oci.funcOff;
              let lim = nci.l_base + nfunc.value.p.numparams;
              if (cl.p.p.length > 0)
                lfunc.luaF_close(L, oci.l_base);
              for (let aux = 0;nfuncOff + aux < lim; aux++)
                lobject.setobjs2s(L, ofuncOff + aux, nfuncOff + aux);
              oci.l_base = ofuncOff + (nci.l_base - nfuncOff);
              oci.top = ofuncOff + (L.top - nfuncOff);
              ldo.adjust_top(L, oci.top);
              oci.l_code = nci.l_code;
              oci.l_savedpc = nci.l_savedpc;
              oci.callstatus |= lstate.CIST_TAIL;
              oci.next = null;
              ci = L.ci = oci;
              lua_assert(L.top === oci.l_base + L.stack[ofuncOff].value.p.maxstacksize);
              continue newframe;
            }
            break;
          }
          case OP_RETURN: {
            if (cl.p.p.length > 0)
              lfunc.luaF_close(L, base);
            let b = ldo.luaD_poscall(L, ci, ra, i.B !== 0 ? i.B - 1 : L.top - ra);
            if (ci.callstatus & lstate.CIST_FRESH)
              return;
            ci = L.ci;
            if (b)
              ldo.adjust_top(L, ci.top);
            lua_assert(ci.callstatus & lstate.CIST_LUA);
            lua_assert(ci.l_code[ci.l_savedpc - 1].opcode === OP_CALL);
            continue newframe;
          }
          case OP_FORLOOP: {
            if (L.stack[ra].ttisinteger()) {
              let step = L.stack[ra + 2].value;
              let idx = L.stack[ra].value + step | 0;
              let limit = L.stack[ra + 1].value;
              if (0 < step ? idx <= limit : limit <= idx) {
                ci.l_savedpc += i.sBx;
                L.stack[ra].chgivalue(idx);
                L.stack[ra + 3].setivalue(idx);
              }
            } else {
              let step = L.stack[ra + 2].value;
              let idx = L.stack[ra].value + step;
              let limit = L.stack[ra + 1].value;
              if (0 < step ? idx <= limit : limit <= idx) {
                ci.l_savedpc += i.sBx;
                L.stack[ra].chgfltvalue(idx);
                L.stack[ra + 3].setfltvalue(idx);
              }
            }
            break;
          }
          case OP_FORPREP: {
            let init = L.stack[ra];
            let plimit = L.stack[ra + 1];
            let pstep = L.stack[ra + 2];
            let forlim;
            if (init.ttisinteger() && pstep.ttisinteger() && (forlim = forlimit(plimit, pstep.value))) {
              let initv = forlim.stopnow ? 0 : init.value;
              plimit.value = forlim.ilimit;
              init.value = initv - pstep.value | 0;
            } else {
              let nlimit, nstep, ninit;
              if ((nlimit = tonumber(plimit)) === false)
                ldebug.luaG_runerror(L, to_luastring("'for' limit must be a number", true));
              L.stack[ra + 1].setfltvalue(nlimit);
              if ((nstep = tonumber(pstep)) === false)
                ldebug.luaG_runerror(L, to_luastring("'for' step must be a number", true));
              L.stack[ra + 2].setfltvalue(nstep);
              if ((ninit = tonumber(init)) === false)
                ldebug.luaG_runerror(L, to_luastring("'for' initial value must be a number", true));
              L.stack[ra].setfltvalue(ninit - nstep);
            }
            ci.l_savedpc += i.sBx;
            break;
          }
          case OP_TFORCALL: {
            let cb = ra + 3;
            lobject.setobjs2s(L, cb + 2, ra + 2);
            lobject.setobjs2s(L, cb + 1, ra + 1);
            lobject.setobjs2s(L, cb, ra);
            ldo.adjust_top(L, cb + 3);
            ldo.luaD_call(L, cb, i.C);
            ldo.adjust_top(L, ci.top);
            i = ci.l_code[ci.l_savedpc++];
            ra = RA(L, base, i);
            lua_assert(i.opcode === OP_TFORLOOP);
          }
          case OP_TFORLOOP: {
            if (!L.stack[ra + 1].ttisnil()) {
              lobject.setobjs2s(L, ra, ra + 1);
              ci.l_savedpc += i.sBx;
            }
            break;
          }
          case OP_SETLIST: {
            let n = i.B;
            let c = i.C;
            if (n === 0)
              n = L.top - ra - 1;
            if (c === 0) {
              lua_assert(ci.l_code[ci.l_savedpc].opcode === OP_EXTRAARG);
              c = ci.l_code[ci.l_savedpc++].Ax;
            }
            let h = L.stack[ra].value;
            let last = (c - 1) * LFIELDS_PER_FLUSH + n;
            for (;n > 0; n--) {
              ltable.luaH_setint(h, last--, L.stack[ra + n]);
            }
            ldo.adjust_top(L, ci.top);
            break;
          }
          case OP_CLOSURE: {
            let p = cl.p.p[i.Bx];
            let ncl = getcached(p, cl.upvals, L.stack, base);
            if (ncl === null)
              pushclosure(L, p, cl.upvals, base, ra);
            else
              L.stack[ra].setclLvalue(ncl);
            break;
          }
          case OP_VARARG: {
            let b = i.B - 1;
            let n = base - ci.funcOff - cl.p.numparams - 1;
            let j;
            if (n < 0)
              n = 0;
            if (b < 0) {
              b = n;
              ldo.luaD_checkstack(L, n);
              ldo.adjust_top(L, ra + n);
            }
            for (j = 0;j < b && j < n; j++)
              lobject.setobjs2s(L, ra + j, base - n + j);
            for (;j < b; j++)
              L.stack[ra + j].setnilvalue();
            break;
          }
          case OP_EXTRAARG: {
            throw Error("invalid opcode");
          }
        }
      }
  };
  var dojump = function(L, ci, i, e) {
    let a = i.A;
    if (a !== 0)
      lfunc.luaF_close(L, ci.l_base + a - 1);
    ci.l_savedpc += i.sBx + e;
  };
  var donextjump = function(L, ci) {
    dojump(L, ci, ci.l_code[ci.l_savedpc], 1);
  };
  var luaV_lessthan = function(L, l, r) {
    if (l.ttisnumber() && r.ttisnumber())
      return LTnum(l, r) ? 1 : 0;
    else if (l.ttisstring() && r.ttisstring())
      return l_strcmp(l.tsvalue(), r.tsvalue()) < 0 ? 1 : 0;
    else {
      let res = ltm.luaT_callorderTM(L, l, r, ltm.TMS.TM_LT);
      if (res === null)
        ldebug.luaG_ordererror(L, l, r);
      return res ? 1 : 0;
    }
  };
  var luaV_lessequal = function(L, l, r) {
    let res;
    if (l.ttisnumber() && r.ttisnumber())
      return LEnum(l, r) ? 1 : 0;
    else if (l.ttisstring() && r.ttisstring())
      return l_strcmp(l.tsvalue(), r.tsvalue()) <= 0 ? 1 : 0;
    else {
      res = ltm.luaT_callorderTM(L, l, r, ltm.TMS.TM_LE);
      if (res !== null)
        return res ? 1 : 0;
    }
    L.ci.callstatus |= lstate.CIST_LEQ;
    res = ltm.luaT_callorderTM(L, r, l, ltm.TMS.TM_LT);
    L.ci.callstatus ^= lstate.CIST_LEQ;
    if (res === null)
      ldebug.luaG_ordererror(L, l, r);
    return res ? 0 : 1;
  };
  var luaV_equalobj = function(L, t1, t2) {
    if (t1.ttype() !== t2.ttype()) {
      if (t1.ttnov() !== t2.ttnov() || t1.ttnov() !== LUA_TNUMBER)
        return 0;
      else {
        return t1.value === t2.value ? 1 : 0;
      }
    }
    let tm;
    switch (t1.ttype()) {
      case LUA_TNIL:
        return 1;
      case LUA_TBOOLEAN:
        return t1.value == t2.value ? 1 : 0;
      case LUA_TLIGHTUSERDATA:
      case LUA_TNUMINT:
      case LUA_TNUMFLT:
      case LUA_TLCF:
        return t1.value === t2.value ? 1 : 0;
      case LUA_TSHRSTR:
      case LUA_TLNGSTR: {
        return luaS_eqlngstr(t1.tsvalue(), t2.tsvalue()) ? 1 : 0;
      }
      case LUA_TUSERDATA:
      case LUA_TTABLE:
        if (t1.value === t2.value)
          return 1;
        else if (L === null)
          return 0;
        tm = ltm.fasttm(L, t1.value.metatable, ltm.TMS.TM_EQ);
        if (tm === null)
          tm = ltm.fasttm(L, t2.value.metatable, ltm.TMS.TM_EQ);
        break;
      default:
        return t1.value === t2.value ? 1 : 0;
    }
    if (tm === null)
      return 0;
    let tv = new lobject.TValue;
    ltm.luaT_callTM(L, tm, t1, t2, tv, 1);
    return tv.l_isfalse() ? 0 : 1;
  };
  var luaV_rawequalobj = function(t1, t2) {
    return luaV_equalobj(null, t1, t2);
  };
  var forlimit = function(obj, step) {
    let stopnow = false;
    let ilimit = luaV_tointeger(obj, step < 0 ? 2 : 1);
    if (ilimit === false) {
      let n = tonumber(obj);
      if (n === false)
        return false;
      if (0 < n) {
        ilimit = LUA_MAXINTEGER;
        if (step < 0)
          stopnow = true;
      } else {
        ilimit = LUA_MININTEGER;
        if (step >= 0)
          stopnow = true;
      }
    }
    return {
      stopnow,
      ilimit
    };
  };
  var luaV_tointeger = function(obj, mode) {
    if (obj.ttisfloat()) {
      let n = obj.value;
      let f = Math.floor(n);
      if (n !== f) {
        if (mode === 0)
          return false;
        else if (mode > 1)
          f += 1;
      }
      return lua_numbertointeger(f);
    } else if (obj.ttisinteger()) {
      return obj.value;
    } else if (cvt2num(obj)) {
      let v = new lobject.TValue;
      if (lobject.luaO_str2num(obj.svalue(), v) === obj.vslen() + 1)
        return luaV_tointeger(v, mode);
    }
    return false;
  };
  var tointeger = function(o) {
    return o.ttisinteger() ? o.value : luaV_tointeger(o, 0);
  };
  var tonumber = function(o) {
    if (o.ttnov() === LUA_TNUMBER)
      return o.value;
    if (cvt2num(o)) {
      let v = new lobject.TValue;
      if (lobject.luaO_str2num(o.svalue(), v) === o.vslen() + 1)
        return v.value;
    }
    return false;
  };
  var LTnum = function(l, r) {
    return l.value < r.value;
  };
  var LEnum = function(l, r) {
    return l.value <= r.value;
  };
  var l_strcmp = function(ls, rs) {
    let l = luaS_hashlongstr(ls);
    let r = luaS_hashlongstr(rs);
    if (l === r)
      return 0;
    else if (l < r)
      return -1;
    else
      return 1;
  };
  var luaV_objlen = function(L, ra, rb) {
    let tm;
    switch (rb.ttype()) {
      case LUA_TTABLE: {
        let h = rb.value;
        tm = ltm.fasttm(L, h.metatable, ltm.TMS.TM_LEN);
        if (tm !== null)
          break;
        ra.setivalue(ltable.luaH_getn(h));
        return;
      }
      case LUA_TSHRSTR:
      case LUA_TLNGSTR:
        ra.setivalue(rb.vslen());
        return;
      default: {
        tm = ltm.luaT_gettmbyobj(L, rb, ltm.TMS.TM_LEN);
        if (tm.ttisnil())
          ldebug.luaG_typeerror(L, rb, to_luastring("get length of", true));
        break;
      }
    }
    ltm.luaT_callTM(L, tm, rb, rb, ra, 1);
  };
  var luaV_imul = Math.imul || function(a, b) {
    let aHi = a >>> 16 & 65535;
    let aLo = a & 65535;
    let bHi = b >>> 16 & 65535;
    let bLo = b & 65535;
    return aLo * bLo + (aHi * bLo + aLo * bHi << 16 >>> 0) | 0;
  };
  var luaV_div = function(L, m, n) {
    if (n === 0)
      ldebug.luaG_runerror(L, to_luastring("attempt to divide by zero"));
    return Math.floor(m / n) | 0;
  };
  var luaV_mod = function(L, m, n) {
    if (n === 0)
      ldebug.luaG_runerror(L, to_luastring("attempt to perform 'n%%0'"));
    return m - Math.floor(m / n) * n | 0;
  };
  var NBITS = 32;
  var luaV_shiftl = function(x, y) {
    if (y < 0) {
      if (y <= -NBITS)
        return 0;
      else
        return x >>> -y;
    } else {
      if (y >= NBITS)
        return 0;
      else
        return x << y;
    }
  };
  var getcached = function(p, encup, stack, base) {
    let c = p.cache;
    if (c !== null) {
      let uv = p.upvalues;
      let nup = uv.length;
      for (let i = 0;i < nup; i++) {
        let v = uv[i].instack ? stack[base + uv[i].idx] : encup[uv[i].idx];
        if (c.upvals[i] !== v)
          return null;
      }
    }
    return c;
  };
  var pushclosure = function(L, p, encup, base, ra) {
    let nup = p.upvalues.length;
    let uv = p.upvalues;
    let ncl = new lobject.LClosure(L, nup);
    ncl.p = p;
    L.stack[ra].setclLvalue(ncl);
    for (let i = 0;i < nup; i++) {
      if (uv[i].instack)
        ncl.upvals[i] = lfunc.luaF_findupval(L, base + uv[i].idx);
      else
        ncl.upvals[i] = encup[uv[i].idx];
    }
    p.cache = ncl;
  };
  var cvt2str = function(o) {
    return o.ttisnumber();
  };
  var cvt2num = function(o) {
    return o.ttisstring();
  };
  var tostring = function(L, i) {
    let o = L.stack[i];
    if (o.ttisstring())
      return true;
    if (cvt2str(o)) {
      lobject.luaO_tostring(L, o);
      return true;
    }
    return false;
  };
  var isemptystr = function(o) {
    return o.ttisstring() && o.vslen() === 0;
  };
  var copy2buff = function(L, top, n, buff) {
    let tl = 0;
    do {
      let tv = L.stack[top - n];
      let l = tv.vslen();
      let s = tv.svalue();
      buff.set(s, tl);
      tl += l;
    } while (--n > 0);
  };
  var luaV_concat = function(L, total) {
    lua_assert(total >= 2);
    do {
      let top = L.top;
      let n = 2;
      if (!(L.stack[top - 2].ttisstring() || cvt2str(L.stack[top - 2])) || !tostring(L, top - 1)) {
        ltm.luaT_trybinTM(L, L.stack[top - 2], L.stack[top - 1], L.stack[top - 2], ltm.TMS.TM_CONCAT);
      } else if (isemptystr(L.stack[top - 1])) {
        tostring(L, top - 2);
      } else if (isemptystr(L.stack[top - 2])) {
        lobject.setobjs2s(L, top - 2, top - 1);
      } else {
        let tl = L.stack[top - 1].vslen();
        for (n = 1;n < total && tostring(L, top - n - 1); n++) {
          let l = L.stack[top - n - 1].vslen();
          tl += l;
        }
        let buff = new Uint8Array(tl);
        copy2buff(L, top, n, buff);
        let ts = luaS_bless(L, buff);
        lobject.setsvalue2s(L, top - n, ts);
      }
      total -= n - 1;
      for (;L.top > top - (n - 1); )
        delete L.stack[--L.top];
    } while (total > 1);
  };
  var MAXTAGLOOP = 2000;
  var luaV_gettable = function(L, t, key, ra) {
    for (let loop = 0;loop < MAXTAGLOOP; loop++) {
      let tm;
      if (!t.ttistable()) {
        tm = ltm.luaT_gettmbyobj(L, t, ltm.TMS.TM_INDEX);
        if (tm.ttisnil())
          ldebug.luaG_typeerror(L, t, to_luastring("index", true));
      } else {
        let slot = ltable.luaH_get(L, t.value, key);
        if (!slot.ttisnil()) {
          lobject.setobj2s(L, ra, slot);
          return;
        } else {
          tm = ltm.fasttm(L, t.value.metatable, ltm.TMS.TM_INDEX);
          if (tm === null) {
            L.stack[ra].setnilvalue();
            return;
          }
        }
      }
      if (tm.ttisfunction()) {
        ltm.luaT_callTM(L, tm, t, key, L.stack[ra], 1);
        return;
      }
      t = tm;
    }
    ldebug.luaG_runerror(L, to_luastring("'__index' chain too long; possible loop", true));
  };
  var settable = function(L, t, key, val) {
    for (let loop = 0;loop < MAXTAGLOOP; loop++) {
      let tm;
      if (t.ttistable()) {
        let h = t.value;
        let slot = ltable.luaH_get(L, h, key);
        if (!slot.ttisnil() || (tm = ltm.fasttm(L, h.metatable, ltm.TMS.TM_NEWINDEX)) === null) {
          ltable.luaH_setfrom(L, h, key, val);
          ltable.invalidateTMcache(h);
          return;
        }
      } else {
        if ((tm = ltm.luaT_gettmbyobj(L, t, ltm.TMS.TM_NEWINDEX)).ttisnil())
          ldebug.luaG_typeerror(L, t, to_luastring("index", true));
      }
      if (tm.ttisfunction()) {
        ltm.luaT_callTM(L, tm, t, key, val, 0);
        return;
      }
      t = tm;
    }
    ldebug.luaG_runerror(L, to_luastring("'__newindex' chain too long; possible loop", true));
  };
  exports.cvt2str = cvt2str;
  exports.cvt2num = cvt2num;
  exports.luaV_gettable = luaV_gettable;
  exports.luaV_concat = luaV_concat;
  exports.luaV_div = luaV_div;
  exports.luaV_equalobj = luaV_equalobj;
  exports.luaV_execute = luaV_execute;
  exports.luaV_finishOp = luaV_finishOp;
  exports.luaV_imul = luaV_imul;
  exports.luaV_lessequal = luaV_lessequal;
  exports.luaV_lessthan = luaV_lessthan;
  exports.luaV_mod = luaV_mod;
  exports.luaV_objlen = luaV_objlen;
  exports.luaV_rawequalobj = luaV_rawequalobj;
  exports.luaV_shiftl = luaV_shiftl;
  exports.luaV_tointeger = luaV_tointeger;
  exports.settable = settable;
  exports.tointeger = tointeger;
  exports.tonumber = tonumber;
});

// node_modules/fengari/src/ltm.js
var require_ltm = __commonJS(function(exports, module) {
  var {
    constant_types: {
      LUA_TTABLE,
      LUA_TUSERDATA
    },
    to_luastring
  } = require_defs();
  var { lua_assert } = require_llimits();
  var lobject = require_lobject();
  var ldo = require_ldo();
  var lstate = require_lstate();
  var {
    luaS_bless,
    luaS_new
  } = require_lstring();
  var ltable = require_ltable();
  var ldebug = require_ldebug();
  var lvm = require_lvm();
  var luaT_typenames_ = [
    "no value",
    "nil",
    "boolean",
    "userdata",
    "number",
    "string",
    "table",
    "function",
    "userdata",
    "thread",
    "proto"
  ].map((e) => to_luastring(e));
  var ttypename = function(t) {
    return luaT_typenames_[t + 1];
  };
  var TMS = {
    TM_INDEX: 0,
    TM_NEWINDEX: 1,
    TM_GC: 2,
    TM_MODE: 3,
    TM_LEN: 4,
    TM_EQ: 5,
    TM_ADD: 6,
    TM_SUB: 7,
    TM_MUL: 8,
    TM_MOD: 9,
    TM_POW: 10,
    TM_DIV: 11,
    TM_IDIV: 12,
    TM_BAND: 13,
    TM_BOR: 14,
    TM_BXOR: 15,
    TM_SHL: 16,
    TM_SHR: 17,
    TM_UNM: 18,
    TM_BNOT: 19,
    TM_LT: 20,
    TM_LE: 21,
    TM_CONCAT: 22,
    TM_CALL: 23,
    TM_N: 24
  };
  var luaT_init = function(L) {
    L.l_G.tmname[TMS.TM_INDEX] = new luaS_new(L, to_luastring("__index", true));
    L.l_G.tmname[TMS.TM_NEWINDEX] = new luaS_new(L, to_luastring("__newindex", true));
    L.l_G.tmname[TMS.TM_GC] = new luaS_new(L, to_luastring("__gc", true));
    L.l_G.tmname[TMS.TM_MODE] = new luaS_new(L, to_luastring("__mode", true));
    L.l_G.tmname[TMS.TM_LEN] = new luaS_new(L, to_luastring("__len", true));
    L.l_G.tmname[TMS.TM_EQ] = new luaS_new(L, to_luastring("__eq", true));
    L.l_G.tmname[TMS.TM_ADD] = new luaS_new(L, to_luastring("__add", true));
    L.l_G.tmname[TMS.TM_SUB] = new luaS_new(L, to_luastring("__sub", true));
    L.l_G.tmname[TMS.TM_MUL] = new luaS_new(L, to_luastring("__mul", true));
    L.l_G.tmname[TMS.TM_MOD] = new luaS_new(L, to_luastring("__mod", true));
    L.l_G.tmname[TMS.TM_POW] = new luaS_new(L, to_luastring("__pow", true));
    L.l_G.tmname[TMS.TM_DIV] = new luaS_new(L, to_luastring("__div", true));
    L.l_G.tmname[TMS.TM_IDIV] = new luaS_new(L, to_luastring("__idiv", true));
    L.l_G.tmname[TMS.TM_BAND] = new luaS_new(L, to_luastring("__band", true));
    L.l_G.tmname[TMS.TM_BOR] = new luaS_new(L, to_luastring("__bor", true));
    L.l_G.tmname[TMS.TM_BXOR] = new luaS_new(L, to_luastring("__bxor", true));
    L.l_G.tmname[TMS.TM_SHL] = new luaS_new(L, to_luastring("__shl", true));
    L.l_G.tmname[TMS.TM_SHR] = new luaS_new(L, to_luastring("__shr", true));
    L.l_G.tmname[TMS.TM_UNM] = new luaS_new(L, to_luastring("__unm", true));
    L.l_G.tmname[TMS.TM_BNOT] = new luaS_new(L, to_luastring("__bnot", true));
    L.l_G.tmname[TMS.TM_LT] = new luaS_new(L, to_luastring("__lt", true));
    L.l_G.tmname[TMS.TM_LE] = new luaS_new(L, to_luastring("__le", true));
    L.l_G.tmname[TMS.TM_CONCAT] = new luaS_new(L, to_luastring("__concat", true));
    L.l_G.tmname[TMS.TM_CALL] = new luaS_new(L, to_luastring("__call", true));
  };
  var __name = to_luastring("__name", true);
  var luaT_objtypename = function(L, o) {
    let mt;
    if (o.ttistable() && (mt = o.value.metatable) !== null || o.ttisfulluserdata() && (mt = o.value.metatable) !== null) {
      let name = ltable.luaH_getstr(mt, luaS_bless(L, __name));
      if (name.ttisstring())
        return name.svalue();
    }
    return ttypename(o.ttnov());
  };
  var luaT_callTM = function(L, f, p1, p2, p3, hasres) {
    let func = L.top;
    lobject.pushobj2s(L, f);
    lobject.pushobj2s(L, p1);
    lobject.pushobj2s(L, p2);
    if (!hasres)
      lobject.pushobj2s(L, p3);
    if (L.ci.callstatus & lstate.CIST_LUA)
      ldo.luaD_call(L, func, hasres);
    else
      ldo.luaD_callnoyield(L, func, hasres);
    if (hasres) {
      let tv = L.stack[L.top - 1];
      delete L.stack[--L.top];
      p3.setfrom(tv);
    }
  };
  var luaT_callbinTM = function(L, p1, p2, res, event) {
    let tm = luaT_gettmbyobj(L, p1, event);
    if (tm.ttisnil())
      tm = luaT_gettmbyobj(L, p2, event);
    if (tm.ttisnil())
      return false;
    luaT_callTM(L, tm, p1, p2, res, 1);
    return true;
  };
  var luaT_trybinTM = function(L, p1, p2, res, event) {
    if (!luaT_callbinTM(L, p1, p2, res, event)) {
      switch (event) {
        case TMS.TM_CONCAT:
          return ldebug.luaG_concaterror(L, p1, p2);
        case TMS.TM_BAND:
        case TMS.TM_BOR:
        case TMS.TM_BXOR:
        case TMS.TM_SHL:
        case TMS.TM_SHR:
        case TMS.TM_BNOT: {
          let n1 = lvm.tonumber(p1);
          let n2 = lvm.tonumber(p2);
          if (n1 !== false && n2 !== false)
            return ldebug.luaG_tointerror(L, p1, p2);
          else
            return ldebug.luaG_opinterror(L, p1, p2, to_luastring("perform bitwise operation on", true));
        }
        default:
          return ldebug.luaG_opinterror(L, p1, p2, to_luastring("perform arithmetic on", true));
      }
    }
  };
  var luaT_callorderTM = function(L, p1, p2, event) {
    let res = new lobject.TValue;
    if (!luaT_callbinTM(L, p1, p2, res, event))
      return null;
    else
      return !res.l_isfalse();
  };
  var fasttm = function(l, et, e) {
    return et === null ? null : et.flags & 1 << e ? null : luaT_gettm(et, e, l.l_G.tmname[e]);
  };
  var luaT_gettm = function(events, event, ename) {
    const tm = ltable.luaH_getstr(events, ename);
    lua_assert(event <= TMS.TM_EQ);
    if (tm.ttisnil()) {
      events.flags |= 1 << event;
      return null;
    } else
      return tm;
  };
  var luaT_gettmbyobj = function(L, o, event) {
    let mt;
    switch (o.ttnov()) {
      case LUA_TTABLE:
      case LUA_TUSERDATA:
        mt = o.value.metatable;
        break;
      default:
        mt = L.l_G.mt[o.ttnov()];
    }
    return mt ? ltable.luaH_getstr(mt, L.l_G.tmname[event]) : lobject.luaO_nilobject;
  };
  exports.fasttm = fasttm;
  exports.TMS = TMS;
  exports.luaT_callTM = luaT_callTM;
  exports.luaT_callbinTM = luaT_callbinTM;
  exports.luaT_trybinTM = luaT_trybinTM;
  exports.luaT_callorderTM = luaT_callorderTM;
  exports.luaT_gettm = luaT_gettm;
  exports.luaT_gettmbyobj = luaT_gettmbyobj;
  exports.luaT_init = luaT_init;
  exports.luaT_objtypename = luaT_objtypename;
  exports.ttypename = ttypename;
});

// node_modules/fengari/src/lstate.js
var require_lstate = __commonJS(function(exports, module) {
  var {
    LUA_MINSTACK,
    LUA_RIDX_GLOBALS,
    LUA_RIDX_MAINTHREAD,
    constant_types: {
      LUA_NUMTAGS,
      LUA_TNIL,
      LUA_TTABLE,
      LUA_TTHREAD
    },
    thread_status: {
      LUA_OK
    }
  } = require_defs();
  var lobject = require_lobject();
  var ldo = require_ldo();
  var lapi = require_lapi();
  var ltable = require_ltable();
  var ltm = require_ltm();
  var EXTRA_STACK = 5;
  var BASIC_STACK_SIZE = 2 * LUA_MINSTACK;

  class CallInfo {
    constructor() {
      this.func = null;
      this.funcOff = NaN;
      this.top = NaN;
      this.previous = null;
      this.next = null;
      this.l_base = NaN;
      this.l_code = null;
      this.l_savedpc = NaN;
      this.c_k = null;
      this.c_old_errfunc = null;
      this.c_ctx = null;
      this.nresults = NaN;
      this.callstatus = NaN;
    }
  }

  class lua_State {
    constructor(g) {
      this.id = g.id_counter++;
      this.base_ci = new CallInfo;
      this.top = NaN;
      this.stack_last = NaN;
      this.oldpc = NaN;
      this.l_G = g;
      this.stack = null;
      this.ci = null;
      this.errorJmp = null;
      this.nCcalls = 0;
      this.hook = null;
      this.hookmask = 0;
      this.basehookcount = 0;
      this.allowhook = 1;
      this.hookcount = this.basehookcount;
      this.nny = 1;
      this.status = LUA_OK;
      this.errfunc = 0;
    }
  }

  class global_State {
    constructor() {
      this.id_counter = 1;
      this.ids = new WeakMap;
      this.mainthread = null;
      this.l_registry = new lobject.TValue(LUA_TNIL, null);
      this.panic = null;
      this.atnativeerror = null;
      this.version = null;
      this.tmname = new Array(ltm.TMS.TM_N);
      this.mt = new Array(LUA_NUMTAGS);
    }
  }
  var luaE_extendCI = function(L) {
    let ci = new CallInfo;
    L.ci.next = ci;
    ci.previous = L.ci;
    ci.next = null;
    L.ci = ci;
    return ci;
  };
  var luaE_freeCI = function(L) {
    let ci = L.ci;
    ci.next = null;
  };
  var stack_init = function(L1, L) {
    L1.stack = new Array(BASIC_STACK_SIZE);
    L1.top = 0;
    L1.stack_last = BASIC_STACK_SIZE - EXTRA_STACK;
    let ci = L1.base_ci;
    ci.next = ci.previous = null;
    ci.callstatus = 0;
    ci.funcOff = L1.top;
    ci.func = L1.stack[L1.top];
    L1.stack[L1.top++] = new lobject.TValue(LUA_TNIL, null);
    ci.top = L1.top + LUA_MINSTACK;
    L1.ci = ci;
  };
  var freestack = function(L) {
    L.ci = L.base_ci;
    luaE_freeCI(L);
    L.stack = null;
  };
  var init_registry = function(L, g) {
    let registry = ltable.luaH_new(L);
    g.l_registry.sethvalue(registry);
    ltable.luaH_setint(registry, LUA_RIDX_MAINTHREAD, new lobject.TValue(LUA_TTHREAD, L));
    ltable.luaH_setint(registry, LUA_RIDX_GLOBALS, new lobject.TValue(LUA_TTABLE, ltable.luaH_new(L)));
  };
  var f_luaopen = function(L) {
    let g = L.l_G;
    stack_init(L, L);
    init_registry(L, g);
    ltm.luaT_init(L);
    g.version = lapi.lua_version(null);
  };
  var lua_newthread = function(L) {
    let g = L.l_G;
    let L1 = new lua_State(g);
    L.stack[L.top] = new lobject.TValue(LUA_TTHREAD, L1);
    lapi.api_incr_top(L);
    L1.hookmask = L.hookmask;
    L1.basehookcount = L.basehookcount;
    L1.hook = L.hook;
    L1.hookcount = L1.basehookcount;
    stack_init(L1, L);
    return L1;
  };
  var luaE_freethread = function(L, L1) {
    freestack(L1);
  };
  var lua_newstate = function() {
    let g = new global_State;
    let L = new lua_State(g);
    g.mainthread = L;
    if (ldo.luaD_rawrunprotected(L, f_luaopen, null) !== LUA_OK) {
      L = null;
    }
    return L;
  };
  var close_state = function(L) {
    freestack(L);
  };
  var lua_close = function(L) {
    L = L.l_G.mainthread;
    close_state(L);
  };
  exports.lua_State = lua_State;
  exports.CallInfo = CallInfo;
  exports.CIST_OAH = 1 << 0;
  exports.CIST_LUA = 1 << 1;
  exports.CIST_HOOKED = 1 << 2;
  exports.CIST_FRESH = 1 << 3;
  exports.CIST_YPCALL = 1 << 4;
  exports.CIST_TAIL = 1 << 5;
  exports.CIST_HOOKYIELD = 1 << 6;
  exports.CIST_LEQ = 1 << 7;
  exports.CIST_FIN = 1 << 8;
  exports.EXTRA_STACK = EXTRA_STACK;
  exports.lua_close = lua_close;
  exports.lua_newstate = lua_newstate;
  exports.lua_newthread = lua_newthread;
  exports.luaE_extendCI = luaE_extendCI;
  exports.luaE_freeCI = luaE_freeCI;
  exports.luaE_freethread = luaE_freethread;
});

// node_modules/fengari/src/lobject.js
var require_lobject = __commonJS(function(exports, module) {
  var {
    LUA_OPADD,
    LUA_OPBAND,
    LUA_OPBNOT,
    LUA_OPBOR,
    LUA_OPBXOR,
    LUA_OPDIV,
    LUA_OPIDIV,
    LUA_OPMOD,
    LUA_OPMUL,
    LUA_OPPOW,
    LUA_OPSHL,
    LUA_OPSHR,
    LUA_OPSUB,
    LUA_OPUNM,
    constant_types: {
      LUA_NUMTAGS,
      LUA_TBOOLEAN,
      LUA_TCCL,
      LUA_TFUNCTION,
      LUA_TLCF,
      LUA_TLCL,
      LUA_TLIGHTUSERDATA,
      LUA_TLNGSTR,
      LUA_TNIL,
      LUA_TNUMBER,
      LUA_TNUMFLT,
      LUA_TNUMINT,
      LUA_TSHRSTR,
      LUA_TSTRING,
      LUA_TTABLE,
      LUA_TTHREAD,
      LUA_TUSERDATA
    },
    from_userstring,
    luastring_indexOf,
    luastring_of,
    to_jsstring,
    to_luastring
  } = require_defs();
  var {
    lisdigit,
    lisprint,
    lisspace,
    lisxdigit
  } = require_ljstype();
  var ldebug = require_ldebug();
  var ldo = require_ldo();
  var lstate = require_lstate();
  var {
    luaS_bless,
    luaS_new
  } = require_lstring();
  var ltable = require_ltable();
  var {
    LUA_COMPAT_FLOATSTRING,
    ldexp,
    lua_integer2str,
    lua_number2str
  } = require_luaconf();
  var lvm = require_lvm();
  var {
    MAX_INT,
    luai_nummod,
    lua_assert
  } = require_llimits();
  var ltm = require_ltm();
  var LUA_TPROTO = LUA_NUMTAGS;
  var LUA_TDEADKEY = LUA_NUMTAGS + 1;

  class TValue {
    constructor(type, value) {
      this.type = type;
      this.value = value;
    }
    ttype() {
      return this.type & 63;
    }
    ttnov() {
      return this.type & 15;
    }
    checktag(t) {
      return this.type === t;
    }
    checktype(t) {
      return this.ttnov() === t;
    }
    ttisnumber() {
      return this.checktype(LUA_TNUMBER);
    }
    ttisfloat() {
      return this.checktag(LUA_TNUMFLT);
    }
    ttisinteger() {
      return this.checktag(LUA_TNUMINT);
    }
    ttisnil() {
      return this.checktag(LUA_TNIL);
    }
    ttisboolean() {
      return this.checktag(LUA_TBOOLEAN);
    }
    ttislightuserdata() {
      return this.checktag(LUA_TLIGHTUSERDATA);
    }
    ttisstring() {
      return this.checktype(LUA_TSTRING);
    }
    ttisshrstring() {
      return this.checktag(LUA_TSHRSTR);
    }
    ttislngstring() {
      return this.checktag(LUA_TLNGSTR);
    }
    ttistable() {
      return this.checktag(LUA_TTABLE);
    }
    ttisfunction() {
      return this.checktype(LUA_TFUNCTION);
    }
    ttisclosure() {
      return (this.type & 31) === LUA_TFUNCTION;
    }
    ttisCclosure() {
      return this.checktag(LUA_TCCL);
    }
    ttisLclosure() {
      return this.checktag(LUA_TLCL);
    }
    ttislcf() {
      return this.checktag(LUA_TLCF);
    }
    ttisfulluserdata() {
      return this.checktag(LUA_TUSERDATA);
    }
    ttisthread() {
      return this.checktag(LUA_TTHREAD);
    }
    ttisdeadkey() {
      return this.checktag(LUA_TDEADKEY);
    }
    l_isfalse() {
      return this.ttisnil() || this.ttisboolean() && this.value === false;
    }
    setfltvalue(x) {
      this.type = LUA_TNUMFLT;
      this.value = x;
    }
    chgfltvalue(x) {
      lua_assert(this.type == LUA_TNUMFLT);
      this.value = x;
    }
    setivalue(x) {
      this.type = LUA_TNUMINT;
      this.value = x;
    }
    chgivalue(x) {
      lua_assert(this.type == LUA_TNUMINT);
      this.value = x;
    }
    setnilvalue() {
      this.type = LUA_TNIL;
      this.value = null;
    }
    setfvalue(x) {
      this.type = LUA_TLCF;
      this.value = x;
    }
    setpvalue(x) {
      this.type = LUA_TLIGHTUSERDATA;
      this.value = x;
    }
    setbvalue(x) {
      this.type = LUA_TBOOLEAN;
      this.value = x;
    }
    setsvalue(x) {
      this.type = LUA_TLNGSTR;
      this.value = x;
    }
    setuvalue(x) {
      this.type = LUA_TUSERDATA;
      this.value = x;
    }
    setthvalue(x) {
      this.type = LUA_TTHREAD;
      this.value = x;
    }
    setclLvalue(x) {
      this.type = LUA_TLCL;
      this.value = x;
    }
    setclCvalue(x) {
      this.type = LUA_TCCL;
      this.value = x;
    }
    sethvalue(x) {
      this.type = LUA_TTABLE;
      this.value = x;
    }
    setdeadvalue() {
      this.type = LUA_TDEADKEY;
      this.value = null;
    }
    setfrom(tv) {
      this.type = tv.type;
      this.value = tv.value;
    }
    tsvalue() {
      lua_assert(this.ttisstring());
      return this.value;
    }
    svalue() {
      return this.tsvalue().getstr();
    }
    vslen() {
      return this.tsvalue().tsslen();
    }
    jsstring(from, to) {
      return to_jsstring(this.svalue(), from, to, true);
    }
  }
  var pushobj2s = function(L, tv) {
    L.stack[L.top++] = new TValue(tv.type, tv.value);
  };
  var pushsvalue2s = function(L, ts) {
    L.stack[L.top++] = new TValue(LUA_TLNGSTR, ts);
  };
  var setobjs2s = function(L, newidx, oldidx) {
    L.stack[newidx].setfrom(L.stack[oldidx]);
  };
  var setobj2s = function(L, newidx, oldtv) {
    L.stack[newidx].setfrom(oldtv);
  };
  var setsvalue2s = function(L, newidx, ts) {
    L.stack[newidx].setsvalue(ts);
  };
  var luaO_nilobject = new TValue(LUA_TNIL, null);
  Object.freeze(luaO_nilobject);
  exports.luaO_nilobject = luaO_nilobject;

  class LClosure {
    constructor(L, n) {
      this.id = L.l_G.id_counter++;
      this.p = null;
      this.nupvalues = n;
      this.upvals = new Array(n);
    }
  }

  class CClosure {
    constructor(L, f, n) {
      this.id = L.l_G.id_counter++;
      this.f = f;
      this.nupvalues = n;
      this.upvalue = new Array(n);
      while (n--) {
        this.upvalue[n] = new TValue(LUA_TNIL, null);
      }
    }
  }

  class Udata {
    constructor(L, size) {
      this.id = L.l_G.id_counter++;
      this.metatable = null;
      this.uservalue = new TValue(LUA_TNIL, null);
      this.len = size;
      this.data = Object.create(null);
    }
  }

  class LocVar {
    constructor() {
      this.varname = null;
      this.startpc = NaN;
      this.endpc = NaN;
    }
  }
  var RETS = to_luastring("...");
  var PRE = to_luastring('[string "');
  var POS = to_luastring('"]');
  var luaO_chunkid = function(source, bufflen) {
    let l = source.length;
    let out;
    if (source[0] === 61) {
      if (l < bufflen) {
        out = new Uint8Array(l - 1);
        out.set(source.subarray(1));
      } else {
        out = new Uint8Array(bufflen);
        out.set(source.subarray(1, bufflen + 1));
      }
    } else if (source[0] === 64) {
      if (l <= bufflen) {
        out = new Uint8Array(l - 1);
        out.set(source.subarray(1));
      } else {
        out = new Uint8Array(bufflen);
        out.set(RETS);
        bufflen -= RETS.length;
        out.set(source.subarray(l - bufflen), RETS.length);
      }
    } else {
      out = new Uint8Array(bufflen);
      let nli = luastring_indexOf(source, 10);
      out.set(PRE);
      let out_i = PRE.length;
      bufflen -= PRE.length + RETS.length + POS.length;
      if (l < bufflen && nli === -1) {
        out.set(source, out_i);
        out_i += source.length;
      } else {
        if (nli !== -1)
          l = nli;
        if (l > bufflen)
          l = bufflen;
        out.set(source.subarray(0, l), out_i);
        out_i += l;
        out.set(RETS, out_i);
        out_i += RETS.length;
      }
      out.set(POS, out_i);
      out_i += POS.length;
      out = out.subarray(0, out_i);
    }
    return out;
  };
  var luaO_hexavalue = function(c) {
    if (lisdigit(c))
      return c - 48;
    else
      return (c & 223) - 55;
  };
  var UTF8BUFFSZ = 8;
  var luaO_utf8esc = function(buff, x) {
    let n = 1;
    lua_assert(x <= 1114111);
    if (x < 128)
      buff[UTF8BUFFSZ - 1] = x;
    else {
      let mfb = 63;
      do {
        buff[UTF8BUFFSZ - n++] = 128 | x & 63;
        x >>= 6;
        mfb >>= 1;
      } while (x > mfb);
      buff[UTF8BUFFSZ - n] = ~mfb << 1 | x;
    }
    return n;
  };
  var MAXSIGDIG = 30;
  var lua_strx2number = function(s) {
    let i = 0;
    let r = 0;
    let sigdig = 0;
    let nosigdig = 0;
    let e = 0;
    let neg;
    let hasdot = false;
    while (lisspace(s[i]))
      i++;
    if (neg = s[i] === 45)
      i++;
    else if (s[i] === 43)
      i++;
    if (!(s[i] === 48 && (s[i + 1] === 120 || s[i + 1] === 88)))
      return null;
    for (i += 2;; i++) {
      if (s[i] === 46) {
        if (hasdot)
          break;
        else
          hasdot = true;
      } else if (lisxdigit(s[i])) {
        if (sigdig === 0 && s[i] === 48)
          nosigdig++;
        else if (++sigdig <= MAXSIGDIG)
          r = r * 16 + luaO_hexavalue(s[i]);
        else
          e++;
        if (hasdot)
          e--;
      } else
        break;
    }
    if (nosigdig + sigdig === 0)
      return null;
    e *= 4;
    if (s[i] === 112 || s[i] === 80) {
      let exp1 = 0;
      let neg1;
      i++;
      if (neg1 = s[i] === 45)
        i++;
      else if (s[i] === 43)
        i++;
      if (!lisdigit(s[i]))
        return null;
      while (lisdigit(s[i]))
        exp1 = exp1 * 10 + s[i++] - 48;
      if (neg1)
        exp1 = -exp1;
      e += exp1;
    }
    if (neg)
      r = -r;
    return {
      n: ldexp(r, e),
      i
    };
  };
  var lua_str2number = function(s) {
    try {
      s = to_jsstring(s);
    } catch (e) {
      return null;
    }
    let r = /^[\t\v\f \n\r]*[+-]?(?:[0-9]+\.?[0-9]*|\.[0-9]*)(?:[eE][+-]?[0-9]+)?/.exec(s);
    if (!r)
      return null;
    let flt = parseFloat(r[0]);
    return !isNaN(flt) ? { n: flt, i: r[0].length } : null;
  };
  var l_str2dloc = function(s, mode) {
    let result = mode === "x" ? lua_strx2number(s) : lua_str2number(s);
    if (result === null)
      return null;
    while (lisspace(s[result.i]))
      result.i++;
    return result.i === s.length || s[result.i] === 0 ? result : null;
  };
  var SIGILS = [
    46,
    120,
    88,
    110,
    78
  ];
  var modes = {
    [46]: ".",
    [120]: "x",
    [88]: "x",
    [110]: "n",
    [78]: "n"
  };
  var l_str2d = function(s) {
    let l = s.length;
    let pmode = 0;
    for (let i = 0;i < l; i++) {
      let v = s[i];
      if (SIGILS.indexOf(v) !== -1) {
        pmode = v;
        break;
      }
    }
    let mode = modes[pmode];
    if (mode === "n")
      return null;
    let end = l_str2dloc(s, mode);
    return end;
  };
  var MAXBY10 = Math.floor(MAX_INT / 10);
  var MAXLASTD = MAX_INT % 10;
  var l_str2int = function(s) {
    let i = 0;
    let a = 0;
    let empty = true;
    let neg;
    while (lisspace(s[i]))
      i++;
    if (neg = s[i] === 45)
      i++;
    else if (s[i] === 43)
      i++;
    if (s[i] === 48 && (s[i + 1] === 120 || s[i + 1] === 88)) {
      i += 2;
      for (;i < s.length && lisxdigit(s[i]); i++) {
        a = a * 16 + luaO_hexavalue(s[i]) | 0;
        empty = false;
      }
    } else {
      for (;i < s.length && lisdigit(s[i]); i++) {
        let d = s[i] - 48;
        if (a >= MAXBY10 && (a > MAXBY10 || d > MAXLASTD + neg))
          return null;
        a = a * 10 + d | 0;
        empty = false;
      }
    }
    while (i < s.length && lisspace(s[i]))
      i++;
    if (empty || i !== s.length && s[i] !== 0)
      return null;
    else {
      return {
        n: (neg ? -a : a) | 0,
        i
      };
    }
  };
  var luaO_str2num = function(s, o) {
    let s2i = l_str2int(s);
    if (s2i !== null) {
      o.setivalue(s2i.n);
      return s2i.i + 1;
    } else {
      s2i = l_str2d(s);
      if (s2i !== null) {
        o.setfltvalue(s2i.n);
        return s2i.i + 1;
      } else
        return 0;
    }
  };
  var luaO_tostring = function(L, obj) {
    let buff;
    if (obj.ttisinteger())
      buff = to_luastring(lua_integer2str(obj.value));
    else {
      let str = lua_number2str(obj.value);
      if (!LUA_COMPAT_FLOATSTRING && /^[-0123456789]+$/.test(str)) {
        str += ".0";
      }
      buff = to_luastring(str);
    }
    obj.setsvalue(luaS_bless(L, buff));
  };
  var pushstr = function(L, str) {
    ldo.luaD_inctop(L);
    setsvalue2s(L, L.top - 1, luaS_new(L, str));
  };
  var luaO_pushvfstring = function(L, fmt, argp) {
    let n = 0;
    let i = 0;
    let a = 0;
    let e;
    for (;; ) {
      e = luastring_indexOf(fmt, 37, i);
      if (e == -1)
        break;
      pushstr(L, fmt.subarray(i, e));
      switch (fmt[e + 1]) {
        case 115: {
          let s = argp[a++];
          if (s === null)
            s = to_luastring("(null)", true);
          else {
            s = from_userstring(s);
            let i = luastring_indexOf(s, 0);
            if (i !== -1)
              s = s.subarray(0, i);
          }
          pushstr(L, s);
          break;
        }
        case 99: {
          let buff = argp[a++];
          if (lisprint(buff))
            pushstr(L, luastring_of(buff));
          else
            luaO_pushfstring(L, to_luastring("<\\%d>", true), buff);
          break;
        }
        case 100:
        case 73:
          ldo.luaD_inctop(L);
          L.stack[L.top - 1].setivalue(argp[a++]);
          luaO_tostring(L, L.stack[L.top - 1]);
          break;
        case 102:
          ldo.luaD_inctop(L);
          L.stack[L.top - 1].setfltvalue(argp[a++]);
          luaO_tostring(L, L.stack[L.top - 1]);
          break;
        case 112: {
          let v = argp[a++];
          if (v instanceof lstate.lua_State || v instanceof ltable.Table || v instanceof Udata || v instanceof LClosure || v instanceof CClosure) {
            pushstr(L, to_luastring("0x" + v.id.toString(16)));
          } else {
            switch (typeof v) {
              case "undefined":
                pushstr(L, to_luastring("undefined"));
                break;
              case "number":
                pushstr(L, to_luastring("Number(" + v + ")"));
                break;
              case "string":
                pushstr(L, to_luastring("String(" + JSON.stringify(v) + ")"));
                break;
              case "boolean":
                pushstr(L, to_luastring(v ? "Boolean(true)" : "Boolean(false)"));
                break;
              case "object":
                if (v === null) {
                  pushstr(L, to_luastring("null"));
                  break;
                }
              case "function": {
                let id = L.l_G.ids.get(v);
                if (!id) {
                  id = L.l_G.id_counter++;
                  L.l_G.ids.set(v, id);
                }
                pushstr(L, to_luastring("0x" + id.toString(16)));
                break;
              }
              default:
                pushstr(L, to_luastring("<id NYI>"));
            }
          }
          break;
        }
        case 85: {
          let buff = new Uint8Array(UTF8BUFFSZ);
          let l = luaO_utf8esc(buff, argp[a++]);
          pushstr(L, buff.subarray(UTF8BUFFSZ - l));
          break;
        }
        case 37:
          pushstr(L, to_luastring("%", true));
          break;
        default:
          ldebug.luaG_runerror(L, to_luastring("invalid option '%%%c' to 'lua_pushfstring'"), fmt[e + 1]);
      }
      n += 2;
      i = e + 2;
    }
    ldo.luaD_checkstack(L, 1);
    pushstr(L, fmt.subarray(i));
    if (n > 0)
      lvm.luaV_concat(L, n + 1);
    return L.stack[L.top - 1].svalue();
  };
  var luaO_pushfstring = function(L, fmt, ...argp) {
    return luaO_pushvfstring(L, fmt, argp);
  };
  var luaO_int2fb = function(x) {
    let e = 0;
    if (x < 8)
      return x;
    while (x >= 8 << 4) {
      x = x + 15 >> 4;
      e += 4;
    }
    while (x >= 8 << 1) {
      x = x + 1 >> 1;
      e++;
    }
    return e + 1 << 3 | x - 8;
  };
  var intarith = function(L, op, v1, v2) {
    switch (op) {
      case LUA_OPADD:
        return v1 + v2 | 0;
      case LUA_OPSUB:
        return v1 - v2 | 0;
      case LUA_OPMUL:
        return lvm.luaV_imul(v1, v2);
      case LUA_OPMOD:
        return lvm.luaV_mod(L, v1, v2);
      case LUA_OPIDIV:
        return lvm.luaV_div(L, v1, v2);
      case LUA_OPBAND:
        return v1 & v2;
      case LUA_OPBOR:
        return v1 | v2;
      case LUA_OPBXOR:
        return v1 ^ v2;
      case LUA_OPSHL:
        return lvm.luaV_shiftl(v1, v2);
      case LUA_OPSHR:
        return lvm.luaV_shiftl(v1, -v2);
      case LUA_OPUNM:
        return 0 - v1 | 0;
      case LUA_OPBNOT:
        return ~0 ^ v1;
      default:
        lua_assert(0);
    }
  };
  var numarith = function(L, op, v1, v2) {
    switch (op) {
      case LUA_OPADD:
        return v1 + v2;
      case LUA_OPSUB:
        return v1 - v2;
      case LUA_OPMUL:
        return v1 * v2;
      case LUA_OPDIV:
        return v1 / v2;
      case LUA_OPPOW:
        return Math.pow(v1, v2);
      case LUA_OPIDIV:
        return Math.floor(v1 / v2);
      case LUA_OPUNM:
        return -v1;
      case LUA_OPMOD:
        return luai_nummod(L, v1, v2);
      default:
        lua_assert(0);
    }
  };
  var luaO_arith = function(L, op, p1, p2, p3) {
    let res = typeof p3 === "number" ? L.stack[p3] : p3;
    switch (op) {
      case LUA_OPBAND:
      case LUA_OPBOR:
      case LUA_OPBXOR:
      case LUA_OPSHL:
      case LUA_OPSHR:
      case LUA_OPBNOT: {
        let i1, i2;
        if ((i1 = lvm.tointeger(p1)) !== false && (i2 = lvm.tointeger(p2)) !== false) {
          res.setivalue(intarith(L, op, i1, i2));
          return;
        } else
          break;
      }
      case LUA_OPDIV:
      case LUA_OPPOW: {
        let n1, n2;
        if ((n1 = lvm.tonumber(p1)) !== false && (n2 = lvm.tonumber(p2)) !== false) {
          res.setfltvalue(numarith(L, op, n1, n2));
          return;
        } else
          break;
      }
      default: {
        let n1, n2;
        if (p1.ttisinteger() && p2.ttisinteger()) {
          res.setivalue(intarith(L, op, p1.value, p2.value));
          return;
        } else if ((n1 = lvm.tonumber(p1)) !== false && (n2 = lvm.tonumber(p2)) !== false) {
          res.setfltvalue(numarith(L, op, n1, n2));
          return;
        } else
          break;
      }
    }
    lua_assert(L !== null);
    ltm.luaT_trybinTM(L, p1, p2, p3, op - LUA_OPADD + ltm.TMS.TM_ADD);
  };
  exports.CClosure = CClosure;
  exports.LClosure = LClosure;
  exports.LUA_TDEADKEY = LUA_TDEADKEY;
  exports.LUA_TPROTO = LUA_TPROTO;
  exports.LocVar = LocVar;
  exports.TValue = TValue;
  exports.Udata = Udata;
  exports.UTF8BUFFSZ = UTF8BUFFSZ;
  exports.luaO_arith = luaO_arith;
  exports.luaO_chunkid = luaO_chunkid;
  exports.luaO_hexavalue = luaO_hexavalue;
  exports.luaO_int2fb = luaO_int2fb;
  exports.luaO_pushfstring = luaO_pushfstring;
  exports.luaO_pushvfstring = luaO_pushvfstring;
  exports.luaO_str2num = luaO_str2num;
  exports.luaO_tostring = luaO_tostring;
  exports.luaO_utf8esc = luaO_utf8esc;
  exports.numarith = numarith;
  exports.pushobj2s = pushobj2s;
  exports.pushsvalue2s = pushsvalue2s;
  exports.setobjs2s = setobjs2s;
  exports.setobj2s = setobj2s;
  exports.setsvalue2s = setsvalue2s;
});

// node_modules/fengari/src/lfunc.js
var require_lfunc = __commonJS(function(exports, module) {
  var { constant_types: { LUA_TNIL } } = require_defs();
  var lobject = require_lobject();

  class Proto {
    constructor(L) {
      this.id = L.l_G.id_counter++;
      this.k = [];
      this.p = [];
      this.code = [];
      this.cache = null;
      this.lineinfo = [];
      this.upvalues = [];
      this.numparams = 0;
      this.is_vararg = false;
      this.maxstacksize = 0;
      this.locvars = [];
      this.linedefined = 0;
      this.lastlinedefined = 0;
      this.source = null;
    }
  }
  var luaF_newLclosure = function(L, n) {
    return new lobject.LClosure(L, n);
  };
  var luaF_findupval = function(L, level) {
    return L.stack[level];
  };
  var luaF_close = function(L, level) {
    for (let i = level;i < L.top; i++) {
      let old = L.stack[i];
      L.stack[i] = new lobject.TValue(old.type, old.value);
    }
  };
  var luaF_initupvals = function(L, cl) {
    for (let i = 0;i < cl.nupvalues; i++)
      cl.upvals[i] = new lobject.TValue(LUA_TNIL, null);
  };
  var luaF_getlocalname = function(f, local_number, pc) {
    for (let i = 0;i < f.locvars.length && f.locvars[i].startpc <= pc; i++) {
      if (pc < f.locvars[i].endpc) {
        local_number--;
        if (local_number === 0)
          return f.locvars[i].varname.getstr();
      }
    }
    return null;
  };
  exports.MAXUPVAL = 255;
  exports.Proto = Proto;
  exports.luaF_findupval = luaF_findupval;
  exports.luaF_close = luaF_close;
  exports.luaF_getlocalname = luaF_getlocalname;
  exports.luaF_initupvals = luaF_initupvals;
  exports.luaF_newLclosure = luaF_newLclosure;
});

// node_modules/fengari/src/lzio.js
var require_lzio = __commonJS(function(exports, module) {
  var { lua_assert } = require_llimits();

  class MBuffer {
    constructor() {
      this.buffer = null;
      this.n = 0;
    }
  }
  var luaZ_buffer = function(buff) {
    return buff.buffer.subarray(0, buff.n);
  };
  var luaZ_buffremove = function(buff, i) {
    buff.n -= i;
  };
  var luaZ_resetbuffer = function(buff) {
    buff.n = 0;
  };
  var luaZ_resizebuffer = function(L, buff, size) {
    let newbuff = new Uint8Array(size);
    if (buff.buffer)
      newbuff.set(buff.buffer);
    buff.buffer = newbuff;
  };

  class ZIO {
    constructor(L, reader, data) {
      this.L = L;
      lua_assert(typeof reader == "function", "ZIO requires a reader");
      this.reader = reader;
      this.data = data;
      this.n = 0;
      this.buffer = null;
      this.off = 0;
    }
    zgetc() {
      return this.n-- > 0 ? this.buffer[this.off++] : luaZ_fill(this);
    }
  }
  var EOZ = -1;
  var luaZ_fill = function(z) {
    let buff = z.reader(z.L, z.data);
    if (buff === null)
      return EOZ;
    lua_assert(buff instanceof Uint8Array, "Should only load binary of array of bytes");
    let size = buff.length;
    if (size === 0)
      return EOZ;
    z.buffer = buff;
    z.off = 0;
    z.n = size - 1;
    return z.buffer[z.off++];
  };
  var luaZ_read = function(z, b, b_offset, n) {
    while (n) {
      if (z.n === 0) {
        if (luaZ_fill(z) === EOZ)
          return n;
        else {
          z.n++;
          z.off--;
        }
      }
      let m = n <= z.n ? n : z.n;
      for (let i = 0;i < m; i++) {
        b[b_offset++] = z.buffer[z.off++];
      }
      z.n -= m;
      if (z.n === 0)
        z.buffer = null;
      n -= m;
    }
    return 0;
  };
  exports.EOZ = EOZ;
  exports.luaZ_buffer = luaZ_buffer;
  exports.luaZ_buffremove = luaZ_buffremove;
  exports.luaZ_fill = luaZ_fill;
  exports.luaZ_read = luaZ_read;
  exports.luaZ_resetbuffer = luaZ_resetbuffer;
  exports.luaZ_resizebuffer = luaZ_resizebuffer;
  exports.MBuffer = MBuffer;
  exports.ZIO = ZIO;
});

// node_modules/fengari/src/llex.js
var require_llex = __commonJS(function(exports, module) {
  var {
    constant_types: { LUA_TBOOLEAN, LUA_TLNGSTR },
    thread_status: { LUA_ERRSYNTAX },
    to_luastring
  } = require_defs();
  var {
    LUA_MINBUFFER,
    MAX_INT,
    lua_assert
  } = require_llimits();
  var ldebug = require_ldebug();
  var ldo = require_ldo();
  var {
    lisdigit,
    lislalnum,
    lislalpha,
    lisspace,
    lisxdigit
  } = require_ljstype();
  var lobject = require_lobject();
  var {
    luaS_bless,
    luaS_hash,
    luaS_hashlongstr,
    luaS_new
  } = require_lstring();
  var ltable = require_ltable();
  var {
    EOZ,
    luaZ_buffer,
    luaZ_buffremove,
    luaZ_resetbuffer,
    luaZ_resizebuffer
  } = require_lzio();
  var FIRST_RESERVED = 257;
  var LUA_ENV = to_luastring("_ENV", true);
  var TK_AND = FIRST_RESERVED;
  var TK_BREAK = FIRST_RESERVED + 1;
  var TK_DO = FIRST_RESERVED + 2;
  var TK_ELSE = FIRST_RESERVED + 3;
  var TK_ELSEIF = FIRST_RESERVED + 4;
  var TK_END = FIRST_RESERVED + 5;
  var TK_FALSE = FIRST_RESERVED + 6;
  var TK_FOR = FIRST_RESERVED + 7;
  var TK_FUNCTION = FIRST_RESERVED + 8;
  var TK_GOTO = FIRST_RESERVED + 9;
  var TK_IF = FIRST_RESERVED + 10;
  var TK_IN = FIRST_RESERVED + 11;
  var TK_LOCAL = FIRST_RESERVED + 12;
  var TK_NIL = FIRST_RESERVED + 13;
  var TK_NOT = FIRST_RESERVED + 14;
  var TK_OR = FIRST_RESERVED + 15;
  var TK_REPEAT = FIRST_RESERVED + 16;
  var TK_RETURN = FIRST_RESERVED + 17;
  var TK_THEN = FIRST_RESERVED + 18;
  var TK_TRUE = FIRST_RESERVED + 19;
  var TK_UNTIL = FIRST_RESERVED + 20;
  var TK_WHILE = FIRST_RESERVED + 21;
  var TK_IDIV = FIRST_RESERVED + 22;
  var TK_CONCAT = FIRST_RESERVED + 23;
  var TK_DOTS = FIRST_RESERVED + 24;
  var TK_EQ = FIRST_RESERVED + 25;
  var TK_GE = FIRST_RESERVED + 26;
  var TK_LE = FIRST_RESERVED + 27;
  var TK_NE = FIRST_RESERVED + 28;
  var TK_SHL = FIRST_RESERVED + 29;
  var TK_SHR = FIRST_RESERVED + 30;
  var TK_DBCOLON = FIRST_RESERVED + 31;
  var TK_EOS = FIRST_RESERVED + 32;
  var TK_FLT = FIRST_RESERVED + 33;
  var TK_INT = FIRST_RESERVED + 34;
  var TK_NAME = FIRST_RESERVED + 35;
  var TK_STRING = FIRST_RESERVED + 36;
  var RESERVED = {
    TK_AND,
    TK_BREAK,
    TK_DO,
    TK_ELSE,
    TK_ELSEIF,
    TK_END,
    TK_FALSE,
    TK_FOR,
    TK_FUNCTION,
    TK_GOTO,
    TK_IF,
    TK_IN,
    TK_LOCAL,
    TK_NIL,
    TK_NOT,
    TK_OR,
    TK_REPEAT,
    TK_RETURN,
    TK_THEN,
    TK_TRUE,
    TK_UNTIL,
    TK_WHILE,
    TK_IDIV,
    TK_CONCAT,
    TK_DOTS,
    TK_EQ,
    TK_GE,
    TK_LE,
    TK_NE,
    TK_SHL,
    TK_SHR,
    TK_DBCOLON,
    TK_EOS,
    TK_FLT,
    TK_INT,
    TK_NAME,
    TK_STRING
  };
  var luaX_tokens = [
    "and",
    "break",
    "do",
    "else",
    "elseif",
    "end",
    "false",
    "for",
    "function",
    "goto",
    "if",
    "in",
    "local",
    "nil",
    "not",
    "or",
    "repeat",
    "return",
    "then",
    "true",
    "until",
    "while",
    "//",
    "..",
    "...",
    "==",
    ">=",
    "<=",
    "~=",
    "<<",
    ">>",
    "::",
    "<eof>",
    "<number>",
    "<integer>",
    "<name>",
    "<string>"
  ].map((e, i) => to_luastring(e));

  class SemInfo {
    constructor() {
      this.r = NaN;
      this.i = NaN;
      this.ts = null;
    }
  }

  class Token {
    constructor() {
      this.token = NaN;
      this.seminfo = new SemInfo;
    }
  }

  class LexState {
    constructor() {
      this.current = NaN;
      this.linenumber = NaN;
      this.lastline = NaN;
      this.t = new Token;
      this.lookahead = new Token;
      this.fs = null;
      this.L = null;
      this.z = null;
      this.buff = null;
      this.h = null;
      this.dyd = null;
      this.source = null;
      this.envn = null;
    }
  }
  var save = function(ls, c) {
    let b = ls.buff;
    if (b.n + 1 > b.buffer.length) {
      if (b.buffer.length >= MAX_INT / 2)
        lexerror(ls, to_luastring("lexical element too long", true), 0);
      let newsize = b.buffer.length * 2;
      luaZ_resizebuffer(ls.L, b, newsize);
    }
    b.buffer[b.n++] = c < 0 ? 255 + c + 1 : c;
  };
  var luaX_token2str = function(ls, token) {
    if (token < FIRST_RESERVED) {
      return lobject.luaO_pushfstring(ls.L, to_luastring("'%c'", true), token);
    } else {
      let s = luaX_tokens[token - FIRST_RESERVED];
      if (token < TK_EOS)
        return lobject.luaO_pushfstring(ls.L, to_luastring("'%s'", true), s);
      else
        return s;
    }
  };
  var currIsNewline = function(ls) {
    return ls.current === 10 || ls.current === 13;
  };
  var next = function(ls) {
    ls.current = ls.z.zgetc();
  };
  var save_and_next = function(ls) {
    save(ls, ls.current);
    next(ls);
  };
  var TVtrue = new lobject.TValue(LUA_TBOOLEAN, true);
  var luaX_newstring = function(ls, str) {
    let L = ls.L;
    let ts = luaS_new(L, str);
    let tpair = ls.h.strong.get(luaS_hashlongstr(ts));
    if (!tpair) {
      let key = new lobject.TValue(LUA_TLNGSTR, ts);
      ltable.luaH_setfrom(L, ls.h, key, TVtrue);
    } else {
      ts = tpair.key.tsvalue();
    }
    return ts;
  };
  var inclinenumber = function(ls) {
    let old = ls.current;
    lua_assert(currIsNewline(ls));
    next(ls);
    if (currIsNewline(ls) && ls.current !== old)
      next(ls);
    if (++ls.linenumber >= MAX_INT)
      lexerror(ls, to_luastring("chunk has too many lines", true), 0);
  };
  var luaX_setinput = function(L, ls, z, source, firstchar) {
    ls.t = {
      token: 0,
      seminfo: new SemInfo
    };
    ls.L = L;
    ls.current = firstchar;
    ls.lookahead = {
      token: TK_EOS,
      seminfo: new SemInfo
    };
    ls.z = z;
    ls.fs = null;
    ls.linenumber = 1;
    ls.lastline = 1;
    ls.source = source;
    ls.envn = luaS_bless(L, LUA_ENV);
    luaZ_resizebuffer(L, ls.buff, LUA_MINBUFFER);
  };
  var check_next1 = function(ls, c) {
    if (ls.current === c) {
      next(ls);
      return true;
    }
    return false;
  };
  var check_next2 = function(ls, set) {
    if (ls.current === set[0].charCodeAt(0) || ls.current === set[1].charCodeAt(0)) {
      save_and_next(ls);
      return true;
    }
    return false;
  };
  var read_numeral = function(ls, seminfo) {
    let expo = "Ee";
    let first = ls.current;
    lua_assert(lisdigit(ls.current));
    save_and_next(ls);
    if (first === 48 && check_next2(ls, "xX"))
      expo = "Pp";
    for (;; ) {
      if (check_next2(ls, expo))
        check_next2(ls, "-+");
      if (lisxdigit(ls.current))
        save_and_next(ls);
      else if (ls.current === 46)
        save_and_next(ls);
      else
        break;
    }
    let obj = new lobject.TValue;
    if (lobject.luaO_str2num(luaZ_buffer(ls.buff), obj) === 0)
      lexerror(ls, to_luastring("malformed number", true), TK_FLT);
    if (obj.ttisinteger()) {
      seminfo.i = obj.value;
      return TK_INT;
    } else {
      lua_assert(obj.ttisfloat());
      seminfo.r = obj.value;
      return TK_FLT;
    }
  };
  var txtToken = function(ls, token) {
    switch (token) {
      case TK_NAME:
      case TK_STRING:
      case TK_FLT:
      case TK_INT:
        return lobject.luaO_pushfstring(ls.L, to_luastring("'%s'", true), luaZ_buffer(ls.buff));
      default:
        return luaX_token2str(ls, token);
    }
  };
  var lexerror = function(ls, msg, token) {
    msg = ldebug.luaG_addinfo(ls.L, msg, ls.source, ls.linenumber);
    if (token)
      lobject.luaO_pushfstring(ls.L, to_luastring("%s near %s"), msg, txtToken(ls, token));
    ldo.luaD_throw(ls.L, LUA_ERRSYNTAX);
  };
  var luaX_syntaxerror = function(ls, msg) {
    lexerror(ls, msg, ls.t.token);
  };
  var skip_sep = function(ls) {
    let count = 0;
    let s = ls.current;
    lua_assert(s === 91 || s === 93);
    save_and_next(ls);
    while (ls.current === 61) {
      save_and_next(ls);
      count++;
    }
    return ls.current === s ? count : -count - 1;
  };
  var read_long_string = function(ls, seminfo, sep) {
    let line = ls.linenumber;
    save_and_next(ls);
    if (currIsNewline(ls))
      inclinenumber(ls);
    let skip = false;
    for (;!skip; ) {
      switch (ls.current) {
        case EOZ: {
          let what = seminfo ? "string" : "comment";
          let msg = `unfinished long ${what} (starting at line ${line})`;
          lexerror(ls, to_luastring(msg), TK_EOS);
          break;
        }
        case 93: {
          if (skip_sep(ls) === sep) {
            save_and_next(ls);
            skip = true;
          }
          break;
        }
        case 10:
        case 13: {
          save(ls, 10);
          inclinenumber(ls);
          if (!seminfo)
            luaZ_resetbuffer(ls.buff);
          break;
        }
        default: {
          if (seminfo)
            save_and_next(ls);
          else
            next(ls);
        }
      }
    }
    if (seminfo)
      seminfo.ts = luaX_newstring(ls, ls.buff.buffer.subarray(2 + sep, ls.buff.n - (2 + sep)));
  };
  var esccheck = function(ls, c, msg) {
    if (!c) {
      if (ls.current !== EOZ)
        save_and_next(ls);
      lexerror(ls, msg, TK_STRING);
    }
  };
  var gethexa = function(ls) {
    save_and_next(ls);
    esccheck(ls, lisxdigit(ls.current), to_luastring("hexadecimal digit expected", true));
    return lobject.luaO_hexavalue(ls.current);
  };
  var readhexaesc = function(ls) {
    let r = gethexa(ls);
    r = (r << 4) + gethexa(ls);
    luaZ_buffremove(ls.buff, 2);
    return r;
  };
  var readutf8desc = function(ls) {
    let i = 4;
    save_and_next(ls);
    esccheck(ls, ls.current === 123, to_luastring("missing '{'", true));
    let r = gethexa(ls);
    save_and_next(ls);
    while (lisxdigit(ls.current)) {
      i++;
      r = (r << 4) + lobject.luaO_hexavalue(ls.current);
      esccheck(ls, r <= 1114111, to_luastring("UTF-8 value too large", true));
      save_and_next(ls);
    }
    esccheck(ls, ls.current === 125, to_luastring("missing '}'", true));
    next(ls);
    luaZ_buffremove(ls.buff, i);
    return r;
  };
  var utf8esc = function(ls) {
    let buff = new Uint8Array(lobject.UTF8BUFFSZ);
    let n = lobject.luaO_utf8esc(buff, readutf8desc(ls));
    for (;n > 0; n--)
      save(ls, buff[lobject.UTF8BUFFSZ - n]);
  };
  var readdecesc = function(ls) {
    let r = 0;
    let i;
    for (i = 0;i < 3 && lisdigit(ls.current); i++) {
      r = 10 * r + ls.current - 48;
      save_and_next(ls);
    }
    esccheck(ls, r <= 255, to_luastring("decimal escape too large", true));
    luaZ_buffremove(ls.buff, i);
    return r;
  };
  var read_string = function(ls, del, seminfo) {
    save_and_next(ls);
    while (ls.current !== del) {
      switch (ls.current) {
        case EOZ:
          lexerror(ls, to_luastring("unfinished string", true), TK_EOS);
          break;
        case 10:
        case 13:
          lexerror(ls, to_luastring("unfinished string", true), TK_STRING);
          break;
        case 92: {
          save_and_next(ls);
          let will;
          let c;
          switch (ls.current) {
            case 97:
              c = 7;
              will = "read_save";
              break;
            case 98:
              c = 8;
              will = "read_save";
              break;
            case 102:
              c = 12;
              will = "read_save";
              break;
            case 110:
              c = 10;
              will = "read_save";
              break;
            case 114:
              c = 13;
              will = "read_save";
              break;
            case 116:
              c = 9;
              will = "read_save";
              break;
            case 118:
              c = 11;
              will = "read_save";
              break;
            case 120:
              c = readhexaesc(ls);
              will = "read_save";
              break;
            case 117:
              utf8esc(ls);
              will = "no_save";
              break;
            case 10:
            case 13:
              inclinenumber(ls);
              c = 10;
              will = "only_save";
              break;
            case 92:
            case 34:
            case 39:
              c = ls.current;
              will = "read_save";
              break;
            case EOZ:
              will = "no_save";
              break;
            case 122: {
              luaZ_buffremove(ls.buff, 1);
              next(ls);
              while (lisspace(ls.current)) {
                if (currIsNewline(ls))
                  inclinenumber(ls);
                else
                  next(ls);
              }
              will = "no_save";
              break;
            }
            default: {
              esccheck(ls, lisdigit(ls.current), to_luastring("invalid escape sequence", true));
              c = readdecesc(ls);
              will = "only_save";
              break;
            }
          }
          if (will === "read_save")
            next(ls);
          if (will === "read_save" || will === "only_save") {
            luaZ_buffremove(ls.buff, 1);
            save(ls, c);
          }
          break;
        }
        default:
          save_and_next(ls);
      }
    }
    save_and_next(ls);
    seminfo.ts = luaX_newstring(ls, ls.buff.buffer.subarray(1, ls.buff.n - 1));
  };
  var token_to_index = Object.create(null);
  luaX_tokens.forEach((e, i) => token_to_index[luaS_hash(e)] = i);
  var isreserved = function(w) {
    let kidx = token_to_index[luaS_hashlongstr(w)];
    return kidx !== undefined && kidx <= 22;
  };
  var llex = function(ls, seminfo) {
    luaZ_resetbuffer(ls.buff);
    for (;; ) {
      lua_assert(typeof ls.current == "number");
      switch (ls.current) {
        case 10:
        case 13: {
          inclinenumber(ls);
          break;
        }
        case 32:
        case 12:
        case 9:
        case 11: {
          next(ls);
          break;
        }
        case 45: {
          next(ls);
          if (ls.current !== 45)
            return 45;
          next(ls);
          if (ls.current === 91) {
            let sep = skip_sep(ls);
            luaZ_resetbuffer(ls.buff);
            if (sep >= 0) {
              read_long_string(ls, null, sep);
              luaZ_resetbuffer(ls.buff);
              break;
            }
          }
          while (!currIsNewline(ls) && ls.current !== EOZ)
            next(ls);
          break;
        }
        case 91: {
          let sep = skip_sep(ls);
          if (sep >= 0) {
            read_long_string(ls, seminfo, sep);
            return TK_STRING;
          } else if (sep !== -1)
            lexerror(ls, to_luastring("invalid long string delimiter", true), TK_STRING);
          return 91;
        }
        case 61: {
          next(ls);
          if (check_next1(ls, 61))
            return TK_EQ;
          else
            return 61;
        }
        case 60: {
          next(ls);
          if (check_next1(ls, 61))
            return TK_LE;
          else if (check_next1(ls, 60))
            return TK_SHL;
          else
            return 60;
        }
        case 62: {
          next(ls);
          if (check_next1(ls, 61))
            return TK_GE;
          else if (check_next1(ls, 62))
            return TK_SHR;
          else
            return 62;
        }
        case 47: {
          next(ls);
          if (check_next1(ls, 47))
            return TK_IDIV;
          else
            return 47;
        }
        case 126: {
          next(ls);
          if (check_next1(ls, 61))
            return TK_NE;
          else
            return 126;
        }
        case 58: {
          next(ls);
          if (check_next1(ls, 58))
            return TK_DBCOLON;
          else
            return 58;
        }
        case 34:
        case 39: {
          read_string(ls, ls.current, seminfo);
          return TK_STRING;
        }
        case 46: {
          save_and_next(ls);
          if (check_next1(ls, 46)) {
            if (check_next1(ls, 46))
              return TK_DOTS;
            else
              return TK_CONCAT;
          } else if (!lisdigit(ls.current))
            return 46;
          else
            return read_numeral(ls, seminfo);
        }
        case 48:
        case 49:
        case 50:
        case 51:
        case 52:
        case 53:
        case 54:
        case 55:
        case 56:
        case 57: {
          return read_numeral(ls, seminfo);
        }
        case EOZ: {
          return TK_EOS;
        }
        default: {
          if (lislalpha(ls.current)) {
            do {
              save_and_next(ls);
            } while (lislalnum(ls.current));
            let ts = luaX_newstring(ls, luaZ_buffer(ls.buff));
            seminfo.ts = ts;
            let kidx = token_to_index[luaS_hashlongstr(ts)];
            if (kidx !== undefined && kidx <= 22)
              return kidx + FIRST_RESERVED;
            else
              return TK_NAME;
          } else {
            let c = ls.current;
            next(ls);
            return c;
          }
        }
      }
    }
  };
  var luaX_next = function(ls) {
    ls.lastline = ls.linenumber;
    if (ls.lookahead.token !== TK_EOS) {
      ls.t.token = ls.lookahead.token;
      ls.t.seminfo.i = ls.lookahead.seminfo.i;
      ls.t.seminfo.r = ls.lookahead.seminfo.r;
      ls.t.seminfo.ts = ls.lookahead.seminfo.ts;
      ls.lookahead.token = TK_EOS;
    } else
      ls.t.token = llex(ls, ls.t.seminfo);
  };
  var luaX_lookahead = function(ls) {
    lua_assert(ls.lookahead.token === TK_EOS);
    ls.lookahead.token = llex(ls, ls.lookahead.seminfo);
    return ls.lookahead.token;
  };
  exports.FIRST_RESERVED = FIRST_RESERVED;
  exports.LUA_ENV = LUA_ENV;
  exports.LexState = LexState;
  exports.RESERVED = RESERVED;
  exports.isreserved = isreserved;
  exports.luaX_lookahead = luaX_lookahead;
  exports.luaX_newstring = luaX_newstring;
  exports.luaX_next = luaX_next;
  exports.luaX_setinput = luaX_setinput;
  exports.luaX_syntaxerror = luaX_syntaxerror;
  exports.luaX_token2str = luaX_token2str;
  exports.luaX_tokens = luaX_tokens;
});

// node_modules/fengari/src/lcode.js
var require_lcode = __commonJS(function(exports, module) {
  var {
    LUA_MULTRET,
    LUA_OPADD,
    LUA_OPBAND,
    LUA_OPBNOT,
    LUA_OPBOR,
    LUA_OPBXOR,
    LUA_OPDIV,
    LUA_OPIDIV,
    LUA_OPMOD,
    LUA_OPSHL,
    LUA_OPSHR,
    LUA_OPUNM,
    constant_types: {
      LUA_TBOOLEAN,
      LUA_TLIGHTUSERDATA,
      LUA_TLNGSTR,
      LUA_TNIL,
      LUA_TNUMFLT,
      LUA_TNUMINT,
      LUA_TTABLE
    },
    to_luastring
  } = require_defs();
  var { lua_assert } = require_llimits();
  var llex = require_llex();
  var lobject = require_lobject();
  var lopcodes = require_lopcodes();
  var lparser = require_lparser();
  var ltable = require_ltable();
  var lvm = require_lvm();
  var OpCodesI = lopcodes.OpCodesI;
  var TValue = lobject.TValue;
  var MAXREGS = 255;
  var NO_JUMP = -1;
  var BinOpr = {
    OPR_ADD: 0,
    OPR_SUB: 1,
    OPR_MUL: 2,
    OPR_MOD: 3,
    OPR_POW: 4,
    OPR_DIV: 5,
    OPR_IDIV: 6,
    OPR_BAND: 7,
    OPR_BOR: 8,
    OPR_BXOR: 9,
    OPR_SHL: 10,
    OPR_SHR: 11,
    OPR_CONCAT: 12,
    OPR_EQ: 13,
    OPR_LT: 14,
    OPR_LE: 15,
    OPR_NE: 16,
    OPR_GT: 17,
    OPR_GE: 18,
    OPR_AND: 19,
    OPR_OR: 20,
    OPR_NOBINOPR: 21
  };
  var UnOpr = {
    OPR_MINUS: 0,
    OPR_BNOT: 1,
    OPR_NOT: 2,
    OPR_LEN: 3,
    OPR_NOUNOPR: 4
  };
  var hasjumps = function(e) {
    return e.t !== e.f;
  };
  var tonumeral = function(e, make_tvalue) {
    let ek = lparser.expkind;
    if (hasjumps(e))
      return false;
    switch (e.k) {
      case ek.VKINT:
        if (make_tvalue) {
          return new TValue(LUA_TNUMINT, e.u.ival);
        }
        return true;
      case ek.VKFLT:
        if (make_tvalue) {
          return new TValue(LUA_TNUMFLT, e.u.nval);
        }
        return true;
      default:
        return false;
    }
  };
  var luaK_nil = function(fs, from, n) {
    let previous;
    let l = from + n - 1;
    if (fs.pc > fs.lasttarget) {
      previous = fs.f.code[fs.pc - 1];
      if (previous.opcode === OpCodesI.OP_LOADNIL) {
        let pfrom = previous.A;
        let pl = pfrom + previous.B;
        if (pfrom <= from && from <= pl + 1 || from <= pfrom && pfrom <= l + 1) {
          if (pfrom < from)
            from = pfrom;
          if (pl > l)
            l = pl;
          lopcodes.SETARG_A(previous, from);
          lopcodes.SETARG_B(previous, l - from);
          return;
        }
      }
    }
    luaK_codeABC(fs, OpCodesI.OP_LOADNIL, from, n - 1, 0);
  };
  var getinstruction = function(fs, e) {
    return fs.f.code[e.u.info];
  };
  var getjump = function(fs, pc) {
    let offset = fs.f.code[pc].sBx;
    if (offset === NO_JUMP)
      return NO_JUMP;
    else
      return pc + 1 + offset;
  };
  var fixjump = function(fs, pc, dest) {
    let jmp = fs.f.code[pc];
    let offset = dest - (pc + 1);
    lua_assert(dest !== NO_JUMP);
    if (Math.abs(offset) > lopcodes.MAXARG_sBx)
      llex.luaX_syntaxerror(fs.ls, to_luastring("control structure too long", true));
    lopcodes.SETARG_sBx(jmp, offset);
  };
  var luaK_concat = function(fs, l1, l2) {
    if (l2 === NO_JUMP)
      return l1;
    else if (l1 === NO_JUMP)
      l1 = l2;
    else {
      let list = l1;
      let next = getjump(fs, list);
      while (next !== NO_JUMP) {
        list = next;
        next = getjump(fs, list);
      }
      fixjump(fs, list, l2);
    }
    return l1;
  };
  var luaK_jump = function(fs) {
    let jpc = fs.jpc;
    fs.jpc = NO_JUMP;
    let j = luaK_codeAsBx(fs, OpCodesI.OP_JMP, 0, NO_JUMP);
    j = luaK_concat(fs, j, jpc);
    return j;
  };
  var luaK_jumpto = function(fs, t) {
    return luaK_patchlist(fs, luaK_jump(fs), t);
  };
  var luaK_ret = function(fs, first, nret) {
    luaK_codeABC(fs, OpCodesI.OP_RETURN, first, nret + 1, 0);
  };
  var condjump = function(fs, op, A, B, C) {
    luaK_codeABC(fs, op, A, B, C);
    return luaK_jump(fs);
  };
  var luaK_getlabel = function(fs) {
    fs.lasttarget = fs.pc;
    return fs.pc;
  };
  var getjumpcontroloffset = function(fs, pc) {
    if (pc >= 1 && lopcodes.testTMode(fs.f.code[pc - 1].opcode))
      return pc - 1;
    else
      return pc;
  };
  var getjumpcontrol = function(fs, pc) {
    return fs.f.code[getjumpcontroloffset(fs, pc)];
  };
  var patchtestreg = function(fs, node, reg) {
    let pc = getjumpcontroloffset(fs, node);
    let i = fs.f.code[pc];
    if (i.opcode !== OpCodesI.OP_TESTSET)
      return false;
    if (reg !== lopcodes.NO_REG && reg !== i.B)
      lopcodes.SETARG_A(i, reg);
    else {
      fs.f.code[pc] = lopcodes.CREATE_ABC(OpCodesI.OP_TEST, i.B, 0, i.C);
    }
    return true;
  };
  var removevalues = function(fs, list) {
    for (;list !== NO_JUMP; list = getjump(fs, list))
      patchtestreg(fs, list, lopcodes.NO_REG);
  };
  var patchlistaux = function(fs, list, vtarget, reg, dtarget) {
    while (list !== NO_JUMP) {
      let next = getjump(fs, list);
      if (patchtestreg(fs, list, reg))
        fixjump(fs, list, vtarget);
      else
        fixjump(fs, list, dtarget);
      list = next;
    }
  };
  var dischargejpc = function(fs) {
    patchlistaux(fs, fs.jpc, fs.pc, lopcodes.NO_REG, fs.pc);
    fs.jpc = NO_JUMP;
  };
  var luaK_patchtohere = function(fs, list) {
    luaK_getlabel(fs);
    fs.jpc = luaK_concat(fs, fs.jpc, list);
  };
  var luaK_patchlist = function(fs, list, target) {
    if (target === fs.pc)
      luaK_patchtohere(fs, list);
    else {
      lua_assert(target < fs.pc);
      patchlistaux(fs, list, target, lopcodes.NO_REG, target);
    }
  };
  var luaK_patchclose = function(fs, list, level) {
    level++;
    for (;list !== NO_JUMP; list = getjump(fs, list)) {
      let ins = fs.f.code[list];
      lua_assert(ins.opcode === OpCodesI.OP_JMP && (ins.A === 0 || ins.A >= level));
      lopcodes.SETARG_A(ins, level);
    }
  };
  var luaK_code = function(fs, i) {
    let f = fs.f;
    dischargejpc(fs);
    f.code[fs.pc] = i;
    f.lineinfo[fs.pc] = fs.ls.lastline;
    return fs.pc++;
  };
  var luaK_codeABC = function(fs, o, a, b, c) {
    lua_assert(lopcodes.getOpMode(o) === lopcodes.iABC);
    lua_assert(lopcodes.getBMode(o) !== lopcodes.OpArgN || b === 0);
    lua_assert(lopcodes.getCMode(o) !== lopcodes.OpArgN || c === 0);
    lua_assert(a <= lopcodes.MAXARG_A && b <= lopcodes.MAXARG_B && c <= lopcodes.MAXARG_C);
    return luaK_code(fs, lopcodes.CREATE_ABC(o, a, b, c));
  };
  var luaK_codeABx = function(fs, o, a, bc) {
    lua_assert(lopcodes.getOpMode(o) === lopcodes.iABx || lopcodes.getOpMode(o) === lopcodes.iAsBx);
    lua_assert(lopcodes.getCMode(o) === lopcodes.OpArgN);
    lua_assert(a <= lopcodes.MAXARG_A && bc <= lopcodes.MAXARG_Bx);
    return luaK_code(fs, lopcodes.CREATE_ABx(o, a, bc));
  };
  var luaK_codeAsBx = function(fs, o, A, sBx) {
    return luaK_codeABx(fs, o, A, sBx + lopcodes.MAXARG_sBx);
  };
  var codeextraarg = function(fs, a) {
    lua_assert(a <= lopcodes.MAXARG_Ax);
    return luaK_code(fs, lopcodes.CREATE_Ax(OpCodesI.OP_EXTRAARG, a));
  };
  var luaK_codek = function(fs, reg, k) {
    if (k <= lopcodes.MAXARG_Bx)
      return luaK_codeABx(fs, OpCodesI.OP_LOADK, reg, k);
    else {
      let p = luaK_codeABx(fs, OpCodesI.OP_LOADKX, reg, 0);
      codeextraarg(fs, k);
      return p;
    }
  };
  var luaK_checkstack = function(fs, n) {
    let newstack = fs.freereg + n;
    if (newstack > fs.f.maxstacksize) {
      if (newstack >= MAXREGS)
        llex.luaX_syntaxerror(fs.ls, to_luastring("function or expression needs too many registers", true));
      fs.f.maxstacksize = newstack;
    }
  };
  var luaK_reserveregs = function(fs, n) {
    luaK_checkstack(fs, n);
    fs.freereg += n;
  };
  var freereg = function(fs, reg) {
    if (!lopcodes.ISK(reg) && reg >= fs.nactvar) {
      fs.freereg--;
      lua_assert(reg === fs.freereg);
    }
  };
  var freeexp = function(fs, e) {
    if (e.k === lparser.expkind.VNONRELOC)
      freereg(fs, e.u.info);
  };
  var freeexps = function(fs, e1, e2) {
    let r1 = e1.k === lparser.expkind.VNONRELOC ? e1.u.info : -1;
    let r2 = e2.k === lparser.expkind.VNONRELOC ? e2.u.info : -1;
    if (r1 > r2) {
      freereg(fs, r1);
      freereg(fs, r2);
    } else {
      freereg(fs, r2);
      freereg(fs, r1);
    }
  };
  var addk = function(fs, key, v) {
    let f = fs.f;
    let idx = ltable.luaH_get(fs.L, fs.ls.h, key);
    if (idx.ttisinteger()) {
      let k = idx.value;
      if (k < fs.nk && f.k[k].ttype() === v.ttype() && f.k[k].value === v.value)
        return k;
    }
    let k = fs.nk;
    ltable.luaH_setfrom(fs.L, fs.ls.h, key, new lobject.TValue(LUA_TNUMINT, k));
    f.k[k] = v;
    fs.nk++;
    return k;
  };
  var luaK_stringK = function(fs, s) {
    let o = new TValue(LUA_TLNGSTR, s);
    return addk(fs, o, o);
  };
  var luaK_intK = function(fs, n) {
    let k = new TValue(LUA_TLIGHTUSERDATA, n);
    let o = new TValue(LUA_TNUMINT, n);
    return addk(fs, k, o);
  };
  var luaK_numberK = function(fs, r) {
    let o = new TValue(LUA_TNUMFLT, r);
    return addk(fs, o, o);
  };
  var boolK = function(fs, b) {
    let o = new TValue(LUA_TBOOLEAN, b);
    return addk(fs, o, o);
  };
  var nilK = function(fs) {
    let v = new TValue(LUA_TNIL, null);
    let k = new TValue(LUA_TTABLE, fs.ls.h);
    return addk(fs, k, v);
  };
  var luaK_setreturns = function(fs, e, nresults) {
    let ek = lparser.expkind;
    if (e.k === ek.VCALL) {
      lopcodes.SETARG_C(getinstruction(fs, e), nresults + 1);
    } else if (e.k === ek.VVARARG) {
      let pc = getinstruction(fs, e);
      lopcodes.SETARG_B(pc, nresults + 1);
      lopcodes.SETARG_A(pc, fs.freereg);
      luaK_reserveregs(fs, 1);
    } else
      lua_assert(nresults === LUA_MULTRET);
  };
  var luaK_setmultret = function(fs, e) {
    luaK_setreturns(fs, e, LUA_MULTRET);
  };
  var luaK_setoneret = function(fs, e) {
    let ek = lparser.expkind;
    if (e.k === ek.VCALL) {
      lua_assert(getinstruction(fs, e).C === 2);
      e.k = ek.VNONRELOC;
      e.u.info = getinstruction(fs, e).A;
    } else if (e.k === ek.VVARARG) {
      lopcodes.SETARG_B(getinstruction(fs, e), 2);
      e.k = ek.VRELOCABLE;
    }
  };
  var luaK_dischargevars = function(fs, e) {
    let ek = lparser.expkind;
    switch (e.k) {
      case ek.VLOCAL: {
        e.k = ek.VNONRELOC;
        break;
      }
      case ek.VUPVAL: {
        e.u.info = luaK_codeABC(fs, OpCodesI.OP_GETUPVAL, 0, e.u.info, 0);
        e.k = ek.VRELOCABLE;
        break;
      }
      case ek.VINDEXED: {
        let op;
        freereg(fs, e.u.ind.idx);
        if (e.u.ind.vt === ek.VLOCAL) {
          freereg(fs, e.u.ind.t);
          op = OpCodesI.OP_GETTABLE;
        } else {
          lua_assert(e.u.ind.vt === ek.VUPVAL);
          op = OpCodesI.OP_GETTABUP;
        }
        e.u.info = luaK_codeABC(fs, op, 0, e.u.ind.t, e.u.ind.idx);
        e.k = ek.VRELOCABLE;
        break;
      }
      case ek.VVARARG:
      case ek.VCALL: {
        luaK_setoneret(fs, e);
        break;
      }
      default:
        break;
    }
  };
  var code_loadbool = function(fs, A, b, jump) {
    luaK_getlabel(fs);
    return luaK_codeABC(fs, OpCodesI.OP_LOADBOOL, A, b, jump);
  };
  var discharge2reg = function(fs, e, reg) {
    let ek = lparser.expkind;
    luaK_dischargevars(fs, e);
    switch (e.k) {
      case ek.VNIL: {
        luaK_nil(fs, reg, 1);
        break;
      }
      case ek.VFALSE:
      case ek.VTRUE: {
        luaK_codeABC(fs, OpCodesI.OP_LOADBOOL, reg, e.k === ek.VTRUE, 0);
        break;
      }
      case ek.VK: {
        luaK_codek(fs, reg, e.u.info);
        break;
      }
      case ek.VKFLT: {
        luaK_codek(fs, reg, luaK_numberK(fs, e.u.nval));
        break;
      }
      case ek.VKINT: {
        luaK_codek(fs, reg, luaK_intK(fs, e.u.ival));
        break;
      }
      case ek.VRELOCABLE: {
        let pc = getinstruction(fs, e);
        lopcodes.SETARG_A(pc, reg);
        break;
      }
      case ek.VNONRELOC: {
        if (reg !== e.u.info)
          luaK_codeABC(fs, OpCodesI.OP_MOVE, reg, e.u.info, 0);
        break;
      }
      default: {
        lua_assert(e.k === ek.VJMP);
        return;
      }
    }
    e.u.info = reg;
    e.k = ek.VNONRELOC;
  };
  var discharge2anyreg = function(fs, e) {
    if (e.k !== lparser.expkind.VNONRELOC) {
      luaK_reserveregs(fs, 1);
      discharge2reg(fs, e, fs.freereg - 1);
    }
  };
  var need_value = function(fs, list) {
    for (;list !== NO_JUMP; list = getjump(fs, list)) {
      let i = getjumpcontrol(fs, list);
      if (i.opcode !== OpCodesI.OP_TESTSET)
        return true;
    }
    return false;
  };
  var exp2reg = function(fs, e, reg) {
    let ek = lparser.expkind;
    discharge2reg(fs, e, reg);
    if (e.k === ek.VJMP)
      e.t = luaK_concat(fs, e.t, e.u.info);
    if (hasjumps(e)) {
      let final;
      let p_f = NO_JUMP;
      let p_t = NO_JUMP;
      if (need_value(fs, e.t) || need_value(fs, e.f)) {
        let fj = e.k === ek.VJMP ? NO_JUMP : luaK_jump(fs);
        p_f = code_loadbool(fs, reg, 0, 1);
        p_t = code_loadbool(fs, reg, 1, 0);
        luaK_patchtohere(fs, fj);
      }
      final = luaK_getlabel(fs);
      patchlistaux(fs, e.f, final, reg, p_f);
      patchlistaux(fs, e.t, final, reg, p_t);
    }
    e.f = e.t = NO_JUMP;
    e.u.info = reg;
    e.k = ek.VNONRELOC;
  };
  var luaK_exp2nextreg = function(fs, e) {
    luaK_dischargevars(fs, e);
    freeexp(fs, e);
    luaK_reserveregs(fs, 1);
    exp2reg(fs, e, fs.freereg - 1);
  };
  var luaK_exp2anyreg = function(fs, e) {
    luaK_dischargevars(fs, e);
    if (e.k === lparser.expkind.VNONRELOC) {
      if (!hasjumps(e))
        return e.u.info;
      if (e.u.info >= fs.nactvar) {
        exp2reg(fs, e, e.u.info);
        return e.u.info;
      }
    }
    luaK_exp2nextreg(fs, e);
    return e.u.info;
  };
  var luaK_exp2anyregup = function(fs, e) {
    if (e.k !== lparser.expkind.VUPVAL || hasjumps(e))
      luaK_exp2anyreg(fs, e);
  };
  var luaK_exp2val = function(fs, e) {
    if (hasjumps(e))
      luaK_exp2anyreg(fs, e);
    else
      luaK_dischargevars(fs, e);
  };
  var luaK_exp2RK = function(fs, e) {
    let ek = lparser.expkind;
    let vk = false;
    luaK_exp2val(fs, e);
    switch (e.k) {
      case ek.VTRUE:
        e.u.info = boolK(fs, true);
        vk = true;
        break;
      case ek.VFALSE:
        e.u.info = boolK(fs, false);
        vk = true;
        break;
      case ek.VNIL:
        e.u.info = nilK(fs);
        vk = true;
        break;
      case ek.VKINT:
        e.u.info = luaK_intK(fs, e.u.ival);
        vk = true;
        break;
      case ek.VKFLT:
        e.u.info = luaK_numberK(fs, e.u.nval);
        vk = true;
        break;
      case ek.VK:
        vk = true;
        break;
      default:
        break;
    }
    if (vk) {
      e.k = ek.VK;
      if (e.u.info <= lopcodes.MAXINDEXRK)
        return lopcodes.RKASK(e.u.info);
    }
    return luaK_exp2anyreg(fs, e);
  };
  var luaK_storevar = function(fs, vr, ex) {
    let ek = lparser.expkind;
    switch (vr.k) {
      case ek.VLOCAL: {
        freeexp(fs, ex);
        exp2reg(fs, ex, vr.u.info);
        return;
      }
      case ek.VUPVAL: {
        let e = luaK_exp2anyreg(fs, ex);
        luaK_codeABC(fs, OpCodesI.OP_SETUPVAL, e, vr.u.info, 0);
        break;
      }
      case ek.VINDEXED: {
        let op = vr.u.ind.vt === ek.VLOCAL ? OpCodesI.OP_SETTABLE : OpCodesI.OP_SETTABUP;
        let e = luaK_exp2RK(fs, ex);
        luaK_codeABC(fs, op, vr.u.ind.t, vr.u.ind.idx, e);
        break;
      }
    }
    freeexp(fs, ex);
  };
  var luaK_self = function(fs, e, key) {
    luaK_exp2anyreg(fs, e);
    let ereg = e.u.info;
    freeexp(fs, e);
    e.u.info = fs.freereg;
    e.k = lparser.expkind.VNONRELOC;
    luaK_reserveregs(fs, 2);
    luaK_codeABC(fs, OpCodesI.OP_SELF, e.u.info, ereg, luaK_exp2RK(fs, key));
    freeexp(fs, key);
  };
  var negatecondition = function(fs, e) {
    let pc = getjumpcontrol(fs, e.u.info);
    lua_assert(lopcodes.testTMode(pc.opcode) && pc.opcode !== OpCodesI.OP_TESTSET && pc.opcode !== OpCodesI.OP_TEST);
    lopcodes.SETARG_A(pc, !pc.A);
  };
  var jumponcond = function(fs, e, cond) {
    if (e.k === lparser.expkind.VRELOCABLE) {
      let ie = getinstruction(fs, e);
      if (ie.opcode === OpCodesI.OP_NOT) {
        fs.pc--;
        return condjump(fs, OpCodesI.OP_TEST, ie.B, 0, !cond);
      }
    }
    discharge2anyreg(fs, e);
    freeexp(fs, e);
    return condjump(fs, OpCodesI.OP_TESTSET, lopcodes.NO_REG, e.u.info, cond);
  };
  var luaK_goiftrue = function(fs, e) {
    let ek = lparser.expkind;
    let pc;
    luaK_dischargevars(fs, e);
    switch (e.k) {
      case ek.VJMP: {
        negatecondition(fs, e);
        pc = e.u.info;
        break;
      }
      case ek.VK:
      case ek.VKFLT:
      case ek.VKINT:
      case ek.VTRUE: {
        pc = NO_JUMP;
        break;
      }
      default: {
        pc = jumponcond(fs, e, 0);
        break;
      }
    }
    e.f = luaK_concat(fs, e.f, pc);
    luaK_patchtohere(fs, e.t);
    e.t = NO_JUMP;
  };
  var luaK_goiffalse = function(fs, e) {
    let ek = lparser.expkind;
    let pc;
    luaK_dischargevars(fs, e);
    switch (e.k) {
      case ek.VJMP: {
        pc = e.u.info;
        break;
      }
      case ek.VNIL:
      case ek.VFALSE: {
        pc = NO_JUMP;
        break;
      }
      default: {
        pc = jumponcond(fs, e, 1);
        break;
      }
    }
    e.t = luaK_concat(fs, e.t, pc);
    luaK_patchtohere(fs, e.f);
    e.f = NO_JUMP;
  };
  var codenot = function(fs, e) {
    let ek = lparser.expkind;
    luaK_dischargevars(fs, e);
    switch (e.k) {
      case ek.VNIL:
      case ek.VFALSE: {
        e.k = ek.VTRUE;
        break;
      }
      case ek.VK:
      case ek.VKFLT:
      case ek.VKINT:
      case ek.VTRUE: {
        e.k = ek.VFALSE;
        break;
      }
      case ek.VJMP: {
        negatecondition(fs, e);
        break;
      }
      case ek.VRELOCABLE:
      case ek.VNONRELOC: {
        discharge2anyreg(fs, e);
        freeexp(fs, e);
        e.u.info = luaK_codeABC(fs, OpCodesI.OP_NOT, 0, e.u.info, 0);
        e.k = ek.VRELOCABLE;
        break;
      }
    }
    {
      let temp = e.f;
      e.f = e.t;
      e.t = temp;
    }
    removevalues(fs, e.f);
    removevalues(fs, e.t);
  };
  var luaK_indexed = function(fs, t, k) {
    let ek = lparser.expkind;
    lua_assert(!hasjumps(t) && (lparser.vkisinreg(t.k) || t.k === ek.VUPVAL));
    t.u.ind.t = t.u.info;
    t.u.ind.idx = luaK_exp2RK(fs, k);
    t.u.ind.vt = t.k === ek.VUPVAL ? ek.VUPVAL : ek.VLOCAL;
    t.k = ek.VINDEXED;
  };
  var validop = function(op, v1, v2) {
    switch (op) {
      case LUA_OPBAND:
      case LUA_OPBOR:
      case LUA_OPBXOR:
      case LUA_OPSHL:
      case LUA_OPSHR:
      case LUA_OPBNOT: {
        return lvm.tointeger(v1) !== false && lvm.tointeger(v2) !== false;
      }
      case LUA_OPDIV:
      case LUA_OPIDIV:
      case LUA_OPMOD:
        return v2.value !== 0;
      default:
        return 1;
    }
  };
  var constfolding = function(op, e1, e2) {
    let ek = lparser.expkind;
    let v1, v2;
    if (!(v1 = tonumeral(e1, true)) || !(v2 = tonumeral(e2, true)) || !validop(op, v1, v2))
      return 0;
    let res = new TValue;
    lobject.luaO_arith(null, op, v1, v2, res);
    if (res.ttisinteger()) {
      e1.k = ek.VKINT;
      e1.u.ival = res.value;
    } else {
      let n = res.value;
      if (isNaN(n) || n === 0)
        return false;
      e1.k = ek.VKFLT;
      e1.u.nval = n;
    }
    return true;
  };
  var codeunexpval = function(fs, op, e, line) {
    let r = luaK_exp2anyreg(fs, e);
    freeexp(fs, e);
    e.u.info = luaK_codeABC(fs, op, 0, r, 0);
    e.k = lparser.expkind.VRELOCABLE;
    luaK_fixline(fs, line);
  };
  var codebinexpval = function(fs, op, e1, e2, line) {
    let rk2 = luaK_exp2RK(fs, e2);
    let rk1 = luaK_exp2RK(fs, e1);
    freeexps(fs, e1, e2);
    e1.u.info = luaK_codeABC(fs, op, 0, rk1, rk2);
    e1.k = lparser.expkind.VRELOCABLE;
    luaK_fixline(fs, line);
  };
  var codecomp = function(fs, opr, e1, e2) {
    let ek = lparser.expkind;
    let rk1;
    if (e1.k === ek.VK)
      rk1 = lopcodes.RKASK(e1.u.info);
    else {
      lua_assert(e1.k === ek.VNONRELOC);
      rk1 = e1.u.info;
    }
    let rk2 = luaK_exp2RK(fs, e2);
    freeexps(fs, e1, e2);
    switch (opr) {
      case BinOpr.OPR_NE: {
        e1.u.info = condjump(fs, OpCodesI.OP_EQ, 0, rk1, rk2);
        break;
      }
      case BinOpr.OPR_GT:
      case BinOpr.OPR_GE: {
        let op = opr - BinOpr.OPR_NE + OpCodesI.OP_EQ;
        e1.u.info = condjump(fs, op, 1, rk2, rk1);
        break;
      }
      default: {
        let op = opr - BinOpr.OPR_EQ + OpCodesI.OP_EQ;
        e1.u.info = condjump(fs, op, 1, rk1, rk2);
        break;
      }
    }
    e1.k = ek.VJMP;
  };
  var luaK_prefix = function(fs, op, e, line) {
    let ef = new lparser.expdesc;
    ef.k = lparser.expkind.VKINT;
    ef.u.ival = ef.u.nval = ef.u.info = 0;
    ef.t = NO_JUMP;
    ef.f = NO_JUMP;
    switch (op) {
      case UnOpr.OPR_MINUS:
      case UnOpr.OPR_BNOT:
        if (constfolding(op + LUA_OPUNM, e, ef))
          break;
      case UnOpr.OPR_LEN:
        codeunexpval(fs, op + OpCodesI.OP_UNM, e, line);
        break;
      case UnOpr.OPR_NOT:
        codenot(fs, e);
        break;
    }
  };
  var luaK_infix = function(fs, op, v) {
    switch (op) {
      case BinOpr.OPR_AND: {
        luaK_goiftrue(fs, v);
        break;
      }
      case BinOpr.OPR_OR: {
        luaK_goiffalse(fs, v);
        break;
      }
      case BinOpr.OPR_CONCAT: {
        luaK_exp2nextreg(fs, v);
        break;
      }
      case BinOpr.OPR_ADD:
      case BinOpr.OPR_SUB:
      case BinOpr.OPR_MUL:
      case BinOpr.OPR_DIV:
      case BinOpr.OPR_IDIV:
      case BinOpr.OPR_MOD:
      case BinOpr.OPR_POW:
      case BinOpr.OPR_BAND:
      case BinOpr.OPR_BOR:
      case BinOpr.OPR_BXOR:
      case BinOpr.OPR_SHL:
      case BinOpr.OPR_SHR: {
        if (!tonumeral(v, false))
          luaK_exp2RK(fs, v);
        break;
      }
      default: {
        luaK_exp2RK(fs, v);
        break;
      }
    }
  };
  var luaK_posfix = function(fs, op, e1, e2, line) {
    let ek = lparser.expkind;
    switch (op) {
      case BinOpr.OPR_AND: {
        lua_assert(e1.t === NO_JUMP);
        luaK_dischargevars(fs, e2);
        e2.f = luaK_concat(fs, e2.f, e1.f);
        e1.to(e2);
        break;
      }
      case BinOpr.OPR_OR: {
        lua_assert(e1.f === NO_JUMP);
        luaK_dischargevars(fs, e2);
        e2.t = luaK_concat(fs, e2.t, e1.t);
        e1.to(e2);
        break;
      }
      case BinOpr.OPR_CONCAT: {
        luaK_exp2val(fs, e2);
        let ins = getinstruction(fs, e2);
        if (e2.k === ek.VRELOCABLE && ins.opcode === OpCodesI.OP_CONCAT) {
          lua_assert(e1.u.info === ins.B - 1);
          freeexp(fs, e1);
          lopcodes.SETARG_B(ins, e1.u.info);
          e1.k = ek.VRELOCABLE;
          e1.u.info = e2.u.info;
        } else {
          luaK_exp2nextreg(fs, e2);
          codebinexpval(fs, OpCodesI.OP_CONCAT, e1, e2, line);
        }
        break;
      }
      case BinOpr.OPR_ADD:
      case BinOpr.OPR_SUB:
      case BinOpr.OPR_MUL:
      case BinOpr.OPR_DIV:
      case BinOpr.OPR_IDIV:
      case BinOpr.OPR_MOD:
      case BinOpr.OPR_POW:
      case BinOpr.OPR_BAND:
      case BinOpr.OPR_BOR:
      case BinOpr.OPR_BXOR:
      case BinOpr.OPR_SHL:
      case BinOpr.OPR_SHR: {
        if (!constfolding(op + LUA_OPADD, e1, e2))
          codebinexpval(fs, op + OpCodesI.OP_ADD, e1, e2, line);
        break;
      }
      case BinOpr.OPR_EQ:
      case BinOpr.OPR_LT:
      case BinOpr.OPR_LE:
      case BinOpr.OPR_NE:
      case BinOpr.OPR_GT:
      case BinOpr.OPR_GE: {
        codecomp(fs, op, e1, e2);
        break;
      }
    }
    return e1;
  };
  var luaK_fixline = function(fs, line) {
    fs.f.lineinfo[fs.pc - 1] = line;
  };
  var luaK_setlist = function(fs, base, nelems, tostore) {
    let c = (nelems - 1) / lopcodes.LFIELDS_PER_FLUSH + 1;
    let b = tostore === LUA_MULTRET ? 0 : tostore;
    lua_assert(tostore !== 0 && tostore <= lopcodes.LFIELDS_PER_FLUSH);
    if (c <= lopcodes.MAXARG_C)
      luaK_codeABC(fs, OpCodesI.OP_SETLIST, base, b, c);
    else if (c <= lopcodes.MAXARG_Ax) {
      luaK_codeABC(fs, OpCodesI.OP_SETLIST, base, b, 0);
      codeextraarg(fs, c);
    } else
      llex.luaX_syntaxerror(fs.ls, to_luastring("constructor too long", true));
    fs.freereg = base + 1;
  };
  exports.BinOpr = BinOpr;
  exports.NO_JUMP = NO_JUMP;
  exports.UnOpr = UnOpr;
  exports.getinstruction = getinstruction;
  exports.luaK_checkstack = luaK_checkstack;
  exports.luaK_code = luaK_code;
  exports.luaK_codeABC = luaK_codeABC;
  exports.luaK_codeABx = luaK_codeABx;
  exports.luaK_codeAsBx = luaK_codeAsBx;
  exports.luaK_codek = luaK_codek;
  exports.luaK_concat = luaK_concat;
  exports.luaK_dischargevars = luaK_dischargevars;
  exports.luaK_exp2RK = luaK_exp2RK;
  exports.luaK_exp2anyreg = luaK_exp2anyreg;
  exports.luaK_exp2anyregup = luaK_exp2anyregup;
  exports.luaK_exp2nextreg = luaK_exp2nextreg;
  exports.luaK_exp2val = luaK_exp2val;
  exports.luaK_fixline = luaK_fixline;
  exports.luaK_getlabel = luaK_getlabel;
  exports.luaK_goiffalse = luaK_goiffalse;
  exports.luaK_goiftrue = luaK_goiftrue;
  exports.luaK_indexed = luaK_indexed;
  exports.luaK_infix = luaK_infix;
  exports.luaK_intK = luaK_intK;
  exports.luaK_jump = luaK_jump;
  exports.luaK_jumpto = luaK_jumpto;
  exports.luaK_nil = luaK_nil;
  exports.luaK_numberK = luaK_numberK;
  exports.luaK_patchclose = luaK_patchclose;
  exports.luaK_patchlist = luaK_patchlist;
  exports.luaK_patchtohere = luaK_patchtohere;
  exports.luaK_posfix = luaK_posfix;
  exports.luaK_prefix = luaK_prefix;
  exports.luaK_reserveregs = luaK_reserveregs;
  exports.luaK_ret = luaK_ret;
  exports.luaK_self = luaK_self;
  exports.luaK_setlist = luaK_setlist;
  exports.luaK_setmultret = luaK_setmultret;
  exports.luaK_setoneret = luaK_setoneret;
  exports.luaK_setreturns = luaK_setreturns;
  exports.luaK_storevar = luaK_storevar;
  exports.luaK_stringK = luaK_stringK;
});

// node_modules/fengari/src/lparser.js
var require_lparser = __commonJS(function(exports, module) {
  var {
    LUA_MULTRET,
    to_luastring
  } = require_defs();
  var {
    BinOpr: {
      OPR_ADD,
      OPR_AND,
      OPR_BAND,
      OPR_BOR,
      OPR_BXOR,
      OPR_CONCAT,
      OPR_DIV,
      OPR_EQ,
      OPR_GE,
      OPR_GT,
      OPR_IDIV,
      OPR_LE,
      OPR_LT,
      OPR_MOD,
      OPR_MUL,
      OPR_NE,
      OPR_NOBINOPR,
      OPR_OR,
      OPR_POW,
      OPR_SHL,
      OPR_SHR,
      OPR_SUB
    },
    UnOpr: {
      OPR_BNOT,
      OPR_LEN,
      OPR_MINUS,
      OPR_NOT,
      OPR_NOUNOPR
    },
    NO_JUMP,
    getinstruction,
    luaK_checkstack,
    luaK_codeABC,
    luaK_codeABx,
    luaK_codeAsBx,
    luaK_codek,
    luaK_concat,
    luaK_dischargevars,
    luaK_exp2RK,
    luaK_exp2anyreg,
    luaK_exp2anyregup,
    luaK_exp2nextreg,
    luaK_exp2val,
    luaK_fixline,
    luaK_getlabel,
    luaK_goiffalse,
    luaK_goiftrue,
    luaK_indexed,
    luaK_infix,
    luaK_intK,
    luaK_jump,
    luaK_jumpto,
    luaK_nil,
    luaK_patchclose,
    luaK_patchlist,
    luaK_patchtohere,
    luaK_posfix,
    luaK_prefix,
    luaK_reserveregs,
    luaK_ret,
    luaK_self,
    luaK_setlist,
    luaK_setmultret,
    luaK_setoneret,
    luaK_setreturns,
    luaK_storevar,
    luaK_stringK
  } = require_lcode();
  var ldo = require_ldo();
  var lfunc = require_lfunc();
  var llex = require_llex();
  var {
    LUAI_MAXCCALLS,
    MAX_INT,
    lua_assert
  } = require_llimits();
  var lobject = require_lobject();
  var {
    OpCodesI: {
      OP_CALL,
      OP_CLOSURE,
      OP_FORLOOP,
      OP_FORPREP,
      OP_GETUPVAL,
      OP_MOVE,
      OP_NEWTABLE,
      OP_SETTABLE,
      OP_TAILCALL,
      OP_TFORCALL,
      OP_TFORLOOP,
      OP_VARARG
    },
    LFIELDS_PER_FLUSH,
    SETARG_B,
    SETARG_C,
    SET_OPCODE
  } = require_lopcodes();
  var {
    luaS_eqlngstr,
    luaS_new,
    luaS_newliteral
  } = require_lstring();
  var ltable = require_ltable();
  var Proto = lfunc.Proto;
  var R = llex.RESERVED;
  var MAXVARS = 200;
  var hasmultret = function(k) {
    return k === expkind.VCALL || k === expkind.VVARARG;
  };
  var eqstr = function(a, b) {
    return luaS_eqlngstr(a, b);
  };

  class BlockCnt {
    constructor() {
      this.previous = null;
      this.firstlabel = NaN;
      this.firstgoto = NaN;
      this.nactvar = NaN;
      this.upval = NaN;
      this.isloop = NaN;
    }
  }
  var expkind = {
    VVOID: 0,
    VNIL: 1,
    VTRUE: 2,
    VFALSE: 3,
    VK: 4,
    VKFLT: 5,
    VKINT: 6,
    VNONRELOC: 7,
    VLOCAL: 8,
    VUPVAL: 9,
    VINDEXED: 10,
    VJMP: 11,
    VRELOCABLE: 12,
    VCALL: 13,
    VVARARG: 14
  };
  var vkisvar = function(k) {
    return expkind.VLOCAL <= k && k <= expkind.VINDEXED;
  };
  var vkisinreg = function(k) {
    return k === expkind.VNONRELOC || k === expkind.VLOCAL;
  };

  class expdesc {
    constructor() {
      this.k = NaN;
      this.u = {
        ival: NaN,
        nval: NaN,
        info: NaN,
        ind: {
          idx: NaN,
          t: NaN,
          vt: NaN
        }
      };
      this.t = NaN;
      this.f = NaN;
    }
    to(e) {
      this.k = e.k;
      this.u = e.u;
      this.t = e.t;
      this.f = e.f;
    }
  }

  class FuncState {
    constructor() {
      this.f = null;
      this.prev = null;
      this.ls = null;
      this.bl = null;
      this.pc = NaN;
      this.lasttarget = NaN;
      this.jpc = NaN;
      this.nk = NaN;
      this.np = NaN;
      this.firstlocal = NaN;
      this.nlocvars = NaN;
      this.nactvar = NaN;
      this.nups = NaN;
      this.freereg = NaN;
    }
  }

  class Vardesc {
    constructor() {
      this.idx = NaN;
    }
  }

  class Labeldesc {
    constructor() {
      this.name = null;
      this.pc = NaN;
      this.line = NaN;
      this.nactvar = NaN;
    }
  }

  class Labellist {
    constructor() {
      this.arr = [];
      this.n = NaN;
      this.size = NaN;
    }
  }

  class Dyndata {
    constructor() {
      this.actvar = {
        arr: [],
        n: NaN,
        size: NaN
      };
      this.gt = new Labellist;
      this.label = new Labellist;
    }
  }
  var semerror = function(ls, msg) {
    ls.t.token = 0;
    llex.luaX_syntaxerror(ls, msg);
  };
  var error_expected = function(ls, token) {
    llex.luaX_syntaxerror(ls, lobject.luaO_pushfstring(ls.L, to_luastring("%s expected", true), llex.luaX_token2str(ls, token)));
  };
  var errorlimit = function(fs, limit, what) {
    let L = fs.ls.L;
    let line = fs.f.linedefined;
    let where = line === 0 ? to_luastring("main function", true) : lobject.luaO_pushfstring(L, to_luastring("function at line %d", true), line);
    let msg = lobject.luaO_pushfstring(L, to_luastring("too many %s (limit is %d) in %s", true), what, limit, where);
    llex.luaX_syntaxerror(fs.ls, msg);
  };
  var checklimit = function(fs, v, l, what) {
    if (v > l)
      errorlimit(fs, l, what);
  };
  var testnext = function(ls, c) {
    if (ls.t.token === c) {
      llex.luaX_next(ls);
      return true;
    }
    return false;
  };
  var check = function(ls, c) {
    if (ls.t.token !== c)
      error_expected(ls, c);
  };
  var checknext = function(ls, c) {
    check(ls, c);
    llex.luaX_next(ls);
  };
  var check_condition = function(ls, c, msg) {
    if (!c)
      llex.luaX_syntaxerror(ls, msg);
  };
  var check_match = function(ls, what, who, where) {
    if (!testnext(ls, what)) {
      if (where === ls.linenumber)
        error_expected(ls, what);
      else
        llex.luaX_syntaxerror(ls, lobject.luaO_pushfstring(ls.L, to_luastring("%s expected (to close %s at line %d)"), llex.luaX_token2str(ls, what), llex.luaX_token2str(ls, who), where));
    }
  };
  var str_checkname = function(ls) {
    check(ls, R.TK_NAME);
    let ts = ls.t.seminfo.ts;
    llex.luaX_next(ls);
    return ts;
  };
  var init_exp = function(e, k, i) {
    e.f = e.t = NO_JUMP;
    e.k = k;
    e.u.info = i;
  };
  var codestring = function(ls, e, s) {
    init_exp(e, expkind.VK, luaK_stringK(ls.fs, s));
  };
  var checkname = function(ls, e) {
    codestring(ls, e, str_checkname(ls));
  };
  var registerlocalvar = function(ls, varname) {
    let fs = ls.fs;
    let f = fs.f;
    f.locvars[fs.nlocvars] = new lobject.LocVar;
    f.locvars[fs.nlocvars].varname = varname;
    return fs.nlocvars++;
  };
  var new_localvar = function(ls, name) {
    let fs = ls.fs;
    let dyd = ls.dyd;
    let reg = registerlocalvar(ls, name);
    checklimit(fs, dyd.actvar.n + 1 - fs.firstlocal, MAXVARS, to_luastring("local variables", true));
    dyd.actvar.arr[dyd.actvar.n] = new Vardesc;
    dyd.actvar.arr[dyd.actvar.n].idx = reg;
    dyd.actvar.n++;
  };
  var new_localvarliteral = function(ls, name) {
    new_localvar(ls, llex.luaX_newstring(ls, to_luastring(name, true)));
  };
  var getlocvar = function(fs, i) {
    let idx = fs.ls.dyd.actvar.arr[fs.firstlocal + i].idx;
    lua_assert(idx < fs.nlocvars);
    return fs.f.locvars[idx];
  };
  var adjustlocalvars = function(ls, nvars) {
    let fs = ls.fs;
    fs.nactvar = fs.nactvar + nvars;
    for (;nvars; nvars--)
      getlocvar(fs, fs.nactvar - nvars).startpc = fs.pc;
  };
  var removevars = function(fs, tolevel) {
    fs.ls.dyd.actvar.n -= fs.nactvar - tolevel;
    while (fs.nactvar > tolevel)
      getlocvar(fs, --fs.nactvar).endpc = fs.pc;
  };
  var searchupvalue = function(fs, name) {
    let up = fs.f.upvalues;
    for (let i = 0;i < fs.nups; i++) {
      if (eqstr(up[i].name, name))
        return i;
    }
    return -1;
  };
  var newupvalue = function(fs, name, v) {
    let f = fs.f;
    checklimit(fs, fs.nups + 1, lfunc.MAXUPVAL, to_luastring("upvalues", true));
    f.upvalues[fs.nups] = {
      instack: v.k === expkind.VLOCAL,
      idx: v.u.info,
      name
    };
    return fs.nups++;
  };
  var searchvar = function(fs, n) {
    for (let i = fs.nactvar - 1;i >= 0; i--) {
      if (eqstr(n, getlocvar(fs, i).varname))
        return i;
    }
    return -1;
  };
  var markupval = function(fs, level) {
    let bl = fs.bl;
    while (bl.nactvar > level)
      bl = bl.previous;
    bl.upval = 1;
  };
  var singlevaraux = function(fs, n, vr, base) {
    if (fs === null)
      init_exp(vr, expkind.VVOID, 0);
    else {
      let v = searchvar(fs, n);
      if (v >= 0) {
        init_exp(vr, expkind.VLOCAL, v);
        if (!base)
          markupval(fs, v);
      } else {
        let idx = searchupvalue(fs, n);
        if (idx < 0) {
          singlevaraux(fs.prev, n, vr, 0);
          if (vr.k === expkind.VVOID)
            return;
          idx = newupvalue(fs, n, vr);
        }
        init_exp(vr, expkind.VUPVAL, idx);
      }
    }
  };
  var singlevar = function(ls, vr) {
    let varname = str_checkname(ls);
    let fs = ls.fs;
    singlevaraux(fs, varname, vr, 1);
    if (vr.k === expkind.VVOID) {
      let key = new expdesc;
      singlevaraux(fs, ls.envn, vr, 1);
      lua_assert(vr.k !== expkind.VVOID);
      codestring(ls, key, varname);
      luaK_indexed(fs, vr, key);
    }
  };
  var adjust_assign = function(ls, nvars, nexps, e) {
    let fs = ls.fs;
    let extra = nvars - nexps;
    if (hasmultret(e.k)) {
      extra++;
      if (extra < 0)
        extra = 0;
      luaK_setreturns(fs, e, extra);
      if (extra > 1)
        luaK_reserveregs(fs, extra - 1);
    } else {
      if (e.k !== expkind.VVOID)
        luaK_exp2nextreg(fs, e);
      if (extra > 0) {
        let reg = fs.freereg;
        luaK_reserveregs(fs, extra);
        luaK_nil(fs, reg, extra);
      }
    }
    if (nexps > nvars)
      ls.fs.freereg -= nexps - nvars;
  };
  var enterlevel = function(ls) {
    let L = ls.L;
    ++L.nCcalls;
    checklimit(ls.fs, L.nCcalls, LUAI_MAXCCALLS, to_luastring("JS levels", true));
  };
  var leavelevel = function(ls) {
    return ls.L.nCcalls--;
  };
  var closegoto = function(ls, g, label) {
    let fs = ls.fs;
    let gl = ls.dyd.gt;
    let gt = gl.arr[g];
    lua_assert(eqstr(gt.name, label.name));
    if (gt.nactvar < label.nactvar) {
      let vname = getlocvar(fs, gt.nactvar).varname;
      let msg = lobject.luaO_pushfstring(ls.L, to_luastring("<goto %s> at line %d jumps into the scope of local '%s'"), gt.name.getstr(), gt.line, vname.getstr());
      semerror(ls, msg);
    }
    luaK_patchlist(fs, gt.pc, label.pc);
    for (let i = g;i < gl.n - 1; i++)
      gl.arr[i] = gl.arr[i + 1];
    gl.n--;
  };
  var findlabel = function(ls, g) {
    let bl = ls.fs.bl;
    let dyd = ls.dyd;
    let gt = dyd.gt.arr[g];
    for (let i = bl.firstlabel;i < dyd.label.n; i++) {
      let lb = dyd.label.arr[i];
      if (eqstr(lb.name, gt.name)) {
        if (gt.nactvar > lb.nactvar && (bl.upval || dyd.label.n > bl.firstlabel))
          luaK_patchclose(ls.fs, gt.pc, lb.nactvar);
        closegoto(ls, g, lb);
        return true;
      }
    }
    return false;
  };
  var newlabelentry = function(ls, l, name, line, pc) {
    let n = l.n;
    l.arr[n] = new Labeldesc;
    l.arr[n].name = name;
    l.arr[n].line = line;
    l.arr[n].nactvar = ls.fs.nactvar;
    l.arr[n].pc = pc;
    l.n = n + 1;
    return n;
  };
  var findgotos = function(ls, lb) {
    let gl = ls.dyd.gt;
    let i = ls.fs.bl.firstgoto;
    while (i < gl.n) {
      if (eqstr(gl.arr[i].name, lb.name))
        closegoto(ls, i, lb);
      else
        i++;
    }
  };
  var movegotosout = function(fs, bl) {
    let i = bl.firstgoto;
    let gl = fs.ls.dyd.gt;
    while (i < gl.n) {
      let gt = gl.arr[i];
      if (gt.nactvar > bl.nactvar) {
        if (bl.upval)
          luaK_patchclose(fs, gt.pc, bl.nactvar);
        gt.nactvar = bl.nactvar;
      }
      if (!findlabel(fs.ls, i))
        i++;
    }
  };
  var enterblock = function(fs, bl, isloop) {
    bl.isloop = isloop;
    bl.nactvar = fs.nactvar;
    bl.firstlabel = fs.ls.dyd.label.n;
    bl.firstgoto = fs.ls.dyd.gt.n;
    bl.upval = 0;
    bl.previous = fs.bl;
    fs.bl = bl;
    lua_assert(fs.freereg === fs.nactvar);
  };
  var breaklabel = function(ls) {
    let n = luaS_newliteral(ls.L, "break");
    let l = newlabelentry(ls, ls.dyd.label, n, 0, ls.fs.pc);
    findgotos(ls, ls.dyd.label.arr[l]);
  };
  var undefgoto = function(ls, gt) {
    let msg = llex.isreserved(gt.name) ? "<%s> at line %d not inside a loop" : "no visible label '%s' for <goto> at line %d";
    msg = lobject.luaO_pushfstring(ls.L, to_luastring(msg), gt.name.getstr(), gt.line);
    semerror(ls, msg);
  };
  var addprototype = function(ls) {
    let L = ls.L;
    let clp = new Proto(L);
    let fs = ls.fs;
    let f = fs.f;
    f.p[fs.np++] = clp;
    return clp;
  };
  var codeclosure = function(ls, v) {
    let fs = ls.fs.prev;
    init_exp(v, expkind.VRELOCABLE, luaK_codeABx(fs, OP_CLOSURE, 0, fs.np - 1));
    luaK_exp2nextreg(fs, v);
  };
  var open_func = function(ls, fs, bl) {
    fs.prev = ls.fs;
    fs.ls = ls;
    ls.fs = fs;
    fs.pc = 0;
    fs.lasttarget = 0;
    fs.jpc = NO_JUMP;
    fs.freereg = 0;
    fs.nk = 0;
    fs.np = 0;
    fs.nups = 0;
    fs.nlocvars = 0;
    fs.nactvar = 0;
    fs.firstlocal = ls.dyd.actvar.n;
    fs.bl = null;
    let f = fs.f;
    f.source = ls.source;
    f.maxstacksize = 2;
    enterblock(fs, bl, false);
  };
  var leaveblock = function(fs) {
    let bl = fs.bl;
    let ls = fs.ls;
    if (bl.previous && bl.upval) {
      let j = luaK_jump(fs);
      luaK_patchclose(fs, j, bl.nactvar);
      luaK_patchtohere(fs, j);
    }
    if (bl.isloop)
      breaklabel(ls);
    fs.bl = bl.previous;
    removevars(fs, bl.nactvar);
    lua_assert(bl.nactvar === fs.nactvar);
    fs.freereg = fs.nactvar;
    ls.dyd.label.n = bl.firstlabel;
    if (bl.previous)
      movegotosout(fs, bl);
    else if (bl.firstgoto < ls.dyd.gt.n)
      undefgoto(ls, ls.dyd.gt.arr[bl.firstgoto]);
  };
  var close_func = function(ls) {
    let fs = ls.fs;
    luaK_ret(fs, 0, 0);
    leaveblock(fs);
    lua_assert(fs.bl === null);
    ls.fs = fs.prev;
  };
  var block_follow = function(ls, withuntil) {
    switch (ls.t.token) {
      case R.TK_ELSE:
      case R.TK_ELSEIF:
      case R.TK_END:
      case R.TK_EOS:
        return true;
      case R.TK_UNTIL:
        return withuntil;
      default:
        return false;
    }
  };
  var statlist = function(ls) {
    while (!block_follow(ls, 1)) {
      if (ls.t.token === R.TK_RETURN) {
        statement(ls);
        return;
      }
      statement(ls);
    }
  };
  var fieldsel = function(ls, v) {
    let fs = ls.fs;
    let key = new expdesc;
    luaK_exp2anyregup(fs, v);
    llex.luaX_next(ls);
    checkname(ls, key);
    luaK_indexed(fs, v, key);
  };
  var yindex = function(ls, v) {
    llex.luaX_next(ls);
    expr(ls, v);
    luaK_exp2val(ls.fs, v);
    checknext(ls, 93);
  };

  class ConsControl {
    constructor() {
      this.v = new expdesc;
      this.t = new expdesc;
      this.nh = NaN;
      this.na = NaN;
      this.tostore = NaN;
    }
  }
  var recfield = function(ls, cc) {
    let fs = ls.fs;
    let reg = ls.fs.freereg;
    let key = new expdesc;
    let val = new expdesc;
    if (ls.t.token === R.TK_NAME) {
      checklimit(fs, cc.nh, MAX_INT, to_luastring("items in a constructor", true));
      checkname(ls, key);
    } else
      yindex(ls, key);
    cc.nh++;
    checknext(ls, 61);
    let rkkey = luaK_exp2RK(fs, key);
    expr(ls, val);
    luaK_codeABC(fs, OP_SETTABLE, cc.t.u.info, rkkey, luaK_exp2RK(fs, val));
    fs.freereg = reg;
  };
  var closelistfield = function(fs, cc) {
    if (cc.v.k === expkind.VVOID)
      return;
    luaK_exp2nextreg(fs, cc.v);
    cc.v.k = expkind.VVOID;
    if (cc.tostore === LFIELDS_PER_FLUSH) {
      luaK_setlist(fs, cc.t.u.info, cc.na, cc.tostore);
      cc.tostore = 0;
    }
  };
  var lastlistfield = function(fs, cc) {
    if (cc.tostore === 0)
      return;
    if (hasmultret(cc.v.k)) {
      luaK_setmultret(fs, cc.v);
      luaK_setlist(fs, cc.t.u.info, cc.na, LUA_MULTRET);
      cc.na--;
    } else {
      if (cc.v.k !== expkind.VVOID)
        luaK_exp2nextreg(fs, cc.v);
      luaK_setlist(fs, cc.t.u.info, cc.na, cc.tostore);
    }
  };
  var listfield = function(ls, cc) {
    expr(ls, cc.v);
    checklimit(ls.fs, cc.na, MAX_INT, to_luastring("items in a constructor", true));
    cc.na++;
    cc.tostore++;
  };
  var field = function(ls, cc) {
    switch (ls.t.token) {
      case R.TK_NAME: {
        if (llex.luaX_lookahead(ls) !== 61)
          listfield(ls, cc);
        else
          recfield(ls, cc);
        break;
      }
      case 91: {
        recfield(ls, cc);
        break;
      }
      default: {
        listfield(ls, cc);
        break;
      }
    }
  };
  var constructor = function(ls, t) {
    let fs = ls.fs;
    let line = ls.linenumber;
    let pc = luaK_codeABC(fs, OP_NEWTABLE, 0, 0, 0);
    let cc = new ConsControl;
    cc.na = cc.nh = cc.tostore = 0;
    cc.t = t;
    init_exp(t, expkind.VRELOCABLE, pc);
    init_exp(cc.v, expkind.VVOID, 0);
    luaK_exp2nextreg(ls.fs, t);
    checknext(ls, 123);
    do {
      lua_assert(cc.v.k === expkind.VVOID || cc.tostore > 0);
      if (ls.t.token === 125)
        break;
      closelistfield(fs, cc);
      field(ls, cc);
    } while (testnext(ls, 44) || testnext(ls, 59));
    check_match(ls, 125, 123, line);
    lastlistfield(fs, cc);
    SETARG_B(fs.f.code[pc], lobject.luaO_int2fb(cc.na));
    SETARG_C(fs.f.code[pc], lobject.luaO_int2fb(cc.nh));
  };
  var parlist = function(ls) {
    let fs = ls.fs;
    let f = fs.f;
    let nparams = 0;
    f.is_vararg = false;
    if (ls.t.token !== 41) {
      do {
        switch (ls.t.token) {
          case R.TK_NAME: {
            new_localvar(ls, str_checkname(ls));
            nparams++;
            break;
          }
          case R.TK_DOTS: {
            llex.luaX_next(ls);
            f.is_vararg = true;
            break;
          }
          default:
            llex.luaX_syntaxerror(ls, to_luastring("<name> or '...' expected", true));
        }
      } while (!f.is_vararg && testnext(ls, 44));
    }
    adjustlocalvars(ls, nparams);
    f.numparams = fs.nactvar;
    luaK_reserveregs(fs, fs.nactvar);
  };
  var body = function(ls, e, ismethod, line) {
    let new_fs = new FuncState;
    let bl = new BlockCnt;
    new_fs.f = addprototype(ls);
    new_fs.f.linedefined = line;
    open_func(ls, new_fs, bl);
    checknext(ls, 40);
    if (ismethod) {
      new_localvarliteral(ls, "self");
      adjustlocalvars(ls, 1);
    }
    parlist(ls);
    checknext(ls, 41);
    statlist(ls);
    new_fs.f.lastlinedefined = ls.linenumber;
    check_match(ls, R.TK_END, R.TK_FUNCTION, line);
    codeclosure(ls, e);
    close_func(ls);
  };
  var explist = function(ls, v) {
    let n = 1;
    expr(ls, v);
    while (testnext(ls, 44)) {
      luaK_exp2nextreg(ls.fs, v);
      expr(ls, v);
      n++;
    }
    return n;
  };
  var funcargs = function(ls, f, line) {
    let fs = ls.fs;
    let args = new expdesc;
    switch (ls.t.token) {
      case 40: {
        llex.luaX_next(ls);
        if (ls.t.token === 41)
          args.k = expkind.VVOID;
        else {
          explist(ls, args);
          luaK_setmultret(fs, args);
        }
        check_match(ls, 41, 40, line);
        break;
      }
      case 123: {
        constructor(ls, args);
        break;
      }
      case R.TK_STRING: {
        codestring(ls, args, ls.t.seminfo.ts);
        llex.luaX_next(ls);
        break;
      }
      default: {
        llex.luaX_syntaxerror(ls, to_luastring("function arguments expected", true));
      }
    }
    lua_assert(f.k === expkind.VNONRELOC);
    let nparams;
    let base = f.u.info;
    if (hasmultret(args.k))
      nparams = LUA_MULTRET;
    else {
      if (args.k !== expkind.VVOID)
        luaK_exp2nextreg(fs, args);
      nparams = fs.freereg - (base + 1);
    }
    init_exp(f, expkind.VCALL, luaK_codeABC(fs, OP_CALL, base, nparams + 1, 2));
    luaK_fixline(fs, line);
    fs.freereg = base + 1;
  };
  var primaryexp = function(ls, v) {
    switch (ls.t.token) {
      case 40: {
        let line = ls.linenumber;
        llex.luaX_next(ls);
        expr(ls, v);
        check_match(ls, 41, 40, line);
        luaK_dischargevars(ls.fs, v);
        return;
      }
      case R.TK_NAME: {
        singlevar(ls, v);
        return;
      }
      default: {
        llex.luaX_syntaxerror(ls, to_luastring("unexpected symbol", true));
      }
    }
  };
  var suffixedexp = function(ls, v) {
    let fs = ls.fs;
    let line = ls.linenumber;
    primaryexp(ls, v);
    for (;; ) {
      switch (ls.t.token) {
        case 46: {
          fieldsel(ls, v);
          break;
        }
        case 91: {
          let key = new expdesc;
          luaK_exp2anyregup(fs, v);
          yindex(ls, key);
          luaK_indexed(fs, v, key);
          break;
        }
        case 58: {
          let key = new expdesc;
          llex.luaX_next(ls);
          checkname(ls, key);
          luaK_self(fs, v, key);
          funcargs(ls, v, line);
          break;
        }
        case 40:
        case R.TK_STRING:
        case 123: {
          luaK_exp2nextreg(fs, v);
          funcargs(ls, v, line);
          break;
        }
        default:
          return;
      }
    }
  };
  var simpleexp = function(ls, v) {
    switch (ls.t.token) {
      case R.TK_FLT: {
        init_exp(v, expkind.VKFLT, 0);
        v.u.nval = ls.t.seminfo.r;
        break;
      }
      case R.TK_INT: {
        init_exp(v, expkind.VKINT, 0);
        v.u.ival = ls.t.seminfo.i;
        break;
      }
      case R.TK_STRING: {
        codestring(ls, v, ls.t.seminfo.ts);
        break;
      }
      case R.TK_NIL: {
        init_exp(v, expkind.VNIL, 0);
        break;
      }
      case R.TK_TRUE: {
        init_exp(v, expkind.VTRUE, 0);
        break;
      }
      case R.TK_FALSE: {
        init_exp(v, expkind.VFALSE, 0);
        break;
      }
      case R.TK_DOTS: {
        let fs = ls.fs;
        check_condition(ls, fs.f.is_vararg, to_luastring("cannot use '...' outside a vararg function", true));
        init_exp(v, expkind.VVARARG, luaK_codeABC(fs, OP_VARARG, 0, 1, 0));
        break;
      }
      case 123: {
        constructor(ls, v);
        return;
      }
      case R.TK_FUNCTION: {
        llex.luaX_next(ls);
        body(ls, v, 0, ls.linenumber);
        return;
      }
      default: {
        suffixedexp(ls, v);
        return;
      }
    }
    llex.luaX_next(ls);
  };
  var getunopr = function(op) {
    switch (op) {
      case R.TK_NOT:
        return OPR_NOT;
      case 45:
        return OPR_MINUS;
      case 126:
        return OPR_BNOT;
      case 35:
        return OPR_LEN;
      default:
        return OPR_NOUNOPR;
    }
  };
  var getbinopr = function(op) {
    switch (op) {
      case 43:
        return OPR_ADD;
      case 45:
        return OPR_SUB;
      case 42:
        return OPR_MUL;
      case 37:
        return OPR_MOD;
      case 94:
        return OPR_POW;
      case 47:
        return OPR_DIV;
      case R.TK_IDIV:
        return OPR_IDIV;
      case 38:
        return OPR_BAND;
      case 124:
        return OPR_BOR;
      case 126:
        return OPR_BXOR;
      case R.TK_SHL:
        return OPR_SHL;
      case R.TK_SHR:
        return OPR_SHR;
      case R.TK_CONCAT:
        return OPR_CONCAT;
      case R.TK_NE:
        return OPR_NE;
      case R.TK_EQ:
        return OPR_EQ;
      case 60:
        return OPR_LT;
      case R.TK_LE:
        return OPR_LE;
      case 62:
        return OPR_GT;
      case R.TK_GE:
        return OPR_GE;
      case R.TK_AND:
        return OPR_AND;
      case R.TK_OR:
        return OPR_OR;
      default:
        return OPR_NOBINOPR;
    }
  };
  var priority = [
    { left: 10, right: 10 },
    { left: 10, right: 10 },
    { left: 11, right: 11 },
    { left: 11, right: 11 },
    { left: 14, right: 13 },
    { left: 11, right: 11 },
    { left: 11, right: 11 },
    { left: 6, right: 6 },
    { left: 4, right: 4 },
    { left: 5, right: 5 },
    { left: 7, right: 7 },
    { left: 7, right: 7 },
    { left: 9, right: 8 },
    { left: 3, right: 3 },
    { left: 3, right: 3 },
    { left: 3, right: 3 },
    { left: 3, right: 3 },
    { left: 3, right: 3 },
    { left: 3, right: 3 },
    { left: 2, right: 2 },
    { left: 1, right: 1 }
  ];
  var UNARY_PRIORITY = 12;
  var subexpr = function(ls, v, limit) {
    enterlevel(ls);
    let uop = getunopr(ls.t.token);
    if (uop !== OPR_NOUNOPR) {
      let line = ls.linenumber;
      llex.luaX_next(ls);
      subexpr(ls, v, UNARY_PRIORITY);
      luaK_prefix(ls.fs, uop, v, line);
    } else
      simpleexp(ls, v);
    let op = getbinopr(ls.t.token);
    while (op !== OPR_NOBINOPR && priority[op].left > limit) {
      let v2 = new expdesc;
      let line = ls.linenumber;
      llex.luaX_next(ls);
      luaK_infix(ls.fs, op, v);
      let nextop = subexpr(ls, v2, priority[op].right);
      luaK_posfix(ls.fs, op, v, v2, line);
      op = nextop;
    }
    leavelevel(ls);
    return op;
  };
  var expr = function(ls, v) {
    subexpr(ls, v, 0);
  };
  var block = function(ls) {
    let fs = ls.fs;
    let bl = new BlockCnt;
    enterblock(fs, bl, 0);
    statlist(ls);
    leaveblock(fs);
  };

  class LHS_assign {
    constructor() {
      this.prev = null;
      this.v = new expdesc;
    }
  }
  var check_conflict = function(ls, lh, v) {
    let fs = ls.fs;
    let extra = fs.freereg;
    let conflict = false;
    for (;lh; lh = lh.prev) {
      if (lh.v.k === expkind.VINDEXED) {
        if (lh.v.u.ind.vt === v.k && lh.v.u.ind.t === v.u.info) {
          conflict = true;
          lh.v.u.ind.vt = expkind.VLOCAL;
          lh.v.u.ind.t = extra;
        }
        if (v.k === expkind.VLOCAL && lh.v.u.ind.idx === v.u.info) {
          conflict = true;
          lh.v.u.ind.idx = extra;
        }
      }
    }
    if (conflict) {
      let op = v.k === expkind.VLOCAL ? OP_MOVE : OP_GETUPVAL;
      luaK_codeABC(fs, op, extra, v.u.info, 0);
      luaK_reserveregs(fs, 1);
    }
  };
  var assignment = function(ls, lh, nvars) {
    let e = new expdesc;
    check_condition(ls, vkisvar(lh.v.k), to_luastring("syntax error", true));
    if (testnext(ls, 44)) {
      let nv = new LHS_assign;
      nv.prev = lh;
      suffixedexp(ls, nv.v);
      if (nv.v.k !== expkind.VINDEXED)
        check_conflict(ls, lh, nv.v);
      checklimit(ls.fs, nvars + ls.L.nCcalls, LUAI_MAXCCALLS, to_luastring("JS levels", true));
      assignment(ls, nv, nvars + 1);
    } else {
      checknext(ls, 61);
      let nexps = explist(ls, e);
      if (nexps !== nvars)
        adjust_assign(ls, nvars, nexps, e);
      else {
        luaK_setoneret(ls.fs, e);
        luaK_storevar(ls.fs, lh.v, e);
        return;
      }
    }
    init_exp(e, expkind.VNONRELOC, ls.fs.freereg - 1);
    luaK_storevar(ls.fs, lh.v, e);
  };
  var cond = function(ls) {
    let v = new expdesc;
    expr(ls, v);
    if (v.k === expkind.VNIL)
      v.k = expkind.VFALSE;
    luaK_goiftrue(ls.fs, v);
    return v.f;
  };
  var gotostat = function(ls, pc) {
    let line = ls.linenumber;
    let label;
    if (testnext(ls, R.TK_GOTO))
      label = str_checkname(ls);
    else {
      llex.luaX_next(ls);
      label = luaS_newliteral(ls.L, "break");
    }
    let g = newlabelentry(ls, ls.dyd.gt, label, line, pc);
    findlabel(ls, g);
  };
  var checkrepeated = function(fs, ll, label) {
    for (let i = fs.bl.firstlabel;i < ll.n; i++) {
      if (eqstr(label, ll.arr[i].name)) {
        let msg = lobject.luaO_pushfstring(fs.ls.L, to_luastring("label '%s' already defined on line %d", true), label.getstr(), ll.arr[i].line);
        semerror(fs.ls, msg);
      }
    }
  };
  var skipnoopstat = function(ls) {
    while (ls.t.token === 59 || ls.t.token === R.TK_DBCOLON)
      statement(ls);
  };
  var labelstat = function(ls, label, line) {
    let fs = ls.fs;
    let ll = ls.dyd.label;
    let l;
    checkrepeated(fs, ll, label);
    checknext(ls, R.TK_DBCOLON);
    l = newlabelentry(ls, ll, label, line, luaK_getlabel(fs));
    skipnoopstat(ls);
    if (block_follow(ls, 0)) {
      ll.arr[l].nactvar = fs.bl.nactvar;
    }
    findgotos(ls, ll.arr[l]);
  };
  var whilestat = function(ls, line) {
    let fs = ls.fs;
    let bl = new BlockCnt;
    llex.luaX_next(ls);
    let whileinit = luaK_getlabel(fs);
    let condexit = cond(ls);
    enterblock(fs, bl, 1);
    checknext(ls, R.TK_DO);
    block(ls);
    luaK_jumpto(fs, whileinit);
    check_match(ls, R.TK_END, R.TK_WHILE, line);
    leaveblock(fs);
    luaK_patchtohere(fs, condexit);
  };
  var repeatstat = function(ls, line) {
    let fs = ls.fs;
    let repeat_init = luaK_getlabel(fs);
    let bl1 = new BlockCnt;
    let bl2 = new BlockCnt;
    enterblock(fs, bl1, 1);
    enterblock(fs, bl2, 0);
    llex.luaX_next(ls);
    statlist(ls);
    check_match(ls, R.TK_UNTIL, R.TK_REPEAT, line);
    let condexit = cond(ls);
    if (bl2.upval)
      luaK_patchclose(fs, condexit, bl2.nactvar);
    leaveblock(fs);
    luaK_patchlist(fs, condexit, repeat_init);
    leaveblock(fs);
  };
  var exp1 = function(ls) {
    let e = new expdesc;
    expr(ls, e);
    luaK_exp2nextreg(ls.fs, e);
    lua_assert(e.k === expkind.VNONRELOC);
    let reg = e.u.info;
    return reg;
  };
  var forbody = function(ls, base, line, nvars, isnum) {
    let bl = new BlockCnt;
    let fs = ls.fs;
    let endfor;
    adjustlocalvars(ls, 3);
    checknext(ls, R.TK_DO);
    let prep = isnum ? luaK_codeAsBx(fs, OP_FORPREP, base, NO_JUMP) : luaK_jump(fs);
    enterblock(fs, bl, 0);
    adjustlocalvars(ls, nvars);
    luaK_reserveregs(fs, nvars);
    block(ls);
    leaveblock(fs);
    luaK_patchtohere(fs, prep);
    if (isnum)
      endfor = luaK_codeAsBx(fs, OP_FORLOOP, base, NO_JUMP);
    else {
      luaK_codeABC(fs, OP_TFORCALL, base, 0, nvars);
      luaK_fixline(fs, line);
      endfor = luaK_codeAsBx(fs, OP_TFORLOOP, base + 2, NO_JUMP);
    }
    luaK_patchlist(fs, endfor, prep + 1);
    luaK_fixline(fs, line);
  };
  var fornum = function(ls, varname, line) {
    let fs = ls.fs;
    let base = fs.freereg;
    new_localvarliteral(ls, "(for index)");
    new_localvarliteral(ls, "(for limit)");
    new_localvarliteral(ls, "(for step)");
    new_localvar(ls, varname);
    checknext(ls, 61);
    exp1(ls);
    checknext(ls, 44);
    exp1(ls);
    if (testnext(ls, 44))
      exp1(ls);
    else {
      luaK_codek(fs, fs.freereg, luaK_intK(fs, 1));
      luaK_reserveregs(fs, 1);
    }
    forbody(ls, base, line, 1, 1);
  };
  var forlist = function(ls, indexname) {
    let fs = ls.fs;
    let e = new expdesc;
    let nvars = 4;
    let base = fs.freereg;
    new_localvarliteral(ls, "(for generator)");
    new_localvarliteral(ls, "(for state)");
    new_localvarliteral(ls, "(for control)");
    new_localvar(ls, indexname);
    while (testnext(ls, 44)) {
      new_localvar(ls, str_checkname(ls));
      nvars++;
    }
    checknext(ls, R.TK_IN);
    let line = ls.linenumber;
    adjust_assign(ls, 3, explist(ls, e), e);
    luaK_checkstack(fs, 3);
    forbody(ls, base, line, nvars - 3, 0);
  };
  var forstat = function(ls, line) {
    let fs = ls.fs;
    let bl = new BlockCnt;
    enterblock(fs, bl, 1);
    llex.luaX_next(ls);
    let varname = str_checkname(ls);
    switch (ls.t.token) {
      case 61:
        fornum(ls, varname, line);
        break;
      case 44:
      case R.TK_IN:
        forlist(ls, varname);
        break;
      default:
        llex.luaX_syntaxerror(ls, to_luastring("'=' or 'in' expected", true));
    }
    check_match(ls, R.TK_END, R.TK_FOR, line);
    leaveblock(fs);
  };
  var test_then_block = function(ls, escapelist) {
    let bl = new BlockCnt;
    let fs = ls.fs;
    let v = new expdesc;
    let jf;
    llex.luaX_next(ls);
    expr(ls, v);
    checknext(ls, R.TK_THEN);
    if (ls.t.token === R.TK_GOTO || ls.t.token === R.TK_BREAK) {
      luaK_goiffalse(ls.fs, v);
      enterblock(fs, bl, false);
      gotostat(ls, v.t);
      while (testnext(ls, 59))
        ;
      if (block_follow(ls, 0)) {
        leaveblock(fs);
        return escapelist;
      } else
        jf = luaK_jump(fs);
    } else {
      luaK_goiftrue(ls.fs, v);
      enterblock(fs, bl, false);
      jf = v.f;
    }
    statlist(ls);
    leaveblock(fs);
    if (ls.t.token === R.TK_ELSE || ls.t.token === R.TK_ELSEIF)
      escapelist = luaK_concat(fs, escapelist, luaK_jump(fs));
    luaK_patchtohere(fs, jf);
    return escapelist;
  };
  var ifstat = function(ls, line) {
    let fs = ls.fs;
    let escapelist = NO_JUMP;
    escapelist = test_then_block(ls, escapelist);
    while (ls.t.token === R.TK_ELSEIF)
      escapelist = test_then_block(ls, escapelist);
    if (testnext(ls, R.TK_ELSE))
      block(ls);
    check_match(ls, R.TK_END, R.TK_IF, line);
    luaK_patchtohere(fs, escapelist);
  };
  var localfunc = function(ls) {
    let b = new expdesc;
    let fs = ls.fs;
    new_localvar(ls, str_checkname(ls));
    adjustlocalvars(ls, 1);
    body(ls, b, 0, ls.linenumber);
    getlocvar(fs, b.u.info).startpc = fs.pc;
  };
  var localstat = function(ls) {
    let nvars = 0;
    let nexps;
    let e = new expdesc;
    do {
      new_localvar(ls, str_checkname(ls));
      nvars++;
    } while (testnext(ls, 44));
    if (testnext(ls, 61))
      nexps = explist(ls, e);
    else {
      e.k = expkind.VVOID;
      nexps = 0;
    }
    adjust_assign(ls, nvars, nexps, e);
    adjustlocalvars(ls, nvars);
  };
  var funcname = function(ls, v) {
    let ismethod = 0;
    singlevar(ls, v);
    while (ls.t.token === 46)
      fieldsel(ls, v);
    if (ls.t.token === 58) {
      ismethod = 1;
      fieldsel(ls, v);
    }
    return ismethod;
  };
  var funcstat = function(ls, line) {
    let v = new expdesc;
    let b = new expdesc;
    llex.luaX_next(ls);
    let ismethod = funcname(ls, v);
    body(ls, b, ismethod, line);
    luaK_storevar(ls.fs, v, b);
    luaK_fixline(ls.fs, line);
  };
  var exprstat = function(ls) {
    let fs = ls.fs;
    let v = new LHS_assign;
    suffixedexp(ls, v.v);
    if (ls.t.token === 61 || ls.t.token === 44) {
      v.prev = null;
      assignment(ls, v, 1);
    } else {
      check_condition(ls, v.v.k === expkind.VCALL, to_luastring("syntax error", true));
      SETARG_C(getinstruction(fs, v.v), 1);
    }
  };
  var retstat = function(ls) {
    let fs = ls.fs;
    let e = new expdesc;
    let first, nret;
    if (block_follow(ls, 1) || ls.t.token === 59)
      first = nret = 0;
    else {
      nret = explist(ls, e);
      if (hasmultret(e.k)) {
        luaK_setmultret(fs, e);
        if (e.k === expkind.VCALL && nret === 1) {
          SET_OPCODE(getinstruction(fs, e), OP_TAILCALL);
          lua_assert(getinstruction(fs, e).A === fs.nactvar);
        }
        first = fs.nactvar;
        nret = LUA_MULTRET;
      } else {
        if (nret === 1)
          first = luaK_exp2anyreg(fs, e);
        else {
          luaK_exp2nextreg(fs, e);
          first = fs.nactvar;
          lua_assert(nret === fs.freereg - first);
        }
      }
    }
    luaK_ret(fs, first, nret);
    testnext(ls, 59);
  };
  var statement = function(ls) {
    let line = ls.linenumber;
    enterlevel(ls);
    switch (ls.t.token) {
      case 59: {
        llex.luaX_next(ls);
        break;
      }
      case R.TK_IF: {
        ifstat(ls, line);
        break;
      }
      case R.TK_WHILE: {
        whilestat(ls, line);
        break;
      }
      case R.TK_DO: {
        llex.luaX_next(ls);
        block(ls);
        check_match(ls, R.TK_END, R.TK_DO, line);
        break;
      }
      case R.TK_FOR: {
        forstat(ls, line);
        break;
      }
      case R.TK_REPEAT: {
        repeatstat(ls, line);
        break;
      }
      case R.TK_FUNCTION: {
        funcstat(ls, line);
        break;
      }
      case R.TK_LOCAL: {
        llex.luaX_next(ls);
        if (testnext(ls, R.TK_FUNCTION))
          localfunc(ls);
        else
          localstat(ls);
        break;
      }
      case R.TK_DBCOLON: {
        llex.luaX_next(ls);
        labelstat(ls, str_checkname(ls), line);
        break;
      }
      case R.TK_RETURN: {
        llex.luaX_next(ls);
        retstat(ls);
        break;
      }
      case R.TK_BREAK:
      case R.TK_GOTO: {
        gotostat(ls, luaK_jump(ls.fs));
        break;
      }
      default: {
        exprstat(ls);
        break;
      }
    }
    lua_assert(ls.fs.f.maxstacksize >= ls.fs.freereg && ls.fs.freereg >= ls.fs.nactvar);
    ls.fs.freereg = ls.fs.nactvar;
    leavelevel(ls);
  };
  var mainfunc = function(ls, fs) {
    let bl = new BlockCnt;
    let v = new expdesc;
    open_func(ls, fs, bl);
    fs.f.is_vararg = true;
    init_exp(v, expkind.VLOCAL, 0);
    newupvalue(fs, ls.envn, v);
    llex.luaX_next(ls);
    statlist(ls);
    check(ls, R.TK_EOS);
    close_func(ls);
  };
  var luaY_parser = function(L, z, buff, dyd, name, firstchar) {
    let lexstate = new llex.LexState;
    let funcstate = new FuncState;
    let cl = lfunc.luaF_newLclosure(L, 1);
    ldo.luaD_inctop(L);
    L.stack[L.top - 1].setclLvalue(cl);
    lexstate.h = ltable.luaH_new(L);
    ldo.luaD_inctop(L);
    L.stack[L.top - 1].sethvalue(lexstate.h);
    funcstate.f = cl.p = new Proto(L);
    funcstate.f.source = luaS_new(L, name);
    lexstate.buff = buff;
    lexstate.dyd = dyd;
    dyd.actvar.n = dyd.gt.n = dyd.label.n = 0;
    llex.luaX_setinput(L, lexstate, z, funcstate.f.source, firstchar);
    mainfunc(lexstate, funcstate);
    lua_assert(!funcstate.prev && funcstate.nups === 1 && !lexstate.fs);
    lua_assert(dyd.actvar.n === 0 && dyd.gt.n === 0 && dyd.label.n === 0);
    delete L.stack[--L.top];
    return cl;
  };
  exports.Dyndata = Dyndata;
  exports.expkind = expkind;
  exports.expdesc = expdesc;
  exports.luaY_parser = luaY_parser;
  exports.vkisinreg = vkisinreg;
});

// node_modules/fengari/src/lundump.js
var require_lundump = __commonJS(function(exports, module) {
  var {
    LUA_SIGNATURE,
    constant_types: {
      LUA_TBOOLEAN,
      LUA_TLNGSTR,
      LUA_TNIL,
      LUA_TNUMFLT,
      LUA_TNUMINT,
      LUA_TSHRSTR
    },
    thread_status: { LUA_ERRSYNTAX },
    is_luastring,
    luastring_eq,
    to_luastring
  } = require_defs();
  var ldo = require_ldo();
  var lfunc = require_lfunc();
  var lobject = require_lobject();
  var {
    MAXARG_sBx,
    POS_A,
    POS_Ax,
    POS_B,
    POS_Bx,
    POS_C,
    POS_OP,
    SIZE_A,
    SIZE_Ax,
    SIZE_B,
    SIZE_Bx,
    SIZE_C,
    SIZE_OP
  } = require_lopcodes();
  var { lua_assert } = require_llimits();
  var { luaS_bless } = require_lstring();
  var {
    luaZ_read,
    ZIO
  } = require_lzio();
  var LUAC_DATA = [25, 147, 13, 10, 26, 10];

  class BytecodeParser {
    constructor(L, Z, name) {
      this.intSize = 4;
      this.size_tSize = 4;
      this.instructionSize = 4;
      this.integerSize = 4;
      this.numberSize = 8;
      lua_assert(Z instanceof ZIO, "BytecodeParser only operates on a ZIO");
      lua_assert(is_luastring(name));
      if (name[0] === 64 || name[0] === 61)
        this.name = name.subarray(1);
      else if (name[0] == LUA_SIGNATURE[0])
        this.name = to_luastring("binary string", true);
      else
        this.name = name;
      this.L = L;
      this.Z = Z;
      this.arraybuffer = new ArrayBuffer(Math.max(this.intSize, this.size_tSize, this.instructionSize, this.integerSize, this.numberSize));
      this.dv = new DataView(this.arraybuffer);
      this.u8 = new Uint8Array(this.arraybuffer);
    }
    read(size) {
      let u8 = new Uint8Array(size);
      if (luaZ_read(this.Z, u8, 0, size) !== 0)
        this.error("truncated");
      return u8;
    }
    LoadByte() {
      if (luaZ_read(this.Z, this.u8, 0, 1) !== 0)
        this.error("truncated");
      return this.u8[0];
    }
    LoadInt() {
      if (luaZ_read(this.Z, this.u8, 0, this.intSize) !== 0)
        this.error("truncated");
      return this.dv.getInt32(0, true);
    }
    LoadNumber() {
      if (luaZ_read(this.Z, this.u8, 0, this.numberSize) !== 0)
        this.error("truncated");
      return this.dv.getFloat64(0, true);
    }
    LoadInteger() {
      if (luaZ_read(this.Z, this.u8, 0, this.integerSize) !== 0)
        this.error("truncated");
      return this.dv.getInt32(0, true);
    }
    LoadSize_t() {
      return this.LoadInteger();
    }
    LoadString() {
      let size = this.LoadByte();
      if (size === 255)
        size = this.LoadSize_t();
      if (size === 0)
        return null;
      return luaS_bless(this.L, this.read(size - 1));
    }
    static MASK1(n, p) {
      return ~(~0 << n) << p;
    }
    LoadCode(f) {
      let n = this.LoadInt();
      let p = BytecodeParser;
      for (let i = 0;i < n; i++) {
        if (luaZ_read(this.Z, this.u8, 0, this.instructionSize) !== 0)
          this.error("truncated");
        let ins = this.dv.getUint32(0, true);
        f.code[i] = {
          code: ins,
          opcode: ins >> POS_OP & p.MASK1(SIZE_OP, 0),
          A: ins >> POS_A & p.MASK1(SIZE_A, 0),
          B: ins >> POS_B & p.MASK1(SIZE_B, 0),
          C: ins >> POS_C & p.MASK1(SIZE_C, 0),
          Bx: ins >> POS_Bx & p.MASK1(SIZE_Bx, 0),
          Ax: ins >> POS_Ax & p.MASK1(SIZE_Ax, 0),
          sBx: (ins >> POS_Bx & p.MASK1(SIZE_Bx, 0)) - MAXARG_sBx
        };
      }
    }
    LoadConstants(f) {
      let n = this.LoadInt();
      for (let i = 0;i < n; i++) {
        let t = this.LoadByte();
        switch (t) {
          case LUA_TNIL:
            f.k.push(new lobject.TValue(LUA_TNIL, null));
            break;
          case LUA_TBOOLEAN:
            f.k.push(new lobject.TValue(LUA_TBOOLEAN, this.LoadByte() !== 0));
            break;
          case LUA_TNUMFLT:
            f.k.push(new lobject.TValue(LUA_TNUMFLT, this.LoadNumber()));
            break;
          case LUA_TNUMINT:
            f.k.push(new lobject.TValue(LUA_TNUMINT, this.LoadInteger()));
            break;
          case LUA_TSHRSTR:
          case LUA_TLNGSTR:
            f.k.push(new lobject.TValue(LUA_TLNGSTR, this.LoadString()));
            break;
          default:
            this.error(`unrecognized constant '${t}'`);
        }
      }
    }
    LoadProtos(f) {
      let n = this.LoadInt();
      for (let i = 0;i < n; i++) {
        f.p[i] = new lfunc.Proto(this.L);
        this.LoadFunction(f.p[i], f.source);
      }
    }
    LoadUpvalues(f) {
      let n = this.LoadInt();
      for (let i = 0;i < n; i++) {
        f.upvalues[i] = {
          name: null,
          instack: this.LoadByte(),
          idx: this.LoadByte()
        };
      }
    }
    LoadDebug(f) {
      let n = this.LoadInt();
      for (let i = 0;i < n; i++)
        f.lineinfo[i] = this.LoadInt();
      n = this.LoadInt();
      for (let i = 0;i < n; i++) {
        f.locvars[i] = {
          varname: this.LoadString(),
          startpc: this.LoadInt(),
          endpc: this.LoadInt()
        };
      }
      n = this.LoadInt();
      for (let i = 0;i < n; i++) {
        f.upvalues[i].name = this.LoadString();
      }
    }
    LoadFunction(f, psource) {
      f.source = this.LoadString();
      if (f.source === null)
        f.source = psource;
      f.linedefined = this.LoadInt();
      f.lastlinedefined = this.LoadInt();
      f.numparams = this.LoadByte();
      f.is_vararg = this.LoadByte() !== 0;
      f.maxstacksize = this.LoadByte();
      this.LoadCode(f);
      this.LoadConstants(f);
      this.LoadUpvalues(f);
      this.LoadProtos(f);
      this.LoadDebug(f);
    }
    checkliteral(s, msg) {
      let buff = this.read(s.length);
      if (!luastring_eq(buff, s))
        this.error(msg);
    }
    checkHeader() {
      this.checkliteral(LUA_SIGNATURE.subarray(1), "not a");
      if (this.LoadByte() !== 83)
        this.error("version mismatch in");
      if (this.LoadByte() !== 0)
        this.error("format mismatch in");
      this.checkliteral(LUAC_DATA, "corrupted");
      this.intSize = this.LoadByte();
      this.size_tSize = this.LoadByte();
      this.instructionSize = this.LoadByte();
      this.integerSize = this.LoadByte();
      this.numberSize = this.LoadByte();
      this.checksize(this.intSize, 4, "int");
      this.checksize(this.size_tSize, 4, "size_t");
      this.checksize(this.instructionSize, 4, "instruction");
      this.checksize(this.integerSize, 4, "integer");
      this.checksize(this.numberSize, 8, "number");
      if (this.LoadInteger() !== 22136)
        this.error("endianness mismatch in");
      if (this.LoadNumber() !== 370.5)
        this.error("float format mismatch in");
    }
    error(why) {
      lobject.luaO_pushfstring(this.L, to_luastring("%s: %s precompiled chunk"), this.name, to_luastring(why));
      ldo.luaD_throw(this.L, LUA_ERRSYNTAX);
    }
    checksize(byte, size, tname) {
      if (byte !== size)
        this.error(`${tname} size mismatch in`);
    }
  }
  var luaU_undump = function(L, Z, name) {
    let S = new BytecodeParser(L, Z, name);
    S.checkHeader();
    let cl = lfunc.luaF_newLclosure(L, S.LoadByte());
    ldo.luaD_inctop(L);
    L.stack[L.top - 1].setclLvalue(cl);
    cl.p = new lfunc.Proto(L);
    S.LoadFunction(cl.p, null);
    lua_assert(cl.nupvalues === cl.p.upvalues.length);
    return cl;
  };
  exports.luaU_undump = luaU_undump;
});

// node_modules/fengari/src/ldo.js
var require_ldo = __commonJS(function(exports, module) {
  var {
    LUA_HOOKCALL,
    LUA_HOOKRET,
    LUA_HOOKTAILCALL,
    LUA_MASKCALL,
    LUA_MASKLINE,
    LUA_MASKRET,
    LUA_MINSTACK,
    LUA_MULTRET,
    LUA_SIGNATURE,
    constant_types: {
      LUA_TCCL,
      LUA_TLCF,
      LUA_TLCL,
      LUA_TNIL
    },
    thread_status: {
      LUA_ERRMEM,
      LUA_ERRERR,
      LUA_ERRRUN,
      LUA_ERRSYNTAX,
      LUA_OK,
      LUA_YIELD
    },
    lua_Debug,
    luastring_indexOf,
    to_luastring
  } = require_defs();
  var lapi = require_lapi();
  var ldebug = require_ldebug();
  var lfunc = require_lfunc();
  var {
    api_check,
    lua_assert,
    LUAI_MAXCCALLS
  } = require_llimits();
  var lobject = require_lobject();
  var lopcodes = require_lopcodes();
  var lparser = require_lparser();
  var lstate = require_lstate();
  var { luaS_newliteral } = require_lstring();
  var ltm = require_ltm();
  var { LUAI_MAXSTACK } = require_luaconf();
  var lundump = require_lundump();
  var lvm = require_lvm();
  var { MBuffer } = require_lzio();
  var adjust_top = function(L, newtop) {
    if (L.top < newtop) {
      while (L.top < newtop)
        L.stack[L.top++] = new lobject.TValue(LUA_TNIL, null);
    } else {
      while (L.top > newtop)
        delete L.stack[--L.top];
    }
  };
  var seterrorobj = function(L, errcode, oldtop) {
    let current_top = L.top;
    while (L.top < oldtop + 1)
      L.stack[L.top++] = new lobject.TValue(LUA_TNIL, null);
    switch (errcode) {
      case LUA_ERRMEM: {
        lobject.setsvalue2s(L, oldtop, luaS_newliteral(L, "not enough memory"));
        break;
      }
      case LUA_ERRERR: {
        lobject.setsvalue2s(L, oldtop, luaS_newliteral(L, "error in error handling"));
        break;
      }
      default: {
        lobject.setobjs2s(L, oldtop, current_top - 1);
      }
    }
    while (L.top > oldtop + 1)
      delete L.stack[--L.top];
  };
  var ERRORSTACKSIZE = LUAI_MAXSTACK + 200;
  var luaD_reallocstack = function(L, newsize) {
    lua_assert(newsize <= LUAI_MAXSTACK || newsize == ERRORSTACKSIZE);
    lua_assert(L.stack_last == L.stack.length - lstate.EXTRA_STACK);
    L.stack.length = newsize;
    L.stack_last = newsize - lstate.EXTRA_STACK;
  };
  var luaD_growstack = function(L, n) {
    let size = L.stack.length;
    if (size > LUAI_MAXSTACK)
      luaD_throw(L, LUA_ERRERR);
    else {
      let needed = L.top + n + lstate.EXTRA_STACK;
      let newsize = 2 * size;
      if (newsize > LUAI_MAXSTACK)
        newsize = LUAI_MAXSTACK;
      if (newsize < needed)
        newsize = needed;
      if (newsize > LUAI_MAXSTACK) {
        luaD_reallocstack(L, ERRORSTACKSIZE);
        ldebug.luaG_runerror(L, to_luastring("stack overflow", true));
      } else
        luaD_reallocstack(L, newsize);
    }
  };
  var luaD_checkstack = function(L, n) {
    if (L.stack_last - L.top <= n)
      luaD_growstack(L, n);
  };
  var stackinuse = function(L) {
    let lim = L.top;
    for (let ci = L.ci;ci !== null; ci = ci.previous) {
      if (lim < ci.top)
        lim = ci.top;
    }
    lua_assert(lim <= L.stack_last);
    return lim + 1;
  };
  var luaD_shrinkstack = function(L) {
    let inuse = stackinuse(L);
    let goodsize = inuse + Math.floor(inuse / 8) + 2 * lstate.EXTRA_STACK;
    if (goodsize > LUAI_MAXSTACK)
      goodsize = LUAI_MAXSTACK;
    if (L.stack.length > LUAI_MAXSTACK)
      lstate.luaE_freeCI(L);
    if (inuse <= LUAI_MAXSTACK - lstate.EXTRA_STACK && goodsize < L.stack.length)
      luaD_reallocstack(L, goodsize);
  };
  var luaD_inctop = function(L) {
    luaD_checkstack(L, 1);
    L.stack[L.top++] = new lobject.TValue(LUA_TNIL, null);
  };
  var luaD_precall = function(L, off, nresults) {
    let func = L.stack[off];
    switch (func.type) {
      case LUA_TCCL:
      case LUA_TLCF: {
        let f = func.type === LUA_TCCL ? func.value.f : func.value;
        luaD_checkstack(L, LUA_MINSTACK);
        let ci = lstate.luaE_extendCI(L);
        ci.funcOff = off;
        ci.nresults = nresults;
        ci.func = func;
        ci.top = L.top + LUA_MINSTACK;
        lua_assert(ci.top <= L.stack_last);
        ci.callstatus = 0;
        if (L.hookmask & LUA_MASKCALL)
          luaD_hook(L, LUA_HOOKCALL, -1);
        let n = f(L);
        if (typeof n !== "number" || n < 0 || (n | 0) !== n)
          throw Error("invalid return value from JS function (expected integer)");
        lapi.api_checknelems(L, n);
        luaD_poscall(L, ci, L.top - n, n);
        return true;
      }
      case LUA_TLCL: {
        let base;
        let p = func.value.p;
        let n = L.top - off - 1;
        let fsize = p.maxstacksize;
        luaD_checkstack(L, fsize);
        if (p.is_vararg) {
          base = adjust_varargs(L, p, n);
        } else {
          for (;n < p.numparams; n++)
            L.stack[L.top++] = new lobject.TValue(LUA_TNIL, null);
          base = off + 1;
        }
        let ci = lstate.luaE_extendCI(L);
        ci.funcOff = off;
        ci.nresults = nresults;
        ci.func = func;
        ci.l_base = base;
        ci.top = base + fsize;
        adjust_top(L, ci.top);
        ci.l_code = p.code;
        ci.l_savedpc = 0;
        ci.callstatus = lstate.CIST_LUA;
        if (L.hookmask & LUA_MASKCALL)
          callhook(L, ci);
        return false;
      }
      default:
        luaD_checkstack(L, 1);
        tryfuncTM(L, off, func);
        return luaD_precall(L, off, nresults);
    }
  };
  var luaD_poscall = function(L, ci, firstResult, nres) {
    let wanted = ci.nresults;
    if (L.hookmask & (LUA_MASKRET | LUA_MASKLINE)) {
      if (L.hookmask & LUA_MASKRET)
        luaD_hook(L, LUA_HOOKRET, -1);
      L.oldpc = ci.previous.l_savedpc;
    }
    let res = ci.funcOff;
    L.ci = ci.previous;
    L.ci.next = null;
    return moveresults(L, firstResult, res, nres, wanted);
  };
  var moveresults = function(L, firstResult, res, nres, wanted) {
    switch (wanted) {
      case 0:
        break;
      case 1: {
        if (nres === 0)
          L.stack[res].setnilvalue();
        else {
          lobject.setobjs2s(L, res, firstResult);
        }
        break;
      }
      case LUA_MULTRET: {
        for (let i = 0;i < nres; i++)
          lobject.setobjs2s(L, res + i, firstResult + i);
        for (let i = L.top;i >= res + nres; i--)
          delete L.stack[i];
        L.top = res + nres;
        return false;
      }
      default: {
        let i;
        if (wanted <= nres) {
          for (i = 0;i < wanted; i++)
            lobject.setobjs2s(L, res + i, firstResult + i);
        } else {
          for (i = 0;i < nres; i++)
            lobject.setobjs2s(L, res + i, firstResult + i);
          for (;i < wanted; i++) {
            if (res + i >= L.top)
              L.stack[res + i] = new lobject.TValue(LUA_TNIL, null);
            else
              L.stack[res + i].setnilvalue();
          }
        }
        break;
      }
    }
    let newtop = res + wanted;
    for (let i = L.top;i >= newtop; i--)
      delete L.stack[i];
    L.top = newtop;
    return true;
  };
  var luaD_hook = function(L, event, line) {
    let hook = L.hook;
    if (hook && L.allowhook) {
      let ci = L.ci;
      let top = L.top;
      let ci_top = ci.top;
      let ar = new lua_Debug;
      ar.event = event;
      ar.currentline = line;
      ar.i_ci = ci;
      luaD_checkstack(L, LUA_MINSTACK);
      ci.top = L.top + LUA_MINSTACK;
      lua_assert(ci.top <= L.stack_last);
      L.allowhook = 0;
      ci.callstatus |= lstate.CIST_HOOKED;
      hook(L, ar);
      lua_assert(!L.allowhook);
      L.allowhook = 1;
      ci.top = ci_top;
      adjust_top(L, top);
      ci.callstatus &= ~lstate.CIST_HOOKED;
    }
  };
  var callhook = function(L, ci) {
    let hook = LUA_HOOKCALL;
    ci.l_savedpc++;
    if (ci.previous.callstatus & lstate.CIST_LUA && ci.previous.l_code[ci.previous.l_savedpc - 1].opcode == lopcodes.OpCodesI.OP_TAILCALL) {
      ci.callstatus |= lstate.CIST_TAIL;
      hook = LUA_HOOKTAILCALL;
    }
    luaD_hook(L, hook, -1);
    ci.l_savedpc--;
  };
  var adjust_varargs = function(L, p, actual) {
    let nfixargs = p.numparams;
    let fixed = L.top - actual;
    let base = L.top;
    let i;
    for (i = 0;i < nfixargs && i < actual; i++) {
      lobject.pushobj2s(L, L.stack[fixed + i]);
      L.stack[fixed + i].setnilvalue();
    }
    for (;i < nfixargs; i++)
      L.stack[L.top++] = new lobject.TValue(LUA_TNIL, null);
    return base;
  };
  var tryfuncTM = function(L, off, func) {
    let tm = ltm.luaT_gettmbyobj(L, func, ltm.TMS.TM_CALL);
    if (!tm.ttisfunction(tm))
      ldebug.luaG_typeerror(L, func, to_luastring("call", true));
    lobject.pushobj2s(L, L.stack[L.top - 1]);
    for (let p = L.top - 2;p > off; p--)
      lobject.setobjs2s(L, p, p - 1);
    lobject.setobj2s(L, off, tm);
  };
  var stackerror = function(L) {
    if (L.nCcalls === LUAI_MAXCCALLS)
      ldebug.luaG_runerror(L, to_luastring("JS stack overflow", true));
    else if (L.nCcalls >= LUAI_MAXCCALLS + (LUAI_MAXCCALLS >> 3))
      luaD_throw(L, LUA_ERRERR);
  };
  var luaD_call = function(L, off, nResults) {
    if (++L.nCcalls >= LUAI_MAXCCALLS)
      stackerror(L);
    if (!luaD_precall(L, off, nResults))
      lvm.luaV_execute(L);
    L.nCcalls--;
  };
  var luaD_throw = function(L, errcode) {
    if (L.errorJmp) {
      L.errorJmp.status = errcode;
      throw L.errorJmp;
    } else {
      let g = L.l_G;
      L.status = errcode;
      if (g.mainthread.errorJmp) {
        g.mainthread.stack[g.mainthread.top++] = L.stack[L.top - 1];
        luaD_throw(g.mainthread, errcode);
      } else {
        let panic = g.panic;
        if (panic) {
          seterrorobj(L, errcode, L.top);
          if (L.ci.top < L.top)
            L.ci.top = L.top;
          panic(L);
        }
        throw new Error(`Aborted ${errcode}`);
      }
    }
  };
  var luaD_rawrunprotected = function(L, f, ud) {
    let oldnCcalls = L.nCcalls;
    let lj = {
      status: LUA_OK,
      previous: L.errorJmp
    };
    L.errorJmp = lj;
    try {
      f(L, ud);
    } catch (e) {
      if (lj.status === LUA_OK) {
        let atnativeerror = L.l_G.atnativeerror;
        if (atnativeerror) {
          try {
            lj.status = LUA_OK;
            lapi.lua_pushcfunction(L, atnativeerror);
            lapi.lua_pushlightuserdata(L, e);
            luaD_callnoyield(L, L.top - 2, 1);
            if (L.errfunc !== 0) {
              let errfunc = L.errfunc;
              lobject.pushobj2s(L, L.stack[L.top - 1]);
              lobject.setobjs2s(L, L.top - 2, errfunc);
              luaD_callnoyield(L, L.top - 2, 1);
            }
            lj.status = LUA_ERRRUN;
          } catch (e2) {
            if (lj.status === LUA_OK) {
              lj.status = -1;
            }
          }
        } else {
          lj.status = -1;
        }
      }
    }
    L.errorJmp = lj.previous;
    L.nCcalls = oldnCcalls;
    return lj.status;
  };
  var finishCcall = function(L, status) {
    let ci = L.ci;
    lua_assert(ci.c_k !== null && L.nny === 0);
    lua_assert(ci.callstatus & lstate.CIST_YPCALL || status === LUA_YIELD);
    if (ci.callstatus & lstate.CIST_YPCALL) {
      ci.callstatus &= ~lstate.CIST_YPCALL;
      L.errfunc = ci.c_old_errfunc;
    }
    if (ci.nresults === LUA_MULTRET && L.ci.top < L.top)
      L.ci.top = L.top;
    let c_k = ci.c_k;
    let n = c_k(L, status, ci.c_ctx);
    lapi.api_checknelems(L, n);
    luaD_poscall(L, ci, L.top - n, n);
  };
  var unroll = function(L, ud) {
    if (ud !== null)
      finishCcall(L, ud);
    while (L.ci !== L.base_ci) {
      if (!(L.ci.callstatus & lstate.CIST_LUA))
        finishCcall(L, LUA_YIELD);
      else {
        lvm.luaV_finishOp(L);
        lvm.luaV_execute(L);
      }
    }
  };
  var findpcall = function(L) {
    for (let ci = L.ci;ci !== null; ci = ci.previous) {
      if (ci.callstatus & lstate.CIST_YPCALL)
        return ci;
    }
    return null;
  };
  var recover = function(L, status) {
    let ci = findpcall(L);
    if (ci === null)
      return 0;
    let oldtop = ci.extra;
    lfunc.luaF_close(L, oldtop);
    seterrorobj(L, status, oldtop);
    L.ci = ci;
    L.allowhook = ci.callstatus & lstate.CIST_OAH;
    L.nny = 0;
    luaD_shrinkstack(L);
    L.errfunc = ci.c_old_errfunc;
    return 1;
  };
  var resume_error = function(L, msg, narg) {
    let ts = luaS_newliteral(L, msg);
    if (narg === 0) {
      lobject.pushsvalue2s(L, ts);
      api_check(L, L.top <= L.ci.top, "stack overflow");
    } else {
      for (let i = 1;i < narg; i++)
        delete L.stack[--L.top];
      lobject.setsvalue2s(L, L.top - 1, ts);
    }
    return LUA_ERRRUN;
  };
  var resume = function(L, n) {
    let firstArg = L.top - n;
    let ci = L.ci;
    if (L.status === LUA_OK) {
      if (!luaD_precall(L, firstArg - 1, LUA_MULTRET))
        lvm.luaV_execute(L);
    } else {
      lua_assert(L.status === LUA_YIELD);
      L.status = LUA_OK;
      ci.funcOff = ci.extra;
      ci.func = L.stack[ci.funcOff];
      if (ci.callstatus & lstate.CIST_LUA)
        lvm.luaV_execute(L);
      else {
        if (ci.c_k !== null) {
          n = ci.c_k(L, LUA_YIELD, ci.c_ctx);
          lapi.api_checknelems(L, n);
          firstArg = L.top - n;
        }
        luaD_poscall(L, ci, firstArg, n);
      }
      unroll(L, null);
    }
  };
  var lua_resume = function(L, from, nargs) {
    let oldnny = L.nny;
    if (L.status === LUA_OK) {
      if (L.ci !== L.base_ci)
        return resume_error(L, "cannot resume non-suspended coroutine", nargs);
    } else if (L.status !== LUA_YIELD)
      return resume_error(L, "cannot resume dead coroutine", nargs);
    L.nCcalls = from ? from.nCcalls + 1 : 1;
    if (L.nCcalls >= LUAI_MAXCCALLS)
      return resume_error(L, "JS stack overflow", nargs);
    L.nny = 0;
    lapi.api_checknelems(L, L.status === LUA_OK ? nargs + 1 : nargs);
    let status = luaD_rawrunprotected(L, resume, nargs);
    if (status === -1)
      status = LUA_ERRRUN;
    else {
      while (status > LUA_YIELD && recover(L, status)) {
        status = luaD_rawrunprotected(L, unroll, status);
      }
      if (status > LUA_YIELD) {
        L.status = status;
        seterrorobj(L, status, L.top);
        L.ci.top = L.top;
      } else
        lua_assert(status === L.status);
    }
    L.nny = oldnny;
    L.nCcalls--;
    lua_assert(L.nCcalls === (from ? from.nCcalls : 0));
    return status;
  };
  var lua_isyieldable = function(L) {
    return L.nny === 0;
  };
  var lua_yieldk = function(L, nresults, ctx, k) {
    let ci = L.ci;
    lapi.api_checknelems(L, nresults);
    if (L.nny > 0) {
      if (L !== L.l_G.mainthread)
        ldebug.luaG_runerror(L, to_luastring("attempt to yield across a JS-call boundary", true));
      else
        ldebug.luaG_runerror(L, to_luastring("attempt to yield from outside a coroutine", true));
    }
    L.status = LUA_YIELD;
    ci.extra = ci.funcOff;
    if (ci.callstatus & lstate.CIST_LUA)
      api_check(L, k === null, "hooks cannot continue after yielding");
    else {
      ci.c_k = k;
      if (k !== null)
        ci.c_ctx = ctx;
      ci.funcOff = L.top - nresults - 1;
      ci.func = L.stack[ci.funcOff];
      luaD_throw(L, LUA_YIELD);
    }
    lua_assert(ci.callstatus & lstate.CIST_HOOKED);
    return 0;
  };
  var lua_yield = function(L, n) {
    lua_yieldk(L, n, 0, null);
  };
  var luaD_pcall = function(L, func, u, old_top, ef) {
    let old_ci = L.ci;
    let old_allowhooks = L.allowhook;
    let old_nny = L.nny;
    let old_errfunc = L.errfunc;
    L.errfunc = ef;
    let status = luaD_rawrunprotected(L, func, u);
    if (status !== LUA_OK) {
      lfunc.luaF_close(L, old_top);
      seterrorobj(L, status, old_top);
      L.ci = old_ci;
      L.allowhook = old_allowhooks;
      L.nny = old_nny;
      luaD_shrinkstack(L);
    }
    L.errfunc = old_errfunc;
    return status;
  };
  var luaD_callnoyield = function(L, off, nResults) {
    L.nny++;
    luaD_call(L, off, nResults);
    L.nny--;
  };

  class SParser {
    constructor(z, name, mode) {
      this.z = z;
      this.buff = new MBuffer;
      this.dyd = new lparser.Dyndata;
      this.mode = mode;
      this.name = name;
    }
  }
  var checkmode = function(L, mode, x) {
    if (mode && luastring_indexOf(mode, x[0]) === -1) {
      lobject.luaO_pushfstring(L, to_luastring("attempt to load a %s chunk (mode is '%s')"), x, mode);
      luaD_throw(L, LUA_ERRSYNTAX);
    }
  };
  var f_parser = function(L, p) {
    let cl;
    let c = p.z.zgetc();
    if (c === LUA_SIGNATURE[0]) {
      checkmode(L, p.mode, to_luastring("binary", true));
      cl = lundump.luaU_undump(L, p.z, p.name);
    } else {
      checkmode(L, p.mode, to_luastring("text", true));
      cl = lparser.luaY_parser(L, p.z, p.buff, p.dyd, p.name, c);
    }
    lua_assert(cl.nupvalues === cl.p.upvalues.length);
    lfunc.luaF_initupvals(L, cl);
  };
  var luaD_protectedparser = function(L, z, name, mode) {
    let p = new SParser(z, name, mode);
    L.nny++;
    let status = luaD_pcall(L, f_parser, p, L.top, L.errfunc);
    L.nny--;
    return status;
  };
  exports.adjust_top = adjust_top;
  exports.luaD_call = luaD_call;
  exports.luaD_callnoyield = luaD_callnoyield;
  exports.luaD_checkstack = luaD_checkstack;
  exports.luaD_growstack = luaD_growstack;
  exports.luaD_hook = luaD_hook;
  exports.luaD_inctop = luaD_inctop;
  exports.luaD_pcall = luaD_pcall;
  exports.luaD_poscall = luaD_poscall;
  exports.luaD_precall = luaD_precall;
  exports.luaD_protectedparser = luaD_protectedparser;
  exports.luaD_rawrunprotected = luaD_rawrunprotected;
  exports.luaD_reallocstack = luaD_reallocstack;
  exports.luaD_throw = luaD_throw;
  exports.lua_isyieldable = lua_isyieldable;
  exports.lua_resume = lua_resume;
  exports.lua_yield = lua_yield;
  exports.lua_yieldk = lua_yieldk;
});

// node_modules/fengari/src/ldebug.js
var require_ldebug = __commonJS(function(exports, module) {
  var {
    LUA_HOOKCOUNT,
    LUA_HOOKLINE,
    LUA_MASKCOUNT,
    LUA_MASKLINE,
    constant_types: {
      LUA_TBOOLEAN,
      LUA_TNIL,
      LUA_TTABLE
    },
    thread_status: {
      LUA_ERRRUN,
      LUA_YIELD
    },
    from_userstring,
    luastring_eq,
    luastring_indexOf,
    to_luastring
  } = require_defs();
  var {
    api_check,
    lua_assert
  } = require_llimits();
  var { LUA_IDSIZE } = require_luaconf();
  var lapi = require_lapi();
  var ldo = require_ldo();
  var lfunc = require_lfunc();
  var llex = require_llex();
  var lobject = require_lobject();
  var lopcodes = require_lopcodes();
  var lstate = require_lstate();
  var ltable = require_ltable();
  var ltm = require_ltm();
  var lvm = require_lvm();
  var currentpc = function(ci) {
    lua_assert(ci.callstatus & lstate.CIST_LUA);
    return ci.l_savedpc - 1;
  };
  var currentline = function(ci) {
    return ci.func.value.p.lineinfo.length !== 0 ? ci.func.value.p.lineinfo[currentpc(ci)] : -1;
  };
  var swapextra = function(L) {
    if (L.status === LUA_YIELD) {
      let ci = L.ci;
      let temp = ci.funcOff;
      ci.func = L.stack[ci.extra];
      ci.funcOff = ci.extra;
      ci.extra = temp;
    }
  };
  var lua_sethook = function(L, func, mask, count) {
    if (func === null || mask === 0) {
      mask = 0;
      func = null;
    }
    if (L.ci.callstatus & lstate.CIST_LUA)
      L.oldpc = L.ci.l_savedpc;
    L.hook = func;
    L.basehookcount = count;
    L.hookcount = L.basehookcount;
    L.hookmask = mask;
  };
  var lua_gethook = function(L) {
    return L.hook;
  };
  var lua_gethookmask = function(L) {
    return L.hookmask;
  };
  var lua_gethookcount = function(L) {
    return L.basehookcount;
  };
  var lua_getstack = function(L, level, ar) {
    let ci;
    let status;
    if (level < 0)
      return 0;
    for (ci = L.ci;level > 0 && ci !== L.base_ci; ci = ci.previous)
      level--;
    if (level === 0 && ci !== L.base_ci) {
      status = 1;
      ar.i_ci = ci;
    } else
      status = 0;
    return status;
  };
  var upvalname = function(p, uv) {
    lua_assert(uv < p.upvalues.length);
    let s = p.upvalues[uv].name;
    if (s === null)
      return to_luastring("?", true);
    return s.getstr();
  };
  var findvararg = function(ci, n) {
    let nparams = ci.func.value.p.numparams;
    if (n >= ci.l_base - ci.funcOff - nparams)
      return null;
    else {
      return {
        pos: ci.funcOff + nparams + n,
        name: to_luastring("(*vararg)", true)
      };
    }
  };
  var findlocal = function(L, ci, n) {
    let base, name = null;
    if (ci.callstatus & lstate.CIST_LUA) {
      if (n < 0)
        return findvararg(ci, -n);
      else {
        base = ci.l_base;
        name = lfunc.luaF_getlocalname(ci.func.value.p, n, currentpc(ci));
      }
    } else
      base = ci.funcOff + 1;
    if (name === null) {
      let limit = ci === L.ci ? L.top : ci.next.funcOff;
      if (limit - base >= n && n > 0)
        name = to_luastring("(*temporary)", true);
      else
        return null;
    }
    return {
      pos: base + (n - 1),
      name
    };
  };
  var lua_getlocal = function(L, ar, n) {
    let name;
    swapextra(L);
    if (ar === null) {
      if (!L.stack[L.top - 1].ttisLclosure())
        name = null;
      else
        name = lfunc.luaF_getlocalname(L.stack[L.top - 1].value.p, n, 0);
    } else {
      let local = findlocal(L, ar.i_ci, n);
      if (local) {
        name = local.name;
        lobject.pushobj2s(L, L.stack[local.pos]);
        api_check(L, L.top <= L.ci.top, "stack overflow");
      } else {
        name = null;
      }
    }
    swapextra(L);
    return name;
  };
  var lua_setlocal = function(L, ar, n) {
    let name;
    swapextra(L);
    let local = findlocal(L, ar.i_ci, n);
    if (local) {
      name = local.name;
      lobject.setobjs2s(L, local.pos, L.top - 1);
      delete L.stack[--L.top];
    } else {
      name = null;
    }
    swapextra(L);
    return name;
  };
  var funcinfo = function(ar, cl) {
    if (cl === null || cl instanceof lobject.CClosure) {
      ar.source = to_luastring("=[JS]", true);
      ar.linedefined = -1;
      ar.lastlinedefined = -1;
      ar.what = to_luastring("J", true);
    } else {
      let p = cl.p;
      ar.source = p.source ? p.source.getstr() : to_luastring("=?", true);
      ar.linedefined = p.linedefined;
      ar.lastlinedefined = p.lastlinedefined;
      ar.what = ar.linedefined === 0 ? to_luastring("main", true) : to_luastring("Lua", true);
    }
    ar.short_src = lobject.luaO_chunkid(ar.source, LUA_IDSIZE);
  };
  var collectvalidlines = function(L, f) {
    if (f === null || f instanceof lobject.CClosure) {
      L.stack[L.top] = new lobject.TValue(LUA_TNIL, null);
      lapi.api_incr_top(L);
    } else {
      let lineinfo = f.p.lineinfo;
      let t = ltable.luaH_new(L);
      L.stack[L.top] = new lobject.TValue(LUA_TTABLE, t);
      lapi.api_incr_top(L);
      let v = new lobject.TValue(LUA_TBOOLEAN, true);
      for (let i = 0;i < lineinfo.length; i++)
        ltable.luaH_setint(t, lineinfo[i], v);
    }
  };
  var getfuncname = function(L, ci) {
    let r = {
      name: null,
      funcname: null
    };
    if (ci === null)
      return null;
    else if (ci.callstatus & lstate.CIST_FIN) {
      r.name = to_luastring("__gc", true);
      r.funcname = to_luastring("metamethod", true);
      return r;
    } else if (!(ci.callstatus & lstate.CIST_TAIL) && ci.previous.callstatus & lstate.CIST_LUA)
      return funcnamefromcode(L, ci.previous);
    else
      return null;
  };
  var auxgetinfo = function(L, what, ar, f, ci) {
    let status = 1;
    for (;what.length > 0; what = what.subarray(1)) {
      switch (what[0]) {
        case 83: {
          funcinfo(ar, f);
          break;
        }
        case 108: {
          ar.currentline = ci && ci.callstatus & lstate.CIST_LUA ? currentline(ci) : -1;
          break;
        }
        case 117: {
          ar.nups = f === null ? 0 : f.nupvalues;
          if (f === null || f instanceof lobject.CClosure) {
            ar.isvararg = true;
            ar.nparams = 0;
          } else {
            ar.isvararg = f.p.is_vararg;
            ar.nparams = f.p.numparams;
          }
          break;
        }
        case 116: {
          ar.istailcall = ci ? ci.callstatus & lstate.CIST_TAIL : 0;
          break;
        }
        case 110: {
          let r = getfuncname(L, ci);
          if (r === null) {
            ar.namewhat = to_luastring("", true);
            ar.name = null;
          } else {
            ar.namewhat = r.funcname;
            ar.name = r.name;
          }
          break;
        }
        case 76:
        case 102:
          break;
        default:
          status = 0;
      }
    }
    return status;
  };
  var lua_getinfo = function(L, what, ar) {
    what = from_userstring(what);
    let status, cl, ci, func;
    swapextra(L);
    if (what[0] === 62) {
      ci = null;
      func = L.stack[L.top - 1];
      api_check(L, func.ttisfunction(), "function expected");
      what = what.subarray(1);
      L.top--;
    } else {
      ci = ar.i_ci;
      func = ci.func;
      lua_assert(ci.func.ttisfunction());
    }
    cl = func.ttisclosure() ? func.value : null;
    status = auxgetinfo(L, what, ar, cl, ci);
    if (luastring_indexOf(what, 102) >= 0) {
      lobject.pushobj2s(L, func);
      api_check(L, L.top <= L.ci.top, "stack overflow");
    }
    swapextra(L);
    if (luastring_indexOf(what, 76) >= 0)
      collectvalidlines(L, cl);
    return status;
  };
  var kname = function(p, pc, c) {
    let r = {
      name: null,
      funcname: null
    };
    if (lopcodes.ISK(c)) {
      let kvalue = p.k[lopcodes.INDEXK(c)];
      if (kvalue.ttisstring()) {
        r.name = kvalue.svalue();
        return r;
      }
    } else {
      let what = getobjname(p, pc, c);
      if (what && what.funcname[0] === 99) {
        return what;
      }
    }
    r.name = to_luastring("?", true);
    return r;
  };
  var filterpc = function(pc, jmptarget) {
    if (pc < jmptarget)
      return -1;
    else
      return pc;
  };
  var findsetreg = function(p, lastpc, reg) {
    let setreg = -1;
    let jmptarget = 0;
    let OCi = lopcodes.OpCodesI;
    for (let pc = 0;pc < lastpc; pc++) {
      let i = p.code[pc];
      let a = i.A;
      switch (i.opcode) {
        case OCi.OP_LOADNIL: {
          let b = i.B;
          if (a <= reg && reg <= a + b)
            setreg = filterpc(pc, jmptarget);
          break;
        }
        case OCi.OP_TFORCALL: {
          if (reg >= a + 2)
            setreg = filterpc(pc, jmptarget);
          break;
        }
        case OCi.OP_CALL:
        case OCi.OP_TAILCALL: {
          if (reg >= a)
            setreg = filterpc(pc, jmptarget);
          break;
        }
        case OCi.OP_JMP: {
          let b = i.sBx;
          let dest = pc + 1 + b;
          if (pc < dest && dest <= lastpc) {
            if (dest > jmptarget)
              jmptarget = dest;
          }
          break;
        }
        default:
          if (lopcodes.testAMode(i.opcode) && reg === a)
            setreg = filterpc(pc, jmptarget);
          break;
      }
    }
    return setreg;
  };
  var getobjname = function(p, lastpc, reg) {
    let r = {
      name: lfunc.luaF_getlocalname(p, reg + 1, lastpc),
      funcname: null
    };
    if (r.name) {
      r.funcname = to_luastring("local", true);
      return r;
    }
    let pc = findsetreg(p, lastpc, reg);
    let OCi = lopcodes.OpCodesI;
    if (pc !== -1) {
      let i = p.code[pc];
      switch (i.opcode) {
        case OCi.OP_MOVE: {
          let b = i.B;
          if (b < i.A)
            return getobjname(p, pc, b);
          break;
        }
        case OCi.OP_GETTABUP:
        case OCi.OP_GETTABLE: {
          let k = i.C;
          let t = i.B;
          let vn = i.opcode === OCi.OP_GETTABLE ? lfunc.luaF_getlocalname(p, t + 1, pc) : upvalname(p, t);
          r.name = kname(p, pc, k).name;
          r.funcname = vn && luastring_eq(vn, llex.LUA_ENV) ? to_luastring("global", true) : to_luastring("field", true);
          return r;
        }
        case OCi.OP_GETUPVAL: {
          r.name = upvalname(p, i.B);
          r.funcname = to_luastring("upvalue", true);
          return r;
        }
        case OCi.OP_LOADK:
        case OCi.OP_LOADKX: {
          let b = i.opcode === OCi.OP_LOADK ? i.Bx : p.code[pc + 1].Ax;
          if (p.k[b].ttisstring()) {
            r.name = p.k[b].svalue();
            r.funcname = to_luastring("constant", true);
            return r;
          }
          break;
        }
        case OCi.OP_SELF: {
          let k = i.C;
          r.name = kname(p, pc, k).name;
          r.funcname = to_luastring("method", true);
          return r;
        }
        default:
          break;
      }
    }
    return null;
  };
  var funcnamefromcode = function(L, ci) {
    let r = {
      name: null,
      funcname: null
    };
    let tm = 0;
    let p = ci.func.value.p;
    let pc = currentpc(ci);
    let i = p.code[pc];
    let OCi = lopcodes.OpCodesI;
    if (ci.callstatus & lstate.CIST_HOOKED) {
      r.name = to_luastring("?", true);
      r.funcname = to_luastring("hook", true);
      return r;
    }
    switch (i.opcode) {
      case OCi.OP_CALL:
      case OCi.OP_TAILCALL:
        return getobjname(p, pc, i.A);
      case OCi.OP_TFORCALL:
        r.name = to_luastring("for iterator", true);
        r.funcname = to_luastring("for iterator", true);
        return r;
      case OCi.OP_SELF:
      case OCi.OP_GETTABUP:
      case OCi.OP_GETTABLE:
        tm = ltm.TMS.TM_INDEX;
        break;
      case OCi.OP_SETTABUP:
      case OCi.OP_SETTABLE:
        tm = ltm.TMS.TM_NEWINDEX;
        break;
      case OCi.OP_ADD:
        tm = ltm.TMS.TM_ADD;
        break;
      case OCi.OP_SUB:
        tm = ltm.TMS.TM_SUB;
        break;
      case OCi.OP_MUL:
        tm = ltm.TMS.TM_MUL;
        break;
      case OCi.OP_MOD:
        tm = ltm.TMS.TM_MOD;
        break;
      case OCi.OP_POW:
        tm = ltm.TMS.TM_POW;
        break;
      case OCi.OP_DIV:
        tm = ltm.TMS.TM_DIV;
        break;
      case OCi.OP_IDIV:
        tm = ltm.TMS.TM_IDIV;
        break;
      case OCi.OP_BAND:
        tm = ltm.TMS.TM_BAND;
        break;
      case OCi.OP_BOR:
        tm = ltm.TMS.TM_BOR;
        break;
      case OCi.OP_BXOR:
        tm = ltm.TMS.TM_BXOR;
        break;
      case OCi.OP_SHL:
        tm = ltm.TMS.TM_SHL;
        break;
      case OCi.OP_SHR:
        tm = ltm.TMS.TM_SHR;
        break;
      case OCi.OP_UNM:
        tm = ltm.TMS.TM_UNM;
        break;
      case OCi.OP_BNOT:
        tm = ltm.TMS.TM_BNOT;
        break;
      case OCi.OP_LEN:
        tm = ltm.TMS.TM_LEN;
        break;
      case OCi.OP_CONCAT:
        tm = ltm.TMS.TM_CONCAT;
        break;
      case OCi.OP_EQ:
        tm = ltm.TMS.TM_EQ;
        break;
      case OCi.OP_LT:
        tm = ltm.TMS.TM_LT;
        break;
      case OCi.OP_LE:
        tm = ltm.TMS.TM_LE;
        break;
      default:
        return null;
    }
    r.name = L.l_G.tmname[tm].getstr();
    r.funcname = to_luastring("metamethod", true);
    return r;
  };
  var isinstack = function(L, ci, o) {
    for (let i = ci.l_base;i < ci.top; i++) {
      if (L.stack[i] === o)
        return i;
    }
    return false;
  };
  var getupvalname = function(L, ci, o) {
    let c = ci.func.value;
    for (let i = 0;i < c.nupvalues; i++) {
      if (c.upvals[i] === o) {
        return {
          name: upvalname(c.p, i),
          funcname: to_luastring("upvalue", true)
        };
      }
    }
    return null;
  };
  var varinfo = function(L, o) {
    let ci = L.ci;
    let kind = null;
    if (ci.callstatus & lstate.CIST_LUA) {
      kind = getupvalname(L, ci, o);
      let stkid = isinstack(L, ci, o);
      if (!kind && stkid)
        kind = getobjname(ci.func.value.p, currentpc(ci), stkid - ci.l_base);
    }
    return kind ? lobject.luaO_pushfstring(L, to_luastring(" (%s '%s')", true), kind.funcname, kind.name) : to_luastring("", true);
  };
  var luaG_typeerror = function(L, o, op) {
    let t = ltm.luaT_objtypename(L, o);
    luaG_runerror(L, to_luastring("attempt to %s a %s value%s", true), op, t, varinfo(L, o));
  };
  var luaG_concaterror = function(L, p1, p2) {
    if (p1.ttisstring() || lvm.cvt2str(p1))
      p1 = p2;
    luaG_typeerror(L, p1, to_luastring("concatenate", true));
  };
  var luaG_opinterror = function(L, p1, p2, msg) {
    if (lvm.tonumber(p1) === false)
      p2 = p1;
    luaG_typeerror(L, p2, msg);
  };
  var luaG_ordererror = function(L, p1, p2) {
    let t1 = ltm.luaT_objtypename(L, p1);
    let t2 = ltm.luaT_objtypename(L, p2);
    if (luastring_eq(t1, t2))
      luaG_runerror(L, to_luastring("attempt to compare two %s values", true), t1);
    else
      luaG_runerror(L, to_luastring("attempt to compare %s with %s", true), t1, t2);
  };
  var luaG_addinfo = function(L, msg, src, line) {
    let buff;
    if (src)
      buff = lobject.luaO_chunkid(src.getstr(), LUA_IDSIZE);
    else
      buff = to_luastring("?", true);
    return lobject.luaO_pushfstring(L, to_luastring("%s:%d: %s", true), buff, line, msg);
  };
  var luaG_runerror = function(L, fmt, ...argp) {
    let ci = L.ci;
    let msg = lobject.luaO_pushvfstring(L, fmt, argp);
    if (ci.callstatus & lstate.CIST_LUA)
      luaG_addinfo(L, msg, ci.func.value.p.source, currentline(ci));
    luaG_errormsg(L);
  };
  var luaG_errormsg = function(L) {
    if (L.errfunc !== 0) {
      let errfunc = L.errfunc;
      lobject.pushobj2s(L, L.stack[L.top - 1]);
      lobject.setobjs2s(L, L.top - 2, errfunc);
      ldo.luaD_callnoyield(L, L.top - 2, 1);
    }
    ldo.luaD_throw(L, LUA_ERRRUN);
  };
  var luaG_tointerror = function(L, p1, p2) {
    let temp = lvm.tointeger(p1);
    if (temp === false)
      p2 = p1;
    luaG_runerror(L, to_luastring("number%s has no integer representation", true), varinfo(L, p2));
  };
  var luaG_traceexec = function(L) {
    let ci = L.ci;
    let mask = L.hookmask;
    let counthook = --L.hookcount === 0 && mask & LUA_MASKCOUNT;
    if (counthook)
      L.hookcount = L.basehookcount;
    else if (!(mask & LUA_MASKLINE))
      return;
    if (ci.callstatus & lstate.CIST_HOOKYIELD) {
      ci.callstatus &= ~lstate.CIST_HOOKYIELD;
      return;
    }
    if (counthook)
      ldo.luaD_hook(L, LUA_HOOKCOUNT, -1);
    if (mask & LUA_MASKLINE) {
      let p = ci.func.value.p;
      let npc = ci.l_savedpc - 1;
      let newline = p.lineinfo.length !== 0 ? p.lineinfo[npc] : -1;
      if (npc === 0 || ci.l_savedpc <= L.oldpc || newline !== (p.lineinfo.length !== 0 ? p.lineinfo[L.oldpc - 1] : -1))
        ldo.luaD_hook(L, LUA_HOOKLINE, newline);
    }
    L.oldpc = ci.l_savedpc;
    if (L.status === LUA_YIELD) {
      if (counthook)
        L.hookcount = 1;
      ci.l_savedpc--;
      ci.callstatus |= lstate.CIST_HOOKYIELD;
      ci.funcOff = L.top - 1;
      ci.func = L.stack[ci.funcOff];
      ldo.luaD_throw(L, LUA_YIELD);
    }
  };
  exports.luaG_addinfo = luaG_addinfo;
  exports.luaG_concaterror = luaG_concaterror;
  exports.luaG_errormsg = luaG_errormsg;
  exports.luaG_opinterror = luaG_opinterror;
  exports.luaG_ordererror = luaG_ordererror;
  exports.luaG_runerror = luaG_runerror;
  exports.luaG_tointerror = luaG_tointerror;
  exports.luaG_traceexec = luaG_traceexec;
  exports.luaG_typeerror = luaG_typeerror;
  exports.lua_gethook = lua_gethook;
  exports.lua_gethookcount = lua_gethookcount;
  exports.lua_gethookmask = lua_gethookmask;
  exports.lua_getinfo = lua_getinfo;
  exports.lua_getlocal = lua_getlocal;
  exports.lua_getstack = lua_getstack;
  exports.lua_sethook = lua_sethook;
  exports.lua_setlocal = lua_setlocal;
});

// node_modules/fengari/src/ldump.js
var require_ldump = __commonJS(function(exports, module) {
  var {
    LUA_SIGNATURE,
    LUA_VERSION_MAJOR,
    LUA_VERSION_MINOR,
    constant_types: {
      LUA_TBOOLEAN,
      LUA_TLNGSTR,
      LUA_TNIL,
      LUA_TNUMFLT,
      LUA_TNUMINT,
      LUA_TSHRSTR
    },
    luastring_of
  } = require_defs();
  var LUAC_DATA = luastring_of(25, 147, 13, 10, 26, 10);
  var LUAC_INT = 22136;
  var LUAC_NUM = 370.5;
  var LUAC_VERSION = Number(LUA_VERSION_MAJOR) * 16 + Number(LUA_VERSION_MINOR);
  var LUAC_FORMAT = 0;

  class DumpState {
    constructor() {
      this.L = null;
      this.write = null;
      this.data = null;
      this.strip = NaN;
      this.status = NaN;
    }
  }
  var DumpBlock = function(b, size, D) {
    if (D.status === 0 && size > 0)
      D.status = D.writer(D.L, b, size, D.data);
  };
  var DumpByte = function(y, D) {
    DumpBlock(luastring_of(y), 1, D);
  };
  var DumpInt = function(x, D) {
    let ab = new ArrayBuffer(4);
    let dv = new DataView(ab);
    dv.setInt32(0, x, true);
    let t = new Uint8Array(ab);
    DumpBlock(t, 4, D);
  };
  var DumpInteger = function(x, D) {
    let ab = new ArrayBuffer(4);
    let dv = new DataView(ab);
    dv.setInt32(0, x, true);
    let t = new Uint8Array(ab);
    DumpBlock(t, 4, D);
  };
  var DumpNumber = function(x, D) {
    let ab = new ArrayBuffer(8);
    let dv = new DataView(ab);
    dv.setFloat64(0, x, true);
    let t = new Uint8Array(ab);
    DumpBlock(t, 8, D);
  };
  var DumpString = function(s, D) {
    if (s === null)
      DumpByte(0, D);
    else {
      let size = s.tsslen() + 1;
      let str = s.getstr();
      if (size < 255)
        DumpByte(size, D);
      else {
        DumpByte(255, D);
        DumpInteger(size, D);
      }
      DumpBlock(str, size - 1, D);
    }
  };
  var DumpCode = function(f, D) {
    let s = f.code.map((e) => e.code);
    DumpInt(s.length, D);
    for (let i = 0;i < s.length; i++)
      DumpInt(s[i], D);
  };
  var DumpConstants = function(f, D) {
    let n = f.k.length;
    DumpInt(n, D);
    for (let i = 0;i < n; i++) {
      let o = f.k[i];
      DumpByte(o.ttype(), D);
      switch (o.ttype()) {
        case LUA_TNIL:
          break;
        case LUA_TBOOLEAN:
          DumpByte(o.value ? 1 : 0, D);
          break;
        case LUA_TNUMFLT:
          DumpNumber(o.value, D);
          break;
        case LUA_TNUMINT:
          DumpInteger(o.value, D);
          break;
        case LUA_TSHRSTR:
        case LUA_TLNGSTR:
          DumpString(o.tsvalue(), D);
          break;
      }
    }
  };
  var DumpProtos = function(f, D) {
    let n = f.p.length;
    DumpInt(n, D);
    for (let i = 0;i < n; i++)
      DumpFunction(f.p[i], f.source, D);
  };
  var DumpUpvalues = function(f, D) {
    let n = f.upvalues.length;
    DumpInt(n, D);
    for (let i = 0;i < n; i++) {
      DumpByte(f.upvalues[i].instack ? 1 : 0, D);
      DumpByte(f.upvalues[i].idx, D);
    }
  };
  var DumpDebug = function(f, D) {
    let n = D.strip ? 0 : f.lineinfo.length;
    DumpInt(n, D);
    for (let i = 0;i < n; i++)
      DumpInt(f.lineinfo[i], D);
    n = D.strip ? 0 : f.locvars.length;
    DumpInt(n, D);
    for (let i = 0;i < n; i++) {
      DumpString(f.locvars[i].varname, D);
      DumpInt(f.locvars[i].startpc, D);
      DumpInt(f.locvars[i].endpc, D);
    }
    n = D.strip ? 0 : f.upvalues.length;
    DumpInt(n, D);
    for (let i = 0;i < n; i++)
      DumpString(f.upvalues[i].name, D);
  };
  var DumpFunction = function(f, psource, D) {
    if (D.strip || f.source === psource)
      DumpString(null, D);
    else
      DumpString(f.source, D);
    DumpInt(f.linedefined, D);
    DumpInt(f.lastlinedefined, D);
    DumpByte(f.numparams, D);
    DumpByte(f.is_vararg ? 1 : 0, D);
    DumpByte(f.maxstacksize, D);
    DumpCode(f, D);
    DumpConstants(f, D);
    DumpUpvalues(f, D);
    DumpProtos(f, D);
    DumpDebug(f, D);
  };
  var DumpHeader = function(D) {
    DumpBlock(LUA_SIGNATURE, LUA_SIGNATURE.length, D);
    DumpByte(LUAC_VERSION, D);
    DumpByte(LUAC_FORMAT, D);
    DumpBlock(LUAC_DATA, LUAC_DATA.length, D);
    DumpByte(4, D);
    DumpByte(4, D);
    DumpByte(4, D);
    DumpByte(4, D);
    DumpByte(8, D);
    DumpInteger(LUAC_INT, D);
    DumpNumber(LUAC_NUM, D);
  };
  var luaU_dump = function(L, f, w, data, strip) {
    let D = new DumpState;
    D.L = L;
    D.writer = w;
    D.data = data;
    D.strip = strip;
    D.status = 0;
    DumpHeader(D);
    DumpByte(f.upvalues.length, D);
    DumpFunction(f, null, D);
    return D.status;
  };
  exports.luaU_dump = luaU_dump;
});

// node_modules/fengari/src/lapi.js
var require_lapi = __commonJS(function(exports, module) {
  var {
    LUA_MULTRET,
    LUA_OPBNOT,
    LUA_OPEQ,
    LUA_OPLE,
    LUA_OPLT,
    LUA_OPUNM,
    LUA_REGISTRYINDEX,
    LUA_RIDX_GLOBALS,
    LUA_VERSION_NUM,
    constant_types: {
      LUA_NUMTAGS,
      LUA_TBOOLEAN,
      LUA_TCCL,
      LUA_TFUNCTION,
      LUA_TLCF,
      LUA_TLCL,
      LUA_TLIGHTUSERDATA,
      LUA_TLNGSTR,
      LUA_TNIL,
      LUA_TNONE,
      LUA_TNUMFLT,
      LUA_TNUMINT,
      LUA_TSHRSTR,
      LUA_TTABLE,
      LUA_TTHREAD,
      LUA_TUSERDATA
    },
    thread_status: { LUA_OK },
    from_userstring,
    to_luastring
  } = require_defs();
  var { api_check } = require_llimits();
  var ldebug = require_ldebug();
  var ldo = require_ldo();
  var { luaU_dump } = require_ldump();
  var lfunc = require_lfunc();
  var lobject = require_lobject();
  var lstate = require_lstate();
  var {
    luaS_bless,
    luaS_new,
    luaS_newliteral
  } = require_lstring();
  var ltm = require_ltm();
  var { LUAI_MAXSTACK } = require_luaconf();
  var lvm = require_lvm();
  var ltable = require_ltable();
  var { ZIO } = require_lzio();
  var TValue = lobject.TValue;
  var CClosure = lobject.CClosure;
  var api_incr_top = function(L) {
    L.top++;
    api_check(L, L.top <= L.ci.top, "stack overflow");
  };
  var api_checknelems = function(L, n) {
    api_check(L, n < L.top - L.ci.funcOff, "not enough elements in the stack");
  };
  var fengari_argcheck = function(c) {
    if (!c)
      throw TypeError("invalid argument");
  };
  var fengari_argcheckinteger = function(n) {
    fengari_argcheck(typeof n === "number" && (n | 0) === n);
  };
  var isvalid = function(o) {
    return o !== lobject.luaO_nilobject;
  };
  var lua_version = function(L) {
    if (L === null)
      return LUA_VERSION_NUM;
    else
      return L.l_G.version;
  };
  var lua_atpanic = function(L, panicf) {
    let old = L.l_G.panic;
    L.l_G.panic = panicf;
    return old;
  };
  var lua_atnativeerror = function(L, errorf) {
    let old = L.l_G.atnativeerror;
    L.l_G.atnativeerror = errorf;
    return old;
  };
  var index2addr = function(L, idx) {
    let ci = L.ci;
    if (idx > 0) {
      let o = ci.funcOff + idx;
      api_check(L, idx <= ci.top - (ci.funcOff + 1), "unacceptable index");
      if (o >= L.top)
        return lobject.luaO_nilobject;
      else
        return L.stack[o];
    } else if (idx > LUA_REGISTRYINDEX) {
      api_check(L, idx !== 0 && -idx <= L.top, "invalid index");
      return L.stack[L.top + idx];
    } else if (idx === LUA_REGISTRYINDEX) {
      return L.l_G.l_registry;
    } else {
      idx = LUA_REGISTRYINDEX - idx;
      api_check(L, idx <= lfunc.MAXUPVAL + 1, "upvalue index too large");
      if (ci.func.ttislcf())
        return lobject.luaO_nilobject;
      else {
        return idx <= ci.func.value.nupvalues ? ci.func.value.upvalue[idx - 1] : lobject.luaO_nilobject;
      }
    }
  };
  var index2addr_ = function(L, idx) {
    let ci = L.ci;
    if (idx > 0) {
      let o = ci.funcOff + idx;
      api_check(L, idx <= ci.top - (ci.funcOff + 1), "unacceptable index");
      if (o >= L.top)
        return null;
      else
        return o;
    } else if (idx > LUA_REGISTRYINDEX) {
      api_check(L, idx !== 0 && -idx <= L.top, "invalid index");
      return L.top + idx;
    } else {
      throw Error("attempt to use pseudo-index");
    }
  };
  var lua_checkstack = function(L, n) {
    let res;
    let ci = L.ci;
    api_check(L, n >= 0, "negative 'n'");
    if (L.stack_last - L.top > n)
      res = true;
    else {
      let inuse = L.top + lstate.EXTRA_STACK;
      if (inuse > LUAI_MAXSTACK - n)
        res = false;
      else {
        ldo.luaD_growstack(L, n);
        res = true;
      }
    }
    if (res && ci.top < L.top + n)
      ci.top = L.top + n;
    return res;
  };
  var lua_xmove = function(from, to, n) {
    if (from === to)
      return;
    api_checknelems(from, n);
    api_check(from, from.l_G === to.l_G, "moving among independent states");
    api_check(from, to.ci.top - to.top >= n, "stack overflow");
    from.top -= n;
    for (let i = 0;i < n; i++) {
      to.stack[to.top] = new lobject.TValue;
      lobject.setobj2s(to, to.top, from.stack[from.top + i]);
      delete from.stack[from.top + i];
      to.top++;
    }
  };
  var lua_absindex = function(L, idx) {
    return idx > 0 || idx <= LUA_REGISTRYINDEX ? idx : L.top - L.ci.funcOff + idx;
  };
  var lua_gettop = function(L) {
    return L.top - (L.ci.funcOff + 1);
  };
  var lua_pushvalue = function(L, idx) {
    lobject.pushobj2s(L, index2addr(L, idx));
    api_check(L, L.top <= L.ci.top, "stack overflow");
  };
  var lua_settop = function(L, idx) {
    let func = L.ci.funcOff;
    let newtop;
    if (idx >= 0) {
      api_check(L, idx <= L.stack_last - (func + 1), "new top too large");
      newtop = func + 1 + idx;
    } else {
      api_check(L, -(idx + 1) <= L.top - (func + 1), "invalid new top");
      newtop = L.top + idx + 1;
    }
    ldo.adjust_top(L, newtop);
  };
  var lua_pop = function(L, n) {
    lua_settop(L, -n - 1);
  };
  var reverse = function(L, from, to) {
    for (;from < to; from++, to--) {
      let fromtv = L.stack[from];
      let temp = new TValue(fromtv.type, fromtv.value);
      lobject.setobjs2s(L, from, to);
      lobject.setobj2s(L, to, temp);
    }
  };
  var lua_rotate = function(L, idx, n) {
    let t = L.top - 1;
    let pIdx = index2addr_(L, idx);
    let p = L.stack[pIdx];
    api_check(L, isvalid(p) && idx > LUA_REGISTRYINDEX, "index not in the stack");
    api_check(L, (n >= 0 ? n : -n) <= t - pIdx + 1, "invalid 'n'");
    let m = n >= 0 ? t - n : pIdx - n - 1;
    reverse(L, pIdx, m);
    reverse(L, m + 1, L.top - 1);
    reverse(L, pIdx, L.top - 1);
  };
  var lua_copy = function(L, fromidx, toidx) {
    let from = index2addr(L, fromidx);
    index2addr(L, toidx).setfrom(from);
  };
  var lua_remove = function(L, idx) {
    lua_rotate(L, idx, -1);
    lua_pop(L, 1);
  };
  var lua_insert = function(L, idx) {
    lua_rotate(L, idx, 1);
  };
  var lua_replace = function(L, idx) {
    lua_copy(L, -1, idx);
    lua_pop(L, 1);
  };
  var lua_pushnil = function(L) {
    L.stack[L.top] = new TValue(LUA_TNIL, null);
    api_incr_top(L);
  };
  var lua_pushnumber = function(L, n) {
    fengari_argcheck(typeof n === "number");
    L.stack[L.top] = new TValue(LUA_TNUMFLT, n);
    api_incr_top(L);
  };
  var lua_pushinteger = function(L, n) {
    fengari_argcheckinteger(n);
    L.stack[L.top] = new TValue(LUA_TNUMINT, n);
    api_incr_top(L);
  };
  var lua_pushlstring = function(L, s, len) {
    fengari_argcheckinteger(len);
    let ts;
    if (len === 0) {
      s = to_luastring("", true);
      ts = luaS_bless(L, s);
    } else {
      s = from_userstring(s);
      api_check(L, s.length >= len, "invalid length to lua_pushlstring");
      ts = luaS_new(L, s.subarray(0, len));
    }
    lobject.pushsvalue2s(L, ts);
    api_check(L, L.top <= L.ci.top, "stack overflow");
    return ts.value;
  };
  var lua_pushstring = function(L, s) {
    if (s === undefined || s === null) {
      L.stack[L.top] = new TValue(LUA_TNIL, null);
      L.top++;
    } else {
      let ts = luaS_new(L, from_userstring(s));
      lobject.pushsvalue2s(L, ts);
      s = ts.getstr();
    }
    api_check(L, L.top <= L.ci.top, "stack overflow");
    return s;
  };
  var lua_pushvfstring = function(L, fmt, argp) {
    fmt = from_userstring(fmt);
    return lobject.luaO_pushvfstring(L, fmt, argp);
  };
  var lua_pushfstring = function(L, fmt, ...argp) {
    fmt = from_userstring(fmt);
    return lobject.luaO_pushvfstring(L, fmt, argp);
  };
  var lua_pushliteral = function(L, s) {
    if (s === undefined || s === null) {
      L.stack[L.top] = new TValue(LUA_TNIL, null);
      L.top++;
    } else {
      fengari_argcheck(typeof s === "string");
      let ts = luaS_newliteral(L, s);
      lobject.pushsvalue2s(L, ts);
      s = ts.getstr();
    }
    api_check(L, L.top <= L.ci.top, "stack overflow");
    return s;
  };
  var lua_pushcclosure = function(L, fn, n) {
    fengari_argcheck(typeof fn === "function");
    fengari_argcheckinteger(n);
    if (n === 0)
      L.stack[L.top] = new TValue(LUA_TLCF, fn);
    else {
      api_checknelems(L, n);
      api_check(L, n <= lfunc.MAXUPVAL, "upvalue index too large");
      let cl = new CClosure(L, fn, n);
      for (let i = 0;i < n; i++)
        cl.upvalue[i].setfrom(L.stack[L.top - n + i]);
      for (let i = 1;i < n; i++)
        delete L.stack[--L.top];
      if (n > 0)
        --L.top;
      L.stack[L.top].setclCvalue(cl);
    }
    api_incr_top(L);
  };
  var lua_pushjsclosure = lua_pushcclosure;
  var lua_pushcfunction = function(L, fn) {
    lua_pushcclosure(L, fn, 0);
  };
  var lua_pushjsfunction = lua_pushcfunction;
  var lua_pushboolean = function(L, b) {
    L.stack[L.top] = new TValue(LUA_TBOOLEAN, !!b);
    api_incr_top(L);
  };
  var lua_pushlightuserdata = function(L, p) {
    L.stack[L.top] = new TValue(LUA_TLIGHTUSERDATA, p);
    api_incr_top(L);
  };
  var lua_pushthread = function(L) {
    L.stack[L.top] = new TValue(LUA_TTHREAD, L);
    api_incr_top(L);
    return L.l_G.mainthread === L;
  };
  var lua_pushglobaltable = function(L) {
    lua_rawgeti(L, LUA_REGISTRYINDEX, LUA_RIDX_GLOBALS);
  };
  var auxsetstr = function(L, t, k) {
    let str = luaS_new(L, from_userstring(k));
    api_checknelems(L, 1);
    lobject.pushsvalue2s(L, str);
    api_check(L, L.top <= L.ci.top, "stack overflow");
    lvm.settable(L, t, L.stack[L.top - 1], L.stack[L.top - 2]);
    delete L.stack[--L.top];
    delete L.stack[--L.top];
  };
  var lua_setglobal = function(L, name) {
    auxsetstr(L, ltable.luaH_getint(L.l_G.l_registry.value, LUA_RIDX_GLOBALS), name);
  };
  var lua_setmetatable = function(L, objindex) {
    api_checknelems(L, 1);
    let mt;
    let obj = index2addr(L, objindex);
    if (L.stack[L.top - 1].ttisnil())
      mt = null;
    else {
      api_check(L, L.stack[L.top - 1].ttistable(), "table expected");
      mt = L.stack[L.top - 1].value;
    }
    switch (obj.ttnov()) {
      case LUA_TUSERDATA:
      case LUA_TTABLE: {
        obj.value.metatable = mt;
        break;
      }
      default: {
        L.l_G.mt[obj.ttnov()] = mt;
        break;
      }
    }
    delete L.stack[--L.top];
    return true;
  };
  var lua_settable = function(L, idx) {
    api_checknelems(L, 2);
    let t = index2addr(L, idx);
    lvm.settable(L, t, L.stack[L.top - 2], L.stack[L.top - 1]);
    delete L.stack[--L.top];
    delete L.stack[--L.top];
  };
  var lua_setfield = function(L, idx, k) {
    auxsetstr(L, index2addr(L, idx), k);
  };
  var lua_seti = function(L, idx, n) {
    fengari_argcheckinteger(n);
    api_checknelems(L, 1);
    let t = index2addr(L, idx);
    L.stack[L.top] = new TValue(LUA_TNUMINT, n);
    api_incr_top(L);
    lvm.settable(L, t, L.stack[L.top - 1], L.stack[L.top - 2]);
    delete L.stack[--L.top];
    delete L.stack[--L.top];
  };
  var lua_rawset = function(L, idx) {
    api_checknelems(L, 2);
    let o = index2addr(L, idx);
    api_check(L, o.ttistable(), "table expected");
    let k = L.stack[L.top - 2];
    let v = L.stack[L.top - 1];
    ltable.luaH_setfrom(L, o.value, k, v);
    ltable.invalidateTMcache(o.value);
    delete L.stack[--L.top];
    delete L.stack[--L.top];
  };
  var lua_rawseti = function(L, idx, n) {
    fengari_argcheckinteger(n);
    api_checknelems(L, 1);
    let o = index2addr(L, idx);
    api_check(L, o.ttistable(), "table expected");
    ltable.luaH_setint(o.value, n, L.stack[L.top - 1]);
    delete L.stack[--L.top];
  };
  var lua_rawsetp = function(L, idx, p) {
    api_checknelems(L, 1);
    let o = index2addr(L, idx);
    api_check(L, o.ttistable(), "table expected");
    let k = new TValue(LUA_TLIGHTUSERDATA, p);
    let v = L.stack[L.top - 1];
    ltable.luaH_setfrom(L, o.value, k, v);
    delete L.stack[--L.top];
  };
  var auxgetstr = function(L, t, k) {
    let str = luaS_new(L, from_userstring(k));
    lobject.pushsvalue2s(L, str);
    api_check(L, L.top <= L.ci.top, "stack overflow");
    lvm.luaV_gettable(L, t, L.stack[L.top - 1], L.top - 1);
    return L.stack[L.top - 1].ttnov();
  };
  var lua_rawgeti = function(L, idx, n) {
    let t = index2addr(L, idx);
    fengari_argcheckinteger(n);
    api_check(L, t.ttistable(), "table expected");
    lobject.pushobj2s(L, ltable.luaH_getint(t.value, n));
    api_check(L, L.top <= L.ci.top, "stack overflow");
    return L.stack[L.top - 1].ttnov();
  };
  var lua_rawgetp = function(L, idx, p) {
    let t = index2addr(L, idx);
    api_check(L, t.ttistable(), "table expected");
    let k = new TValue(LUA_TLIGHTUSERDATA, p);
    lobject.pushobj2s(L, ltable.luaH_get(L, t.value, k));
    api_check(L, L.top <= L.ci.top, "stack overflow");
    return L.stack[L.top - 1].ttnov();
  };
  var lua_rawget = function(L, idx) {
    let t = index2addr(L, idx);
    api_check(L, t.ttistable(t), "table expected");
    lobject.setobj2s(L, L.top - 1, ltable.luaH_get(L, t.value, L.stack[L.top - 1]));
    return L.stack[L.top - 1].ttnov();
  };
  var lua_createtable = function(L, narray, nrec) {
    let t = new lobject.TValue(LUA_TTABLE, ltable.luaH_new(L));
    L.stack[L.top] = t;
    api_incr_top(L);
  };
  var luaS_newudata = function(L, size) {
    return new lobject.Udata(L, size);
  };
  var lua_newuserdata = function(L, size) {
    let u = luaS_newudata(L, size);
    L.stack[L.top] = new lobject.TValue(LUA_TUSERDATA, u);
    api_incr_top(L);
    return u.data;
  };
  var aux_upvalue = function(L, fi, n) {
    fengari_argcheckinteger(n);
    switch (fi.ttype()) {
      case LUA_TCCL: {
        let f = fi.value;
        if (!(1 <= n && n <= f.nupvalues))
          return null;
        return {
          name: to_luastring("", true),
          val: f.upvalue[n - 1]
        };
      }
      case LUA_TLCL: {
        let f = fi.value;
        let p = f.p;
        if (!(1 <= n && n <= p.upvalues.length))
          return null;
        let name = p.upvalues[n - 1].name;
        return {
          name: name ? name.getstr() : to_luastring("(*no name)", true),
          val: f.upvals[n - 1]
        };
      }
      default:
        return null;
    }
  };
  var lua_getupvalue = function(L, funcindex, n) {
    let up = aux_upvalue(L, index2addr(L, funcindex), n);
    if (up) {
      let name = up.name;
      let val = up.val;
      lobject.pushobj2s(L, val);
      api_check(L, L.top <= L.ci.top, "stack overflow");
      return name;
    }
    return null;
  };
  var lua_setupvalue = function(L, funcindex, n) {
    let fi = index2addr(L, funcindex);
    api_checknelems(L, 1);
    let aux = aux_upvalue(L, fi, n);
    if (aux) {
      let name = aux.name;
      let val = aux.val;
      val.setfrom(L.stack[L.top - 1]);
      delete L.stack[--L.top];
      return name;
    }
    return null;
  };
  var lua_newtable = function(L) {
    lua_createtable(L, 0, 0);
  };
  var lua_register = function(L, n, f) {
    lua_pushcfunction(L, f);
    lua_setglobal(L, n);
  };
  var lua_getmetatable = function(L, objindex) {
    let obj = index2addr(L, objindex);
    let mt;
    let res = false;
    switch (obj.ttnov()) {
      case LUA_TTABLE:
      case LUA_TUSERDATA:
        mt = obj.value.metatable;
        break;
      default:
        mt = L.l_G.mt[obj.ttnov()];
        break;
    }
    if (mt !== null && mt !== undefined) {
      L.stack[L.top] = new TValue(LUA_TTABLE, mt);
      api_incr_top(L);
      res = true;
    }
    return res;
  };
  var lua_getuservalue = function(L, idx) {
    let o = index2addr(L, idx);
    api_check(L, o.ttisfulluserdata(), "full userdata expected");
    let uv = o.value.uservalue;
    L.stack[L.top] = new TValue(uv.type, uv.value);
    api_incr_top(L);
    return L.stack[L.top - 1].ttnov();
  };
  var lua_gettable = function(L, idx) {
    let t = index2addr(L, idx);
    lvm.luaV_gettable(L, t, L.stack[L.top - 1], L.top - 1);
    return L.stack[L.top - 1].ttnov();
  };
  var lua_getfield = function(L, idx, k) {
    return auxgetstr(L, index2addr(L, idx), k);
  };
  var lua_geti = function(L, idx, n) {
    let t = index2addr(L, idx);
    fengari_argcheckinteger(n);
    L.stack[L.top] = new TValue(LUA_TNUMINT, n);
    api_incr_top(L);
    lvm.luaV_gettable(L, t, L.stack[L.top - 1], L.top - 1);
    return L.stack[L.top - 1].ttnov();
  };
  var lua_getglobal = function(L, name) {
    return auxgetstr(L, ltable.luaH_getint(L.l_G.l_registry.value, LUA_RIDX_GLOBALS), name);
  };
  var lua_toboolean = function(L, idx) {
    let o = index2addr(L, idx);
    return !o.l_isfalse();
  };
  var lua_tolstring = function(L, idx) {
    let o = index2addr(L, idx);
    if (!o.ttisstring()) {
      if (!lvm.cvt2str(o)) {
        return null;
      }
      lobject.luaO_tostring(L, o);
    }
    return o.svalue();
  };
  var lua_tostring = lua_tolstring;
  var lua_tojsstring = function(L, idx) {
    let o = index2addr(L, idx);
    if (!o.ttisstring()) {
      if (!lvm.cvt2str(o)) {
        return null;
      }
      lobject.luaO_tostring(L, o);
    }
    return o.jsstring();
  };
  var lua_todataview = function(L, idx) {
    let u8 = lua_tolstring(L, idx);
    return new DataView(u8.buffer, u8.byteOffset, u8.byteLength);
  };
  var lua_rawlen = function(L, idx) {
    let o = index2addr(L, idx);
    switch (o.ttype()) {
      case LUA_TSHRSTR:
      case LUA_TLNGSTR:
        return o.vslen();
      case LUA_TUSERDATA:
        return o.value.len;
      case LUA_TTABLE:
        return ltable.luaH_getn(o.value);
      default:
        return 0;
    }
  };
  var lua_tocfunction = function(L, idx) {
    let o = index2addr(L, idx);
    if (o.ttislcf() || o.ttisCclosure())
      return o.value;
    else
      return null;
  };
  var lua_tointeger = function(L, idx) {
    let n = lua_tointegerx(L, idx);
    return n === false ? 0 : n;
  };
  var lua_tointegerx = function(L, idx) {
    return lvm.tointeger(index2addr(L, idx));
  };
  var lua_tonumber = function(L, idx) {
    let n = lua_tonumberx(L, idx);
    return n === false ? 0 : n;
  };
  var lua_tonumberx = function(L, idx) {
    return lvm.tonumber(index2addr(L, idx));
  };
  var lua_touserdata = function(L, idx) {
    let o = index2addr(L, idx);
    switch (o.ttnov()) {
      case LUA_TUSERDATA:
        return o.value.data;
      case LUA_TLIGHTUSERDATA:
        return o.value;
      default:
        return null;
    }
  };
  var lua_tothread = function(L, idx) {
    let o = index2addr(L, idx);
    return o.ttisthread() ? o.value : null;
  };
  var lua_topointer = function(L, idx) {
    let o = index2addr(L, idx);
    switch (o.ttype()) {
      case LUA_TTABLE:
      case LUA_TLCL:
      case LUA_TCCL:
      case LUA_TLCF:
      case LUA_TTHREAD:
      case LUA_TUSERDATA:
      case LUA_TLIGHTUSERDATA:
        return o.value;
      default:
        return null;
    }
  };
  var seen = new WeakMap;
  var lua_isproxy = function(p, L) {
    let G = seen.get(p);
    if (!G)
      return false;
    return L === null || L.l_G === G;
  };
  var create_proxy = function(G, type, value) {
    let proxy = function(L) {
      api_check(L, L instanceof lstate.lua_State && G === L.l_G, "must be from same global state");
      L.stack[L.top] = new TValue(type, value);
      api_incr_top(L);
    };
    seen.set(proxy, G);
    return proxy;
  };
  var lua_toproxy = function(L, idx) {
    let tv = index2addr(L, idx);
    return create_proxy(L.l_G, tv.type, tv.value);
  };
  var lua_compare = function(L, index1, index2, op) {
    let o1 = index2addr(L, index1);
    let o2 = index2addr(L, index2);
    let i = 0;
    if (isvalid(o1) && isvalid(o2)) {
      switch (op) {
        case LUA_OPEQ:
          i = lvm.luaV_equalobj(L, o1, o2);
          break;
        case LUA_OPLT:
          i = lvm.luaV_lessthan(L, o1, o2);
          break;
        case LUA_OPLE:
          i = lvm.luaV_lessequal(L, o1, o2);
          break;
        default:
          api_check(L, false, "invalid option");
      }
    }
    return i;
  };
  var lua_stringtonumber = function(L, s) {
    let tv = new TValue;
    let sz = lobject.luaO_str2num(s, tv);
    if (sz !== 0) {
      L.stack[L.top] = tv;
      api_incr_top(L);
    }
    return sz;
  };
  var f_call = function(L, ud) {
    ldo.luaD_callnoyield(L, ud.funcOff, ud.nresults);
  };
  var lua_type = function(L, idx) {
    let o = index2addr(L, idx);
    return isvalid(o) ? o.ttnov() : LUA_TNONE;
  };
  var lua_typename = function(L, t) {
    api_check(L, LUA_TNONE <= t && t < LUA_NUMTAGS, "invalid tag");
    return ltm.ttypename(t);
  };
  var lua_iscfunction = function(L, idx) {
    let o = index2addr(L, idx);
    return o.ttislcf(o) || o.ttisCclosure();
  };
  var lua_isnil = function(L, n) {
    return lua_type(L, n) === LUA_TNIL;
  };
  var lua_isboolean = function(L, n) {
    return lua_type(L, n) === LUA_TBOOLEAN;
  };
  var lua_isnone = function(L, n) {
    return lua_type(L, n) === LUA_TNONE;
  };
  var lua_isnoneornil = function(L, n) {
    return lua_type(L, n) <= 0;
  };
  var lua_istable = function(L, idx) {
    return index2addr(L, idx).ttistable();
  };
  var lua_isinteger = function(L, idx) {
    return index2addr(L, idx).ttisinteger();
  };
  var lua_isnumber = function(L, idx) {
    return lvm.tonumber(index2addr(L, idx)) !== false;
  };
  var lua_isstring = function(L, idx) {
    let o = index2addr(L, idx);
    return o.ttisstring() || lvm.cvt2str(o);
  };
  var lua_isuserdata = function(L, idx) {
    let o = index2addr(L, idx);
    return o.ttisfulluserdata(o) || o.ttislightuserdata();
  };
  var lua_isthread = function(L, idx) {
    return lua_type(L, idx) === LUA_TTHREAD;
  };
  var lua_isfunction = function(L, idx) {
    return lua_type(L, idx) === LUA_TFUNCTION;
  };
  var lua_islightuserdata = function(L, idx) {
    return lua_type(L, idx) === LUA_TLIGHTUSERDATA;
  };
  var lua_rawequal = function(L, index1, index2) {
    let o1 = index2addr(L, index1);
    let o2 = index2addr(L, index2);
    return isvalid(o1) && isvalid(o2) ? lvm.luaV_equalobj(null, o1, o2) : 0;
  };
  var lua_arith = function(L, op) {
    if (op !== LUA_OPUNM && op !== LUA_OPBNOT)
      api_checknelems(L, 2);
    else {
      api_checknelems(L, 1);
      lobject.pushobj2s(L, L.stack[L.top - 1]);
      api_check(L, L.top <= L.ci.top, "stack overflow");
    }
    lobject.luaO_arith(L, op, L.stack[L.top - 2], L.stack[L.top - 1], L.stack[L.top - 2]);
    delete L.stack[--L.top];
  };
  var default_chunkname = to_luastring("?");
  var lua_load = function(L, reader, data, chunkname, mode) {
    if (!chunkname)
      chunkname = default_chunkname;
    else
      chunkname = from_userstring(chunkname);
    if (mode !== null)
      mode = from_userstring(mode);
    let z = new ZIO(L, reader, data);
    let status = ldo.luaD_protectedparser(L, z, chunkname, mode);
    if (status === LUA_OK) {
      let f = L.stack[L.top - 1].value;
      if (f.nupvalues >= 1) {
        let gt = ltable.luaH_getint(L.l_G.l_registry.value, LUA_RIDX_GLOBALS);
        f.upvals[0].setfrom(gt);
      }
    }
    return status;
  };
  var lua_dump = function(L, writer, data, strip) {
    api_checknelems(L, 1);
    let o = L.stack[L.top - 1];
    if (o.ttisLclosure())
      return luaU_dump(L, o.value.p, writer, data, strip);
    return 1;
  };
  var lua_status = function(L) {
    return L.status;
  };
  var lua_setuservalue = function(L, idx) {
    api_checknelems(L, 1);
    let o = index2addr(L, idx);
    api_check(L, o.ttisfulluserdata(), "full userdata expected");
    o.value.uservalue.setfrom(L.stack[L.top - 1]);
    delete L.stack[--L.top];
  };
  var checkresults = function(L, na, nr) {
    api_check(L, nr === LUA_MULTRET || L.ci.top - L.top >= nr - na, "results from function overflow current stack size");
  };
  var lua_callk = function(L, nargs, nresults, ctx, k) {
    api_check(L, k === null || !(L.ci.callstatus & lstate.CIST_LUA), "cannot use continuations inside hooks");
    api_checknelems(L, nargs + 1);
    api_check(L, L.status === LUA_OK, "cannot do calls on non-normal thread");
    checkresults(L, nargs, nresults);
    let func = L.top - (nargs + 1);
    if (k !== null && L.nny === 0) {
      L.ci.c_k = k;
      L.ci.c_ctx = ctx;
      ldo.luaD_call(L, func, nresults);
    } else {
      ldo.luaD_callnoyield(L, func, nresults);
    }
    if (nresults === LUA_MULTRET && L.ci.top < L.top)
      L.ci.top = L.top;
  };
  var lua_call = function(L, n, r) {
    lua_callk(L, n, r, 0, null);
  };
  var lua_pcallk = function(L, nargs, nresults, errfunc, ctx, k) {
    api_check(L, k === null || !(L.ci.callstatus & lstate.CIST_LUA), "cannot use continuations inside hooks");
    api_checknelems(L, nargs + 1);
    api_check(L, L.status === LUA_OK, "cannot do calls on non-normal thread");
    checkresults(L, nargs, nresults);
    let status;
    let func;
    if (errfunc === 0)
      func = 0;
    else {
      func = index2addr_(L, errfunc);
    }
    let funcOff = L.top - (nargs + 1);
    if (k === null || L.nny > 0) {
      let c = {
        funcOff,
        nresults
      };
      status = ldo.luaD_pcall(L, f_call, c, funcOff, func);
    } else {
      let ci = L.ci;
      ci.c_k = k;
      ci.c_ctx = ctx;
      ci.extra = funcOff;
      ci.c_old_errfunc = L.errfunc;
      L.errfunc = func;
      ci.callstatus &= ~lstate.CIST_OAH | L.allowhook;
      ci.callstatus |= lstate.CIST_YPCALL;
      ldo.luaD_call(L, funcOff, nresults);
      ci.callstatus &= ~lstate.CIST_YPCALL;
      L.errfunc = ci.c_old_errfunc;
      status = LUA_OK;
    }
    if (nresults === LUA_MULTRET && L.ci.top < L.top)
      L.ci.top = L.top;
    return status;
  };
  var lua_pcall = function(L, n, r, f) {
    return lua_pcallk(L, n, r, f, 0, null);
  };
  var lua_error = function(L) {
    api_checknelems(L, 1);
    ldebug.luaG_errormsg(L);
  };
  var lua_next = function(L, idx) {
    let t = index2addr(L, idx);
    api_check(L, t.ttistable(), "table expected");
    L.stack[L.top] = new TValue;
    let more = ltable.luaH_next(L, t.value, L.top - 1);
    if (more) {
      api_incr_top(L);
      return 1;
    } else {
      delete L.stack[L.top];
      delete L.stack[--L.top];
      return 0;
    }
  };
  var lua_concat = function(L, n) {
    api_checknelems(L, n);
    if (n >= 2)
      lvm.luaV_concat(L, n);
    else if (n === 0) {
      lobject.pushsvalue2s(L, luaS_bless(L, to_luastring("", true)));
      api_check(L, L.top <= L.ci.top, "stack overflow");
    }
  };
  var lua_len = function(L, idx) {
    let t = index2addr(L, idx);
    let tv = new TValue;
    lvm.luaV_objlen(L, tv, t);
    L.stack[L.top] = tv;
    api_incr_top(L);
  };
  var getupvalref = function(L, fidx, n) {
    let fi = index2addr(L, fidx);
    api_check(L, fi.ttisLclosure(), "Lua function expected");
    let f = fi.value;
    fengari_argcheckinteger(n);
    api_check(L, 1 <= n && n <= f.p.upvalues.length, "invalid upvalue index");
    return {
      f,
      i: n - 1
    };
  };
  var lua_upvalueid = function(L, fidx, n) {
    let fi = index2addr(L, fidx);
    switch (fi.ttype()) {
      case LUA_TLCL: {
        let ref = getupvalref(L, fidx, n);
        return ref.f.upvals[ref.i];
      }
      case LUA_TCCL: {
        let f = fi.value;
        api_check(L, (n | 0) === n && n > 0 && n <= f.nupvalues, "invalid upvalue index");
        return f.upvalue[n - 1];
      }
      default: {
        api_check(L, false, "closure expected");
        return null;
      }
    }
  };
  var lua_upvaluejoin = function(L, fidx1, n1, fidx2, n2) {
    let ref1 = getupvalref(L, fidx1, n1);
    let ref2 = getupvalref(L, fidx2, n2);
    let up2 = ref2.f.upvals[ref2.i];
    ref1.f.upvals[ref1.i] = up2;
  };
  var lua_gc = function() {};
  var lua_getallocf = function() {
    console.warn("lua_getallocf is not available");
    return 0;
  };
  var lua_setallocf = function() {
    console.warn("lua_setallocf is not available");
    return 0;
  };
  var lua_getextraspace = function() {
    console.warn("lua_getextraspace is not available");
    return 0;
  };
  exports.api_incr_top = api_incr_top;
  exports.api_checknelems = api_checknelems;
  exports.lua_absindex = lua_absindex;
  exports.lua_arith = lua_arith;
  exports.lua_atpanic = lua_atpanic;
  exports.lua_atnativeerror = lua_atnativeerror;
  exports.lua_call = lua_call;
  exports.lua_callk = lua_callk;
  exports.lua_checkstack = lua_checkstack;
  exports.lua_compare = lua_compare;
  exports.lua_concat = lua_concat;
  exports.lua_copy = lua_copy;
  exports.lua_createtable = lua_createtable;
  exports.lua_dump = lua_dump;
  exports.lua_error = lua_error;
  exports.lua_gc = lua_gc;
  exports.lua_getallocf = lua_getallocf;
  exports.lua_getextraspace = lua_getextraspace;
  exports.lua_getfield = lua_getfield;
  exports.lua_getglobal = lua_getglobal;
  exports.lua_geti = lua_geti;
  exports.lua_getmetatable = lua_getmetatable;
  exports.lua_gettable = lua_gettable;
  exports.lua_gettop = lua_gettop;
  exports.lua_getupvalue = lua_getupvalue;
  exports.lua_getuservalue = lua_getuservalue;
  exports.lua_insert = lua_insert;
  exports.lua_isboolean = lua_isboolean;
  exports.lua_iscfunction = lua_iscfunction;
  exports.lua_isfunction = lua_isfunction;
  exports.lua_isinteger = lua_isinteger;
  exports.lua_islightuserdata = lua_islightuserdata;
  exports.lua_isnil = lua_isnil;
  exports.lua_isnone = lua_isnone;
  exports.lua_isnoneornil = lua_isnoneornil;
  exports.lua_isnumber = lua_isnumber;
  exports.lua_isproxy = lua_isproxy;
  exports.lua_isstring = lua_isstring;
  exports.lua_istable = lua_istable;
  exports.lua_isthread = lua_isthread;
  exports.lua_isuserdata = lua_isuserdata;
  exports.lua_len = lua_len;
  exports.lua_load = lua_load;
  exports.lua_newtable = lua_newtable;
  exports.lua_newuserdata = lua_newuserdata;
  exports.lua_next = lua_next;
  exports.lua_pcall = lua_pcall;
  exports.lua_pcallk = lua_pcallk;
  exports.lua_pop = lua_pop;
  exports.lua_pushboolean = lua_pushboolean;
  exports.lua_pushcclosure = lua_pushcclosure;
  exports.lua_pushcfunction = lua_pushcfunction;
  exports.lua_pushfstring = lua_pushfstring;
  exports.lua_pushglobaltable = lua_pushglobaltable;
  exports.lua_pushinteger = lua_pushinteger;
  exports.lua_pushjsclosure = lua_pushjsclosure;
  exports.lua_pushjsfunction = lua_pushjsfunction;
  exports.lua_pushlightuserdata = lua_pushlightuserdata;
  exports.lua_pushliteral = lua_pushliteral;
  exports.lua_pushlstring = lua_pushlstring;
  exports.lua_pushnil = lua_pushnil;
  exports.lua_pushnumber = lua_pushnumber;
  exports.lua_pushstring = lua_pushstring;
  exports.lua_pushthread = lua_pushthread;
  exports.lua_pushvalue = lua_pushvalue;
  exports.lua_pushvfstring = lua_pushvfstring;
  exports.lua_rawequal = lua_rawequal;
  exports.lua_rawget = lua_rawget;
  exports.lua_rawgeti = lua_rawgeti;
  exports.lua_rawgetp = lua_rawgetp;
  exports.lua_rawlen = lua_rawlen;
  exports.lua_rawset = lua_rawset;
  exports.lua_rawseti = lua_rawseti;
  exports.lua_rawsetp = lua_rawsetp;
  exports.lua_register = lua_register;
  exports.lua_remove = lua_remove;
  exports.lua_replace = lua_replace;
  exports.lua_rotate = lua_rotate;
  exports.lua_setallocf = lua_setallocf;
  exports.lua_setfield = lua_setfield;
  exports.lua_setglobal = lua_setglobal;
  exports.lua_seti = lua_seti;
  exports.lua_setmetatable = lua_setmetatable;
  exports.lua_settable = lua_settable;
  exports.lua_settop = lua_settop;
  exports.lua_setupvalue = lua_setupvalue;
  exports.lua_setuservalue = lua_setuservalue;
  exports.lua_status = lua_status;
  exports.lua_stringtonumber = lua_stringtonumber;
  exports.lua_toboolean = lua_toboolean;
  exports.lua_tocfunction = lua_tocfunction;
  exports.lua_todataview = lua_todataview;
  exports.lua_tointeger = lua_tointeger;
  exports.lua_tointegerx = lua_tointegerx;
  exports.lua_tojsstring = lua_tojsstring;
  exports.lua_tolstring = lua_tolstring;
  exports.lua_tonumber = lua_tonumber;
  exports.lua_tonumberx = lua_tonumberx;
  exports.lua_topointer = lua_topointer;
  exports.lua_toproxy = lua_toproxy;
  exports.lua_tostring = lua_tostring;
  exports.lua_tothread = lua_tothread;
  exports.lua_touserdata = lua_touserdata;
  exports.lua_type = lua_type;
  exports.lua_typename = lua_typename;
  exports.lua_upvalueid = lua_upvalueid;
  exports.lua_upvaluejoin = lua_upvaluejoin;
  exports.lua_version = lua_version;
  exports.lua_xmove = lua_xmove;
});

// node_modules/fengari/src/lua.js
var require_lua = __commonJS(function(exports, module) {
  var defs = require_defs();
  var lapi = require_lapi();
  var ldebug = require_ldebug();
  var ldo = require_ldo();
  var lstate = require_lstate();
  exports.LUA_AUTHORS = defs.LUA_AUTHORS;
  exports.LUA_COPYRIGHT = defs.LUA_COPYRIGHT;
  exports.LUA_ERRERR = defs.thread_status.LUA_ERRERR;
  exports.LUA_ERRGCMM = defs.thread_status.LUA_ERRGCMM;
  exports.LUA_ERRMEM = defs.thread_status.LUA_ERRMEM;
  exports.LUA_ERRRUN = defs.thread_status.LUA_ERRRUN;
  exports.LUA_ERRSYNTAX = defs.thread_status.LUA_ERRSYNTAX;
  exports.LUA_HOOKCALL = defs.LUA_HOOKCALL;
  exports.LUA_HOOKCOUNT = defs.LUA_HOOKCOUNT;
  exports.LUA_HOOKLINE = defs.LUA_HOOKLINE;
  exports.LUA_HOOKRET = defs.LUA_HOOKRET;
  exports.LUA_HOOKTAILCALL = defs.LUA_HOOKTAILCALL;
  exports.LUA_MASKCALL = defs.LUA_MASKCALL;
  exports.LUA_MASKCOUNT = defs.LUA_MASKCOUNT;
  exports.LUA_MASKLINE = defs.LUA_MASKLINE;
  exports.LUA_MASKRET = defs.LUA_MASKRET;
  exports.LUA_MINSTACK = defs.LUA_MINSTACK;
  exports.LUA_MULTRET = defs.LUA_MULTRET;
  exports.LUA_NUMTAGS = defs.constant_types.LUA_NUMTAGS;
  exports.LUA_OK = defs.thread_status.LUA_OK;
  exports.LUA_OPADD = defs.LUA_OPADD;
  exports.LUA_OPBAND = defs.LUA_OPBAND;
  exports.LUA_OPBNOT = defs.LUA_OPBNOT;
  exports.LUA_OPBOR = defs.LUA_OPBOR;
  exports.LUA_OPBXOR = defs.LUA_OPBXOR;
  exports.LUA_OPDIV = defs.LUA_OPDIV;
  exports.LUA_OPEQ = defs.LUA_OPEQ;
  exports.LUA_OPIDIV = defs.LUA_OPIDIV;
  exports.LUA_OPLE = defs.LUA_OPLE;
  exports.LUA_OPLT = defs.LUA_OPLT;
  exports.LUA_OPMOD = defs.LUA_OPMOD;
  exports.LUA_OPMUL = defs.LUA_OPMUL;
  exports.LUA_OPPOW = defs.LUA_OPPOW;
  exports.LUA_OPSHL = defs.LUA_OPSHL;
  exports.LUA_OPSHR = defs.LUA_OPSHR;
  exports.LUA_OPSUB = defs.LUA_OPSUB;
  exports.LUA_OPUNM = defs.LUA_OPUNM;
  exports.LUA_REGISTRYINDEX = defs.LUA_REGISTRYINDEX;
  exports.LUA_RELEASE = defs.LUA_RELEASE;
  exports.LUA_RIDX_GLOBALS = defs.LUA_RIDX_GLOBALS;
  exports.LUA_RIDX_LAST = defs.LUA_RIDX_LAST;
  exports.LUA_RIDX_MAINTHREAD = defs.LUA_RIDX_MAINTHREAD;
  exports.LUA_SIGNATURE = defs.LUA_SIGNATURE;
  exports.LUA_TNONE = defs.constant_types.LUA_TNONE;
  exports.LUA_TNIL = defs.constant_types.LUA_TNIL;
  exports.LUA_TBOOLEAN = defs.constant_types.LUA_TBOOLEAN;
  exports.LUA_TLIGHTUSERDATA = defs.constant_types.LUA_TLIGHTUSERDATA;
  exports.LUA_TNUMBER = defs.constant_types.LUA_TNUMBER;
  exports.LUA_TSTRING = defs.constant_types.LUA_TSTRING;
  exports.LUA_TTABLE = defs.constant_types.LUA_TTABLE;
  exports.LUA_TFUNCTION = defs.constant_types.LUA_TFUNCTION;
  exports.LUA_TUSERDATA = defs.constant_types.LUA_TUSERDATA;
  exports.LUA_TTHREAD = defs.constant_types.LUA_TTHREAD;
  exports.LUA_VERSION = defs.LUA_VERSION;
  exports.LUA_VERSION_MAJOR = defs.LUA_VERSION_MAJOR;
  exports.LUA_VERSION_MINOR = defs.LUA_VERSION_MINOR;
  exports.LUA_VERSION_NUM = defs.LUA_VERSION_NUM;
  exports.LUA_VERSION_RELEASE = defs.LUA_VERSION_RELEASE;
  exports.LUA_YIELD = defs.thread_status.LUA_YIELD;
  exports.lua_Debug = defs.lua_Debug;
  exports.lua_upvalueindex = defs.lua_upvalueindex;
  exports.lua_absindex = lapi.lua_absindex;
  exports.lua_arith = lapi.lua_arith;
  exports.lua_atpanic = lapi.lua_atpanic;
  exports.lua_atnativeerror = lapi.lua_atnativeerror;
  exports.lua_call = lapi.lua_call;
  exports.lua_callk = lapi.lua_callk;
  exports.lua_checkstack = lapi.lua_checkstack;
  exports.lua_close = lstate.lua_close;
  exports.lua_compare = lapi.lua_compare;
  exports.lua_concat = lapi.lua_concat;
  exports.lua_copy = lapi.lua_copy;
  exports.lua_createtable = lapi.lua_createtable;
  exports.lua_dump = lapi.lua_dump;
  exports.lua_error = lapi.lua_error;
  exports.lua_gc = lapi.lua_gc;
  exports.lua_getallocf = lapi.lua_getallocf;
  exports.lua_getextraspace = lapi.lua_getextraspace;
  exports.lua_getfield = lapi.lua_getfield;
  exports.lua_getglobal = lapi.lua_getglobal;
  exports.lua_gethook = ldebug.lua_gethook;
  exports.lua_gethookcount = ldebug.lua_gethookcount;
  exports.lua_gethookmask = ldebug.lua_gethookmask;
  exports.lua_geti = lapi.lua_geti;
  exports.lua_getinfo = ldebug.lua_getinfo;
  exports.lua_getlocal = ldebug.lua_getlocal;
  exports.lua_getmetatable = lapi.lua_getmetatable;
  exports.lua_getstack = ldebug.lua_getstack;
  exports.lua_gettable = lapi.lua_gettable;
  exports.lua_gettop = lapi.lua_gettop;
  exports.lua_getupvalue = lapi.lua_getupvalue;
  exports.lua_getuservalue = lapi.lua_getuservalue;
  exports.lua_insert = lapi.lua_insert;
  exports.lua_isboolean = lapi.lua_isboolean;
  exports.lua_iscfunction = lapi.lua_iscfunction;
  exports.lua_isfunction = lapi.lua_isfunction;
  exports.lua_isinteger = lapi.lua_isinteger;
  exports.lua_islightuserdata = lapi.lua_islightuserdata;
  exports.lua_isnil = lapi.lua_isnil;
  exports.lua_isnone = lapi.lua_isnone;
  exports.lua_isnoneornil = lapi.lua_isnoneornil;
  exports.lua_isnumber = lapi.lua_isnumber;
  exports.lua_isproxy = lapi.lua_isproxy;
  exports.lua_isstring = lapi.lua_isstring;
  exports.lua_istable = lapi.lua_istable;
  exports.lua_isthread = lapi.lua_isthread;
  exports.lua_isuserdata = lapi.lua_isuserdata;
  exports.lua_isyieldable = ldo.lua_isyieldable;
  exports.lua_len = lapi.lua_len;
  exports.lua_load = lapi.lua_load;
  exports.lua_newstate = lstate.lua_newstate;
  exports.lua_newtable = lapi.lua_newtable;
  exports.lua_newthread = lstate.lua_newthread;
  exports.lua_newuserdata = lapi.lua_newuserdata;
  exports.lua_next = lapi.lua_next;
  exports.lua_pcall = lapi.lua_pcall;
  exports.lua_pcallk = lapi.lua_pcallk;
  exports.lua_pop = lapi.lua_pop;
  exports.lua_pushboolean = lapi.lua_pushboolean;
  exports.lua_pushcclosure = lapi.lua_pushcclosure;
  exports.lua_pushcfunction = lapi.lua_pushcfunction;
  exports.lua_pushfstring = lapi.lua_pushfstring;
  exports.lua_pushglobaltable = lapi.lua_pushglobaltable;
  exports.lua_pushinteger = lapi.lua_pushinteger;
  exports.lua_pushjsclosure = lapi.lua_pushjsclosure;
  exports.lua_pushjsfunction = lapi.lua_pushjsfunction;
  exports.lua_pushlightuserdata = lapi.lua_pushlightuserdata;
  exports.lua_pushliteral = lapi.lua_pushliteral;
  exports.lua_pushlstring = lapi.lua_pushlstring;
  exports.lua_pushnil = lapi.lua_pushnil;
  exports.lua_pushnumber = lapi.lua_pushnumber;
  exports.lua_pushstring = lapi.lua_pushstring;
  exports.lua_pushthread = lapi.lua_pushthread;
  exports.lua_pushvalue = lapi.lua_pushvalue;
  exports.lua_pushvfstring = lapi.lua_pushvfstring;
  exports.lua_rawequal = lapi.lua_rawequal;
  exports.lua_rawget = lapi.lua_rawget;
  exports.lua_rawgeti = lapi.lua_rawgeti;
  exports.lua_rawgetp = lapi.lua_rawgetp;
  exports.lua_rawlen = lapi.lua_rawlen;
  exports.lua_rawset = lapi.lua_rawset;
  exports.lua_rawseti = lapi.lua_rawseti;
  exports.lua_rawsetp = lapi.lua_rawsetp;
  exports.lua_register = lapi.lua_register;
  exports.lua_remove = lapi.lua_remove;
  exports.lua_replace = lapi.lua_replace;
  exports.lua_resume = ldo.lua_resume;
  exports.lua_rotate = lapi.lua_rotate;
  exports.lua_setallof = ldo.lua_setallof;
  exports.lua_setfield = lapi.lua_setfield;
  exports.lua_setglobal = lapi.lua_setglobal;
  exports.lua_sethook = ldebug.lua_sethook;
  exports.lua_seti = lapi.lua_seti;
  exports.lua_setlocal = ldebug.lua_setlocal;
  exports.lua_setmetatable = lapi.lua_setmetatable;
  exports.lua_settable = lapi.lua_settable;
  exports.lua_settop = lapi.lua_settop;
  exports.lua_setupvalue = lapi.lua_setupvalue;
  exports.lua_setuservalue = lapi.lua_setuservalue;
  exports.lua_status = lapi.lua_status;
  exports.lua_stringtonumber = lapi.lua_stringtonumber;
  exports.lua_toboolean = lapi.lua_toboolean;
  exports.lua_todataview = lapi.lua_todataview;
  exports.lua_tointeger = lapi.lua_tointeger;
  exports.lua_tointegerx = lapi.lua_tointegerx;
  exports.lua_tojsstring = lapi.lua_tojsstring;
  exports.lua_tolstring = lapi.lua_tolstring;
  exports.lua_tonumber = lapi.lua_tonumber;
  exports.lua_tonumberx = lapi.lua_tonumberx;
  exports.lua_topointer = lapi.lua_topointer;
  exports.lua_toproxy = lapi.lua_toproxy;
  exports.lua_tostring = lapi.lua_tostring;
  exports.lua_tothread = lapi.lua_tothread;
  exports.lua_touserdata = lapi.lua_touserdata;
  exports.lua_type = lapi.lua_type;
  exports.lua_typename = lapi.lua_typename;
  exports.lua_upvalueid = lapi.lua_upvalueid;
  exports.lua_upvaluejoin = lapi.lua_upvaluejoin;
  exports.lua_version = lapi.lua_version;
  exports.lua_xmove = lapi.lua_xmove;
  exports.lua_yield = ldo.lua_yield;
  exports.lua_yieldk = ldo.lua_yieldk;
  exports.lua_tocfunction = lapi.lua_tocfunction;
});

// node_modules/fengari/src/lauxlib.js
var require_lauxlib = __commonJS(function(exports, module) {
  var {
    LUAL_BUFFERSIZE
  } = require_luaconf();
  var {
    LUA_ERRERR,
    LUA_MULTRET,
    LUA_REGISTRYINDEX,
    LUA_SIGNATURE,
    LUA_TBOOLEAN,
    LUA_TLIGHTUSERDATA,
    LUA_TNIL,
    LUA_TNONE,
    LUA_TNUMBER,
    LUA_TSTRING,
    LUA_TTABLE,
    LUA_VERSION_NUM,
    lua_Debug,
    lua_absindex,
    lua_atpanic,
    lua_call,
    lua_checkstack,
    lua_concat,
    lua_copy,
    lua_createtable,
    lua_error,
    lua_getfield,
    lua_getinfo,
    lua_getmetatable,
    lua_getstack,
    lua_gettop,
    lua_insert,
    lua_isinteger,
    lua_isnil,
    lua_isnumber,
    lua_isstring,
    lua_istable,
    lua_len,
    lua_load,
    lua_newstate,
    lua_newtable,
    lua_next,
    lua_pcall,
    lua_pop,
    lua_pushboolean,
    lua_pushcclosure,
    lua_pushcfunction,
    lua_pushfstring,
    lua_pushinteger,
    lua_pushliteral,
    lua_pushlstring,
    lua_pushnil,
    lua_pushstring,
    lua_pushvalue,
    lua_pushvfstring,
    lua_rawequal,
    lua_rawget,
    lua_rawgeti,
    lua_rawlen,
    lua_rawseti,
    lua_remove,
    lua_setfield,
    lua_setglobal,
    lua_setmetatable,
    lua_settop,
    lua_toboolean,
    lua_tointeger,
    lua_tointegerx,
    lua_tojsstring,
    lua_tolstring,
    lua_tonumber,
    lua_tonumberx,
    lua_topointer,
    lua_tostring,
    lua_touserdata,
    lua_type,
    lua_typename,
    lua_version
  } = require_lua();
  var {
    from_userstring,
    luastring_eq,
    to_luastring,
    to_uristring
  } = require_fengaricore();
  var LUA_ERRFILE = LUA_ERRERR + 1;
  var LUA_LOADED_TABLE = to_luastring("_LOADED");
  var LUA_PRELOAD_TABLE = to_luastring("_PRELOAD");
  var LUA_FILEHANDLE = to_luastring("FILE*");
  var LUAL_NUMSIZES = 4 * 16 + 8;
  var __name = to_luastring("__name");
  var __tostring = to_luastring("__tostring");
  var empty = new Uint8Array(0);

  class luaL_Buffer {
    constructor() {
      this.L = null;
      this.b = empty;
      this.n = 0;
    }
  }
  var LEVELS1 = 10;
  var LEVELS2 = 11;
  var findfield = function(L, objidx, level) {
    if (level === 0 || !lua_istable(L, -1))
      return 0;
    lua_pushnil(L);
    while (lua_next(L, -2)) {
      if (lua_type(L, -2) === LUA_TSTRING) {
        if (lua_rawequal(L, objidx, -1)) {
          lua_pop(L, 1);
          return 1;
        } else if (findfield(L, objidx, level - 1)) {
          lua_remove(L, -2);
          lua_pushliteral(L, ".");
          lua_insert(L, -2);
          lua_concat(L, 3);
          return 1;
        }
      }
      lua_pop(L, 1);
    }
    return 0;
  };
  var pushglobalfuncname = function(L, ar) {
    let top = lua_gettop(L);
    lua_getinfo(L, to_luastring("f"), ar);
    lua_getfield(L, LUA_REGISTRYINDEX, LUA_LOADED_TABLE);
    if (findfield(L, top + 1, 2)) {
      let name = lua_tostring(L, -1);
      if (name[0] === 95 && name[1] === 71 && name[2] === 46) {
        lua_pushstring(L, name.subarray(3));
        lua_remove(L, -2);
      }
      lua_copy(L, -1, top + 1);
      lua_pop(L, 2);
      return 1;
    } else {
      lua_settop(L, top);
      return 0;
    }
  };
  var pushfuncname = function(L, ar) {
    if (pushglobalfuncname(L, ar)) {
      lua_pushfstring(L, to_luastring("function '%s'"), lua_tostring(L, -1));
      lua_remove(L, -2);
    } else if (ar.namewhat.length !== 0)
      lua_pushfstring(L, to_luastring("%s '%s'"), ar.namewhat, ar.name);
    else if (ar.what && ar.what[0] === 109)
      lua_pushliteral(L, "main chunk");
    else if (ar.what && ar.what[0] === 76)
      lua_pushfstring(L, to_luastring("function <%s:%d>"), ar.short_src, ar.linedefined);
    else
      lua_pushliteral(L, "?");
  };
  var lastlevel = function(L) {
    let ar = new lua_Debug;
    let li = 1;
    let le = 1;
    while (lua_getstack(L, le, ar)) {
      li = le;
      le *= 2;
    }
    while (li < le) {
      let m = Math.floor((li + le) / 2);
      if (lua_getstack(L, m, ar))
        li = m + 1;
      else
        le = m;
    }
    return le - 1;
  };
  var luaL_traceback = function(L, L1, msg, level) {
    let ar = new lua_Debug;
    let top = lua_gettop(L);
    let last = lastlevel(L1);
    let n1 = last - level > LEVELS1 + LEVELS2 ? LEVELS1 : -1;
    if (msg)
      lua_pushfstring(L, to_luastring(`%s
`), msg);
    luaL_checkstack(L, 10, null);
    lua_pushliteral(L, "stack traceback:");
    while (lua_getstack(L1, level++, ar)) {
      if (n1-- === 0) {
        lua_pushliteral(L, `
	...`);
        level = last - LEVELS2 + 1;
      } else {
        lua_getinfo(L1, to_luastring("Slnt", true), ar);
        lua_pushfstring(L, to_luastring(`
	%s:`), ar.short_src);
        if (ar.currentline > 0)
          lua_pushliteral(L, `${ar.currentline}:`);
        lua_pushliteral(L, " in ");
        pushfuncname(L, ar);
        if (ar.istailcall)
          lua_pushliteral(L, `
	(...tail calls..)`);
        lua_concat(L, lua_gettop(L) - top);
      }
    }
    lua_concat(L, lua_gettop(L) - top);
  };
  var panic = function(L) {
    let msg = "PANIC: unprotected error in call to Lua API (" + lua_tojsstring(L, -1) + ")";
    throw new Error(msg);
  };
  var luaL_argerror = function(L, arg, extramsg) {
    let ar = new lua_Debug;
    if (!lua_getstack(L, 0, ar))
      return luaL_error(L, to_luastring("bad argument #%d (%s)"), arg, extramsg);
    lua_getinfo(L, to_luastring("n"), ar);
    if (luastring_eq(ar.namewhat, to_luastring("method"))) {
      arg--;
      if (arg === 0)
        return luaL_error(L, to_luastring("calling '%s' on bad self (%s)"), ar.name, extramsg);
    }
    if (ar.name === null)
      ar.name = pushglobalfuncname(L, ar) ? lua_tostring(L, -1) : to_luastring("?");
    return luaL_error(L, to_luastring("bad argument #%d to '%s' (%s)"), arg, ar.name, extramsg);
  };
  var typeerror = function(L, arg, tname) {
    let typearg;
    if (luaL_getmetafield(L, arg, __name) === LUA_TSTRING)
      typearg = lua_tostring(L, -1);
    else if (lua_type(L, arg) === LUA_TLIGHTUSERDATA)
      typearg = to_luastring("light userdata", true);
    else
      typearg = luaL_typename(L, arg);
    let msg = lua_pushfstring(L, to_luastring("%s expected, got %s"), tname, typearg);
    return luaL_argerror(L, arg, msg);
  };
  var luaL_where = function(L, level) {
    let ar = new lua_Debug;
    if (lua_getstack(L, level, ar)) {
      lua_getinfo(L, to_luastring("Sl", true), ar);
      if (ar.currentline > 0) {
        lua_pushfstring(L, to_luastring("%s:%d: "), ar.short_src, ar.currentline);
        return;
      }
    }
    lua_pushstring(L, to_luastring(""));
  };
  var luaL_error = function(L, fmt, ...argp) {
    luaL_where(L, 1);
    lua_pushvfstring(L, fmt, argp);
    lua_concat(L, 2);
    return lua_error(L);
  };
  var luaL_fileresult = function(L, stat, fname, e) {
    if (stat) {
      lua_pushboolean(L, 1);
      return 1;
    } else {
      lua_pushnil(L);
      let message, errno;
      if (e) {
        message = e.message;
        errno = -e.errno;
      } else {
        message = "Success";
        errno = 0;
      }
      if (fname)
        lua_pushfstring(L, to_luastring("%s: %s"), fname, to_luastring(message));
      else
        lua_pushstring(L, to_luastring(message));
      lua_pushinteger(L, errno);
      return 3;
    }
  };
  var luaL_execresult = function(L, e) {
    let what, stat;
    if (e === null) {
      lua_pushboolean(L, 1);
      lua_pushliteral(L, "exit");
      lua_pushinteger(L, 0);
      return 3;
    } else if (e.status) {
      what = "exit";
      stat = e.status;
    } else if (e.signal) {
      what = "signal";
      stat = e.signal;
    } else {
      return luaL_fileresult(L, 0, null, e);
    }
    lua_pushnil(L);
    lua_pushliteral(L, what);
    lua_pushinteger(L, stat);
    return 3;
  };
  var luaL_getmetatable = function(L, n) {
    return lua_getfield(L, LUA_REGISTRYINDEX, n);
  };
  var luaL_newmetatable = function(L, tname) {
    if (luaL_getmetatable(L, tname) !== LUA_TNIL)
      return 0;
    lua_pop(L, 1);
    lua_createtable(L, 0, 2);
    lua_pushstring(L, tname);
    lua_setfield(L, -2, __name);
    lua_pushvalue(L, -1);
    lua_setfield(L, LUA_REGISTRYINDEX, tname);
    return 1;
  };
  var luaL_setmetatable = function(L, tname) {
    luaL_getmetatable(L, tname);
    lua_setmetatable(L, -2);
  };
  var luaL_testudata = function(L, ud, tname) {
    let p = lua_touserdata(L, ud);
    if (p !== null) {
      if (lua_getmetatable(L, ud)) {
        luaL_getmetatable(L, tname);
        if (!lua_rawequal(L, -1, -2))
          p = null;
        lua_pop(L, 2);
        return p;
      }
    }
    return null;
  };
  var luaL_checkudata = function(L, ud, tname) {
    let p = luaL_testudata(L, ud, tname);
    if (p === null)
      typeerror(L, ud, tname);
    return p;
  };
  var luaL_checkoption = function(L, arg, def, lst) {
    let name = def !== null ? luaL_optstring(L, arg, def) : luaL_checkstring(L, arg);
    for (let i = 0;lst[i]; i++)
      if (luastring_eq(lst[i], name))
        return i;
    return luaL_argerror(L, arg, lua_pushfstring(L, to_luastring("invalid option '%s'"), name));
  };
  var tag_error = function(L, arg, tag) {
    typeerror(L, arg, lua_typename(L, tag));
  };
  var luaL_newstate = function() {
    let L = lua_newstate();
    if (L)
      lua_atpanic(L, panic);
    return L;
  };
  var luaL_typename = function(L, i) {
    return lua_typename(L, lua_type(L, i));
  };
  var luaL_argcheck = function(L, cond, arg, extramsg) {
    if (!cond)
      luaL_argerror(L, arg, extramsg);
  };
  var luaL_checkany = function(L, arg) {
    if (lua_type(L, arg) === LUA_TNONE)
      luaL_argerror(L, arg, to_luastring("value expected", true));
  };
  var luaL_checktype = function(L, arg, t) {
    if (lua_type(L, arg) !== t)
      tag_error(L, arg, t);
  };
  var luaL_checklstring = function(L, arg) {
    let s = lua_tolstring(L, arg);
    if (s === null || s === undefined)
      tag_error(L, arg, LUA_TSTRING);
    return s;
  };
  var luaL_checkstring = luaL_checklstring;
  var luaL_optlstring = function(L, arg, def) {
    if (lua_type(L, arg) <= 0) {
      return def === null ? null : from_userstring(def);
    } else
      return luaL_checklstring(L, arg);
  };
  var luaL_optstring = luaL_optlstring;
  var interror = function(L, arg) {
    if (lua_isnumber(L, arg))
      luaL_argerror(L, arg, to_luastring("number has no integer representation", true));
    else
      tag_error(L, arg, LUA_TNUMBER);
  };
  var luaL_checknumber = function(L, arg) {
    let d = lua_tonumberx(L, arg);
    if (d === false)
      tag_error(L, arg, LUA_TNUMBER);
    return d;
  };
  var luaL_optnumber = function(L, arg, def) {
    return luaL_opt(L, luaL_checknumber, arg, def);
  };
  var luaL_checkinteger = function(L, arg) {
    let d = lua_tointegerx(L, arg);
    if (d === false)
      interror(L, arg);
    return d;
  };
  var luaL_optinteger = function(L, arg, def) {
    return luaL_opt(L, luaL_checkinteger, arg, def);
  };
  var luaL_prepbuffsize = function(B, sz) {
    let newend = B.n + sz;
    if (B.b.length < newend) {
      let newsize = Math.max(B.b.length * 2, newend);
      let newbuff = new Uint8Array(newsize);
      newbuff.set(B.b);
      B.b = newbuff;
    }
    return B.b.subarray(B.n, newend);
  };
  var luaL_buffinit = function(L, B) {
    B.L = L;
    B.b = empty;
  };
  var luaL_buffinitsize = function(L, B, sz) {
    luaL_buffinit(L, B);
    return luaL_prepbuffsize(B, sz);
  };
  var luaL_prepbuffer = function(B) {
    return luaL_prepbuffsize(B, LUAL_BUFFERSIZE);
  };
  var luaL_addlstring = function(B, s, l) {
    if (l > 0) {
      s = from_userstring(s);
      let b = luaL_prepbuffsize(B, l);
      b.set(s.subarray(0, l));
      luaL_addsize(B, l);
    }
  };
  var luaL_addstring = function(B, s) {
    s = from_userstring(s);
    luaL_addlstring(B, s, s.length);
  };
  var luaL_pushresult = function(B) {
    lua_pushlstring(B.L, B.b, B.n);
    B.n = 0;
    B.b = empty;
  };
  var luaL_addchar = function(B, c) {
    luaL_prepbuffsize(B, 1);
    B.b[B.n++] = c;
  };
  var luaL_addsize = function(B, s) {
    B.n += s;
  };
  var luaL_pushresultsize = function(B, sz) {
    luaL_addsize(B, sz);
    luaL_pushresult(B);
  };
  var luaL_addvalue = function(B) {
    let L = B.L;
    let s = lua_tostring(L, -1);
    luaL_addlstring(B, s, s.length);
    lua_pop(L, 1);
  };
  var luaL_opt = function(L, f, n, d) {
    return lua_type(L, n) <= 0 ? d : f(L, n);
  };
  var getS = function(L, ud) {
    let s = ud.string;
    ud.string = null;
    return s;
  };
  var luaL_loadbufferx = function(L, buff, size, name, mode) {
    return lua_load(L, getS, { string: buff }, name, mode);
  };
  var luaL_loadbuffer = function(L, s, sz, n) {
    return luaL_loadbufferx(L, s, sz, n, null);
  };
  var luaL_loadstring = function(L, s) {
    return luaL_loadbuffer(L, s, s.length, s);
  };
  var luaL_dostring = function(L, s) {
    return luaL_loadstring(L, s) || lua_pcall(L, 0, LUA_MULTRET, 0);
  };
  var luaL_getmetafield = function(L, obj, event) {
    if (!lua_getmetatable(L, obj))
      return LUA_TNIL;
    else {
      lua_pushstring(L, event);
      let tt = lua_rawget(L, -2);
      if (tt === LUA_TNIL)
        lua_pop(L, 2);
      else
        lua_remove(L, -2);
      return tt;
    }
  };
  var luaL_callmeta = function(L, obj, event) {
    obj = lua_absindex(L, obj);
    if (luaL_getmetafield(L, obj, event) === LUA_TNIL)
      return false;
    lua_pushvalue(L, obj);
    lua_call(L, 1, 1);
    return true;
  };
  var luaL_len = function(L, idx) {
    lua_len(L, idx);
    let l = lua_tointegerx(L, -1);
    if (l === false)
      luaL_error(L, to_luastring("object length is not an integer", true));
    lua_pop(L, 1);
    return l;
  };
  var p_I = to_luastring("%I");
  var p_f = to_luastring("%f");
  var luaL_tolstring = function(L, idx) {
    if (luaL_callmeta(L, idx, __tostring)) {
      if (!lua_isstring(L, -1))
        luaL_error(L, to_luastring("'__tostring' must return a string"));
    } else {
      let t = lua_type(L, idx);
      switch (t) {
        case LUA_TNUMBER: {
          if (lua_isinteger(L, idx))
            lua_pushfstring(L, p_I, lua_tointeger(L, idx));
          else
            lua_pushfstring(L, p_f, lua_tonumber(L, idx));
          break;
        }
        case LUA_TSTRING:
          lua_pushvalue(L, idx);
          break;
        case LUA_TBOOLEAN:
          lua_pushliteral(L, lua_toboolean(L, idx) ? "true" : "false");
          break;
        case LUA_TNIL:
          lua_pushliteral(L, "nil");
          break;
        default: {
          let tt = luaL_getmetafield(L, idx, __name);
          let kind = tt === LUA_TSTRING ? lua_tostring(L, -1) : luaL_typename(L, idx);
          lua_pushfstring(L, to_luastring("%s: %p"), kind, lua_topointer(L, idx));
          if (tt !== LUA_TNIL)
            lua_remove(L, -2);
          break;
        }
      }
    }
    return lua_tolstring(L, -1);
  };
  var luaL_requiref = function(L, modname, openf, glb) {
    luaL_getsubtable(L, LUA_REGISTRYINDEX, LUA_LOADED_TABLE);
    lua_getfield(L, -1, modname);
    if (!lua_toboolean(L, -1)) {
      lua_pop(L, 1);
      lua_pushcfunction(L, openf);
      lua_pushstring(L, modname);
      lua_call(L, 1, 1);
      lua_pushvalue(L, -1);
      lua_setfield(L, -3, modname);
    }
    lua_remove(L, -2);
    if (glb) {
      lua_pushvalue(L, -1);
      lua_setglobal(L, modname);
    }
  };
  var find_subarray = function(arr, subarr, from_index) {
    var i = from_index >>> 0, sl = subarr.length, l = arr.length + 1 - sl;
    loop:
      for (;i < l; i++) {
        for (let j = 0;j < sl; j++)
          if (arr[i + j] !== subarr[j])
            continue loop;
        return i;
      }
    return -1;
  };
  var luaL_gsub = function(L, s, p, r) {
    let wild;
    let b = new luaL_Buffer;
    luaL_buffinit(L, b);
    while ((wild = find_subarray(s, p)) >= 0) {
      luaL_addlstring(b, s, wild);
      luaL_addstring(b, r);
      s = s.subarray(wild + p.length);
    }
    luaL_addstring(b, s);
    luaL_pushresult(b);
    return lua_tostring(L, -1);
  };
  var luaL_getsubtable = function(L, idx, fname) {
    if (lua_getfield(L, idx, fname) === LUA_TTABLE)
      return true;
    else {
      lua_pop(L, 1);
      idx = lua_absindex(L, idx);
      lua_newtable(L);
      lua_pushvalue(L, -1);
      lua_setfield(L, idx, fname);
      return false;
    }
  };
  var luaL_setfuncs = function(L, l, nup) {
    luaL_checkstack(L, nup, to_luastring("too many upvalues", true));
    for (let lib in l) {
      for (let i = 0;i < nup; i++)
        lua_pushvalue(L, -nup);
      lua_pushcclosure(L, l[lib], nup);
      lua_setfield(L, -(nup + 2), to_luastring(lib));
    }
    lua_pop(L, nup);
  };
  var luaL_checkstack = function(L, space, msg) {
    if (!lua_checkstack(L, space)) {
      if (msg)
        luaL_error(L, to_luastring("stack overflow (%s)"), msg);
      else
        luaL_error(L, to_luastring("stack overflow", true));
    }
  };
  var luaL_newlibtable = function(L) {
    lua_createtable(L);
  };
  var luaL_newlib = function(L, l) {
    lua_createtable(L);
    luaL_setfuncs(L, l, 0);
  };
  var LUA_NOREF = -2;
  var LUA_REFNIL = -1;
  var luaL_ref = function(L, t) {
    let ref;
    if (lua_isnil(L, -1)) {
      lua_pop(L, 1);
      return LUA_REFNIL;
    }
    t = lua_absindex(L, t);
    lua_rawgeti(L, t, 0);
    ref = lua_tointeger(L, -1);
    lua_pop(L, 1);
    if (ref !== 0) {
      lua_rawgeti(L, t, ref);
      lua_rawseti(L, t, 0);
    } else
      ref = lua_rawlen(L, t) + 1;
    lua_rawseti(L, t, ref);
    return ref;
  };
  var luaL_unref = function(L, t, ref) {
    if (ref >= 0) {
      t = lua_absindex(L, t);
      lua_rawgeti(L, t, 0);
      lua_rawseti(L, t, ref);
      lua_pushinteger(L, ref);
      lua_rawseti(L, t, 0);
    }
  };
  var errfile = function(L, what, fnameindex, error) {
    let serr = error.message;
    let filename = lua_tostring(L, fnameindex).subarray(1);
    lua_pushfstring(L, to_luastring("cannot %s %s: %s"), to_luastring(what), filename, to_luastring(serr));
    lua_remove(L, fnameindex);
    return LUA_ERRFILE;
  };
  var getc;
  var utf8_bom = [239, 187, 191];
  var skipBOM = function(lf) {
    lf.n = 0;
    let c;
    let p = 0;
    do {
      c = getc(lf);
      if (c === null || c !== utf8_bom[p])
        return c;
      p++;
      lf.buff[lf.n++] = c;
    } while (p < utf8_bom.length);
    lf.n = 0;
    return getc(lf);
  };
  var skipcomment = function(lf) {
    let c = skipBOM(lf);
    if (c === 35) {
      do {
        c = getc(lf);
      } while (c && c !== 10);
      return {
        skipped: true,
        c: getc(lf)
      };
    } else {
      return {
        skipped: false,
        c
      };
    }
  };
  var luaL_loadfilex;
  if (typeof process === "undefined") {

    class LoadF {
      constructor() {
        this.n = NaN;
        this.f = null;
        this.buff = new Uint8Array(1024);
        this.pos = 0;
        this.err = undefined;
      }
    }
    const getF = function(L, ud) {
      let lf = ud;
      if (lf.f !== null && lf.n > 0) {
        let bytes = lf.n;
        lf.n = 0;
        lf.f = lf.f.subarray(lf.pos);
        return lf.buff.subarray(0, bytes);
      }
      let f = lf.f;
      lf.f = null;
      return f;
    };
    getc = function(lf) {
      return lf.pos < lf.f.length ? lf.f[lf.pos++] : null;
    };
    luaL_loadfilex = function(L, filename, mode) {
      let lf = new LoadF;
      let fnameindex = lua_gettop(L) + 1;
      if (filename === null) {
        throw new Error("Can't read stdin in the browser");
      } else {
        lua_pushfstring(L, to_luastring("@%s"), filename);
        let path = to_uristring(filename);
        let xhr = new XMLHttpRequest;
        xhr.open("GET", path, false);
        if (typeof window === "undefined") {
          xhr.responseType = "arraybuffer";
        }
        xhr.send();
        if (xhr.status >= 200 && xhr.status <= 299) {
          if (typeof xhr.response === "string") {
            lf.f = to_luastring(xhr.response);
          } else {
            lf.f = new Uint8Array(xhr.response);
          }
        } else {
          lf.err = xhr.status;
          return errfile(L, "open", fnameindex, { message: `${xhr.status}: ${xhr.statusText}` });
        }
      }
      let com = skipcomment(lf);
      if (com.c === LUA_SIGNATURE[0] && filename) {} else if (com.skipped) {
        lf.buff[lf.n++] = 10;
      }
      if (com.c !== null)
        lf.buff[lf.n++] = com.c;
      let status = lua_load(L, getF, lf, lua_tostring(L, -1), mode);
      let readstatus = lf.err;
      if (readstatus) {
        lua_settop(L, fnameindex);
        return errfile(L, "read", fnameindex, readstatus);
      }
      lua_remove(L, fnameindex);
      return status;
    };
  } else {
    const fs = {};

    class LoadF {
      constructor() {
        this.n = NaN;
        this.f = null;
        this.buff = Buffer.alloc(1024);
        this.pos = 0;
        this.err = undefined;
      }
    }
    const getF = function(L, ud) {
      let lf = ud;
      let bytes = 0;
      if (lf.n > 0) {
        bytes = lf.n;
        lf.n = 0;
      } else {
        try {
          bytes = fs.readSync(lf.f, lf.buff, 0, lf.buff.length, lf.pos);
        } catch (e) {
          lf.err = e;
          bytes = 0;
        }
        lf.pos += bytes;
      }
      if (bytes > 0)
        return lf.buff.subarray(0, bytes);
      else
        return null;
    };
    getc = function(lf) {
      let b = Buffer.alloc(1);
      let bytes;
      try {
        bytes = fs.readSync(lf.f, b, 0, 1, lf.pos);
      } catch (e) {
        lf.err = e;
        return null;
      }
      lf.pos += bytes;
      return bytes > 0 ? b.readUInt8() : null;
    };
    luaL_loadfilex = function(L, filename, mode) {
      let lf = new LoadF;
      let fnameindex = lua_gettop(L) + 1;
      if (filename === null) {
        lua_pushliteral(L, "=stdin");
        lf.f = process.stdin.fd;
      } else {
        lua_pushfstring(L, to_luastring("@%s"), filename);
        try {
          lf.f = fs.openSync(filename, "r");
        } catch (e) {
          return errfile(L, "open", fnameindex, e);
        }
      }
      let com = skipcomment(lf);
      if (com.c === LUA_SIGNATURE[0] && filename) {} else if (com.skipped) {
        lf.buff[lf.n++] = 10;
      }
      if (com.c !== null)
        lf.buff[lf.n++] = com.c;
      let status = lua_load(L, getF, lf, lua_tostring(L, -1), mode);
      let readstatus = lf.err;
      if (filename)
        try {
          fs.closeSync(lf.f);
        } catch (e) {}
      if (readstatus) {
        lua_settop(L, fnameindex);
        return errfile(L, "read", fnameindex, readstatus);
      }
      lua_remove(L, fnameindex);
      return status;
    };
  }
  var luaL_loadfile = function(L, filename) {
    return luaL_loadfilex(L, filename, null);
  };
  var luaL_dofile = function(L, filename) {
    return luaL_loadfile(L, filename) || lua_pcall(L, 0, LUA_MULTRET, 0);
  };
  var lua_writestringerror = function() {
    for (let i = 0;i < arguments.length; i++) {
      let a = arguments[i];
      if (typeof process === "undefined") {
        do {
          let r = /([^\n]*)\n?([\d\D]*)/.exec(a);
          console.error(r[1]);
          a = r[2];
        } while (a !== "");
      } else {
        process.stderr.write(a);
      }
    }
  };
  var luaL_checkversion_ = function(L, ver, sz) {
    let v = lua_version(L);
    if (sz != LUAL_NUMSIZES)
      luaL_error(L, to_luastring("core and library have incompatible numeric types"));
    if (v != lua_version(null))
      luaL_error(L, to_luastring("multiple Lua VMs detected"));
    else if (v !== ver)
      luaL_error(L, to_luastring("version mismatch: app. needs %f, Lua core provides %f"), ver, v);
  };
  var luaL_checkversion = function(L) {
    luaL_checkversion_(L, LUA_VERSION_NUM, LUAL_NUMSIZES);
  };
  exports.LUA_ERRFILE = LUA_ERRFILE;
  exports.LUA_FILEHANDLE = LUA_FILEHANDLE;
  exports.LUA_LOADED_TABLE = LUA_LOADED_TABLE;
  exports.LUA_NOREF = LUA_NOREF;
  exports.LUA_PRELOAD_TABLE = LUA_PRELOAD_TABLE;
  exports.LUA_REFNIL = LUA_REFNIL;
  exports.luaL_Buffer = luaL_Buffer;
  exports.luaL_addchar = luaL_addchar;
  exports.luaL_addlstring = luaL_addlstring;
  exports.luaL_addsize = luaL_addsize;
  exports.luaL_addstring = luaL_addstring;
  exports.luaL_addvalue = luaL_addvalue;
  exports.luaL_argcheck = luaL_argcheck;
  exports.luaL_argerror = luaL_argerror;
  exports.luaL_buffinit = luaL_buffinit;
  exports.luaL_buffinitsize = luaL_buffinitsize;
  exports.luaL_callmeta = luaL_callmeta;
  exports.luaL_checkany = luaL_checkany;
  exports.luaL_checkinteger = luaL_checkinteger;
  exports.luaL_checklstring = luaL_checklstring;
  exports.luaL_checknumber = luaL_checknumber;
  exports.luaL_checkoption = luaL_checkoption;
  exports.luaL_checkstack = luaL_checkstack;
  exports.luaL_checkstring = luaL_checkstring;
  exports.luaL_checktype = luaL_checktype;
  exports.luaL_checkudata = luaL_checkudata;
  exports.luaL_checkversion = luaL_checkversion;
  exports.luaL_checkversion_ = luaL_checkversion_;
  exports.luaL_dofile = luaL_dofile;
  exports.luaL_dostring = luaL_dostring;
  exports.luaL_error = luaL_error;
  exports.luaL_execresult = luaL_execresult;
  exports.luaL_fileresult = luaL_fileresult;
  exports.luaL_getmetafield = luaL_getmetafield;
  exports.luaL_getmetatable = luaL_getmetatable;
  exports.luaL_getsubtable = luaL_getsubtable;
  exports.luaL_gsub = luaL_gsub;
  exports.luaL_len = luaL_len;
  exports.luaL_loadbuffer = luaL_loadbuffer;
  exports.luaL_loadbufferx = luaL_loadbufferx;
  exports.luaL_loadfile = luaL_loadfile;
  exports.luaL_loadfilex = luaL_loadfilex;
  exports.luaL_loadstring = luaL_loadstring;
  exports.luaL_newlib = luaL_newlib;
  exports.luaL_newlibtable = luaL_newlibtable;
  exports.luaL_newmetatable = luaL_newmetatable;
  exports.luaL_newstate = luaL_newstate;
  exports.luaL_opt = luaL_opt;
  exports.luaL_optinteger = luaL_optinteger;
  exports.luaL_optlstring = luaL_optlstring;
  exports.luaL_optnumber = luaL_optnumber;
  exports.luaL_optstring = luaL_optstring;
  exports.luaL_prepbuffer = luaL_prepbuffer;
  exports.luaL_prepbuffsize = luaL_prepbuffsize;
  exports.luaL_pushresult = luaL_pushresult;
  exports.luaL_pushresultsize = luaL_pushresultsize;
  exports.luaL_ref = luaL_ref;
  exports.luaL_requiref = luaL_requiref;
  exports.luaL_setfuncs = luaL_setfuncs;
  exports.luaL_setmetatable = luaL_setmetatable;
  exports.luaL_testudata = luaL_testudata;
  exports.luaL_tolstring = luaL_tolstring;
  exports.luaL_traceback = luaL_traceback;
  exports.luaL_typename = luaL_typename;
  exports.luaL_unref = luaL_unref;
  exports.luaL_where = luaL_where;
  exports.lua_writestringerror = lua_writestringerror;
});

// node_modules/fengari/src/lbaselib.js
var require_lbaselib = __commonJS(function(exports, module) {
  var {
    LUA_MULTRET,
    LUA_OK,
    LUA_TFUNCTION,
    LUA_TNIL,
    LUA_TNONE,
    LUA_TNUMBER,
    LUA_TSTRING,
    LUA_TTABLE,
    LUA_VERSION,
    LUA_YIELD,
    lua_call,
    lua_callk,
    lua_concat,
    lua_error,
    lua_getglobal,
    lua_geti,
    lua_getmetatable,
    lua_gettop,
    lua_insert,
    lua_isnil,
    lua_isnone,
    lua_isstring,
    lua_load,
    lua_next,
    lua_pcallk,
    lua_pop,
    lua_pushboolean,
    lua_pushcfunction,
    lua_pushglobaltable,
    lua_pushinteger,
    lua_pushliteral,
    lua_pushnil,
    lua_pushstring,
    lua_pushvalue,
    lua_rawequal,
    lua_rawget,
    lua_rawlen,
    lua_rawset,
    lua_remove,
    lua_replace,
    lua_rotate,
    lua_setfield,
    lua_setmetatable,
    lua_settop,
    lua_setupvalue,
    lua_stringtonumber,
    lua_toboolean,
    lua_tolstring,
    lua_tostring,
    lua_type,
    lua_typename
  } = require_lua();
  var {
    luaL_argcheck,
    luaL_checkany,
    luaL_checkinteger,
    luaL_checkoption,
    luaL_checkstack,
    luaL_checktype,
    luaL_error,
    luaL_getmetafield,
    luaL_loadbufferx,
    luaL_loadfile,
    luaL_loadfilex,
    luaL_optinteger,
    luaL_optstring,
    luaL_setfuncs,
    luaL_tolstring,
    luaL_where
  } = require_lauxlib();
  var {
    to_jsstring,
    to_luastring
  } = require_fengaricore();
  var lua_writestring;
  var lua_writeline;
  if (typeof process === "undefined") {
    if (typeof TextDecoder === "function") {
      let buff = "";
      let decoder = new TextDecoder("utf-8");
      lua_writestring = function(s) {
        buff += decoder.decode(s, { stream: true });
      };
      let empty = new Uint8Array(0);
      lua_writeline = function() {
        buff += decoder.decode(empty);
        console.log(buff);
        buff = "";
      };
    } else {
      let buff = [];
      lua_writestring = function(s) {
        try {
          s = to_jsstring(s);
        } catch (e) {
          let copy = new Uint8Array(s.length);
          copy.set(s);
          s = copy;
        }
        buff.push(s);
      };
      lua_writeline = function() {
        console.log.apply(console.log, buff);
        buff = [];
      };
    }
  } else {
    lua_writestring = function(s) {
      process.stdout.write(Buffer.from(s));
    };
    lua_writeline = function() {
      process.stdout.write(`
`);
    };
  }
  var luaB_print = function(L) {
    let n = lua_gettop(L);
    lua_getglobal(L, to_luastring("tostring", true));
    for (let i = 1;i <= n; i++) {
      lua_pushvalue(L, -1);
      lua_pushvalue(L, i);
      lua_call(L, 1, 1);
      let s = lua_tolstring(L, -1);
      if (s === null)
        return luaL_error(L, to_luastring("'tostring' must return a string to 'print'"));
      if (i > 1)
        lua_writestring(to_luastring("\t"));
      lua_writestring(s);
      lua_pop(L, 1);
    }
    lua_writeline();
    return 0;
  };
  var luaB_tostring = function(L) {
    luaL_checkany(L, 1);
    luaL_tolstring(L, 1);
    return 1;
  };
  var luaB_getmetatable = function(L) {
    luaL_checkany(L, 1);
    if (!lua_getmetatable(L, 1)) {
      lua_pushnil(L);
      return 1;
    }
    luaL_getmetafield(L, 1, to_luastring("__metatable", true));
    return 1;
  };
  var luaB_setmetatable = function(L) {
    let t = lua_type(L, 2);
    luaL_checktype(L, 1, LUA_TTABLE);
    luaL_argcheck(L, t === LUA_TNIL || t === LUA_TTABLE, 2, "nil or table expected");
    if (luaL_getmetafield(L, 1, to_luastring("__metatable", true)) !== LUA_TNIL)
      return luaL_error(L, to_luastring("cannot change a protected metatable"));
    lua_settop(L, 2);
    lua_setmetatable(L, 1);
    return 1;
  };
  var luaB_rawequal = function(L) {
    luaL_checkany(L, 1);
    luaL_checkany(L, 2);
    lua_pushboolean(L, lua_rawequal(L, 1, 2));
    return 1;
  };
  var luaB_rawlen = function(L) {
    let t = lua_type(L, 1);
    luaL_argcheck(L, t === LUA_TTABLE || t === LUA_TSTRING, 1, "table or string expected");
    lua_pushinteger(L, lua_rawlen(L, 1));
    return 1;
  };
  var luaB_rawget = function(L) {
    luaL_checktype(L, 1, LUA_TTABLE);
    luaL_checkany(L, 2);
    lua_settop(L, 2);
    lua_rawget(L, 1);
    return 1;
  };
  var luaB_rawset = function(L) {
    luaL_checktype(L, 1, LUA_TTABLE);
    luaL_checkany(L, 2);
    luaL_checkany(L, 3);
    lua_settop(L, 3);
    lua_rawset(L, 1);
    return 1;
  };
  var opts = [
    "stop",
    "restart",
    "collect",
    "count",
    "step",
    "setpause",
    "setstepmul",
    "isrunning"
  ].map((e) => to_luastring(e));
  var luaB_collectgarbage = function(L) {
    luaL_checkoption(L, 1, "collect", opts);
    luaL_optinteger(L, 2, 0);
    luaL_error(L, to_luastring("lua_gc not implemented"));
  };
  var luaB_type = function(L) {
    let t = lua_type(L, 1);
    luaL_argcheck(L, t !== LUA_TNONE, 1, "value expected");
    lua_pushstring(L, lua_typename(L, t));
    return 1;
  };
  var pairsmeta = function(L, method, iszero, iter) {
    luaL_checkany(L, 1);
    if (luaL_getmetafield(L, 1, method) === LUA_TNIL) {
      lua_pushcfunction(L, iter);
      lua_pushvalue(L, 1);
      if (iszero)
        lua_pushinteger(L, 0);
      else
        lua_pushnil(L);
    } else {
      lua_pushvalue(L, 1);
      lua_call(L, 1, 3);
    }
    return 3;
  };
  var luaB_next = function(L) {
    luaL_checktype(L, 1, LUA_TTABLE);
    lua_settop(L, 2);
    if (lua_next(L, 1))
      return 2;
    else {
      lua_pushnil(L);
      return 1;
    }
  };
  var luaB_pairs = function(L) {
    return pairsmeta(L, to_luastring("__pairs", true), 0, luaB_next);
  };
  var ipairsaux = function(L) {
    let i = luaL_checkinteger(L, 2) + 1;
    lua_pushinteger(L, i);
    return lua_geti(L, 1, i) === LUA_TNIL ? 1 : 2;
  };
  var luaB_ipairs = function(L) {
    luaL_checkany(L, 1);
    lua_pushcfunction(L, ipairsaux);
    lua_pushvalue(L, 1);
    lua_pushinteger(L, 0);
    return 3;
  };
  var b_str2int = function(s, base) {
    try {
      s = to_jsstring(s);
    } catch (e) {
      return null;
    }
    let r = /^[\t\v\f \n\r]*([+-]?)0*([0-9A-Za-z]+)[\t\v\f \n\r]*$/.exec(s);
    if (!r)
      return null;
    let v = parseInt(r[1] + r[2], base);
    if (isNaN(v))
      return null;
    return v | 0;
  };
  var luaB_tonumber = function(L) {
    if (lua_type(L, 2) <= 0) {
      luaL_checkany(L, 1);
      if (lua_type(L, 1) === LUA_TNUMBER) {
        lua_settop(L, 1);
        return 1;
      } else {
        let s = lua_tostring(L, 1);
        if (s !== null && lua_stringtonumber(L, s) === s.length + 1)
          return 1;
      }
    } else {
      let base = luaL_checkinteger(L, 2);
      luaL_checktype(L, 1, LUA_TSTRING);
      let s = lua_tostring(L, 1);
      luaL_argcheck(L, 2 <= base && base <= 36, 2, "base out of range");
      let n = b_str2int(s, base);
      if (n !== null) {
        lua_pushinteger(L, n);
        return 1;
      }
    }
    lua_pushnil(L);
    return 1;
  };
  var luaB_error = function(L) {
    let level = luaL_optinteger(L, 2, 1);
    lua_settop(L, 1);
    if (lua_type(L, 1) === LUA_TSTRING && level > 0) {
      luaL_where(L, level);
      lua_pushvalue(L, 1);
      lua_concat(L, 2);
    }
    return lua_error(L);
  };
  var luaB_assert = function(L) {
    if (lua_toboolean(L, 1))
      return lua_gettop(L);
    else {
      luaL_checkany(L, 1);
      lua_remove(L, 1);
      lua_pushliteral(L, "assertion failed!");
      lua_settop(L, 1);
      return luaB_error(L);
    }
  };
  var luaB_select = function(L) {
    let n = lua_gettop(L);
    if (lua_type(L, 1) === LUA_TSTRING && lua_tostring(L, 1)[0] === 35) {
      lua_pushinteger(L, n - 1);
      return 1;
    } else {
      let i = luaL_checkinteger(L, 1);
      if (i < 0)
        i = n + i;
      else if (i > n)
        i = n;
      luaL_argcheck(L, 1 <= i, 1, "index out of range");
      return n - i;
    }
  };
  var finishpcall = function(L, status, extra) {
    if (status !== LUA_OK && status !== LUA_YIELD) {
      lua_pushboolean(L, 0);
      lua_pushvalue(L, -2);
      return 2;
    } else
      return lua_gettop(L) - extra;
  };
  var luaB_pcall = function(L) {
    luaL_checkany(L, 1);
    lua_pushboolean(L, 1);
    lua_insert(L, 1);
    let status = lua_pcallk(L, lua_gettop(L) - 2, LUA_MULTRET, 0, 0, finishpcall);
    return finishpcall(L, status, 0);
  };
  var luaB_xpcall = function(L) {
    let n = lua_gettop(L);
    luaL_checktype(L, 2, LUA_TFUNCTION);
    lua_pushboolean(L, 1);
    lua_pushvalue(L, 1);
    lua_rotate(L, 3, 2);
    let status = lua_pcallk(L, n - 2, LUA_MULTRET, 2, 2, finishpcall);
    return finishpcall(L, status, 2);
  };
  var load_aux = function(L, status, envidx) {
    if (status === LUA_OK) {
      if (envidx !== 0) {
        lua_pushvalue(L, envidx);
        if (!lua_setupvalue(L, -2, 1))
          lua_pop(L, 1);
      }
      return 1;
    } else {
      lua_pushnil(L);
      lua_insert(L, -2);
      return 2;
    }
  };
  var RESERVEDSLOT = 5;
  var generic_reader = function(L, ud) {
    luaL_checkstack(L, 2, "too many nested functions");
    lua_pushvalue(L, 1);
    lua_call(L, 0, 1);
    if (lua_isnil(L, -1)) {
      lua_pop(L, 1);
      return null;
    } else if (!lua_isstring(L, -1))
      luaL_error(L, to_luastring("reader function must return a string"));
    lua_replace(L, RESERVEDSLOT);
    return lua_tostring(L, RESERVEDSLOT);
  };
  var luaB_load = function(L) {
    let s = lua_tostring(L, 1);
    let mode = luaL_optstring(L, 3, "bt");
    let env = !lua_isnone(L, 4) ? 4 : 0;
    let status;
    if (s !== null) {
      let chunkname = luaL_optstring(L, 2, s);
      status = luaL_loadbufferx(L, s, s.length, chunkname, mode);
    } else {
      let chunkname = luaL_optstring(L, 2, "=(load)");
      luaL_checktype(L, 1, LUA_TFUNCTION);
      lua_settop(L, RESERVEDSLOT);
      status = lua_load(L, generic_reader, null, chunkname, mode);
    }
    return load_aux(L, status, env);
  };
  var luaB_loadfile = function(L) {
    let fname = luaL_optstring(L, 1, null);
    let mode = luaL_optstring(L, 2, null);
    let env = !lua_isnone(L, 3) ? 3 : 0;
    let status = luaL_loadfilex(L, fname, mode);
    return load_aux(L, status, env);
  };
  var dofilecont = function(L, d1, d2) {
    return lua_gettop(L) - 1;
  };
  var luaB_dofile = function(L) {
    let fname = luaL_optstring(L, 1, null);
    lua_settop(L, 1);
    if (luaL_loadfile(L, fname) !== LUA_OK)
      return lua_error(L);
    lua_callk(L, 0, LUA_MULTRET, 0, dofilecont);
    return dofilecont(L, 0, 0);
  };
  var base_funcs = {
    assert: luaB_assert,
    collectgarbage: luaB_collectgarbage,
    dofile: luaB_dofile,
    error: luaB_error,
    getmetatable: luaB_getmetatable,
    ipairs: luaB_ipairs,
    load: luaB_load,
    loadfile: luaB_loadfile,
    next: luaB_next,
    pairs: luaB_pairs,
    pcall: luaB_pcall,
    print: luaB_print,
    rawequal: luaB_rawequal,
    rawget: luaB_rawget,
    rawlen: luaB_rawlen,
    rawset: luaB_rawset,
    select: luaB_select,
    setmetatable: luaB_setmetatable,
    tonumber: luaB_tonumber,
    tostring: luaB_tostring,
    type: luaB_type,
    xpcall: luaB_xpcall
  };
  var luaopen_base = function(L) {
    lua_pushglobaltable(L);
    luaL_setfuncs(L, base_funcs, 0);
    lua_pushvalue(L, -1);
    lua_setfield(L, -2, to_luastring("_G"));
    lua_pushliteral(L, LUA_VERSION);
    lua_setfield(L, -2, to_luastring("_VERSION"));
    return 1;
  };
  exports.luaopen_base = luaopen_base;
});

// node_modules/fengari/src/lcorolib.js
var require_lcorolib = __commonJS(function(exports, module) {
  var {
    LUA_OK,
    LUA_TFUNCTION,
    LUA_TSTRING,
    LUA_YIELD,
    lua_Debug,
    lua_checkstack,
    lua_concat,
    lua_error,
    lua_getstack,
    lua_gettop,
    lua_insert,
    lua_isyieldable,
    lua_newthread,
    lua_pop,
    lua_pushboolean,
    lua_pushcclosure,
    lua_pushliteral,
    lua_pushthread,
    lua_pushvalue,
    lua_resume,
    lua_status,
    lua_tothread,
    lua_type,
    lua_upvalueindex,
    lua_xmove,
    lua_yield
  } = require_lua();
  var {
    luaL_argcheck,
    luaL_checktype,
    luaL_newlib,
    luaL_where
  } = require_lauxlib();
  var getco = function(L) {
    let co = lua_tothread(L, 1);
    luaL_argcheck(L, co, 1, "thread expected");
    return co;
  };
  var auxresume = function(L, co, narg) {
    if (!lua_checkstack(co, narg)) {
      lua_pushliteral(L, "too many arguments to resume");
      return -1;
    }
    if (lua_status(co) === LUA_OK && lua_gettop(co) === 0) {
      lua_pushliteral(L, "cannot resume dead coroutine");
      return -1;
    }
    lua_xmove(L, co, narg);
    let status = lua_resume(co, L, narg);
    if (status === LUA_OK || status === LUA_YIELD) {
      let nres = lua_gettop(co);
      if (!lua_checkstack(L, nres + 1)) {
        lua_pop(co, nres);
        lua_pushliteral(L, "too many results to resume");
        return -1;
      }
      lua_xmove(co, L, nres);
      return nres;
    } else {
      lua_xmove(co, L, 1);
      return -1;
    }
  };
  var luaB_coresume = function(L) {
    let co = getco(L);
    let r = auxresume(L, co, lua_gettop(L) - 1);
    if (r < 0) {
      lua_pushboolean(L, 0);
      lua_insert(L, -2);
      return 2;
    } else {
      lua_pushboolean(L, 1);
      lua_insert(L, -(r + 1));
      return r + 1;
    }
  };
  var luaB_auxwrap = function(L) {
    let co = lua_tothread(L, lua_upvalueindex(1));
    let r = auxresume(L, co, lua_gettop(L));
    if (r < 0) {
      if (lua_type(L, -1) === LUA_TSTRING) {
        luaL_where(L, 1);
        lua_insert(L, -2);
        lua_concat(L, 2);
      }
      return lua_error(L);
    }
    return r;
  };
  var luaB_cocreate = function(L) {
    luaL_checktype(L, 1, LUA_TFUNCTION);
    let NL = lua_newthread(L);
    lua_pushvalue(L, 1);
    lua_xmove(L, NL, 1);
    return 1;
  };
  var luaB_cowrap = function(L) {
    luaB_cocreate(L);
    lua_pushcclosure(L, luaB_auxwrap, 1);
    return 1;
  };
  var luaB_yield = function(L) {
    return lua_yield(L, lua_gettop(L));
  };
  var luaB_costatus = function(L) {
    let co = getco(L);
    if (L === co)
      lua_pushliteral(L, "running");
    else {
      switch (lua_status(co)) {
        case LUA_YIELD:
          lua_pushliteral(L, "suspended");
          break;
        case LUA_OK: {
          let ar = new lua_Debug;
          if (lua_getstack(co, 0, ar) > 0)
            lua_pushliteral(L, "normal");
          else if (lua_gettop(co) === 0)
            lua_pushliteral(L, "dead");
          else
            lua_pushliteral(L, "suspended");
          break;
        }
        default:
          lua_pushliteral(L, "dead");
          break;
      }
    }
    return 1;
  };
  var luaB_yieldable = function(L) {
    lua_pushboolean(L, lua_isyieldable(L));
    return 1;
  };
  var luaB_corunning = function(L) {
    lua_pushboolean(L, lua_pushthread(L));
    return 2;
  };
  var co_funcs = {
    create: luaB_cocreate,
    isyieldable: luaB_yieldable,
    resume: luaB_coresume,
    running: luaB_corunning,
    status: luaB_costatus,
    wrap: luaB_cowrap,
    yield: luaB_yield
  };
  var luaopen_coroutine = function(L) {
    luaL_newlib(L, co_funcs);
    return 1;
  };
  exports.luaopen_coroutine = luaopen_coroutine;
});

// node_modules/fengari/src/ltablib.js
var require_ltablib = __commonJS(function(exports, module) {
  var { LUA_MAXINTEGER } = require_luaconf();
  var {
    LUA_OPEQ,
    LUA_OPLT,
    LUA_TFUNCTION,
    LUA_TNIL,
    LUA_TTABLE,
    lua_call,
    lua_checkstack,
    lua_compare,
    lua_createtable,
    lua_geti,
    lua_getmetatable,
    lua_gettop,
    lua_insert,
    lua_isnil,
    lua_isnoneornil,
    lua_isstring,
    lua_pop,
    lua_pushinteger,
    lua_pushnil,
    lua_pushstring,
    lua_pushvalue,
    lua_rawget,
    lua_setfield,
    lua_seti,
    lua_settop,
    lua_toboolean,
    lua_type
  } = require_lua();
  var {
    luaL_Buffer,
    luaL_addlstring,
    luaL_addvalue,
    luaL_argcheck,
    luaL_buffinit,
    luaL_checkinteger,
    luaL_checktype,
    luaL_error,
    luaL_len,
    luaL_newlib,
    luaL_opt,
    luaL_optinteger,
    luaL_optlstring,
    luaL_pushresult,
    luaL_typename
  } = require_lauxlib();
  var lualib = require_lualib();
  var { to_luastring } = require_fengaricore();
  var TAB_R = 1;
  var TAB_W = 2;
  var TAB_L = 4;
  var TAB_RW = TAB_R | TAB_W;
  var checkfield = function(L, key, n) {
    lua_pushstring(L, key);
    return lua_rawget(L, -n) !== LUA_TNIL;
  };
  var checktab = function(L, arg, what) {
    if (lua_type(L, arg) !== LUA_TTABLE) {
      let n = 1;
      if (lua_getmetatable(L, arg) && (!(what & TAB_R) || checkfield(L, to_luastring("__index", true), ++n)) && (!(what & TAB_W) || checkfield(L, to_luastring("__newindex", true), ++n)) && (!(what & TAB_L) || checkfield(L, to_luastring("__len", true), ++n))) {
        lua_pop(L, n);
      } else
        luaL_checktype(L, arg, LUA_TTABLE);
    }
  };
  var aux_getn = function(L, n, w) {
    checktab(L, n, w | TAB_L);
    return luaL_len(L, n);
  };
  var addfield = function(L, b, i) {
    lua_geti(L, 1, i);
    if (!lua_isstring(L, -1))
      luaL_error(L, to_luastring("invalid value (%s) at index %d in table for 'concat'"), luaL_typename(L, -1), i);
    luaL_addvalue(b);
  };
  var tinsert = function(L) {
    let e = aux_getn(L, 1, TAB_RW) + 1;
    let pos;
    switch (lua_gettop(L)) {
      case 2:
        pos = e;
        break;
      case 3: {
        pos = luaL_checkinteger(L, 2);
        luaL_argcheck(L, 1 <= pos && pos <= e, 2, "position out of bounds");
        for (let i = e;i > pos; i--) {
          lua_geti(L, 1, i - 1);
          lua_seti(L, 1, i);
        }
        break;
      }
      default: {
        return luaL_error(L, "wrong number of arguments to 'insert'");
      }
    }
    lua_seti(L, 1, pos);
    return 0;
  };
  var tremove = function(L) {
    let size = aux_getn(L, 1, TAB_RW);
    let pos = luaL_optinteger(L, 2, size);
    if (pos !== size)
      luaL_argcheck(L, 1 <= pos && pos <= size + 1, 1, "position out of bounds");
    lua_geti(L, 1, pos);
    for (;pos < size; pos++) {
      lua_geti(L, 1, pos + 1);
      lua_seti(L, 1, pos);
    }
    lua_pushnil(L);
    lua_seti(L, 1, pos);
    return 1;
  };
  var tmove = function(L) {
    let f = luaL_checkinteger(L, 2);
    let e = luaL_checkinteger(L, 3);
    let t = luaL_checkinteger(L, 4);
    let tt = !lua_isnoneornil(L, 5) ? 5 : 1;
    checktab(L, 1, TAB_R);
    checktab(L, tt, TAB_W);
    if (e >= f) {
      luaL_argcheck(L, f > 0 || e < LUA_MAXINTEGER + f, 3, "too many elements to move");
      let n = e - f + 1;
      luaL_argcheck(L, t <= LUA_MAXINTEGER - n + 1, 4, "destination wrap around");
      if (t > e || t <= f || tt !== 1 && lua_compare(L, 1, tt, LUA_OPEQ) !== 1) {
        for (let i = 0;i < n; i++) {
          lua_geti(L, 1, f + i);
          lua_seti(L, tt, t + i);
        }
      } else {
        for (let i = n - 1;i >= 0; i--) {
          lua_geti(L, 1, f + i);
          lua_seti(L, tt, t + i);
        }
      }
    }
    lua_pushvalue(L, tt);
    return 1;
  };
  var tconcat = function(L) {
    let last = aux_getn(L, 1, TAB_R);
    let sep = luaL_optlstring(L, 2, "");
    let lsep = sep.length;
    let i = luaL_optinteger(L, 3, 1);
    last = luaL_optinteger(L, 4, last);
    let b = new luaL_Buffer;
    luaL_buffinit(L, b);
    for (;i < last; i++) {
      addfield(L, b, i);
      luaL_addlstring(b, sep, lsep);
    }
    if (i === last)
      addfield(L, b, i);
    luaL_pushresult(b);
    return 1;
  };
  var pack = function(L) {
    let n = lua_gettop(L);
    lua_createtable(L, n, 1);
    lua_insert(L, 1);
    for (let i = n;i >= 1; i--)
      lua_seti(L, 1, i);
    lua_pushinteger(L, n);
    lua_setfield(L, 1, to_luastring("n"));
    return 1;
  };
  var unpack = function(L) {
    let i = luaL_optinteger(L, 2, 1);
    let e = luaL_opt(L, luaL_checkinteger, 3, luaL_len(L, 1));
    if (i > e)
      return 0;
    let n = e - i;
    if (n >= Number.MAX_SAFE_INTEGER || !lua_checkstack(L, ++n))
      return luaL_error(L, to_luastring("too many results to unpack"));
    for (;i < e; i++)
      lua_geti(L, 1, i);
    lua_geti(L, 1, e);
    return n;
  };
  var l_randomizePivot = function() {
    return Math.floor(Math.random() * 4294967296);
  };
  var RANLIMIT = 100;
  var set2 = function(L, i, j) {
    lua_seti(L, 1, i);
    lua_seti(L, 1, j);
  };
  var sort_comp = function(L, a, b) {
    if (lua_isnil(L, 2))
      return lua_compare(L, a, b, LUA_OPLT);
    else {
      lua_pushvalue(L, 2);
      lua_pushvalue(L, a - 1);
      lua_pushvalue(L, b - 2);
      lua_call(L, 2, 1);
      let res = lua_toboolean(L, -1);
      lua_pop(L, 1);
      return res;
    }
  };
  var partition = function(L, lo, up) {
    let i = lo;
    let j = up - 1;
    for (;; ) {
      while (lua_geti(L, 1, ++i), sort_comp(L, -1, -2)) {
        if (i == up - 1)
          luaL_error(L, to_luastring("invalid order function for sorting"));
        lua_pop(L, 1);
      }
      while (lua_geti(L, 1, --j), sort_comp(L, -3, -1)) {
        if (j < i)
          luaL_error(L, to_luastring("invalid order function for sorting"));
        lua_pop(L, 1);
      }
      if (j < i) {
        lua_pop(L, 1);
        set2(L, up - 1, i);
        return i;
      }
      set2(L, i, j);
    }
  };
  var choosePivot = function(lo, up, rnd) {
    let r4 = Math.floor((up - lo) / 4);
    let p = rnd % (r4 * 2) + (lo + r4);
    lualib.lua_assert(lo + r4 <= p && p <= up - r4);
    return p;
  };
  var auxsort = function(L, lo, up, rnd) {
    while (lo < up) {
      lua_geti(L, 1, lo);
      lua_geti(L, 1, up);
      if (sort_comp(L, -1, -2))
        set2(L, lo, up);
      else
        lua_pop(L, 2);
      if (up - lo == 1)
        return;
      let p;
      if (up - lo < RANLIMIT || rnd === 0)
        p = Math.floor((lo + up) / 2);
      else
        p = choosePivot(lo, up, rnd);
      lua_geti(L, 1, p);
      lua_geti(L, 1, lo);
      if (sort_comp(L, -2, -1))
        set2(L, p, lo);
      else {
        lua_pop(L, 1);
        lua_geti(L, 1, up);
        if (sort_comp(L, -1, -2))
          set2(L, p, up);
        else
          lua_pop(L, 2);
      }
      if (up - lo == 2)
        return;
      lua_geti(L, 1, p);
      lua_pushvalue(L, -1);
      lua_geti(L, 1, up - 1);
      set2(L, p, up - 1);
      p = partition(L, lo, up);
      let n;
      if (p - lo < up - p) {
        auxsort(L, lo, p - 1, rnd);
        n = p - lo;
        lo = p + 1;
      } else {
        auxsort(L, p + 1, up, rnd);
        n = up - p;
        up = p - 1;
      }
      if ((up - lo) / 128 > n)
        rnd = l_randomizePivot();
    }
  };
  var sort = function(L) {
    let n = aux_getn(L, 1, TAB_RW);
    if (n > 1) {
      luaL_argcheck(L, n < LUA_MAXINTEGER, 1, "array too big");
      if (!lua_isnoneornil(L, 2))
        luaL_checktype(L, 2, LUA_TFUNCTION);
      lua_settop(L, 2);
      auxsort(L, 1, n, 0);
    }
    return 0;
  };
  var tab_funcs = {
    concat: tconcat,
    insert: tinsert,
    move: tmove,
    pack,
    remove: tremove,
    sort,
    unpack
  };
  var luaopen_table = function(L) {
    luaL_newlib(L, tab_funcs);
    return 1;
  };
  exports.luaopen_table = luaopen_table;
});

// node_modules/fengari/src/liolib.js
var require_liolib = __commonJS(function(exports, module) {
  var { lua_newtable } = require_lua();
  exports.luaopen_io = (L) => {
    lua_newtable(L);
    return 1;
  };
});

// node_modules/fengari/src/loslib.js
var require_loslib = __commonJS(function(exports, module) {
  var {
    LUA_TNIL,
    LUA_TTABLE,
    lua_close,
    lua_createtable,
    lua_getfield,
    lua_isboolean,
    lua_isnoneornil,
    lua_pop,
    lua_pushboolean,
    lua_pushfstring,
    lua_pushinteger,
    lua_pushliteral,
    lua_pushnil,
    lua_pushnumber,
    lua_pushstring,
    lua_setfield,
    lua_settop,
    lua_toboolean,
    lua_tointegerx
  } = require_lua();
  var {
    luaL_Buffer,
    luaL_addchar,
    luaL_addstring,
    luaL_argerror,
    luaL_buffinit,
    luaL_checkinteger,
    luaL_checkstring,
    luaL_checktype,
    luaL_error,
    luaL_execresult,
    luaL_fileresult,
    luaL_newlib,
    luaL_optinteger,
    luaL_optlstring,
    luaL_optstring,
    luaL_pushresult
  } = require_lauxlib();
  var {
    luastring_eq,
    to_jsstring,
    to_luastring
  } = require_fengaricore();
  var LUA_STRFTIMEOPTIONS = to_luastring("aAbBcCdDeFhHIjklmMnpPrRStTuUwWxXyYzZ%");
  var setfield = function(L, key, value) {
    lua_pushinteger(L, value);
    lua_setfield(L, -2, to_luastring(key, true));
  };
  var setallfields = function(L, time, utc) {
    setfield(L, "sec", utc ? time.getUTCSeconds() : time.getSeconds());
    setfield(L, "min", utc ? time.getUTCMinutes() : time.getMinutes());
    setfield(L, "hour", utc ? time.getUTCHours() : time.getHours());
    setfield(L, "day", utc ? time.getUTCDate() : time.getDate());
    setfield(L, "month", (utc ? time.getUTCMonth() : time.getMonth()) + 1);
    setfield(L, "year", utc ? time.getUTCFullYear() : time.getFullYear());
    setfield(L, "wday", (utc ? time.getUTCDay() : time.getDay()) + 1);
    setfield(L, "yday", Math.floor((time - new Date(time.getFullYear(), 0, 0)) / 86400000));
  };
  var L_MAXDATEFIELD = Number.MAX_SAFE_INTEGER / 2;
  var getfield = function(L, key, d, delta) {
    let t = lua_getfield(L, -1, to_luastring(key, true));
    let res = lua_tointegerx(L, -1);
    if (res === false) {
      if (t !== LUA_TNIL)
        return luaL_error(L, to_luastring("field '%s' is not an integer"), key);
      else if (d < 0)
        return luaL_error(L, to_luastring("field '%s' missing in date table"), key);
      res = d;
    } else {
      if (!(-L_MAXDATEFIELD <= res && res <= L_MAXDATEFIELD))
        return luaL_error(L, to_luastring("field '%s' is out-of-bound"), key);
      res -= delta;
    }
    lua_pop(L, 1);
    return res;
  };
  var locale = {
    days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((s) => to_luastring(s)),
    shortDays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((s) => to_luastring(s)),
    months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map((s) => to_luastring(s)),
    shortMonths: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((s) => to_luastring(s)),
    AM: to_luastring("AM"),
    PM: to_luastring("PM"),
    am: to_luastring("am"),
    pm: to_luastring("pm"),
    formats: {
      c: to_luastring("%a %b %e %H:%M:%S %Y"),
      D: to_luastring("%m/%d/%y"),
      F: to_luastring("%Y-%m-%d"),
      R: to_luastring("%H:%M"),
      r: to_luastring("%I:%M:%S %p"),
      T: to_luastring("%H:%M:%S"),
      X: to_luastring("%T"),
      x: to_luastring("%D")
    }
  };
  var week_number = function(date, start_of_week) {
    let weekday = date.getDay();
    if (start_of_week === "monday") {
      if (weekday === 0)
        weekday = 6;
      else
        weekday--;
    }
    let yday = (date - new Date(date.getFullYear(), 0, 1)) / 86400000;
    return Math.floor((yday + 7 - weekday) / 7);
  };
  var push_pad_2 = function(b, n, pad) {
    if (n < 10)
      luaL_addchar(b, pad);
    luaL_addstring(b, to_luastring(String(n)));
  };
  var strftime = function(L, b, s, date) {
    let i = 0;
    while (i < s.length) {
      if (s[i] !== 37) {
        luaL_addchar(b, s[i++]);
      } else {
        i++;
        let len = checkoption(L, s, i);
        switch (s[i]) {
          case 37:
            luaL_addchar(b, 37);
            break;
          case 65:
            luaL_addstring(b, locale.days[date.getDay()]);
            break;
          case 66:
            luaL_addstring(b, locale.months[date.getMonth()]);
            break;
          case 67:
            push_pad_2(b, Math.floor(date.getFullYear() / 100), 48);
            break;
          case 68:
            strftime(L, b, locale.formats.D, date);
            break;
          case 70:
            strftime(L, b, locale.formats.F, date);
            break;
          case 72:
            push_pad_2(b, date.getHours(), 48);
            break;
          case 73:
            push_pad_2(b, (date.getHours() + 11) % 12 + 1, 48);
            break;
          case 77:
            push_pad_2(b, date.getMinutes(), 48);
            break;
          case 80:
            luaL_addstring(b, date.getHours() < 12 ? locale.am : locale.pm);
            break;
          case 82:
            strftime(L, b, locale.formats.R, date);
            break;
          case 83:
            push_pad_2(b, date.getSeconds(), 48);
            break;
          case 84:
            strftime(L, b, locale.formats.T, date);
            break;
          case 85:
            push_pad_2(b, week_number(date, "sunday"), 48);
            break;
          case 87:
            push_pad_2(b, week_number(date, "monday"), 48);
            break;
          case 88:
            strftime(L, b, locale.formats.X, date);
            break;
          case 89:
            luaL_addstring(b, to_luastring(String(date.getFullYear())));
            break;
          case 90: {
            let tzString = date.toString().match(/\(([\w\s]+)\)/);
            if (tzString)
              luaL_addstring(b, to_luastring(tzString[1]));
            break;
          }
          case 97:
            luaL_addstring(b, locale.shortDays[date.getDay()]);
            break;
          case 98:
          case 104:
            luaL_addstring(b, locale.shortMonths[date.getMonth()]);
            break;
          case 99:
            strftime(L, b, locale.formats.c, date);
            break;
          case 100:
            push_pad_2(b, date.getDate(), 48);
            break;
          case 101:
            push_pad_2(b, date.getDate(), 32);
            break;
          case 106: {
            let yday = Math.floor((date - new Date(date.getFullYear(), 0, 1)) / 86400000);
            if (yday < 100) {
              if (yday < 10)
                luaL_addchar(b, 48);
              luaL_addchar(b, 48);
            }
            luaL_addstring(b, to_luastring(String(yday)));
            break;
          }
          case 107:
            push_pad_2(b, date.getHours(), 32);
            break;
          case 108:
            push_pad_2(b, (date.getHours() + 11) % 12 + 1, 32);
            break;
          case 109:
            push_pad_2(b, date.getMonth() + 1, 48);
            break;
          case 110:
            luaL_addchar(b, 10);
            break;
          case 112:
            luaL_addstring(b, date.getHours() < 12 ? locale.AM : locale.PM);
            break;
          case 114:
            strftime(L, b, locale.formats.r, date);
            break;
          case 115:
            luaL_addstring(b, to_luastring(String(Math.floor(date / 1000))));
            break;
          case 116:
            luaL_addchar(b, 8);
            break;
          case 117: {
            let day = date.getDay();
            luaL_addstring(b, to_luastring(String(day === 0 ? 7 : day)));
            break;
          }
          case 119:
            luaL_addstring(b, to_luastring(String(date.getDay())));
            break;
          case 120:
            strftime(L, b, locale.formats.x, date);
            break;
          case 121:
            push_pad_2(b, date.getFullYear() % 100, 48);
            break;
          case 122: {
            let off = date.getTimezoneOffset();
            if (off > 0) {
              luaL_addchar(b, 45);
            } else {
              off = -off;
              luaL_addchar(b, 43);
            }
            push_pad_2(b, Math.floor(off / 60), 48);
            push_pad_2(b, off % 60, 48);
            break;
          }
        }
        i += len;
      }
    }
  };
  var checkoption = function(L, conv, i) {
    let option = LUA_STRFTIMEOPTIONS;
    let o = 0;
    let oplen = 1;
    for (;o < option.length && oplen <= conv.length - i; o += oplen) {
      if (option[o] === 124)
        oplen++;
      else if (luastring_eq(conv.subarray(i, i + oplen), option.subarray(o, o + oplen))) {
        return oplen;
      }
    }
    luaL_argerror(L, 1, lua_pushfstring(L, to_luastring("invalid conversion specifier '%%%s'"), conv));
  };
  var os_date = function(L) {
    let s = luaL_optlstring(L, 1, "%c");
    let stm = lua_isnoneornil(L, 2) ? new Date : new Date(l_checktime(L, 2) * 1000);
    let utc = false;
    let i = 0;
    if (s[i] === 33) {
      utc = true;
      i++;
    }
    if (s[i] === 42 && s[i + 1] === 116) {
      lua_createtable(L, 0, 9);
      setallfields(L, stm, utc);
    } else {
      let cc = new Uint8Array(4);
      cc[0] = 37;
      let b = new luaL_Buffer;
      luaL_buffinit(L, b);
      strftime(L, b, s, stm);
      luaL_pushresult(b);
    }
    return 1;
  };
  var os_time = function(L) {
    let t;
    if (lua_isnoneornil(L, 1))
      t = new Date;
    else {
      luaL_checktype(L, 1, LUA_TTABLE);
      lua_settop(L, 1);
      t = new Date(getfield(L, "year", -1, 0), getfield(L, "month", -1, 1), getfield(L, "day", -1, 0), getfield(L, "hour", 12, 0), getfield(L, "min", 0, 0), getfield(L, "sec", 0, 0));
      setallfields(L, t);
    }
    lua_pushinteger(L, Math.floor(t / 1000));
    return 1;
  };
  var l_checktime = function(L, arg) {
    let t = luaL_checkinteger(L, arg);
    return t;
  };
  var os_difftime = function(L) {
    let t1 = l_checktime(L, 1);
    let t2 = l_checktime(L, 2);
    lua_pushnumber(L, t1 - t2);
    return 1;
  };
  var syslib = {
    date: os_date,
    difftime: os_difftime,
    time: os_time
  };
  if (typeof process === "undefined") {
    syslib.clock = function(L) {
      lua_pushnumber(L, performance.now() / 1000);
      return 1;
    };
  } else {
    const fs = {};
    const tmp = {};
    const child_process = {};
    syslib.exit = function(L) {
      let status;
      if (lua_isboolean(L, 1))
        status = lua_toboolean(L, 1) ? 0 : 1;
      else
        status = luaL_optinteger(L, 1, 0);
      if (lua_toboolean(L, 2))
        lua_close(L);
      if (L)
        (() => {})(status);
      return 0;
    };
    syslib.getenv = function(L) {
      let key = luaL_checkstring(L, 1);
      key = to_jsstring(key);
      if (Object.prototype.hasOwnProperty.call({}, key)) {
        lua_pushliteral(L, {}[key]);
      } else {
        lua_pushnil(L);
      }
      return 1;
    };
    syslib.clock = function(L) {
      lua_pushnumber(L, process.uptime());
      return 1;
    };
    const lua_tmpname = function() {
      return tmp.tmpNameSync();
    };
    syslib.remove = function(L) {
      let filename = luaL_checkstring(L, 1);
      try {
        fs.unlinkSync(filename);
      } catch (e) {
        if (e.code === "EISDIR") {
          try {
            fs.rmdirSync(filename);
          } catch (e) {
            return luaL_fileresult(L, false, filename, e);
          }
        } else {
          return luaL_fileresult(L, false, filename, e);
        }
      }
      return luaL_fileresult(L, true);
    };
    syslib.rename = function(L) {
      let fromname = luaL_checkstring(L, 1);
      let toname = luaL_checkstring(L, 2);
      try {
        fs.renameSync(fromname, toname);
      } catch (e) {
        return luaL_fileresult(L, false, false, e);
      }
      return luaL_fileresult(L, true);
    };
    syslib.tmpname = function(L) {
      let name = lua_tmpname();
      if (!name)
        return luaL_error(L, to_luastring("unable to generate a unique filename"));
      lua_pushstring(L, to_luastring(name));
      return 1;
    };
    syslib.execute = function(L) {
      let cmd = luaL_optstring(L, 1, null);
      if (cmd !== null) {
        try {
          child_process.execSync(cmd, {
            stdio: [process.stdin, process.stdout, process.stderr]
          });
        } catch (e) {
          return luaL_execresult(L, e);
        }
        return luaL_execresult(L, null);
      } else {
        lua_pushboolean(L, 1);
        return 1;
      }
    };
  }
  var luaopen_os = function(L) {
    luaL_newlib(L, syslib);
    return 1;
  };
  exports.luaopen_os = luaopen_os;
});

// node_modules/sprintf-js/src/sprintf.js
var require_sprintf = __commonJS(function(exports) {
  (function() {
    var re = {
      not_string: /[^s]/,
      not_bool: /[^t]/,
      not_type: /[^T]/,
      not_primitive: /[^v]/,
      number: /[diefg]/,
      numeric_arg: /[bcdiefguxX]/,
      json: /[j]/,
      not_json: /[^j]/,
      text: /^[^\x25]+/,
      modulo: /^\x25{2}/,
      placeholder: /^\x25(?:([1-9]\d*)\$|\(([^)]+)\))?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-gijostTuvxX])/,
      key: /^([a-z_][a-z_\d]*)/i,
      key_access: /^\.([a-z_][a-z_\d]*)/i,
      index_access: /^\[(\d+)\]/,
      sign: /^[+-]/
    };
    function sprintf(key) {
      return sprintf_format(sprintf_parse(key), arguments);
    }
    function vsprintf(fmt, argv) {
      return sprintf.apply(null, [fmt].concat(argv || []));
    }
    function sprintf_format(parse_tree, argv) {
      var cursor = 1, tree_length = parse_tree.length, arg, output = "", i, k, ph, pad, pad_character, pad_length, is_positive, sign;
      for (i = 0;i < tree_length; i++) {
        if (typeof parse_tree[i] === "string") {
          output += parse_tree[i];
        } else if (typeof parse_tree[i] === "object") {
          ph = parse_tree[i];
          if (ph.keys) {
            arg = argv[cursor];
            for (k = 0;k < ph.keys.length; k++) {
              if (arg == undefined) {
                throw new Error(sprintf('[sprintf] Cannot access property "%s" of undefined value "%s"', ph.keys[k], ph.keys[k - 1]));
              }
              arg = arg[ph.keys[k]];
            }
          } else if (ph.param_no) {
            arg = argv[ph.param_no];
          } else {
            arg = argv[cursor++];
          }
          if (re.not_type.test(ph.type) && re.not_primitive.test(ph.type) && arg instanceof Function) {
            arg = arg();
          }
          if (re.numeric_arg.test(ph.type) && (typeof arg !== "number" && isNaN(arg))) {
            throw new TypeError(sprintf("[sprintf] expecting number but found %T", arg));
          }
          if (re.number.test(ph.type)) {
            is_positive = arg >= 0;
          }
          switch (ph.type) {
            case "b":
              arg = parseInt(arg, 10).toString(2);
              break;
            case "c":
              arg = String.fromCharCode(parseInt(arg, 10));
              break;
            case "d":
            case "i":
              arg = parseInt(arg, 10);
              break;
            case "j":
              arg = JSON.stringify(arg, null, ph.width ? parseInt(ph.width) : 0);
              break;
            case "e":
              arg = ph.precision ? parseFloat(arg).toExponential(ph.precision) : parseFloat(arg).toExponential();
              break;
            case "f":
              arg = ph.precision ? parseFloat(arg).toFixed(ph.precision) : parseFloat(arg);
              break;
            case "g":
              arg = ph.precision ? String(Number(arg.toPrecision(ph.precision))) : parseFloat(arg);
              break;
            case "o":
              arg = (parseInt(arg, 10) >>> 0).toString(8);
              break;
            case "s":
              arg = String(arg);
              arg = ph.precision ? arg.substring(0, ph.precision) : arg;
              break;
            case "t":
              arg = String(!!arg);
              arg = ph.precision ? arg.substring(0, ph.precision) : arg;
              break;
            case "T":
              arg = Object.prototype.toString.call(arg).slice(8, -1).toLowerCase();
              arg = ph.precision ? arg.substring(0, ph.precision) : arg;
              break;
            case "u":
              arg = parseInt(arg, 10) >>> 0;
              break;
            case "v":
              arg = arg.valueOf();
              arg = ph.precision ? arg.substring(0, ph.precision) : arg;
              break;
            case "x":
              arg = (parseInt(arg, 10) >>> 0).toString(16);
              break;
            case "X":
              arg = (parseInt(arg, 10) >>> 0).toString(16).toUpperCase();
              break;
          }
          if (re.json.test(ph.type)) {
            output += arg;
          } else {
            if (re.number.test(ph.type) && (!is_positive || ph.sign)) {
              sign = is_positive ? "+" : "-";
              arg = arg.toString().replace(re.sign, "");
            } else {
              sign = "";
            }
            pad_character = ph.pad_char ? ph.pad_char === "0" ? "0" : ph.pad_char.charAt(1) : " ";
            pad_length = ph.width - (sign + arg).length;
            pad = ph.width ? pad_length > 0 ? pad_character.repeat(pad_length) : "" : "";
            output += ph.align ? sign + arg + pad : pad_character === "0" ? sign + pad + arg : pad + sign + arg;
          }
        }
      }
      return output;
    }
    var sprintf_cache = Object.create(null);
    function sprintf_parse(fmt) {
      if (sprintf_cache[fmt]) {
        return sprintf_cache[fmt];
      }
      var _fmt = fmt, match, parse_tree = [], arg_names = 0;
      while (_fmt) {
        if ((match = re.text.exec(_fmt)) !== null) {
          parse_tree.push(match[0]);
        } else if ((match = re.modulo.exec(_fmt)) !== null) {
          parse_tree.push("%");
        } else if ((match = re.placeholder.exec(_fmt)) !== null) {
          if (match[2]) {
            arg_names |= 1;
            var field_list = [], replacement_field = match[2], field_match = [];
            if ((field_match = re.key.exec(replacement_field)) !== null) {
              field_list.push(field_match[1]);
              while ((replacement_field = replacement_field.substring(field_match[0].length)) !== "") {
                if ((field_match = re.key_access.exec(replacement_field)) !== null) {
                  field_list.push(field_match[1]);
                } else if ((field_match = re.index_access.exec(replacement_field)) !== null) {
                  field_list.push(field_match[1]);
                } else {
                  throw new SyntaxError("[sprintf] failed to parse named argument key");
                }
              }
            } else {
              throw new SyntaxError("[sprintf] failed to parse named argument key");
            }
            match[2] = field_list;
          } else {
            arg_names |= 2;
          }
          if (arg_names === 3) {
            throw new Error("[sprintf] mixing positional and named placeholders is not (yet) supported");
          }
          parse_tree.push({
            placeholder: match[0],
            param_no: match[1],
            keys: match[2],
            sign: match[3],
            pad_char: match[4],
            align: match[5],
            width: match[6],
            precision: match[7],
            type: match[8]
          });
        } else {
          throw new SyntaxError("[sprintf] unexpected placeholder");
        }
        _fmt = _fmt.substring(match[0].length);
      }
      return sprintf_cache[fmt] = parse_tree;
    }
    if (typeof exports !== "undefined") {
      exports.sprintf = sprintf;
      exports.vsprintf = vsprintf;
    }
    if (typeof window !== "undefined") {
      window["sprintf"] = sprintf;
      window["vsprintf"] = vsprintf;
      if (typeof define === "function" && define["amd"]) {
        define(function() {
          return {
            sprintf,
            vsprintf
          };
        });
      }
    }
  })();
});

// node_modules/fengari/src/lstrlib.js
var require_lstrlib = __commonJS(function(exports, module) {
  var { sprintf } = require_sprintf();
  var {
    LUA_INTEGER_FMT,
    LUA_INTEGER_FRMLEN,
    LUA_MININTEGER,
    LUA_NUMBER_FMT,
    LUA_NUMBER_FRMLEN,
    frexp,
    lua_getlocaledecpoint
  } = require_luaconf();
  var {
    LUA_TBOOLEAN,
    LUA_TFUNCTION,
    LUA_TNIL,
    LUA_TNUMBER,
    LUA_TSTRING,
    LUA_TTABLE,
    lua_call,
    lua_createtable,
    lua_dump,
    lua_gettable,
    lua_gettop,
    lua_isinteger,
    lua_isstring,
    lua_pop,
    lua_pushcclosure,
    lua_pushinteger,
    lua_pushlightuserdata,
    lua_pushliteral,
    lua_pushlstring,
    lua_pushnil,
    lua_pushnumber,
    lua_pushstring,
    lua_pushvalue,
    lua_remove,
    lua_setfield,
    lua_setmetatable,
    lua_settop,
    lua_toboolean,
    lua_tointeger,
    lua_tonumber,
    lua_tostring,
    lua_touserdata,
    lua_type,
    lua_upvalueindex
  } = require_lua();
  var {
    luaL_Buffer,
    luaL_addchar,
    luaL_addlstring,
    luaL_addsize,
    luaL_addstring,
    luaL_addvalue,
    luaL_argcheck,
    luaL_argerror,
    luaL_buffinit,
    luaL_buffinitsize,
    luaL_checkinteger,
    luaL_checknumber,
    luaL_checkstack,
    luaL_checkstring,
    luaL_checktype,
    luaL_error,
    luaL_newlib,
    luaL_optinteger,
    luaL_optstring,
    luaL_prepbuffsize,
    luaL_pushresult,
    luaL_pushresultsize,
    luaL_tolstring,
    luaL_typename
  } = require_lauxlib();
  var lualib = require_lualib();
  var {
    luastring_eq,
    luastring_indexOf,
    to_jsstring,
    to_luastring
  } = require_fengaricore();
  var sL_ESC = "%";
  var L_ESC = sL_ESC.charCodeAt(0);
  var LUA_MAXCAPTURES = 32;
  var MAXSIZE = 2147483647;
  var strlen = function(s) {
    let len = luastring_indexOf(s, 0);
    return len > -1 ? len : s.length;
  };
  var posrelat = function(pos, len) {
    if (pos >= 0)
      return pos;
    else if (0 - pos > len)
      return 0;
    else
      return len + pos + 1;
  };
  var str_sub = function(L) {
    let s = luaL_checkstring(L, 1);
    let l = s.length;
    let start = posrelat(luaL_checkinteger(L, 2), l);
    let end = posrelat(luaL_optinteger(L, 3, -1), l);
    if (start < 1)
      start = 1;
    if (end > l)
      end = l;
    if (start <= end)
      lua_pushstring(L, s.subarray(start - 1, start - 1 + (end - start + 1)));
    else
      lua_pushliteral(L, "");
    return 1;
  };
  var str_len = function(L) {
    lua_pushinteger(L, luaL_checkstring(L, 1).length);
    return 1;
  };
  var str_char = function(L) {
    let n = lua_gettop(L);
    let b = new luaL_Buffer;
    let p = luaL_buffinitsize(L, b, n);
    for (let i = 1;i <= n; i++) {
      let c = luaL_checkinteger(L, i);
      luaL_argcheck(L, c >= 0 && c <= 255, "value out of range");
      p[i - 1] = c;
    }
    luaL_pushresultsize(b, n);
    return 1;
  };
  var writer = function(L, b, size, B) {
    luaL_addlstring(B, b, size);
    return 0;
  };
  var str_dump = function(L) {
    let b = new luaL_Buffer;
    let strip = lua_toboolean(L, 2);
    luaL_checktype(L, 1, LUA_TFUNCTION);
    lua_settop(L, 1);
    luaL_buffinit(L, b);
    if (lua_dump(L, writer, b, strip) !== 0)
      return luaL_error(L, to_luastring("unable to dump given function"));
    luaL_pushresult(b);
    return 1;
  };
  var SIZELENMOD = LUA_NUMBER_FRMLEN.length + 1;
  var L_NBFD = 1;
  var num2straux = function(x) {
    if (Object.is(x, Infinity))
      return to_luastring("inf");
    else if (Object.is(x, -Infinity))
      return to_luastring("-inf");
    else if (Number.isNaN(x))
      return to_luastring("nan");
    else if (x === 0) {
      let zero = sprintf(LUA_NUMBER_FMT + "x0p+0", x);
      if (Object.is(x, -0))
        zero = "-" + zero;
      return to_luastring(zero);
    } else {
      let buff = "";
      let fe = frexp(x);
      let m = fe[0];
      let e = fe[1];
      if (m < 0) {
        buff += "-";
        m = -m;
      }
      buff += "0x";
      buff += (m * (1 << L_NBFD)).toString(16);
      e -= L_NBFD;
      buff += sprintf("p%+d", e);
      return to_luastring(buff);
    }
  };
  var lua_number2strx = function(L, fmt, x) {
    let buff = num2straux(x);
    if (fmt[SIZELENMOD] === 65) {
      for (let i = 0;i < buff.length; i++) {
        let c = buff[i];
        if (c >= 97)
          buff[i] = c & 223;
      }
    } else if (fmt[SIZELENMOD] !== 97)
      luaL_error(L, to_luastring("modifiers for format '%%a'/'%%A' not implemented"));
    return buff;
  };
  var FLAGS = to_luastring("-+ #0");
  var isalpha = (e) => 97 <= e && e <= 122 || 65 <= e && e <= 90;
  var isdigit = (e) => 48 <= e && e <= 57;
  var iscntrl = (e) => 0 <= e && e <= 31 || e === 127;
  var isgraph = (e) => 33 <= e && e <= 126;
  var islower = (e) => 97 <= e && e <= 122;
  var isupper = (e) => 65 <= e && e <= 90;
  var isalnum = (e) => 97 <= e && e <= 122 || 65 <= e && e <= 90 || 48 <= e && e <= 57;
  var ispunct = (e) => isgraph(e) && !isalnum(e);
  var isspace = (e) => e === 32 || e >= 9 && e <= 13;
  var isxdigit = (e) => 48 <= e && e <= 57 || 65 <= e && e <= 70 || 97 <= e && e <= 102;
  var addquoted = function(b, s, len) {
    luaL_addchar(b, 34);
    let i = 0;
    while (len--) {
      if (s[i] === 34 || s[i] === 92 || s[i] === 10) {
        luaL_addchar(b, 92);
        luaL_addchar(b, s[i]);
      } else if (iscntrl(s[i])) {
        let buff = "" + s[i];
        if (isdigit(s[i + 1]))
          buff = "0".repeat(3 - buff.length) + buff;
        luaL_addstring(b, to_luastring("\\" + buff));
      } else
        luaL_addchar(b, s[i]);
      i++;
    }
    luaL_addchar(b, 34);
  };
  var checkdp = function(buff) {
    if (luastring_indexOf(buff, 46) < 0) {
      let point = lua_getlocaledecpoint();
      let ppoint = luastring_indexOf(buff, point);
      if (ppoint)
        buff[ppoint] = 46;
    }
  };
  var addliteral = function(L, b, arg) {
    switch (lua_type(L, arg)) {
      case LUA_TSTRING: {
        let s = lua_tostring(L, arg);
        addquoted(b, s, s.length);
        break;
      }
      case LUA_TNUMBER: {
        let buff;
        if (!lua_isinteger(L, arg)) {
          let n = lua_tonumber(L, arg);
          buff = lua_number2strx(L, to_luastring(`%${LUA_INTEGER_FRMLEN}a`), n);
          checkdp(buff);
        } else {
          let n = lua_tointeger(L, arg);
          let format = n === LUA_MININTEGER ? "0x%" + LUA_INTEGER_FRMLEN + "x" : LUA_INTEGER_FMT;
          buff = to_luastring(sprintf(format, n));
        }
        luaL_addstring(b, buff);
        break;
      }
      case LUA_TNIL:
      case LUA_TBOOLEAN: {
        luaL_tolstring(L, arg);
        luaL_addvalue(b);
        break;
      }
      default: {
        luaL_argerror(L, arg, to_luastring("value has no literal form"));
      }
    }
  };
  var scanformat = function(L, strfrmt, i, form) {
    let p = i;
    while (strfrmt[p] !== 0 && luastring_indexOf(FLAGS, strfrmt[p]) >= 0)
      p++;
    if (p - i >= FLAGS.length)
      luaL_error(L, to_luastring("invalid format (repeated flags)"));
    if (isdigit(strfrmt[p]))
      p++;
    if (isdigit(strfrmt[p]))
      p++;
    if (strfrmt[p] === 46) {
      p++;
      if (isdigit(strfrmt[p]))
        p++;
      if (isdigit(strfrmt[p]))
        p++;
    }
    if (isdigit(strfrmt[p]))
      luaL_error(L, to_luastring("invalid format (width or precision too long)"));
    form[0] = 37;
    for (let j = 0;j < p - i + 1; j++)
      form[j + 1] = strfrmt[i + j];
    return p;
  };
  var addlenmod = function(form, lenmod) {
    let l = form.length;
    let lm = lenmod.length;
    let spec = form[l - 1];
    for (let i = 0;i < lm; i++)
      form[i + l - 1] = lenmod[i];
    form[l + lm - 1] = spec;
  };
  var str_format = function(L) {
    let top = lua_gettop(L);
    let arg = 1;
    let strfrmt = luaL_checkstring(L, arg);
    let i = 0;
    let b = new luaL_Buffer;
    luaL_buffinit(L, b);
    while (i < strfrmt.length) {
      if (strfrmt[i] !== L_ESC) {
        luaL_addchar(b, strfrmt[i++]);
      } else if (strfrmt[++i] === L_ESC) {
        luaL_addchar(b, strfrmt[i++]);
      } else {
        let form = [];
        if (++arg > top)
          luaL_argerror(L, arg, to_luastring("no value"));
        i = scanformat(L, strfrmt, i, form);
        switch (String.fromCharCode(strfrmt[i++])) {
          case "c": {
            luaL_addchar(b, luaL_checkinteger(L, arg));
            break;
          }
          case "d":
          case "i":
          case "o":
          case "u":
          case "x":
          case "X": {
            let n = luaL_checkinteger(L, arg);
            addlenmod(form, to_luastring(LUA_INTEGER_FRMLEN, true));
            luaL_addstring(b, to_luastring(sprintf(String.fromCharCode(...form), n)));
            break;
          }
          case "a":
          case "A": {
            addlenmod(form, to_luastring(LUA_INTEGER_FRMLEN, true));
            luaL_addstring(b, lua_number2strx(L, form, luaL_checknumber(L, arg)));
            break;
          }
          case "e":
          case "E":
          case "f":
          case "g":
          case "G": {
            let n = luaL_checknumber(L, arg);
            addlenmod(form, to_luastring(LUA_INTEGER_FRMLEN, true));
            luaL_addstring(b, to_luastring(sprintf(String.fromCharCode(...form), n)));
            break;
          }
          case "q": {
            addliteral(L, b, arg);
            break;
          }
          case "s": {
            let s = luaL_tolstring(L, arg);
            if (form.length <= 2 || form[2] === 0) {
              luaL_addvalue(b);
            } else {
              luaL_argcheck(L, s.length === strlen(s), arg, "string contains zeros");
              if (luastring_indexOf(form, 46) < 0 && s.length >= 100) {
                luaL_addvalue(b);
              } else {
                luaL_addstring(b, to_luastring(sprintf(String.fromCharCode(...form), to_jsstring(s))));
                lua_pop(L, 1);
              }
            }
            break;
          }
          default: {
            return luaL_error(L, to_luastring("invalid option '%%%c' to 'format'"), strfrmt[i - 1]);
          }
        }
      }
    }
    luaL_pushresult(b);
    return 1;
  };
  var LUAL_PACKPADBYTE = 0;
  var MAXINTSIZE = 16;
  var SZINT = 4;
  var NB = 8;
  var MC = (1 << NB) - 1;
  var MAXALIGN = 8;

  class Header {
    constructor(L) {
      this.L = L;
      this.islittle = true;
      this.maxalign = 1;
    }
  }
  var Kint = 0;
  var Kuint = 1;
  var Kfloat = 2;
  var Kchar = 3;
  var Kstring = 4;
  var Kzstr = 5;
  var Kpadding = 6;
  var Kpaddalign = 7;
  var Knop = 8;
  var digit = isdigit;
  var getnum = function(fmt, df) {
    if (fmt.off >= fmt.s.length || !digit(fmt.s[fmt.off]))
      return df;
    else {
      let a = 0;
      do {
        a = a * 10 + (fmt.s[fmt.off++] - 48);
      } while (fmt.off < fmt.s.length && digit(fmt.s[fmt.off]) && a <= (MAXSIZE - 9) / 10);
      return a;
    }
  };
  var getnumlimit = function(h, fmt, df) {
    let sz = getnum(fmt, df);
    if (sz > MAXINTSIZE || sz <= 0)
      luaL_error(h.L, to_luastring("integral size (%d) out of limits [1,%d]"), sz, MAXINTSIZE);
    return sz;
  };
  var getoption = function(h, fmt) {
    let r = {
      opt: fmt.s[fmt.off++],
      size: 0
    };
    switch (r.opt) {
      case 98:
        r.size = 1;
        r.opt = Kint;
        return r;
      case 66:
        r.size = 1;
        r.opt = Kuint;
        return r;
      case 104:
        r.size = 2;
        r.opt = Kint;
        return r;
      case 72:
        r.size = 2;
        r.opt = Kuint;
        return r;
      case 108:
        r.size = 4;
        r.opt = Kint;
        return r;
      case 76:
        r.size = 4;
        r.opt = Kuint;
        return r;
      case 106:
        r.size = 4;
        r.opt = Kint;
        return r;
      case 74:
        r.size = 4;
        r.opt = Kuint;
        return r;
      case 84:
        r.size = 4;
        r.opt = Kuint;
        return r;
      case 102:
        r.size = 4;
        r.opt = Kfloat;
        return r;
      case 100:
        r.size = 8;
        r.opt = Kfloat;
        return r;
      case 110:
        r.size = 8;
        r.opt = Kfloat;
        return r;
      case 105:
        r.size = getnumlimit(h, fmt, 4);
        r.opt = Kint;
        return r;
      case 73:
        r.size = getnumlimit(h, fmt, 4);
        r.opt = Kuint;
        return r;
      case 115:
        r.size = getnumlimit(h, fmt, 4);
        r.opt = Kstring;
        return r;
      case 99: {
        r.size = getnum(fmt, -1);
        if (r.size === -1)
          luaL_error(h.L, to_luastring("missing size for format option 'c'"));
        r.opt = Kchar;
        return r;
      }
      case 122:
        r.opt = Kzstr;
        return r;
      case 120:
        r.size = 1;
        r.opt = Kpadding;
        return r;
      case 88:
        r.opt = Kpaddalign;
        return r;
      case 32:
        break;
      case 60:
        h.islittle = true;
        break;
      case 62:
        h.islittle = false;
        break;
      case 61:
        h.islittle = true;
        break;
      case 33:
        h.maxalign = getnumlimit(h, fmt, MAXALIGN);
        break;
      default:
        luaL_error(h.L, to_luastring("invalid format option '%c'"), r.opt);
    }
    r.opt = Knop;
    return r;
  };
  var getdetails = function(h, totalsize, fmt) {
    let r = {
      opt: NaN,
      size: NaN,
      ntoalign: NaN
    };
    let opt = getoption(h, fmt);
    r.size = opt.size;
    r.opt = opt.opt;
    let align = r.size;
    if (r.opt === Kpaddalign) {
      if (fmt.off >= fmt.s.length || fmt.s[fmt.off] === 0)
        luaL_argerror(h.L, 1, to_luastring("invalid next option for option 'X'"));
      else {
        let o = getoption(h, fmt);
        align = o.size;
        o = o.opt;
        if (o === Kchar || align === 0)
          luaL_argerror(h.L, 1, to_luastring("invalid next option for option 'X'"));
      }
    }
    if (align <= 1 || r.opt === Kchar)
      r.ntoalign = 0;
    else {
      if (align > h.maxalign)
        align = h.maxalign;
      if ((align & align - 1) !== 0)
        luaL_argerror(h.L, 1, to_luastring("format asks for alignment not power of 2"));
      r.ntoalign = align - (totalsize & align - 1) & align - 1;
    }
    return r;
  };
  var packint = function(b, n, islittle, size, neg) {
    let buff = luaL_prepbuffsize(b, size);
    buff[islittle ? 0 : size - 1] = n & MC;
    for (let i = 1;i < size; i++) {
      n >>= NB;
      buff[islittle ? i : size - 1 - i] = n & MC;
    }
    if (neg && size > SZINT) {
      for (let i = SZINT;i < size; i++)
        buff[islittle ? i : size - 1 - i] = MC;
    }
    luaL_addsize(b, size);
  };
  var str_pack = function(L) {
    let b = new luaL_Buffer;
    let h = new Header(L);
    let fmt = {
      s: luaL_checkstring(L, 1),
      off: 0
    };
    let arg = 1;
    let totalsize = 0;
    lua_pushnil(L);
    luaL_buffinit(L, b);
    while (fmt.off < fmt.s.length) {
      let details = getdetails(h, totalsize, fmt);
      let opt = details.opt;
      let size = details.size;
      let ntoalign = details.ntoalign;
      totalsize += ntoalign + size;
      while (ntoalign-- > 0)
        luaL_addchar(b, LUAL_PACKPADBYTE);
      arg++;
      switch (opt) {
        case Kint: {
          let n = luaL_checkinteger(L, arg);
          if (size < SZINT) {
            let lim = 1 << size * 8 - 1;
            luaL_argcheck(L, -lim <= n && n < lim, arg, "integer overflow");
          }
          packint(b, n, h.islittle, size, n < 0);
          break;
        }
        case Kuint: {
          let n = luaL_checkinteger(L, arg);
          if (size < SZINT)
            luaL_argcheck(L, n >>> 0 < 1 << size * NB, arg, "unsigned overflow");
          packint(b, n >>> 0, h.islittle, size, false);
          break;
        }
        case Kfloat: {
          let buff = luaL_prepbuffsize(b, size);
          let n = luaL_checknumber(L, arg);
          let dv = new DataView(buff.buffer, buff.byteOffset, buff.byteLength);
          if (size === 4)
            dv.setFloat32(0, n, h.islittle);
          else
            dv.setFloat64(0, n, h.islittle);
          luaL_addsize(b, size);
          break;
        }
        case Kchar: {
          let s = luaL_checkstring(L, arg);
          let len = s.length;
          luaL_argcheck(L, len <= size, arg, "string longer than given size");
          luaL_addlstring(b, s, len);
          while (len++ < size)
            luaL_addchar(b, LUAL_PACKPADBYTE);
          break;
        }
        case Kstring: {
          let s = luaL_checkstring(L, arg);
          let len = s.length;
          luaL_argcheck(L, size >= 4 || len < 1 << size * NB, arg, "string length does not fit in given size");
          packint(b, len, h.islittle, size, 0);
          luaL_addlstring(b, s, len);
          totalsize += len;
          break;
        }
        case Kzstr: {
          let s = luaL_checkstring(L, arg);
          let len = s.length;
          luaL_argcheck(L, luastring_indexOf(s, 0) < 0, arg, "strings contains zeros");
          luaL_addlstring(b, s, len);
          luaL_addchar(b, 0);
          totalsize += len + 1;
          break;
        }
        case Kpadding:
          luaL_addchar(b, LUAL_PACKPADBYTE);
        case Kpaddalign:
        case Knop:
          arg--;
          break;
      }
    }
    luaL_pushresult(b);
    return 1;
  };
  var str_reverse = function(L) {
    let s = luaL_checkstring(L, 1);
    let l = s.length;
    let r = new Uint8Array(l);
    for (let i = 0;i < l; i++)
      r[i] = s[l - 1 - i];
    lua_pushstring(L, r);
    return 1;
  };
  var str_lower = function(L) {
    let s = luaL_checkstring(L, 1);
    let l = s.length;
    let r = new Uint8Array(l);
    for (let i = 0;i < l; i++) {
      let c = s[i];
      if (isupper(c))
        c = c | 32;
      r[i] = c;
    }
    lua_pushstring(L, r);
    return 1;
  };
  var str_upper = function(L) {
    let s = luaL_checkstring(L, 1);
    let l = s.length;
    let r = new Uint8Array(l);
    for (let i = 0;i < l; i++) {
      let c = s[i];
      if (islower(c))
        c = c & 223;
      r[i] = c;
    }
    lua_pushstring(L, r);
    return 1;
  };
  var str_rep = function(L) {
    let s = luaL_checkstring(L, 1);
    let l = s.length;
    let n = luaL_checkinteger(L, 2);
    let sep = luaL_optstring(L, 3, "");
    let lsep = sep.length;
    if (n <= 0)
      lua_pushliteral(L, "");
    else if (l + lsep < l || l + lsep > MAXSIZE / n)
      return luaL_error(L, to_luastring("resulting string too large"));
    else {
      let totallen = n * l + (n - 1) * lsep;
      let b = new luaL_Buffer;
      let p = luaL_buffinitsize(L, b, totallen);
      let pi = 0;
      while (n-- > 1) {
        p.set(s, pi);
        pi += l;
        if (lsep > 0) {
          p.set(sep, pi);
          pi += lsep;
        }
      }
      p.set(s, pi);
      luaL_pushresultsize(b, totallen);
    }
    return 1;
  };
  var str_byte = function(L) {
    let s = luaL_checkstring(L, 1);
    let l = s.length;
    let posi = posrelat(luaL_optinteger(L, 2, 1), l);
    let pose = posrelat(luaL_optinteger(L, 3, posi), l);
    if (posi < 1)
      posi = 1;
    if (pose > l)
      pose = l;
    if (posi > pose)
      return 0;
    if (pose - posi >= Number.MAX_SAFE_INTEGER)
      return luaL_error(L, "string slice too long");
    let n = pose - posi + 1;
    luaL_checkstack(L, n, "string slice too long");
    for (let i = 0;i < n; i++)
      lua_pushinteger(L, s[posi + i - 1]);
    return n;
  };
  var str_packsize = function(L) {
    let h = new Header(L);
    let fmt = {
      s: luaL_checkstring(L, 1),
      off: 0
    };
    let totalsize = 0;
    while (fmt.off < fmt.s.length) {
      let details = getdetails(h, totalsize, fmt);
      let opt = details.opt;
      let size = details.size;
      let ntoalign = details.ntoalign;
      size += ntoalign;
      luaL_argcheck(L, totalsize <= MAXSIZE - size, 1, "format result too large");
      totalsize += size;
      switch (opt) {
        case Kstring:
        case Kzstr:
          luaL_argerror(L, 1, "variable-length format");
        default:
          break;
      }
    }
    lua_pushinteger(L, totalsize);
    return 1;
  };
  var unpackint = function(L, str, islittle, size, issigned) {
    let res = 0;
    let limit = size <= SZINT ? size : SZINT;
    for (let i = limit - 1;i >= 0; i--) {
      res <<= NB;
      res |= str[islittle ? i : size - 1 - i];
    }
    if (size < SZINT) {
      if (issigned) {
        let mask = 1 << size * NB - 1;
        res = (res ^ mask) - mask;
      }
    } else if (size > SZINT) {
      let mask = !issigned || res >= 0 ? 0 : MC;
      for (let i = limit;i < size; i++) {
        if (str[islittle ? i : size - 1 - i] !== mask)
          luaL_error(L, to_luastring("%d-byte integer does not fit into Lua Integer"), size);
      }
    }
    return res;
  };
  var unpacknum = function(L, b, islittle, size) {
    lualib.lua_assert(b.length >= size);
    let dv = new DataView(new ArrayBuffer(size));
    for (let i = 0;i < size; i++)
      dv.setUint8(i, b[i], islittle);
    if (size == 4)
      return dv.getFloat32(0, islittle);
    else
      return dv.getFloat64(0, islittle);
  };
  var str_unpack = function(L) {
    let h = new Header(L);
    let fmt = {
      s: luaL_checkstring(L, 1),
      off: 0
    };
    let data = luaL_checkstring(L, 2);
    let ld = data.length;
    let pos = posrelat(luaL_optinteger(L, 3, 1), ld) - 1;
    let n = 0;
    luaL_argcheck(L, pos <= ld && pos >= 0, 3, "initial position out of string");
    while (fmt.off < fmt.s.length) {
      let details = getdetails(h, pos, fmt);
      let opt = details.opt;
      let size = details.size;
      let ntoalign = details.ntoalign;
      if (pos + ntoalign + size > ld)
        luaL_argerror(L, 2, to_luastring("data string too short"));
      pos += ntoalign;
      luaL_checkstack(L, 2, "too many results");
      n++;
      switch (opt) {
        case Kint:
        case Kuint: {
          let res = unpackint(L, data.subarray(pos), h.islittle, size, opt === Kint);
          lua_pushinteger(L, res);
          break;
        }
        case Kfloat: {
          let res = unpacknum(L, data.subarray(pos), h.islittle, size);
          lua_pushnumber(L, res);
          break;
        }
        case Kchar: {
          lua_pushstring(L, data.subarray(pos, pos + size));
          break;
        }
        case Kstring: {
          let len = unpackint(L, data.subarray(pos), h.islittle, size, 0);
          luaL_argcheck(L, pos + len + size <= ld, 2, "data string too short");
          lua_pushstring(L, data.subarray(pos + size, pos + size + len));
          pos += len;
          break;
        }
        case Kzstr: {
          let e = luastring_indexOf(data, 0, pos);
          if (e === -1)
            e = data.length - pos;
          lua_pushstring(L, data.subarray(pos, e));
          pos = e + 1;
          break;
        }
        case Kpaddalign:
        case Kpadding:
        case Knop:
          n--;
          break;
      }
      pos += size;
    }
    lua_pushinteger(L, pos + 1);
    return n + 1;
  };
  var CAP_UNFINISHED = -1;
  var CAP_POSITION = -2;
  var MAXCCALLS = 200;
  var SPECIALS = to_luastring("^$*+?.([%-");

  class MatchState {
    constructor(L) {
      this.src = null;
      this.src_init = null;
      this.src_end = null;
      this.p = null;
      this.p_end = null;
      this.L = L;
      this.matchdepth = NaN;
      this.level = NaN;
      this.capture = [];
    }
  }
  var check_capture = function(ms, l) {
    l = l - 49;
    if (l < 0 || l >= ms.level || ms.capture[l].len === CAP_UNFINISHED)
      return luaL_error(ms.L, to_luastring("invalid capture index %%%d"), l + 1);
    return l;
  };
  var capture_to_close = function(ms) {
    let level = ms.level;
    for (level--;level >= 0; level--)
      if (ms.capture[level].len === CAP_UNFINISHED)
        return level;
    return luaL_error(ms.L, to_luastring("invalid pattern capture"));
  };
  var classend = function(ms, p) {
    switch (ms.p[p++]) {
      case L_ESC: {
        if (p === ms.p_end)
          luaL_error(ms.L, to_luastring("malformed pattern (ends with '%%')"));
        return p + 1;
      }
      case 91: {
        if (ms.p[p] === 94)
          p++;
        do {
          if (p === ms.p_end)
            luaL_error(ms.L, to_luastring("malformed pattern (missing ']')"));
          if (ms.p[p++] === L_ESC && p < ms.p_end)
            p++;
        } while (ms.p[p] !== 93);
        return p + 1;
      }
      default: {
        return p;
      }
    }
  };
  var match_class = function(c, cl) {
    switch (cl) {
      case 97:
        return isalpha(c);
      case 65:
        return !isalpha(c);
      case 99:
        return iscntrl(c);
      case 67:
        return !iscntrl(c);
      case 100:
        return isdigit(c);
      case 68:
        return !isdigit(c);
      case 103:
        return isgraph(c);
      case 71:
        return !isgraph(c);
      case 108:
        return islower(c);
      case 76:
        return !islower(c);
      case 112:
        return ispunct(c);
      case 80:
        return !ispunct(c);
      case 115:
        return isspace(c);
      case 83:
        return !isspace(c);
      case 117:
        return isupper(c);
      case 85:
        return !isupper(c);
      case 119:
        return isalnum(c);
      case 87:
        return !isalnum(c);
      case 120:
        return isxdigit(c);
      case 88:
        return !isxdigit(c);
      case 122:
        return c === 0;
      case 90:
        return c !== 0;
      default:
        return cl === c;
    }
  };
  var matchbracketclass = function(ms, c, p, ec) {
    let sig = true;
    if (ms.p[p + 1] === 94) {
      sig = false;
      p++;
    }
    while (++p < ec) {
      if (ms.p[p] === L_ESC) {
        p++;
        if (match_class(c, ms.p[p]))
          return sig;
      } else if (ms.p[p + 1] === 45 && p + 2 < ec) {
        p += 2;
        if (ms.p[p - 2] <= c && c <= ms.p[p])
          return sig;
      } else if (ms.p[p] === c)
        return sig;
    }
    return !sig;
  };
  var singlematch = function(ms, s, p, ep) {
    if (s >= ms.src_end)
      return false;
    else {
      let c = ms.src[s];
      switch (ms.p[p]) {
        case 46:
          return true;
        case L_ESC:
          return match_class(c, ms.p[p + 1]);
        case 91:
          return matchbracketclass(ms, c, p, ep - 1);
        default:
          return ms.p[p] === c;
      }
    }
  };
  var matchbalance = function(ms, s, p) {
    if (p >= ms.p_end - 1)
      luaL_error(ms.L, to_luastring("malformed pattern (missing arguments to '%%b'"));
    if (ms.src[s] !== ms.p[p])
      return null;
    else {
      let b = ms.p[p];
      let e = ms.p[p + 1];
      let cont = 1;
      while (++s < ms.src_end) {
        if (ms.src[s] === e) {
          if (--cont === 0)
            return s + 1;
        } else if (ms.src[s] === b)
          cont++;
      }
    }
    return null;
  };
  var max_expand = function(ms, s, p, ep) {
    let i = 0;
    while (singlematch(ms, s + i, p, ep))
      i++;
    while (i >= 0) {
      let res = match(ms, s + i, ep + 1);
      if (res)
        return res;
      i--;
    }
    return null;
  };
  var min_expand = function(ms, s, p, ep) {
    for (;; ) {
      let res = match(ms, s, ep + 1);
      if (res !== null)
        return res;
      else if (singlematch(ms, s, p, ep))
        s++;
      else
        return null;
    }
  };
  var start_capture = function(ms, s, p, what) {
    let level = ms.level;
    if (level >= LUA_MAXCAPTURES)
      luaL_error(ms.L, to_luastring("too many captures"));
    ms.capture[level] = ms.capture[level] ? ms.capture[level] : {};
    ms.capture[level].init = s;
    ms.capture[level].len = what;
    ms.level = level + 1;
    let res;
    if ((res = match(ms, s, p)) === null)
      ms.level--;
    return res;
  };
  var end_capture = function(ms, s, p) {
    let l = capture_to_close(ms);
    ms.capture[l].len = s - ms.capture[l].init;
    let res;
    if ((res = match(ms, s, p)) === null)
      ms.capture[l].len = CAP_UNFINISHED;
    return res;
  };
  var array_cmp = function(a, ai, b, bi, len) {
    return luastring_eq(a.subarray(ai, ai + len), b.subarray(bi, bi + len));
  };
  var match_capture = function(ms, s, l) {
    l = check_capture(ms, l);
    let len = ms.capture[l].len;
    if (ms.src_end - s >= len && array_cmp(ms.src, ms.capture[l].init, ms.src, s, len))
      return s + len;
    else
      return null;
  };
  var match = function(ms, s, p) {
    let gotodefault = false;
    let gotoinit = true;
    if (ms.matchdepth-- === 0)
      luaL_error(ms.L, to_luastring("pattern too complex"));
    while (gotoinit || gotodefault) {
      gotoinit = false;
      if (p !== ms.p_end) {
        switch (gotodefault ? undefined : ms.p[p]) {
          case 40: {
            if (ms.p[p + 1] === 41)
              s = start_capture(ms, s, p + 2, CAP_POSITION);
            else
              s = start_capture(ms, s, p + 1, CAP_UNFINISHED);
            break;
          }
          case 41: {
            s = end_capture(ms, s, p + 1);
            break;
          }
          case 36: {
            if (p + 1 !== ms.p_end) {
              gotodefault = true;
              break;
            }
            s = ms.src.length - s === 0 ? s : null;
            break;
          }
          case L_ESC: {
            switch (ms.p[p + 1]) {
              case 98: {
                s = matchbalance(ms, s, p + 2);
                if (s !== null) {
                  p += 4;
                  gotoinit = true;
                }
                break;
              }
              case 102: {
                p += 2;
                if (ms.p[p] !== 91)
                  luaL_error(ms.L, to_luastring("missing '[' after '%%f' in pattern"));
                let ep = classend(ms, p);
                let previous = s === ms.src_init ? 0 : ms.src[s - 1];
                if (!matchbracketclass(ms, previous, p, ep - 1) && matchbracketclass(ms, s === ms.src_end ? 0 : ms.src[s], p, ep - 1)) {
                  p = ep;
                  gotoinit = true;
                  break;
                }
                s = null;
                break;
              }
              case 48:
              case 49:
              case 50:
              case 51:
              case 52:
              case 53:
              case 54:
              case 55:
              case 56:
              case 57: {
                s = match_capture(ms, s, ms.p[p + 1]);
                if (s !== null) {
                  p += 2;
                  gotoinit = true;
                }
                break;
              }
              default:
                gotodefault = true;
            }
            break;
          }
          default: {
            gotodefault = false;
            let ep = classend(ms, p);
            if (!singlematch(ms, s, p, ep)) {
              if (ms.p[ep] === 42 || ms.p[ep] === 63 || ms.p[ep] === 45) {
                p = ep + 1;
                gotoinit = true;
                break;
              } else
                s = null;
            } else {
              switch (ms.p[ep]) {
                case 63: {
                  let res;
                  if ((res = match(ms, s + 1, ep + 1)) !== null)
                    s = res;
                  else {
                    p = ep + 1;
                    gotoinit = true;
                  }
                  break;
                }
                case 43:
                  s++;
                case 42:
                  s = max_expand(ms, s, p, ep);
                  break;
                case 45:
                  s = min_expand(ms, s, p, ep);
                  break;
                default:
                  s++;
                  p = ep;
                  gotoinit = true;
              }
            }
            break;
          }
        }
      }
    }
    ms.matchdepth++;
    return s;
  };
  var push_onecapture = function(ms, i, s, e) {
    if (i >= ms.level) {
      if (i === 0)
        lua_pushlstring(ms.L, ms.src.subarray(s, e), e - s);
      else
        luaL_error(ms.L, to_luastring("invalid capture index %%%d"), i + 1);
    } else {
      let l = ms.capture[i].len;
      if (l === CAP_UNFINISHED)
        luaL_error(ms.L, to_luastring("unfinished capture"));
      if (l === CAP_POSITION)
        lua_pushinteger(ms.L, ms.capture[i].init - ms.src_init + 1);
      else
        lua_pushlstring(ms.L, ms.src.subarray(ms.capture[i].init), l);
    }
  };
  var push_captures = function(ms, s, e) {
    let nlevels = ms.level === 0 && ms.src.subarray(s) ? 1 : ms.level;
    luaL_checkstack(ms.L, nlevels, "too many captures");
    for (let i = 0;i < nlevels; i++)
      push_onecapture(ms, i, s, e);
    return nlevels;
  };
  var nospecials = function(p, l) {
    for (let i = 0;i < l; i++) {
      if (luastring_indexOf(SPECIALS, p[i]) !== -1)
        return false;
    }
    return true;
  };
  var prepstate = function(ms, L, s, ls, p, lp) {
    ms.L = L;
    ms.matchdepth = MAXCCALLS;
    ms.src = s;
    ms.src_init = 0;
    ms.src_end = ls;
    ms.p = p;
    ms.p_end = lp;
  };
  var reprepstate = function(ms) {
    ms.level = 0;
    lualib.lua_assert(ms.matchdepth === MAXCCALLS);
  };
  var find_subarray = function(arr, subarr, from_index) {
    var i = from_index >>> 0, sl = subarr.length;
    if (sl === 0)
      return i;
    for (;(i = arr.indexOf(subarr[0], i)) !== -1; i++) {
      if (luastring_eq(arr.subarray(i, i + sl), subarr))
        return i;
    }
    return -1;
  };
  var str_find_aux = function(L, find) {
    let s = luaL_checkstring(L, 1);
    let p = luaL_checkstring(L, 2);
    let ls = s.length;
    let lp = p.length;
    let init = posrelat(luaL_optinteger(L, 3, 1), ls);
    if (init < 1)
      init = 1;
    else if (init > ls + 1) {
      lua_pushnil(L);
      return 1;
    }
    if (find && (lua_toboolean(L, 4) || nospecials(p, lp))) {
      let f = find_subarray(s.subarray(init - 1), p, 0);
      if (f > -1) {
        lua_pushinteger(L, init + f);
        lua_pushinteger(L, init + f + lp - 1);
        return 2;
      }
    } else {
      let ms = new MatchState(L);
      let s1 = init - 1;
      let anchor = p[0] === 94;
      if (anchor) {
        p = p.subarray(1);
        lp--;
      }
      prepstate(ms, L, s, ls, p, lp);
      do {
        let res;
        reprepstate(ms);
        if ((res = match(ms, s1, 0)) !== null) {
          if (find) {
            lua_pushinteger(L, s1 + 1);
            lua_pushinteger(L, res);
            return push_captures(ms, null, 0) + 2;
          } else
            return push_captures(ms, s1, res);
        }
      } while (s1++ < ms.src_end && !anchor);
    }
    lua_pushnil(L);
    return 1;
  };
  var str_find = function(L) {
    return str_find_aux(L, 1);
  };
  var str_match = function(L) {
    return str_find_aux(L, 0);
  };

  class GMatchState {
    constructor() {
      this.src = NaN;
      this.p = NaN;
      this.lastmatch = NaN;
      this.ms = new MatchState;
    }
  }
  var gmatch_aux = function(L) {
    let gm = lua_touserdata(L, lua_upvalueindex(3));
    gm.ms.L = L;
    for (let src = gm.src;src <= gm.ms.src_end; src++) {
      reprepstate(gm.ms);
      let e;
      if ((e = match(gm.ms, src, gm.p)) !== null && e !== gm.lastmatch) {
        gm.src = gm.lastmatch = e;
        return push_captures(gm.ms, src, e);
      }
    }
    return 0;
  };
  var str_gmatch = function(L) {
    let s = luaL_checkstring(L, 1);
    let p = luaL_checkstring(L, 2);
    let ls = s.length;
    let lp = p.length;
    lua_settop(L, 2);
    let gm = new GMatchState;
    lua_pushlightuserdata(L, gm);
    prepstate(gm.ms, L, s, ls, p, lp);
    gm.src = 0;
    gm.p = 0;
    gm.lastmatch = null;
    lua_pushcclosure(L, gmatch_aux, 3);
    return 1;
  };
  var add_s = function(ms, b, s, e) {
    let L = ms.L;
    let news = lua_tostring(L, 3);
    let l = news.length;
    for (let i = 0;i < l; i++) {
      if (news[i] !== L_ESC)
        luaL_addchar(b, news[i]);
      else {
        i++;
        if (!isdigit(news[i])) {
          if (news[i] !== L_ESC)
            luaL_error(L, to_luastring("invalid use of '%c' in replacement string"), L_ESC);
          luaL_addchar(b, news[i]);
        } else if (news[i] === 48)
          luaL_addlstring(b, ms.src.subarray(s, e), e - s);
        else {
          push_onecapture(ms, news[i] - 49, s, e);
          luaL_tolstring(L, -1);
          lua_remove(L, -2);
          luaL_addvalue(b);
        }
      }
    }
  };
  var add_value = function(ms, b, s, e, tr) {
    let L = ms.L;
    switch (tr) {
      case LUA_TFUNCTION: {
        lua_pushvalue(L, 3);
        let n = push_captures(ms, s, e);
        lua_call(L, n, 1);
        break;
      }
      case LUA_TTABLE: {
        push_onecapture(ms, 0, s, e);
        lua_gettable(L, 3);
        break;
      }
      default: {
        add_s(ms, b, s, e);
        return;
      }
    }
    if (!lua_toboolean(L, -1)) {
      lua_pop(L, 1);
      lua_pushlstring(L, ms.src.subarray(s, e), e - s);
    } else if (!lua_isstring(L, -1))
      luaL_error(L, to_luastring("invalid replacement value (a %s)"), luaL_typename(L, -1));
    luaL_addvalue(b);
  };
  var str_gsub = function(L) {
    let src = luaL_checkstring(L, 1);
    let srcl = src.length;
    let p = luaL_checkstring(L, 2);
    let lp = p.length;
    let lastmatch = null;
    let tr = lua_type(L, 3);
    let max_s = luaL_optinteger(L, 4, srcl + 1);
    let anchor = p[0] === 94;
    let n = 0;
    let ms = new MatchState(L);
    let b = new luaL_Buffer;
    luaL_argcheck(L, tr === LUA_TNUMBER || tr === LUA_TSTRING || tr === LUA_TFUNCTION || tr === LUA_TTABLE, 3, "string/function/table expected");
    luaL_buffinit(L, b);
    if (anchor) {
      p = p.subarray(1);
      lp--;
    }
    prepstate(ms, L, src, srcl, p, lp);
    src = 0;
    p = 0;
    while (n < max_s) {
      let e;
      reprepstate(ms);
      if ((e = match(ms, src, p)) !== null && e !== lastmatch) {
        n++;
        add_value(ms, b, src, e, tr);
        src = lastmatch = e;
      } else if (src < ms.src_end)
        luaL_addchar(b, ms.src[src++]);
      else
        break;
      if (anchor)
        break;
    }
    luaL_addlstring(b, ms.src.subarray(src, ms.src_end), ms.src_end - src);
    luaL_pushresult(b);
    lua_pushinteger(L, n);
    return 2;
  };
  var strlib = {
    byte: str_byte,
    char: str_char,
    dump: str_dump,
    find: str_find,
    format: str_format,
    gmatch: str_gmatch,
    gsub: str_gsub,
    len: str_len,
    lower: str_lower,
    match: str_match,
    pack: str_pack,
    packsize: str_packsize,
    rep: str_rep,
    reverse: str_reverse,
    sub: str_sub,
    unpack: str_unpack,
    upper: str_upper
  };
  var createmetatable = function(L) {
    lua_createtable(L, 0, 1);
    lua_pushliteral(L, "");
    lua_pushvalue(L, -2);
    lua_setmetatable(L, -2);
    lua_pop(L, 1);
    lua_pushvalue(L, -2);
    lua_setfield(L, -2, to_luastring("__index", true));
    lua_pop(L, 1);
  };
  var luaopen_string = function(L) {
    luaL_newlib(L, strlib);
    createmetatable(L);
    return 1;
  };
  exports.luaopen_string = luaopen_string;
});

// node_modules/fengari/src/lutf8lib.js
var require_lutf8lib = __commonJS(function(exports, module) {
  var {
    lua_gettop,
    lua_pushcfunction,
    lua_pushfstring,
    lua_pushinteger,
    lua_pushnil,
    lua_pushstring,
    lua_pushvalue,
    lua_setfield,
    lua_tointeger
  } = require_lua();
  var {
    luaL_Buffer,
    luaL_addvalue,
    luaL_argcheck,
    luaL_buffinit,
    luaL_checkinteger,
    luaL_checkstack,
    luaL_checkstring,
    luaL_error,
    luaL_newlib,
    luaL_optinteger,
    luaL_pushresult
  } = require_lauxlib();
  var {
    luastring_of,
    to_luastring
  } = require_fengaricore();
  var MAXUNICODE = 1114111;
  var iscont = function(p) {
    let c = p & 192;
    return c === 128;
  };
  var u_posrelat = function(pos, len) {
    if (pos >= 0)
      return pos;
    else if (0 - pos > len)
      return 0;
    else
      return len + pos + 1;
  };
  var limits = [255, 127, 2047, 65535];
  var utf8_decode = function(s, pos) {
    let c = s[pos];
    let res = 0;
    if (c < 128)
      res = c;
    else {
      let count = 0;
      while (c & 64) {
        let cc = s[pos + ++count];
        if ((cc & 192) !== 128)
          return null;
        res = res << 6 | cc & 63;
        c <<= 1;
      }
      res |= (c & 127) << count * 5;
      if (count > 3 || res > MAXUNICODE || res <= limits[count])
        return null;
      pos += count;
    }
    return {
      code: res,
      pos: pos + 1
    };
  };
  var utflen = function(L) {
    let n = 0;
    let s = luaL_checkstring(L, 1);
    let len = s.length;
    let posi = u_posrelat(luaL_optinteger(L, 2, 1), len);
    let posj = u_posrelat(luaL_optinteger(L, 3, -1), len);
    luaL_argcheck(L, 1 <= posi && --posi <= len, 2, "initial position out of string");
    luaL_argcheck(L, --posj < len, 3, "final position out of string");
    while (posi <= posj) {
      let dec = utf8_decode(s, posi);
      if (dec === null) {
        lua_pushnil(L);
        lua_pushinteger(L, posi + 1);
        return 2;
      }
      posi = dec.pos;
      n++;
    }
    lua_pushinteger(L, n);
    return 1;
  };
  var p_U = to_luastring("%U");
  var pushutfchar = function(L, arg) {
    let code = luaL_checkinteger(L, arg);
    luaL_argcheck(L, 0 <= code && code <= MAXUNICODE, arg, "value out of range");
    lua_pushfstring(L, p_U, code);
  };
  var utfchar = function(L) {
    let n = lua_gettop(L);
    if (n === 1)
      pushutfchar(L, 1);
    else {
      let b = new luaL_Buffer;
      luaL_buffinit(L, b);
      for (let i = 1;i <= n; i++) {
        pushutfchar(L, i);
        luaL_addvalue(b);
      }
      luaL_pushresult(b);
    }
    return 1;
  };
  var byteoffset = function(L) {
    let s = luaL_checkstring(L, 1);
    let n = luaL_checkinteger(L, 2);
    let posi = n >= 0 ? 1 : s.length + 1;
    posi = u_posrelat(luaL_optinteger(L, 3, posi), s.length);
    luaL_argcheck(L, 1 <= posi && --posi <= s.length, 3, "position out of range");
    if (n === 0) {
      while (posi > 0 && iscont(s[posi]))
        posi--;
    } else {
      if (iscont(s[posi]))
        luaL_error(L, "initial position is a continuation byte");
      if (n < 0) {
        while (n < 0 && posi > 0) {
          do {
            posi--;
          } while (posi > 0 && iscont(s[posi]));
          n++;
        }
      } else {
        n--;
        while (n > 0 && posi < s.length) {
          do {
            posi++;
          } while (iscont(s[posi]));
          n--;
        }
      }
    }
    if (n === 0)
      lua_pushinteger(L, posi + 1);
    else
      lua_pushnil(L);
    return 1;
  };
  var codepoint = function(L) {
    let s = luaL_checkstring(L, 1);
    let posi = u_posrelat(luaL_optinteger(L, 2, 1), s.length);
    let pose = u_posrelat(luaL_optinteger(L, 3, posi), s.length);
    luaL_argcheck(L, posi >= 1, 2, "out of range");
    luaL_argcheck(L, pose <= s.length, 3, "out of range");
    if (posi > pose)
      return 0;
    if (pose - posi >= Number.MAX_SAFE_INTEGER)
      return luaL_error(L, "string slice too long");
    let n = pose - posi + 1;
    luaL_checkstack(L, n, "string slice too long");
    n = 0;
    for (posi -= 1;posi < pose; ) {
      let dec = utf8_decode(s, posi);
      if (dec === null)
        return luaL_error(L, "invalid UTF-8 code");
      lua_pushinteger(L, dec.code);
      posi = dec.pos;
      n++;
    }
    return n;
  };
  var iter_aux = function(L) {
    let s = luaL_checkstring(L, 1);
    let len = s.length;
    let n = lua_tointeger(L, 2) - 1;
    if (n < 0)
      n = 0;
    else if (n < len) {
      n++;
      while (iscont(s[n]))
        n++;
    }
    if (n >= len)
      return 0;
    else {
      let dec = utf8_decode(s, n);
      if (dec === null || iscont(s[dec.pos]))
        return luaL_error(L, to_luastring("invalid UTF-8 code"));
      lua_pushinteger(L, n + 1);
      lua_pushinteger(L, dec.code);
      return 2;
    }
  };
  var iter_codes = function(L) {
    luaL_checkstring(L, 1);
    lua_pushcfunction(L, iter_aux);
    lua_pushvalue(L, 1);
    lua_pushinteger(L, 0);
    return 3;
  };
  var funcs = {
    char: utfchar,
    codepoint,
    codes: iter_codes,
    len: utflen,
    offset: byteoffset
  };
  var UTF8PATT = luastring_of(91, 0, 45, 127, 194, 45, 244, 93, 91, 128, 45, 191, 93, 42);
  var luaopen_utf8 = function(L) {
    luaL_newlib(L, funcs);
    lua_pushstring(L, UTF8PATT);
    lua_setfield(L, -2, to_luastring("charpattern", true));
    return 1;
  };
  exports.luaopen_utf8 = luaopen_utf8;
});

// node_modules/fengari/src/lmathlib.js
var require_lmathlib = __commonJS(function(exports, module) {
  var {
    LUA_OPLT,
    LUA_TNUMBER,
    lua_compare,
    lua_gettop,
    lua_isinteger,
    lua_isnoneornil,
    lua_pushboolean,
    lua_pushinteger,
    lua_pushliteral,
    lua_pushnil,
    lua_pushnumber,
    lua_pushvalue,
    lua_setfield,
    lua_settop,
    lua_tointeger,
    lua_tointegerx,
    lua_type
  } = require_lua();
  var {
    luaL_argcheck,
    luaL_argerror,
    luaL_checkany,
    luaL_checkinteger,
    luaL_checknumber,
    luaL_error,
    luaL_newlib,
    luaL_optnumber
  } = require_lauxlib();
  var {
    LUA_MAXINTEGER,
    LUA_MININTEGER,
    lua_numbertointeger
  } = require_luaconf();
  var { to_luastring } = require_fengaricore();
  var rand_state;
  var l_rand = function() {
    rand_state = 1103515245 * rand_state + 12345 & 2147483647;
    return rand_state;
  };
  var l_srand = function(x) {
    rand_state = x | 0;
    if (rand_state === 0)
      rand_state = 1;
  };
  var math_random = function(L) {
    let low, up;
    let r = rand_state === undefined ? Math.random() : l_rand() / 2147483648;
    switch (lua_gettop(L)) {
      case 0:
        lua_pushnumber(L, r);
        return 1;
      case 1: {
        low = 1;
        up = luaL_checkinteger(L, 1);
        break;
      }
      case 2: {
        low = luaL_checkinteger(L, 1);
        up = luaL_checkinteger(L, 2);
        break;
      }
      default:
        return luaL_error(L, "wrong number of arguments");
    }
    luaL_argcheck(L, low <= up, 1, "interval is empty");
    luaL_argcheck(L, low >= 0 || up <= LUA_MAXINTEGER + low, 1, "interval too large");
    r *= up - low + 1;
    lua_pushinteger(L, Math.floor(r) + low);
    return 1;
  };
  var math_randomseed = function(L) {
    l_srand(luaL_checknumber(L, 1));
    l_rand();
    return 0;
  };
  var math_abs = function(L) {
    if (lua_isinteger(L, 1)) {
      let n = lua_tointeger(L, 1);
      if (n < 0)
        n = -n | 0;
      lua_pushinteger(L, n);
    } else
      lua_pushnumber(L, Math.abs(luaL_checknumber(L, 1)));
    return 1;
  };
  var math_sin = function(L) {
    lua_pushnumber(L, Math.sin(luaL_checknumber(L, 1)));
    return 1;
  };
  var math_cos = function(L) {
    lua_pushnumber(L, Math.cos(luaL_checknumber(L, 1)));
    return 1;
  };
  var math_tan = function(L) {
    lua_pushnumber(L, Math.tan(luaL_checknumber(L, 1)));
    return 1;
  };
  var math_asin = function(L) {
    lua_pushnumber(L, Math.asin(luaL_checknumber(L, 1)));
    return 1;
  };
  var math_acos = function(L) {
    lua_pushnumber(L, Math.acos(luaL_checknumber(L, 1)));
    return 1;
  };
  var math_atan = function(L) {
    let y = luaL_checknumber(L, 1);
    let x = luaL_optnumber(L, 2, 1);
    lua_pushnumber(L, Math.atan2(y, x));
    return 1;
  };
  var math_toint = function(L) {
    let n = lua_tointegerx(L, 1);
    if (n !== false)
      lua_pushinteger(L, n);
    else {
      luaL_checkany(L, 1);
      lua_pushnil(L);
    }
    return 1;
  };
  var pushnumint = function(L, d) {
    let n = lua_numbertointeger(d);
    if (n !== false)
      lua_pushinteger(L, n);
    else
      lua_pushnumber(L, d);
  };
  var math_floor = function(L) {
    if (lua_isinteger(L, 1))
      lua_settop(L, 1);
    else
      pushnumint(L, Math.floor(luaL_checknumber(L, 1)));
    return 1;
  };
  var math_ceil = function(L) {
    if (lua_isinteger(L, 1))
      lua_settop(L, 1);
    else
      pushnumint(L, Math.ceil(luaL_checknumber(L, 1)));
    return 1;
  };
  var math_sqrt = function(L) {
    lua_pushnumber(L, Math.sqrt(luaL_checknumber(L, 1)));
    return 1;
  };
  var math_ult = function(L) {
    let a = luaL_checkinteger(L, 1);
    let b = luaL_checkinteger(L, 2);
    lua_pushboolean(L, a >= 0 ? b < 0 || a < b : b < 0 && a < b);
    return 1;
  };
  var math_log = function(L) {
    let x = luaL_checknumber(L, 1);
    let res;
    if (lua_isnoneornil(L, 2))
      res = Math.log(x);
    else {
      let base = luaL_checknumber(L, 2);
      if (base === 2)
        res = Math.log2(x);
      else if (base === 10)
        res = Math.log10(x);
      else
        res = Math.log(x) / Math.log(base);
    }
    lua_pushnumber(L, res);
    return 1;
  };
  var math_exp = function(L) {
    lua_pushnumber(L, Math.exp(luaL_checknumber(L, 1)));
    return 1;
  };
  var math_deg = function(L) {
    lua_pushnumber(L, luaL_checknumber(L, 1) * (180 / Math.PI));
    return 1;
  };
  var math_rad = function(L) {
    lua_pushnumber(L, luaL_checknumber(L, 1) * (Math.PI / 180));
    return 1;
  };
  var math_min = function(L) {
    let n = lua_gettop(L);
    let imin = 1;
    luaL_argcheck(L, n >= 1, 1, "value expected");
    for (let i = 2;i <= n; i++) {
      if (lua_compare(L, i, imin, LUA_OPLT))
        imin = i;
    }
    lua_pushvalue(L, imin);
    return 1;
  };
  var math_max = function(L) {
    let n = lua_gettop(L);
    let imax = 1;
    luaL_argcheck(L, n >= 1, 1, "value expected");
    for (let i = 2;i <= n; i++) {
      if (lua_compare(L, imax, i, LUA_OPLT))
        imax = i;
    }
    lua_pushvalue(L, imax);
    return 1;
  };
  var math_type = function(L) {
    if (lua_type(L, 1) === LUA_TNUMBER) {
      if (lua_isinteger(L, 1))
        lua_pushliteral(L, "integer");
      else
        lua_pushliteral(L, "float");
    } else {
      luaL_checkany(L, 1);
      lua_pushnil(L);
    }
    return 1;
  };
  var math_fmod = function(L) {
    if (lua_isinteger(L, 1) && lua_isinteger(L, 2)) {
      let d = lua_tointeger(L, 2);
      if (d === 0) {
        luaL_argerror(L, 2, "zero");
      } else
        lua_pushinteger(L, lua_tointeger(L, 1) % d | 0);
    } else {
      let a = luaL_checknumber(L, 1);
      let b = luaL_checknumber(L, 2);
      lua_pushnumber(L, a % b);
    }
    return 1;
  };
  var math_modf = function(L) {
    if (lua_isinteger(L, 1)) {
      lua_settop(L, 1);
      lua_pushnumber(L, 0);
    } else {
      let n = luaL_checknumber(L, 1);
      let ip = n < 0 ? Math.ceil(n) : Math.floor(n);
      pushnumint(L, ip);
      lua_pushnumber(L, n === ip ? 0 : n - ip);
    }
    return 2;
  };
  var mathlib = {
    abs: math_abs,
    acos: math_acos,
    asin: math_asin,
    atan: math_atan,
    ceil: math_ceil,
    cos: math_cos,
    deg: math_deg,
    exp: math_exp,
    floor: math_floor,
    fmod: math_fmod,
    log: math_log,
    max: math_max,
    min: math_min,
    modf: math_modf,
    rad: math_rad,
    random: math_random,
    randomseed: math_randomseed,
    sin: math_sin,
    sqrt: math_sqrt,
    tan: math_tan,
    tointeger: math_toint,
    type: math_type,
    ult: math_ult
  };
  var luaopen_math = function(L) {
    luaL_newlib(L, mathlib);
    lua_pushnumber(L, Math.PI);
    lua_setfield(L, -2, to_luastring("pi", true));
    lua_pushnumber(L, Infinity);
    lua_setfield(L, -2, to_luastring("huge", true));
    lua_pushinteger(L, LUA_MAXINTEGER);
    lua_setfield(L, -2, to_luastring("maxinteger", true));
    lua_pushinteger(L, LUA_MININTEGER);
    lua_setfield(L, -2, to_luastring("mininteger", true));
    return 1;
  };
  exports.luaopen_math = luaopen_math;
});

// node_modules/fengari/src/ldblib.js
var require_ldblib = __commonJS(function(exports, module) {
  var { lua_newtable } = require_lua();
  exports.luaopen_debug = (L) => {
    lua_newtable(L);
    return 1;
  };
});

// node_modules/fengari/src/loadlib.js
var require_loadlib = __commonJS(function(exports, module) {
  var { lua_newtable } = require_lua();
  exports.luaopen_package = (L) => {
    lua_newtable(L);
    return 1;
  };
});

// node_modules/fengari/src/fengarilib.js
var require_fengarilib = __commonJS(function(exports, module) {
  var { lua_newtable } = require_lua();
  exports.luaopen_fengari = (L) => {
    lua_newtable(L);
    return 1;
  };
});

// node_modules/fengari/src/linit.js
var require_linit = __commonJS(function(exports, module) {
  var { lua_pop } = require_lua();
  var { luaL_requiref } = require_lauxlib();
  var { to_luastring } = require_fengaricore();
  var loadedlibs = {};
  var luaL_openlibs = function(L) {
    for (let lib in loadedlibs) {
      luaL_requiref(L, to_luastring(lib), loadedlibs[lib], 1);
      lua_pop(L, 1);
    }
  };
  exports.luaL_openlibs = luaL_openlibs;
  var lualib = require_lualib();
  var { luaopen_base } = require_lbaselib();
  var { luaopen_coroutine } = require_lcorolib();
  var { luaopen_debug } = require_ldblib();
  var { luaopen_math } = require_lmathlib();
  var { luaopen_package } = require_loadlib();
  var { luaopen_os } = require_loslib();
  var { luaopen_string } = require_lstrlib();
  var { luaopen_table } = require_ltablib();
  var { luaopen_utf8 } = require_lutf8lib();
  loadedlibs["_G"] = luaopen_base, loadedlibs[lualib.LUA_LOADLIBNAME] = luaopen_package;
  loadedlibs[lualib.LUA_COLIBNAME] = luaopen_coroutine;
  loadedlibs[lualib.LUA_TABLIBNAME] = luaopen_table;
  loadedlibs[lualib.LUA_OSLIBNAME] = luaopen_os;
  loadedlibs[lualib.LUA_STRLIBNAME] = luaopen_string;
  loadedlibs[lualib.LUA_MATHLIBNAME] = luaopen_math;
  loadedlibs[lualib.LUA_UTF8LIBNAME] = luaopen_utf8;
  loadedlibs[lualib.LUA_DBLIBNAME] = luaopen_debug;
  if (typeof process !== "undefined")
    loadedlibs[lualib.LUA_IOLIBNAME] = require_liolib().luaopen_io;
  var { luaopen_fengari } = require_fengarilib();
  loadedlibs[lualib.LUA_FENGARILIBNAME] = luaopen_fengari;
});

// node_modules/fengari/src/lualib.js
var require_lualib = __commonJS(function(exports, module) {
  var {
    LUA_VERSION_MAJOR,
    LUA_VERSION_MINOR
  } = require_lua();
  var LUA_VERSUFFIX = "_" + LUA_VERSION_MAJOR + "_" + LUA_VERSION_MINOR;
  exports.LUA_VERSUFFIX = LUA_VERSUFFIX;
  exports.lua_assert = function(c) {};
  exports.luaopen_base = require_lbaselib().luaopen_base;
  var LUA_COLIBNAME = "coroutine";
  exports.LUA_COLIBNAME = LUA_COLIBNAME;
  exports.luaopen_coroutine = require_lcorolib().luaopen_coroutine;
  var LUA_TABLIBNAME = "table";
  exports.LUA_TABLIBNAME = LUA_TABLIBNAME;
  exports.luaopen_table = require_ltablib().luaopen_table;
  if (typeof process !== "undefined") {
    const LUA_IOLIBNAME = "io";
    exports.LUA_IOLIBNAME = LUA_IOLIBNAME;
    exports.luaopen_io = require_liolib().luaopen_io;
  }
  var LUA_OSLIBNAME = "os";
  exports.LUA_OSLIBNAME = LUA_OSLIBNAME;
  exports.luaopen_os = require_loslib().luaopen_os;
  var LUA_STRLIBNAME = "string";
  exports.LUA_STRLIBNAME = LUA_STRLIBNAME;
  exports.luaopen_string = require_lstrlib().luaopen_string;
  var LUA_UTF8LIBNAME = "utf8";
  exports.LUA_UTF8LIBNAME = LUA_UTF8LIBNAME;
  exports.luaopen_utf8 = require_lutf8lib().luaopen_utf8;
  var LUA_BITLIBNAME = "bit32";
  exports.LUA_BITLIBNAME = LUA_BITLIBNAME;
  var LUA_MATHLIBNAME = "math";
  exports.LUA_MATHLIBNAME = LUA_MATHLIBNAME;
  exports.luaopen_math = require_lmathlib().luaopen_math;
  var LUA_DBLIBNAME = "debug";
  exports.LUA_DBLIBNAME = LUA_DBLIBNAME;
  exports.luaopen_debug = require_ldblib().luaopen_debug;
  var LUA_LOADLIBNAME = "package";
  exports.LUA_LOADLIBNAME = LUA_LOADLIBNAME;
  exports.luaopen_package = require_loadlib().luaopen_package;
  var LUA_FENGARILIBNAME = "fengari";
  exports.LUA_FENGARILIBNAME = LUA_FENGARILIBNAME;
  exports.luaopen_fengari = require_fengarilib().luaopen_fengari;
  var linit = require_linit();
  exports.luaL_openlibs = linit.luaL_openlibs;
});

// node_modules/fengari/src/fengari.js
var exports_fengari = {};
__exportCjs(exports_fengari, {
  FENGARI_AUTHORS: () => $FENGARI_AUTHORS,
  FENGARI_COPYRIGHT: () => $FENGARI_COPYRIGHT,
  FENGARI_RELEASE: () => $FENGARI_RELEASE,
  FENGARI_VERSION: () => $FENGARI_VERSION,
  FENGARI_VERSION_MAJOR: () => $FENGARI_VERSION_MAJOR,
  FENGARI_VERSION_MINOR: () => $FENGARI_VERSION_MINOR,
  FENGARI_VERSION_NUM: () => $FENGARI_VERSION_NUM,
  FENGARI_VERSION_RELEASE: () => $FENGARI_VERSION_RELEASE,
  luastring_eq: () => $luastring_eq,
  luastring_indexOf: () => $luastring_indexOf,
  luastring_of: () => $luastring_of,
  to_jsstring: () => $to_jsstring,
  to_luastring: () => $to_luastring,
  to_uristring: () => $to_uristring,
  luaconf: () => $luaconf,
  lua: () => $lua,
  lauxlib: () => $lauxlib,
  lualib: () => $lualib
}, {
  FENGARI_AUTHORS: (value) => $FENGARI_AUTHORS = value,
  FENGARI_COPYRIGHT: (value) => $FENGARI_COPYRIGHT = value,
  FENGARI_RELEASE: (value) => $FENGARI_RELEASE = value,
  FENGARI_VERSION: (value) => $FENGARI_VERSION = value,
  FENGARI_VERSION_MAJOR: (value) => $FENGARI_VERSION_MAJOR = value,
  FENGARI_VERSION_MINOR: (value) => $FENGARI_VERSION_MINOR = value,
  FENGARI_VERSION_NUM: (value) => $FENGARI_VERSION_NUM = value,
  FENGARI_VERSION_RELEASE: (value) => $FENGARI_VERSION_RELEASE = value,
  luastring_eq: (value) => $luastring_eq = value,
  luastring_indexOf: (value) => $luastring_indexOf = value,
  luastring_of: (value) => $luastring_of = value,
  to_jsstring: (value) => $to_jsstring = value,
  to_luastring: (value) => $to_luastring = value,
  to_uristring: (value) => $to_uristring = value,
  luaconf: (value) => $luaconf = value,
  lua: (value) => $lua = value,
  lauxlib: (value) => $lauxlib = value,
  lualib: (value) => $lualib = value
});

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

// src/regex-sync.ts
var SYNC_VERSION = 5;
function countGroups(src) {
  let n = 0;
  let inClass = false;
  for (let i = 0;i < src.length; i++) {
    const c = src[i];
    if (c === "\\") {
      i++;
      continue;
    }
    if (inClass) {
      if (c === "]")
        inClass = false;
      continue;
    }
    if (c === "[") {
      inClass = true;
      continue;
    }
    if (c !== "(")
      continue;
    if (src[i + 1] !== "?") {
      n++;
      continue;
    }
    if (src[i + 2] === "<" && src[i + 3] !== "=" && src[i + 3] !== "!")
      n++;
  }
  return n;
}
function moveTop(find, out) {
  const n = countGroups(find);
  const shifted = out.replace(/\$(\$|&|\d{1,2})/g, (m, g) => {
    if (g === "$")
      return "$$";
    if (g === "&")
      return "$2";
    return `$${Number(g) + 2}`;
  });
  return { find: `^([\\s\\S]*?)(${find})([\\s\\S]*)$`, out: `${shifted}$1$${n + 3}` };
}
function risuFlags(orig) {
  if (!orig || !orig.ableFlag || !orig.flag)
    return { flags: "g", moveTop: false };
  const raw = orig.flag;
  const moveTop = /<move_top>/i.test(raw);
  let letters = [...new Set(raw.replace(/<[^>]*>/g, "").replace(/[^gimsuy]/g, "").split(""))].join("");
  if (moveTop)
    letters = letters.replace(/[gm]/g, "");
  return { flags: letters, moveTop };
}
var MACRO_RE = /\{\{|<(?:user|char|bot)>/i;
var HTML_RE = /<(?:div|span|img|section|details|table|p|ul|button|label|svg|a)\b|\{\{\s*(?:img|image|asset|emotion)::/i;
function backgroundStyles(backgroundHTML) {
  if (!backgroundHTML)
    return "";
  return (backgroundHTML.match(/<style[\s\S]*?<\/style>/gi) ?? []).join(`
`);
}
function isRisuImported(s) {
  return s.metadata?.source === "risuai_module";
}
function alreadySynced(s, linked = false) {
  const meta = s.metadata ?? {};
  return meta.risubridge?.version === SYNC_VERSION && (!linked || meta.risubridge?.linked === true);
}
function matchOriginal(s, originals) {
  if (!originals?.length)
    return;
  const meta = s.metadata ?? {};
  const find = meta.risubridge?.original?.find_regex ?? s.find_regex;
  return originals.find((o) => o.in === find && (o.comment ?? "") === s.name.replace(/^Imported RisuAI Script \d+$/, "")) ?? originals.find((o) => o.in === find);
}
var folderName = (charName) => `\uB9AC\uC2A4 \xB7 ${charName}`.slice(0, 120);
function fixFor(s, bgStyles, orig, charName) {
  const meta = { ...s.metadata ?? {} };
  const type = String(meta.original_type ?? "editdisplay");
  const original = meta.risubridge?.original ?? {
    replace_string: s.replace_string,
    flags: s.flags,
    placement: s.placement,
    target: s.target,
    substitute_macros: s.substitute_macros,
    disabled: s.disabled,
    find_regex: s.find_regex,
    folder: s.folder ?? ""
  };
  const unprefix = (t) => t.replace(/x-risu-/g, "");
  const out = unprefix(original.replace_string);
  bgStyles = unprefix(bgStyles);
  let target = "display";
  let placement = ["ai_output", "user_input"];
  if (type === "editoutput") {
    target = "response";
    placement = ["ai_output"];
  } else if (type === "editinput") {
    target = "response";
    placement = ["user_input"];
  } else if (type === "editprocess") {
    target = "prompt";
    placement = ["ai_output", "user_input"];
  }
  const css = target === "display" && bgStyles && HTML_RE.test(out) ? cssFor(bgStyles, out) : "";
  const withStyles = css ? `${css}
${out}` : out;
  const f = risuFlags(orig);
  const moved = f.moveTop ? moveTop(original.find_regex ?? s.find_regex, withStyles) : null;
  const currentFolder = (s.folder ?? "").trim();
  const folder = charName && (!currentFolder || currentFolder === folderName(charName)) ? folderName(charName) : undefined;
  return {
    ...folder ? { folder } : {},
    ...moved ? { find_regex: moved.find } : original.find_regex && original.find_regex !== s.find_regex ? { find_regex: original.find_regex } : {},
    replace_string: moved ? moved.out : withStyles,
    flags: f.flags,
    placement,
    target,
    substitute_macros: MACRO_RE.test(moved ? moved.out : withStyles) || MACRO_RE.test(original.find_regex ?? s.find_regex) ? "raw" : "none",
    disabled: type === "disabled",
    metadata: { ...withoutQuarantine(meta), risubridge: { version: SYNC_VERSION, original, linked: Boolean(orig) } }
  };
}
function withoutQuarantine(meta) {
  const ev = meta.regex_evidence;
  if (!ev || typeof ev !== "object" || !("quarantined" in ev))
    return meta;
  const { quarantined: _q, ...rest } = ev;
  return { ...meta, regex_evidence: rest };
}
function revertFor(s) {
  const meta = { ...s.metadata ?? {} };
  const original = meta.risubridge?.original;
  if (!original)
    return null;
  delete meta.risubridge;
  return {
    ...typeof original.folder === "string" ? { folder: original.folder } : {},
    ...original.find_regex ? { find_regex: original.find_regex } : {},
    replace_string: original.replace_string,
    flags: original.flags,
    placement: original.placement,
    target: original.target,
    substitute_macros: original.substitute_macros,
    disabled: original.disabled,
    metadata: meta
  };
}
function cssFor(styles, out) {
  if (!styles)
    return "";
  const words = new Set(out.match(/[A-Za-z_][\w-]*/g) ?? []);
  const keepSelector = (sel) => {
    const names = sel.match(/[.#]([A-Za-z_][\w-]*)/g);
    if (!names)
      return true;
    return names.some((n) => words.has(n.slice(1)));
  };
  const filterBlock = (css) => {
    let outCss = "";
    let i = 0;
    while (i < css.length) {
      const open = css.indexOf("{", i);
      if (open < 0) {
        outCss += css.slice(i);
        break;
      }
      const head = css.slice(i, open);
      let depth = 1, j = open + 1;
      while (j < css.length && depth > 0) {
        if (css[j] === "{")
          depth++;
        else if (css[j] === "}")
          depth--;
        j++;
      }
      const body = css.slice(open + 1, j - 1);
      const h = head.trim();
      if (h.startsWith("@media") || h.startsWith("@supports") || h.startsWith("@container")) {
        const inner = filterBlock(body);
        if (inner.trim())
          outCss += `${head}{${inner}}`;
      } else if (h.startsWith("@")) {
        outCss += `${head}{${body}}`;
      } else if (h.split(",").some(keepSelector)) {
        outCss += `${head}{${body}}`;
      }
      i = j;
    }
    return outCss;
  };
  return styles.replace(/<style([^>]*)>([\s\S]*?)<\/style>/gi, (_m, attrs, css) => {
    const kept = filterBlock(css);
    return kept.trim() ? `<style${attrs}>${kept}</style>` : "";
  }).trim();
}

// src/lore-sync.ts
var LORE_SYNC_VERSION = 1;
var RISU_DEFAULT_SCAN_DEPTH = 5;
var FIELDS = [
  "content",
  "position",
  "depth",
  "role",
  "constant",
  "disabled",
  "selective",
  "keysecondary",
  "selective_logic",
  "scan_depth",
  "probability",
  "use_probability",
  "match_whole_words",
  "prevent_recursion"
];
var DECORATOR_LINE = /^@@@?([a-z_]+)(?:[ \t]+(.*))?$/;
function parseDecorators(content) {
  const d = {};
  const kept = [];
  let found = false;
  for (const line of content.split(`
`)) {
    const m = DECORATOR_LINE.exec(line.trim());
    if (!m || !line.trimStart().startsWith("@@")) {
      kept.push(line);
      continue;
    }
    found = true;
    const name = m[1];
    const args = (m[2] ?? "").split(",").map((a) => a.trim()).filter(Boolean);
    const int = parseInt(args[0] ?? "", 10);
    switch (name) {
      case "depth":
        if (!Number.isNaN(int))
          d.depth = int;
        break;
      case "end":
        d.depth = 0;
        break;
      case "scan_depth":
        if (!Number.isNaN(int))
          d.scanDepth = int;
        break;
      case "role":
        if (args[0] === "system" || args[0] === "user" || args[0] === "assistant")
          d.role = args[0];
        break;
      case "activate":
        d.activate = true;
        break;
      case "dont_activate":
        d.dontActivate = true;
        break;
      case "recursive":
        d.recursive = true;
        break;
      case "unrecursive":
        d.recursive = false;
        break;
      case "probability":
        if (!Number.isNaN(int))
          d.probability = int;
        break;
      case "match_full_word":
        d.fullWord = true;
        break;
      case "match_partial_word":
        d.fullWord = false;
        break;
      case "additional_keys":
        d.additionalKeys = args;
        break;
      case "exclude_keys":
        d.excludeKeys = args;
        break;
      case "exclude_keys_all":
        d.excludeKeys = args;
        d.excludeAll = true;
        break;
      default:
        break;
    }
  }
  while (found && kept.length && kept[0].trim() === "")
    kept.shift();
  return { decorators: d, content: kept.join(`
`), found };
}
function isLoreSynced(e) {
  return e.extensions?.risubridge?.version === LORE_SYNC_VERSION;
}
function matchCardEntry(e, card) {
  const content = e.extensions?.risubridge?.original?.content ?? e.content;
  return card.find((c) => (c.content ?? "") === content && (c.comment ?? c.name ?? "") === (e.comment ?? "")) ?? card.find((c) => (c.content ?? "") === content);
}
function loreFixFor(e, cardScanDepth) {
  const original = e.extensions?.risubridge?.original ?? Object.fromEntries(FIELDS.map((f) => [f, e[f]]));
  const base = { ...e, ...original };
  const { decorators: d, content } = parseDecorators(base.content);
  const out = {};
  if (content !== base.content)
    out.content = content;
  if (d.depth !== undefined) {
    out.position = 4;
    out.depth = d.depth;
  }
  if (d.role)
    out.role = d.role;
  if (d.activate)
    out.constant = true;
  if (d.dontActivate)
    out.disabled = true;
  if (d.recursive !== undefined)
    out.prevent_recursion = !d.recursive;
  if (d.probability !== undefined) {
    out.use_probability = true;
    out.probability = Math.max(0, Math.min(100, d.probability));
  }
  if (d.fullWord !== undefined)
    out.match_whole_words = d.fullWord;
  if (!base.selective || base.keysecondary.length === 0) {
    if (d.additionalKeys?.length) {
      out.selective = true;
      out.keysecondary = d.additionalKeys;
      out.selective_logic = 2;
    } else if (d.excludeKeys?.length) {
      out.selective = true;
      out.keysecondary = d.excludeKeys;
      out.selective_logic = d.excludeAll ? 3 : 1;
    }
  }
  if (base.scan_depth === null || base.scan_depth === undefined) {
    const depth = d.scanDepth ?? (cardScanDepth && cardScanDepth > 0 ? cardScanDepth : RISU_DEFAULT_SCAN_DEPTH);
    out.scan_depth = Math.max(1, depth);
  }
  const changed = Object.entries(out).some(([k, v]) => JSON.stringify(e[k]) !== JSON.stringify(v));
  if (!changed && isLoreSynced(e))
    return null;
  return {
    ...out,
    extensions: { ...e.extensions ?? {}, risubridge: { version: LORE_SYNC_VERSION, original } }
  };
}

// node_modules/fengari/src/fengari.js
var core = require_fengaricore();
var $FENGARI_AUTHORS = core.FENGARI_AUTHORS;
var $FENGARI_COPYRIGHT = core.FENGARI_COPYRIGHT;
var $FENGARI_RELEASE = core.FENGARI_RELEASE;
var $FENGARI_VERSION = core.FENGARI_VERSION;
var $FENGARI_VERSION_MAJOR = core.FENGARI_VERSION_MAJOR;
var $FENGARI_VERSION_MINOR = core.FENGARI_VERSION_MINOR;
var $FENGARI_VERSION_NUM = core.FENGARI_VERSION_NUM;
var $FENGARI_VERSION_RELEASE = core.FENGARI_VERSION_RELEASE;
var $luastring_eq = core.luastring_eq;
var $luastring_indexOf = core.luastring_indexOf;
var $luastring_of = core.luastring_of;
var $to_jsstring = core.to_jsstring;
var $to_luastring = core.to_luastring;
var $to_uristring = core.to_uristring;
var luaconf = require_luaconf();
var lua = require_lua();
var lauxlib = require_lauxlib();
var lualib = require_lualib();
var $luaconf = luaconf;
var $lua = lua;
var $lauxlib = lauxlib;
var $lualib = lualib;

// src/lua.ts
var { lua: lua2, lauxlib: lauxlib2, lualib: lualib2, to_luastring } = exports_fengari;
var PRELUDE = `
local __yield = coroutine.yield
Promise = {}
Promise.__index = Promise
function Promise:await()
  if self.__resolved then return table.unpack(self.__resolved, 1, self.__resolved.n) end
  return __yield(self)
end
function async(fn)
  return function(...)
    local r = table.pack(fn(...))
    return setmetatable({ __resolved = r }, Promise)
  end
end
function __pending(id) return setmetatable({ __pid = id }, Promise) end
json = json or {}
`;
function push(L, v, depth = 0) {
  if (v === null || v === undefined || depth > 20) {
    lua2.lua_pushnil(L);
    return;
  }
  if (typeof v === "boolean") {
    lua2.lua_pushboolean(L, v);
    return;
  }
  if (typeof v === "number") {
    Number.isInteger(v) ? lua2.lua_pushinteger(L, v) : lua2.lua_pushnumber(L, v);
    return;
  }
  if (typeof v === "string") {
    lua2.lua_pushstring(L, to_luastring(v));
    return;
  }
  if (Array.isArray(v)) {
    lua2.lua_createtable(L, v.length, 0);
    v.forEach((item, i) => {
      push(L, item, depth + 1);
      lua2.lua_rawseti(L, -2, i + 1);
    });
    return;
  }
  if (typeof v === "object") {
    lua2.lua_newtable(L);
    for (const [k, val] of Object.entries(v)) {
      push(L, val, depth + 1);
      lua2.lua_setfield(L, -2, to_luastring(k));
    }
    return;
  }
  lua2.lua_pushnil(L);
}
function toJs(L, idx, depth = 0) {
  const t = lua2.lua_type(L, idx);
  switch (t) {
    case lua2.LUA_TNIL:
    case lua2.LUA_TNONE:
      return null;
    case lua2.LUA_TBOOLEAN:
      return lua2.lua_toboolean(L, idx);
    case lua2.LUA_TNUMBER:
      return lua2.lua_tonumber(L, idx);
    case lua2.LUA_TSTRING:
      return lua2.lua_tojsstring(L, idx);
    case lua2.LUA_TTABLE: {
      if (depth > 20)
        return null;
      const abs = lua2.lua_absindex(L, idx);
      const obj = {};
      const keys = [];
      lua2.lua_pushnil(L);
      while (lua2.lua_next(L, abs) !== 0) {
        const kt = lua2.lua_type(L, -2);
        const key = kt === lua2.LUA_TNUMBER ? lua2.lua_tonumber(L, -2) : lua2.lua_tojsstring(L, -2);
        keys.push(key);
        obj[String(key)] = toJs(L, -1, depth + 1);
        lua2.lua_pop(L, 1);
      }
      const n = keys.length;
      const isArray = n > 0 && keys.every((k) => typeof k === "number" && Number.isInteger(k) && k >= 1 && k <= n);
      if (isArray)
        return Array.from({ length: n }, (_, i) => obj[String(i + 1)]);
      return obj;
    }
    default:
      return null;
  }
}
var str = (L, i) => {
  const t = lua2.lua_type(L, i);
  if (t === lua2.LUA_TNIL || t === lua2.LUA_TNONE)
    return "";
  return lauxlib2.luaL_tolstring(L, i) ? (() => {
    const s = lua2.lua_tojsstring(L, -1);
    lua2.lua_pop(L, 1);
    return s;
  })() : "";
};

class RisuLua {
  host;
  L;
  promises = new Map;
  nextPid = 1;
  listeners = [];
  errors = [];
  constructor(host) {
    this.host = host;
    const L = lauxlib2.luaL_newstate();
    this.L = L;
    lualib2.luaL_openlibs(L);
    for (const lib of ["io", "package", "debug", "dofile", "loadfile", "require"]) {
      lua2.lua_pushnil(L);
      lua2.lua_setglobal(L, to_luastring(lib));
    }
    lua2.lua_getglobal(L, to_luastring("os"));
    for (const f of ["execute", "exit", "remove", "rename", "tmpname", "getenv"]) {
      lua2.lua_pushnil(L);
      lua2.lua_setfield(L, -2, to_luastring(f));
    }
    lua2.lua_pop(L, 1);
    this.installHost();
    this.exec(PRELUDE, "prelude");
  }
  def(name, fn) {
    lua2.lua_pushjsfunction(this.L, fn);
    lua2.lua_setglobal(this.L, to_luastring(name));
  }
  pending(L, p) {
    const id = this.nextPid++;
    this.promises.set(id, p);
    lua2.lua_getglobal(L, to_luastring("__pending"));
    lua2.lua_pushinteger(L, id);
    lua2.lua_call(L, 1, 1);
    return 1;
  }
  installHost() {
    const h = this.host;
    const ret = (L, v) => {
      push(L, v);
      return 1;
    };
    this.def("getChatVar", (L) => ret(L, h.getChatVar(str(L, 2))));
    this.def("setChatVar", (L) => {
      h.setChatVar(str(L, 2), str(L, 3));
      return 0;
    });
    this.def("getGlobalVar", (L) => ret(L, h.getGlobalVar(str(L, 2))));
    this.def("setGlobalVar", (L) => {
      h.setChatVar(str(L, 2), str(L, 3));
      return 0;
    });
    this.def("getState", (L) => {
      const raw = h.getChatVar(`__${str(L, 2)}`);
      try {
        return ret(L, raw && raw !== "null" ? JSON.parse(raw) : null);
      } catch {
        return ret(L, null);
      }
    });
    this.def("setState", (L) => {
      h.setChatVar(`__${str(L, 2)}`, JSON.stringify(toJs(L, 3)));
      return 0;
    });
    this.def("reloadDisplay", () => {
      h.reloadDisplay();
      return 0;
    });
    this.def("reloadChat", () => {
      h.reloadDisplay();
      return 0;
    });
    this.def("getUserLastMessage", (L) => ret(L, h.userLastMessage()));
    this.def("getCharacterLastMessage", (L) => ret(L, h.charLastMessage()));
    this.def("getName", (L) => ret(L, h.names.char));
    this.def("getPersonaName", (L) => ret(L, h.names.user));
    this.def("log", (L) => {
      h.log(str(L, 1));
      return 0;
    });
    this.def("print", (L) => {
      const n = lua2.lua_gettop(L);
      const parts = [];
      for (let i = 1;i <= n; i++)
        parts.push(str(L, i));
      h.log(parts.join("\t"));
      return 0;
    });
    const ask = (kind) => (L) => {
      const message = str(L, 2);
      const options = kind === "select" ? toJs(L, 2) ?? [] : undefined;
      const p = h.prompt ? h.prompt(kind === "select" ? "" : message, kind, options) : Promise.resolve(null);
      return this.pending(L, kind === "select" ? p.then((v) => v === null ? null : Number(v)) : p);
    };
    this.def("alertInput", ask("input"));
    this.def("alertNormal", ask("normal"));
    this.def("alertError", ask("normal"));
    this.def("alertSelect", ask("select"));
    this.def("listenEdit", (L) => {
      const kind = str(L, 1);
      if (lua2.lua_type(L, 2) !== lua2.LUA_TFUNCTION)
        return 0;
      lua2.lua_pushvalue(L, 2);
      const ref = lauxlib2.luaL_ref(L, lua2.LUA_REGISTRYINDEX);
      this.listeners.push({ kind, ref });
      return 0;
    });
    for (const name of ["setChat", "addChat", "cutChat", "removeChat", "stopChat", "setDescription", "setCharacterFirstMessage", "upsertLocalLoreBook", "LLM", "axLLM", "simpleLLM", "request"]) {
      this.def(name, (L) => this.pending(L, Promise.resolve(null)));
    }
    this.def("getChatLength", (L) => ret(L, 0));
  }
  exec(code, name) {
    const L = this.L;
    if (lauxlib2.luaL_loadbuffer(L, to_luastring(code), null, to_luastring(name)) !== lua2.LUA_OK) {
      this.errors.push(lua2.lua_tojsstring(L, -1));
      lua2.lua_pop(L, 1);
      return false;
    }
    if (lua2.lua_pcall(L, 0, 0, 0) !== lua2.LUA_OK) {
      this.errors.push(lua2.lua_tojsstring(L, -1));
      lua2.lua_pop(L, 1);
      return false;
    }
    return true;
  }
  load(code) {
    return this.exec(code, "card");
  }
  hasFunction(name) {
    lua2.lua_getglobal(this.L, to_luastring(name));
    const ok = lua2.lua_type(this.L, -1) === lua2.LUA_TFUNCTION;
    lua2.lua_pop(this.L, 1);
    return ok;
  }
  async call(fn, args) {
    const L = this.L;
    const co = lua2.lua_newthread(L);
    const coRef = lauxlib2.luaL_ref(L, lua2.LUA_REGISTRYINDEX);
    try {
      if (typeof fn === "number")
        lua2.lua_rawgeti(co, lua2.LUA_REGISTRYINDEX, fn);
      else
        lua2.lua_getglobal(co, to_luastring(fn));
      if (lua2.lua_type(co, -1) !== lua2.LUA_TFUNCTION) {
        lua2.lua_settop(co, 0);
        return;
      }
      for (const a of args)
        push(co, a);
      let nargs = args.length;
      for (let guard = 0;guard < 1000; guard++) {
        const status = lua2.lua_resume(co, L, nargs);
        if (status === lua2.LUA_OK) {
          const n = lua2.lua_gettop(co);
          const result = n > 0 ? toJs(co, 1) : undefined;
          lua2.lua_settop(co, 0);
          return result;
        }
        if (status !== lua2.LUA_YIELD) {
          this.errors.push(lua2.lua_tojsstring(co, -1));
          return;
        }
        let value = null;
        if (lua2.lua_type(co, -1) === lua2.LUA_TTABLE) {
          lua2.lua_getfield(co, -1, to_luastring("__pid"));
          const pid = lua2.lua_tointeger(co, -1);
          lua2.lua_pop(co, 1);
          const p = this.promises.get(pid);
          this.promises.delete(pid);
          value = p ? await p : null;
        }
        lua2.lua_settop(co, 0);
        push(co, value);
        nargs = 1;
      }
      return;
    } finally {
      lauxlib2.luaL_unref(L, lua2.LUA_REGISTRYINDEX, coRef);
    }
  }
  async runListeners(kind, data, extra = []) {
    let current = data;
    for (const l of this.listeners) {
      if (l.kind !== kind)
        continue;
      const out = await this.call(l.ref, ["risubridge", current, ...extra]);
      if (out !== undefined && out !== null)
        current = out;
    }
    return current;
  }
}

// src/triggers.ts
function luaCodeOf(triggers) {
  const out = [];
  for (const t of triggers ?? []) {
    for (const e of t.effect ?? []) {
      if (e?.type === "triggerlua" && typeof e.code === "string" && e.code.trim())
        out.push(e.code);
    }
  }
  return out;
}
function loadLua(triggers, host) {
  const codes = luaCodeOf(triggers);
  if (!codes.length)
    return null;
  const rt = new RisuLua(host);
  for (const code of codes)
    rt.load(code);
  return rt;
}
function applyOp(cur, op, value) {
  const a = Number(cur), b = Number(value);
  const num = (x) => String(Number.isFinite(x) ? Math.round(x * 1e9) / 1e9 : 0);
  switch (op) {
    case "+=":
      return num((Number.isFinite(a) ? a : 0) + b);
    case "-=":
      return num((Number.isFinite(a) ? a : 0) - b);
    case "*=":
      return num((Number.isFinite(a) ? a : 0) * b);
    case "/=":
      return num((Number.isFinite(a) ? a : 0) / b);
    case "%=":
      return num((Number.isFinite(a) ? a : 0) % b);
    default:
      return value;
  }
}
function runSimpleTrigger(trigger, host) {
  let done = 0;
  for (const e of trigger.effect ?? []) {
    if (e?.type === "v2SetVar" || e?.type === "setvar") {
      const key = String(e.var ?? "");
      if (!key)
        continue;
      let value = String(e.value ?? "");
      if (e.valueType === "var")
        value = host.getChatVar(value);
      host.setChatVar(key, applyOp(host.getChatVar(key), String(e.operator ?? "="), value));
      done++;
    }
  }
  return done;
}
function findManualTrigger(triggers, name) {
  return (triggers ?? []).find((t) => t && t.type === "manual" && (t.comment ?? "") === name);
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
      return `<button class="risu-btn" data-risu-trigger="${trig}" style="display:inline-block;margin:2px 4px 2px 0;padding:4px 12px;border-radius:999px;border:1px solid currentColor;background:transparent;color:inherit;font:inherit;font-size:0.9em;cursor:pointer;opacity:.9">${label}</button>`;
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
function assetMapOf(ext) {
  const map = new Map;
  const names = [];
  const add = (name, id) => {
    if (typeof id !== "string" || !id)
      return;
    if (!names.includes(name))
      names.push(name);
    for (const k of [name, name.replace(/\.[a-z0-9]+$/i, "")]) {
      const low = k.toLowerCase();
      if (!map.has(low))
        map.set(low, id);
    }
  };
  for (const [k, v] of Object.entries(ext.risu_asset_map ?? {}))
    add(k, v);
  for (const [k, v] of Object.entries(ext.expressions?.mappings ?? {}))
    add(k, v);
  return { map, names };
}
var imageUrl = (id) => `/api/v1/images/${encodeURIComponent(id)}`;
var CACHE_MS = 15000;
var cardCache = new Map;
async function cardInfo(characterId, userId) {
  const key = `${userId ?? ""}:${characterId}`;
  const hit = cardCache.get(key);
  if (hit && Date.now() - hit.fetchedAt < CACHE_MS)
    return hit;
  let info = { isRisu: false, toggles: [], defaults: {}, assets: new Map, assetNames: [], charImageId: null, fetchedAt: Date.now() };
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
        ...(() => {
          const a = assetMapOf(ext);
          return { assets: a.map, assetNames: a.names };
        })(),
        charImageId: ch?.image_id ?? null,
        fetchedAt: Date.now()
      };
      scheduleSync(characterId, userId);
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
var perf = { calls: 0, risu: 0, ms: 0 };
setInterval(() => {
  if (perf.risu)
    spindle.log.info(`[risubridge:perf] ${perf.risu}/${perf.calls} macro passes handled in ${perf.ms.toFixed(0)}ms`);
  perf.calls = 0;
  perf.risu = 0;
  perf.ms = 0;
}, 1e4);
async function intercept(ctx) {
  perf.calls++;
  const started = performance.now();
  try {
    return await interceptInner(ctx);
  } finally {
    perf.ms += performance.now() - started;
  }
}
async function interceptInner(ctx) {
  const template = ctx.template;
  if (!template.includes("{{"))
    return;
  const extra = ctx.env.extra ?? {};
  const characterId = typeof extra.characterId === "string" ? extra.characterId : undefined;
  if (!characterId)
    return;
  const info = await cardInfo(characterId, ctx.userId);
  if (!info.isRisu || !hasRisuSyntax(template))
    return;
  perf.risu++;
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
    previousUserChat: [...messages].reverse().find((m) => m && m.is_user)?.content ?? "",
    assetUrl: (name) => {
      if (name === "__source_char")
        return info.charImageId ? imageUrl(info.charImageId) : undefined;
      if (name.startsWith("__source_"))
        return;
      const id = info.assets.get(name.toLowerCase()) ?? info.assets.get(name.toLowerCase().replace(/\.[a-z0-9]+$/i, ""));
      return id ? imageUrl(id) : undefined;
    },
    assetNames: () => info.assetNames
  });
  let text = result.text;
  if (ctx.commit && ctx.phase !== "prompt" && sets.length) {
    const last = new Map(sets);
    text += [...last].map(([k, v]) => persistMacro(k, v)).join("");
  }
  return { text, touchedVars: [...result.touched], volatile: result.volatile };
}
var lastSync = new Map;
var SYNC_EVERY_MS = 10 * 60000;
function scheduleSync(characterId, userId) {
  const key = `${userId ?? ""}:${characterId}`;
  const at = lastSync.get(key) ?? 0;
  if (Date.now() - at < SYNC_EVERY_MS)
    return;
  lastSync.set(key, Date.now());
  syncCharacterRegex(characterId, userId).catch((err) => spindle.log.warn(`[risubridge] regex sync failed for ${characterId}: ${err instanceof Error ? err.message : String(err)}`));
}
async function characterScripts(characterId, userId) {
  const out = [];
  for (let offset = 0;; offset += 200) {
    const page = await spindle.regex_scripts.list({ scope: "character", scopeId: characterId, limit: 200, offset, ...userId ? { userId } : {} });
    out.push(...page.data);
    if (page.data.length < 200)
      break;
  }
  return out.filter(isRisuImported);
}
async function syncCharacterRegex(characterId, userId, force = false) {
  const ch = await spindle.characters.get(characterId, userId);
  const ext = ch?.extensions ?? {};
  if (!ext.risuai)
    return 0;
  if (ext.risubridge?.regex === false) {
    await syncCharacterLore(ch, userId, force).catch(() => 0);
    return 0;
  }
  const styles = backgroundStyles(ext.risuai.backgroundHTML);
  const linked = ext.risubridge?.module;
  let fixed = 0;
  for (const s of await characterScripts(characterId, userId)) {
    if (!force && alreadySynced(s, Boolean(linked)))
      continue;
    if (s.can_mutate === false)
      continue;
    const fix = fixFor(s, styles, matchOriginal(s, linked?.regex), ch?.name);
    await spindle.regex_scripts.update(s.id, fix, userId);
    fixed++;
  }
  if (fixed)
    spindle.log.info(`[risubridge] repaired ${fixed} Risu regex script(s) for ${ch?.name ?? characterId}`);
  await syncCharacterLore(ch, userId, force).catch((err) => spindle.log.warn(`[risubridge] lorebook sync failed for ${ch?.name ?? characterId}: ${err instanceof Error ? err.message : String(err)}`));
  return fixed;
}
async function syncCharacterLore(ch, userId, force = false) {
  const ext = ch?.extensions ?? {};
  const book = ext.character_book;
  if (!ch || !ext.risuai || !book?.entries?.length || !spindle.world_books)
    return 0;
  const cardDepth = typeof book.scan_depth === "number" ? book.scan_depth : undefined;
  let fixed = 0;
  for (const bookId of ch.world_book_ids ?? []) {
    for (let offset = 0;; offset += 200) {
      const page = await spindle.world_books.entries.list(bookId, { limit: 200, offset, ...userId ? { userId } : {} });
      for (const e of page.data) {
        if (!force && isLoreSynced(e))
          continue;
        if (!matchCardEntry(e, book.entries))
          continue;
        const fix = loreFixFor(e, cardDepth);
        if (!fix)
          continue;
        await spindle.world_books.entries.update(e.id, fix, userId);
        fixed++;
      }
      if (page.data.length < 200)
        break;
    }
  }
  if (fixed)
    spindle.log.info(`[risubridge] applied Risu lorebook rules to ${fixed} entr${fixed === 1 ? "y" : "ies"} for ${ch.name}`);
  return fixed;
}
async function revertCharacterRegex(characterId, userId) {
  let n = 0;
  for (const s of await characterScripts(characterId, userId)) {
    const rev = revertFor(s);
    if (!rev || s.can_mutate === false)
      continue;
    await spindle.regex_scripts.update(s.id, rev, userId);
    n++;
  }
  return n;
}
async function regexStatus(characterId, userId) {
  const all = await characterScripts(characterId, userId);
  return { total: all.length, synced: all.filter((s) => alreadySynced(s)).length, active: all.filter((s) => alreadySynced(s) && !s.disabled).length };
}
async function syncAll() {
  try {
    for (let offset = 0;; offset += 100) {
      const page = await spindle.characters.list({ limit: 100, offset });
      for (const ch of page.data) {
        if (ch.extensions?.risuai) {
          lastSync.set(`:${ch.id}`, Date.now());
          await syncCharacterRegex(ch.id, undefined).catch(() => 0);
        }
      }
      if (page.data.length < 100)
        break;
    }
  } catch (err) {}
}
spindle.on("CHARACTER_CREATED", (payload, userId) => {
  const p = payload;
  const id = p?.character?.id ?? p?.characterId ?? p?.id;
  if (!id)
    return;
  setTimeout(() => {
    lastSync.delete(`${userId ?? ""}:${id}`);
    scheduleSync(id, userId);
  }, 5000);
});
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
    rows: toggleLayout(src, (k) => vars[`toggle_${k}`]),
    regex: risu ? await regexStatus(characterId, userId).catch(() => {
      return;
    }) : undefined,
    regexOptOut: ch?.extensions?.risubridge?.regex === false,
    linked: linkedInfo(ch?.extensions?.risubridge?.module)
  };
}
function linkedInfo(mod) {
  if (!mod)
    return;
  const lua = mod.triggers.some((t) => (t.effect ?? []).some((e) => e?.type === "triggerlua" && String(e.code ?? "").trim()));
  const manual = mod.triggers.filter((t) => t?.type === "manual").length;
  return { cardName: mod.cardName, linkedAt: mod.linkedAt, lua, manual };
}
var pendingPrompts = new Map;
async function luaHostFor(chatId, characterId, userId, onReload) {
  const ch = await spindle.characters.get(characterId, userId);
  const ext = ch?.extensions ?? {};
  const mod = ext.risubridge?.module;
  const vars = { ...await spindle.variables.chat.list(chatId).catch(() => ({})) };
  const dirty = new Map;
  const toggleDefs = new Map(parseToggles(typeof ext.risuai?.toggles === "string" ? ext.risuai.toggles : "").map((t) => [t.key, t]));
  const defaults = parseDefaultVariables(typeof ext.risuai?.defaultVariables === "string" ? ext.risuai.defaultVariables : "");
  const messages = await spindle.chat.getMessages(chatId).catch(() => []);
  const host = {
    getChatVar: (k) => vars[k] ?? defaults[k] ?? "null",
    setChatVar: (k, v) => {
      vars[k] = v;
      dirty.set(k, v);
    },
    getGlobalVar: (k) => {
      if (k.startsWith("toggle_"))
        return vars[k] ?? defaultToggleValue(toggleDefs.get(k.slice(7)));
      return "null";
    },
    prompt: (message, kind, options) => new Promise((resolve) => {
      const id = crypto.randomUUID();
      pendingPrompts.set(id, resolve);
      spindle.sendToFrontend({ type: "risu_prompt", id, chatId, message, kind, options }, userId);
      setTimeout(() => {
        if (pendingPrompts.delete(id))
          resolve(null);
      }, 10 * 60000);
    }),
    userLastMessage: () => [...messages].reverse().find((m) => m?.is_user)?.content ?? "",
    charLastMessage: () => [...messages].reverse().find((m) => m && !m.is_user)?.content ?? "",
    names: { user: "User", char: ch?.name ?? "" },
    reloadDisplay: onReload,
    log: (t) => spindle.log.info(`[risubridge:lua] ${t}`)
  };
  const flush = async () => {
    for (const [k, v] of dirty)
      await spindle.variables.chat.set(chatId, k, v);
    const n = dirty.size;
    dirty.clear();
    return n;
  };
  return { host, flush, mod };
}
async function handleClick(chatId, characterId, userId, kind, value) {
  let reload = false;
  const { host, flush, mod } = await luaHostFor(chatId, characterId, userId, () => {
    reload = true;
  });
  if (!mod) {
    spindle.sendToFrontend({ type: "risu_notice", chatId, message: "\uC774 \uBC84\uD2BC\uC744 \uC4F0\uB824\uBA74 \u22EF \u2192 \uB9AC\uC2A4 \uD1A0\uAE00\uC5D0\uC11C \uC6D0\uBCF8 \uCE74\uB4DC \uD30C\uC77C\uC744 \uD55C \uBC88 \uC5F0\uACB0\uD574 \uC8FC\uC138\uC694." }, userId);
    return;
  }
  const triggers = mod.triggers;
  const rt = loadLua(triggers, host);
  let handled = false;
  if (kind === "btn") {
    if (rt?.hasFunction("onButtonClick")) {
      await rt.call("onButtonClick", ["risubridge", value]);
      handled = true;
    }
  } else {
    if (rt?.hasFunction(value)) {
      await rt.call(value, ["risubridge"]);
      handled = true;
    } else {
      const t = findManualTrigger(triggers, value);
      if (t) {
        runSimpleTrigger(t, host);
        handled = true;
      }
    }
  }
  if (rt?.errors.length)
    spindle.log.warn(`[risubridge] Lua: ${rt.errors.join(" | ").slice(0, 500)}`);
  const changed = await flush();
  if (!handled)
    spindle.log.info(`[risubridge] no handler for ${kind} "${value}"`);
  if (changed || reload)
    spindle.sendToFrontend({ type: "risu_reload", chatId }, userId);
}
spindle.registerInterceptor(async (messages, context) => {
  try {
    const chat = await spindle.chats.get(context.chatId, context.userId).catch(() => null);
    const characterId = chat?.character_id;
    if (!characterId)
      return messages;
    const ch = await spindle.characters.get(characterId, context.userId).catch(() => null);
    const linkedMod = (ch?.extensions ?? {}).risubridge?.module;
    if (!linkedMod || !JSON.stringify(linkedMod.triggers ?? []).includes("editRequest"))
      return messages;
    const { host, flush, mod } = await luaHostFor(context.chatId, characterId, context.userId, () => {});
    if (!mod)
      return messages;
    const rt = loadLua(mod.triggers, host);
    if (!rt || !rt.listeners.some((l) => l.kind === "editRequest"))
      return messages;
    const data = messages.map((m) => ({ role: m.role, content: typeof m.content === "string" ? m.content : m.content }));
    const out = await rt.runListeners("editRequest", data);
    if (!context.isDryRun)
      await flush();
    if (!Array.isArray(out))
      return messages;
    return out.map((m, i) => ({ ...messages[i] ?? {}, role: m?.role ?? messages[i]?.role ?? "user", content: typeof m?.content === "string" ? m.content : messages[i]?.content ?? "" }));
  } catch (err) {
    spindle.log.warn(`[risubridge] editRequest failed: ${err instanceof Error ? err.message : String(err)}`);
    return messages;
  }
}, 50);
async function setRegexOptOut(characterId, userId, off) {
  const ch = await spindle.characters.get(characterId, userId);
  if (!ch)
    return;
  const ext = { ...ch.extensions ?? {} };
  ext.risubridge = { ...ext.risubridge ?? {}, regex: off ? false : true };
  await spindle.characters.update(characterId, { extensions: ext }, userId);
}
async function saveLink(characterId, userId, data) {
  const ch = await spindle.characters.get(characterId, userId);
  if (!ch)
    return false;
  const ext = { ...ch.extensions ?? {} };
  const slim = {
    triggers: Array.isArray(data.triggers) ? data.triggers : [],
    regex: (Array.isArray(data.regex) ? data.regex : []).map((r) => ({ comment: r.comment, in: r.in, type: r.type, flag: r.flag, ableFlag: r.ableFlag })),
    lowLevelAccess: Boolean(data.lowLevelAccess),
    cardName: String(data.cardName ?? ""),
    linkedAt: Date.now()
  };
  ext.risubridge = { ...ext.risubridge ?? {}, module: slim };
  await spindle.characters.update(characterId, { extensions: ext }, userId);
  cardCache.clear();
  if (ext.risubridge.regex !== false)
    await syncCharacterRegex(characterId, userId, true);
  return true;
}
var pendingLinks = new Map;
var PENDING_MS = 5 * 60000;
async function tryPendingLinks(userId) {
  const mine = [...pendingLinks.entries()].filter(([k, v]) => k.startsWith(`${userId}:`) && Date.now() - v.at < PENDING_MS);
  for (const [k, v] of pendingLinks)
    if (Date.now() - v.at >= PENDING_MS)
      pendingLinks.delete(k);
  if (!mine.length)
    return;
  const names = new Map(mine.map(([k, v]) => [v.data.cardName, k]));
  for (let offset = 0;offset < 2000 && names.size; offset += 100) {
    const page = await spindle.characters.list({ limit: 100, offset, userId }).catch(() => null);
    if (!page)
      return;
    for (const ch of page.data) {
      const key = names.get(ch.name);
      if (!key)
        continue;
      const ext = ch.extensions ?? {};
      if (!ext.risuai || ext.risubridge?.module)
        continue;
      const entry = pendingLinks.get(key);
      if (!entry)
        continue;
      if (await saveLink(ch.id, userId, entry.data).catch(() => false)) {
        spindle.log.info(`[risubridge] linked original file automatically for ${ch.name}`);
        pendingLinks.delete(key);
        names.delete(ch.name);
      }
    }
    if (page.data.length < 100)
      break;
  }
}
spindle.onFrontendMessage(async (payload, userId) => {
  const msg = payload ?? {};
  if (msg.type === "pending_link" && msg.data && typeof msg.data === "object") {
    const data = msg.data;
    if (!data.cardName)
      return;
    pendingLinks.set(`${userId}:${data.cardName}`, { data, at: Date.now() });
    for (const delay of [3000, 1e4, 30000, 90000])
      setTimeout(() => {
        tryPendingLinks(userId);
      }, delay);
    return;
  }
  if (msg.type === "risu_prompt_reply" && typeof msg.id === "string") {
    const resolve = pendingPrompts.get(msg.id);
    pendingPrompts.delete(msg.id);
    resolve?.(typeof msg.value === "string" ? msg.value : null);
    return;
  }
  const chatId = typeof msg.chatId === "string" ? msg.chatId : "";
  const chat = chatId ? await spindle.chats.get(chatId, userId).catch(() => null) : null;
  const characterId = chat?.character_id ?? "";
  if (!chat || !characterId) {
    spindle.sendToFrontend({ type: "toggles_error", error: "no_chat" }, userId);
    return;
  }
  try {
    if (msg.type === "risu_click" && typeof msg.value === "string" && (msg.kind === "btn" || msg.kind === "trigger")) {
      await handleClick(chatId, characterId, userId, msg.kind, msg.value.slice(0, 2000));
      return;
    }
    if (msg.type === "link_original" && msg.data && typeof msg.data === "object") {
      await saveLink(characterId, userId, msg.data);
    } else if (msg.type === "set_toggle" && typeof msg.key === "string" && typeof msg.value === "string") {
      await spindle.variables.chat.set(chatId, `toggle_${msg.key}`, msg.value);
    } else if (msg.type === "reset_toggles") {
      const vars = await spindle.variables.chat.list(chatId);
      for (const k of Object.keys(vars))
        if (k.startsWith("toggle_"))
          await spindle.variables.chat.delete(chatId, k);
    } else if (msg.type === "regex_apply") {
      await setRegexOptOut(characterId, userId, false);
      await syncCharacterRegex(characterId, userId, true);
    } else if (msg.type === "regex_revert") {
      await setRegexOptOut(characterId, userId, true);
      await revertCharacterRegex(characterId, userId);
    } else if (msg.type !== "get_toggles") {
      return;
    }
    spindle.sendToFrontend({ ...await buildTogglesReply(chatId, characterId, userId), changed: msg.type !== "get_toggles" }, userId);
  } catch (err) {
    spindle.sendToFrontend({ type: "toggles_error", error: err instanceof Error ? err.message : String(err) }, userId);
  }
});
spindle.registerMacroInterceptor(intercept, 10);
spindle.log.info("[risubridge] RisuAI CBS interpreter ready");
setTimeout(() => {
  syncAll();
}, 3000);
