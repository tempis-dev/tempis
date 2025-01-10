import ESM_COMPAT_Module from "node:module";
import { fileURLToPath as ESM_COMPAT_fileURLToPath } from 'node:url';
import { dirname as ESM_COMPAT_dirname } from 'node:path';
const __filename = ESM_COMPAT_fileURLToPath(import.meta.url);
const __dirname = ESM_COMPAT_dirname(__filename);
const require = ESM_COMPAT_Module.createRequire(import.meta.url);
var Bi = Object.create;
var Je = Object.defineProperty;
var Di = Object.getOwnPropertyDescriptor;
var Li = Object.getOwnPropertyNames;
var Mi = Object.getPrototypeOf, Fi = Object.prototype.hasOwnProperty;
var o = (e, t) => Je(e, "name", { value: t, configurable: !0 }), y = /* @__PURE__ */ ((e) => typeof require < "u" ? require : typeof Proxy <
"u" ? new Proxy(e, {
  get: (t, r) => (typeof require < "u" ? require : t)[r]
}) : e)(function(e) {
  if (typeof require < "u") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + e + '" is not supported');
});
var d = (e, t) => () => (t || e((t = { exports: {} }).exports, t), t.exports);
var Ui = (e, t, r, n) => {
  if (t && typeof t == "object" || typeof t == "function")
    for (let i of Li(t))
      !Fi.call(e, i) && i !== r && Je(e, i, { get: () => t[i], enumerable: !(n = Di(t, i)) || n.enumerable });
  return e;
};
var A = (e, t, r) => (r = e != null ? Bi(Mi(e)) : {}, Ui(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  t || !e || !e.__esModule ? Je(r, "default", { value: e, enumerable: !0 }) : r,
  e
));

// ../node_modules/picocolors/picocolors.js
var cr = d((El, Ye) => {
  var sr = process.argv || [], ae = process.env, $i = !("NO_COLOR" in ae || sr.includes("--no-color")) && ("FORCE_COLOR" in ae || sr.includes(
  "--color") || process.platform === "win32" || y != null && y("tty").isatty(1) && ae.TERM !== "dumb" || "CI" in ae), qi = /* @__PURE__ */ o(
  (e, t, r = e) => (n) => {
    let i = "" + n, s = i.indexOf(t, e.length);
    return ~s ? e + Wi(i, t, r, s) + t : e + i + t;
  }, "formatter"), Wi = /* @__PURE__ */ o((e, t, r, n) => {
    let i = "", s = 0;
    do
      i += e.substring(s, n) + r, s = n + t.length, n = e.indexOf(t, s);
    while (~n);
    return i + e.substring(s);
  }, "replaceClose"), ar = /* @__PURE__ */ o((e = $i) => {
    let t = e ? qi : () => String;
    return {
      isColorSupported: e,
      reset: t("\x1B[0m", "\x1B[0m"),
      bold: t("\x1B[1m", "\x1B[22m", "\x1B[22m\x1B[1m"),
      dim: t("\x1B[2m", "\x1B[22m", "\x1B[22m\x1B[2m"),
      italic: t("\x1B[3m", "\x1B[23m"),
      underline: t("\x1B[4m", "\x1B[24m"),
      inverse: t("\x1B[7m", "\x1B[27m"),
      hidden: t("\x1B[8m", "\x1B[28m"),
      strikethrough: t("\x1B[9m", "\x1B[29m"),
      black: t("\x1B[30m", "\x1B[39m"),
      red: t("\x1B[31m", "\x1B[39m"),
      green: t("\x1B[32m", "\x1B[39m"),
      yellow: t("\x1B[33m", "\x1B[39m"),
      blue: t("\x1B[34m", "\x1B[39m"),
      magenta: t("\x1B[35m", "\x1B[39m"),
      cyan: t("\x1B[36m", "\x1B[39m"),
      white: t("\x1B[37m", "\x1B[39m"),
      gray: t("\x1B[90m", "\x1B[39m"),
      bgBlack: t("\x1B[40m", "\x1B[49m"),
      bgRed: t("\x1B[41m", "\x1B[49m"),
      bgGreen: t("\x1B[42m", "\x1B[49m"),
      bgYellow: t("\x1B[43m", "\x1B[49m"),
      bgBlue: t("\x1B[44m", "\x1B[49m"),
      bgMagenta: t("\x1B[45m", "\x1B[49m"),
      bgCyan: t("\x1B[46m", "\x1B[49m"),
      bgWhite: t("\x1B[47m", "\x1B[49m"),
      blackBright: t("\x1B[90m", "\x1B[39m"),
      redBright: t("\x1B[91m", "\x1B[39m"),
      greenBright: t("\x1B[92m", "\x1B[39m"),
      yellowBright: t("\x1B[93m", "\x1B[39m"),
      blueBright: t("\x1B[94m", "\x1B[39m"),
      magentaBright: t("\x1B[95m", "\x1B[39m"),
      cyanBright: t("\x1B[96m", "\x1B[39m"),
      whiteBright: t("\x1B[97m", "\x1B[39m"),
      bgBlackBright: t("\x1B[100m", "\x1B[49m"),
      bgRedBright: t("\x1B[101m", "\x1B[49m"),
      bgGreenBright: t("\x1B[102m", "\x1B[49m"),
      bgYellowBright: t("\x1B[103m", "\x1B[49m"),
      bgBlueBright: t("\x1B[104m", "\x1B[49m"),
      bgMagentaBright: t("\x1B[105m", "\x1B[49m"),
      bgCyanBright: t("\x1B[106m", "\x1B[49m"),
      bgWhiteBright: t("\x1B[107m", "\x1B[49m")
    };
  }, "createColors");
  Ye.exports = ar();
  Ye.exports.createColors = ar;
});

// ../node_modules/isexe/windows.js
var xr = d((_l, br) => {
  br.exports = gr;
  gr.sync = Vi;
  var hr = y("fs");
  function Hi(e, t) {
    var r = t.pathExt !== void 0 ? t.pathExt : process.env.PATHEXT;
    if (!r || (r = r.split(";"), r.indexOf("") !== -1))
      return !0;
    for (var n = 0; n < r.length; n++) {
      var i = r[n].toLowerCase();
      if (i && e.substr(-i.length).toLowerCase() === i)
        return !0;
    }
    return !1;
  }
  o(Hi, "checkPathExt");
  function yr(e, t, r) {
    return !e.isSymbolicLink() && !e.isFile() ? !1 : Hi(t, r);
  }
  o(yr, "checkStat");
  function gr(e, t, r) {
    hr.stat(e, function(n, i) {
      r(n, n ? !1 : yr(i, e, t));
    });
  }
  o(gr, "isexe");
  function Vi(e, t) {
    return yr(hr.statSync(e), e, t);
  }
  o(Vi, "sync");
});

// ../node_modules/isexe/mode.js
var Er = d((jl, Pr) => {
  Pr.exports = wr;
  wr.sync = zi;
  var Sr = y("fs");
  function wr(e, t, r) {
    Sr.stat(e, function(n, i) {
      r(n, n ? !1 : vr(i, t));
    });
  }
  o(wr, "isexe");
  function zi(e, t) {
    return vr(Sr.statSync(e), t);
  }
  o(zi, "sync");
  function vr(e, t) {
    return e.isFile() && Ki(e, t);
  }
  o(vr, "checkStat");
  function Ki(e, t) {
    var r = e.mode, n = e.uid, i = e.gid, s = t.uid !== void 0 ? t.uid : process.getuid && process.getuid(), a = t.gid !== void 0 ? t.gid : process.
    getgid && process.getgid(), c = parseInt("100", 8), u = parseInt("010", 8), l = parseInt("001", 8), f = c | u, w = r & l || r & u && i ===
    a || r & c && n === s || r & f && s === 0;
    return w;
  }
  o(Ki, "checkMode");
});

// ../node_modules/isexe/index.js
var Ir = d((Dl, Tr) => {
  var Bl = y("fs"), le;
  process.platform === "win32" || global.TESTING_WINDOWS ? le = xr() : le = Er();
  Tr.exports = Xe;
  Xe.sync = Ji;
  function Xe(e, t, r) {
    if (typeof t == "function" && (r = t, t = {}), !r) {
      if (typeof Promise != "function")
        throw new TypeError("callback not provided");
      return new Promise(function(n, i) {
        Xe(e, t || {}, function(s, a) {
          s ? i(s) : n(a);
        });
      });
    }
    le(e, t || {}, function(n, i) {
      n && (n.code === "EACCES" || t && t.ignoreErrors) && (n = null, i = !1), r(n, i);
    });
  }
  o(Xe, "isexe");
  function Ji(e, t) {
    try {
      return le.sync(e, t || {});
    } catch (r) {
      if (t && t.ignoreErrors || r.code === "EACCES")
        return !1;
      throw r;
    }
  }
  o(Ji, "sync");
});

// ../node_modules/cross-spawn/node_modules/which/which.js
var Gr = d((Ml, _r) => {
  var D = process.platform === "win32" || process.env.OSTYPE === "cygwin" || process.env.OSTYPE === "msys", kr = y("path"), Yi = D ? ";" : "\
:", Cr = Ir(), Or = /* @__PURE__ */ o((e) => Object.assign(new Error(`not found: ${e}`), { code: "ENOENT" }), "getNotFoundError"), Ar = /* @__PURE__ */ o(
  (e, t) => {
    let r = t.colon || Yi, n = e.match(/\//) || D && e.match(/\\/) ? [""] : [
      // windows always checks the cwd first
      ...D ? [process.cwd()] : [],
      ...(t.path || process.env.PATH || /* istanbul ignore next: very unusual */
      "").split(r)
    ], i = D ? t.pathExt || process.env.PATHEXT || ".EXE;.CMD;.BAT;.COM" : "", s = D ? i.split(r) : [""];
    return D && e.indexOf(".") !== -1 && s[0] !== "" && s.unshift(""), {
      pathEnv: n,
      pathExt: s,
      pathExtExe: i
    };
  }, "getPathInfo"), Rr = /* @__PURE__ */ o((e, t, r) => {
    typeof t == "function" && (r = t, t = {}), t || (t = {});
    let { pathEnv: n, pathExt: i, pathExtExe: s } = Ar(e, t), a = [], c = /* @__PURE__ */ o((l) => new Promise((f, w) => {
      if (l === n.length)
        return t.all && a.length ? f(a) : w(Or(e));
      let g = n[l], p = /^".*"$/.test(g) ? g.slice(1, -1) : g, b = kr.join(p, e), h = !p && /^\.[\\\/]/.test(e) ? e.slice(0, 2) + b : b;
      f(u(h, l, 0));
    }), "step"), u = /* @__PURE__ */ o((l, f, w) => new Promise((g, p) => {
      if (w === i.length)
        return g(c(f + 1));
      let b = i[w];
      Cr(l + b, { pathExt: s }, (h, x) => {
        if (!h && x)
          if (t.all)
            a.push(l + b);
          else
            return g(l + b);
        return g(u(l, f, w + 1));
      });
    }), "subStep");
    return r ? c(0).then((l) => r(null, l), r) : c(0);
  }, "which"), Xi = /* @__PURE__ */ o((e, t) => {
    t = t || {};
    let { pathEnv: r, pathExt: n, pathExtExe: i } = Ar(e, t), s = [];
    for (let a = 0; a < r.length; a++) {
      let c = r[a], u = /^".*"$/.test(c) ? c.slice(1, -1) : c, l = kr.join(u, e), f = !u && /^\.[\\\/]/.test(e) ? e.slice(0, 2) + l : l;
      for (let w = 0; w < n.length; w++) {
        let g = f + n[w];
        try {
          if (Cr.sync(g, { pathExt: i }))
            if (t.all)
              s.push(g);
            else
              return g;
        } catch {
        }
      }
    }
    if (t.all && s.length)
      return s;
    if (t.nothrow)
      return null;
    throw Or(e);
  }, "whichSync");
  _r.exports = Rr;
  Rr.sync = Xi;
});

// ../node_modules/path-key/index.js
var Qe = d((Ul, Ze) => {
  "use strict";
  var jr = /* @__PURE__ */ o((e = {}) => {
    let t = e.env || process.env;
    return (e.platform || process.platform) !== "win32" ? "PATH" : Object.keys(t).reverse().find((n) => n.toUpperCase() === "PATH") || "Path";
  }, "pathKey");
  Ze.exports = jr;
  Ze.exports.default = jr;
});

// ../node_modules/cross-spawn/lib/util/resolveCommand.js
var Lr = d((ql, Dr) => {
  "use strict";
  var Nr = y("path"), Zi = Gr(), Qi = Qe();
  function Br(e, t) {
    let r = e.options.env || process.env, n = process.cwd(), i = e.options.cwd != null, s = i && process.chdir !== void 0 && !process.chdir.
    disabled;
    if (s)
      try {
        process.chdir(e.options.cwd);
      } catch {
      }
    let a;
    try {
      a = Zi.sync(e.command, {
        path: r[Qi({ env: r })],
        pathExt: t ? Nr.delimiter : void 0
      });
    } catch {
    } finally {
      s && process.chdir(n);
    }
    return a && (a = Nr.resolve(i ? e.options.cwd : "", a)), a;
  }
  o(Br, "resolveCommandAttempt");
  function es(e) {
    return Br(e) || Br(e, !0);
  }
  o(es, "resolveCommand");
  Dr.exports = es;
});

// ../node_modules/cross-spawn/lib/util/escape.js
var Mr = d((Hl, tt) => {
  "use strict";
  var et = /([()\][%!^"`<>&|;, *?])/g;
  function ts(e) {
    return e = e.replace(et, "^$1"), e;
  }
  o(ts, "escapeCommand");
  function rs(e, t) {
    return e = `${e}`, e = e.replace(/(\\*)"/g, '$1$1\\"'), e = e.replace(/(\\*)$/, "$1$1"), e = `"${e}"`, e = e.replace(et, "^$1"), t && (e =
    e.replace(et, "^$1")), e;
  }
  o(rs, "escapeArgument");
  tt.exports.command = ts;
  tt.exports.argument = rs;
});

// ../node_modules/shebang-regex/index.js
var Ur = d((zl, Fr) => {
  "use strict";
  Fr.exports = /^#!(.*)/;
});

// ../node_modules/shebang-command/index.js
var qr = d((Kl, $r) => {
  "use strict";
  var ns = Ur();
  $r.exports = (e = "") => {
    let t = e.match(ns);
    if (!t)
      return null;
    let [r, n] = t[0].replace(/#! ?/, "").split(" "), i = r.split("/").pop();
    return i === "env" ? n : n ? `${i} ${n}` : i;
  };
});

// ../node_modules/cross-spawn/lib/util/readShebang.js
var Hr = d((Jl, Wr) => {
  "use strict";
  var rt = y("fs"), os = qr();
  function is(e) {
    let r = Buffer.alloc(150), n;
    try {
      n = rt.openSync(e, "r"), rt.readSync(n, r, 0, 150, 0), rt.closeSync(n);
    } catch {
    }
    return os(r.toString());
  }
  o(is, "readShebang");
  Wr.exports = is;
});

// ../node_modules/cross-spawn/lib/parse.js
var Jr = d((Xl, Kr) => {
  "use strict";
  var ss = y("path"), Vr = Lr(), zr = Mr(), as = Hr(), cs = process.platform === "win32", us = /\.(?:com|exe)$/i, ls = /node_modules[\\/].bin[\\/][^\\/]+\.cmd$/i;
  function fs(e) {
    e.file = Vr(e);
    let t = e.file && as(e.file);
    return t ? (e.args.unshift(e.file), e.command = t, Vr(e)) : e.file;
  }
  o(fs, "detectShebang");
  function ds(e) {
    if (!cs)
      return e;
    let t = fs(e), r = !us.test(t);
    if (e.options.forceShell || r) {
      let n = ls.test(t);
      e.command = ss.normalize(e.command), e.command = zr.command(e.command), e.args = e.args.map((s) => zr.argument(s, n));
      let i = [e.command].concat(e.args).join(" ");
      e.args = ["/d", "/s", "/c", `"${i}"`], e.command = process.env.comspec || "cmd.exe", e.options.windowsVerbatimArguments = !0;
    }
    return e;
  }
  o(ds, "parseNonShell");
  function ps(e, t, r) {
    t && !Array.isArray(t) && (r = t, t = null), t = t ? t.slice(0) : [], r = Object.assign({}, r);
    let n = {
      command: e,
      args: t,
      options: r,
      file: void 0,
      original: {
        command: e,
        args: t
      }
    };
    return r.shell ? n : ds(n);
  }
  o(ps, "parse");
  Kr.exports = ps;
});

// ../node_modules/cross-spawn/lib/enoent.js
var Zr = d((Ql, Xr) => {
  "use strict";
  var nt = process.platform === "win32";
  function ot(e, t) {
    return Object.assign(new Error(`${t} ${e.command} ENOENT`), {
      code: "ENOENT",
      errno: "ENOENT",
      syscall: `${t} ${e.command}`,
      path: e.command,
      spawnargs: e.args
    });
  }
  o(ot, "notFoundError");
  function ms(e, t) {
    if (!nt)
      return;
    let r = e.emit;
    e.emit = function(n, i) {
      if (n === "exit") {
        let s = Yr(i, t, "spawn");
        if (s)
          return r.call(e, "error", s);
      }
      return r.apply(e, arguments);
    };
  }
  o(ms, "hookChildProcess");
  function Yr(e, t) {
    return nt && e === 1 && !t.file ? ot(t.original, "spawn") : null;
  }
  o(Yr, "verifyENOENT");
  function hs(e, t) {
    return nt && e === 1 && !t.file ? ot(t.original, "spawnSync") : null;
  }
  o(hs, "verifyENOENTSync");
  Xr.exports = {
    hookChildProcess: ms,
    verifyENOENT: Yr,
    verifyENOENTSync: hs,
    notFoundError: ot
  };
});

// ../node_modules/cross-spawn/index.js
var at = d((tf, L) => {
  "use strict";
  var Qr = y("child_process"), it = Jr(), st = Zr();
  function en(e, t, r) {
    let n = it(e, t, r), i = Qr.spawn(n.command, n.args, n.options);
    return st.hookChildProcess(i, n), i;
  }
  o(en, "spawn");
  function ys(e, t, r) {
    let n = it(e, t, r), i = Qr.spawnSync(n.command, n.args, n.options);
    return i.error = i.error || st.verifyENOENTSync(i.status, n), i;
  }
  o(ys, "spawnSync");
  L.exports = en;
  L.exports.spawn = en;
  L.exports.sync = ys;
  L.exports._parse = it;
  L.exports._enoent = st;
});

// ../node_modules/execa/node_modules/strip-final-newline/index.js
var rn = d((nf, tn) => {
  "use strict";
  tn.exports = (e) => {
    let t = typeof e == "string" ? `
` : 10, r = typeof e == "string" ? "\r" : 13;
    return e[e.length - 1] === t && (e = e.slice(0, e.length - 1)), e[e.length - 1] === r && (e = e.slice(0, e.length - 1)), e;
  };
});

// ../node_modules/npm-run-path/index.js
var sn = d((of, J) => {
  "use strict";
  var K = y("path"), nn = Qe(), on = /* @__PURE__ */ o((e) => {
    e = {
      cwd: process.cwd(),
      path: process.env[nn()],
      execPath: process.execPath,
      ...e
    };
    let t, r = K.resolve(e.cwd), n = [];
    for (; t !== r; )
      n.push(K.join(r, "node_modules/.bin")), t = r, r = K.resolve(r, "..");
    let i = K.resolve(e.cwd, e.execPath, "..");
    return n.push(i), n.concat(e.path).join(K.delimiter);
  }, "npmRunPath");
  J.exports = on;
  J.exports.default = on;
  J.exports.env = (e) => {
    e = {
      env: process.env,
      ...e
    };
    let t = { ...e.env }, r = nn({ env: t });
    return e.path = t[r], t[r] = J.exports(e), t;
  };
});

// ../node_modules/mimic-fn/index.js
var cn = d((af, ct) => {
  "use strict";
  var an = /* @__PURE__ */ o((e, t) => {
    for (let r of Reflect.ownKeys(t))
      Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
    return e;
  }, "mimicFn");
  ct.exports = an;
  ct.exports.default = an;
});

// ../node_modules/onetime/index.js
var ln = d((uf, de) => {
  "use strict";
  var gs = cn(), fe = /* @__PURE__ */ new WeakMap(), un = /* @__PURE__ */ o((e, t = {}) => {
    if (typeof e != "function")
      throw new TypeError("Expected a function");
    let r, n = 0, i = e.displayName || e.name || "<anonymous>", s = /* @__PURE__ */ o(function(...a) {
      if (fe.set(s, ++n), n === 1)
        r = e.apply(this, a), e = null;
      else if (t.throw === !0)
        throw new Error(`Function \`${i}\` can only be called once`);
      return r;
    }, "onetime");
    return gs(s, e), fe.set(s, n), s;
  }, "onetime");
  de.exports = un;
  de.exports.default = un;
  de.exports.callCount = (e) => {
    if (!fe.has(e))
      throw new Error(`The given function \`${e.name}\` is not wrapped by the \`onetime\` package`);
    return fe.get(e);
  };
});

// ../node_modules/execa/node_modules/human-signals/build/src/core.js
var fn = d((pe) => {
  "use strict";
  Object.defineProperty(pe, "__esModule", { value: !0 });
  pe.SIGNALS = void 0;
  var bs = [
    {
      name: "SIGHUP",
      number: 1,
      action: "terminate",
      description: "Terminal closed",
      standard: "posix"
    },
    {
      name: "SIGINT",
      number: 2,
      action: "terminate",
      description: "User interruption with CTRL-C",
      standard: "ansi"
    },
    {
      name: "SIGQUIT",
      number: 3,
      action: "core",
      description: "User interruption with CTRL-\\",
      standard: "posix"
    },
    {
      name: "SIGILL",
      number: 4,
      action: "core",
      description: "Invalid machine instruction",
      standard: "ansi"
    },
    {
      name: "SIGTRAP",
      number: 5,
      action: "core",
      description: "Debugger breakpoint",
      standard: "posix"
    },
    {
      name: "SIGABRT",
      number: 6,
      action: "core",
      description: "Aborted",
      standard: "ansi"
    },
    {
      name: "SIGIOT",
      number: 6,
      action: "core",
      description: "Aborted",
      standard: "bsd"
    },
    {
      name: "SIGBUS",
      number: 7,
      action: "core",
      description: "Bus error due to misaligned, non-existing address or paging error",
      standard: "bsd"
    },
    {
      name: "SIGEMT",
      number: 7,
      action: "terminate",
      description: "Command should be emulated but is not implemented",
      standard: "other"
    },
    {
      name: "SIGFPE",
      number: 8,
      action: "core",
      description: "Floating point arithmetic error",
      standard: "ansi"
    },
    {
      name: "SIGKILL",
      number: 9,
      action: "terminate",
      description: "Forced termination",
      standard: "posix",
      forced: !0
    },
    {
      name: "SIGUSR1",
      number: 10,
      action: "terminate",
      description: "Application-specific signal",
      standard: "posix"
    },
    {
      name: "SIGSEGV",
      number: 11,
      action: "core",
      description: "Segmentation fault",
      standard: "ansi"
    },
    {
      name: "SIGUSR2",
      number: 12,
      action: "terminate",
      description: "Application-specific signal",
      standard: "posix"
    },
    {
      name: "SIGPIPE",
      number: 13,
      action: "terminate",
      description: "Broken pipe or socket",
      standard: "posix"
    },
    {
      name: "SIGALRM",
      number: 14,
      action: "terminate",
      description: "Timeout or timer",
      standard: "posix"
    },
    {
      name: "SIGTERM",
      number: 15,
      action: "terminate",
      description: "Termination",
      standard: "ansi"
    },
    {
      name: "SIGSTKFLT",
      number: 16,
      action: "terminate",
      description: "Stack is empty or overflowed",
      standard: "other"
    },
    {
      name: "SIGCHLD",
      number: 17,
      action: "ignore",
      description: "Child process terminated, paused or unpaused",
      standard: "posix"
    },
    {
      name: "SIGCLD",
      number: 17,
      action: "ignore",
      description: "Child process terminated, paused or unpaused",
      standard: "other"
    },
    {
      name: "SIGCONT",
      number: 18,
      action: "unpause",
      description: "Unpaused",
      standard: "posix",
      forced: !0
    },
    {
      name: "SIGSTOP",
      number: 19,
      action: "pause",
      description: "Paused",
      standard: "posix",
      forced: !0
    },
    {
      name: "SIGTSTP",
      number: 20,
      action: "pause",
      description: 'Paused using CTRL-Z or "suspend"',
      standard: "posix"
    },
    {
      name: "SIGTTIN",
      number: 21,
      action: "pause",
      description: "Background process cannot read terminal input",
      standard: "posix"
    },
    {
      name: "SIGBREAK",
      number: 21,
      action: "terminate",
      description: "User interruption with CTRL-BREAK",
      standard: "other"
    },
    {
      name: "SIGTTOU",
      number: 22,
      action: "pause",
      description: "Background process cannot write to terminal output",
      standard: "posix"
    },
    {
      name: "SIGURG",
      number: 23,
      action: "ignore",
      description: "Socket received out-of-band data",
      standard: "bsd"
    },
    {
      name: "SIGXCPU",
      number: 24,
      action: "core",
      description: "Process timed out",
      standard: "bsd"
    },
    {
      name: "SIGXFSZ",
      number: 25,
      action: "core",
      description: "File too big",
      standard: "bsd"
    },
    {
      name: "SIGVTALRM",
      number: 26,
      action: "terminate",
      description: "Timeout or timer",
      standard: "bsd"
    },
    {
      name: "SIGPROF",
      number: 27,
      action: "terminate",
      description: "Timeout or timer",
      standard: "bsd"
    },
    {
      name: "SIGWINCH",
      number: 28,
      action: "ignore",
      description: "Terminal window size changed",
      standard: "bsd"
    },
    {
      name: "SIGIO",
      number: 29,
      action: "terminate",
      description: "I/O is available",
      standard: "other"
    },
    {
      name: "SIGPOLL",
      number: 29,
      action: "terminate",
      description: "Watched event",
      standard: "other"
    },
    {
      name: "SIGINFO",
      number: 29,
      action: "ignore",
      description: "Request for process information",
      standard: "other"
    },
    {
      name: "SIGPWR",
      number: 30,
      action: "terminate",
      description: "Device running out of power",
      standard: "systemv"
    },
    {
      name: "SIGSYS",
      number: 31,
      action: "core",
      description: "Invalid system call",
      standard: "other"
    },
    {
      name: "SIGUNUSED",
      number: 31,
      action: "terminate",
      description: "Invalid system call",
      standard: "other"
    }
  ];
  pe.SIGNALS = bs;
});

// ../node_modules/execa/node_modules/human-signals/build/src/realtime.js
var ut = d((M) => {
  "use strict";
  Object.defineProperty(M, "__esModule", { value: !0 });
  M.SIGRTMAX = M.getRealtimeSignals = void 0;
  var xs = /* @__PURE__ */ o(function() {
    let e = pn - dn + 1;
    return Array.from({ length: e }, Ss);
  }, "getRealtimeSignals");
  M.getRealtimeSignals = xs;
  var Ss = /* @__PURE__ */ o(function(e, t) {
    return {
      name: `SIGRT${t + 1}`,
      number: dn + t,
      action: "terminate",
      description: "Application-specific signal (realtime)",
      standard: "posix"
    };
  }, "getRealtimeSignal"), dn = 34, pn = 64;
  M.SIGRTMAX = pn;
});

// ../node_modules/execa/node_modules/human-signals/build/src/signals.js
var mn = d((me) => {
  "use strict";
  Object.defineProperty(me, "__esModule", { value: !0 });
  me.getSignals = void 0;
  var ws = y("os"), vs = fn(), Ps = ut(), Es = /* @__PURE__ */ o(function() {
    let e = (0, Ps.getRealtimeSignals)();
    return [...vs.SIGNALS, ...e].map(Ts);
  }, "getSignals");
  me.getSignals = Es;
  var Ts = /* @__PURE__ */ o(function({
    name: e,
    number: t,
    description: r,
    action: n,
    forced: i = !1,
    standard: s
  }) {
    let {
      signals: { [e]: a }
    } = ws.constants, c = a !== void 0;
    return { name: e, number: c ? a : t, description: r, supported: c, action: n, forced: i, standard: s };
  }, "normalizeSignal");
});

// ../node_modules/execa/node_modules/human-signals/build/src/main.js
var yn = d((F) => {
  "use strict";
  Object.defineProperty(F, "__esModule", { value: !0 });
  F.signalsByNumber = F.signalsByName = void 0;
  var Is = y("os"), hn = mn(), ks = ut(), Cs = /* @__PURE__ */ o(function() {
    return (0, hn.getSignals)().reduce(Os, {});
  }, "getSignalsByName"), Os = /* @__PURE__ */ o(function(e, { name: t, number: r, description: n, supported: i, action: s, forced: a, standard: c }) {
    return {
      ...e,
      [t]: { name: t, number: r, description: n, supported: i, action: s, forced: a, standard: c }
    };
  }, "getSignalByName"), As = Cs();
  F.signalsByName = As;
  var Rs = /* @__PURE__ */ o(function() {
    let e = (0, hn.getSignals)(), t = ks.SIGRTMAX + 1, r = Array.from({ length: t }, (n, i) => _s(i, e));
    return Object.assign({}, ...r);
  }, "getSignalsByNumber"), _s = /* @__PURE__ */ o(function(e, t) {
    let r = Gs(e, t);
    if (r === void 0)
      return {};
    let { name: n, description: i, supported: s, action: a, forced: c, standard: u } = r;
    return {
      [e]: {
        name: n,
        number: e,
        description: i,
        supported: s,
        action: a,
        forced: c,
        standard: u
      }
    };
  }, "getSignalByNumber"), Gs = /* @__PURE__ */ o(function(e, t) {
    let r = t.find(({ name: n }) => Is.constants.signals[n] === e);
    return r !== void 0 ? r : t.find((n) => n.number === e);
  }, "findSignalByNumber"), js = Rs();
  F.signalsByNumber = js;
});

// ../node_modules/execa/lib/error.js
var bn = d((bf, gn) => {
  "use strict";
  var { signalsByName: Ns } = yn(), Bs = /* @__PURE__ */ o(({ timedOut: e, timeout: t, errorCode: r, signal: n, signalDescription: i, exitCode: s,
  isCanceled: a }) => e ? `timed out after ${t} milliseconds` : a ? "was canceled" : r !== void 0 ? `failed with ${r}` : n !== void 0 ? `was\
 killed with ${n} (${i})` : s !== void 0 ? `failed with exit code ${s}` : "failed", "getErrorPrefix"), Ds = /* @__PURE__ */ o(({
    stdout: e,
    stderr: t,
    all: r,
    error: n,
    signal: i,
    exitCode: s,
    command: a,
    escapedCommand: c,
    timedOut: u,
    isCanceled: l,
    killed: f,
    parsed: { options: { timeout: w } }
  }) => {
    s = s === null ? void 0 : s, i = i === null ? void 0 : i;
    let g = i === void 0 ? void 0 : Ns[i].description, p = n && n.code, h = `Command ${Bs({ timedOut: u, timeout: w, errorCode: p, signal: i,
    signalDescription: g, exitCode: s, isCanceled: l })}: ${a}`, x = Object.prototype.toString.call(n) === "[object Error]", E = x ? `${h}
${n.message}` : h, T = [E, t, e].filter(Boolean).join(`
`);
    return x ? (n.originalMessage = n.message, n.message = T) : n = new Error(T), n.shortMessage = E, n.command = a, n.escapedCommand = c, n.
    exitCode = s, n.signal = i, n.signalDescription = g, n.stdout = e, n.stderr = t, r !== void 0 && (n.all = r), "bufferedData" in n && delete n.
    bufferedData, n.failed = !0, n.timedOut = !!u, n.isCanceled = l, n.killed = f && !u, n;
  }, "makeError");
  gn.exports = Ds;
});

// ../node_modules/execa/lib/stdio.js
var Sn = d((Sf, lt) => {
  "use strict";
  var he = ["stdin", "stdout", "stderr"], Ls = /* @__PURE__ */ o((e) => he.some((t) => e[t] !== void 0), "hasAlias"), xn = /* @__PURE__ */ o(
  (e) => {
    if (!e)
      return;
    let { stdio: t } = e;
    if (t === void 0)
      return he.map((n) => e[n]);
    if (Ls(e))
      throw new Error(`It's not possible to provide \`stdio\` in combination with one of ${he.map((n) => `\`${n}\``).join(", ")}`);
    if (typeof t == "string")
      return t;
    if (!Array.isArray(t))
      throw new TypeError(`Expected \`stdio\` to be of type \`string\` or \`Array\`, got \`${typeof t}\``);
    let r = Math.max(t.length, he.length);
    return Array.from({ length: r }, (n, i) => t[i]);
  }, "normalizeStdio");
  lt.exports = xn;
  lt.exports.node = (e) => {
    let t = xn(e);
    return t === "ipc" ? "ipc" : t === void 0 || typeof t == "string" ? [t, t, t, "ipc"] : t.includes("ipc") ? t : [...t, "ipc"];
  };
});

// ../node_modules/signal-exit/signals.js
var wn = d((vf, ye) => {
  ye.exports = [
    "SIGABRT",
    "SIGALRM",
    "SIGHUP",
    "SIGINT",
    "SIGTERM"
  ];
  process.platform !== "win32" && ye.exports.push(
    "SIGVTALRM",
    "SIGXCPU",
    "SIGXFSZ",
    "SIGUSR2",
    "SIGTRAP",
    "SIGSYS",
    "SIGQUIT",
    "SIGIOT"
    // should detect profiler and enable/disable accordingly.
    // see #21
    // 'SIGPROF'
  );
  process.platform === "linux" && ye.exports.push(
    "SIGIO",
    "SIGPOLL",
    "SIGPWR",
    "SIGSTKFLT",
    "SIGUNUSED"
  );
});

// ../node_modules/signal-exit/index.js
var In = d((Pf, q) => {
  var S = global.process, R = /* @__PURE__ */ o(function(e) {
    return e && typeof e == "object" && typeof e.removeListener == "function" && typeof e.emit == "function" && typeof e.reallyExit == "func\
tion" && typeof e.listeners == "function" && typeof e.kill == "function" && typeof e.pid == "number" && typeof e.on == "function";
  }, "processOk");
  R(S) ? (vn = y("assert"), U = wn(), Pn = /^win/i.test(S.platform), Y = y("events"), typeof Y != "function" && (Y = Y.EventEmitter), S.__signal_exit_emitter__ ?
  P = S.__signal_exit_emitter__ : (P = S.__signal_exit_emitter__ = new Y(), P.count = 0, P.emitted = {}), P.infinite || (P.setMaxListeners(1 / 0),
  P.infinite = !0), q.exports = function(e, t) {
    if (!R(global.process))
      return function() {
      };
    vn.equal(typeof e, "function", "a callback must be provided for exit handler"), $ === !1 && ft();
    var r = "exit";
    t && t.alwaysLast && (r = "afterexit");
    var n = /* @__PURE__ */ o(function() {
      P.removeListener(r, e), P.listeners("exit").length === 0 && P.listeners("afterexit").length === 0 && ge();
    }, "remove");
    return P.on(r, e), n;
  }, ge = /* @__PURE__ */ o(function() {
    !$ || !R(global.process) || ($ = !1, U.forEach(function(t) {
      try {
        S.removeListener(t, be[t]);
      } catch {
      }
    }), S.emit = xe, S.reallyExit = dt, P.count -= 1);
  }, "unload"), q.exports.unload = ge, _ = /* @__PURE__ */ o(function(t, r, n) {
    P.emitted[t] || (P.emitted[t] = !0, P.emit(t, r, n));
  }, "emit"), be = {}, U.forEach(function(e) {
    be[e] = /* @__PURE__ */ o(function() {
      if (R(global.process)) {
        var r = S.listeners(e);
        r.length === P.count && (ge(), _("exit", null, e), _("afterexit", null, e), Pn && e === "SIGHUP" && (e = "SIGINT"), S.kill(S.pid, e));
      }
    }, "listener");
  }), q.exports.signals = function() {
    return U;
  }, $ = !1, ft = /* @__PURE__ */ o(function() {
    $ || !R(global.process) || ($ = !0, P.count += 1, U = U.filter(function(t) {
      try {
        return S.on(t, be[t]), !0;
      } catch {
        return !1;
      }
    }), S.emit = Tn, S.reallyExit = En);
  }, "load"), q.exports.load = ft, dt = S.reallyExit, En = /* @__PURE__ */ o(function(t) {
    R(global.process) && (S.exitCode = t || /* istanbul ignore next */
    0, _("exit", S.exitCode, null), _("afterexit", S.exitCode, null), dt.call(S, S.exitCode));
  }, "processReallyExit"), xe = S.emit, Tn = /* @__PURE__ */ o(function(t, r) {
    if (t === "exit" && R(global.process)) {
      r !== void 0 && (S.exitCode = r);
      var n = xe.apply(this, arguments);
      return _("exit", S.exitCode, null), _("afterexit", S.exitCode, null), n;
    } else
      return xe.apply(this, arguments);
  }, "processEmit")) : q.exports = function() {
    return function() {
    };
  };
  var vn, U, Pn, Y, P, ge, _, be, $, ft, dt, En, xe, Tn;
});

// ../node_modules/execa/lib/kill.js
var Cn = d((Tf, kn) => {
  "use strict";
  var Ms = y("os"), Fs = In(), Us = 1e3 * 5, $s = /* @__PURE__ */ o((e, t = "SIGTERM", r = {}) => {
    let n = e(t);
    return qs(e, t, r, n), n;
  }, "spawnedKill"), qs = /* @__PURE__ */ o((e, t, r, n) => {
    if (!Ws(t, r, n))
      return;
    let i = Vs(r), s = setTimeout(() => {
      e("SIGKILL");
    }, i);
    s.unref && s.unref();
  }, "setKillTimeout"), Ws = /* @__PURE__ */ o((e, { forceKillAfterTimeout: t }, r) => Hs(e) && t !== !1 && r, "shouldForceKill"), Hs = /* @__PURE__ */ o(
  (e) => e === Ms.constants.signals.SIGTERM || typeof e == "string" && e.toUpperCase() === "SIGTERM", "isSigterm"), Vs = /* @__PURE__ */ o(({
  forceKillAfterTimeout: e = !0 }) => {
    if (e === !0)
      return Us;
    if (!Number.isFinite(e) || e < 0)
      throw new TypeError(`Expected the \`forceKillAfterTimeout\` option to be a non-negative integer, got \`${e}\` (${typeof e})`);
    return e;
  }, "getForceKillAfterTimeout"), zs = /* @__PURE__ */ o((e, t) => {
    e.kill() && (t.isCanceled = !0);
  }, "spawnedCancel"), Ks = /* @__PURE__ */ o((e, t, r) => {
    e.kill(t), r(Object.assign(new Error("Timed out"), { timedOut: !0, signal: t }));
  }, "timeoutKill"), Js = /* @__PURE__ */ o((e, { timeout: t, killSignal: r = "SIGTERM" }, n) => {
    if (t === 0 || t === void 0)
      return n;
    let i, s = new Promise((c, u) => {
      i = setTimeout(() => {
        Ks(e, r, u);
      }, t);
    }), a = n.finally(() => {
      clearTimeout(i);
    });
    return Promise.race([s, a]);
  }, "setupTimeout"), Ys = /* @__PURE__ */ o(({ timeout: e }) => {
    if (e !== void 0 && (!Number.isFinite(e) || e < 0))
      throw new TypeError(`Expected the \`timeout\` option to be a non-negative integer, got \`${e}\` (${typeof e})`);
  }, "validateTimeout"), Xs = /* @__PURE__ */ o(async (e, { cleanup: t, detached: r }, n) => {
    if (!t || r)
      return n;
    let i = Fs(() => {
      e.kill();
    });
    return n.finally(() => {
      i();
    });
  }, "setExitHandler");
  kn.exports = {
    spawnedKill: $s,
    spawnedCancel: zs,
    setupTimeout: Js,
    validateTimeout: Ys,
    setExitHandler: Xs
  };
});

// ../node_modules/is-stream/index.js
var An = d((kf, On) => {
  "use strict";
  var k = /* @__PURE__ */ o((e) => e !== null && typeof e == "object" && typeof e.pipe == "function", "isStream");
  k.writable = (e) => k(e) && e.writable !== !1 && typeof e._write == "function" && typeof e._writableState == "object";
  k.readable = (e) => k(e) && e.readable !== !1 && typeof e._read == "function" && typeof e._readableState == "object";
  k.duplex = (e) => k.writable(e) && k.readable(e);
  k.transform = (e) => k.duplex(e) && typeof e._transform == "function";
  On.exports = k;
});

// ../node_modules/get-stream/buffer-stream.js
var _n = d((Of, Rn) => {
  "use strict";
  var { PassThrough: Zs } = y("stream");
  Rn.exports = (e) => {
    e = { ...e };
    let { array: t } = e, { encoding: r } = e, n = r === "buffer", i = !1;
    t ? i = !(r || n) : r = r || "utf8", n && (r = null);
    let s = new Zs({ objectMode: i });
    r && s.setEncoding(r);
    let a = 0, c = [];
    return s.on("data", (u) => {
      c.push(u), i ? a = c.length : a += u.length;
    }), s.getBufferedValue = () => t ? c : n ? Buffer.concat(c, a) : c.join(""), s.getBufferedLength = () => a, s;
  };
});

// ../node_modules/get-stream/index.js
var Gn = d((Af, X) => {
  "use strict";
  var { constants: Qs } = y("buffer"), ea = y("stream"), { promisify: ta } = y("util"), ra = _n(), na = ta(ea.pipeline), Se = class extends Error {
    static {
      o(this, "MaxBufferError");
    }
    constructor() {
      super("maxBuffer exceeded"), this.name = "MaxBufferError";
    }
  };
  async function pt(e, t) {
    if (!e)
      throw new Error("Expected a stream");
    t = {
      maxBuffer: 1 / 0,
      ...t
    };
    let { maxBuffer: r } = t, n = ra(t);
    return await new Promise((i, s) => {
      let a = /* @__PURE__ */ o((c) => {
        c && n.getBufferedLength() <= Qs.MAX_LENGTH && (c.bufferedData = n.getBufferedValue()), s(c);
      }, "rejectPromise");
      (async () => {
        try {
          await na(e, n), i();
        } catch (c) {
          a(c);
        }
      })(), n.on("data", () => {
        n.getBufferedLength() > r && a(new Se());
      });
    }), n.getBufferedValue();
  }
  o(pt, "getStream");
  X.exports = pt;
  X.exports.buffer = (e, t) => pt(e, { ...t, encoding: "buffer" });
  X.exports.array = (e, t) => pt(e, { ...t, array: !0 });
  X.exports.MaxBufferError = Se;
});

// ../node_modules/merge-stream/index.js
var mt = d((_f, jn) => {
  "use strict";
  var { PassThrough: oa } = y("stream");
  jn.exports = function() {
    var e = [], t = new oa({ objectMode: !0 });
    return t.setMaxListeners(0), t.add = r, t.isEmpty = n, t.on("unpipe", i), Array.prototype.slice.call(arguments).forEach(r), t;
    function r(s) {
      return Array.isArray(s) ? (s.forEach(r), this) : (e.push(s), s.once("end", i.bind(null, s)), s.once("error", t.emit.bind(t, "error")),
      s.pipe(t, { end: !1 }), this);
    }
    o(r, "add");
    function n() {
      return e.length == 0;
    }
    o(n, "isEmpty");
    function i(s) {
      e = e.filter(function(a) {
        return a !== s;
      }), !e.length && t.readable && t.end();
    }
    o(i, "remove");
  };
});

// ../node_modules/execa/lib/stream.js
var Ln = d((jf, Dn) => {
  "use strict";
  var Bn = An(), Nn = Gn(), ia = mt(), sa = /* @__PURE__ */ o((e, t) => {
    t === void 0 || e.stdin === void 0 || (Bn(t) ? t.pipe(e.stdin) : e.stdin.end(t));
  }, "handleInput"), aa = /* @__PURE__ */ o((e, { all: t }) => {
    if (!t || !e.stdout && !e.stderr)
      return;
    let r = ia();
    return e.stdout && r.add(e.stdout), e.stderr && r.add(e.stderr), r;
  }, "makeAllStream"), ht = /* @__PURE__ */ o(async (e, t) => {
    if (e) {
      e.destroy();
      try {
        return await t;
      } catch (r) {
        return r.bufferedData;
      }
    }
  }, "getBufferedData"), yt = /* @__PURE__ */ o((e, { encoding: t, buffer: r, maxBuffer: n }) => {
    if (!(!e || !r))
      return t ? Nn(e, { encoding: t, maxBuffer: n }) : Nn.buffer(e, { maxBuffer: n });
  }, "getStreamPromise"), ca = /* @__PURE__ */ o(async ({ stdout: e, stderr: t, all: r }, { encoding: n, buffer: i, maxBuffer: s }, a) => {
    let c = yt(e, { encoding: n, buffer: i, maxBuffer: s }), u = yt(t, { encoding: n, buffer: i, maxBuffer: s }), l = yt(r, { encoding: n, buffer: i,
    maxBuffer: s * 2 });
    try {
      return await Promise.all([a, c, u, l]);
    } catch (f) {
      return Promise.all([
        { error: f, signal: f.signal, timedOut: f.timedOut },
        ht(e, c),
        ht(t, u),
        ht(r, l)
      ]);
    }
  }, "getSpawnedResult"), ua = /* @__PURE__ */ o(({ input: e }) => {
    if (Bn(e))
      throw new TypeError("The `input` option cannot be a stream in sync mode");
  }, "validateInputSync");
  Dn.exports = {
    handleInput: sa,
    makeAllStream: aa,
    getSpawnedResult: ca,
    validateInputSync: ua
  };
});

// ../node_modules/execa/lib/promise.js
var Fn = d((Bf, Mn) => {
  "use strict";
  var la = (async () => {
  })().constructor.prototype, fa = ["then", "catch", "finally"].map((e) => [
    e,
    Reflect.getOwnPropertyDescriptor(la, e)
  ]), da = /* @__PURE__ */ o((e, t) => {
    for (let [r, n] of fa) {
      let i = typeof t == "function" ? (...s) => Reflect.apply(n.value, t(), s) : n.value.bind(t);
      Reflect.defineProperty(e, r, { ...n, value: i });
    }
    return e;
  }, "mergePromise"), pa = /* @__PURE__ */ o((e) => new Promise((t, r) => {
    e.on("exit", (n, i) => {
      t({ exitCode: n, signal: i });
    }), e.on("error", (n) => {
      r(n);
    }), e.stdin && e.stdin.on("error", (n) => {
      r(n);
    });
  }), "getSpawnedPromise");
  Mn.exports = {
    mergePromise: da,
    getSpawnedPromise: pa
  };
});

// ../node_modules/execa/lib/command.js
var qn = d((Lf, $n) => {
  "use strict";
  var Un = /* @__PURE__ */ o((e, t = []) => Array.isArray(t) ? [e, ...t] : [e], "normalizeArgs"), ma = /^[\w.-]+$/, ha = /"/g, ya = /* @__PURE__ */ o(
  (e) => typeof e != "string" || ma.test(e) ? e : `"${e.replace(ha, '\\"')}"`, "escapeArg"), ga = /* @__PURE__ */ o((e, t) => Un(e, t).join(
  " "), "joinCommand"), ba = /* @__PURE__ */ o((e, t) => Un(e, t).map((r) => ya(r)).join(" "), "getEscapedCommand"), xa = / +/g, Sa = /* @__PURE__ */ o(
  (e) => {
    let t = [];
    for (let r of e.trim().split(xa)) {
      let n = t[t.length - 1];
      n && n.endsWith("\\") ? t[t.length - 1] = `${n.slice(0, -1)} ${r}` : t.push(r);
    }
    return t;
  }, "parseCommand");
  $n.exports = {
    joinCommand: ga,
    getEscapedCommand: ba,
    parseCommand: Sa
  };
});

// ../node_modules/execa/index.js
var Yn = d((Ff, W) => {
  "use strict";
  var wa = y("path"), gt = y("child_process"), va = at(), Pa = rn(), Ea = sn(), Ta = ln(), we = bn(), Hn = Sn(), { spawnedKill: Ia, spawnedCancel: ka,
  setupTimeout: Ca, validateTimeout: Oa, setExitHandler: Aa } = Cn(), { handleInput: Ra, getSpawnedResult: _a, makeAllStream: Ga, validateInputSync: ja } = Ln(),
  { mergePromise: Wn, getSpawnedPromise: Na } = Fn(), { joinCommand: Vn, parseCommand: zn, getEscapedCommand: Kn } = qn(), Ba = 1e3 * 1e3 * 100,
  Da = /* @__PURE__ */ o(({ env: e, extendEnv: t, preferLocal: r, localDir: n, execPath: i }) => {
    let s = t ? { ...process.env, ...e } : e;
    return r ? Ea.env({ env: s, cwd: n, execPath: i }) : s;
  }, "getEnv"), Jn = /* @__PURE__ */ o((e, t, r = {}) => {
    let n = va._parse(e, t, r);
    return e = n.command, t = n.args, r = n.options, r = {
      maxBuffer: Ba,
      buffer: !0,
      stripFinalNewline: !0,
      extendEnv: !0,
      preferLocal: !1,
      localDir: r.cwd || process.cwd(),
      execPath: process.execPath,
      encoding: "utf8",
      reject: !0,
      cleanup: !0,
      all: !1,
      windowsHide: !0,
      ...r
    }, r.env = Da(r), r.stdio = Hn(r), process.platform === "win32" && wa.basename(e, ".exe") === "cmd" && t.unshift("/q"), { file: e, args: t,
    options: r, parsed: n };
  }, "handleArguments"), Z = /* @__PURE__ */ o((e, t, r) => typeof t != "string" && !Buffer.isBuffer(t) ? r === void 0 ? void 0 : "" : e.stripFinalNewline ?
  Pa(t) : t, "handleOutput"), ve = /* @__PURE__ */ o((e, t, r) => {
    let n = Jn(e, t, r), i = Vn(e, t), s = Kn(e, t);
    Oa(n.options);
    let a;
    try {
      a = gt.spawn(n.file, n.args, n.options);
    } catch (p) {
      let b = new gt.ChildProcess(), h = Promise.reject(we({
        error: p,
        stdout: "",
        stderr: "",
        all: "",
        command: i,
        escapedCommand: s,
        parsed: n,
        timedOut: !1,
        isCanceled: !1,
        killed: !1
      }));
      return Wn(b, h);
    }
    let c = Na(a), u = Ca(a, n.options, c), l = Aa(a, n.options, u), f = { isCanceled: !1 };
    a.kill = Ia.bind(null, a.kill.bind(a)), a.cancel = ka.bind(null, a, f);
    let g = Ta(/* @__PURE__ */ o(async () => {
      let [{ error: p, exitCode: b, signal: h, timedOut: x }, E, T, C] = await _a(a, n.options, l), m = Z(n.options, E), v = Z(n.options, T),
      I = Z(n.options, C);
      if (p || b !== 0 || h !== null) {
        let V = we({
          error: p,
          exitCode: b,
          signal: h,
          stdout: m,
          stderr: v,
          all: I,
          command: i,
          escapedCommand: s,
          parsed: n,
          timedOut: x,
          isCanceled: f.isCanceled,
          killed: a.killed
        });
        if (!n.options.reject)
          return V;
        throw V;
      }
      return {
        command: i,
        escapedCommand: s,
        exitCode: 0,
        stdout: m,
        stderr: v,
        all: I,
        failed: !1,
        timedOut: !1,
        isCanceled: !1,
        killed: !1
      };
    }, "handlePromise"));
    return Ra(a, n.options.input), a.all = Ga(a, n.options), Wn(a, g);
  }, "execa");
  W.exports = ve;
  W.exports.sync = (e, t, r) => {
    let n = Jn(e, t, r), i = Vn(e, t), s = Kn(e, t);
    ja(n.options);
    let a;
    try {
      a = gt.spawnSync(n.file, n.args, n.options);
    } catch (l) {
      throw we({
        error: l,
        stdout: "",
        stderr: "",
        all: "",
        command: i,
        escapedCommand: s,
        parsed: n,
        timedOut: !1,
        isCanceled: !1,
        killed: !1
      });
    }
    let c = Z(n.options, a.stdout, a.error), u = Z(n.options, a.stderr, a.error);
    if (a.error || a.status !== 0 || a.signal !== null) {
      let l = we({
        stdout: c,
        stderr: u,
        error: a.error,
        signal: a.signal,
        exitCode: a.status,
        command: i,
        escapedCommand: s,
        parsed: n,
        timedOut: a.error && a.error.code === "ETIMEDOUT",
        isCanceled: !1,
        killed: a.signal !== null
      });
      if (!n.options.reject)
        return l;
      throw l;
    }
    return {
      command: i,
      escapedCommand: s,
      exitCode: 0,
      stdout: c,
      stderr: u,
      failed: !1,
      timedOut: !1,
      isCanceled: !1,
      killed: !1
    };
  };
  W.exports.command = (e, t) => {
    let [r, ...n] = zn(e);
    return ve(r, n, t);
  };
  W.exports.commandSync = (e, t) => {
    let [r, ...n] = zn(e);
    return ve.sync(r, n, t);
  };
  W.exports.node = (e, t, r = {}) => {
    t && !Array.isArray(t) && typeof t == "object" && (r = t, t = []);
    let n = Hn.node(r), i = process.execArgv.filter((c) => !c.startsWith("--inspect")), {
      nodePath: s = process.execPath,
      nodeOptions: a = i
    } = r;
    return ve(
      s,
      [
        ...a,
        e,
        ...Array.isArray(t) ? t : []
      ],
      {
        ...r,
        stdin: void 0,
        stdout: void 0,
        stderr: void 0,
        stdio: n,
        shell: !1
      }
    );
  };
});

// ../node_modules/detect-package-manager/dist/index.js
var eo = d((Qn) => {
  var La = Object.create, Te = Object.defineProperty, Ma = Object.getOwnPropertyDescriptor, Fa = Object.getOwnPropertyNames, Ua = Object.getPrototypeOf,
  $a = Object.prototype.hasOwnProperty, Xn = /* @__PURE__ */ o((e) => Te(e, "__esModule", { value: !0 }), "__markAsModule"), qa = /* @__PURE__ */ o(
  (e, t) => {
    Xn(e);
    for (var r in t)
      Te(e, r, { get: t[r], enumerable: !0 });
  }, "__export"), Wa = /* @__PURE__ */ o((e, t, r) => {
    if (t && typeof t == "object" || typeof t == "function")
      for (let n of Fa(t))
        !$a.call(e, n) && n !== "default" && Te(e, n, { get: /* @__PURE__ */ o(() => t[n], "get"), enumerable: !(r = Ma(t, n)) || r.enumerable });
    return e;
  }, "__reExport"), xt = /* @__PURE__ */ o((e) => Wa(Xn(Te(e != null ? La(Ua(e)) : {}, "default", e && e.__esModule && "default" in e ? { get: /* @__PURE__ */ o(
  () => e.default, "get"), enumerable: !0 } : { value: e, enumerable: !0 })), e), "__toModule");
  qa(Qn, {
    clearCache: /* @__PURE__ */ o(() => Ja, "clearCache"),
    detect: /* @__PURE__ */ o(() => za, "detect"),
    getNpmVersion: /* @__PURE__ */ o(() => Ka, "getNpmVersion")
  });
  var Ha = xt(y("fs")), Pe = xt(y("path")), Zn = xt(Yn());
  async function Ee(e) {
    try {
      return await Ha.promises.access(e), !0;
    } catch {
      return !1;
    }
  }
  o(Ee, "pathExists");
  var G = /* @__PURE__ */ new Map();
  function bt(e) {
    let t = `has_global_${e}`;
    return G.has(t) ? Promise.resolve(G.get(t)) : (0, Zn.default)(e, ["--version"]).then((r) => /^\d+.\d+.\d+$/.test(r.stdout)).then((r) => (G.
    set(t, r), r)).catch(() => !1);
  }
  o(bt, "hasGlobalInstallation");
  function Va(e = ".") {
    let t = `lockfile_${e}`;
    return G.has(t) ? Promise.resolve(G.get(t)) : Promise.all([
      Ee((0, Pe.resolve)(e, "yarn.lock")),
      Ee((0, Pe.resolve)(e, "package-lock.json")),
      Ee((0, Pe.resolve)(e, "pnpm-lock.yaml")),
      Ee((0, Pe.resolve)(e, "bun.lockb"))
    ]).then(([r, n, i, s]) => {
      let a = null;
      return r ? a = "yarn" : i ? a = "pnpm" : s ? a = "bun" : n && (a = "npm"), G.set(t, a), a;
    });
  }
  o(Va, "getTypeofLockFile");
  var za = /* @__PURE__ */ o(async ({
    cwd: e,
    includeGlobalBun: t
  } = {}) => {
    let r = await Va(e);
    if (r)
      return r;
    let [n, i, s] = await Promise.all([
      bt("yarn"),
      bt("pnpm"),
      t && bt("bun")
    ]);
    return n ? "yarn" : i ? "pnpm" : s ? "bun" : "npm";
  }, "detect");
  function Ka(e) {
    return (0, Zn.default)(e || "npm", ["--version"]).then((t) => t.stdout);
  }
  o(Ka, "getNpmVersion");
  function Ja() {
    return G.clear();
  }
  o(Ja, "clearCache");
});

// ../node_modules/walk-up-path/dist/cjs/index.js
var ro = d((Ie) => {
  "use strict";
  Object.defineProperty(Ie, "__esModule", { value: !0 });
  Ie.walkUp = void 0;
  var to = y("path"), Ya = /* @__PURE__ */ o(function* (e) {
    for (e = (0, to.resolve)(e); e; ) {
      yield e;
      let t = (0, to.dirname)(e);
      if (t === e)
        break;
      e = t;
    }
  }, "walkUp");
  Ie.walkUp = Ya;
});

// ../node_modules/common-path-prefix/index.js
var ai = d((Am, si) => {
  "use strict";
  var { sep: Nu } = y("path"), Bu = /* @__PURE__ */ o((e) => {
    for (let t of e) {
      let r = /(\/|\\)/.exec(t);
      if (r !== null) return r[0];
    }
    return Nu;
  }, "determineSeparator");
  si.exports = /* @__PURE__ */ o(function(t, r = Bu(t)) {
    let [n = "", ...i] = t;
    if (n === "" || i.length === 0) return "";
    let s = n.split(r), a = s.length;
    for (let u of i) {
      let l = u.split(r);
      for (let f = 0; f < a; f++)
        l[f] !== s[f] && (a = f);
      if (a === 0) return "";
    }
    let c = s.slice(0, a).join(r);
    return c.endsWith(r) ? c : c + r;
  }, "commonPathPrefix");
});

// ../node_modules/fetch-retry/index.js
var Ei = d((Cy, Pi) => {
  "use strict";
  Pi.exports = function(e, t) {
    if (t = t || {}, typeof e != "function")
      throw new O("fetch must be a function");
    if (typeof t != "object")
      throw new O("defaults must be an object");
    if (t.retries !== void 0 && !Ve(t.retries))
      throw new O("retries must be a positive integer");
    if (t.retryDelay !== void 0 && !Ve(t.retryDelay) && typeof t.retryDelay != "function")
      throw new O("retryDelay must be a positive integer or a function returning a positive integer");
    if (t.retryOn !== void 0 && !Array.isArray(t.retryOn) && typeof t.retryOn != "function")
      throw new O("retryOn property expects an array or function");
    var r = {
      retries: 3,
      retryDelay: 1e3,
      retryOn: []
    };
    return t = Object.assign(r, t), /* @__PURE__ */ o(function(i, s) {
      var a = t.retries, c = t.retryDelay, u = t.retryOn;
      if (s && s.retries !== void 0)
        if (Ve(s.retries))
          a = s.retries;
        else
          throw new O("retries must be a positive integer");
      if (s && s.retryDelay !== void 0)
        if (Ve(s.retryDelay) || typeof s.retryDelay == "function")
          c = s.retryDelay;
        else
          throw new O("retryDelay must be a positive integer or a function returning a positive integer");
      if (s && s.retryOn)
        if (Array.isArray(s.retryOn) || typeof s.retryOn == "function")
          u = s.retryOn;
        else
          throw new O("retryOn property expects an array or function");
      return new Promise(function(l, f) {
        var w = /* @__PURE__ */ o(function(p) {
          var b = typeof Request < "u" && i instanceof Request ? i.clone() : i;
          e(b, s).then(function(h) {
            if (Array.isArray(u) && u.indexOf(h.status) === -1)
              l(h);
            else if (typeof u == "function")
              try {
                return Promise.resolve(u(p, null, h)).then(function(x) {
                  x ? g(p, null, h) : l(h);
                }).catch(f);
              } catch (x) {
                f(x);
              }
            else
              p < a ? g(p, null, h) : l(h);
          }).catch(function(h) {
            if (typeof u == "function")
              try {
                Promise.resolve(u(p, h, null)).then(function(x) {
                  x ? g(p, h, null) : f(h);
                }).catch(function(x) {
                  f(x);
                });
              } catch (x) {
                f(x);
              }
            else p < a ? g(p, h, null) : f(h);
          });
        }, "wrappedFetch");
        function g(p, b, h) {
          var x = typeof c == "function" ? c(p, b, h) : c;
          setTimeout(function() {
            w(++p);
          }, x);
        }
        o(g, "retry"), w(0);
      });
    }, "fetchRetry");
  };
  function Ve(e) {
    return Number.isInteger(e) && e >= 0;
  }
  o(Ve, "isPositiveInteger");
  function O(e) {
    this.name = "ArgumentError", this.message = e;
  }
  o(O, "ArgumentError");
});

// src/telemetry/index.ts
import { logger as Ni } from "@storybook/core/node-logger";

// src/telemetry/notify.ts
var ce = A(cr(), 1);
import { cache as ur } from "@storybook/core/common";
var lr = "telemetry-notification-date", B = console, fr = /* @__PURE__ */ o(async () => {
  await ur.get(lr, null) || (ur.set(lr, Date.now()), B.log(), B.log(
    `${ce.default.magenta(
      ce.default.bold("attention")
    )} => Storybook now collects completely anonymous telemetry regarding usage.`
  ), B.log("This information is used to shape Storybook's roadmap and prioritize features."), B.log(
    "You can learn more, including how to opt-out if you'd not like to participate in this anonymous program, by visiting the following URL:"
  ), B.log(ce.default.cyan("https://storybook.js.org/telemetry")), B.log());
}, "notify");

// src/telemetry/sanitize.ts
import mr from "node:path";
function dr(e) {
  return e.replace(/[-[/{}()*+?.\\^$|]/g, "\\$&");
}
o(dr, "regexpEscape");
function pr(e = "") {
  return e.replace(/\u001B\[[0-9;]*m/g, "");
}
o(pr, "removeAnsiEscapeCodes");
function z(e, t = mr.sep) {
  if (!e)
    return e;
  let r = process.cwd().split(t);
  for (; r.length > 1; ) {
    let n = r.join(t), i = new RegExp(dr(n), "gi");
    e = e.replace(i, "$SNIP");
    let s = r.join(t + t), a = new RegExp(dr(s), "gi");
    e = e.replace(a, "$SNIP"), r.pop();
  }
  return e;
}
o(z, "cleanPaths");
function ue(e, t = mr.sep) {
  try {
    e = {
      ...JSON.parse(JSON.stringify(e)),
      message: pr(e.message),
      stack: pr(e.stack),
      cause: e.cause,
      name: e.name
    };
    let r = z(JSON.stringify(e), t);
    return JSON.parse(r);
  } catch (r) {
    return `Sanitization error: ${r?.message}`;
  }
}
o(ue, "sanitizeError");

// src/telemetry/storybook-metadata.ts
var He = A(eo(), 1);
import {
  getProjectRoot as Zu,
  getStorybookConfiguration as Qu,
  getStorybookInfo as el,
  loadMainConfig as tl
} from "@storybook/core/common";
import { readConfig as rl } from "@storybook/core/csf-tools";

// ../node_modules/fd-package-json/dist/esm/main.js
var no = A(ro(), 1);
import { resolve as Xa } from "node:path";
import { stat as Za, readFile as Qa } from "node:fs/promises";
import { statSync as Jf, readFileSync as Yf } from "node:fs";
async function ec(e) {
  try {
    return (await Za(e)).isFile();
  } catch {
    return !1;
  }
}
o(ec, "fileExists");
async function tc(e) {
  for (let t of (0, no.walkUp)(e)) {
    let r = Xa(t, "package.json");
    if (await ec(r))
      return r;
  }
  return null;
}
o(tc, "findPackagePath");
async function oo(e) {
  let t = await tc(e);
  if (!t)
    return null;
  try {
    let r = await Qa(t, { encoding: "utf8" });
    return JSON.parse(r);
  } catch {
    return null;
  }
}
o(oo, "findPackage");

// src/telemetry/get-chromatic-version.ts
function io(e) {
  let t = e.dependencies?.chromatic || e.devDependencies?.chromatic || e.peerDependencies?.chromatic;
  return t || (e.scripts && Object.values(e.scripts).find((r) => r?.match(/chromatic/)) ? "latest" : void 0);
}
o(io, "getChromaticVersionSpecifier");

// src/telemetry/get-framework-info.ts
import { normalize as oc } from "node:path";
import { frameworkPackages as ic } from "@storybook/core/common";

// src/telemetry/package-json.ts
import { readFile as rc } from "node:fs/promises";
import { join as nc } from "node:path";
var St = /* @__PURE__ */ o(async (e) => {
  let t = Object.keys(e);
  return Promise.all(t.map(ke));
}, "getActualPackageVersions"), ke = /* @__PURE__ */ o(async (e) => {
  try {
    let t = await wt(e);
    return {
      name: e,
      version: t.version
    };
  } catch {
    return { name: e, version: null };
  }
}, "getActualPackageVersion"), wt = /* @__PURE__ */ o(async (e) => {
  let t = y.resolve(nc(e, "package.json"), {
    paths: [process.cwd()]
  });
  return JSON.parse(await rc(t, { encoding: "utf8" }));
}, "getActualPackageJson");

// src/telemetry/get-framework-info.ts
var sc = [
  "html",
  "react",
  "svelte",
  "vue3",
  "preact",
  "server",
  "vue",
  "web-components",
  "angular",
  "ember"
], ac = ["builder-webpack5", "builder-vite"];
function so(e, t) {
  let { name: r = "", version: n, dependencies: i, devDependencies: s, peerDependencies: a } = e, c = {
    // We include the framework itself because it may be a renderer too (e.g. angular)
    [r]: n,
    ...i,
    ...s,
    ...a
  };
  return t.map((u) => `@storybook/${u}`).find((u) => c[u]);
}
o(so, "findMatchingPackage");
var cc = /* @__PURE__ */ o((e) => {
  let t = oc(e).replace(new RegExp(/\\/, "g"), "/");
  return Object.keys(ic).find((n) => t.endsWith(n)) || z(e).replace(/.*node_modules[\\/]/, "");
}, "getFrameworkPackageName");
async function ao(e) {
  if (!e?.framework)
    return {};
  let t = typeof e.framework == "string" ? e.framework : e.framework?.name;
  if (!t)
    return {};
  let r = await wt(t);
  if (!r)
    return {};
  let n = so(r, ac), i = so(r, sc), s = cc(t), a = typeof e.framework == "object" ? e.framework.options : {};
  return {
    framework: {
      name: s,
      options: a
    },
    builder: n,
    renderer: i
  };
}
o(ao, "getFrameworkInfo");

// src/telemetry/get-monorepo-type.ts
import { existsSync as co, readFileSync as uc } from "node:fs";
import { join as vt } from "node:path";
import { getProjectRoot as lc } from "@storybook/core/common";
var uo = {
  Nx: "nx.json",
  Turborepo: "turbo.json",
  Lerna: "lerna.json",
  Rush: "rush.json",
  Lage: "lage.config.json"
}, lo = /* @__PURE__ */ o(() => {
  let e = lc();
  if (!e)
    return;
  let r = Object.keys(uo).find((i) => {
    let s = vt(e, uo[i]);
    return co(s);
  });
  if (r)
    return r;
  if (!co(vt(e, "package.json")))
    return;
  if (JSON.parse(
    uc(vt(e, "package.json"), { encoding: "utf8" })
  )?.workspaces)
    return "Workspaces";
}, "getMonorepoType");

// node_modules/execa/index.js
var Yo = A(at(), 1);
import { Buffer as Pu } from "node:buffer";
import Eu from "node:path";
import zt from "node:child_process";
import Ue from "node:process";

// ../node_modules/strip-final-newline/index.js
function Pt(e) {
  let t = typeof e == "string" ? `
` : 10, r = typeof e == "string" ? "\r" : 13;
  return e[e.length - 1] === t && (e = e.slice(0, -1)), e[e.length - 1] === r && (e = e.slice(0, -1)), e;
}
o(Pt, "stripFinalNewline");

// node_modules/npm-run-path/index.js
import Oe from "node:process";
import Q from "node:path";
import fc from "node:url";

// node_modules/path-key/index.js
function Ce(e = {}) {
  let {
    env: t = process.env,
    platform: r = process.platform
  } = e;
  return r !== "win32" ? "PATH" : Object.keys(t).reverse().find((n) => n.toUpperCase() === "PATH") || "Path";
}
o(Ce, "pathKey");

// node_modules/npm-run-path/index.js
function dc(e = {}) {
  let {
    cwd: t = Oe.cwd(),
    path: r = Oe.env[Ce()],
    execPath: n = Oe.execPath
  } = e, i, s = t instanceof URL ? fc.fileURLToPath(t) : t, a = Q.resolve(s), c = [];
  for (; i !== a; )
    c.push(Q.join(a, "node_modules/.bin")), i = a, a = Q.resolve(a, "..");
  return c.push(Q.resolve(s, n, "..")), [...c, r].join(Q.delimiter);
}
o(dc, "npmRunPath");
function fo({ env: e = Oe.env, ...t } = {}) {
  e = { ...e };
  let r = Ce({ env: e });
  return t.path = e[r], e[r] = dc(t), e;
}
o(fo, "npmRunPathEnv");

// node_modules/mimic-fn/index.js
var pc = /* @__PURE__ */ o((e, t, r, n) => {
  if (r === "length" || r === "prototype" || r === "arguments" || r === "caller")
    return;
  let i = Object.getOwnPropertyDescriptor(e, r), s = Object.getOwnPropertyDescriptor(t, r);
  !mc(i, s) && n || Object.defineProperty(e, r, s);
}, "copyProperty"), mc = /* @__PURE__ */ o(function(e, t) {
  return e === void 0 || e.configurable || e.writable === t.writable && e.enumerable === t.enumerable && e.configurable === t.configurable &&
  (e.writable || e.value === t.value);
}, "canCopyProperty"), hc = /* @__PURE__ */ o((e, t) => {
  let r = Object.getPrototypeOf(t);
  r !== Object.getPrototypeOf(e) && Object.setPrototypeOf(e, r);
}, "changePrototype"), yc = /* @__PURE__ */ o((e, t) => `/* Wrapped ${e}*/
${t}`, "wrappedToString"), gc = Object.getOwnPropertyDescriptor(Function.prototype, "toString"), bc = Object.getOwnPropertyDescriptor(Function.
prototype.toString, "name"), xc = /* @__PURE__ */ o((e, t, r) => {
  let n = r === "" ? "" : `with ${r.trim()}() `, i = yc.bind(null, n, t.toString());
  Object.defineProperty(i, "name", bc), Object.defineProperty(e, "toString", { ...gc, value: i });
}, "changeToString");
function Et(e, t, { ignoreNonConfigurable: r = !1 } = {}) {
  let { name: n } = e;
  for (let i of Reflect.ownKeys(t))
    pc(e, t, i, r);
  return hc(e, t), xc(e, t, n), e;
}
o(Et, "mimicFunction");

// node_modules/onetime/index.js
var Ae = /* @__PURE__ */ new WeakMap(), po = /* @__PURE__ */ o((e, t = {}) => {
  if (typeof e != "function")
    throw new TypeError("Expected a function");
  let r, n = 0, i = e.displayName || e.name || "<anonymous>", s = /* @__PURE__ */ o(function(...a) {
    if (Ae.set(s, ++n), n === 1)
      r = e.apply(this, a), e = null;
    else if (t.throw === !0)
      throw new Error(`Function \`${i}\` can only be called once`);
    return r;
  }, "onetime");
  return Et(s, e), Ae.set(s, n), s;
}, "onetime");
po.callCount = (e) => {
  if (!Ae.has(e))
    throw new Error(`The given function \`${e.name}\` is not wrapped by the \`onetime\` package`);
  return Ae.get(e);
};
var mo = po;

// node_modules/execa/lib/error.js
import Oc from "node:process";

// node_modules/human-signals/build/src/main.js
import { constants as Pc } from "node:os";

// node_modules/human-signals/build/src/realtime.js
var ho = /* @__PURE__ */ o(() => {
  let e = Tt - yo + 1;
  return Array.from({ length: e }, Sc);
}, "getRealtimeSignals"), Sc = /* @__PURE__ */ o((e, t) => ({
  name: `SIGRT${t + 1}`,
  number: yo + t,
  action: "terminate",
  description: "Application-specific signal (realtime)",
  standard: "posix"
}), "getRealtimeSignal"), yo = 34, Tt = 64;

// node_modules/human-signals/build/src/signals.js
import { constants as wc } from "node:os";

// node_modules/human-signals/build/src/core.js
var go = [
  {
    name: "SIGHUP",
    number: 1,
    action: "terminate",
    description: "Terminal closed",
    standard: "posix"
  },
  {
    name: "SIGINT",
    number: 2,
    action: "terminate",
    description: "User interruption with CTRL-C",
    standard: "ansi"
  },
  {
    name: "SIGQUIT",
    number: 3,
    action: "core",
    description: "User interruption with CTRL-\\",
    standard: "posix"
  },
  {
    name: "SIGILL",
    number: 4,
    action: "core",
    description: "Invalid machine instruction",
    standard: "ansi"
  },
  {
    name: "SIGTRAP",
    number: 5,
    action: "core",
    description: "Debugger breakpoint",
    standard: "posix"
  },
  {
    name: "SIGABRT",
    number: 6,
    action: "core",
    description: "Aborted",
    standard: "ansi"
  },
  {
    name: "SIGIOT",
    number: 6,
    action: "core",
    description: "Aborted",
    standard: "bsd"
  },
  {
    name: "SIGBUS",
    number: 7,
    action: "core",
    description: "Bus error due to misaligned, non-existing address or paging error",
    standard: "bsd"
  },
  {
    name: "SIGEMT",
    number: 7,
    action: "terminate",
    description: "Command should be emulated but is not implemented",
    standard: "other"
  },
  {
    name: "SIGFPE",
    number: 8,
    action: "core",
    description: "Floating point arithmetic error",
    standard: "ansi"
  },
  {
    name: "SIGKILL",
    number: 9,
    action: "terminate",
    description: "Forced termination",
    standard: "posix",
    forced: !0
  },
  {
    name: "SIGUSR1",
    number: 10,
    action: "terminate",
    description: "Application-specific signal",
    standard: "posix"
  },
  {
    name: "SIGSEGV",
    number: 11,
    action: "core",
    description: "Segmentation fault",
    standard: "ansi"
  },
  {
    name: "SIGUSR2",
    number: 12,
    action: "terminate",
    description: "Application-specific signal",
    standard: "posix"
  },
  {
    name: "SIGPIPE",
    number: 13,
    action: "terminate",
    description: "Broken pipe or socket",
    standard: "posix"
  },
  {
    name: "SIGALRM",
    number: 14,
    action: "terminate",
    description: "Timeout or timer",
    standard: "posix"
  },
  {
    name: "SIGTERM",
    number: 15,
    action: "terminate",
    description: "Termination",
    standard: "ansi"
  },
  {
    name: "SIGSTKFLT",
    number: 16,
    action: "terminate",
    description: "Stack is empty or overflowed",
    standard: "other"
  },
  {
    name: "SIGCHLD",
    number: 17,
    action: "ignore",
    description: "Child process terminated, paused or unpaused",
    standard: "posix"
  },
  {
    name: "SIGCLD",
    number: 17,
    action: "ignore",
    description: "Child process terminated, paused or unpaused",
    standard: "other"
  },
  {
    name: "SIGCONT",
    number: 18,
    action: "unpause",
    description: "Unpaused",
    standard: "posix",
    forced: !0
  },
  {
    name: "SIGSTOP",
    number: 19,
    action: "pause",
    description: "Paused",
    standard: "posix",
    forced: !0
  },
  {
    name: "SIGTSTP",
    number: 20,
    action: "pause",
    description: 'Paused using CTRL-Z or "suspend"',
    standard: "posix"
  },
  {
    name: "SIGTTIN",
    number: 21,
    action: "pause",
    description: "Background process cannot read terminal input",
    standard: "posix"
  },
  {
    name: "SIGBREAK",
    number: 21,
    action: "terminate",
    description: "User interruption with CTRL-BREAK",
    standard: "other"
  },
  {
    name: "SIGTTOU",
    number: 22,
    action: "pause",
    description: "Background process cannot write to terminal output",
    standard: "posix"
  },
  {
    name: "SIGURG",
    number: 23,
    action: "ignore",
    description: "Socket received out-of-band data",
    standard: "bsd"
  },
  {
    name: "SIGXCPU",
    number: 24,
    action: "core",
    description: "Process timed out",
    standard: "bsd"
  },
  {
    name: "SIGXFSZ",
    number: 25,
    action: "core",
    description: "File too big",
    standard: "bsd"
  },
  {
    name: "SIGVTALRM",
    number: 26,
    action: "terminate",
    description: "Timeout or timer",
    standard: "bsd"
  },
  {
    name: "SIGPROF",
    number: 27,
    action: "terminate",
    description: "Timeout or timer",
    standard: "bsd"
  },
  {
    name: "SIGWINCH",
    number: 28,
    action: "ignore",
    description: "Terminal window size changed",
    standard: "bsd"
  },
  {
    name: "SIGIO",
    number: 29,
    action: "terminate",
    description: "I/O is available",
    standard: "other"
  },
  {
    name: "SIGPOLL",
    number: 29,
    action: "terminate",
    description: "Watched event",
    standard: "other"
  },
  {
    name: "SIGINFO",
    number: 29,
    action: "ignore",
    description: "Request for process information",
    standard: "other"
  },
  {
    name: "SIGPWR",
    number: 30,
    action: "terminate",
    description: "Device running out of power",
    standard: "systemv"
  },
  {
    name: "SIGSYS",
    number: 31,
    action: "core",
    description: "Invalid system call",
    standard: "other"
  },
  {
    name: "SIGUNUSED",
    number: 31,
    action: "terminate",
    description: "Invalid system call",
    standard: "other"
  }
];

// node_modules/human-signals/build/src/signals.js
var It = /* @__PURE__ */ o(() => {
  let e = ho();
  return [...go, ...e].map(vc);
}, "getSignals"), vc = /* @__PURE__ */ o(({
  name: e,
  number: t,
  description: r,
  action: n,
  forced: i = !1,
  standard: s
}) => {
  let {
    signals: { [e]: a }
  } = wc, c = a !== void 0;
  return { name: e, number: c ? a : t, description: r, supported: c, action: n, forced: i, standard: s };
}, "normalizeSignal");

// node_modules/human-signals/build/src/main.js
var Ec = /* @__PURE__ */ o(() => {
  let e = It();
  return Object.fromEntries(e.map(Tc));
}, "getSignalsByName"), Tc = /* @__PURE__ */ o(({
  name: e,
  number: t,
  description: r,
  supported: n,
  action: i,
  forced: s,
  standard: a
}) => [e, { name: e, number: t, description: r, supported: n, action: i, forced: s, standard: a }], "getSignalByName"), bo = Ec(), Ic = /* @__PURE__ */ o(
() => {
  let e = It(), t = Tt + 1, r = Array.from(
    { length: t },
    (n, i) => kc(i, e)
  );
  return Object.assign({}, ...r);
}, "getSignalsByNumber"), kc = /* @__PURE__ */ o((e, t) => {
  let r = Cc(e, t);
  if (r === void 0)
    return {};
  let { name: n, description: i, supported: s, action: a, forced: c, standard: u } = r;
  return {
    [e]: {
      name: n,
      number: e,
      description: i,
      supported: s,
      action: a,
      forced: c,
      standard: u
    }
  };
}, "getSignalByNumber"), Cc = /* @__PURE__ */ o((e, t) => {
  let r = t.find(({ name: n }) => Pc.signals[n] === e);
  return r !== void 0 ? r : t.find((n) => n.number === e);
}, "findSignalByNumber"), $d = Ic();

// node_modules/execa/lib/error.js
var Ac = /* @__PURE__ */ o(({ timedOut: e, timeout: t, errorCode: r, signal: n, signalDescription: i, exitCode: s, isCanceled: a }) => e ? `\
timed out after ${t} milliseconds` : a ? "was canceled" : r !== void 0 ? `failed with ${r}` : n !== void 0 ? `was killed with ${n} (${i})` :
s !== void 0 ? `failed with exit code ${s}` : "failed", "getErrorPrefix"), ee = /* @__PURE__ */ o(({
  stdout: e,
  stderr: t,
  all: r,
  error: n,
  signal: i,
  exitCode: s,
  command: a,
  escapedCommand: c,
  timedOut: u,
  isCanceled: l,
  killed: f,
  parsed: { options: { timeout: w, cwd: g = Oc.cwd() } }
}) => {
  s = s === null ? void 0 : s, i = i === null ? void 0 : i;
  let p = i === void 0 ? void 0 : bo[i].description, b = n && n.code, x = `Command ${Ac({ timedOut: u, timeout: w, errorCode: b, signal: i, signalDescription: p,
  exitCode: s, isCanceled: l })}: ${a}`, E = Object.prototype.toString.call(n) === "[object Error]", T = E ? `${x}
${n.message}` : x, C = [T, t, e].filter(Boolean).join(`
`);
  return E ? (n.originalMessage = n.message, n.message = C) : n = new Error(C), n.shortMessage = T, n.command = a, n.escapedCommand = c, n.exitCode =
  s, n.signal = i, n.signalDescription = p, n.stdout = e, n.stderr = t, n.cwd = g, r !== void 0 && (n.all = r), "bufferedData" in n && delete n.
  bufferedData, n.failed = !0, n.timedOut = !!u, n.isCanceled = l, n.killed = f && !u, n;
}, "makeError");

// node_modules/execa/lib/stdio.js
var Re = ["stdin", "stdout", "stderr"], Rc = /* @__PURE__ */ o((e) => Re.some((t) => e[t] !== void 0), "hasAlias"), xo = /* @__PURE__ */ o((e) => {
  if (!e)
    return;
  let { stdio: t } = e;
  if (t === void 0)
    return Re.map((n) => e[n]);
  if (Rc(e))
    throw new Error(`It's not possible to provide \`stdio\` in combination with one of ${Re.map((n) => `\`${n}\``).join(", ")}`);
  if (typeof t == "string")
    return t;
  if (!Array.isArray(t))
    throw new TypeError(`Expected \`stdio\` to be of type \`string\` or \`Array\`, got \`${typeof t}\``);
  let r = Math.max(t.length, Re.length);
  return Array.from({ length: r }, (n, i) => t[i]);
}, "normalizeStdio");

// node_modules/execa/lib/kill.js
import jc from "node:os";

// node_modules/signal-exit/dist/mjs/signals.js
var j = [];
j.push("SIGHUP", "SIGINT", "SIGTERM");
process.platform !== "win32" && j.push(
  "SIGALRM",
  "SIGABRT",
  "SIGVTALRM",
  "SIGXCPU",
  "SIGXFSZ",
  "SIGUSR2",
  "SIGTRAP",
  "SIGSYS",
  "SIGQUIT",
  "SIGIOT"
  // should detect profiler and enable/disable accordingly.
  // see #21
  // 'SIGPROF'
);
process.platform === "linux" && j.push("SIGIO", "SIGPOLL", "SIGPWR", "SIGSTKFLT");

// node_modules/signal-exit/dist/mjs/index.js
var _e = /* @__PURE__ */ o((e) => !!e && typeof e == "object" && typeof e.removeListener == "function" && typeof e.emit == "function" && typeof e.
reallyExit == "function" && typeof e.listeners == "function" && typeof e.kill == "function" && typeof e.pid == "number" && typeof e.on == "f\
unction", "processOk"), kt = Symbol.for("signal-exit emitter"), Ct = globalThis, _c = Object.defineProperty.bind(Object), Ot = class {
  static {
    o(this, "Emitter");
  }
  emitted = {
    afterExit: !1,
    exit: !1
  };
  listeners = {
    afterExit: [],
    exit: []
  };
  count = 0;
  id = Math.random();
  constructor() {
    if (Ct[kt])
      return Ct[kt];
    _c(Ct, kt, {
      value: this,
      writable: !1,
      enumerable: !1,
      configurable: !1
    });
  }
  on(t, r) {
    this.listeners[t].push(r);
  }
  removeListener(t, r) {
    let n = this.listeners[t], i = n.indexOf(r);
    i !== -1 && (i === 0 && n.length === 1 ? n.length = 0 : n.splice(i, 1));
  }
  emit(t, r, n) {
    if (this.emitted[t])
      return !1;
    this.emitted[t] = !0;
    let i = !1;
    for (let s of this.listeners[t])
      i = s(r, n) === !0 || i;
    return t === "exit" && (i = this.emit("afterExit", r, n) || i), i;
  }
}, Ge = class {
  static {
    o(this, "SignalExitBase");
  }
}, Gc = /* @__PURE__ */ o((e) => ({
  onExit(t, r) {
    return e.onExit(t, r);
  },
  load() {
    return e.load();
  },
  unload() {
    return e.unload();
  }
}), "signalExitWrap"), At = class extends Ge {
  static {
    o(this, "SignalExitFallback");
  }
  onExit() {
    return () => {
    };
  }
  load() {
  }
  unload() {
  }
}, Rt = class extends Ge {
  static {
    o(this, "SignalExit");
  }
  // "SIGHUP" throws an `ENOSYS` error on Windows,
  // so use a supported signal instead
  /* c8 ignore start */
  #s = _t.platform === "win32" ? "SIGINT" : "SIGHUP";
  /* c8 ignore stop */
  #t = new Ot();
  #e;
  #o;
  #i;
  #n = {};
  #r = !1;
  constructor(t) {
    super(), this.#e = t, this.#n = {};
    for (let r of j)
      this.#n[r] = () => {
        let n = this.#e.listeners(r), { count: i } = this.#t, s = t;
        if (typeof s.__signal_exit_emitter__ == "object" && typeof s.__signal_exit_emitter__.count == "number" && (i += s.__signal_exit_emitter__.
        count), n.length === i) {
          this.unload();
          let a = this.#t.emit("exit", null, r), c = r === "SIGHUP" ? this.#s : r;
          a || t.kill(t.pid, c);
        }
      };
    this.#i = t.reallyExit, this.#o = t.emit;
  }
  onExit(t, r) {
    if (!_e(this.#e))
      return () => {
      };
    this.#r === !1 && this.load();
    let n = r?.alwaysLast ? "afterExit" : "exit";
    return this.#t.on(n, t), () => {
      this.#t.removeListener(n, t), this.#t.listeners.exit.length === 0 && this.#t.listeners.afterExit.length === 0 && this.unload();
    };
  }
  load() {
    if (!this.#r) {
      this.#r = !0, this.#t.count += 1;
      for (let t of j)
        try {
          let r = this.#n[t];
          r && this.#e.on(t, r);
        } catch {
        }
      this.#e.emit = (t, ...r) => this.#c(t, ...r), this.#e.reallyExit = (t) => this.#a(t);
    }
  }
  unload() {
    this.#r && (this.#r = !1, j.forEach((t) => {
      let r = this.#n[t];
      if (!r)
        throw new Error("Listener not defined for signal: " + t);
      try {
        this.#e.removeListener(t, r);
      } catch {
      }
    }), this.#e.emit = this.#o, this.#e.reallyExit = this.#i, this.#t.count -= 1);
  }
  #a(t) {
    return _e(this.#e) ? (this.#e.exitCode = t || 0, this.#t.emit("exit", this.#e.exitCode, null), this.#i.call(this.#e, this.#e.exitCode)) :
    0;
  }
  #c(t, ...r) {
    let n = this.#o;
    if (t === "exit" && _e(this.#e)) {
      typeof r[0] == "number" && (this.#e.exitCode = r[0]);
      let i = n.call(this.#e, t, ...r);
      return this.#t.emit("exit", this.#e.exitCode, null), i;
    } else
      return n.call(this.#e, t, ...r);
  }
}, _t = globalThis.process, {
  /**
   * Called when the process is exiting, whether via signal, explicit
   * exit, or running out of stuff to do.
   *
   * If the global process object is not suitable for instrumentation,
   * then this will be a no-op.
   *
   * Returns a function that may be used to unload signal-exit.
   */
  onExit: So,
  /**
   * Load the listeners.  Likely you never need to call this, unless
   * doing a rather deep integration with signal-exit functionality.
   * Mostly exposed for the benefit of testing.
   *
   * @internal
   */
  load: Qd,
  /**
   * Unload the listeners.  Likely you never need to call this, unless
   * doing a rather deep integration with signal-exit functionality.
   * Mostly exposed for the benefit of testing.
   *
   * @internal
   */
  unload: ep
} = Gc(_e(_t) ? new Rt(_t) : new At());

// node_modules/execa/lib/kill.js
var Nc = 1e3 * 5, wo = /* @__PURE__ */ o((e, t = "SIGTERM", r = {}) => {
  let n = e(t);
  return Bc(e, t, r, n), n;
}, "spawnedKill"), Bc = /* @__PURE__ */ o((e, t, r, n) => {
  if (!Dc(t, r, n))
    return;
  let i = Mc(r), s = setTimeout(() => {
    e("SIGKILL");
  }, i);
  s.unref && s.unref();
}, "setKillTimeout"), Dc = /* @__PURE__ */ o((e, { forceKillAfterTimeout: t }, r) => Lc(e) && t !== !1 && r, "shouldForceKill"), Lc = /* @__PURE__ */ o(
(e) => e === jc.constants.signals.SIGTERM || typeof e == "string" && e.toUpperCase() === "SIGTERM", "isSigterm"), Mc = /* @__PURE__ */ o(({ forceKillAfterTimeout: e = !0 }) => {
  if (e === !0)
    return Nc;
  if (!Number.isFinite(e) || e < 0)
    throw new TypeError(`Expected the \`forceKillAfterTimeout\` option to be a non-negative integer, got \`${e}\` (${typeof e})`);
  return e;
}, "getForceKillAfterTimeout"), vo = /* @__PURE__ */ o((e, t) => {
  e.kill() && (t.isCanceled = !0);
}, "spawnedCancel"), Fc = /* @__PURE__ */ o((e, t, r) => {
  e.kill(t), r(Object.assign(new Error("Timed out"), { timedOut: !0, signal: t }));
}, "timeoutKill"), Po = /* @__PURE__ */ o((e, { timeout: t, killSignal: r = "SIGTERM" }, n) => {
  if (t === 0 || t === void 0)
    return n;
  let i, s = new Promise((c, u) => {
    i = setTimeout(() => {
      Fc(e, r, u);
    }, t);
  }), a = n.finally(() => {
    clearTimeout(i);
  });
  return Promise.race([s, a]);
}, "setupTimeout"), Eo = /* @__PURE__ */ o(({ timeout: e }) => {
  if (e !== void 0 && (!Number.isFinite(e) || e < 0))
    throw new TypeError(`Expected the \`timeout\` option to be a non-negative integer, got \`${e}\` (${typeof e})`);
}, "validateTimeout"), To = /* @__PURE__ */ o(async (e, { cleanup: t, detached: r }, n) => {
  if (!t || r)
    return n;
  let i = So(() => {
    e.kill();
  });
  return n.finally(() => {
    i();
  });
}, "setExitHandler");

// node_modules/execa/lib/pipe.js
import { createWriteStream as Uc } from "node:fs";
import { ChildProcess as $c } from "node:child_process";

// node_modules/is-stream/index.js
function je(e) {
  return e !== null && typeof e == "object" && typeof e.pipe == "function";
}
o(je, "isStream");
function Gt(e) {
  return je(e) && e.writable !== !1 && typeof e._write == "function" && typeof e._writableState == "object";
}
o(Gt, "isWritableStream");

// node_modules/execa/lib/pipe.js
var qc = /* @__PURE__ */ o((e) => e instanceof $c && typeof e.then == "function", "isExecaChildProcess"), jt = /* @__PURE__ */ o((e, t, r) => {
  if (typeof r == "string")
    return e[t].pipe(Uc(r)), e;
  if (Gt(r))
    return e[t].pipe(r), e;
  if (!qc(r))
    throw new TypeError("The second argument must be a string, a stream or an Execa child process.");
  if (!Gt(r.stdin))
    throw new TypeError("The target child process's stdin must be available.");
  return e[t].pipe(r.stdin), r;
}, "pipeToTarget"), Io = /* @__PURE__ */ o((e) => {
  e.stdout !== null && (e.pipeStdout = jt.bind(void 0, e, "stdout")), e.stderr !== null && (e.pipeStderr = jt.bind(void 0, e, "stderr")), e.
  all !== void 0 && (e.pipeAll = jt.bind(void 0, e, "all"));
}, "addPipeMethods");

// node_modules/execa/lib/stream.js
import { createReadStream as au, readFileSync as cu } from "node:fs";
import { setTimeout as uu } from "node:timers/promises";

// node_modules/get-stream/source/contents.js
var te = /* @__PURE__ */ o(async (e, { init: t, convertChunk: r, getSize: n, truncateChunk: i, addChunk: s, getFinalChunk: a, finalize: c }, {
maxBuffer: u = Number.POSITIVE_INFINITY } = {}) => {
  if (!Hc(e))
    throw new Error("The first argument must be a Readable, a ReadableStream, or an async iterable.");
  let l = t();
  l.length = 0;
  try {
    for await (let f of e) {
      let w = Vc(f), g = r[w](f, l);
      Oo({ convertedChunk: g, state: l, getSize: n, truncateChunk: i, addChunk: s, maxBuffer: u });
    }
    return Wc({ state: l, convertChunk: r, getSize: n, truncateChunk: i, addChunk: s, getFinalChunk: a, maxBuffer: u }), c(l);
  } catch (f) {
    throw f.bufferedData = c(l), f;
  }
}, "getStreamContents"), Wc = /* @__PURE__ */ o(({ state: e, getSize: t, truncateChunk: r, addChunk: n, getFinalChunk: i, maxBuffer: s }) => {
  let a = i(e);
  a !== void 0 && Oo({ convertedChunk: a, state: e, getSize: t, truncateChunk: r, addChunk: n, maxBuffer: s });
}, "appendFinalChunk"), Oo = /* @__PURE__ */ o(({ convertedChunk: e, state: t, getSize: r, truncateChunk: n, addChunk: i, maxBuffer: s }) => {
  let a = r(e), c = t.length + a;
  if (c <= s) {
    ko(e, t, i, c);
    return;
  }
  let u = n(e, s - t.length);
  throw u !== void 0 && ko(u, t, i, s), new Ne();
}, "appendChunk"), ko = /* @__PURE__ */ o((e, t, r, n) => {
  t.contents = r(e, t, n), t.length = n;
}, "addNewChunk"), Hc = /* @__PURE__ */ o((e) => typeof e == "object" && e !== null && typeof e[Symbol.asyncIterator] == "function", "isAsyn\
cIterable"), Vc = /* @__PURE__ */ o((e) => {
  let t = typeof e;
  if (t === "string")
    return "string";
  if (t !== "object" || e === null)
    return "others";
  if (globalThis.Buffer?.isBuffer(e))
    return "buffer";
  let r = Co.call(e);
  return r === "[object ArrayBuffer]" ? "arrayBuffer" : r === "[object DataView]" ? "dataView" : Number.isInteger(e.byteLength) && Number.isInteger(
  e.byteOffset) && Co.call(e.buffer) === "[object ArrayBuffer]" ? "typedArray" : "others";
}, "getChunkType"), { toString: Co } = Object.prototype, Ne = class extends Error {
  static {
    o(this, "MaxBufferError");
  }
  name = "MaxBufferError";
  constructor() {
    super("maxBuffer exceeded");
  }
};

// node_modules/get-stream/source/utils.js
var Nt = /* @__PURE__ */ o((e) => e, "identity"), Bt = /* @__PURE__ */ o(() => {
}, "noop"), Dt = /* @__PURE__ */ o(({ contents: e }) => e, "getContentsProp"), Be = /* @__PURE__ */ o((e) => {
  throw new Error(`Streams in object mode are not supported: ${String(e)}`);
}, "throwObjectStream"), De = /* @__PURE__ */ o((e) => e.length, "getLengthProp");

// node_modules/get-stream/source/array-buffer.js
async function Lt(e, t) {
  return te(e, tu, t);
}
o(Lt, "getStreamAsArrayBuffer");
var zc = /* @__PURE__ */ o(() => ({ contents: new ArrayBuffer(0) }), "initArrayBuffer"), Kc = /* @__PURE__ */ o((e) => Jc.encode(e), "useTex\
tEncoder"), Jc = new TextEncoder(), Ao = /* @__PURE__ */ o((e) => new Uint8Array(e), "useUint8Array"), Ro = /* @__PURE__ */ o((e) => new Uint8Array(
e.buffer, e.byteOffset, e.byteLength), "useUint8ArrayWithOffset"), Yc = /* @__PURE__ */ o((e, t) => e.slice(0, t), "truncateArrayBufferChunk"),
Xc = /* @__PURE__ */ o((e, { contents: t, length: r }, n) => {
  let i = jo() ? Qc(t, n) : Zc(t, n);
  return new Uint8Array(i).set(e, r), i;
}, "addArrayBufferChunk"), Zc = /* @__PURE__ */ o((e, t) => {
  if (t <= e.byteLength)
    return e;
  let r = new ArrayBuffer(Go(t));
  return new Uint8Array(r).set(new Uint8Array(e), 0), r;
}, "resizeArrayBufferSlow"), Qc = /* @__PURE__ */ o((e, t) => {
  if (t <= e.maxByteLength)
    return e.resize(t), e;
  let r = new ArrayBuffer(t, { maxByteLength: Go(t) });
  return new Uint8Array(r).set(new Uint8Array(e), 0), r;
}, "resizeArrayBuffer"), Go = /* @__PURE__ */ o((e) => _o ** Math.ceil(Math.log(e) / Math.log(_o)), "getNewContentsLength"), _o = 2, eu = /* @__PURE__ */ o(
({ contents: e, length: t }) => jo() ? e : e.slice(0, t), "finalizeArrayBuffer"), jo = /* @__PURE__ */ o(() => "resize" in ArrayBuffer.prototype,
"hasArrayBufferResize"), tu = {
  init: zc,
  convertChunk: {
    string: Kc,
    buffer: Ao,
    arrayBuffer: Ao,
    dataView: Ro,
    typedArray: Ro,
    others: Be
  },
  getSize: De,
  truncateChunk: Yc,
  addChunk: Xc,
  getFinalChunk: Bt,
  finalize: eu
};

// node_modules/get-stream/source/buffer.js
async function Le(e, t) {
  if (!("Buffer" in globalThis))
    throw new Error("getStreamAsBuffer() is only supported in Node.js");
  try {
    return No(await Lt(e, t));
  } catch (r) {
    throw r.bufferedData !== void 0 && (r.bufferedData = No(r.bufferedData)), r;
  }
}
o(Le, "getStreamAsBuffer");
var No = /* @__PURE__ */ o((e) => globalThis.Buffer.from(e), "arrayBufferToNodeBuffer");

// node_modules/get-stream/source/string.js
async function Mt(e, t) {
  return te(e, su, t);
}
o(Mt, "getStreamAsString");
var ru = /* @__PURE__ */ o(() => ({ contents: "", textDecoder: new TextDecoder() }), "initString"), Me = /* @__PURE__ */ o((e, { textDecoder: t }) => t.
decode(e, { stream: !0 }), "useTextDecoder"), nu = /* @__PURE__ */ o((e, { contents: t }) => t + e, "addStringChunk"), ou = /* @__PURE__ */ o(
(e, t) => e.slice(0, t), "truncateStringChunk"), iu = /* @__PURE__ */ o(({ textDecoder: e }) => {
  let t = e.decode();
  return t === "" ? void 0 : t;
}, "getFinalStringChunk"), su = {
  init: ru,
  convertChunk: {
    string: Nt,
    buffer: Me,
    arrayBuffer: Me,
    dataView: Me,
    typedArray: Me,
    others: Be
  },
  getSize: De,
  truncateChunk: ou,
  addChunk: nu,
  getFinalChunk: iu,
  finalize: Dt
};

// node_modules/execa/lib/stream.js
var Bo = A(mt(), 1);
var Do = /* @__PURE__ */ o((e) => {
  if (e !== void 0)
    throw new TypeError("The `input` and `inputFile` options cannot be both set.");
}, "validateInputOptions"), lu = /* @__PURE__ */ o(({ input: e, inputFile: t }) => typeof t != "string" ? e : (Do(e), cu(t)), "getInputSync"),
Lo = /* @__PURE__ */ o((e) => {
  let t = lu(e);
  if (je(t))
    throw new TypeError("The `input` option cannot be a stream in sync mode");
  return t;
}, "handleInputSync"), fu = /* @__PURE__ */ o(({ input: e, inputFile: t }) => typeof t != "string" ? e : (Do(e), au(t)), "getInput"), Mo = /* @__PURE__ */ o(
(e, t) => {
  let r = fu(t);
  r !== void 0 && (je(r) ? r.pipe(e.stdin) : e.stdin.end(r));
}, "handleInput"), Fo = /* @__PURE__ */ o((e, { all: t }) => {
  if (!t || !e.stdout && !e.stderr)
    return;
  let r = (0, Bo.default)();
  return e.stdout && r.add(e.stdout), e.stderr && r.add(e.stderr), r;
}, "makeAllStream"), Ft = /* @__PURE__ */ o(async (e, t) => {
  if (!(!e || t === void 0)) {
    await uu(0), e.destroy();
    try {
      return await t;
    } catch (r) {
      return r.bufferedData;
    }
  }
}, "getBufferedData"), Ut = /* @__PURE__ */ o((e, { encoding: t, buffer: r, maxBuffer: n }) => {
  if (!(!e || !r))
    return t === "utf8" || t === "utf-8" ? Mt(e, { maxBuffer: n }) : t === null || t === "buffer" ? Le(e, { maxBuffer: n }) : du(e, n, t);
}, "getStreamPromise"), du = /* @__PURE__ */ o(async (e, t, r) => (await Le(e, { maxBuffer: t })).toString(r), "applyEncoding"), Uo = /* @__PURE__ */ o(
async ({ stdout: e, stderr: t, all: r }, { encoding: n, buffer: i, maxBuffer: s }, a) => {
  let c = Ut(e, { encoding: n, buffer: i, maxBuffer: s }), u = Ut(t, { encoding: n, buffer: i, maxBuffer: s }), l = Ut(r, { encoding: n, buffer: i,
  maxBuffer: s * 2 });
  try {
    return await Promise.all([a, c, u, l]);
  } catch (f) {
    return Promise.all([
      { error: f, signal: f.signal, timedOut: f.timedOut },
      Ft(e, c),
      Ft(t, u),
      Ft(r, l)
    ]);
  }
}, "getSpawnedResult");

// node_modules/execa/lib/promise.js
var pu = (async () => {
})().constructor.prototype, mu = ["then", "catch", "finally"].map((e) => [
  e,
  Reflect.getOwnPropertyDescriptor(pu, e)
]), $t = /* @__PURE__ */ o((e, t) => {
  for (let [r, n] of mu) {
    let i = typeof t == "function" ? (...s) => Reflect.apply(n.value, t(), s) : n.value.bind(t);
    Reflect.defineProperty(e, r, { ...n, value: i });
  }
}, "mergePromise"), $o = /* @__PURE__ */ o((e) => new Promise((t, r) => {
  e.on("exit", (n, i) => {
    t({ exitCode: n, signal: i });
  }), e.on("error", (n) => {
    r(n);
  }), e.stdin && e.stdin.on("error", (n) => {
    r(n);
  });
}), "getSpawnedPromise");

// node_modules/execa/lib/command.js
import { Buffer as hu } from "node:buffer";
import { ChildProcess as yu } from "node:child_process";
var Ho = /* @__PURE__ */ o((e, t = []) => Array.isArray(t) ? [e, ...t] : [e], "normalizeArgs"), gu = /^[\w.-]+$/, bu = /* @__PURE__ */ o((e) => typeof e !=
"string" || gu.test(e) ? e : `"${e.replaceAll('"', '\\"')}"`, "escapeArg"), qt = /* @__PURE__ */ o((e, t) => Ho(e, t).join(" "), "joinComman\
d"), Wt = /* @__PURE__ */ o((e, t) => Ho(e, t).map((r) => bu(r)).join(" "), "getEscapedCommand"), Vo = / +/g, zo = /* @__PURE__ */ o((e) => {
  let t = [];
  for (let r of e.trim().split(Vo)) {
    let n = t.at(-1);
    n && n.endsWith("\\") ? t[t.length - 1] = `${n.slice(0, -1)} ${r}` : t.push(r);
  }
  return t;
}, "parseCommand"), qo = /* @__PURE__ */ o((e) => {
  let t = typeof e;
  if (t === "string")
    return e;
  if (t === "number")
    return String(e);
  if (t === "object" && e !== null && !(e instanceof yu) && "stdout" in e) {
    let r = typeof e.stdout;
    if (r === "string")
      return e.stdout;
    if (hu.isBuffer(e.stdout))
      return e.stdout.toString();
    throw new TypeError(`Unexpected "${r}" stdout in template expression`);
  }
  throw new TypeError(`Unexpected "${t}" in template expression`);
}, "parseExpression"), Wo = /* @__PURE__ */ o((e, t, r) => r || e.length === 0 || t.length === 0 ? [...e, ...t] : [
  ...e.slice(0, -1),
  `${e.at(-1)}${t[0]}`,
  ...t.slice(1)
], "concatTokens"), xu = /* @__PURE__ */ o(({ templates: e, expressions: t, tokens: r, index: n, template: i }) => {
  let s = i ?? e.raw[n], a = s.split(Vo).filter(Boolean), c = Wo(
    r,
    a,
    s.startsWith(" ")
  );
  if (n === t.length)
    return c;
  let u = t[n], l = Array.isArray(u) ? u.map((f) => qo(f)) : [qo(u)];
  return Wo(
    c,
    l,
    s.endsWith(" ")
  );
}, "parseTemplate"), Ht = /* @__PURE__ */ o((e, t) => {
  let r = [];
  for (let [n, i] of e.entries())
    r = xu({ templates: e, expressions: t, tokens: r, index: n, template: i });
  return r;
}, "parseTemplates");

// node_modules/execa/lib/verbose.js
import { debuglog as Su } from "node:util";
import wu from "node:process";
var Ko = Su("execa").enabled, Fe = /* @__PURE__ */ o((e, t) => String(e).padStart(t, "0"), "padField"), vu = /* @__PURE__ */ o(() => {
  let e = /* @__PURE__ */ new Date();
  return `${Fe(e.getHours(), 2)}:${Fe(e.getMinutes(), 2)}:${Fe(e.getSeconds(), 2)}.${Fe(e.getMilliseconds(), 3)}`;
}, "getTimestamp"), Vt = /* @__PURE__ */ o((e, { verbose: t }) => {
  t && wu.stderr.write(`[${vu()}] ${e}
`);
}, "logCommand");

// node_modules/execa/index.js
var Tu = 1e3 * 1e3 * 100, Iu = /* @__PURE__ */ o(({ env: e, extendEnv: t, preferLocal: r, localDir: n, execPath: i }) => {
  let s = t ? { ...Ue.env, ...e } : e;
  return r ? fo({ env: s, cwd: n, execPath: i }) : s;
}, "getEnv"), Xo = /* @__PURE__ */ o((e, t, r = {}) => {
  let n = Yo.default._parse(e, t, r);
  return e = n.command, t = n.args, r = n.options, r = {
    maxBuffer: Tu,
    buffer: !0,
    stripFinalNewline: !0,
    extendEnv: !0,
    preferLocal: !1,
    localDir: r.cwd || Ue.cwd(),
    execPath: Ue.execPath,
    encoding: "utf8",
    reject: !0,
    cleanup: !0,
    all: !1,
    windowsHide: !0,
    verbose: Ko,
    ...r
  }, r.env = Iu(r), r.stdio = xo(r), Ue.platform === "win32" && Eu.basename(e, ".exe") === "cmd" && t.unshift("/q"), { file: e, args: t, options: r,
  parsed: n };
}, "handleArguments"), re = /* @__PURE__ */ o((e, t, r) => typeof t != "string" && !Pu.isBuffer(t) ? r === void 0 ? void 0 : "" : e.stripFinalNewline ?
Pt(t) : t, "handleOutput");
function Zo(e, t, r) {
  let n = Xo(e, t, r), i = qt(e, t), s = Wt(e, t);
  Vt(s, n.options), Eo(n.options);
  let a;
  try {
    a = zt.spawn(n.file, n.args, n.options);
  } catch (p) {
    let b = new zt.ChildProcess(), h = Promise.reject(ee({
      error: p,
      stdout: "",
      stderr: "",
      all: "",
      command: i,
      escapedCommand: s,
      parsed: n,
      timedOut: !1,
      isCanceled: !1,
      killed: !1
    }));
    return $t(b, h), b;
  }
  let c = $o(a), u = Po(a, n.options, c), l = To(a, n.options, u), f = { isCanceled: !1 };
  a.kill = wo.bind(null, a.kill.bind(a)), a.cancel = vo.bind(null, a, f);
  let g = mo(/* @__PURE__ */ o(async () => {
    let [{ error: p, exitCode: b, signal: h, timedOut: x }, E, T, C] = await Uo(a, n.options, l), m = re(n.options, E), v = re(n.options, T),
    I = re(n.options, C);
    if (p || b !== 0 || h !== null) {
      let V = ee({
        error: p,
        exitCode: b,
        signal: h,
        stdout: m,
        stderr: v,
        all: I,
        command: i,
        escapedCommand: s,
        parsed: n,
        timedOut: x,
        isCanceled: f.isCanceled || (n.options.signal ? n.options.signal.aborted : !1),
        killed: a.killed
      });
      if (!n.options.reject)
        return V;
      throw V;
    }
    return {
      command: i,
      escapedCommand: s,
      exitCode: 0,
      stdout: m,
      stderr: v,
      all: I,
      failed: !1,
      timedOut: !1,
      isCanceled: !1,
      killed: !1
    };
  }, "handlePromise"));
  return Mo(a, n.options), a.all = Fo(a, n.options), Io(a), $t(a, g), a;
}
o(Zo, "execa");
function ku(e, t, r) {
  let n = Xo(e, t, r), i = qt(e, t), s = Wt(e, t);
  Vt(s, n.options);
  let a = Lo(n.options), c;
  try {
    c = zt.spawnSync(n.file, n.args, { ...n.options, input: a });
  } catch (f) {
    throw ee({
      error: f,
      stdout: "",
      stderr: "",
      all: "",
      command: i,
      escapedCommand: s,
      parsed: n,
      timedOut: !1,
      isCanceled: !1,
      killed: !1
    });
  }
  let u = re(n.options, c.stdout, c.error), l = re(n.options, c.stderr, c.error);
  if (c.error || c.status !== 0 || c.signal !== null) {
    let f = ee({
      stdout: u,
      stderr: l,
      error: c.error,
      signal: c.signal,
      exitCode: c.status,
      command: i,
      escapedCommand: s,
      parsed: n,
      timedOut: c.error && c.error.code === "ETIMEDOUT",
      isCanceled: !1,
      killed: c.signal !== null
    });
    if (!n.options.reject)
      return f;
    throw f;
  }
  return {
    command: i,
    escapedCommand: s,
    exitCode: 0,
    stdout: u,
    stderr: l,
    failed: !1,
    timedOut: !1,
    isCanceled: !1,
    killed: !1
  };
}
o(ku, "execaSync");
var Cu = /* @__PURE__ */ o(({ input: e, inputFile: t, stdio: r }) => e === void 0 && t === void 0 && r === void 0 ? { stdin: "inherit" } : {},
"normalizeScriptStdin"), Jo = /* @__PURE__ */ o((e = {}) => ({
  preferLocal: !0,
  ...Cu(e),
  ...e
}), "normalizeScriptOptions");
function Qo(e) {
  function t(r, ...n) {
    if (!Array.isArray(r))
      return Qo({ ...e, ...r });
    let [i, ...s] = Ht(r, n);
    return Zo(i, s, Jo(e));
  }
  return o(t, "$"), t.sync = (r, ...n) => {
    if (!Array.isArray(r))
      throw new TypeError("Please use $(options).sync`command` instead of $.sync(options)`command`.");
    let [i, ...s] = Ht(r, n);
    return ku(i, s, Jo(e));
  }, t;
}
o(Qo, "create$");
var bm = Qo();
function ei(e, t) {
  let [r, ...n] = zo(e);
  return Zo(r, n, t);
}
o(ei, "execaCommand");

// ../node_modules/slash/index.js
function Kt(e) {
  return e.startsWith("\\\\?\\") ? e : e.replace(/\\/g, "/");
}
o(Kt, "slash");

// src/common/utils/file-cache.ts
import { createHash as ti, randomBytes as Ou } from "node:crypto";
import { mkdirSync as Jt, readFileSync as Au, readdirSync as Ru, rmSync as ri, writeFileSync as _u } from "node:fs";
import { readFile as ni, readdir as oi, rm as ii, writeFile as Gu } from "node:fs/promises";
import { tmpdir as ju } from "node:os";
import { join as ne } from "node:path";
var Yt = class {
  static {
    o(this, "FileSystemCache");
  }
  constructor(t = {}) {
    this.prefix = (t.ns || t.prefix || "") + "-", this.hash_alg = t.hash_alg || "md5", this.cache_dir = t.basePath || ne(ju(), Ou(15).toString(
    "base64").replace(/\//g, "-")), this.ttl = t.ttl || 0, ti(this.hash_alg), Jt(this.cache_dir, { recursive: !0 });
  }
  generateHash(t) {
    return ne(this.cache_dir, this.prefix + ti(this.hash_alg).update(t).digest("hex"));
  }
  isExpired(t, r) {
    return t.ttl != null && r > t.ttl;
  }
  parseCacheData(t, r) {
    let n = JSON.parse(t);
    return this.isExpired(n, Date.now()) ? r : n.content;
  }
  parseSetData(t, r, n = {}) {
    let i = n.ttl ?? this.ttl;
    return JSON.stringify({ key: t, content: r, ...i && { ttl: Date.now() + i * 1e3 } });
  }
  async get(t, r) {
    try {
      let n = await ni(this.generateHash(t), "utf8");
      return this.parseCacheData(n, r);
    } catch {
      return r;
    }
  }
  getSync(t, r) {
    try {
      let n = Au(this.generateHash(t), "utf8");
      return this.parseCacheData(n, r);
    } catch {
      return r;
    }
  }
  async set(t, r, n = {}) {
    let i = typeof n == "number" ? { ttl: n } : n;
    Jt(this.cache_dir, { recursive: !0 }), await Gu(this.generateHash(t), this.parseSetData(t, r, i), {
      encoding: i.encoding || "utf8"
    });
  }
  setSync(t, r, n = {}) {
    let i = typeof n == "number" ? { ttl: n } : n;
    Jt(this.cache_dir, { recursive: !0 }), _u(this.generateHash(t), this.parseSetData(t, r, i), {
      encoding: i.encoding || "utf8"
    });
  }
  async setMany(t, r) {
    await Promise.all(t.map((n) => this.set(n.key, n.content ?? n.value, r)));
  }
  setManySync(t, r) {
    t.forEach((n) => this.setSync(n.key, n.content ?? n.value, r));
  }
  async remove(t) {
    await ii(this.generateHash(t), { force: !0 });
  }
  removeSync(t) {
    ri(this.generateHash(t), { force: !0 });
  }
  async clear() {
    let t = await oi(this.cache_dir);
    await Promise.all(
      t.filter((r) => r.startsWith(this.prefix)).map((r) => ii(ne(this.cache_dir, r), { force: !0 }))
    );
  }
  clearSync() {
    Ru(this.cache_dir).filter((t) => t.startsWith(this.prefix)).forEach((t) => ri(ne(this.cache_dir, t), { force: !0 }));
  }
  async getAll() {
    let t = Date.now(), r = await oi(this.cache_dir);
    return (await Promise.all(
      r.filter((i) => i.startsWith(this.prefix)).map((i) => ni(ne(this.cache_dir, i), "utf8"))
    )).map((i) => JSON.parse(i)).filter((i) => i.content && !this.isExpired(i, t));
  }
  async load() {
    return {
      files: (await this.getAll()).map((r) => ({
        path: this.generateHash(r.key),
        value: r.content,
        key: r.key
      }))
    };
  }
};
function Xt(e) {
  return new Yt(e);
}
o(Xt, "createFileSystemCache");

// src/common/utils/resolve-path-in-sb-cache.ts
import { join as hi } from "node:path";

// ../node_modules/find-cache-dir/index.js
var mi = A(ai(), 1);
import Ku from "node:process";
import oe from "node:path";
import qe from "node:fs";

// ../node_modules/pkg-dir/index.js
import zu from "node:path";

// ../node_modules/pkg-dir/node_modules/find-up/index.js
import $e from "node:path";
import { fileURLToPath as qu } from "node:url";

// ../node_modules/locate-path/index.js
import Du from "node:process";
import Lu from "node:path";
import ci, { promises as Vm } from "node:fs";
import { fileURLToPath as Mu } from "node:url";
var ui = {
  directory: "isDirectory",
  file: "isFile"
};
function Fu(e) {
  if (!Object.hasOwnProperty.call(ui, e))
    throw new Error(`Invalid type specified: ${e}`);
}
o(Fu, "checkType");
var Uu = /* @__PURE__ */ o((e, t) => t[ui[e]](), "matchType"), $u = /* @__PURE__ */ o((e) => e instanceof URL ? Mu(e) : e, "toPath");
function Zt(e, {
  cwd: t = Du.cwd(),
  type: r = "file",
  allowSymlinks: n = !0
} = {}) {
  Fu(r), t = $u(t);
  let i = n ? ci.statSync : ci.lstatSync;
  for (let s of e)
    try {
      let a = i(Lu.resolve(t, s), {
        throwIfNoEntry: !1
      });
      if (!a)
        continue;
      if (Uu(r, a))
        return s;
    } catch {
    }
}
o(Zt, "locatePathSync");

// ../node_modules/pkg-dir/node_modules/path-exists/index.js
import Zm, { promises as Qm } from "node:fs";

// ../node_modules/pkg-dir/node_modules/find-up/index.js
var Wu = /* @__PURE__ */ o((e) => e instanceof URL ? qu(e) : e, "toPath"), Hu = Symbol("findUpStop");
function Vu(e, t = {}) {
  let r = $e.resolve(Wu(t.cwd) || ""), { root: n } = $e.parse(r), i = t.stopAt || n, s = t.limit || Number.POSITIVE_INFINITY, a = [e].flat(),
  c = /* @__PURE__ */ o((l) => {
    if (typeof e != "function")
      return Zt(a, l);
    let f = e(l.cwd);
    return typeof f == "string" ? Zt([f], l) : f;
  }, "runMatcher"), u = [];
  for (; ; ) {
    let l = c({ ...t, cwd: r });
    if (l === Hu || (l && u.push($e.resolve(r, l)), r === i || u.length >= s))
      break;
    r = $e.dirname(r);
  }
  return u;
}
o(Vu, "findUpMultipleSync");
function li(e, t = {}) {
  return Vu(e, { ...t, limit: 1 })[0];
}
o(li, "findUpSync");

// ../node_modules/pkg-dir/index.js
function fi({ cwd: e } = {}) {
  let t = li("package.json", { cwd: e });
  return t && zu.dirname(t);
}
o(fi, "packageDirectorySync");

// ../node_modules/find-cache-dir/index.js
var { env: Qt, cwd: Ju } = Ku, di = /* @__PURE__ */ o((e) => {
  try {
    return qe.accessSync(e, qe.constants.W_OK), !0;
  } catch {
    return !1;
  }
}, "isWritable");
function pi(e, t) {
  return t.create && qe.mkdirSync(e, { recursive: !0 }), e;
}
o(pi, "useDirectory");
function Yu(e) {
  let t = oe.join(e, "node_modules");
  if (!(!di(t) && (qe.existsSync(t) || !di(oe.join(e)))))
    return t;
}
o(Yu, "getNodeModuleDirectory");
function er(e = {}) {
  if (Qt.CACHE_DIR && !["true", "false", "1", "0"].includes(Qt.CACHE_DIR))
    return pi(oe.join(Qt.CACHE_DIR, e.name), e);
  let { cwd: t = Ju(), files: r } = e;
  if (r) {
    if (!Array.isArray(r))
      throw new TypeError(`Expected \`files\` option to be an array, got \`${typeof r}\`.`);
    t = (0, mi.default)(r.map((i) => oe.resolve(t, i)));
  }
  if (t = fi({ cwd: t }), !(!t || !Yu(t)))
    return pi(oe.join(t, "node_modules", ".cache", e.name), e);
}
o(er, "findCacheDirectory");

// src/common/utils/resolve-path-in-sb-cache.ts
function yi(e, t = "default") {
  let r = er({ name: "storybook" });
  return r ||= hi(process.cwd(), ".cache", "storybook"), hi(r, t, e);
}
o(yi, "resolvePathInStorybookCache");

// src/telemetry/get-portable-stories-usage.ts
var gi = Xt({
  basePath: yi("portable-stories"),
  ns: "storybook",
  ttl: 24 * 60 * 60 * 1e3
  // 24h
}), Xu = /* @__PURE__ */ o(async (e) => {
  let t = "git grep -l composeStor" + (e ? ` -- ${e}` : ""), { stdout: r } = await ei(t, {
    cwd: process.cwd(),
    shell: !0
  });
  return r.split(`
`).filter(Boolean).length;
}, "getPortableStoriesFileCountUncached"), bi = "portableStories", xi = /* @__PURE__ */ o(async (e) => {
  let t = await gi.get(bi);
  if (!t)
    try {
      t = { count: await Xu() }, await gi.set(bi, t);
    } catch (r) {
      t = { count: r.exitCode === 1 ? 0 : null };
    }
  return t.count;
}, "getPortableStoriesFileCount");

// src/telemetry/storybook-metadata.ts
var Si = {
  next: "Next",
  "react-scripts": "CRA",
  gatsby: "Gatsby",
  "@nuxtjs/storybook": "nuxt",
  "@nrwl/storybook": "nx",
  "@vue/cli-service": "vue-cli",
  "@sveltejs/kit": "sveltekit"
}, wi = /* @__PURE__ */ o((e) => z(e).replace(/\/dist\/.*/, "").replace(/\.[mc]?[tj]?s[x]?$/, "").replace(/\/register$/, "").replace(/\/manager$/,
"").replace(/\/preset$/, ""), "sanitizeAddonName"), nl = /* @__PURE__ */ o(async ({
  packageJson: e,
  mainConfig: t
}) => {
  let r = {
    generatedAt: (/* @__PURE__ */ new Date()).getTime(),
    hasCustomBabel: !1,
    hasCustomWebpack: !1,
    hasStaticDirs: !1,
    hasStorybookEslint: !1,
    refCount: 0
  }, n = {
    ...e?.dependencies,
    ...e?.devDependencies,
    ...e?.peerDependencies
  }, i = Object.keys(n).find((m) => !!Si[m]);
  if (i) {
    let { version: m } = await ke(i);
    r.metaFramework = {
      name: Si[i],
      packageName: i,
      version: m
    };
  }
  let s = [
    "playwright",
    "vitest",
    "jest",
    "cypress",
    "nightwatch",
    "webdriver",
    "@web/test-runner",
    "puppeteer",
    "karma",
    "jasmine",
    "chai",
    "testing-library",
    "@ngneat/spectator",
    "wdio",
    "msw",
    "miragejs",
    "sinon"
  ], a = Object.keys(n).filter(
    (m) => s.find((v) => m.includes(v))
  );
  r.testPackages = Object.fromEntries(
    await Promise.all(
      a.map(async (m) => [m, (await ke(m))?.version])
    )
  );
  let c = lo();
  c && (r.monorepo = c);
  try {
    let m = await (0, He.detect)({ cwd: Zu() }), v = await (0, He.getNpmVersion)(m);
    r.packageManager = {
      type: m,
      version: v
    };
  } catch {
  }
  r.hasCustomBabel = !!t.babel, r.hasCustomWebpack = !!t.webpackFinal, r.hasStaticDirs = !!t.staticDirs, typeof t.typescript == "object" && (r.
  typescriptOptions = t.typescript);
  let u = await ao(t);
  typeof t.refs == "object" && (r.refCount = Object.keys(t.refs).length), typeof t.features == "object" && (r.features = t.features);
  let l = {};
  t.addons && t.addons.forEach((m) => {
    let v, I;
    typeof m == "string" ? v = wi(m) : (m.name.includes("addon-essentials") && (I = m.options), v = wi(m.name)), l[v] = {
      options: I,
      version: void 0
    };
  });
  let f = io(e);
  f && (l.chromatic = {
    version: void 0,
    versionSpecifier: f,
    options: void 0
  }), (await St(l)).forEach(({ name: m, version: v }) => {
    l[m].version = v;
  });
  let g = Object.keys(l), p = Object.keys(n).filter((m) => m.includes("storybook") && !g.includes(m)).reduce((m, v) => ({
    ...m,
    [v]: { version: void 0 }
  }), {});
  (await St(p)).forEach(({ name: m, version: v }) => {
    p[m].version = v;
  });
  let h = n.typescript ? "typescript" : "javascript", x = !!n["eslint-plugin-storybook"], E = el(e);
  try {
    let { previewConfig: m } = E;
    if (m) {
      let v = await rl(m), I = !!(v.getFieldNode(["globals"]) || v.getFieldNode(["globalTypes"]));
      r.preview = { ...r.preview, usesGlobals: I };
    }
  } catch {
  }
  let T = p[E.frameworkPackage]?.version, C = await xi();
  return {
    ...r,
    ...u,
    portableStoriesFileCount: C,
    storybookVersion: T,
    storybookVersionSpecifier: E.version,
    language: h,
    storybookPackages: p,
    addons: l,
    hasStorybookEslint: x
  };
}, "computeStorybookMetadata"), We, vi = /* @__PURE__ */ o(async (e) => {
  if (We)
    return We;
  let t = await oo(process.cwd()) || {}, r = (e || Qu(
    String(t?.scripts?.storybook || ""),
    "-c",
    "--config-dir"
  )) ?? ".storybook", n = await tl({ configDir: r });
  return We = await nl({ mainConfig: n, packageJson: t }), We;
}, "getStorybookMetadata");

// src/telemetry/telemetry.ts
var Gi = A(Ei(), 1);
import * as _i from "node:os";

// ../node_modules/nanoid/index.js
import { randomFillSync as Ii } from "crypto";

// ../node_modules/nanoid/url-alphabet/index.js
var Ti = "useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict";

// ../node_modules/nanoid/index.js
var ol = 128, N, H, il = /* @__PURE__ */ o((e) => {
  !N || N.length < e ? (N = Buffer.allocUnsafe(e * ol), Ii(N), H = 0) : H + e > N.length && (Ii(N), H = 0), H += e;
}, "fillPool");
var ie = /* @__PURE__ */ o((e = 21) => {
  il(e -= 0);
  let t = "";
  for (let r = H - e; r < H; r++)
    t += Ti[N[r] & 63];
  return t;
}, "nanoid");

// src/telemetry/anonymous-id.ts
import { relative as al } from "node:path";
import { getProjectRoot as cl } from "@storybook/core/common";
import { execSync as ul } from "child_process";

// src/telemetry/one-way-hash.ts
import { createHash as sl } from "crypto";
var tr = /* @__PURE__ */ o((e) => {
  let t = sl("sha256");
  return t.update("storybook-telemetry-salt"), t.update(e), t.digest("hex");
}, "oneWayHash");

// src/telemetry/anonymous-id.ts
function ll(e) {
  let n = e.trim().replace(/#.*$/, "").replace(/^.*@/, "").replace(/^.*\/\//, "");
  return (n.endsWith(".git") ? n : `${n}.git`).replace(":", "/");
}
o(ll, "normalizeGitUrl");
function fl(e, t) {
  return `${ll(e)}${Kt(t)}`;
}
o(fl, "unhashedProjectId");
var ze, ki = /* @__PURE__ */ o(() => {
  if (ze)
    return ze;
  try {
    let e = cl(), t = al(e, process.cwd()), r = ul("git config --local --get remote.origin.url", {
      timeout: 1e3,
      stdio: "pipe"
    });
    ze = tr(fl(String(r), t));
  } catch {
  }
  return ze;
}, "getAnonymousProjectId");

// src/telemetry/event-cache.ts
import { cache as nr } from "@storybook/core/common";
var rr = Promise.resolve(), dl = /* @__PURE__ */ o(async (e, t) => {
  let r = await nr.get("lastEvents") || {};
  r[e] = { body: t, timestamp: Date.now() }, await nr.set("lastEvents", r);
}, "setHelper"), Oi = /* @__PURE__ */ o(async (e, t) => (await rr, rr = dl(e, t), rr), "set");
var pl = /* @__PURE__ */ o((e) => {
  let { body: t, timestamp: r } = e;
  return {
    timestamp: r,
    eventType: t?.eventType,
    eventId: t?.eventId,
    sessionId: t?.sessionId
  };
}, "upgradeFields"), ml = ["init", "upgrade"], hl = ["build", "dev", "error"], Ci = /* @__PURE__ */ o((e, t) => {
  let r = t.map((n) => e?.[n]).filter(Boolean).sort((n, i) => i.timestamp - n.timestamp);
  return r.length > 0 ? r[0] : void 0;
}, "lastEvent"), yl = /* @__PURE__ */ o(async (e = void 0) => {
  let t = e || await nr.get("lastEvents") || {}, r = Ci(t, ml), n = Ci(t, hl);
  if (r)
    return !n?.timestamp || r.timestamp > n.timestamp ? pl(r) : void 0;
}, "getPrecedingUpgrade");

// src/telemetry/fetch.ts
var Ai = global.fetch;

// src/telemetry/session-id.ts
import { cache as Ri } from "@storybook/core/common";
var gl = 1e3 * 60 * 60 * 2, se;
var or = /* @__PURE__ */ o(async () => {
  let e = Date.now();
  if (!se) {
    let t = await Ri.get("session");
    t && t.lastUsed >= e - gl ? se = t.id : se = ie();
  }
  return await Ri.set("session", { id: se, lastUsed: e }), se;
}, "getSessionId");

// src/telemetry/telemetry.ts
var bl = (0, Gi.default)(Ai), xl = process.env.STORYBOOK_TELEMETRY_URL || "https://storybook.js.org/event-log", Ke = [], Sl = /* @__PURE__ */ o(
(e, t) => {
  ir[e] = t;
}, "addToGlobalContext"), wl = /* @__PURE__ */ o(() => {
  try {
    let e = _i.platform();
    return e === "win32" ? "Windows" : e === "darwin" ? "macOS" : e === "linux" ? "Linux" : `Other: ${e}`;
  } catch {
    return "Unknown";
  }
}, "getOperatingSystem"), ir = {
  inCI: !!process.env.CI,
  isTTY: process.stdout.isTTY,
  platform: wl(),
  nodeVersion: process.versions.node
}, vl = /* @__PURE__ */ o(async (e, t, r) => {
  let { eventType: n, payload: i, metadata: s, ...a } = e, c = await or(), u = ie(), l = { ...a, eventType: n, eventId: u, sessionId: c, metadata: s,
  payload: i, context: t };
  return bl(xl, {
    method: "post",
    body: JSON.stringify(l),
    headers: { "Content-Type": "application/json" },
    retries: 3,
    retryOn: [503, 504],
    retryDelay: /* @__PURE__ */ o((f) => 2 ** f * (typeof r?.retryDelay == "number" && !Number.isNaN(r?.retryDelay) ? r.retryDelay : 1e3), "\
retryDelay")
  });
}, "prepareRequest");
async function ji(e, t = { retryDelay: 1e3, immediate: !1 }) {
  let { eventType: r, payload: n, metadata: i, ...s } = e, a = t.stripMetadata ? ir : {
    ...ir,
    anonymousId: ki()
  }, c;
  try {
    c = vl(e, a, t), Ke.push(c), t.immediate ? await Promise.all(Ke) : await c;
    let u = await or(), l = ie(), f = { ...s, eventType: r, eventId: l, sessionId: u, metadata: i, payload: n, context: a };
    await Oi(r, f);
  } catch {
  } finally {
    Ke = Ke.filter((u) => u !== c);
  }
}
o(ji, "sendTelemetry");

// src/telemetry/index.ts
var fg = /* @__PURE__ */ o((e) => e.startsWith("example-button--") || e.startsWith("example-header--") || e.startsWith("example-page--"), "i\
sExampleStoryId"), dg = /* @__PURE__ */ o(async (e, t = {}, r = {}) => {
  e !== "boot" && await fr();
  let n = {
    eventType: e,
    payload: t
  };
  try {
    r?.stripMetadata || (n.metadata = await vi(r?.configDir));
  } catch (i) {
    n.payload.metadataErrorMessage = ue(i).message, r?.enableCrashReports && (n.payload.metadataError = ue(i));
  } finally {
    let { error: i } = n.payload;
    i && (n.payload.error = ue(i)), (!n.payload.error || r?.enableCrashReports) && (process.env?.STORYBOOK_TELEMETRY_DEBUG && (Ni.info(`
[telemetry]`), Ni.info(JSON.stringify(n, null, 2))), await ji(n, r));
  }
}, "telemetry");
export {
  Sl as addToGlobalContext,
  nl as computeStorybookMetadata,
  yl as getPrecedingUpgrade,
  vi as getStorybookMetadata,
  fg as isExampleStoryId,
  Si as metaFrameworks,
  tr as oneWayHash,
  wi as sanitizeAddonName,
  dg as telemetry
};
