var Ar = Object.create;
var Ae = Object.defineProperty;
var Pr = Object.getOwnPropertyDescriptor;
var _r = Object.getOwnPropertyNames;
var br = Object.getPrototypeOf, Mr = Object.prototype.hasOwnProperty;
var n = (e, t) => Ae(e, "name", { value: t, configurable: !0 }), fe = /* @__PURE__ */ ((e) => typeof require < "u" ? require : typeof Proxy <
"u" ? new Proxy(e, {
  get: (t, r) => (typeof require < "u" ? require : t)[r]
}) : e)(function(e) {
  if (typeof require < "u") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + e + '" is not supported');
});
var jt = (e, t) => () => (t || e((t = { exports: {} }).exports, t), t.exports), L = (e, t) => {
  for (var r in t)
    Ae(e, r, { get: t[r], enumerable: !0 });
}, Cr = (e, t, r, a) => {
  if (t && typeof t == "object" || typeof t == "function")
    for (let o of _r(t))
      !Mr.call(e, o) && o !== r && Ae(e, o, { get: () => t[o], enumerable: !(a = Pr(t, o)) || a.enumerable });
  return e;
};
var Pe = (e, t, r) => (r = e != null ? Ar(br(e)) : {}, Cr(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  t || !e || !e.__esModule ? Ae(r, "default", { value: e, enumerable: !0 }) : r,
  e
));

// ../node_modules/memoizerific/memoizerific.js
var ze = jt((E0, ot) => {
  (function(e) {
    if (typeof E0 == "object" && typeof ot < "u")
      ot.exports = e();
    else if (typeof define == "function" && define.amd)
      define([], e);
    else {
      var t;
      typeof window < "u" ? t = window : typeof global < "u" ? t = global : typeof self < "u" ? t = self : t = this, t.memoizerific = e();
    }
  })(function() {
    var e, t, r;
    return (/* @__PURE__ */ n(function a(o, i, s) {
      function l(h, u) {
        if (!i[h]) {
          if (!o[h]) {
            var p = typeof fe == "function" && fe;
            if (!u && p) return p(h, !0);
            if (c) return c(h, !0);
            var v = new Error("Cannot find module '" + h + "'");
            throw v.code = "MODULE_NOT_FOUND", v;
          }
          var g = i[h] = { exports: {} };
          o[h][0].call(g.exports, function(m) {
            var w = o[h][1][m];
            return l(w || m);
          }, g, g.exports, a, o, i, s);
        }
        return i[h].exports;
      }
      n(l, "s");
      for (var c = typeof fe == "function" && fe, d = 0; d < s.length; d++) l(s[d]);
      return l;
    }, "e"))({ 1: [function(a, o, i) {
      o.exports = function(s) {
        if (typeof Map != "function" || s) {
          var l = a("./similar");
          return new l();
        } else
          return /* @__PURE__ */ new Map();
      };
    }, { "./similar": 2 }], 2: [function(a, o, i) {
      function s() {
        return this.list = [], this.lastItem = void 0, this.size = 0, this;
      }
      n(s, "Similar"), s.prototype.get = function(l) {
        var c;
        if (this.lastItem && this.isEqual(this.lastItem.key, l))
          return this.lastItem.val;
        if (c = this.indexOf(l), c >= 0)
          return this.lastItem = this.list[c], this.list[c].val;
      }, s.prototype.set = function(l, c) {
        var d;
        return this.lastItem && this.isEqual(this.lastItem.key, l) ? (this.lastItem.val = c, this) : (d = this.indexOf(l), d >= 0 ? (this.lastItem =
        this.list[d], this.list[d].val = c, this) : (this.lastItem = { key: l, val: c }, this.list.push(this.lastItem), this.size++, this));
      }, s.prototype.delete = function(l) {
        var c;
        if (this.lastItem && this.isEqual(this.lastItem.key, l) && (this.lastItem = void 0), c = this.indexOf(l), c >= 0)
          return this.size--, this.list.splice(c, 1)[0];
      }, s.prototype.has = function(l) {
        var c;
        return this.lastItem && this.isEqual(this.lastItem.key, l) ? !0 : (c = this.indexOf(l), c >= 0 ? (this.lastItem = this.list[c], !0) :
        !1);
      }, s.prototype.forEach = function(l, c) {
        var d;
        for (d = 0; d < this.size; d++)
          l.call(c || this, this.list[d].val, this.list[d].key, this);
      }, s.prototype.indexOf = function(l) {
        var c;
        for (c = 0; c < this.size; c++)
          if (this.isEqual(this.list[c].key, l))
            return c;
        return -1;
      }, s.prototype.isEqual = function(l, c) {
        return l === c || l !== l && c !== c;
      }, o.exports = s;
    }, {}], 3: [function(a, o, i) {
      var s = a("map-or-similar");
      o.exports = function(h) {
        var u = new s(!1), p = [];
        return function(v) {
          var g = /* @__PURE__ */ n(function() {
            var m = u, w, y, R = arguments.length - 1, x = Array(R + 1), E = !0, I;
            if ((g.numArgs || g.numArgs === 0) && g.numArgs !== R + 1)
              throw new Error("Memoizerific functions should always be called with the same number of arguments");
            for (I = 0; I < R; I++) {
              if (x[I] = {
                cacheItem: m,
                arg: arguments[I]
              }, m.has(arguments[I])) {
                m = m.get(arguments[I]);
                continue;
              }
              E = !1, w = new s(!1), m.set(arguments[I], w), m = w;
            }
            return E && (m.has(arguments[R]) ? y = m.get(arguments[R]) : E = !1), E || (y = v.apply(null, arguments), m.set(arguments[R], y)),
            h > 0 && (x[R] = {
              cacheItem: m,
              arg: arguments[R]
            }, E ? l(p, x) : p.push(x), p.length > h && c(p.shift())), g.wasMemoized = E, g.numArgs = R + 1, y;
          }, "memoizerific");
          return g.limit = h, g.wasMemoized = !1, g.cache = u, g.lru = p, g;
        };
      };
      function l(h, u) {
        var p = h.length, v = u.length, g, m, w;
        for (m = 0; m < p; m++) {
          for (g = !0, w = 0; w < v; w++)
            if (!d(h[m][w].arg, u[w].arg)) {
              g = !1;
              break;
            }
          if (g)
            break;
        }
        h.push(h.splice(m, 1)[0]);
      }
      n(l, "moveToMostRecentLru");
      function c(h) {
        var u = h.length, p = h[u - 1], v, g;
        for (p.cacheItem.delete(p.arg), g = u - 2; g >= 0 && (p = h[g], v = p.cacheItem.get(p.arg), !v || !v.size); g--)
          p.cacheItem.delete(p.arg);
      }
      n(c, "removeCachedResult");
      function d(h, u) {
        return h === u || h !== h && u !== u;
      }
      n(d, "isEqual");
    }, { "map-or-similar": 1 }] }, {}, [3])(3);
  });
});

// ../node_modules/store2/dist/store2.js
var K0 = jt((Be, Ve) => {
  (function(e, t) {
    var r = {
      version: "2.14.2",
      areas: {},
      apis: {},
      nsdelim: ".",
      // utilities
      inherit: /* @__PURE__ */ n(function(o, i) {
        for (var s in o)
          i.hasOwnProperty(s) || Object.defineProperty(i, s, Object.getOwnPropertyDescriptor(o, s));
        return i;
      }, "inherit"),
      stringify: /* @__PURE__ */ n(function(o, i) {
        return o === void 0 || typeof o == "function" ? o + "" : JSON.stringify(o, i || r.replace);
      }, "stringify"),
      parse: /* @__PURE__ */ n(function(o, i) {
        try {
          return JSON.parse(o, i || r.revive);
        } catch {
          return o;
        }
      }, "parse"),
      // extension hooks
      fn: /* @__PURE__ */ n(function(o, i) {
        r.storeAPI[o] = i;
        for (var s in r.apis)
          r.apis[s][o] = i;
      }, "fn"),
      get: /* @__PURE__ */ n(function(o, i) {
        return o.getItem(i);
      }, "get"),
      set: /* @__PURE__ */ n(function(o, i, s) {
        o.setItem(i, s);
      }, "set"),
      remove: /* @__PURE__ */ n(function(o, i) {
        o.removeItem(i);
      }, "remove"),
      key: /* @__PURE__ */ n(function(o, i) {
        return o.key(i);
      }, "key"),
      length: /* @__PURE__ */ n(function(o) {
        return o.length;
      }, "length"),
      clear: /* @__PURE__ */ n(function(o) {
        o.clear();
      }, "clear"),
      // core functions
      Store: /* @__PURE__ */ n(function(o, i, s) {
        var l = r.inherit(r.storeAPI, function(d, h, u) {
          return arguments.length === 0 ? l.getAll() : typeof h == "function" ? l.transact(d, h, u) : h !== void 0 ? l.set(d, h, u) : typeof d ==
          "string" || typeof d == "number" ? l.get(d) : typeof d == "function" ? l.each(d) : d ? l.setAll(d, h) : l.clear();
        });
        l._id = o;
        try {
          var c = "__store2_test";
          i.setItem(c, "ok"), l._area = i, i.removeItem(c);
        } catch {
          l._area = r.storage("fake");
        }
        return l._ns = s || "", r.areas[o] || (r.areas[o] = l._area), r.apis[l._ns + l._id] || (r.apis[l._ns + l._id] = l), l;
      }, "Store"),
      storeAPI: {
        // admin functions
        area: /* @__PURE__ */ n(function(o, i) {
          var s = this[o];
          return (!s || !s.area) && (s = r.Store(o, i, this._ns), this[o] || (this[o] = s)), s;
        }, "area"),
        namespace: /* @__PURE__ */ n(function(o, i, s) {
          if (s = s || this._delim || r.nsdelim, !o)
            return this._ns ? this._ns.substring(0, this._ns.length - s.length) : "";
          var l = o, c = this[l];
          if ((!c || !c.namespace) && (c = r.Store(this._id, this._area, this._ns + l + s), c._delim = s, this[l] || (this[l] = c), !i))
            for (var d in r.areas)
              c.area(d, r.areas[d]);
          return c;
        }, "namespace"),
        isFake: /* @__PURE__ */ n(function(o) {
          return o ? (this._real = this._area, this._area = r.storage("fake")) : o === !1 && (this._area = this._real || this._area), this._area.
          name === "fake";
        }, "isFake"),
        toString: /* @__PURE__ */ n(function() {
          return "store" + (this._ns ? "." + this.namespace() : "") + "[" + this._id + "]";
        }, "toString"),
        // storage functions
        has: /* @__PURE__ */ n(function(o) {
          return this._area.has ? this._area.has(this._in(o)) : this._in(o) in this._area;
        }, "has"),
        size: /* @__PURE__ */ n(function() {
          return this.keys().length;
        }, "size"),
        each: /* @__PURE__ */ n(function(o, i) {
          for (var s = 0, l = r.length(this._area); s < l; s++) {
            var c = this._out(r.key(this._area, s));
            if (c !== void 0 && o.call(this, c, this.get(c), i) === !1)
              break;
            l > r.length(this._area) && (l--, s--);
          }
          return i || this;
        }, "each"),
        keys: /* @__PURE__ */ n(function(o) {
          return this.each(function(i, s, l) {
            l.push(i);
          }, o || []);
        }, "keys"),
        get: /* @__PURE__ */ n(function(o, i) {
          var s = r.get(this._area, this._in(o)), l;
          return typeof i == "function" && (l = i, i = null), s !== null ? r.parse(s, l) : i ?? s;
        }, "get"),
        getAll: /* @__PURE__ */ n(function(o) {
          return this.each(function(i, s, l) {
            l[i] = s;
          }, o || {});
        }, "getAll"),
        transact: /* @__PURE__ */ n(function(o, i, s) {
          var l = this.get(o, s), c = i(l);
          return this.set(o, c === void 0 ? l : c), this;
        }, "transact"),
        set: /* @__PURE__ */ n(function(o, i, s) {
          var l = this.get(o), c;
          return l != null && s === !1 ? i : (typeof s == "function" && (c = s, s = void 0), r.set(this._area, this._in(o), r.stringify(i, c),
          s) || l);
        }, "set"),
        setAll: /* @__PURE__ */ n(function(o, i) {
          var s, l;
          for (var c in o)
            l = o[c], this.set(c, l, i) !== l && (s = !0);
          return s;
        }, "setAll"),
        add: /* @__PURE__ */ n(function(o, i, s) {
          var l = this.get(o);
          if (l instanceof Array)
            i = l.concat(i);
          else if (l !== null) {
            var c = typeof l;
            if (c === typeof i && c === "object") {
              for (var d in i)
                l[d] = i[d];
              i = l;
            } else
              i = l + i;
          }
          return r.set(this._area, this._in(o), r.stringify(i, s)), i;
        }, "add"),
        remove: /* @__PURE__ */ n(function(o, i) {
          var s = this.get(o, i);
          return r.remove(this._area, this._in(o)), s;
        }, "remove"),
        clear: /* @__PURE__ */ n(function() {
          return this._ns ? this.each(function(o) {
            r.remove(this._area, this._in(o));
          }, 1) : r.clear(this._area), this;
        }, "clear"),
        clearAll: /* @__PURE__ */ n(function() {
          var o = this._area;
          for (var i in r.areas)
            r.areas.hasOwnProperty(i) && (this._area = r.areas[i], this.clear());
          return this._area = o, this;
        }, "clearAll"),
        // internal use functions
        _in: /* @__PURE__ */ n(function(o) {
          return typeof o != "string" && (o = r.stringify(o)), this._ns ? this._ns + o : o;
        }, "_in"),
        _out: /* @__PURE__ */ n(function(o) {
          return this._ns ? o && o.indexOf(this._ns) === 0 ? o.substring(this._ns.length) : void 0 : (
            // so each() knows to skip it
            o
          );
        }, "_out")
      },
      // end _.storeAPI
      storage: /* @__PURE__ */ n(function(o) {
        return r.inherit(r.storageAPI, { items: {}, name: o });
      }, "storage"),
      storageAPI: {
        length: 0,
        has: /* @__PURE__ */ n(function(o) {
          return this.items.hasOwnProperty(o);
        }, "has"),
        key: /* @__PURE__ */ n(function(o) {
          var i = 0;
          for (var s in this.items)
            if (this.has(s) && o === i++)
              return s;
        }, "key"),
        setItem: /* @__PURE__ */ n(function(o, i) {
          this.has(o) || this.length++, this.items[o] = i;
        }, "setItem"),
        removeItem: /* @__PURE__ */ n(function(o) {
          this.has(o) && (delete this.items[o], this.length--);
        }, "removeItem"),
        getItem: /* @__PURE__ */ n(function(o) {
          return this.has(o) ? this.items[o] : null;
        }, "getItem"),
        clear: /* @__PURE__ */ n(function() {
          for (var o in this.items)
            this.removeItem(o);
        }, "clear")
      }
      // end _.storageAPI
    }, a = (
      // safely set this up (throws error in IE10/32bit mode for local files)
      r.Store("local", function() {
        try {
          return localStorage;
        } catch {
        }
      }())
    );
    a.local = a, a._ = r, a.area("session", function() {
      try {
        return sessionStorage;
      } catch {
      }
    }()), a.area("page", r.storage("page")), typeof t == "function" && t.amd !== void 0 ? t("store2", [], function() {
      return a;
    }) : typeof Ve < "u" && Ve.exports ? Ve.exports = a : (e.store && (r.conflict = e.store), e.store = a);
  })(Be, Be && Be.define);
});

// src/manager-api/root.tsx
import le, {
  Component as Ko,
  Fragment as qo,
  useCallback as wr,
  useContext as Ft,
  useEffect as Ir,
  useMemo as Nt,
  useRef as yr
} from "react";
import { deprecate as kt } from "@storybook/core/client-logger";
import {
  SET_STORIES as Yo,
  SHARED_STATE_CHANGED as Rr,
  SHARED_STATE_SET as ye,
  STORY_CHANGED as Qo
} from "@storybook/core/core-events";

// src/manager-api/context.ts
import { createContext as zr } from "react";
var Ut = /* @__PURE__ */ n(({ api: e, state: t }) => zr({ api: e, state: t }), "createContext");

// src/manager-api/lib/merge.ts
import { logger as g0 } from "@storybook/core/client-logger";

// ../node_modules/es-toolkit/dist/array/countBy.mjs
function We(e, t) {
  let r = {};
  for (let a = 0; a < e.length; a++) {
    let o = e[a], i = t(o);
    r[i] = (r[i] ?? 0) + 1;
  }
  return r;
}
n(We, "countBy");

// ../node_modules/es-toolkit/dist/array/partition.mjs
function _e(e, t) {
  let r = [], a = [];
  for (let o = 0; o < e.length; o++) {
    let i = e[o];
    t(i) ? r.push(i) : a.push(i);
  }
  return [r, a];
}
n(_e, "partition");

// ../node_modules/es-toolkit/dist/object/pick.mjs
function q(e, t) {
  let r = {};
  for (let a = 0; a < t.length; a++) {
    let o = t[a];
    Object.prototype.hasOwnProperty.call(e, o) && (r[o] = e[o]);
  }
  return r;
}
n(q, "pick");

// ../node_modules/es-toolkit/dist/predicate/isTypedArray.mjs
function Gt(e) {
  return ArrayBuffer.isView(e) && !(e instanceof DataView);
}
n(Gt, "isTypedArray");

// ../node_modules/es-toolkit/dist/predicate/isPrimitive.mjs
function $t(e) {
  return e == null || typeof e != "object" && typeof e != "function";
}
n($t, "isPrimitive");

// ../node_modules/es-toolkit/dist/predicate/isPlainObject.mjs
function Ke(e) {
  if (typeof e != "object" || e == null)
    return !1;
  if (Object.getPrototypeOf(e) === null)
    return !0;
  if (e.toString() !== "[object Object]")
    return !1;
  let t = e;
  for (; Object.getPrototypeOf(t) !== null; )
    t = Object.getPrototypeOf(t);
  return Object.getPrototypeOf(e) === t;
}
n(Ke, "isPlainObject");

// ../node_modules/es-toolkit/dist/object/mapValues.mjs
function qe(e, t) {
  let r = {}, a = Object.keys(e);
  for (let o = 0; o < a.length; o++) {
    let i = a[o], s = e[i];
    r[i] = t(s, i, e);
  }
  return r;
}
n(qe, "mapValues");

// ../node_modules/es-toolkit/dist/object/cloneDeep.mjs
function Wt(e) {
  return J(e);
}
n(Wt, "cloneDeep");
function J(e, t = /* @__PURE__ */ new Map()) {
  if ($t(e))
    return e;
  if (t.has(e))
    return t.get(e);
  if (Array.isArray(e)) {
    let r = new Array(e.length);
    t.set(e, r);
    for (let a = 0; a < e.length; a++)
      r[a] = J(e[a], t);
    return Object.prototype.hasOwnProperty.call(e, "index") && (r.index = e.index), Object.prototype.hasOwnProperty.call(e, "input") && (r.input =
    e.input), r;
  }
  if (e instanceof Date)
    return new Date(e.getTime());
  if (e instanceof RegExp) {
    let r = new RegExp(e.source, e.flags);
    return r.lastIndex = e.lastIndex, r;
  }
  if (e instanceof Map) {
    let r = /* @__PURE__ */ new Map();
    t.set(e, r);
    for (let [a, o] of e.entries())
      r.set(a, J(o, t));
    return r;
  }
  if (e instanceof Set) {
    let r = /* @__PURE__ */ new Set();
    t.set(e, r);
    for (let a of e.values())
      r.add(J(a, t));
    return r;
  }
  if (typeof Buffer < "u" && Buffer.isBuffer(e))
    return e.subarray();
  if (Gt(e)) {
    let r = new (Object.getPrototypeOf(e)).constructor(e.length);
    t.set(e, r);
    for (let a = 0; a < e.length; a++)
      r[a] = J(e[a], t);
    return r;
  }
  if (e instanceof ArrayBuffer || typeof SharedArrayBuffer < "u" && e instanceof SharedArrayBuffer)
    return e.slice(0);
  if (e instanceof DataView) {
    let r = new DataView(e.buffer.slice(0), e.byteOffset, e.byteLength);
    return t.set(e, r), de(r, e, t), r;
  }
  if (typeof File < "u" && e instanceof File) {
    let r = new File([e], e.name, { type: e.type });
    return t.set(e, r), de(r, e, t), r;
  }
  if (e instanceof Blob) {
    let r = new Blob([e], { type: e.type });
    return t.set(e, r), de(r, e, t), r;
  }
  if (e instanceof Error) {
    let r = new e.constructor();
    return t.set(e, r), r.message = e.message, r.name = e.name, r.stack = e.stack, r.cause = e.cause, de(r, e, t), r;
  }
  if (typeof e == "object" && e !== null) {
    let r = {};
    return t.set(e, r), de(r, e, t), r;
  }
  return e;
}
n(J, "cloneDeepImpl");
function de(e, t, r) {
  let a = Object.keys(t);
  for (let o = 0; o < a.length; o++) {
    let i = a[o], s = Object.getOwnPropertyDescriptor(t, i);
    (s?.writable || s?.set) && (e[i] = J(t[i], r));
  }
}
n(de, "copyProperties");

// ../node_modules/es-toolkit/dist/compat/predicate/isObjectLike.mjs
function Z(e) {
  return typeof e == "object" && e !== null;
}
n(Z, "isObjectLike");

// ../node_modules/es-toolkit/dist/object/merge.mjs
function be(e, t) {
  let r = Object.keys(t);
  for (let a = 0; a < r.length; a++) {
    let o = r[a], i = t[o], s = e[o];
    Array.isArray(i) ? e[o] = be(s ?? [], i) : Z(s) && Z(i) ? e[o] = be(s ?? {}, i) : (s === void 0 || i !== void 0) && (e[o] = i);
  }
  return e;
}
n(be, "merge");

// ../node_modules/es-toolkit/dist/object/toMerged.mjs
function he(e, t) {
  return be(Wt(e), t);
}
n(he, "toMerged");

// ../node_modules/es-toolkit/dist/object/mergeWith.mjs
function W(e, t, r) {
  let a = Object.keys(t);
  for (let o = 0; o < a.length; o++) {
    let i = a[o], s = t[i], l = e[i], c = r(l, s, i, e, t);
    c != null ? e[i] = c : Array.isArray(s) ? e[i] = W(l ?? [], s, r) : Z(l) && Z(s) ? e[i] = W(l ?? {}, s, r) : (l === void 0 || s !== void 0) &&
    (e[i] = s);
  }
  return e;
}
n(W, "mergeWith");

// ../node_modules/es-toolkit/dist/compat/_internal/tags.mjs
var Kt = "[object RegExp]", qt = "[object String]", Yt = "[object Number]", Qt = "[object Boolean]", Ye = "[object Arguments]", Jt = "[objec\
t Symbol]", Zt = "[object Date]", Xt = "[object Map]", e0 = "[object Set]", t0 = "[object Array]", r0 = "[object Function]", a0 = "[object A\
rrayBuffer]", Me = "[object Object]", n0 = "[object Error]", o0 = "[object DataView]", l0 = "[object Uint8Array]", i0 = "[object Uint8Clampe\
dArray]", c0 = "[object Uint16Array]", s0 = "[object Uint32Array]", f0 = "[object BigUint64Array]", d0 = "[object Int8Array]", h0 = "[object\
 Int16Array]", u0 = "[object Int32Array]", p0 = "[object BigInt64Array]", v0 = "[object Float32Array]", m0 = "[object Float64Array]";

// ../node_modules/es-toolkit/dist/compat/_internal/getSymbols.mjs
function Qe(e) {
  return Object.getOwnPropertySymbols(e).filter((t) => Object.prototype.propertyIsEnumerable.call(e, t));
}
n(Qe, "getSymbols");

// ../node_modules/es-toolkit/dist/compat/_internal/getTag.mjs
function Je(e) {
  return e == null ? e === void 0 ? "[object Undefined]" : "[object Null]" : Object.prototype.toString.call(e);
}
n(Je, "getTag");

// ../node_modules/es-toolkit/dist/predicate/isEqual.mjs
function $(e, t) {
  if (typeof e == typeof t)
    switch (typeof e) {
      case "bigint":
      case "string":
      case "boolean":
      case "symbol":
      case "undefined":
        return e === t;
      case "number":
        return e === t || Object.is(e, t);
      case "function":
        return e === t;
      case "object":
        return G(e, t);
    }
  return G(e, t);
}
n($, "isEqual");
function G(e, t, r) {
  if (Object.is(e, t))
    return !0;
  let a = Je(e), o = Je(t);
  if (a === Ye && (a = Me), o === Ye && (o = Me), a !== o)
    return !1;
  switch (a) {
    case qt:
      return e.toString() === t.toString();
    case Yt: {
      let l = e.valueOf(), c = t.valueOf();
      return l === c || Number.isNaN(l) && Number.isNaN(c);
    }
    case Qt:
    case Zt:
    case Jt:
      return Object.is(e.valueOf(), t.valueOf());
    case Kt:
      return e.source === t.source && e.flags === t.flags;
    case r0:
      return e === t;
  }
  r = r ?? /* @__PURE__ */ new Map();
  let i = r.get(e), s = r.get(t);
  if (i != null && s != null)
    return i === t;
  r.set(e, t), r.set(t, e);
  try {
    switch (a) {
      case Xt: {
        if (e.size !== t.size)
          return !1;
        for (let [l, c] of e.entries())
          if (!t.has(l) || !G(c, t.get(l), r))
            return !1;
        return !0;
      }
      case e0: {
        if (e.size !== t.size)
          return !1;
        let l = Array.from(e.values()), c = Array.from(t.values());
        for (let d = 0; d < l.length; d++) {
          let h = l[d], u = c.findIndex((p) => G(h, p, r));
          if (u === -1)
            return !1;
          c.splice(u, 1);
        }
        return !0;
      }
      case t0:
      case l0:
      case i0:
      case c0:
      case s0:
      case f0:
      case d0:
      case h0:
      case u0:
      case p0:
      case v0:
      case m0: {
        if (typeof Buffer < "u" && Buffer.isBuffer(e) !== Buffer.isBuffer(t) || e.length !== t.length)
          return !1;
        for (let l = 0; l < e.length; l++)
          if (!G(e[l], t[l], r))
            return !1;
        return !0;
      }
      case a0:
        return e.byteLength !== t.byteLength ? !1 : G(new Uint8Array(e), new Uint8Array(t), r);
      case o0:
        return e.byteLength !== t.byteLength || e.byteOffset !== t.byteOffset ? !1 : G(e.buffer, t.buffer, r);
      case n0:
        return e.name === t.name && e.message === t.message;
      case Me: {
        if (!(G(e.constructor, t.constructor, r) || Ke(e) && Ke(t)))
          return !1;
        let c = [...Object.keys(e), ...Qe(e)], d = [...Object.keys(t), ...Qe(t)];
        if (c.length !== d.length)
          return !1;
        for (let h = 0; h < c.length; h++) {
          let u = c[h], p = e[u];
          if (!Object.prototype.hasOwnProperty.call(t, u))
            return !1;
          let v = t[u];
          if (!G(p, v, r))
            return !1;
        }
        return !0;
      }
      default:
        return !1;
    }
  } finally {
    r.delete(e), r.delete(t);
  }
}
n(G, "areObjectsEqual");

// src/manager-api/lib/merge.ts
var F = /* @__PURE__ */ n((e, ...t) => {
  let r = {};
  r = W({}, e, (a, o) => {
    if (Array.isArray(o) && Array.isArray(a))
      return o.forEach((i) => {
        a.find((l) => l === i || $(l, i)) || a.push(i);
      }), a;
    if (Array.isArray(a))
      return g0.log(["the types mismatch, picking", a]), a;
  });
  for (let a of t)
    r = W(r, a, (o, i) => {
      if (Array.isArray(i) && Array.isArray(o))
        return i.forEach((s) => {
          o.find((c) => c === s || $(c, s)) || o.push(s);
        }), o;
      if (Array.isArray(o))
        return g0.log(["the types mismatch, picking", o]), o;
    });
  return r;
}, "default"), w0 = /* @__PURE__ */ n((e, ...t) => {
  let r = {};
  r = W({}, e, (a, o) => {
    if (Array.isArray(o))
      return o;
  });
  for (let a of t)
    r = W(r, a, (o, i) => {
      if (Array.isArray(i))
        return i;
    });
  return r;
}, "noArrayMerge");

// src/manager-api/initial-state.ts
var Hr = /* @__PURE__ */ n((...e) => e.reduce((t, r) => F(t, r), {}), "main"), Ce = Hr;

// src/manager-api/lib/addons.ts
import { Addon_TypesEnum as R0 } from "@storybook/core/types";

// ../node_modules/@storybook/global/dist/index.mjs
var A = (() => {
  let e;
  return typeof window < "u" ? e = window : typeof globalThis < "u" ? e = globalThis : typeof global < "u" ? e = global : typeof self < "u" ?
  e = self : e = {}, e;
})();

// src/manager-api/lib/addons.ts
import { logger as Or } from "@storybook/core/client-logger";
import { SET_CONFIG as y0 } from "@storybook/core/core-events";

// src/manager-api/lib/storybook-channel-mock.ts
import { Channel as Lr } from "@storybook/core/channels";
function Ze() {
  let e = {
    setHandler: /* @__PURE__ */ n(() => {
    }, "setHandler"),
    send: /* @__PURE__ */ n(() => {
    }, "send")
  };
  return new Lr({ transport: e });
}
n(Ze, "mockChannel");

// src/manager-api/lib/addons.ts
var tt = class tt {
  constructor() {
    this.loaders = {};
    this.elements = {};
    this.config = {};
    this.getChannel = /* @__PURE__ */ n(() => (this.channel || this.setChannel(Ze()), this.channel), "getChannel");
    this.ready = /* @__PURE__ */ n(() => this.promise, "ready");
    this.hasChannel = /* @__PURE__ */ n(() => !!this.channel, "hasChannel");
    this.setChannel = /* @__PURE__ */ n((t) => {
      this.channel = t, this.resolve();
    }, "setChannel");
    this.setConfig = /* @__PURE__ */ n((t) => {
      Object.assign(this.config, t), this.hasChannel() ? this.getChannel().emit(y0, this.config) : this.ready().then((r) => {
        r.emit(y0, this.config);
      });
    }, "setConfig");
    this.getConfig = /* @__PURE__ */ n(() => this.config, "getConfig");
    /**
     * Registers an addon loader function.
     *
     * @param {string} id - The id of the addon loader.
     * @param {(api: API) => void} callback - The function that will be called to register the addon.
     * @returns {void}
     */
    this.register = /* @__PURE__ */ n((t, r) => {
      this.loaders[t] && Or.warn(`${t} was loaded twice, this could have bad side-effects`), this.loaders[t] = r;
    }, "register");
    this.loadAddons = /* @__PURE__ */ n((t) => {
      Object.values(this.loaders).forEach((r) => r(t));
    }, "loadAddons");
    this.promise = new Promise((t) => {
      this.resolve = () => t(this.getChannel());
    });
  }
  getElements(t) {
    return this.elements[t] || (this.elements[t] = {}), this.elements[t];
  }
  /**
   * Adds an addon to the addon store.
   *
   * @param {string} id - The id of the addon.
   * @param {Addon_Type} addon - The addon to add.
   * @returns {void}
   */
  add(t, r) {
    let { type: a } = r, o = this.getElements(a);
    o[t] = { ...r, id: t };
  }
};
n(tt, "AddonStore");
var et = tt, Xe = "__STORYBOOK_ADDONS_MANAGER";
function Tr() {
  return A[Xe] || (A[Xe] = new et()), A[Xe];
}
n(Tr, "getAddonsStore");
var Br = Tr();

// src/manager-api/modules/addons.ts
var at = {};
L(at, {
  ensurePanel: () => rt,
  init: () => Vr
});
import { Addon_TypesEnum as S0 } from "@storybook/core/types";
function rt(e, t, r) {
  let a = Object.keys(e);
  return a.indexOf(t) >= 0 ? t : a.length ? a[0] : r;
}
n(rt, "ensurePanel");
var Vr = /* @__PURE__ */ n(({ provider: e, store: t, fullAPI: r }) => {
  let a = {
    getElements: /* @__PURE__ */ n((o) => e.getElements(o), "getElements"),
    getSelectedPanel: /* @__PURE__ */ n(() => {
      let { selectedPanel: o } = t.getState();
      return rt(a.getElements(S0.PANEL), o, o);
    }, "getSelectedPanel"),
    setSelectedPanel: /* @__PURE__ */ n((o) => {
      t.setState({ selectedPanel: o }, { persistence: "session" });
    }, "setSelectedPanel"),
    setAddonState(o, i, s) {
      let l = typeof i == "function" ? i : () => i;
      return t.setState(
        (c) => ({ ...c, addons: { ...c.addons, [o]: l(c.addons[o]) } }),
        s
      ).then(() => a.getAddonState(o));
    },
    getAddonState: /* @__PURE__ */ n((o) => t.getState().addons[o] || globalThis?.STORYBOOK_ADDON_STATE[o], "getAddonState")
  };
  return {
    api: a,
    state: {
      selectedPanel: rt(
        a.getElements(S0.PANEL),
        t.getState().selectedPanel
      ),
      addons: {}
    }
  };
}, "init");

// src/manager-api/modules/channel.ts
var nt = {};
L(nt, {
  init: () => Dr
});
var Dr = /* @__PURE__ */ n(({ provider: e }) => ({ api: {
  getChannel: /* @__PURE__ */ n(() => e.channel, "getChannel"),
  on: /* @__PURE__ */ n((r, a) => (e.channel?.on(r, a), () => e.channel?.off(r, a)), "on"),
  off: /* @__PURE__ */ n((r, a) => e.channel?.off(r, a), "off"),
  once: /* @__PURE__ */ n((r, a) => e.channel?.once(r, a), "once"),
  emit: /* @__PURE__ */ n((r, a, ...o) => {
    a?.options?.target && a.options.target !== "storybook-preview-iframe" && !a.options.target.startsWith("storybook-ref-") && (a.options.target =
    a.options.target !== "storybook_internal" ? `storybook-ref-${a.options.target}` : "storybook-preview-iframe"), e.channel?.emit(r, a, ...o);
  }, "emit")
}, state: {} }), "init");

// src/manager-api/modules/globals.ts
var st = {};
L(st, {
  init: () => Xr
});
import { logger as T0 } from "@storybook/core/client-logger";
import { GLOBALS_UPDATED as Qr, SET_GLOBALS as Jr, UPDATE_GLOBALS as Zr } from "@storybook/core/core-events";

// ../node_modules/dequal/dist/index.mjs
var I0 = Object.prototype.hasOwnProperty;
function x0(e, t, r) {
  for (r of e.keys())
    if (B(r, t)) return r;
}
n(x0, "find");
function B(e, t) {
  var r, a, o;
  if (e === t) return !0;
  if (e && t && (r = e.constructor) === t.constructor) {
    if (r === Date) return e.getTime() === t.getTime();
    if (r === RegExp) return e.toString() === t.toString();
    if (r === Array) {
      if ((a = e.length) === t.length)
        for (; a-- && B(e[a], t[a]); ) ;
      return a === -1;
    }
    if (r === Set) {
      if (e.size !== t.size)
        return !1;
      for (a of e)
        if (o = a, o && typeof o == "object" && (o = x0(t, o), !o) || !t.has(o)) return !1;
      return !0;
    }
    if (r === Map) {
      if (e.size !== t.size)
        return !1;
      for (a of e)
        if (o = a[0], o && typeof o == "object" && (o = x0(t, o), !o) || !B(a[1], t.get(o)))
          return !1;
      return !0;
    }
    if (r === ArrayBuffer)
      e = new Uint8Array(e), t = new Uint8Array(t);
    else if (r === DataView) {
      if ((a = e.byteLength) === t.byteLength)
        for (; a-- && e.getInt8(a) === t.getInt8(a); ) ;
      return a === -1;
    }
    if (ArrayBuffer.isView(e)) {
      if ((a = e.byteLength) === t.byteLength)
        for (; a-- && e[a] === t[a]; ) ;
      return a === -1;
    }
    if (!r || typeof e == "object") {
      a = 0;
      for (r in e)
        if (I0.call(e, r) && ++a && !I0.call(t, r) || !(r in t) || !B(e[r], t[r])) return !1;
      return Object.keys(t).length === a;
    }
  }
  return e !== e && t !== t;
}
n(B, "dequal");

// src/manager-api/lib/events.ts
import { logger as Yr } from "@storybook/core/client-logger";

// src/manager-api/modules/refs.ts
var ct = {};
L(ct, {
  defaultStoryMapper: () => O0,
  getSourceType: () => it,
  init: () => qr
});

// ../node_modules/ts-dedent/esm/index.js
function ue(e) {
  for (var t = [], r = 1; r < arguments.length; r++)
    t[r - 1] = arguments[r];
  var a = Array.from(typeof e == "string" ? [e] : e);
  a[a.length - 1] = a[a.length - 1].replace(/\r?\n([\t ]*)$/, "");
  var o = a.reduce(function(l, c) {
    var d = c.match(/\n([\t ]+|(?!\s).)/g);
    return d ? l.concat(d.map(function(h) {
      var u, p;
      return (p = (u = h.match(/[\t ]/g)) === null || u === void 0 ? void 0 : u.length) !== null && p !== void 0 ? p : 0;
    })) : l;
  }, []);
  if (o.length) {
    var i = new RegExp(`
[	 ]{` + Math.min.apply(Math, o) + "}", "g");
    a = a.map(function(l) {
      return l.replace(i, `
`);
    });
  }
  a[0] = a[0].replace(/^\r?\n/, "");
  var s = a[0];
  return t.forEach(function(l, c) {
    var d = s.match(/(?:^|\n)( *)$/), h = d ? d[1] : "", u = l;
    typeof l == "string" && l.includes(`
`) && (u = String(l).split(`
`).map(function(p, v) {
      return v === 0 ? p : "" + h + p;
    }).join(`
`)), s += u + a[c + 1];
  }), s;
}
n(ue, "dedent");

// src/manager-api/lib/stories.ts
import { sanitize as kr } from "@storybook/csf";
var lt = Pe(ze(), 1);

// src/manager-api/lib/intersect.ts
var A0 = /* @__PURE__ */ n((e, t) => !e || !t ? [] : e.reduce((r, a) => (t.includes(a) && r.push(a), r), []), "default");

// src/manager-api/lib/stories.ts
var Nr = /\s*\/\s*/, P0 = /* @__PURE__ */ n(({
  globalParameters: e,
  kindParameters: t,
  stories: r
}) => qe(r, (a) => ({
  ...a,
  parameters: z0(
    e,
    t[a.kind],
    a.parameters
  )
})), "denormalizeStoryParameters");
var _0 = /* @__PURE__ */ n((e) => ({ v: 5, entries: Object.entries(e).reduce(
  (r, [a, o]) => {
    if (!o)
      return r;
    let { docsOnly: i, fileName: s, ...l } = o.parameters, c = {
      title: o.kind,
      id: a,
      name: o.name,
      importPath: s
    };
    if (i)
      r[a] = {
        type: "docs",
        tags: ["stories-mdx"],
        storiesImports: [],
        ...c
      };
    else {
      let { argTypes: d, args: h, initialArgs: u } = o;
      r[a] = {
        type: "story",
        ...c,
        parameters: l,
        argTypes: d,
        args: h,
        initialArgs: u
      };
    }
    return r;
  },
  {}
) }), "transformSetStoriesStoryDataToPreparedStoryIndex"), Fr = /* @__PURE__ */ n((e) => ({
  v: 3,
  stories: Object.values(e.stories).reduce(
    (t, r) => (t[r.id] = {
      ...r,
      title: r.kind,
      name: r.name || r.story,
      importPath: r.parameters.fileName || ""
    }, t),
    {}
  )
}), "transformStoryIndexV2toV3"), jr = /* @__PURE__ */ n((e) => {
  let t = We(Object.values(e.stories), (r) => r.title);
  return {
    v: 4,
    entries: Object.values(e.stories).reduce(
      (r, a) => {
        let o = "story";
        return (a.parameters?.docsOnly || a.name === "Page" && t[a.title] === 1) && (o = "docs"), r[a.id] = {
          type: o,
          ...o === "docs" && { tags: ["stories-mdx"], storiesImports: [] },
          ...a
        }, delete r[a.id].story, delete r[a.id].kind, r;
      },
      {}
    )
  };
}, "transformStoryIndexV3toV4"), Ur = /* @__PURE__ */ n((e) => ({
  v: 5,
  entries: Object.values(e.entries).reduce(
    (t, r) => (t[r.id] = {
      ...r,
      tags: r.tags ? ["dev", "test", ...r.tags] : ["dev"]
    }, t),
    {}
  )
}), "transformStoryIndexV4toV5"), He = /* @__PURE__ */ n((e, { provider: t, docsOptions: r, filters: a, status: o }) => {
  if (!e.v)
    throw new Error("Composition: Missing stories.json version");
  let i = e;
  i = i.v === 2 ? Fr(i) : i, i = i.v === 3 ? jr(i) : i, i = i.v === 4 ? Ur(i) : i, i = i;
  let s = Object.values(i.entries).filter((m) => {
    let w = !0;
    return Object.values(a).forEach((y) => {
      w !== !1 && (w = y({ ...m, status: o[m.id] }));
    }), w;
  }), { sidebar: l = {} } = t.getConfig(), { showRoots: c, collapsedRoots: d = [], renderLabel: h } = l, u = typeof c < "u", p = s.reduce((m, w) => {
    if (r.docsMode && w.type !== "docs")
      return m;
    let { title: y } = w, R = y.trim().split(Nr), x = (!u || c) && R.length > 1 ? [R.shift()] : [], E = [...x, ...R], I = E.reduce((S, b, k) => {
      let ie = k > 0 && S[k - 1], ce = kr(ie ? `${ie}-${b}` : b);
      if (b.trim() === "")
        throw new Error(ue`Invalid title ${y} ending in slash.`);
      if (ie === ce)
        throw new Error(
          ue`
          Invalid part '${b}', leading to id === parentId ('${ce}'), inside title '${y}'
          
          Did you create a path that uses the separator char accidentally, such as 'Vue <docs/>' where '/' is a separator char? See https://github.com/storybookjs/storybook/issues/6128
          `
        );
      return S.push(ce), S;
    }, []);
    return I.forEach((S, b) => {
      let k = I[b + 1] || w.id;
      x.length && b === 0 ? m[S] = F(m[S] || {}, {
        type: "root",
        id: S,
        name: E[b],
        depth: b,
        renderLabel: h,
        startCollapsed: d.includes(S),
        // Note that this will later get appended to the previous list of children (see below)
        children: [k]
      }) : (!m[S] || m[S].type === "component") && b === I.length - 1 ? (m[S] = F(m[S] || {}, {
        type: "component",
        id: S,
        name: E[b],
        parent: I[b - 1],
        depth: b,
        renderLabel: h,
        ...k && {
          children: [k]
        }
      }), m[S].tags = A0(m[S]?.tags ?? w.tags, w.tags)) : m[S] = F(m[S] || {}, {
        type: "group",
        id: S,
        name: E[b],
        parent: I[b - 1],
        depth: b,
        renderLabel: h,
        ...k && {
          children: [k]
        }
      });
    }), m[w.id] = {
      type: "story",
      ...w,
      depth: I.length,
      parent: I[I.length - 1],
      renderLabel: h,
      prepared: !!w.parameters
    }, m;
  }, {});
  function v(m, w) {
    return m[w.id] || (m[w.id] = w, (w.type === "root" || w.type === "group" || w.type === "component") && w.children.forEach((y) => v(m, p[y]))),
    m;
  }
  n(v, "addItem");
  let g = Object.values(p).filter((m) => m.type !== "root" && !m.parent).reduce(v, {});
  return Object.values(p).filter((m) => m.type === "root").reduce(v, g);
}, "transformStoryIndexToStoriesHash"), b0 = /* @__PURE__ */ n((e, t) => t ? Object.fromEntries(
  Object.entries(e).map(([r, a]) => {
    let o = t[r];
    return a.type === "story" && o?.type === "story" && o.prepared ? [r, { ...o, ...a, prepared: !0 }] : [r, a];
  })
) : e, "addPreparedStories"), M0 = (0, lt.default)(1)((e) => Object.entries(e).reduce((t, r) => {
  let a = r[1];
  return a.type === "component" && t.push([...a.children]), t;
}, [])), C0 = (0, lt.default)(1)((e) => Object.keys(e).filter((t) => ["story", "docs"].includes(e[t].type)));

// src/manager-api/modules/refs.ts
var { location: Gr, fetch: H0 } = A, it = /* @__PURE__ */ n((e, t) => {
  let { origin: r, pathname: a } = Gr, { origin: o, pathname: i } = new URL(e), s = `${r + a}`.replace("/iframe.html", "").replace(/\/$/, ""),
  l = `${o + i}`.replace("/iframe.html", "").replace(/\/$/, "");
  return s === l ? ["local", l] : t || e ? ["external", l] : [null, null];
}, "getSourceType"), O0 = /* @__PURE__ */ n((e, t) => ({ ...t, kind: t.kind.replace("|", "/") }), "defaultStoryMapper"), $r = /* @__PURE__ */ n(
(e, t) => Object.entries(e).reduce((r, [a, o]) => ({ ...r, [a]: { ...o, refId: t.id } }), {}), "addRefIds");
async function L0(e) {
  if (!e)
    return {};
  try {
    let t = await e;
    if (t === !1 || t === !0)
      throw new Error("Unexpected boolean response");
    if (!t.ok)
      throw new Error(`Unexpected response not OK: ${t.statusText}`);
    let r = await t.json();
    return r.entries || r.stories ? { storyIndex: r } : r;
  } catch (t) {
    return { indexError: t };
  }
}
n(L0, "handleRequest");
var Wr = /* @__PURE__ */ n((e) => {
  let t = /https?:\/\/(.+:.+)@/, r = e, a, [, o] = e.match(t) || [];
  return o && (r = e.replace(`${o}@`, ""), a = btoa(`${o}`)), {
    url: r,
    authorization: a
  };
}, "parseUrl"), Kr = /* @__PURE__ */ n((e, t, r) => {
  let { storyMapper: a } = r;
  return a ? Object.entries(e).reduce((o, [i, s]) => ({ ...o, [i]: a(t, s) }), {}) : e;
}, "map"), qr = /* @__PURE__ */ n(({ store: e, provider: t, singleStory: r, docsOptions: a = {} }, { runCheck: o = !0 } = {}) => {
  let i = {
    findRef: /* @__PURE__ */ n((c) => {
      let d = i.getRefs();
      return Object.values(d).find(({ url: h }) => h.match(c));
    }, "findRef"),
    changeRefVersion: /* @__PURE__ */ n(async (c, d) => {
      let { versions: h, title: u } = i.getRefs()[c], p = { id: c, url: d, versions: h, title: u, index: {}, expanded: !0 };
      await i.setRef(c, { ...p, type: "unknown" }, !1), await i.checkRef(p);
    }, "changeRefVersion"),
    changeRefState: /* @__PURE__ */ n((c, d) => {
      let { [c]: h, ...u } = i.getRefs();
      u[c] = { ...h, previewInitialized: d }, e.setState({
        refs: u
      });
    }, "changeRefState"),
    checkRef: /* @__PURE__ */ n(async (c) => {
      let { id: d, url: h, version: u, type: p } = c, v = p === "server-checked", g = {}, m = u ? `?version=${u}` : "", w = v ? "omit" : "in\
clude", y = Wr(h), R = {
        Accept: "application/json"
      };
      y.authorization && Object.assign(R, {
        Authorization: `Basic ${y.authorization}`
      });
      let [x, E] = await Promise.all(
        ["index.json", "stories.json"].map(
          async (S) => L0(
            H0(`${y.url}/${S}${m}`, {
              headers: R,
              credentials: w
            })
          )
        )
      );
      if (!x.indexError || !E.indexError) {
        let S = await L0(
          H0(`${y.url}/metadata.json${m}`, {
            headers: R,
            credentials: w,
            cache: "no-cache"
          }).catch(() => !1)
        );
        Object.assign(g, {
          ...x.indexError ? E : x,
          ...!S.indexError && S
        });
      } else v || (g.indexError = {
        message: ue`
            Error: Loading of ref failed
              at fetch (lib/api/src/modules/refs.ts)

            URL: ${y.url}

            We weren't able to load the above URL,
            it's possible a CORS error happened.

            Please check your dev-tools network tab.
          `
      });
      let I = c.versions && Object.keys(c.versions).length ? c.versions : g.versions;
      await i.setRef(d, {
        id: d,
        url: y.url,
        ...g,
        ...I ? { versions: I } : {},
        type: g.storyIndex ? "lazy" : "auto-inject"
      });
    }, "checkRef"),
    getRefs: /* @__PURE__ */ n(() => {
      let { refs: c = {} } = e.getState();
      return c;
    }, "getRefs"),
    setRef: /* @__PURE__ */ n(async (c, { storyIndex: d, setStoriesData: h, ...u }, p = !1) => {
      if (r)
        return;
      let v, g, { filters: m } = e.getState(), { storyMapper: w = O0 } = t.getConfig(), y = i.getRefs()[c];
      (d || h) && (v = h ? _0(
        Kr(h, y, { storyMapper: w })
      ) : d, g = He(d, {
        provider: t,
        docsOptions: a,
        filters: m,
        status: {}
      })), g && (g = $r(g, y)), await i.updateRef(c, { ...y, ...u, index: g, internal_index: v });
    }, "setRef"),
    updateRef: /* @__PURE__ */ n(async (c, d) => {
      let { [c]: h, ...u } = i.getRefs();
      u[c] = { ...h, ...d };
      let p = Object.keys(l).reduce((v, g) => (v[g] = u[g], v), {});
      await e.setState({
        refs: p
      });
    }, "updateRef")
  }, s = !r && A.REFS || {}, l = s;
  return o && new Promise(async (c) => {
    for (let d of Object.values(s))
      await i.checkRef({ ...d, stories: {} });
    c(void 0);
  }), {
    api: i,
    state: {
      refs: l
    }
  };
}, "init");

// src/manager-api/lib/events.ts
var z = /* @__PURE__ */ n((e, t) => {
  let { source: r, refId: a, type: o } = e, [i, s] = it(r, a), l;
  (a || i === "external") && (l = a && t.getRefs()[a] ? t.getRefs()[a] : t.findRef(s));
  let c = {
    source: r,
    sourceType: i,
    sourceLocation: s,
    refId: a,
    ref: l,
    type: o
  };
  switch (!0) {
    case typeof a == "string":
    case i === "local":
    case i === "external":
      return c;
    // if we couldn't find the source, something risky happened, we ignore the input, and log a warning
    default:
      return Yr.warn(`Received a ${o} frame that was not configured as a ref`), null;
  }
}, "getEventMetadata");

// src/manager-api/modules/globals.ts
var Xr = /* @__PURE__ */ n(({ store: e, fullAPI: t, provider: r }) => {
  let a = {
    getGlobals() {
      return e.getState().globals;
    },
    getUserGlobals() {
      return e.getState().userGlobals;
    },
    getStoryGlobals() {
      return e.getState().storyGlobals;
    },
    getGlobalTypes() {
      return e.getState().globalTypes;
    },
    updateGlobals(s) {
      r.channel?.emit(Zr, {
        globals: s,
        options: {
          target: "storybook-preview-iframe"
        }
      });
    }
  }, o = {
    globals: {},
    userGlobals: {},
    storyGlobals: {},
    globalTypes: {}
  }, i = /* @__PURE__ */ n(({
    globals: s,
    storyGlobals: l,
    userGlobals: c
  }) => {
    let {
      globals: d,
      userGlobals: h,
      storyGlobals: u
    } = e.getState();
    B(s, d) || e.setState({ globals: s }), B(c, h) || e.setState({ userGlobals: c }), B(l, u) || e.setState({ storyGlobals: l });
  }, "updateGlobals");
  return r.channel?.on(
    Qr,
    /* @__PURE__ */ n(function({ globals: l, storyGlobals: c, userGlobals: d }) {
      let { ref: h } = z(this, t);
      h ? T0.warn(
        "received a GLOBALS_UPDATED from a non-local ref. This is not currently supported."
      ) : i({ globals: l, storyGlobals: c, userGlobals: d });
    }, "handleGlobalsUpdated")
  ), r.channel?.on(
    Jr,
    /* @__PURE__ */ n(function({ globals: l, globalTypes: c }) {
      let { ref: d } = z(this, t), h = e.getState()?.globals;
      d ? Object.keys(l).length > 0 && T0.warn("received globals from a non-local ref. This is not currently supported.") : e.setState({ globals: l,
      userGlobals: l, globalTypes: c }), h && Object.keys(h).length !== 0 && !B(l, h) && a.updateGlobals(h);
    }, "handleSetGlobals")
  ), {
    api: a,
    state: o
  };
}, "init");

// src/manager-api/modules/layout.ts
var Oe = {};
L(Oe, {
  ActiveTabs: () => V0,
  defaultLayoutState: () => O,
  focusableUIElements: () => pe,
  init: () => aa
});
import { create as ea } from "@storybook/core/theming/create";
import { SET_CONFIG as ta } from "@storybook/core/core-events";
var { document: ra } = A, V0 = {
  SIDEBAR: "sidebar",
  CANVAS: "canvas",
  ADDONS: "addons"
}, O = {
  ui: {
    enableShortcuts: !0
  },
  layout: {
    initialActive: V0.CANVAS,
    showToolbar: !0,
    navSize: 300,
    bottomPanelHeight: 300,
    rightPanelWidth: 400,
    recentVisibleSizes: {
      navSize: 300,
      bottomPanelHeight: 300,
      rightPanelWidth: 400
    },
    panelPosition: "bottom",
    showTabs: !0
  },
  selectedPanel: void 0,
  theme: ea()
}, pe = {
  storySearchField: "storybook-explorer-searchfield",
  storyListMenu: "storybook-explorer-menu",
  storyPanelRoot: "storybook-panel-root"
}, ft = /* @__PURE__ */ n((e) => e.layout.navSize > 0, "getIsNavShown"), dt = /* @__PURE__ */ n((e) => {
  let { bottomPanelHeight: t, rightPanelWidth: r, panelPosition: a } = e.layout;
  return a === "bottom" && t > 0 || a === "right" && r > 0;
}, "getIsPanelShown"), B0 = /* @__PURE__ */ n((e) => !ft(e) && !dt(e), "getIsFullscreen"), Le = /* @__PURE__ */ n((e) => ({
  navSize: e.navSize > 0 ? e.navSize : e.recentVisibleSizes.navSize,
  bottomPanelHeight: e.bottomPanelHeight > 0 ? e.bottomPanelHeight : e.recentVisibleSizes.bottomPanelHeight,
  rightPanelWidth: e.rightPanelWidth > 0 ? e.rightPanelWidth : e.recentVisibleSizes.rightPanelWidth
}), "getRecentVisibleSizes"), aa = /* @__PURE__ */ n(({ store: e, provider: t, singleStory: r }) => {
  let a = {
    toggleFullscreen(i) {
      return e.setState(
        (s) => {
          let l = B0(s), c = typeof i == "boolean" ? i : !l;
          return c === l ? { layout: s.layout } : c ? {
            layout: {
              ...s.layout,
              navSize: 0,
              bottomPanelHeight: 0,
              rightPanelWidth: 0,
              recentVisibleSizes: Le(s.layout)
            }
          } : {
            layout: {
              ...s.layout,
              navSize: s.singleStory ? 0 : s.layout.recentVisibleSizes.navSize,
              bottomPanelHeight: s.layout.recentVisibleSizes.bottomPanelHeight,
              rightPanelWidth: s.layout.recentVisibleSizes.rightPanelWidth
            }
          };
        },
        { persistence: "session" }
      );
    },
    togglePanel(i) {
      return e.setState(
        (s) => {
          let l = dt(s), c = typeof i == "boolean" ? i : !l;
          return c === l ? { layout: s.layout } : c ? {
            layout: {
              ...s.layout,
              bottomPanelHeight: s.layout.recentVisibleSizes.bottomPanelHeight,
              rightPanelWidth: s.layout.recentVisibleSizes.rightPanelWidth
            }
          } : {
            layout: {
              ...s.layout,
              bottomPanelHeight: 0,
              rightPanelWidth: 0,
              recentVisibleSizes: Le(s.layout)
            }
          };
        },
        { persistence: "session" }
      );
    },
    togglePanelPosition(i) {
      return e.setState(
        (s) => {
          let l = i || (s.layout.panelPosition === "right" ? "bottom" : "right");
          return {
            layout: {
              ...s.layout,
              panelPosition: l,
              bottomPanelHeight: s.layout.recentVisibleSizes.bottomPanelHeight,
              rightPanelWidth: s.layout.recentVisibleSizes.rightPanelWidth
            }
          };
        },
        { persistence: "permanent" }
      );
    },
    toggleNav(i) {
      return e.setState(
        (s) => {
          if (s.singleStory)
            return { layout: s.layout };
          let l = ft(s), c = typeof i == "boolean" ? i : !l;
          return c === l ? { layout: s.layout } : c ? {
            layout: {
              ...s.layout,
              navSize: s.layout.recentVisibleSizes.navSize
            }
          } : {
            layout: {
              ...s.layout,
              navSize: 0,
              recentVisibleSizes: Le(s.layout)
            }
          };
        },
        { persistence: "session" }
      );
    },
    toggleToolbar(i) {
      return e.setState(
        (s) => {
          let l = typeof i < "u" ? i : !s.layout.showToolbar;
          return {
            layout: {
              ...s.layout,
              showToolbar: l
            }
          };
        },
        { persistence: "session" }
      );
    },
    setSizes({
      navSize: i,
      bottomPanelHeight: s,
      rightPanelWidth: l
    }) {
      return e.setState(
        (c) => {
          let d = {
            ...c.layout,
            navSize: i ?? c.layout.navSize,
            bottomPanelHeight: s ?? c.layout.bottomPanelHeight,
            rightPanelWidth: l ?? c.layout.rightPanelWidth
          };
          return {
            layout: {
              ...d,
              recentVisibleSizes: Le(d)
            }
          };
        },
        { persistence: "session" }
      );
    },
    focusOnUIElement(i, s) {
      if (!i)
        return;
      let l = ra.getElementById(i);
      l && (l.focus(), s && l.select());
    },
    getInitialOptions() {
      let { theme: i, selectedPanel: s, ...l } = t.getConfig();
      return {
        ...O,
        layout: {
          ...he(
            O.layout,
            q(l, Object.keys(O.layout))
          ),
          ...r && { navSize: 0 }
        },
        ui: he(O.ui, q(l, Object.keys(O.ui))),
        selectedPanel: s || O.selectedPanel,
        theme: i || O.theme
      };
    },
    getIsFullscreen() {
      return B0(e.getState());
    },
    getIsPanelShown() {
      return dt(e.getState());
    },
    getIsNavShown() {
      return ft(e.getState());
    },
    setOptions: /* @__PURE__ */ n((i) => {
      let { layout: s, ui: l, selectedPanel: c, theme: d } = e.getState();
      if (!i)
        return;
      let h = {
        ...s,
        ...i.layout || {},
        ...q(i, Object.keys(s)),
        ...r && { navSize: 0 }
      }, u = {
        ...l,
        ...i.ui,
        ...he(i.ui || {}, q(i, Object.keys(l)))
      }, p = {
        ...d,
        ...i.theme
      }, v = {};
      $(l, u) || (v.ui = u), $(s, h) || (v.layout = h), i.selectedPanel && !$(c, i.selectedPanel) && (v.selectedPanel = i.selectedPanel), Object.
      keys(v).length && e.setState(v, { persistence: "permanent" }), $(d, p) || e.setState({ theme: p });
    }, "setOptions")
  }, o = q(e.getState(), ["layout", "selectedPanel"]);
  return t.channel?.on(ta, () => {
    a.setOptions(F(a.getInitialOptions(), o));
  }), {
    api: a,
    state: F(a.getInitialOptions(), o)
  };
}, "init");

// src/manager-api/modules/notifications.ts
var ht = {};
L(ht, {
  init: () => na
});
var na = /* @__PURE__ */ n(({ store: e }) => ({ api: {
  addNotification: /* @__PURE__ */ n((a) => {
    e.setState(({ notifications: o }) => {
      let [i, s] = _e(o, (l) => l.id === a.id);
      return i.forEach((l) => {
        l.onClear && l.onClear({ dismissed: !1, timeout: !1 });
      }), { notifications: [...s, a] };
    });
  }, "addNotification"),
  clearNotification: /* @__PURE__ */ n((a) => {
    e.setState(({ notifications: o }) => {
      let [i, s] = _e(o, (l) => l.id === a);
      return i.forEach((l) => {
        l.onClear && l.onClear({ dismissed: !1, timeout: !1 });
      }), { notifications: s };
    });
  }, "clearNotification")
}, state: { notifications: [] } }), "init");

// src/manager-api/modules/provider.ts
var ut = {};
L(ut, {
  init: () => oa
});
var oa = /* @__PURE__ */ n(({ provider: e, fullAPI: t }) => ({
  api: e.renderPreview ? { renderPreview: e.renderPreview } : {},
  state: {},
  init: /* @__PURE__ */ n(() => {
    e.handleAPI(t);
  }, "init")
}), "init");

// src/manager-api/modules/settings.ts
var pt = {};
L(pt, {
  init: () => la
});
var la = /* @__PURE__ */ n(({ store: e, navigate: t, fullAPI: r }) => ({
  state: { settings: { lastTrackedStoryId: null } },
  api: {
    closeSettings: /* @__PURE__ */ n(() => {
      let {
        settings: { lastTrackedStoryId: i }
      } = e.getState();
      i ? r.selectStory(i) : r.selectFirstStory();
    }, "closeSettings"),
    changeSettingsTab: /* @__PURE__ */ n((i) => {
      t(`/settings/${i}`);
    }, "changeSettingsTab"),
    isSettingsScreenActive: /* @__PURE__ */ n(() => {
      let { path: i } = r.getUrlState();
      return !!(i || "").match(/^\/settings/);
    }, "isSettingsScreenActive"),
    retrieveSelection() {
      let { settings: i } = e.getState();
      return i.lastTrackedStoryId;
    },
    storeSelection: /* @__PURE__ */ n(async () => {
      let { storyId: i, settings: s } = e.getState();
      await e.setState({
        settings: { ...s, lastTrackedStoryId: i }
      });
    }, "storeSelection")
  }
}), "init");

// src/manager-api/modules/shortcuts.ts
var It = {};
L(It, {
  controlOrMetaKey: () => X,
  defaultShortcuts: () => ee,
  init: () => pa,
  isMacLike: () => k0,
  keys: () => St
});
import {
  FORCE_REMOUNT as sa,
  PREVIEW_KEYDOWN as fa,
  STORIES_COLLAPSE_ALL as da,
  STORIES_EXPAND_ALL as ha
} from "@storybook/core/core-events";

// src/manager-api/lib/shortcut.ts
var { navigator: vt } = A, mt = /* @__PURE__ */ n(() => vt && vt.platform ? !!vt.platform.match(/(Mac|iPhone|iPod|iPad)/i) : !1, "isMacLike"),
fi = /* @__PURE__ */ n(() => mt() ? "\u2318" : "ctrl", "controlOrMetaSymbol"), di = /* @__PURE__ */ n(() => mt() ? "meta" : "control", "cont\
rolOrMetaKey"), ia = /* @__PURE__ */ n(() => mt() ? "\u2325" : "alt", "optionOrAltSymbol"), hi = /* @__PURE__ */ n((e, t) => JSON.stringify(
e) === JSON.stringify(t), "isShortcutTaken"), gt = /* @__PURE__ */ n((e) => {
  if (["Meta", "Alt", "Control", "Shift"].includes(e.key))
    return null;
  let t = [];
  if (e.altKey && t.push("alt"), e.ctrlKey && t.push("control"), e.metaKey && t.push("meta"), e.shiftKey && t.push("shift"), e.key && e.key.
  length === 1 && e.key !== " ") {
    let r = e.key.toUpperCase(), a = e.code?.toUpperCase().replace("KEY", "").replace("DIGIT", "");
    a && a.length === 1 && a !== r ? t.push([r, a]) : t.push(r);
  }
  return e.key === " " && t.push("space"), e.key === "Escape" && t.push("escape"), e.key === "ArrowRight" && t.push("ArrowRight"), e.key ===
  "ArrowDown" && t.push("ArrowDown"), e.key === "ArrowUp" && t.push("ArrowUp"), e.key === "ArrowLeft" && t.push("ArrowLeft"), t.length > 0 ?
  t : null;
}, "eventToShortcut"), wt = /* @__PURE__ */ n((e, t) => !e || !t || (e.join("").startsWith("shift/") && e.shift(), e.length !== t.length) ? !1 :
!e.find(
  (r, a) => Array.isArray(r) ? !r.includes(t[a]) : r !== t[a]
), "shortcutMatchesShortcut"), ui = /* @__PURE__ */ n((e, t) => wt(gt(e), t), "eventMatchesShortcut"), ca = /* @__PURE__ */ n((e) => e === "\
alt" ? ia() : e === "control" ? "\u2303" : e === "meta" ? "\u2318" : e === "shift" ? "\u21E7\u200B" : e === "Enter" || e === "Backspace" || e ===
"Esc" || e === "escape" ? "" : e === " " ? "SPACE" : e === "ArrowUp" ? "\u2191" : e === "ArrowDown" ? "\u2193" : e === "ArrowLeft" ? "\u2190" :
e === "ArrowRight" ? "\u2192" : e.toUpperCase(), "keyToSymbol"), pi = /* @__PURE__ */ n((e) => e.map(ca).join(" "), "shortcutToHumanString");

// src/manager-api/modules/shortcuts.ts
var { navigator: yt, document: D0 } = A, k0 = /* @__PURE__ */ n(() => yt && yt.platform ? !!yt.platform.match(/(Mac|iPhone|iPod|iPad)/i) : !1,
"isMacLike"), X = /* @__PURE__ */ n(() => k0() ? "meta" : "control", "controlOrMetaKey");
function St(e) {
  return Object.keys(e);
}
n(St, "keys");
var ee = Object.freeze({
  fullScreen: ["alt", "F"],
  togglePanel: ["alt", "A"],
  panelPosition: ["alt", "D"],
  toggleNav: ["alt", "S"],
  toolbar: ["alt", "T"],
  search: [X(), "K"],
  focusNav: ["1"],
  focusIframe: ["2"],
  focusPanel: ["3"],
  prevComponent: ["alt", "ArrowUp"],
  nextComponent: ["alt", "ArrowDown"],
  prevStory: ["alt", "ArrowLeft"],
  nextStory: ["alt", "ArrowRight"],
  shortcutsPage: [X(), "shift", ","],
  aboutPage: [X(), ","],
  escape: ["escape"],
  // This one is not customizable
  collapseAll: [X(), "shift", "ArrowUp"],
  expandAll: [X(), "shift", "ArrowDown"],
  remount: ["alt", "R"]
}), Rt = {};
function ua(e) {
  let t = e.target;
  return /input|textarea/i.test(t.tagName) || t.getAttribute("contenteditable") !== null;
}
n(ua, "focusInInput");
var pa = /* @__PURE__ */ n(({ store: e, fullAPI: t, provider: r }) => {
  let a = {
    // Getting and setting shortcuts
    getShortcutKeys() {
      return e.getState().shortcuts;
    },
    getDefaultShortcuts() {
      return {
        ...ee,
        ...a.getAddonsShortcutDefaults()
      };
    },
    getAddonsShortcuts() {
      return Rt;
    },
    getAddonsShortcutLabels() {
      let l = {};
      return Object.entries(a.getAddonsShortcuts()).forEach(([c, { label: d }]) => {
        l[c] = d;
      }), l;
    },
    getAddonsShortcutDefaults() {
      let l = {};
      return Object.entries(a.getAddonsShortcuts()).forEach(([c, { defaultShortcut: d }]) => {
        l[c] = d;
      }), l;
    },
    async setShortcuts(l) {
      return await e.setState({ shortcuts: l }, { persistence: "permanent" }), l;
    },
    async restoreAllDefaultShortcuts() {
      return a.setShortcuts(a.getDefaultShortcuts());
    },
    async setShortcut(l, c) {
      let d = a.getShortcutKeys();
      return await a.setShortcuts({ ...d, [l]: c }), c;
    },
    async setAddonShortcut(l, c) {
      let d = a.getShortcutKeys();
      return await a.setShortcuts({
        ...d,
        [`${l}-${c.actionName}`]: c.defaultShortcut
      }), Rt[`${l}-${c.actionName}`] = c, c;
    },
    async restoreDefaultShortcut(l) {
      let c = a.getDefaultShortcuts()[l];
      return a.setShortcut(l, c);
    },
    // Listening to shortcut events
    handleKeydownEvent(l) {
      let c = gt(l), d = a.getShortcutKeys(), u = St(d).find(
        (p) => wt(c, d[p])
      );
      u && a.handleShortcutFeature(u, l);
    },
    // warning: event might not have a full prototype chain because it may originate from the channel
    handleShortcutFeature(l, c) {
      let {
        ui: { enableShortcuts: d },
        storyId: h
      } = e.getState();
      if (d)
        switch (c?.preventDefault && c.preventDefault(), l) {
          case "escape": {
            t.getIsFullscreen() ? t.toggleFullscreen(!1) : t.getIsNavShown() && t.toggleNav(!0);
            break;
          }
          case "focusNav": {
            t.getIsFullscreen() && t.toggleFullscreen(!1), t.getIsNavShown() || t.toggleNav(!0), t.focusOnUIElement(pe.storyListMenu);
            break;
          }
          case "search": {
            t.getIsFullscreen() && t.toggleFullscreen(!1), t.getIsNavShown() || t.toggleNav(!0), setTimeout(() => {
              t.focusOnUIElement(pe.storySearchField, !0);
            }, 0);
            break;
          }
          case "focusIframe": {
            let u = D0.getElementById("storybook-preview-iframe");
            if (u)
              try {
                u.contentWindow.focus();
              } catch {
              }
            break;
          }
          case "focusPanel": {
            t.getIsFullscreen() && t.toggleFullscreen(!1), t.getIsPanelShown() || t.togglePanel(!0), t.focusOnUIElement(pe.storyPanelRoot);
            break;
          }
          case "nextStory": {
            t.jumpToStory(1);
            break;
          }
          case "prevStory": {
            t.jumpToStory(-1);
            break;
          }
          case "nextComponent": {
            t.jumpToComponent(1);
            break;
          }
          case "prevComponent": {
            t.jumpToComponent(-1);
            break;
          }
          case "fullScreen": {
            t.toggleFullscreen();
            break;
          }
          case "togglePanel": {
            t.togglePanel();
            break;
          }
          case "toggleNav": {
            t.toggleNav();
            break;
          }
          case "toolbar": {
            t.toggleToolbar();
            break;
          }
          case "panelPosition": {
            t.getIsFullscreen() && t.toggleFullscreen(!1), t.getIsPanelShown() || t.togglePanel(!0), t.togglePanelPosition();
            break;
          }
          case "aboutPage": {
            t.navigate("/settings/about");
            break;
          }
          case "shortcutsPage": {
            t.navigate("/settings/shortcuts");
            break;
          }
          case "collapseAll": {
            t.emit(da);
            break;
          }
          case "expandAll": {
            t.emit(ha);
            break;
          }
          case "remount": {
            t.emit(sa, { storyId: h });
            break;
          }
          default:
            Rt[l].action();
            break;
        }
    }
  }, { shortcuts: o = ee } = e.getState(), i = {
    // Any saved shortcuts that are still in our set of defaults
    shortcuts: St(ee).reduce(
      (l, c) => ({ ...l, [c]: o[c] || ee[c] }),
      ee
    )
  };
  return { api: a, state: i, init: /* @__PURE__ */ n(() => {
    D0.addEventListener("keydown", (l) => {
      ua(l) || a.handleKeydownEvent(l);
    }), r.channel?.on(fa, (l) => {
      a.handleKeydownEvent(l.event);
    });
  }, "initModule") };
}, "init");

// src/manager-api/modules/stories.ts
var Et = {};
L(Et, {
  init: () => Va
});
import { sanitize as N0, toId as Te } from "@storybook/csf";
import { logger as va } from "@storybook/core/client-logger";
import {
  CONFIG_ERROR as ma,
  CURRENT_STORY_WAS_SET as ga,
  DOCS_PREPARED as wa,
  PRELOAD_ENTRIES as ya,
  RESET_STORY_ARGS as Ra,
  SELECT_STORY as Sa,
  SET_CONFIG as Ia,
  SET_CURRENT_STORY as xa,
  SET_FILTER as Ea,
  SET_INDEX as Aa,
  SET_STORIES as Pa,
  STORY_ARGS_UPDATED as _a,
  STORY_CHANGED as ba,
  STORY_INDEX_INVALIDATED as Ma,
  STORY_MISSING as Ca,
  STORY_PREPARED as za,
  STORY_SPECIFIED as Ha,
  UPDATE_STORY_ARGS as La
} from "@storybook/core/core-events";
var { fetch: Oa } = A, Ta = "./index.json", Ba = ["enableShortcuts", "theme", "showRoots"];
function xt(e) {
  if (!e || typeof e == "string")
    return e;
  let t = { ...e };
  return Ba.forEach((r) => {
    r in t && delete t[r];
  }), t;
}
n(xt, "removeRemovedOptions");
var Va = /* @__PURE__ */ n(({
  fullAPI: e,
  store: t,
  navigate: r,
  provider: a,
  storyId: o,
  viewMode: i,
  docsOptions: s = {}
}) => {
  let l = {
    storyId: Te,
    getData: /* @__PURE__ */ n((d, h) => {
      let u = l.resolveStory(d, h);
      if (u?.type === "story" || u?.type === "docs")
        return u;
    }, "getData"),
    isPrepared: /* @__PURE__ */ n((d, h) => {
      let u = l.getData(d, h);
      return u ? u.type === "story" ? u.prepared : !0 : !1;
    }, "isPrepared"),
    resolveStory: /* @__PURE__ */ n((d, h) => {
      let { refs: u, index: p } = t.getState();
      if (!(h && !u[h]))
        return h ? u[h].index ? u[h].index[d] : void 0 : p ? p[d] : void 0;
    }, "resolveStory"),
    getCurrentStoryData: /* @__PURE__ */ n(() => {
      let { storyId: d, refId: h } = t.getState();
      return l.getData(d, h);
    }, "getCurrentStoryData"),
    getParameters: /* @__PURE__ */ n((d, h) => {
      let { storyId: u, refId: p } = typeof d == "string" ? { storyId: d, refId: void 0 } : d, v = l.getData(u, p);
      if (["story", "docs"].includes(v?.type)) {
        let { parameters: g } = v;
        if (g)
          return h ? g[h] : g;
      }
      return null;
    }, "getParameters"),
    getCurrentParameter: /* @__PURE__ */ n((d) => {
      let { storyId: h, refId: u } = t.getState();
      return l.getParameters({ storyId: h, refId: u }, d) || void 0;
    }, "getCurrentParameter"),
    jumpToComponent: /* @__PURE__ */ n((d) => {
      let { index: h, storyId: u, refs: p, refId: v } = t.getState();
      if (!l.getData(u, v))
        return;
      let m = v ? p[v].index || {} : h;
      if (!m)
        return;
      let w = l.findSiblingStoryId(u, m, d, !0);
      w && l.selectStory(w, void 0, { ref: v });
    }, "jumpToComponent"),
    jumpToStory: /* @__PURE__ */ n((d) => {
      let { index: h, storyId: u, refs: p, refId: v } = t.getState(), g = l.getData(u, v);
      if (!g)
        return;
      let m = g.refId ? p[g.refId].index : h;
      if (!m)
        return;
      let w = l.findSiblingStoryId(u, m, d, !1);
      w && l.selectStory(w, void 0, { ref: v });
    }, "jumpToStory"),
    selectFirstStory: /* @__PURE__ */ n(() => {
      let { index: d } = t.getState();
      if (!d)
        return;
      let h = Object.keys(d).find((u) => d[u].type === "story");
      if (h) {
        l.selectStory(h);
        return;
      }
      r("/");
    }, "selectFirstStory"),
    selectStory: /* @__PURE__ */ n((d = void 0, h = void 0, u = {}) => {
      let { ref: p } = u, { storyId: v, index: g, refs: m } = t.getState(), w = p ? m[p].index : g, y = v?.split("--", 2)[0];
      if (w)
        if (h)
          if (d) {
            let R = p ? `${p}_${Te(d, h)}` : Te(d, h);
            if (w[R])
              l.selectStory(R, void 0, u);
            else {
              let x = w[N0(d)];
              if (x?.type === "component") {
                let E = x.children.find((I) => w[I].name === h);
                E && l.selectStory(E, void 0, u);
              }
            }
          } else {
            let R = Te(y, h);
            l.selectStory(R, void 0, u);
          }
        else {
          let R = d ? w[d] || w[N0(d)] : w[y];
          if (!R)
            throw new Error(`Unknown id or title: '${d}'`);
          t.setState({
            settings: { ...t.getState().settings, lastTrackedStoryId: R.id }
          });
          let x = l.findLeafEntry(w, R.id), E = x.refId ? `${x.refId}_${x.id}` : x.id;
          r(`/${x.type}/${E}`);
        }
    }, "selectStory"),
    findLeafEntry(d, h) {
      let u = d[h];
      if (u.type === "docs" || u.type === "story")
        return u;
      let p = u.children[0];
      return l.findLeafEntry(d, p);
    },
    findLeafStoryId(d, h) {
      return l.findLeafEntry(d, h)?.id;
    },
    findSiblingStoryId(d, h, u, p) {
      if (p) {
        let m = M0(h), w = m.findIndex((y) => y.includes(d));
        return w === m.length - 1 && u > 0 || w === 0 && u < 0 ? void 0 : m[w + u] ? m[w + u][0] : void 0;
      }
      let v = C0(h), g = v.indexOf(d);
      if (!(g === v.length - 1 && u > 0) && !(g === 0 && u < 0))
        return v[g + u];
    },
    updateStoryArgs: /* @__PURE__ */ n((d, h) => {
      let { id: u, refId: p } = d;
      a.channel?.emit(La, {
        storyId: u,
        updatedArgs: h,
        options: { target: p }
      });
    }, "updateStoryArgs"),
    resetStoryArgs: /* @__PURE__ */ n((d, h) => {
      let { id: u, refId: p } = d;
      a.channel?.emit(Ra, {
        storyId: u,
        argNames: h,
        options: { target: p }
      });
    }, "resetStoryArgs"),
    fetchIndex: /* @__PURE__ */ n(async () => {
      try {
        let d = await Oa(Ta);
        if (d.status !== 200)
          throw new Error(await d.text());
        let h = await d.json();
        if (h.v < 3) {
          va.warn(`Skipping story index with version v${h.v}, awaiting SET_STORIES.`);
          return;
        }
        await l.setIndex(h);
      } catch (d) {
        await t.setState({ indexError: d });
      }
    }, "fetchIndex"),
    // The story index we receive on SET_INDEX is "prepared" in that it has parameters
    // The story index we receive on fetchStoryIndex is not, but all the prepared fields are optional
    // so we can cast one to the other easily enough
    setIndex: /* @__PURE__ */ n(async (d) => {
      let { index: h, status: u, filters: p } = t.getState(), v = He(d, {
        provider: a,
        docsOptions: s,
        status: u,
        filters: p
      }), g = b0(v, h);
      await t.setState({ internal_index: d, index: g, indexError: void 0 });
    }, "setIndex"),
    updateStory: /* @__PURE__ */ n(async (d, h, u) => {
      if (u) {
        let { id: p, index: v } = u;
        v[d] = {
          ...v[d],
          ...h
        }, await e.updateRef(p, { index: v });
      } else {
        let { index: p } = t.getState();
        if (!p)
          return;
        p[d] = {
          ...p[d],
          ...h
        }, await t.setState({ index: p });
      }
    }, "updateStory"),
    updateDocs: /* @__PURE__ */ n(async (d, h, u) => {
      if (u) {
        let { id: p, index: v } = u;
        v[d] = {
          ...v[d],
          ...h
        }, await e.updateRef(p, { index: v });
      } else {
        let { index: p } = t.getState();
        if (!p)
          return;
        p[d] = {
          ...p[d],
          ...h
        }, await t.setState({ index: p });
      }
    }, "updateDocs"),
    setPreviewInitialized: /* @__PURE__ */ n(async (d) => {
      d ? e.updateRef(d.id, { previewInitialized: !0 }) : t.setState({ previewInitialized: !0 });
    }, "setPreviewInitialized"),
    /* EXPERIMENTAL APIs */
    experimental_updateStatus: /* @__PURE__ */ n(async (d, h) => {
      let { status: u, internal_index: p } = t.getState(), v = { ...u }, g = typeof h == "function" ? h(u) : h;
      if (!(!d || Object.keys(g).length === 0) && (Object.entries(g).forEach(([m, w]) => {
        !m || typeof w != "object" || (v[m] = { ...v[m] || {} }, w === null ? delete v[m][d] : v[m][d] = w, Object.keys(v[m]).length === 0 &&
        delete v[m]);
      }), await t.setState({ status: v }, { persistence: "session" }), p)) {
        await l.setIndex(p);
        let m = await e.getRefs();
        Object.entries(m).forEach(([w, { internal_index: y, ...R }]) => {
          e.setRef(w, { ...R, storyIndex: y }, !0);
        });
      }
    }, "experimental_updateStatus"),
    experimental_setFilter: /* @__PURE__ */ n(async (d, h) => {
      await t.setState({ filters: { ...t.getState().filters, [d]: h } });
      let { internal_index: u } = t.getState();
      if (!u)
        return;
      await l.setIndex(u);
      let p = await e.getRefs();
      Object.entries(p).forEach(([v, { internal_index: g, ...m }]) => {
        e.setRef(v, { ...m, storyIndex: g }, !0);
      }), a.channel?.emit(Ea, { id: d });
    }, "experimental_setFilter")
  };
  a.channel?.on(
    Ha,
    /* @__PURE__ */ n(function({
      storyId: h,
      viewMode: u
    }) {
      let { sourceType: p } = z(this, e);
      if (p === "local") {
        let v = t.getState(), g = v.path === "/" || v.viewMode === "story" || v.viewMode === "docs", m = v.viewMode && v.storyId, w = v.viewMode !==
        u || v.storyId !== h, { type: y } = v.index?.[v.storyId] || {};
        g && (m && w && !(y === "root" || y === "component" || y === "group") ? a.channel?.emit(xa, {
          storyId: v.storyId,
          viewMode: v.viewMode
        }) : w && r(`/${u}/${h}`));
      }
    }, "handler")
  ), a.channel?.on(ga, /* @__PURE__ */ n(function() {
    let { ref: h } = z(this, e);
    l.setPreviewInitialized(h);
  }, "handler")), a.channel?.on(ba, /* @__PURE__ */ n(function() {
    let { sourceType: h } = z(this, e);
    if (h === "local") {
      let u = l.getCurrentParameter("options");
      u && e.setOptions(xt(u));
    }
  }, "handler")), a.channel?.on(
    za,
    /* @__PURE__ */ n(function({ id: h, ...u }) {
      let { ref: p, sourceType: v } = z(this, e);
      if (l.updateStory(h, { ...u, prepared: !0 }, p), !p && !t.getState().hasCalledSetOptions) {
        let { options: g } = u.parameters;
        e.setOptions(xt(g)), t.setState({ hasCalledSetOptions: !0 });
      }
      if (v === "local") {
        let { storyId: g, index: m, refId: w } = t.getState();
        if (!m)
          return;
        let y = Array.from(
          /* @__PURE__ */ new Set([
            l.findSiblingStoryId(g, m, 1, !0),
            l.findSiblingStoryId(g, m, -1, !0)
          ])
        ).filter(Boolean);
        a.channel?.emit(ya, {
          ids: y,
          options: { target: w }
        });
      }
    }, "handler")
  ), a.channel?.on(
    wa,
    /* @__PURE__ */ n(function({ id: h, ...u }) {
      let { ref: p } = z(this, e);
      l.updateStory(h, { ...u, prepared: !0 }, p);
    }, "handler")
  ), a.channel?.on(Aa, /* @__PURE__ */ n(function(h) {
    let { ref: u } = z(this, e);
    if (u)
      e.setRef(u.id, { ...u, storyIndex: h }, !0);
    else {
      l.setIndex(h);
      let p = l.getCurrentParameter("options");
      e.setOptions(xt(p));
    }
  }, "handler")), a.channel?.on(Pa, /* @__PURE__ */ n(function(h) {
    let { ref: u } = z(this, e), p = h.v ? P0(h) : h.stories;
    if (u)
      e.setRef(u.id, { ...u, setStoriesData: p }, !0);
    else
      throw new Error("Cannot call SET_STORIES for local frame");
  }, "handler")), a.channel?.on(
    Sa,
    /* @__PURE__ */ n(function({
      kind: h,
      title: u = h,
      story: p,
      name: v = p,
      storyId: g,
      ...m
    }) {
      let { ref: w } = z(this, e);
      w ? e.selectStory(g || u, v, { ...m, ref: w.id }) : e.selectStory(g || u, v, m);
    }, "handler")
  ), a.channel?.on(
    _a,
    /* @__PURE__ */ n(function({ storyId: h, args: u }) {
      let { ref: p } = z(this, e);
      l.updateStory(h, { args: u }, p);
    }, "handleStoryArgsUpdated")
  ), a.channel?.on(ma, /* @__PURE__ */ n(function(h) {
    let { ref: u } = z(this, e);
    l.setPreviewInitialized(u);
  }, "handleConfigError")), a.channel?.on(Ca, /* @__PURE__ */ n(function(h) {
    let { ref: u } = z(this, e);
    l.setPreviewInitialized(u);
  }, "handleConfigError")), a.channel?.on(Ia, () => {
    let d = a.getConfig();
    d?.sidebar?.filters && t.setState({
      filters: {
        ...t.getState().filters,
        ...d?.sidebar?.filters
      }
    });
  });
  let c = a.getConfig();
  return {
    api: l,
    state: {
      storyId: o,
      viewMode: i,
      hasCalledSetOptions: !1,
      previewInitialized: !1,
      status: {},
      filters: c?.sidebar?.filters || {}
    },
    init: /* @__PURE__ */ n(async () => {
      a.channel?.on(Ma, () => l.fetchIndex()), await l.fetchIndex();
    }, "init")
  };
}, "init");

// src/manager-api/modules/url.ts
var _t = {};
L(_t, {
  init: () => $a
});
import { buildArgsParam as F0, queryFromLocation as Da } from "@storybook/core/router";
import {
  GLOBALS_UPDATED as ka,
  NAVIGATE_URL as Na,
  SET_CURRENT_STORY as Fa,
  STORY_ARGS_UPDATED as ja,
  UPDATE_QUERY_PARAMS as Ua
} from "@storybook/core/core-events";
var { window: At } = A, Y = /* @__PURE__ */ n((e) => {
  if (e === "true" || e === "1")
    return !0;
  if (e === "false" || e === "0")
    return !1;
}, "parseBoolean"), Pt, Ga = /* @__PURE__ */ n(({
  state: { location: e, path: t, viewMode: r, storyId: a },
  singleStory: o
}) => {
  let {
    full: i,
    panel: s,
    nav: l,
    shortcuts: c,
    addonPanel: d,
    tabs: h,
    path: u,
    ...p
    // the rest gets passed to the iframe
  } = Da(e), v, g, m;
  Y(i) === !0 ? (v = 0, g = 0, m = 0) : Y(i) === !1 && (v = O.layout.navSize, g = O.layout.bottomPanelHeight, m = O.layout.rightPanelWidth),
  o || (Y(l) === !0 && (v = O.layout.navSize), Y(l) === !1 && (v = 0)), Y(s) === !1 && (g = 0, m = 0);
  let w = {
    navSize: v,
    bottomPanelHeight: g,
    rightPanelWidth: m,
    panelPosition: ["right", "bottom"].includes(s) ? s : void 0,
    showTabs: Y(h)
  }, y = {
    enableShortcuts: Y(c)
  }, R = d || void 0, x = a, E = B(Pt, p) ? Pt : p;
  return Pt = E, { viewMode: r, layout: w, ui: y, selectedPanel: R, location: e, path: t, customQueryParams: E, storyId: x };
}, "initialUrlSupport"), $a = /* @__PURE__ */ n((e) => {
  let { store: t, navigate: r, provider: a, fullAPI: o } = e, i = /* @__PURE__ */ n((d, h = {}, u = {}) => {
    let p = Object.entries(h).filter(([, g]) => g).sort(([g], [m]) => g < m ? -1 : 1).map(([g, m]) => `${g}=${m}`), v = [d, ...p].join("&");
    return r(v, u);
  }, "navigateTo"), s = {
    getQueryParam(d) {
      let { customQueryParams: h } = t.getState();
      return h ? h[d] : void 0;
    },
    getUrlState() {
      let { path: d, customQueryParams: h, storyId: u, url: p, viewMode: v } = t.getState();
      return { path: d, queryParams: h, storyId: u, url: p, viewMode: v };
    },
    setQueryParams(d) {
      let { customQueryParams: h } = t.getState(), u = {}, p = {
        ...h,
        ...Object.entries(d).reduce((v, [g, m]) => (m !== null && (v[g] = m), v), u)
      };
      B(h, p) || (t.setState({ customQueryParams: p }), a.channel?.emit(Ua, p));
    },
    applyQueryParams(d, h) {
      let { path: u, queryParams: p } = s.getUrlState();
      i(u, { ...p, ...d }, h), s.setQueryParams(d);
    },
    navigateUrl(d, h) {
      r(d, { plain: !0, ...h });
    }
  }, l = /* @__PURE__ */ n(() => {
    let { path: d, queryParams: h, viewMode: u } = s.getUrlState();
    if (u !== "story")
      return;
    let p = o.getCurrentStoryData();
    if (p?.type !== "story")
      return;
    let { args: v, initialArgs: g } = p, m = F0(g, v);
    i(d, { ...h, args: m }, { replace: !0 }), s.setQueryParams({ args: m });
  }, "updateArgsParam");
  a.channel?.on(Fa, () => l());
  let c;
  return a.channel?.on(ja, () => {
    "requestIdleCallback" in At ? (c && At.cancelIdleCallback(c), c = At.requestIdleCallback(l, { timeout: 1e3 })) : (c && clearTimeout(c), setTimeout(
    l, 100));
  }), a.channel?.on(ka, ({ userGlobals: d, initialGlobals: h }) => {
    let { path: u, queryParams: p } = s.getUrlState(), v = F0(h, d);
    i(u, { ...p, globals: v }, { replace: !0 }), s.setQueryParams({ globals: v });
  }), a.channel?.on(Na, (d, h) => {
    s.navigateUrl(d, h);
  }), {
    api: s,
    state: Ga(e)
  };
}, "init");

// src/manager-api/modules/versions.ts
var bt = {};
L(bt, {
  init: () => qa
});
var G0 = Pe(ze(), 1);
import D from "semver";

// src/manager-api/version.ts
var j0 = "8.4.7";

// src/manager-api/modules/versions.ts
var { VERSIONCHECK: Wa } = A, U0 = (0, G0.default)(1)(() => {
  try {
    return { ...JSON.parse(Wa).data || {} };
  } catch {
    return {};
  }
}), Ka = /* @__PURE__ */ n((e) => e.includes("vue") ? "vue" : e, "normalizeRendererName"), qa = /* @__PURE__ */ n(({ store: e }) => {
  let { dismissedVersionNotification: t } = e.getState(), r = {
    versions: {
      current: {
        version: j0
      },
      ...U0()
    },
    dismissedVersionNotification: t
  }, a = {
    getCurrentVersion: /* @__PURE__ */ n(() => {
      let {
        versions: { current: i }
      } = e.getState();
      return i;
    }, "getCurrentVersion"),
    getLatestVersion: /* @__PURE__ */ n(() => {
      let {
        versions: { latest: i, next: s, current: l }
      } = e.getState();
      return l && D.prerelease(l.version) && s ? i && D.gt(i.version, s.version) ? i : s : i;
    }, "getLatestVersion"),
    // TODO: Move this to it's own "info" module later
    getDocsUrl: /* @__PURE__ */ n(({ subpath: i, versioned: s, renderer: l }) => {
      let {
        versions: { latest: c, current: d }
      } = e.getState(), h = "https://storybook.js.org/docs/";
      if (s && d?.version && c?.version) {
        let v = D.diff(c.version, d.version);
        v === "patch" || v === null || (h += `${D.major(d.version)}.${D.minor(d.version)}/`);
      }
      let [u, p] = i?.split("#") || [];
      if (u && (h += `${u}/`), l && typeof A.STORYBOOK_RENDERER < "u") {
        let v = A.STORYBOOK_RENDERER;
        v && (h += `?renderer=${Ka(v)}`);
      }
      return p && (h += `#${p}`), h;
    }, "getDocsUrl"),
    versionUpdateAvailable: /* @__PURE__ */ n(() => {
      let i = a.getLatestVersion(), s = a.getCurrentVersion();
      if (i) {
        if (!i.version || !s.version)
          return !0;
        let c = !!D.prerelease(s.version) ? `${D.major(s.version)}.${D.minor(s.version)}.${D.patch(
          s.version
        )}` : s.version, d = D.diff(c, i.version);
        return D.gt(i.version, c) && d !== "patch" && !d.includes("pre");
      }
      return !1;
    }, "versionUpdateAvailable")
  };
  return { init: /* @__PURE__ */ n(async () => {
    let { versions: i = {} } = e.getState(), { latest: s, next: l } = U0();
    await e.setState({
      versions: { ...i, latest: s, next: l }
    });
  }, "initModule"), state: r, api: a };
}, "init");

// src/manager-api/modules/whatsnew.tsx
var Mt = {};
L(Mt, {
  init: () => e1
});
import Ya from "react";

// ../node_modules/@storybook/icons/dist/index.mjs
import * as ve from "react";
var $0 = /* @__PURE__ */ ve.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, a) => /* @__PURE__ */ ve.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: a,
    ...r
  },
  /* @__PURE__ */ ve.createElement(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M2.042.616a.704.704 0 00-.66.729L1.816 12.9c.014.367.306.66.672.677l9.395.422h.032a.704.704 0 00.704-.703V.704c0-.015 0-.03-.002-.\
044a.704.704 0 00-.746-.659l-.773.049.057 1.615a.105.105 0 01-.17.086l-.52-.41-.617.468a.105.105 0 01-.168-.088L9.746.134 2.042.616zm8.003 4\
.747c-.247.192-2.092.324-2.092.05.04-1.045-.429-1.091-.689-1.091-.247 0-.662.075-.662.634 0 .57.607.893 1.32 1.27 1.014.538 2.24 1.188 2.24 \
2.823 0 1.568-1.273 2.433-2.898 2.433-1.676 0-3.141-.678-2.976-3.03.065-.275 2.197-.21 2.197 0-.026.971.195 1.256.753 1.256.43 0 .624-.236.6\
24-.634 0-.602-.633-.958-1.361-1.367-.987-.554-2.148-1.205-2.148-2.7 0-1.494 1.027-2.489 2.86-2.489 1.832 0 2.832.98 2.832 2.845z",
      fill: e
    }
  )
));

// src/manager-api/modules/whatsnew.tsx
import {
  REQUEST_WHATS_NEW_DATA as Qa,
  RESULT_WHATS_NEW_DATA as Ja,
  SET_WHATS_NEW_CACHE as Za,
  TOGGLE_WHATS_NEW_NOTIFICATIONS as Xa
} from "@storybook/core/core-events";
var W0 = "whats-new", e1 = /* @__PURE__ */ n(({ fullAPI: e, store: t, provider: r }) => {
  let a = {
    whatsNewData: void 0
  };
  function o(d) {
    t.setState({ whatsNewData: d }), a.whatsNewData = d;
  }
  n(o, "setWhatsNewState");
  let i = {
    isWhatsNewUnread() {
      return a.whatsNewData?.status === "SUCCESS" && !a.whatsNewData.postIsRead;
    },
    whatsNewHasBeenRead() {
      a.whatsNewData?.status === "SUCCESS" && (l({ lastReadPost: a.whatsNewData.url }), o({ ...a.whatsNewData, postIsRead: !0 }), e.clearNotification(
      W0));
    },
    toggleWhatsNewNotifications() {
      a.whatsNewData?.status === "SUCCESS" && (o({
        ...a.whatsNewData,
        disableWhatsNewNotifications: !a.whatsNewData.disableWhatsNewNotifications
      }), r.channel?.emit(Xa, {
        disableWhatsNewNotifications: a.whatsNewData.disableWhatsNewNotifications
      }));
    }
  };
  function s() {
    return r.channel?.emit(Qa), new Promise(
      (d) => r.channel?.once(
        Ja,
        ({ data: h }) => d(h)
      )
    );
  }
  n(s, "getLatestWhatsNewPost");
  function l(d) {
    r.channel?.emit(Za, d);
  }
  return n(l, "setWhatsNewCache"), { init: /* @__PURE__ */ n(async () => {
    if (A.CONFIG_TYPE !== "DEVELOPMENT")
      return;
    let d = await s();
    o(d);
    let h = e.getUrlState();
    !(h?.path === "/onboarding" || h.queryParams?.onboarding === "true") && d.status === "SUCCESS" && !d.disableWhatsNewNotifications && d.showNotification &&
    e.addNotification({
      id: W0,
      link: "/settings/whats-new",
      content: {
        headline: d.title,
        subHeadline: "Learn what's new in Storybook"
      },
      icon: /* @__PURE__ */ Ya.createElement($0, null),
      onClear({ dismissed: p }) {
        p && l({ lastDismissedPost: d.url });
      }
    });
  }, "initModule"), state: a, api: i };
}, "init");

// src/manager-api/store.ts
var oe = Pe(K0(), 1);

// ../node_modules/telejson/dist/chunk-465TF3XA.mjs
var t1 = Object.create, q0 = Object.defineProperty, r1 = Object.getOwnPropertyDescriptor, Y0 = Object.getOwnPropertyNames, a1 = Object.getPrototypeOf,
n1 = Object.prototype.hasOwnProperty, T = /* @__PURE__ */ n((e, t) => /* @__PURE__ */ n(function() {
  return t || (0, e[Y0(e)[0]])((t = { exports: {} }).exports, t), t.exports;
}, "__require"), "__commonJS"), o1 = /* @__PURE__ */ n((e, t, r, a) => {
  if (t && typeof t == "object" || typeof t == "function")
    for (let o of Y0(t))
      !n1.call(e, o) && o !== r && q0(e, o, { get: /* @__PURE__ */ n(() => t[o], "get"), enumerable: !(a = r1(t, o)) || a.enumerable });
  return e;
}, "__copyProps"), De = /* @__PURE__ */ n((e, t, r) => (r = e != null ? t1(a1(e)) : {}, o1(
  t || !e || !e.__esModule ? q0(r, "default", { value: e, enumerable: !0 }) : r,
  e
)), "__toESM"), l1 = [
  "bubbles",
  "cancelBubble",
  "cancelable",
  "composed",
  "currentTarget",
  "defaultPrevented",
  "eventPhase",
  "isTrusted",
  "returnValue",
  "srcElement",
  "target",
  "timeStamp",
  "type"
], i1 = ["detail"];
function Q0(e) {
  let t = l1.filter((r) => e[r] !== void 0).reduce((r, a) => ({ ...r, [a]: e[a] }), {});
  return e instanceof CustomEvent && i1.filter((r) => e[r] !== void 0).forEach((r) => {
    t[r] = e[r];
  }), t;
}
n(Q0, "extractEventHiddenProperties");

// ../node_modules/telejson/dist/index.mjs
var dr = Pe(ze(), 1);
var rr = T({
  "node_modules/has-symbols/shams.js"(e, t) {
    "use strict";
    t.exports = /* @__PURE__ */ n(function() {
      if (typeof Symbol != "function" || typeof Object.getOwnPropertySymbols != "function")
        return !1;
      if (typeof Symbol.iterator == "symbol")
        return !0;
      var a = {}, o = Symbol("test"), i = Object(o);
      if (typeof o == "string" || Object.prototype.toString.call(o) !== "[object Symbol]" || Object.prototype.toString.call(i) !== "[object \
Symbol]")
        return !1;
      var s = 42;
      a[o] = s;
      for (o in a)
        return !1;
      if (typeof Object.keys == "function" && Object.keys(a).length !== 0 || typeof Object.getOwnPropertyNames == "function" && Object.getOwnPropertyNames(
      a).length !== 0)
        return !1;
      var l = Object.getOwnPropertySymbols(a);
      if (l.length !== 1 || l[0] !== o || !Object.prototype.propertyIsEnumerable.call(a, o))
        return !1;
      if (typeof Object.getOwnPropertyDescriptor == "function") {
        var c = Object.getOwnPropertyDescriptor(a, o);
        if (c.value !== s || c.enumerable !== !0)
          return !1;
      }
      return !0;
    }, "hasSymbols");
  }
}), ar = T({
  "node_modules/has-symbols/index.js"(e, t) {
    "use strict";
    var r = typeof Symbol < "u" && Symbol, a = rr();
    t.exports = /* @__PURE__ */ n(function() {
      return typeof r != "function" || typeof Symbol != "function" || typeof r("foo") != "symbol" || typeof Symbol("bar") != "symbol" ? !1 :
      a();
    }, "hasNativeSymbols");
  }
}), c1 = T({
  "node_modules/function-bind/implementation.js"(e, t) {
    "use strict";
    var r = "Function.prototype.bind called on incompatible ", a = Array.prototype.slice, o = Object.prototype.toString, i = "[object Functi\
on]";
    t.exports = /* @__PURE__ */ n(function(l) {
      var c = this;
      if (typeof c != "function" || o.call(c) !== i)
        throw new TypeError(r + c);
      for (var d = a.call(arguments, 1), h, u = /* @__PURE__ */ n(function() {
        if (this instanceof h) {
          var w = c.apply(
            this,
            d.concat(a.call(arguments))
          );
          return Object(w) === w ? w : this;
        } else
          return c.apply(
            l,
            d.concat(a.call(arguments))
          );
      }, "binder"), p = Math.max(0, c.length - d.length), v = [], g = 0; g < p; g++)
        v.push("$" + g);
      if (h = Function("binder", "return function (" + v.join(",") + "){ return binder.apply(this,arguments); }")(u), c.prototype) {
        var m = /* @__PURE__ */ n(function() {
        }, "Empty2");
        m.prototype = c.prototype, h.prototype = new m(), m.prototype = null;
      }
      return h;
    }, "bind");
  }
}), zt = T({
  "node_modules/function-bind/index.js"(e, t) {
    "use strict";
    var r = c1();
    t.exports = Function.prototype.bind || r;
  }
}), s1 = T({
  "node_modules/has/src/index.js"(e, t) {
    "use strict";
    var r = zt();
    t.exports = r.call(Function.call, Object.prototype.hasOwnProperty);
  }
}), nr = T({
  "node_modules/get-intrinsic/index.js"(e, t) {
    "use strict";
    var r, a = SyntaxError, o = Function, i = TypeError, s = /* @__PURE__ */ n(function(V) {
      try {
        return o('"use strict"; return (' + V + ").constructor;")();
      } catch {
      }
    }, "getEvalledConstructor"), l = Object.getOwnPropertyDescriptor;
    if (l)
      try {
        l({}, "");
      } catch {
        l = null;
      }
    var c = /* @__PURE__ */ n(function() {
      throw new i();
    }, "throwTypeError"), d = l ? function() {
      try {
        return arguments.callee, c;
      } catch {
        try {
          return l(arguments, "callee").get;
        } catch {
          return c;
        }
      }
    }() : c, h = ar()(), u = Object.getPrototypeOf || function(V) {
      return V.__proto__;
    }, p = {}, v = typeof Uint8Array > "u" ? r : u(Uint8Array), g = {
      "%AggregateError%": typeof AggregateError > "u" ? r : AggregateError,
      "%Array%": Array,
      "%ArrayBuffer%": typeof ArrayBuffer > "u" ? r : ArrayBuffer,
      "%ArrayIteratorPrototype%": h ? u([][Symbol.iterator]()) : r,
      "%AsyncFromSyncIteratorPrototype%": r,
      "%AsyncFunction%": p,
      "%AsyncGenerator%": p,
      "%AsyncGeneratorFunction%": p,
      "%AsyncIteratorPrototype%": p,
      "%Atomics%": typeof Atomics > "u" ? r : Atomics,
      "%BigInt%": typeof BigInt > "u" ? r : BigInt,
      "%Boolean%": Boolean,
      "%DataView%": typeof DataView > "u" ? r : DataView,
      "%Date%": Date,
      "%decodeURI%": decodeURI,
      "%decodeURIComponent%": decodeURIComponent,
      "%encodeURI%": encodeURI,
      "%encodeURIComponent%": encodeURIComponent,
      "%Error%": Error,
      "%eval%": eval,
      "%EvalError%": EvalError,
      "%Float32Array%": typeof Float32Array > "u" ? r : Float32Array,
      "%Float64Array%": typeof Float64Array > "u" ? r : Float64Array,
      "%FinalizationRegistry%": typeof FinalizationRegistry > "u" ? r : FinalizationRegistry,
      "%Function%": o,
      "%GeneratorFunction%": p,
      "%Int8Array%": typeof Int8Array > "u" ? r : Int8Array,
      "%Int16Array%": typeof Int16Array > "u" ? r : Int16Array,
      "%Int32Array%": typeof Int32Array > "u" ? r : Int32Array,
      "%isFinite%": isFinite,
      "%isNaN%": isNaN,
      "%IteratorPrototype%": h ? u(u([][Symbol.iterator]())) : r,
      "%JSON%": typeof JSON == "object" ? JSON : r,
      "%Map%": typeof Map > "u" ? r : Map,
      "%MapIteratorPrototype%": typeof Map > "u" || !h ? r : u((/* @__PURE__ */ new Map())[Symbol.iterator]()),
      "%Math%": Math,
      "%Number%": Number,
      "%Object%": Object,
      "%parseFloat%": parseFloat,
      "%parseInt%": parseInt,
      "%Promise%": typeof Promise > "u" ? r : Promise,
      "%Proxy%": typeof Proxy > "u" ? r : Proxy,
      "%RangeError%": RangeError,
      "%ReferenceError%": ReferenceError,
      "%Reflect%": typeof Reflect > "u" ? r : Reflect,
      "%RegExp%": RegExp,
      "%Set%": typeof Set > "u" ? r : Set,
      "%SetIteratorPrototype%": typeof Set > "u" || !h ? r : u((/* @__PURE__ */ new Set())[Symbol.iterator]()),
      "%SharedArrayBuffer%": typeof SharedArrayBuffer > "u" ? r : SharedArrayBuffer,
      "%String%": String,
      "%StringIteratorPrototype%": h ? u(""[Symbol.iterator]()) : r,
      "%Symbol%": h ? Symbol : r,
      "%SyntaxError%": a,
      "%ThrowTypeError%": d,
      "%TypedArray%": v,
      "%TypeError%": i,
      "%Uint8Array%": typeof Uint8Array > "u" ? r : Uint8Array,
      "%Uint8ClampedArray%": typeof Uint8ClampedArray > "u" ? r : Uint8ClampedArray,
      "%Uint16Array%": typeof Uint16Array > "u" ? r : Uint16Array,
      "%Uint32Array%": typeof Uint32Array > "u" ? r : Uint32Array,
      "%URIError%": URIError,
      "%WeakMap%": typeof WeakMap > "u" ? r : WeakMap,
      "%WeakRef%": typeof WeakRef > "u" ? r : WeakRef,
      "%WeakSet%": typeof WeakSet > "u" ? r : WeakSet
    }, m = /* @__PURE__ */ n(function V(P) {
      var M;
      if (P === "%AsyncFunction%")
        M = s("async function () {}");
      else if (P === "%GeneratorFunction%")
        M = s("function* () {}");
      else if (P === "%AsyncGeneratorFunction%")
        M = s("async function* () {}");
      else if (P === "%AsyncGenerator%") {
        var _ = V("%AsyncGeneratorFunction%");
        _ && (M = _.prototype);
      } else if (P === "%AsyncIteratorPrototype%") {
        var C = V("%AsyncGenerator%");
        C && (M = u(C.prototype));
      }
      return g[P] = M, M;
    }, "doEval2"), w = {
      "%ArrayBufferPrototype%": ["ArrayBuffer", "prototype"],
      "%ArrayPrototype%": ["Array", "prototype"],
      "%ArrayProto_entries%": ["Array", "prototype", "entries"],
      "%ArrayProto_forEach%": ["Array", "prototype", "forEach"],
      "%ArrayProto_keys%": ["Array", "prototype", "keys"],
      "%ArrayProto_values%": ["Array", "prototype", "values"],
      "%AsyncFunctionPrototype%": ["AsyncFunction", "prototype"],
      "%AsyncGenerator%": ["AsyncGeneratorFunction", "prototype"],
      "%AsyncGeneratorPrototype%": ["AsyncGeneratorFunction", "prototype", "prototype"],
      "%BooleanPrototype%": ["Boolean", "prototype"],
      "%DataViewPrototype%": ["DataView", "prototype"],
      "%DatePrototype%": ["Date", "prototype"],
      "%ErrorPrototype%": ["Error", "prototype"],
      "%EvalErrorPrototype%": ["EvalError", "prototype"],
      "%Float32ArrayPrototype%": ["Float32Array", "prototype"],
      "%Float64ArrayPrototype%": ["Float64Array", "prototype"],
      "%FunctionPrototype%": ["Function", "prototype"],
      "%Generator%": ["GeneratorFunction", "prototype"],
      "%GeneratorPrototype%": ["GeneratorFunction", "prototype", "prototype"],
      "%Int8ArrayPrototype%": ["Int8Array", "prototype"],
      "%Int16ArrayPrototype%": ["Int16Array", "prototype"],
      "%Int32ArrayPrototype%": ["Int32Array", "prototype"],
      "%JSONParse%": ["JSON", "parse"],
      "%JSONStringify%": ["JSON", "stringify"],
      "%MapPrototype%": ["Map", "prototype"],
      "%NumberPrototype%": ["Number", "prototype"],
      "%ObjectPrototype%": ["Object", "prototype"],
      "%ObjProto_toString%": ["Object", "prototype", "toString"],
      "%ObjProto_valueOf%": ["Object", "prototype", "valueOf"],
      "%PromisePrototype%": ["Promise", "prototype"],
      "%PromiseProto_then%": ["Promise", "prototype", "then"],
      "%Promise_all%": ["Promise", "all"],
      "%Promise_reject%": ["Promise", "reject"],
      "%Promise_resolve%": ["Promise", "resolve"],
      "%RangeErrorPrototype%": ["RangeError", "prototype"],
      "%ReferenceErrorPrototype%": ["ReferenceError", "prototype"],
      "%RegExpPrototype%": ["RegExp", "prototype"],
      "%SetPrototype%": ["Set", "prototype"],
      "%SharedArrayBufferPrototype%": ["SharedArrayBuffer", "prototype"],
      "%StringPrototype%": ["String", "prototype"],
      "%SymbolPrototype%": ["Symbol", "prototype"],
      "%SyntaxErrorPrototype%": ["SyntaxError", "prototype"],
      "%TypedArrayPrototype%": ["TypedArray", "prototype"],
      "%TypeErrorPrototype%": ["TypeError", "prototype"],
      "%Uint8ArrayPrototype%": ["Uint8Array", "prototype"],
      "%Uint8ClampedArrayPrototype%": ["Uint8ClampedArray", "prototype"],
      "%Uint16ArrayPrototype%": ["Uint16Array", "prototype"],
      "%Uint32ArrayPrototype%": ["Uint32Array", "prototype"],
      "%URIErrorPrototype%": ["URIError", "prototype"],
      "%WeakMapPrototype%": ["WeakMap", "prototype"],
      "%WeakSetPrototype%": ["WeakSet", "prototype"]
    }, y = zt(), R = s1(), x = y.call(Function.call, Array.prototype.concat), E = y.call(Function.apply, Array.prototype.splice), I = y.call(
    Function.call, String.prototype.replace), S = y.call(Function.call, String.prototype.slice), b = y.call(Function.call, RegExp.prototype.
    exec), k = /[^%.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|%$))/g, ie = /\\(\\)?/g, ce = /* @__PURE__ */ n(
    function(P) {
      var M = S(P, 0, 1), _ = S(P, -1);
      if (M === "%" && _ !== "%")
        throw new a("invalid intrinsic syntax, expected closing `%`");
      if (_ === "%" && M !== "%")
        throw new a("invalid intrinsic syntax, expected opening `%`");
      var C = [];
      return I(P, k, function(N, Q, H, Re) {
        C[C.length] = H ? I(Re, ie, "$1") : Q || N;
      }), C;
    }, "stringToPath3"), Er = /* @__PURE__ */ n(function(P, M) {
      var _ = P, C;
      if (R(w, _) && (C = w[_], _ = "%" + C[0] + "%"), R(g, _)) {
        var N = g[_];
        if (N === p && (N = m(_)), typeof N > "u" && !M)
          throw new i("intrinsic " + P + " exists, but is not available. Please file an issue!");
        return {
          alias: C,
          name: _,
          value: N
        };
      }
      throw new a("intrinsic " + P + " does not exist!");
    }, "getBaseIntrinsic2");
    t.exports = /* @__PURE__ */ n(function(P, M) {
      if (typeof P != "string" || P.length === 0)
        throw new i("intrinsic name must be a non-empty string");
      if (arguments.length > 1 && typeof M != "boolean")
        throw new i('"allowMissing" argument must be a boolean');
      if (b(/^%?[^%]*%?$/, P) === null)
        throw new a("`%` may not be present anywhere but at the beginning and end of the intrinsic name");
      var _ = ce(P), C = _.length > 0 ? _[0] : "", N = Er("%" + C + "%", M), Q = N.name, H = N.value, Re = !1, $e = N.alias;
      $e && (C = $e[0], E(_, x([0, 1], $e)));
      for (var Se = 1, se = !0; Se < _.length; Se += 1) {
        var U = _[Se], Ie = S(U, 0, 1), xe = S(U, -1);
        if ((Ie === '"' || Ie === "'" || Ie === "`" || xe === '"' || xe === "'" || xe === "`") && Ie !== xe)
          throw new a("property names with quotes must have matching quotes");
        if ((U === "constructor" || !se) && (Re = !0), C += "." + U, Q = "%" + C + "%", R(g, Q))
          H = g[Q];
        else if (H != null) {
          if (!(U in H)) {
            if (!M)
              throw new i("base intrinsic for " + P + " exists, but the property is not available.");
            return;
          }
          if (l && Se + 1 >= _.length) {
            var Ee = l(H, U);
            se = !!Ee, se && "get" in Ee && !("originalValue" in Ee.get) ? H = Ee.get : H = H[U];
          } else
            se = R(H, U), H = H[U];
          se && !Re && (g[Q] = H);
        }
      }
      return H;
    }, "GetIntrinsic");
  }
}), f1 = T({
  "node_modules/call-bind/index.js"(e, t) {
    "use strict";
    var r = zt(), a = nr(), o = a("%Function.prototype.apply%"), i = a("%Function.prototype.call%"), s = a("%Reflect.apply%", !0) || r.call(
    i, o), l = a("%Object.getOwnPropertyDescriptor%", !0), c = a("%Object.defineProperty%", !0), d = a("%Math.max%");
    if (c)
      try {
        c({}, "a", { value: 1 });
      } catch {
        c = null;
      }
    t.exports = /* @__PURE__ */ n(function(p) {
      var v = s(r, i, arguments);
      if (l && c) {
        var g = l(v, "length");
        g.configurable && c(
          v,
          "length",
          { value: 1 + d(0, p.length - (arguments.length - 1)) }
        );
      }
      return v;
    }, "callBind");
    var h = /* @__PURE__ */ n(function() {
      return s(r, o, arguments);
    }, "applyBind2");
    c ? c(t.exports, "apply", { value: h }) : t.exports.apply = h;
  }
}), d1 = T({
  "node_modules/call-bind/callBound.js"(e, t) {
    "use strict";
    var r = nr(), a = f1(), o = a(r("String.prototype.indexOf"));
    t.exports = /* @__PURE__ */ n(function(s, l) {
      var c = r(s, !!l);
      return typeof c == "function" && o(s, ".prototype.") > -1 ? a(c) : c;
    }, "callBoundIntrinsic");
  }
}), h1 = T({
  "node_modules/has-tostringtag/shams.js"(e, t) {
    "use strict";
    var r = rr();
    t.exports = /* @__PURE__ */ n(function() {
      return r() && !!Symbol.toStringTag;
    }, "hasToStringTagShams");
  }
}), u1 = T({
  "node_modules/is-regex/index.js"(e, t) {
    "use strict";
    var r = d1(), a = h1()(), o, i, s, l;
    a && (o = r("Object.prototype.hasOwnProperty"), i = r("RegExp.prototype.exec"), s = {}, c = /* @__PURE__ */ n(function() {
      throw s;
    }, "throwRegexMarker"), l = {
      toString: c,
      valueOf: c
    }, typeof Symbol.toPrimitive == "symbol" && (l[Symbol.toPrimitive] = c));
    var c, d = r("Object.prototype.toString"), h = Object.getOwnPropertyDescriptor, u = "[object RegExp]";
    t.exports = /* @__PURE__ */ n(a ? function(v) {
      if (!v || typeof v != "object")
        return !1;
      var g = h(v, "lastIndex"), m = g && o(g, "value");
      if (!m)
        return !1;
      try {
        i(v, l);
      } catch (w) {
        return w === s;
      }
    } : function(v) {
      return !v || typeof v != "object" && typeof v != "function" ? !1 : d(v) === u;
    }, "isRegex");
  }
}), p1 = T({
  "node_modules/is-function/index.js"(e, t) {
    t.exports = a;
    var r = Object.prototype.toString;
    function a(o) {
      if (!o)
        return !1;
      var i = r.call(o);
      return i === "[object Function]" || typeof o == "function" && i !== "[object RegExp]" || typeof window < "u" && (o === window.setTimeout ||
      o === window.alert || o === window.confirm || o === window.prompt);
    }
    n(a, "isFunction3");
  }
}), v1 = T({
  "node_modules/is-symbol/index.js"(e, t) {
    "use strict";
    var r = Object.prototype.toString, a = ar()();
    a ? (o = Symbol.prototype.toString, i = /^Symbol\(.*\)$/, s = /* @__PURE__ */ n(function(c) {
      return typeof c.valueOf() != "symbol" ? !1 : i.test(o.call(c));
    }, "isRealSymbolObject"), t.exports = /* @__PURE__ */ n(function(c) {
      if (typeof c == "symbol")
        return !0;
      if (r.call(c) !== "[object Symbol]")
        return !1;
      try {
        return s(c);
      } catch {
        return !1;
      }
    }, "isSymbol3")) : t.exports = /* @__PURE__ */ n(function(c) {
      return !1;
    }, "isSymbol3");
    var o, i, s;
  }
}), m1 = De(u1()), g1 = De(p1()), w1 = De(v1());
function y1(e) {
  return e != null && typeof e == "object" && Array.isArray(e) === !1;
}
n(y1, "isObject");
var R1 = typeof global == "object" && global && global.Object === Object && global, S1 = R1, I1 = typeof self == "object" && self && self.Object ===
Object && self, x1 = S1 || I1 || Function("return this")(), Ht = x1, E1 = Ht.Symbol, te = E1, or = Object.prototype, A1 = or.hasOwnProperty,
P1 = or.toString, me = te ? te.toStringTag : void 0;
function _1(e) {
  var t = A1.call(e, me), r = e[me];
  try {
    e[me] = void 0;
    var a = !0;
  } catch {
  }
  var o = P1.call(e);
  return a && (t ? e[me] = r : delete e[me]), o;
}
n(_1, "getRawTag");
var b1 = _1, M1 = Object.prototype, C1 = M1.toString;
function z1(e) {
  return C1.call(e);
}
n(z1, "objectToString");
var H1 = z1, L1 = "[object Null]", O1 = "[object Undefined]", J0 = te ? te.toStringTag : void 0;
function T1(e) {
  return e == null ? e === void 0 ? O1 : L1 : J0 && J0 in Object(e) ? b1(e) : H1(e);
}
n(T1, "baseGetTag");
var lr = T1;
function B1(e) {
  return e != null && typeof e == "object";
}
n(B1, "isObjectLike");
var V1 = B1, D1 = "[object Symbol]";
function k1(e) {
  return typeof e == "symbol" || V1(e) && lr(e) == D1;
}
n(k1, "isSymbol");
var Lt = k1;
function N1(e, t) {
  for (var r = -1, a = e == null ? 0 : e.length, o = Array(a); ++r < a; )
    o[r] = t(e[r], r, e);
  return o;
}
n(N1, "arrayMap");
var F1 = N1, j1 = Array.isArray, Ot = j1, U1 = 1 / 0, Z0 = te ? te.prototype : void 0, X0 = Z0 ? Z0.toString : void 0;
function ir(e) {
  if (typeof e == "string")
    return e;
  if (Ot(e))
    return F1(e, ir) + "";
  if (Lt(e))
    return X0 ? X0.call(e) : "";
  var t = e + "";
  return t == "0" && 1 / e == -U1 ? "-0" : t;
}
n(ir, "baseToString");
var G1 = ir;
function $1(e) {
  var t = typeof e;
  return e != null && (t == "object" || t == "function");
}
n($1, "isObject2");
var cr = $1, W1 = "[object AsyncFunction]", K1 = "[object Function]", q1 = "[object GeneratorFunction]", Y1 = "[object Proxy]";
function Q1(e) {
  if (!cr(e))
    return !1;
  var t = lr(e);
  return t == K1 || t == q1 || t == W1 || t == Y1;
}
n(Q1, "isFunction");
var J1 = Q1, Z1 = Ht["__core-js_shared__"], Ct = Z1, er = function() {
  var e = /[^.]+$/.exec(Ct && Ct.keys && Ct.keys.IE_PROTO || "");
  return e ? "Symbol(src)_1." + e : "";
}();
function X1(e) {
  return !!er && er in e;
}
n(X1, "isMasked");
var en = X1, tn = Function.prototype, rn = tn.toString;
function an(e) {
  if (e != null) {
    try {
      return rn.call(e);
    } catch {
    }
    try {
      return e + "";
    } catch {
    }
  }
  return "";
}
n(an, "toSource");
var nn = an, on = /[\\^$.*+?()[\]{}|]/g, ln = /^\[object .+?Constructor\]$/, cn = Function.prototype, sn = Object.prototype, fn = cn.toString,
dn = sn.hasOwnProperty, hn = RegExp(
  "^" + fn.call(dn).replace(on, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
);
function un(e) {
  if (!cr(e) || en(e))
    return !1;
  var t = J1(e) ? hn : ln;
  return t.test(nn(e));
}
n(un, "baseIsNative");
var pn = un;
function vn(e, t) {
  return e?.[t];
}
n(vn, "getValue");
var mn = vn;
function gn(e, t) {
  var r = mn(e, t);
  return pn(r) ? r : void 0;
}
n(gn, "getNative");
var sr = gn;
function wn(e, t) {
  return e === t || e !== e && t !== t;
}
n(wn, "eq");
var yn = wn, Rn = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/, Sn = /^\w*$/;
function In(e, t) {
  if (Ot(e))
    return !1;
  var r = typeof e;
  return r == "number" || r == "symbol" || r == "boolean" || e == null || Lt(e) ? !0 : Sn.test(e) || !Rn.test(e) || t != null && e in Object(
  t);
}
n(In, "isKey");
var xn = In, En = sr(Object, "create"), ge = En;
function An() {
  this.__data__ = ge ? ge(null) : {}, this.size = 0;
}
n(An, "hashClear");
var Pn = An;
function _n(e) {
  var t = this.has(e) && delete this.__data__[e];
  return this.size -= t ? 1 : 0, t;
}
n(_n, "hashDelete");
var bn = _n, Mn = "__lodash_hash_undefined__", Cn = Object.prototype, zn = Cn.hasOwnProperty;
function Hn(e) {
  var t = this.__data__;
  if (ge) {
    var r = t[e];
    return r === Mn ? void 0 : r;
  }
  return zn.call(t, e) ? t[e] : void 0;
}
n(Hn, "hashGet");
var Ln = Hn, On = Object.prototype, Tn = On.hasOwnProperty;
function Bn(e) {
  var t = this.__data__;
  return ge ? t[e] !== void 0 : Tn.call(t, e);
}
n(Bn, "hashHas");
var Vn = Bn, Dn = "__lodash_hash_undefined__";
function kn(e, t) {
  var r = this.__data__;
  return this.size += this.has(e) ? 0 : 1, r[e] = ge && t === void 0 ? Dn : t, this;
}
n(kn, "hashSet");
var Nn = kn;
function re(e) {
  var t = -1, r = e == null ? 0 : e.length;
  for (this.clear(); ++t < r; ) {
    var a = e[t];
    this.set(a[0], a[1]);
  }
}
n(re, "Hash");
re.prototype.clear = Pn;
re.prototype.delete = bn;
re.prototype.get = Ln;
re.prototype.has = Vn;
re.prototype.set = Nn;
var tr = re;
function Fn() {
  this.__data__ = [], this.size = 0;
}
n(Fn, "listCacheClear");
var jn = Fn;
function Un(e, t) {
  for (var r = e.length; r--; )
    if (yn(e[r][0], t))
      return r;
  return -1;
}
n(Un, "assocIndexOf");
var Ne = Un, Gn = Array.prototype, $n = Gn.splice;
function Wn(e) {
  var t = this.__data__, r = Ne(t, e);
  if (r < 0)
    return !1;
  var a = t.length - 1;
  return r == a ? t.pop() : $n.call(t, r, 1), --this.size, !0;
}
n(Wn, "listCacheDelete");
var Kn = Wn;
function qn(e) {
  var t = this.__data__, r = Ne(t, e);
  return r < 0 ? void 0 : t[r][1];
}
n(qn, "listCacheGet");
var Yn = qn;
function Qn(e) {
  return Ne(this.__data__, e) > -1;
}
n(Qn, "listCacheHas");
var Jn = Qn;
function Zn(e, t) {
  var r = this.__data__, a = Ne(r, e);
  return a < 0 ? (++this.size, r.push([e, t])) : r[a][1] = t, this;
}
n(Zn, "listCacheSet");
var Xn = Zn;
function ae(e) {
  var t = -1, r = e == null ? 0 : e.length;
  for (this.clear(); ++t < r; ) {
    var a = e[t];
    this.set(a[0], a[1]);
  }
}
n(ae, "ListCache");
ae.prototype.clear = jn;
ae.prototype.delete = Kn;
ae.prototype.get = Yn;
ae.prototype.has = Jn;
ae.prototype.set = Xn;
var eo = ae, to = sr(Ht, "Map"), ro = to;
function ao() {
  this.size = 0, this.__data__ = {
    hash: new tr(),
    map: new (ro || eo)(),
    string: new tr()
  };
}
n(ao, "mapCacheClear");
var no = ao;
function oo(e) {
  var t = typeof e;
  return t == "string" || t == "number" || t == "symbol" || t == "boolean" ? e !== "__proto__" : e === null;
}
n(oo, "isKeyable");
var lo = oo;
function io(e, t) {
  var r = e.__data__;
  return lo(t) ? r[typeof t == "string" ? "string" : "hash"] : r.map;
}
n(io, "getMapData");
var Fe = io;
function co(e) {
  var t = Fe(this, e).delete(e);
  return this.size -= t ? 1 : 0, t;
}
n(co, "mapCacheDelete");
var so = co;
function fo(e) {
  return Fe(this, e).get(e);
}
n(fo, "mapCacheGet");
var ho = fo;
function uo(e) {
  return Fe(this, e).has(e);
}
n(uo, "mapCacheHas");
var po = uo;
function vo(e, t) {
  var r = Fe(this, e), a = r.size;
  return r.set(e, t), this.size += r.size == a ? 0 : 1, this;
}
n(vo, "mapCacheSet");
var mo = vo;
function ne(e) {
  var t = -1, r = e == null ? 0 : e.length;
  for (this.clear(); ++t < r; ) {
    var a = e[t];
    this.set(a[0], a[1]);
  }
}
n(ne, "MapCache");
ne.prototype.clear = no;
ne.prototype.delete = so;
ne.prototype.get = ho;
ne.prototype.has = po;
ne.prototype.set = mo;
var fr = ne, go = "Expected a function";
function Tt(e, t) {
  if (typeof e != "function" || t != null && typeof t != "function")
    throw new TypeError(go);
  var r = /* @__PURE__ */ n(function() {
    var a = arguments, o = t ? t.apply(this, a) : a[0], i = r.cache;
    if (i.has(o))
      return i.get(o);
    var s = e.apply(this, a);
    return r.cache = i.set(o, s) || i, s;
  }, "memoized");
  return r.cache = new (Tt.Cache || fr)(), r;
}
n(Tt, "memoize");
Tt.Cache = fr;
var wo = Tt, yo = 500;
function Ro(e) {
  var t = wo(e, function(a) {
    return r.size === yo && r.clear(), a;
  }), r = t.cache;
  return t;
}
n(Ro, "memoizeCapped");
var So = Ro, Io = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g, xo = /\\(\\)?/g, Eo = So(
function(e) {
  var t = [];
  return e.charCodeAt(0) === 46 && t.push(""), e.replace(Io, function(r, a, o, i) {
    t.push(o ? i.replace(xo, "$1") : a || r);
  }), t;
}), Ao = Eo;
function Po(e) {
  return e == null ? "" : G1(e);
}
n(Po, "toString");
var _o = Po;
function bo(e, t) {
  return Ot(e) ? e : xn(e, t) ? [e] : Ao(_o(e));
}
n(bo, "castPath");
var Mo = bo, Co = 1 / 0;
function zo(e) {
  if (typeof e == "string" || Lt(e))
    return e;
  var t = e + "";
  return t == "0" && 1 / e == -Co ? "-0" : t;
}
n(zo, "toKey");
var Ho = zo;
function Lo(e, t) {
  t = Mo(t, e);
  for (var r = 0, a = t.length; e != null && r < a; )
    e = e[Ho(t[r++])];
  return r && r == a ? e : void 0;
}
n(Lo, "baseGet");
var Oo = Lo;
function To(e, t, r) {
  var a = e == null ? void 0 : Oo(e, t);
  return a === void 0 ? r : a;
}
n(To, "get");
var Bo = To, ke = y1, Vo = /* @__PURE__ */ n((e) => {
  let t = null, r = !1, a = !1, o = !1, i = "";
  if (e.indexOf("//") >= 0 || e.indexOf("/*") >= 0)
    for (let s = 0; s < e.length; s += 1)
      !t && !r && !a && !o ? e[s] === '"' || e[s] === "'" || e[s] === "`" ? t = e[s] : e[s] === "/" && e[s + 1] === "*" ? r = !0 : e[s] === "\
/" && e[s + 1] === "/" ? a = !0 : e[s] === "/" && e[s + 1] !== "/" && (o = !0) : (t && (e[s] === t && e[s - 1] !== "\\" || e[s] === `
` && t !== "`") && (t = null), o && (e[s] === "/" && e[s - 1] !== "\\" || e[s] === `
`) && (o = !1), r && e[s - 1] === "/" && e[s - 2] === "*" && (r = !1), a && e[s] === `
` && (a = !1)), !r && !a && (i += e[s]);
  else
    i = e;
  return i;
}, "removeCodeComments"), Do = (0, dr.default)(1e4)(
  (e) => Vo(e).replace(/\n\s*/g, "").trim()
), ko = /* @__PURE__ */ n(function(t, r) {
  let a = r.slice(0, r.indexOf("{")), o = r.slice(r.indexOf("{"));
  if (a.includes("=>") || a.includes("function"))
    return r;
  let i = a;
  return i = i.replace(t, "function"), i + o;
}, "convertShorthandMethods2"), No = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/, Fo = /* @__PURE__ */ n((e) => e.match(/^[\[\{\"\}].*[\]\}\"]$/),
"isJSON");
function hr(e) {
  if (!ke(e))
    return e;
  let t = e, r = !1;
  return typeof Event < "u" && e instanceof Event && (t = Q0(t), r = !0), t = Object.keys(t).reduce((a, o) => {
    try {
      t[o] && t[o].toJSON, a[o] = t[o];
    } catch {
      r = !0;
    }
    return a;
  }, {}), r ? t : e;
}
n(hr, "convertUnconventionalData");
var jo = /* @__PURE__ */ n(function(t) {
  let r, a, o, i;
  return /* @__PURE__ */ n(function(l, c) {
    try {
      if (l === "")
        return i = [], r = /* @__PURE__ */ new Map([[c, "[]"]]), a = /* @__PURE__ */ new Map(), o = [], c;
      let d = a.get(this) || this;
      for (; o.length && d !== o[0]; )
        o.shift(), i.pop();
      if (typeof c == "boolean")
        return c;
      if (c === void 0)
        return t.allowUndefined ? "_undefined_" : void 0;
      if (c === null)
        return null;
      if (typeof c == "number")
        return c === -1 / 0 ? "_-Infinity_" : c === 1 / 0 ? "_Infinity_" : Number.isNaN(c) ? "_NaN_" : c;
      if (typeof c == "bigint")
        return `_bigint_${c.toString()}`;
      if (typeof c == "string")
        return No.test(c) ? t.allowDate ? `_date_${c}` : void 0 : c;
      if ((0, m1.default)(c))
        return t.allowRegExp ? `_regexp_${c.flags}|${c.source}` : void 0;
      if ((0, g1.default)(c)) {
        if (!t.allowFunction)
          return;
        let { name: u } = c, p = c.toString();
        return p.match(
          /(\[native code\]|WEBPACK_IMPORTED_MODULE|__webpack_exports__|__webpack_require__)/
        ) ? `_function_${u}|${(() => {
        }).toString()}` : `_function_${u}|${Do(ko(l, p))}`;
      }
      if ((0, w1.default)(c)) {
        if (!t.allowSymbol)
          return;
        let u = Symbol.keyFor(c);
        return u !== void 0 ? `_gsymbol_${u}` : `_symbol_${c.toString().slice(7, -1)}`;
      }
      if (o.length >= t.maxDepth)
        return Array.isArray(c) ? `[Array(${c.length})]` : "[Object]";
      if (c === this)
        return `_duplicate_${JSON.stringify(i)}`;
      if (c instanceof Error && t.allowError)
        return {
          __isConvertedError__: !0,
          errorProperties: {
            ...c.cause ? { cause: c.cause } : {},
            ...c,
            name: c.name,
            message: c.message,
            stack: c.stack,
            "_constructor-name_": c.constructor.name
          }
        };
      if (c.constructor && c.constructor.name && c.constructor.name !== "Object" && !Array.isArray(c) && !t.allowClass)
        return;
      let h = r.get(c);
      if (!h) {
        let u = Array.isArray(c) ? c : hr(c);
        if (c.constructor && c.constructor.name && c.constructor.name !== "Object" && !Array.isArray(c) && t.allowClass)
          try {
            Object.assign(u, { "_constructor-name_": c.constructor.name });
          } catch {
          }
        return i.push(l), o.unshift(u), r.set(c, JSON.stringify(i)), c !== u && a.set(c, u), u;
      }
      return `_duplicate_${h}`;
    } catch {
      return;
    }
  }, "replace");
}, "replacer2"), Uo = /* @__PURE__ */ n(function reviver(options) {
  let refs = [], root;
  return /* @__PURE__ */ n(function revive(key, value) {
    if (key === "" && (root = value, refs.forEach(({ target: e, container: t, replacement: r }) => {
      let a = Fo(r) ? JSON.parse(r) : r.split(".");
      a.length === 0 ? t[e] = root : t[e] = Bo(root, a);
    })), key === "_constructor-name_")
      return value;
    if (ke(value) && value.__isConvertedError__) {
      let { message: e, ...t } = value.errorProperties, r = new Error(e);
      return Object.assign(r, t), r;
    }
    if (ke(value) && value["_constructor-name_"] && options.allowFunction) {
      let e = value["_constructor-name_"];
      if (e !== "Object") {
        let t = new Function(`return function ${e.replace(/[^a-zA-Z0-9$_]+/g, "")}(){}`)();
        Object.setPrototypeOf(value, new t());
      }
      return delete value["_constructor-name_"], value;
    }
    if (typeof value == "string" && value.startsWith("_function_") && options.allowFunction) {
      let [, name, source] = value.match(/_function_([^|]*)\|(.*)/) || [], sourceSanitized = source.replace(/[(\(\))|\\| |\]|`]*$/, "");
      if (!options.lazyEval)
        return eval(`(${sourceSanitized})`);
      let result = /* @__PURE__ */ n((...args) => {
        let f = eval(`(${sourceSanitized})`);
        return f(...args);
      }, "result");
      return Object.defineProperty(result, "toString", {
        value: /* @__PURE__ */ n(() => sourceSanitized, "value")
      }), Object.defineProperty(result, "name", {
        value: name
      }), result;
    }
    if (typeof value == "string" && value.startsWith("_regexp_") && options.allowRegExp) {
      let [, e, t] = value.match(/_regexp_([^|]*)\|(.*)/) || [];
      return new RegExp(t, e);
    }
    return typeof value == "string" && value.startsWith("_date_") && options.allowDate ? new Date(value.replace("_date_", "")) : typeof value ==
    "string" && value.startsWith("_duplicate_") ? (refs.push({ target: key, container: this, replacement: value.replace(/^_duplicate_/, "") }),
    null) : typeof value == "string" && value.startsWith("_symbol_") && options.allowSymbol ? Symbol(value.replace("_symbol_", "")) : typeof value ==
    "string" && value.startsWith("_gsymbol_") && options.allowSymbol ? Symbol.for(value.replace("_gsymbol_", "")) : typeof value == "string" &&
    value === "_-Infinity_" ? -1 / 0 : typeof value == "string" && value === "_Infinity_" ? 1 / 0 : typeof value == "string" && value === "_\
NaN_" ? NaN : typeof value == "string" && value.startsWith("_bigint_") && typeof BigInt == "function" ? BigInt(value.replace("_bigint_", "")) :
    value;
  }, "revive");
}, "reviver"), ur = {
  maxDepth: 10,
  space: void 0,
  allowFunction: !0,
  allowRegExp: !0,
  allowDate: !0,
  allowClass: !0,
  allowError: !0,
  allowUndefined: !0,
  allowSymbol: !0,
  lazyEval: !0
}, pr = /* @__PURE__ */ n((e, t = {}) => {
  let r = { ...ur, ...t };
  return JSON.stringify(hr(e), jo(r), t.space);
}, "stringify"), Go = /* @__PURE__ */ n(() => {
  let e = /* @__PURE__ */ new Map();
  return /* @__PURE__ */ n(function t(r) {
    ke(r) && Object.entries(r).forEach(([a, o]) => {
      o === "_undefined_" ? r[a] = void 0 : e.get(o) || (e.set(o, !0), t(o));
    }), Array.isArray(r) && r.forEach((a, o) => {
      a === "_undefined_" ? (e.set(a, !0), r[o] = void 0) : e.get(a) || (e.set(a, !0), t(a));
    });
  }, "mutateUndefined");
}, "mutator"), vr = /* @__PURE__ */ n((e, t = {}) => {
  let r = { ...ur, ...t }, a = JSON.parse(e, Uo(r));
  return Go()(a), a;
}, "parse");

// src/manager-api/lib/store-setup.ts
var mr = /* @__PURE__ */ n((e) => {
  e.fn("set", function(t, r) {
    return e.set(this._area, this._in(t), pr(r, { maxDepth: 50 }));
  }), e.fn("get", function(t, r) {
    let a = e.get(this._area, this._in(t));
    return a !== null ? vr(a) : r || a;
  });
}, "default");

// src/manager-api/store.ts
mr(oe.default._);
var gr = "@storybook/manager/store";
function Bt(e) {
  return e.get(gr) || {};
}
n(Bt, "get");
function $o(e, t) {
  return e.set(gr, t);
}
n($o, "set");
function Wo(e, t) {
  let r = Bt(e);
  return $o(e, { ...r, ...t });
}
n(Wo, "update");
var Vt = class Vt {
  constructor({ setState: t, getState: r }) {
    this.upstreamSetState = t, this.upstreamGetState = r;
  }
  // The assumption is that this will be called once, to initialize the React state
  // when the module is instantiated
  getInitialState(t) {
    return { ...t, ...Bt(oe.default.local), ...Bt(oe.default.session) };
  }
  getState() {
    return this.upstreamGetState();
  }
  async setState(t, r, a) {
    let o, i;
    typeof r == "function" ? (o = r, i = a) : i = r;
    let { persistence: s = "none" } = i || {}, l = {}, c = {};
    typeof t == "function" ? l = /* @__PURE__ */ n((h) => (c = t(h), c), "patch") : (l = t, c = l);
    let d = await new Promise((h) => {
      this.upstreamSetState(l, () => {
        h(this.getState());
      });
    });
    if (s !== "none") {
      let h = s === "session" ? oe.default.session : oe.default.local;
      await Wo(h, c);
    }
    return o && o(d), d;
  }
};
n(Vt, "Store");
var we = Vt;

// src/manager-api/lib/request-response.ts
var Dt = class Dt extends Error {
  constructor(r, a) {
    super(r);
    this.payload = void 0;
    this.payload = a;
  }
};
n(Dt, "RequestResponseError");
var je = Dt, nc = /* @__PURE__ */ n((e, t, r, a, o = 5e3) => {
  let i;
  return new Promise((s, l) => {
    let c = {
      id: Math.random().toString(16).slice(2),
      payload: a
    }, d = /* @__PURE__ */ n((h) => {
      h.id === c.id && (clearTimeout(i), e.off(r, d), h.success ? s(h.payload) : l(new je(h.error, h.payload)));
    }, "responseHandler");
    e.emit(t, c), e.on(r, d), i = setTimeout(() => {
      e.off(r, d), l(new je("Timed out waiting for response"));
    }, o);
  });
}, "experimental_requestResponse");

// src/manager-api/root.tsx
var { ActiveTabs: vc } = Oe;
var Ge = Ut({ api: void 0, state: Ce({}) }), z0 = /* @__PURE__ */ n((...e) => w0({}, ...e), "combineParameters"), Ue = class Ue extends Ko {
  constructor(r) {
    super(r);
    this.api = {};
    this.initModules = /* @__PURE__ */ n(() => {
      this.modules.forEach((r) => {
        "init" in r && r.init();
      });
    }, "initModules");
    let {
      location: a,
      path: o,
      refId: i,
      viewMode: s = r.docsOptions.docsMode ? "docs" : r.viewMode,
      singleStory: l,
      storyId: c,
      docsOptions: d,
      navigate: h
    } = r, u = new we({
      getState: /* @__PURE__ */ n(() => this.state, "getState"),
      setState: /* @__PURE__ */ n((y, R) => (this.setState(y, () => R(this.state)), this.state), "setState")
    }), p = { location: a, path: o, viewMode: s, singleStory: l, storyId: c, refId: i }, v = { docsOptions: d };
    this.state = u.getInitialState(Ce({ ...p, ...v }));
    let g = {
      navigate: h,
      store: u,
      provider: r.provider
    };
    this.modules = [
      ut,
      nt,
      at,
      Oe,
      ht,
      pt,
      It,
      Et,
      ct,
      st,
      _t,
      bt,
      Mt
    ].map(
      (y) => y.init({ ...p, ...v, ...g, state: this.state, fullAPI: this.api })
    );
    let m = Ce(this.state, ...this.modules.map((y) => y.state)), w = Object.assign(this.api, { navigate: h }, ...this.modules.map((y) => y.api));
    this.state = m, this.api = w;
  }
  static getDerivedStateFromProps(r, a) {
    return a.path !== r.path ? {
      ...a,
      location: r.location,
      path: r.path,
      refId: r.refId,
      viewMode: r.viewMode,
      storyId: r.storyId
    } : null;
  }
  shouldComponentUpdate(r, a) {
    let o = this.state, i = this.props;
    return o !== a || i.path !== r.path;
  }
  render() {
    let { children: r } = this.props, a = {
      state: this.state,
      api: this.api
    };
    return /* @__PURE__ */ le.createElement(Jo, { effect: this.initModules }, /* @__PURE__ */ le.createElement(Ge.Provider, { value: a }, /* @__PURE__ */ le.
    createElement(Xo, null, r)));
  }
};
n(Ue, "ManagerProvider"), Ue.displayName = "Manager";
var Sr = Ue, Jo = /* @__PURE__ */ n(({ children: e, effect: t }) => (le.useEffect(t, []), e), "EffectOnMount"), Zo = /* @__PURE__ */ n((e) => e,
"defaultFilter");
function Xo({
  // @ts-expect-error (Converted from ts-ignore)
  filter: e = Zo,
  children: t
}) {
  let r = Ft(Ge), a = yr(t), o = yr(e);
  if (typeof a.current != "function")
    return /* @__PURE__ */ le.createElement(qo, null, a.current);
  let i = o.current(r), s = Nt(() => [...Object.entries(i).reduce((l, c) => l.concat(c), [])], [r.state]);
  return Nt(() => {
    let l = a.current;
    return /* @__PURE__ */ le.createElement(l, { ...i });
  }, s);
}
n(Xo, "ManagerConsumer");
function mc() {
  let { state: e } = Ft(Ge);
  return {
    ...e,
    // deprecated fields for back-compat
    get storiesHash() {
      return kt("state.storiesHash is deprecated, please use state.index"), this.index || {};
    },
    get storiesConfigured() {
      return kt("state.storiesConfigured is deprecated, please use state.previewInitialized"), this.previewInitialized;
    },
    get storiesFailed() {
      return kt("state.storiesFailed is deprecated, please use state.indexError"), this.indexError;
    }
  };
}
n(mc, "useStorybookState");
function K() {
  let { api: e } = Ft(Ge);
  return e;
}
n(K, "useStorybookApi");
function xr(e, t) {
  return typeof e > "u" ? t : e;
}
n(xr, "orDefault");
var e5 = /* @__PURE__ */ n((e, t = []) => {
  let r = K();
  return Ir(() => (Object.entries(e).forEach(([a, o]) => r.on(a, o)), () => {
    Object.entries(e).forEach(([a, o]) => r.off(a, o));
  }), t), r.emit;
}, "useChannel");
function gc(e) {
  return K().isPrepared(e);
}
n(gc, "useStoryPrepared");
function wc(e, t) {
  let a = K().getCurrentParameter(e);
  return xr(a, t);
}
n(wc, "useParameter");
globalThis.STORYBOOK_ADDON_STATE = {};
var { STORYBOOK_ADDON_STATE: j } = globalThis;
function t5(e, t) {
  let r = K(), a = r.getAddonState(e) || j[e], o = xr(
    a,
    j[e] ? j[e] : t
  ), i = !1;
  o === t && t !== void 0 && (j[e] = t, i = !0), Ir(() => {
    i && r.setAddonState(e, t);
  }, [i]);
  let s = /* @__PURE__ */ n(async (d, h) => {
    await r.setAddonState(e, d, h);
    let u = r.getAddonState(e);
    return j[e] = u, u;
  }, "setState"), l = Nt(() => {
    let d = {
      [`${Rr}-client-${e}`]: s,
      [`${ye}-client-${e}`]: s
    }, h = {
      [Yo]: async () => {
        let u = r.getAddonState(e);
        u ? (j[e] = u, r.emit(`${ye}-manager-${e}`, u)) : j[e] ? (await s(j[e]), r.emit(`${ye}-manager-${e}`, j[e])) : t !== void 0 && (await s(
        t), j[e] = t, r.emit(`${ye}-manager-${e}`, t));
      },
      [Qo]: () => {
        let u = r.getAddonState(e);
        u !== void 0 && r.emit(`${ye}-manager-${e}`, u);
      }
    };
    return {
      ...d,
      ...h
    };
  }, [e]), c = e5(l);
  return [
    o,
    async (d, h) => {
      await s(d, h);
      let u = r.getAddonState(e);
      c(`${Rr}-manager-${e}`, u);
    }
  ];
}
n(t5, "useSharedState");
function yc(e, t) {
  return t5(e, t);
}
n(yc, "useAddonState");
function Rc() {
  let { getCurrentStoryData: e, updateStoryArgs: t, resetStoryArgs: r } = K(), a = e(), o = a?.type === "story" ? a.args : {}, i = a?.type ===
  "story" ? a.initialArgs : {}, s = wr(
    (c) => t(a, c),
    [a, t]
  ), l = wr(
    (c) => r(a, c),
    [a, r]
  );
  return [o, s, l, i];
}
n(Rc, "useArgs");
function Sc() {
  let e = K();
  return [e.getGlobals(), e.updateGlobals, e.getStoryGlobals(), e.getUserGlobals()];
}
n(Sc, "useGlobals");
function Ic() {
  return K().getGlobalTypes();
}
n(Ic, "useGlobalTypes");
function r5() {
  let { getCurrentStoryData: e } = K();
  return e();
}
n(r5, "useCurrentStory");
function xc() {
  let e = r5();
  return e?.type === "story" && e.argTypes || {};
}
n(xc, "useArgTypes");
var Ec = R0;
export {
  vc as ActiveTabs,
  Xo as Consumer,
  Ge as ManagerContext,
  Sr as Provider,
  je as RequestResponseError,
  Br as addons,
  z0 as combineParameters,
  di as controlOrMetaKey,
  fi as controlOrMetaSymbol,
  ui as eventMatchesShortcut,
  gt as eventToShortcut,
  nc as experimental_requestResponse,
  mt as isMacLike,
  hi as isShortcutTaken,
  ca as keyToSymbol,
  F as merge,
  Ze as mockChannel,
  ia as optionOrAltSymbol,
  wt as shortcutMatchesShortcut,
  pi as shortcutToHumanString,
  Ec as types,
  yc as useAddonState,
  xc as useArgTypes,
  Rc as useArgs,
  e5 as useChannel,
  Ic as useGlobalTypes,
  Sc as useGlobals,
  wc as useParameter,
  t5 as useSharedState,
  gc as useStoryPrepared,
  K as useStorybookApi,
  mc as useStorybookState
};
