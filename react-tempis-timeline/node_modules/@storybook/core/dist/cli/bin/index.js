import ESM_COMPAT_Module from "node:module";
import { fileURLToPath as ESM_COMPAT_fileURLToPath } from 'node:url';
import { dirname as ESM_COMPAT_dirname } from 'node:path';
const __filename = ESM_COMPAT_fileURLToPath(import.meta.url);
const __dirname = ESM_COMPAT_dirname(__filename);
const require = ESM_COMPAT_Module.createRequire(import.meta.url);
var Pe = Object.create;
var F = Object.defineProperty;
var De = Object.getOwnPropertyDescriptor;
var Ne = Object.getOwnPropertyNames;
var Te = Object.getPrototypeOf, Ie = Object.prototype.hasOwnProperty;
var u = (s, e) => F(s, "name", { value: e, configurable: !0 }), O = /* @__PURE__ */ ((s) => typeof require < "u" ? require : typeof Proxy < "\
u" ? new Proxy(s, {
  get: (e, t) => (typeof require < "u" ? require : e)[t]
}) : s)(function(s) {
  if (typeof require < "u") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + s + '" is not supported');
});
var _ = (s, e) => () => (e || s((e = { exports: {} }).exports, e), e.exports);
var Fe = (s, e, t, i) => {
  if (e && typeof e == "object" || typeof e == "function")
    for (let n of Ne(e))
      !Ie.call(s, n) && n !== t && F(s, n, { get: () => e[n], enumerable: !(i = De(e, n)) || i.enumerable });
  return s;
};
var S = (s, e, t) => (t = s != null ? Pe(Te(s)) : {}, Fe(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  e || !s || !s.__esModule ? F(t, "default", { value: s, enumerable: !0 }) : t,
  s
));

// ../node_modules/commander/lib/error.js
var A = _((q) => {
  var $ = class extends Error {
    static {
      u(this, "CommanderError");
    }
    /**
     * Constructs the CommanderError class
     * @param {number} exitCode suggested exit code which could be used with process.exit
     * @param {string} code an id string representing the error
     * @param {string} message human-readable description of the error
     */
    constructor(e, t, i) {
      super(i), Error.captureStackTrace(this, this.constructor), this.name = this.constructor.name, this.code = t, this.exitCode = e, this.nestedError =
      void 0;
    }
  }, B = class extends $ {
    static {
      u(this, "InvalidArgumentError");
    }
    /**
     * Constructs the InvalidArgumentError class
     * @param {string} [message] explanation of why argument is invalid
     */
    constructor(e) {
      super(1, "commander.invalidArgument", e), Error.captureStackTrace(this, this.constructor), this.name = this.constructor.name;
    }
  };
  q.CommanderError = $;
  q.InvalidArgumentError = B;
});

// ../node_modules/commander/lib/argument.js
var V = _((W) => {
  var { InvalidArgumentError: Be } = A(), j = class {
    static {
      u(this, "Argument");
    }
    /**
     * Initialize a new command argument with the given name and description.
     * The default is that the argument is required, and you can explicitly
     * indicate this with <> around the name. Put [] around the name for an optional argument.
     *
     * @param {string} name
     * @param {string} [description]
     */
    constructor(e, t) {
      switch (this.description = t || "", this.variadic = !1, this.parseArg = void 0, this.defaultValue = void 0, this.defaultValueDescription =
      void 0, this.argChoices = void 0, e[0]) {
        case "<":
          this.required = !0, this._name = e.slice(1, -1);
          break;
        case "[":
          this.required = !1, this._name = e.slice(1, -1);
          break;
        default:
          this.required = !0, this._name = e;
          break;
      }
      this._name.length > 3 && this._name.slice(-3) === "..." && (this.variadic = !0, this._name = this._name.slice(0, -3));
    }
    /**
     * Return argument name.
     *
     * @return {string}
     */
    name() {
      return this._name;
    }
    /**
     * @package
     */
    _concatValue(e, t) {
      return t === this.defaultValue || !Array.isArray(t) ? [e] : t.concat(e);
    }
    /**
     * Set the default value, and optionally supply the description to be displayed in the help.
     *
     * @param {*} value
     * @param {string} [description]
     * @return {Argument}
     */
    default(e, t) {
      return this.defaultValue = e, this.defaultValueDescription = t, this;
    }
    /**
     * Set the custom handler for processing CLI command arguments into argument values.
     *
     * @param {Function} [fn]
     * @return {Argument}
     */
    argParser(e) {
      return this.parseArg = e, this;
    }
    /**
     * Only allow argument value to be one of choices.
     *
     * @param {string[]} values
     * @return {Argument}
     */
    choices(e) {
      return this.argChoices = e.slice(), this.parseArg = (t, i) => {
        if (!this.argChoices.includes(t))
          throw new Be(
            `Allowed choices are ${this.argChoices.join(", ")}.`
          );
        return this.variadic ? this._concatValue(t, i) : t;
      }, this;
    }
    /**
     * Make argument required.
     *
     * @returns {Argument}
     */
    argRequired() {
      return this.required = !0, this;
    }
    /**
     * Make argument optional.
     *
     * @returns {Argument}
     */
    argOptional() {
      return this.required = !1, this;
    }
  };
  function qe(s) {
    let e = s.name() + (s.variadic === !0 ? "..." : "");
    return s.required ? "<" + e + ">" : "[" + e + "]";
  }
  u(qe, "humanReadableArgName");
  W.Argument = j;
  W.humanReadableArgName = qe;
});

// ../node_modules/commander/lib/help.js
var L = _((se) => {
  var { humanReadableArgName: je } = V(), M = class {
    static {
      u(this, "Help");
    }
    constructor() {
      this.helpWidth = void 0, this.sortSubcommands = !1, this.sortOptions = !1, this.showGlobalOptions = !1;
    }
    /**
     * Get an array of the visible subcommands. Includes a placeholder for the implicit help command, if there is one.
     *
     * @param {Command} cmd
     * @returns {Command[]}
     */
    visibleCommands(e) {
      let t = e.commands.filter((n) => !n._hidden), i = e._getHelpCommand();
      return i && !i._hidden && t.push(i), this.sortSubcommands && t.sort((n, r) => n.name().localeCompare(r.name())), t;
    }
    /**
     * Compare options for sort.
     *
     * @param {Option} a
     * @param {Option} b
     * @returns {number}
     */
    compareOptions(e, t) {
      let i = /* @__PURE__ */ u((n) => n.short ? n.short.replace(/^-/, "") : n.long.replace(/^--/, ""), "getSortKey");
      return i(e).localeCompare(i(t));
    }
    /**
     * Get an array of the visible options. Includes a placeholder for the implicit help option, if there is one.
     *
     * @param {Command} cmd
     * @returns {Option[]}
     */
    visibleOptions(e) {
      let t = e.options.filter((n) => !n.hidden), i = e._getHelpOption();
      if (i && !i.hidden) {
        let n = i.short && e._findOption(i.short), r = i.long && e._findOption(i.long);
        !n && !r ? t.push(i) : i.long && !r ? t.push(
          e.createOption(i.long, i.description)
        ) : i.short && !n && t.push(
          e.createOption(i.short, i.description)
        );
      }
      return this.sortOptions && t.sort(this.compareOptions), t;
    }
    /**
     * Get an array of the visible global options. (Not including help.)
     *
     * @param {Command} cmd
     * @returns {Option[]}
     */
    visibleGlobalOptions(e) {
      if (!this.showGlobalOptions) return [];
      let t = [];
      for (let i = e.parent; i; i = i.parent) {
        let n = i.options.filter(
          (r) => !r.hidden
        );
        t.push(...n);
      }
      return this.sortOptions && t.sort(this.compareOptions), t;
    }
    /**
     * Get an array of the arguments if any have a description.
     *
     * @param {Command} cmd
     * @returns {Argument[]}
     */
    visibleArguments(e) {
      return e._argsDescription && e.registeredArguments.forEach((t) => {
        t.description = t.description || e._argsDescription[t.name()] || "";
      }), e.registeredArguments.find((t) => t.description) ? e.registeredArguments : [];
    }
    /**
     * Get the command term to show in the list of subcommands.
     *
     * @param {Command} cmd
     * @returns {string}
     */
    subcommandTerm(e) {
      let t = e.registeredArguments.map((i) => je(i)).join(" ");
      return e._name + (e._aliases[0] ? "|" + e._aliases[0] : "") + (e.options.length ? " [options]" : "") + // simplistic check for non-help option
      (t ? " " + t : "");
    }
    /**
     * Get the option term to show in the list of options.
     *
     * @param {Option} option
     * @returns {string}
     */
    optionTerm(e) {
      return e.flags;
    }
    /**
     * Get the argument term to show in the list of arguments.
     *
     * @param {Argument} argument
     * @returns {string}
     */
    argumentTerm(e) {
      return e.name();
    }
    /**
     * Get the longest command term length.
     *
     * @param {Command} cmd
     * @param {Help} helper
     * @returns {number}
     */
    longestSubcommandTermLength(e, t) {
      return t.visibleCommands(e).reduce((i, n) => Math.max(i, t.subcommandTerm(n).length), 0);
    }
    /**
     * Get the longest option term length.
     *
     * @param {Command} cmd
     * @param {Help} helper
     * @returns {number}
     */
    longestOptionTermLength(e, t) {
      return t.visibleOptions(e).reduce((i, n) => Math.max(i, t.optionTerm(n).length), 0);
    }
    /**
     * Get the longest global option term length.
     *
     * @param {Command} cmd
     * @param {Help} helper
     * @returns {number}
     */
    longestGlobalOptionTermLength(e, t) {
      return t.visibleGlobalOptions(e).reduce((i, n) => Math.max(i, t.optionTerm(n).length), 0);
    }
    /**
     * Get the longest argument term length.
     *
     * @param {Command} cmd
     * @param {Help} helper
     * @returns {number}
     */
    longestArgumentTermLength(e, t) {
      return t.visibleArguments(e).reduce((i, n) => Math.max(i, t.argumentTerm(n).length), 0);
    }
    /**
     * Get the command usage to be displayed at the top of the built-in help.
     *
     * @param {Command} cmd
     * @returns {string}
     */
    commandUsage(e) {
      let t = e._name;
      e._aliases[0] && (t = t + "|" + e._aliases[0]);
      let i = "";
      for (let n = e.parent; n; n = n.parent)
        i = n.name() + " " + i;
      return i + t + " " + e.usage();
    }
    /**
     * Get the description for the command.
     *
     * @param {Command} cmd
     * @returns {string}
     */
    commandDescription(e) {
      return e.description();
    }
    /**
     * Get the subcommand summary to show in the list of subcommands.
     * (Fallback to description for backwards compatibility.)
     *
     * @param {Command} cmd
     * @returns {string}
     */
    subcommandDescription(e) {
      return e.summary() || e.description();
    }
    /**
     * Get the option description to show in the list of options.
     *
     * @param {Option} option
     * @return {string}
     */
    optionDescription(e) {
      let t = [];
      return e.argChoices && t.push(
        // use stringify to match the display of the default value
        `choices: ${e.argChoices.map((i) => JSON.stringify(i)).join(", ")}`
      ), e.defaultValue !== void 0 && (e.required || e.optional || e.isBoolean() && typeof e.defaultValue == "boolean") && t.push(
        `default: ${e.defaultValueDescription || JSON.stringify(e.defaultValue)}`
      ), e.presetArg !== void 0 && e.optional && t.push(`preset: ${JSON.stringify(e.presetArg)}`), e.envVar !== void 0 && t.push(`env: ${e.envVar}`),
      t.length > 0 ? `${e.description} (${t.join(", ")})` : e.description;
    }
    /**
     * Get the argument description to show in the list of arguments.
     *
     * @param {Argument} argument
     * @return {string}
     */
    argumentDescription(e) {
      let t = [];
      if (e.argChoices && t.push(
        // use stringify to match the display of the default value
        `choices: ${e.argChoices.map((i) => JSON.stringify(i)).join(", ")}`
      ), e.defaultValue !== void 0 && t.push(
        `default: ${e.defaultValueDescription || JSON.stringify(e.defaultValue)}`
      ), t.length > 0) {
        let i = `(${t.join(", ")})`;
        return e.description ? `${e.description} ${i}` : i;
      }
      return e.description;
    }
    /**
     * Generate the built-in help text.
     *
     * @param {Command} cmd
     * @param {Help} helper
     * @returns {string}
     */
    formatHelp(e, t) {
      let i = t.padWidth(e, t), n = t.helpWidth || 80, r = 2, o = 2;
      function l(f, x) {
        if (x) {
          let I = `${f.padEnd(i + o)}${x}`;
          return t.wrap(
            I,
            n - r,
            i + o
          );
        }
        return f;
      }
      u(l, "formatItem");
      function a(f) {
        return f.join(`
`).replace(/^/gm, " ".repeat(r));
      }
      u(a, "formatList");
      let h = [`Usage: ${t.commandUsage(e)}`, ""], c = t.commandDescription(e);
      c.length > 0 && (h = h.concat([
        t.wrap(c, n, 0),
        ""
      ]));
      let m = t.visibleArguments(e).map((f) => l(
        t.argumentTerm(f),
        t.argumentDescription(f)
      ));
      m.length > 0 && (h = h.concat(["Arguments:", a(m), ""]));
      let d = t.visibleOptions(e).map((f) => l(
        t.optionTerm(f),
        t.optionDescription(f)
      ));
      if (d.length > 0 && (h = h.concat(["Options:", a(d), ""])), this.showGlobalOptions) {
        let f = t.visibleGlobalOptions(e).map((x) => l(
          t.optionTerm(x),
          t.optionDescription(x)
        ));
        f.length > 0 && (h = h.concat([
          "Global Options:",
          a(f),
          ""
        ]));
      }
      let b = t.visibleCommands(e).map((f) => l(
        t.subcommandTerm(f),
        t.subcommandDescription(f)
      ));
      return b.length > 0 && (h = h.concat(["Commands:", a(b), ""])), h.join(`
`);
    }
    /**
     * Calculate the pad width from the maximum term length.
     *
     * @param {Command} cmd
     * @param {Help} helper
     * @returns {number}
     */
    padWidth(e, t) {
      return Math.max(
        t.longestOptionTermLength(e, t),
        t.longestGlobalOptionTermLength(e, t),
        t.longestSubcommandTermLength(e, t),
        t.longestArgumentTermLength(e, t)
      );
    }
    /**
     * Wrap the given string to width characters per line, with lines after the first indented.
     * Do not wrap if insufficient room for wrapping (minColumnWidth), or string is manually formatted.
     *
     * @param {string} str
     * @param {number} width
     * @param {number} indent
     * @param {number} [minColumnWidth=40]
     * @return {string}
     *
     */
    wrap(e, t, i, n = 40) {
      let r = " \\f\\t\\v\xA0\u1680\u2000-\u200A\u202F\u205F\u3000\uFEFF", o = new RegExp(`[\\n][${r}]+`);
      if (e.match(o)) return e;
      let l = t - i;
      if (l < n) return e;
      let a = e.slice(0, i), h = e.slice(i).replace(`\r
`, `
`), c = " ".repeat(i), d = "\\s\u200B", b = new RegExp(
        `
|.{1,${l - 1}}([${d}]|$)|[^${d}]+?([${d}]|$)`,
        "g"
      ), f = h.match(b) || [];
      return a + f.map((x, I) => x === `
` ? "" : (I > 0 ? c : "") + x.trimEnd()).join(`
`);
    }
  };
  se.Help = M;
});

// ../node_modules/commander/lib/option.js
var J = _((U) => {
  var { InvalidArgumentError: We } = A(), R = class {
    static {
      u(this, "Option");
    }
    /**
     * Initialize a new `Option` with the given `flags` and `description`.
     *
     * @param {string} flags
     * @param {string} [description]
     */
    constructor(e, t) {
      this.flags = e, this.description = t || "", this.required = e.includes("<"), this.optional = e.includes("["), this.variadic = /\w\.\.\.[>\]]$/.
      test(e), this.mandatory = !1;
      let i = Le(e);
      this.short = i.shortFlag, this.long = i.longFlag, this.negate = !1, this.long && (this.negate = this.long.startsWith("--no-")), this.defaultValue =
      void 0, this.defaultValueDescription = void 0, this.presetArg = void 0, this.envVar = void 0, this.parseArg = void 0, this.hidden = !1,
      this.argChoices = void 0, this.conflictsWith = [], this.implied = void 0;
    }
    /**
     * Set the default value, and optionally supply the description to be displayed in the help.
     *
     * @param {*} value
     * @param {string} [description]
     * @return {Option}
     */
    default(e, t) {
      return this.defaultValue = e, this.defaultValueDescription = t, this;
    }
    /**
     * Preset to use when option used without option-argument, especially optional but also boolean and negated.
     * The custom processing (parseArg) is called.
     *
     * @example
     * new Option('--color').default('GREYSCALE').preset('RGB');
     * new Option('--donate [amount]').preset('20').argParser(parseFloat);
     *
     * @param {*} arg
     * @return {Option}
     */
    preset(e) {
      return this.presetArg = e, this;
    }
    /**
     * Add option name(s) that conflict with this option.
     * An error will be displayed if conflicting options are found during parsing.
     *
     * @example
     * new Option('--rgb').conflicts('cmyk');
     * new Option('--js').conflicts(['ts', 'jsx']);
     *
     * @param {(string | string[])} names
     * @return {Option}
     */
    conflicts(e) {
      return this.conflictsWith = this.conflictsWith.concat(e), this;
    }
    /**
     * Specify implied option values for when this option is set and the implied options are not.
     *
     * The custom processing (parseArg) is not called on the implied values.
     *
     * @example
     * program
     *   .addOption(new Option('--log', 'write logging information to file'))
     *   .addOption(new Option('--trace', 'log extra details').implies({ log: 'trace.txt' }));
     *
     * @param {object} impliedOptionValues
     * @return {Option}
     */
    implies(e) {
      let t = e;
      return typeof e == "string" && (t = { [e]: !0 }), this.implied = Object.assign(this.implied || {}, t), this;
    }
    /**
     * Set environment variable to check for option value.
     *
     * An environment variable is only used if when processed the current option value is
     * undefined, or the source of the current value is 'default' or 'config' or 'env'.
     *
     * @param {string} name
     * @return {Option}
     */
    env(e) {
      return this.envVar = e, this;
    }
    /**
     * Set the custom handler for processing CLI option arguments into option values.
     *
     * @param {Function} [fn]
     * @return {Option}
     */
    argParser(e) {
      return this.parseArg = e, this;
    }
    /**
     * Whether the option is mandatory and must have a value after parsing.
     *
     * @param {boolean} [mandatory=true]
     * @return {Option}
     */
    makeOptionMandatory(e = !0) {
      return this.mandatory = !!e, this;
    }
    /**
     * Hide option in help.
     *
     * @param {boolean} [hide=true]
     * @return {Option}
     */
    hideHelp(e = !0) {
      return this.hidden = !!e, this;
    }
    /**
     * @package
     */
    _concatValue(e, t) {
      return t === this.defaultValue || !Array.isArray(t) ? [e] : t.concat(e);
    }
    /**
     * Only allow option value to be one of choices.
     *
     * @param {string[]} values
     * @return {Option}
     */
    choices(e) {
      return this.argChoices = e.slice(), this.parseArg = (t, i) => {
        if (!this.argChoices.includes(t))
          throw new We(
            `Allowed choices are ${this.argChoices.join(", ")}.`
          );
        return this.variadic ? this._concatValue(t, i) : t;
      }, this;
    }
    /**
     * Return option name.
     *
     * @return {string}
     */
    name() {
      return this.long ? this.long.replace(/^--/, "") : this.short.replace(/^-/, "");
    }
    /**
     * Return option name, in a camelcase format that can be used
     * as a object attribute key.
     *
     * @return {string}
     */
    attributeName() {
      return Me(this.name().replace(/^no-/, ""));
    }
    /**
     * Check if `arg` matches the short or long flag.
     *
     * @param {string} arg
     * @return {boolean}
     * @package
     */
    is(e) {
      return this.short === e || this.long === e;
    }
    /**
     * Return whether a boolean option.
     *
     * Options are one of boolean, negated, required argument, or optional argument.
     *
     * @return {boolean}
     * @package
     */
    isBoolean() {
      return !this.required && !this.optional && !this.negate;
    }
  }, G = class {
    static {
      u(this, "DualOptions");
    }
    /**
     * @param {Option[]} options
     */
    constructor(e) {
      this.positiveOptions = /* @__PURE__ */ new Map(), this.negativeOptions = /* @__PURE__ */ new Map(), this.dualOptions = /* @__PURE__ */ new Set(),
      e.forEach((t) => {
        t.negate ? this.negativeOptions.set(t.attributeName(), t) : this.positiveOptions.set(t.attributeName(), t);
      }), this.negativeOptions.forEach((t, i) => {
        this.positiveOptions.has(i) && this.dualOptions.add(i);
      });
    }
    /**
     * Did the value come from the option, and not from possible matching dual option?
     *
     * @param {*} value
     * @param {Option} option
     * @returns {boolean}
     */
    valueFromOption(e, t) {
      let i = t.attributeName();
      if (!this.dualOptions.has(i)) return !0;
      let n = this.negativeOptions.get(i).presetArg, r = n !== void 0 ? n : !1;
      return t.negate === (r === e);
    }
  };
  function Me(s) {
    return s.split("-").reduce((e, t) => e + t[0].toUpperCase() + t.slice(1));
  }
  u(Me, "camelcase");
  function Le(s) {
    let e, t, i = s.split(/[ |,]+/);
    return i.length > 1 && !/^[[<]/.test(i[1]) && (e = i.shift()), t = i.shift(), !e && /^-[^-]$/.test(t) && (e = t, t = void 0), { shortFlag: e,
    longFlag: t };
  }
  u(Le, "splitOptionFlags");
  U.Option = R;
  U.DualOptions = G;
});

// ../node_modules/commander/lib/suggestSimilar.js
var ae = _((oe) => {
  function Re(s, e) {
    if (Math.abs(s.length - e.length) > 3)
      return Math.max(s.length, e.length);
    let t = [];
    for (let i = 0; i <= s.length; i++)
      t[i] = [i];
    for (let i = 0; i <= e.length; i++)
      t[0][i] = i;
    for (let i = 1; i <= e.length; i++)
      for (let n = 1; n <= s.length; n++) {
        let r = 1;
        s[n - 1] === e[i - 1] ? r = 0 : r = 1, t[n][i] = Math.min(
          t[n - 1][i] + 1,
          // deletion
          t[n][i - 1] + 1,
          // insertion
          t[n - 1][i - 1] + r
          // substitution
        ), n > 1 && i > 1 && s[n - 1] === e[i - 2] && s[n - 2] === e[i - 1] && (t[n][i] = Math.min(t[n][i], t[n - 2][i - 2] + 1));
      }
    return t[s.length][e.length];
  }
  u(Re, "editDistance");
  function Ge(s, e) {
    if (!e || e.length === 0) return "";
    e = Array.from(new Set(e));
    let t = s.startsWith("--");
    t && (s = s.slice(2), e = e.map((o) => o.slice(2)));
    let i = [], n = 3, r = 0.4;
    return e.forEach((o) => {
      if (o.length <= 1) return;
      let l = Re(s, o), a = Math.max(s.length, o.length);
      (a - l) / a > r && (l < n ? (n = l, i = [o]) : l === n && i.push(o));
    }), i.sort((o, l) => o.localeCompare(l)), t && (i = i.map((o) => `--${o}`)), i.length > 1 ? `
(Did you mean one of ${i.join(", ")}?)` : i.length === 1 ? `
(Did you mean ${i[0]}?)` : "";
  }
  u(Ge, "suggestSimilar");
  oe.suggestSimilar = Ge;
});

// ../node_modules/commander/lib/command.js
var me = _((ce) => {
  var Ue = O("node:events").EventEmitter, Y = O("node:child_process"), C = O("node:path"), K = O("node:fs"), p = O("node:process"), { Argument: Je,
  humanReadableArgName: Ye } = V(), { CommanderError: z } = A(), { Help: Ke } = L(), { Option: le, DualOptions: ze } = J(), { suggestSimilar: ue } = ae(),
  Q = class s extends Ue {
    static {
      u(this, "Command");
    }
    /**
     * Initialize a new `Command`.
     *
     * @param {string} [name]
     */
    constructor(e) {
      super(), this.commands = [], this.options = [], this.parent = null, this._allowUnknownOption = !1, this._allowExcessArguments = !0, this.
      registeredArguments = [], this._args = this.registeredArguments, this.args = [], this.rawArgs = [], this.processedArgs = [], this._scriptPath =
      null, this._name = e || "", this._optionValues = {}, this._optionValueSources = {}, this._storeOptionsAsProperties = !1, this._actionHandler =
      null, this._executableHandler = !1, this._executableFile = null, this._executableDir = null, this._defaultCommandName = null, this._exitCallback =
      null, this._aliases = [], this._combineFlagAndOptionalValue = !0, this._description = "", this._summary = "", this._argsDescription = void 0,
      this._enablePositionalOptions = !1, this._passThroughOptions = !1, this._lifeCycleHooks = {}, this._showHelpAfterError = !1, this._showSuggestionAfterError =
      !0, this._outputConfiguration = {
        writeOut: /* @__PURE__ */ u((t) => p.stdout.write(t), "writeOut"),
        writeErr: /* @__PURE__ */ u((t) => p.stderr.write(t), "writeErr"),
        getOutHelpWidth: /* @__PURE__ */ u(() => p.stdout.isTTY ? p.stdout.columns : void 0, "getOutHelpWidth"),
        getErrHelpWidth: /* @__PURE__ */ u(() => p.stderr.isTTY ? p.stderr.columns : void 0, "getErrHelpWidth"),
        outputError: /* @__PURE__ */ u((t, i) => i(t), "outputError")
      }, this._hidden = !1, this._helpOption = void 0, this._addImplicitHelpCommand = void 0, this._helpCommand = void 0, this._helpConfiguration =
      {};
    }
    /**
     * Copy settings that are useful to have in common across root command and subcommands.
     *
     * (Used internally when adding a command using `.command()` so subcommands inherit parent settings.)
     *
     * @param {Command} sourceCommand
     * @return {Command} `this` command for chaining
     */
    copyInheritedSettings(e) {
      return this._outputConfiguration = e._outputConfiguration, this._helpOption = e._helpOption, this._helpCommand = e._helpCommand, this.
      _helpConfiguration = e._helpConfiguration, this._exitCallback = e._exitCallback, this._storeOptionsAsProperties = e._storeOptionsAsProperties,
      this._combineFlagAndOptionalValue = e._combineFlagAndOptionalValue, this._allowExcessArguments = e._allowExcessArguments, this._enablePositionalOptions =
      e._enablePositionalOptions, this._showHelpAfterError = e._showHelpAfterError, this._showSuggestionAfterError = e._showSuggestionAfterError,
      this;
    }
    /**
     * @returns {Command[]}
     * @private
     */
    _getCommandAndAncestors() {
      let e = [];
      for (let t = this; t; t = t.parent)
        e.push(t);
      return e;
    }
    /**
     * Define a command.
     *
     * There are two styles of command: pay attention to where to put the description.
     *
     * @example
     * // Command implemented using action handler (description is supplied separately to `.command`)
     * program
     *   .command('clone <source> [destination]')
     *   .description('clone a repository into a newly created directory')
     *   .action((source, destination) => {
     *     console.log('clone command called');
     *   });
     *
     * // Command implemented using separate executable file (description is second parameter to `.command`)
     * program
     *   .command('start <service>', 'start named service')
     *   .command('stop [service]', 'stop named service, or all if no name supplied');
     *
     * @param {string} nameAndArgs - command name and arguments, args are `<required>` or `[optional]` and last may also be `variadic...`
     * @param {(object | string)} [actionOptsOrExecDesc] - configuration options (for action), or description (for executable)
     * @param {object} [execOpts] - configuration options (for executable)
     * @return {Command} returns new command for action handler, or `this` for executable command
     */
    command(e, t, i) {
      let n = t, r = i;
      typeof n == "object" && n !== null && (r = n, n = null), r = r || {};
      let [, o, l] = e.match(/([^ ]+) *(.*)/), a = this.createCommand(o);
      return n && (a.description(n), a._executableHandler = !0), r.isDefault && (this._defaultCommandName = a._name), a._hidden = !!(r.noHelp ||
      r.hidden), a._executableFile = r.executableFile || null, l && a.arguments(l), this._registerCommand(a), a.parent = this, a.copyInheritedSettings(
      this), n ? this : a;
    }
    /**
     * Factory routine to create a new unattached command.
     *
     * See .command() for creating an attached subcommand, which uses this routine to
     * create the command. You can override createCommand to customise subcommands.
     *
     * @param {string} [name]
     * @return {Command} new command
     */
    createCommand(e) {
      return new s(e);
    }
    /**
     * You can customise the help with a subclass of Help by overriding createHelp,
     * or by overriding Help properties using configureHelp().
     *
     * @return {Help}
     */
    createHelp() {
      return Object.assign(new Ke(), this.configureHelp());
    }
    /**
     * You can customise the help by overriding Help properties using configureHelp(),
     * or with a subclass of Help by overriding createHelp().
     *
     * @param {object} [configuration] - configuration options
     * @return {(Command | object)} `this` command for chaining, or stored configuration
     */
    configureHelp(e) {
      return e === void 0 ? this._helpConfiguration : (this._helpConfiguration = e, this);
    }
    /**
     * The default output goes to stdout and stderr. You can customise this for special
     * applications. You can also customise the display of errors by overriding outputError.
     *
     * The configuration properties are all functions:
     *
     *     // functions to change where being written, stdout and stderr
     *     writeOut(str)
     *     writeErr(str)
     *     // matching functions to specify width for wrapping help
     *     getOutHelpWidth()
     *     getErrHelpWidth()
     *     // functions based on what is being written out
     *     outputError(str, write) // used for displaying errors, and not used for displaying help
     *
     * @param {object} [configuration] - configuration options
     * @return {(Command | object)} `this` command for chaining, or stored configuration
     */
    configureOutput(e) {
      return e === void 0 ? this._outputConfiguration : (Object.assign(this._outputConfiguration, e), this);
    }
    /**
     * Display the help or a custom message after an error occurs.
     *
     * @param {(boolean|string)} [displayHelp]
     * @return {Command} `this` command for chaining
     */
    showHelpAfterError(e = !0) {
      return typeof e != "string" && (e = !!e), this._showHelpAfterError = e, this;
    }
    /**
     * Display suggestion of similar commands for unknown commands, or options for unknown options.
     *
     * @param {boolean} [displaySuggestion]
     * @return {Command} `this` command for chaining
     */
    showSuggestionAfterError(e = !0) {
      return this._showSuggestionAfterError = !!e, this;
    }
    /**
     * Add a prepared subcommand.
     *
     * See .command() for creating an attached subcommand which inherits settings from its parent.
     *
     * @param {Command} cmd - new subcommand
     * @param {object} [opts] - configuration options
     * @return {Command} `this` command for chaining
     */
    addCommand(e, t) {
      if (!e._name)
        throw new Error(`Command passed to .addCommand() must have a name
- specify the name in Command constructor or using .name()`);
      return t = t || {}, t.isDefault && (this._defaultCommandName = e._name), (t.noHelp || t.hidden) && (e._hidden = !0), this._registerCommand(
      e), e.parent = this, e._checkForBrokenPassThrough(), this;
    }
    /**
     * Factory routine to create a new unattached argument.
     *
     * See .argument() for creating an attached argument, which uses this routine to
     * create the argument. You can override createArgument to return a custom argument.
     *
     * @param {string} name
     * @param {string} [description]
     * @return {Argument} new argument
     */
    createArgument(e, t) {
      return new Je(e, t);
    }
    /**
     * Define argument syntax for command.
     *
     * The default is that the argument is required, and you can explicitly
     * indicate this with <> around the name. Put [] around the name for an optional argument.
     *
     * @example
     * program.argument('<input-file>');
     * program.argument('[output-file]');
     *
     * @param {string} name
     * @param {string} [description]
     * @param {(Function|*)} [fn] - custom argument processing function
     * @param {*} [defaultValue]
     * @return {Command} `this` command for chaining
     */
    argument(e, t, i, n) {
      let r = this.createArgument(e, t);
      return typeof i == "function" ? r.default(n).argParser(i) : r.default(i), this.addArgument(r), this;
    }
    /**
     * Define argument syntax for command, adding multiple at once (without descriptions).
     *
     * See also .argument().
     *
     * @example
     * program.arguments('<cmd> [env]');
     *
     * @param {string} names
     * @return {Command} `this` command for chaining
     */
    arguments(e) {
      return e.trim().split(/ +/).forEach((t) => {
        this.argument(t);
      }), this;
    }
    /**
     * Define argument syntax for command, adding a prepared argument.
     *
     * @param {Argument} argument
     * @return {Command} `this` command for chaining
     */
    addArgument(e) {
      let t = this.registeredArguments.slice(-1)[0];
      if (t && t.variadic)
        throw new Error(
          `only the last argument can be variadic '${t.name()}'`
        );
      if (e.required && e.defaultValue !== void 0 && e.parseArg === void 0)
        throw new Error(
          `a default value for a required argument is never used: '${e.name()}'`
        );
      return this.registeredArguments.push(e), this;
    }
    /**
     * Customise or override default help command. By default a help command is automatically added if your command has subcommands.
     *
     * @example
     *    program.helpCommand('help [cmd]');
     *    program.helpCommand('help [cmd]', 'show help');
     *    program.helpCommand(false); // suppress default help command
     *    program.helpCommand(true); // add help command even if no subcommands
     *
     * @param {string|boolean} enableOrNameAndArgs - enable with custom name and/or arguments, or boolean to override whether added
     * @param {string} [description] - custom description
     * @return {Command} `this` command for chaining
     */
    helpCommand(e, t) {
      if (typeof e == "boolean")
        return this._addImplicitHelpCommand = e, this;
      e = e ?? "help [command]";
      let [, i, n] = e.match(/([^ ]+) *(.*)/), r = t ?? "display help for command", o = this.createCommand(i);
      return o.helpOption(!1), n && o.arguments(n), r && o.description(r), this._addImplicitHelpCommand = !0, this._helpCommand = o, this;
    }
    /**
     * Add prepared custom help command.
     *
     * @param {(Command|string|boolean)} helpCommand - custom help command, or deprecated enableOrNameAndArgs as for `.helpCommand()`
     * @param {string} [deprecatedDescription] - deprecated custom description used with custom name only
     * @return {Command} `this` command for chaining
     */
    addHelpCommand(e, t) {
      return typeof e != "object" ? (this.helpCommand(e, t), this) : (this._addImplicitHelpCommand = !0, this._helpCommand = e, this);
    }
    /**
     * Lazy create help command.
     *
     * @return {(Command|null)}
     * @package
     */
    _getHelpCommand() {
      return this._addImplicitHelpCommand ?? (this.commands.length && !this._actionHandler && !this._findCommand("help")) ? (this._helpCommand ===
      void 0 && this.helpCommand(void 0, void 0), this._helpCommand) : null;
    }
    /**
     * Add hook for life cycle event.
     *
     * @param {string} event
     * @param {Function} listener
     * @return {Command} `this` command for chaining
     */
    hook(e, t) {
      let i = ["preSubcommand", "preAction", "postAction"];
      if (!i.includes(e))
        throw new Error(`Unexpected value for event passed to hook : '${e}'.
Expecting one of '${i.join("', '")}'`);
      return this._lifeCycleHooks[e] ? this._lifeCycleHooks[e].push(t) : this._lifeCycleHooks[e] = [t], this;
    }
    /**
     * Register callback to use as replacement for calling process.exit.
     *
     * @param {Function} [fn] optional callback which will be passed a CommanderError, defaults to throwing
     * @return {Command} `this` command for chaining
     */
    exitOverride(e) {
      return e ? this._exitCallback = e : this._exitCallback = (t) => {
        if (t.code !== "commander.executeSubCommandAsync")
          throw t;
      }, this;
    }
    /**
     * Call process.exit, and _exitCallback if defined.
     *
     * @param {number} exitCode exit code for using with process.exit
     * @param {string} code an id string representing the error
     * @param {string} message human-readable description of the error
     * @return never
     * @private
     */
    _exit(e, t, i) {
      this._exitCallback && this._exitCallback(new z(e, t, i)), p.exit(e);
    }
    /**
     * Register callback `fn` for the command.
     *
     * @example
     * program
     *   .command('serve')
     *   .description('start service')
     *   .action(function() {
     *      // do work here
     *   });
     *
     * @param {Function} fn
     * @return {Command} `this` command for chaining
     */
    action(e) {
      let t = /* @__PURE__ */ u((i) => {
        let n = this.registeredArguments.length, r = i.slice(0, n);
        return this._storeOptionsAsProperties ? r[n] = this : r[n] = this.opts(), r.push(this), e.apply(this, r);
      }, "listener");
      return this._actionHandler = t, this;
    }
    /**
     * Factory routine to create a new unattached option.
     *
     * See .option() for creating an attached option, which uses this routine to
     * create the option. You can override createOption to return a custom option.
     *
     * @param {string} flags
     * @param {string} [description]
     * @return {Option} new option
     */
    createOption(e, t) {
      return new le(e, t);
    }
    /**
     * Wrap parseArgs to catch 'commander.invalidArgument'.
     *
     * @param {(Option | Argument)} target
     * @param {string} value
     * @param {*} previous
     * @param {string} invalidArgumentMessage
     * @private
     */
    _callParseArg(e, t, i, n) {
      try {
        return e.parseArg(t, i);
      } catch (r) {
        if (r.code === "commander.invalidArgument") {
          let o = `${n} ${r.message}`;
          this.error(o, { exitCode: r.exitCode, code: r.code });
        }
        throw r;
      }
    }
    /**
     * Check for option flag conflicts.
     * Register option if no conflicts found, or throw on conflict.
     *
     * @param {Option} option
     * @private
     */
    _registerOption(e) {
      let t = e.short && this._findOption(e.short) || e.long && this._findOption(e.long);
      if (t) {
        let i = e.long && this._findOption(e.long) ? e.long : e.short;
        throw new Error(`Cannot add option '${e.flags}'${this._name && ` to command '${this._name}'`} due to conflicting flag '${i}'
-  already used by option '${t.flags}'`);
      }
      this.options.push(e);
    }
    /**
     * Check for command name and alias conflicts with existing commands.
     * Register command if no conflicts found, or throw on conflict.
     *
     * @param {Command} command
     * @private
     */
    _registerCommand(e) {
      let t = /* @__PURE__ */ u((n) => [n.name()].concat(n.aliases()), "knownBy"), i = t(e).find(
        (n) => this._findCommand(n)
      );
      if (i) {
        let n = t(this._findCommand(i)).join("|"), r = t(e).join("|");
        throw new Error(
          `cannot add command '${r}' as already have command '${n}'`
        );
      }
      this.commands.push(e);
    }
    /**
     * Add an option.
     *
     * @param {Option} option
     * @return {Command} `this` command for chaining
     */
    addOption(e) {
      this._registerOption(e);
      let t = e.name(), i = e.attributeName();
      if (e.negate) {
        let r = e.long.replace(/^--no-/, "--");
        this._findOption(r) || this.setOptionValueWithSource(
          i,
          e.defaultValue === void 0 ? !0 : e.defaultValue,
          "default"
        );
      } else e.defaultValue !== void 0 && this.setOptionValueWithSource(i, e.defaultValue, "default");
      let n = /* @__PURE__ */ u((r, o, l) => {
        r == null && e.presetArg !== void 0 && (r = e.presetArg);
        let a = this.getOptionValue(i);
        r !== null && e.parseArg ? r = this._callParseArg(e, r, a, o) : r !== null && e.variadic && (r = e._concatValue(r, a)), r == null &&
        (e.negate ? r = !1 : e.isBoolean() || e.optional ? r = !0 : r = ""), this.setOptionValueWithSource(i, r, l);
      }, "handleOptionValue");
      return this.on("option:" + t, (r) => {
        let o = `error: option '${e.flags}' argument '${r}' is invalid.`;
        n(r, o, "cli");
      }), e.envVar && this.on("optionEnv:" + t, (r) => {
        let o = `error: option '${e.flags}' value '${r}' from env '${e.envVar}' is invalid.`;
        n(r, o, "env");
      }), this;
    }
    /**
     * Internal implementation shared by .option() and .requiredOption()
     *
     * @return {Command} `this` command for chaining
     * @private
     */
    _optionEx(e, t, i, n, r) {
      if (typeof t == "object" && t instanceof le)
        throw new Error(
          "To add an Option object use addOption() instead of option() or requiredOption()"
        );
      let o = this.createOption(t, i);
      if (o.makeOptionMandatory(!!e.mandatory), typeof n == "function")
        o.default(r).argParser(n);
      else if (n instanceof RegExp) {
        let l = n;
        n = /* @__PURE__ */ u((a, h) => {
          let c = l.exec(a);
          return c ? c[0] : h;
        }, "fn"), o.default(r).argParser(n);
      } else
        o.default(n);
      return this.addOption(o);
    }
    /**
     * Define option with `flags`, `description`, and optional argument parsing function or `defaultValue` or both.
     *
     * The `flags` string contains the short and/or long flags, separated by comma, a pipe or space. A required
     * option-argument is indicated by `<>` and an optional option-argument by `[]`.
     *
     * See the README for more details, and see also addOption() and requiredOption().
     *
     * @example
     * program
     *     .option('-p, --pepper', 'add pepper')
     *     .option('-p, --pizza-type <TYPE>', 'type of pizza') // required option-argument
     *     .option('-c, --cheese [CHEESE]', 'add extra cheese', 'mozzarella') // optional option-argument with default
     *     .option('-t, --tip <VALUE>', 'add tip to purchase cost', parseFloat) // custom parse function
     *
     * @param {string} flags
     * @param {string} [description]
     * @param {(Function|*)} [parseArg] - custom option processing function or default value
     * @param {*} [defaultValue]
     * @return {Command} `this` command for chaining
     */
    option(e, t, i, n) {
      return this._optionEx({}, e, t, i, n);
    }
    /**
     * Add a required option which must have a value after parsing. This usually means
     * the option must be specified on the command line. (Otherwise the same as .option().)
     *
     * The `flags` string contains the short and/or long flags, separated by comma, a pipe or space.
     *
     * @param {string} flags
     * @param {string} [description]
     * @param {(Function|*)} [parseArg] - custom option processing function or default value
     * @param {*} [defaultValue]
     * @return {Command} `this` command for chaining
     */
    requiredOption(e, t, i, n) {
      return this._optionEx(
        { mandatory: !0 },
        e,
        t,
        i,
        n
      );
    }
    /**
     * Alter parsing of short flags with optional values.
     *
     * @example
     * // for `.option('-f,--flag [value]'):
     * program.combineFlagAndOptionalValue(true);  // `-f80` is treated like `--flag=80`, this is the default behaviour
     * program.combineFlagAndOptionalValue(false) // `-fb` is treated like `-f -b`
     *
     * @param {boolean} [combine] - if `true` or omitted, an optional value can be specified directly after the flag.
     * @return {Command} `this` command for chaining
     */
    combineFlagAndOptionalValue(e = !0) {
      return this._combineFlagAndOptionalValue = !!e, this;
    }
    /**
     * Allow unknown options on the command line.
     *
     * @param {boolean} [allowUnknown] - if `true` or omitted, no error will be thrown for unknown options.
     * @return {Command} `this` command for chaining
     */
    allowUnknownOption(e = !0) {
      return this._allowUnknownOption = !!e, this;
    }
    /**
     * Allow excess command-arguments on the command line. Pass false to make excess arguments an error.
     *
     * @param {boolean} [allowExcess] - if `true` or omitted, no error will be thrown for excess arguments.
     * @return {Command} `this` command for chaining
     */
    allowExcessArguments(e = !0) {
      return this._allowExcessArguments = !!e, this;
    }
    /**
     * Enable positional options. Positional means global options are specified before subcommands which lets
     * subcommands reuse the same option names, and also enables subcommands to turn on passThroughOptions.
     * The default behaviour is non-positional and global options may appear anywhere on the command line.
     *
     * @param {boolean} [positional]
     * @return {Command} `this` command for chaining
     */
    enablePositionalOptions(e = !0) {
      return this._enablePositionalOptions = !!e, this;
    }
    /**
     * Pass through options that come after command-arguments rather than treat them as command-options,
     * so actual command-options come before command-arguments. Turning this on for a subcommand requires
     * positional options to have been enabled on the program (parent commands).
     * The default behaviour is non-positional and options may appear before or after command-arguments.
     *
     * @param {boolean} [passThrough] for unknown options.
     * @return {Command} `this` command for chaining
     */
    passThroughOptions(e = !0) {
      return this._passThroughOptions = !!e, this._checkForBrokenPassThrough(), this;
    }
    /**
     * @private
     */
    _checkForBrokenPassThrough() {
      if (this.parent && this._passThroughOptions && !this.parent._enablePositionalOptions)
        throw new Error(
          `passThroughOptions cannot be used for '${this._name}' without turning on enablePositionalOptions for parent command(s)`
        );
    }
    /**
     * Whether to store option values as properties on command object,
     * or store separately (specify false). In both cases the option values can be accessed using .opts().
     *
     * @param {boolean} [storeAsProperties=true]
     * @return {Command} `this` command for chaining
     */
    storeOptionsAsProperties(e = !0) {
      if (this.options.length)
        throw new Error("call .storeOptionsAsProperties() before adding options");
      if (Object.keys(this._optionValues).length)
        throw new Error(
          "call .storeOptionsAsProperties() before setting option values"
        );
      return this._storeOptionsAsProperties = !!e, this;
    }
    /**
     * Retrieve option value.
     *
     * @param {string} key
     * @return {object} value
     */
    getOptionValue(e) {
      return this._storeOptionsAsProperties ? this[e] : this._optionValues[e];
    }
    /**
     * Store option value.
     *
     * @param {string} key
     * @param {object} value
     * @return {Command} `this` command for chaining
     */
    setOptionValue(e, t) {
      return this.setOptionValueWithSource(e, t, void 0);
    }
    /**
     * Store option value and where the value came from.
     *
     * @param {string} key
     * @param {object} value
     * @param {string} source - expected values are default/config/env/cli/implied
     * @return {Command} `this` command for chaining
     */
    setOptionValueWithSource(e, t, i) {
      return this._storeOptionsAsProperties ? this[e] = t : this._optionValues[e] = t, this._optionValueSources[e] = i, this;
    }
    /**
     * Get source of option value.
     * Expected values are default | config | env | cli | implied
     *
     * @param {string} key
     * @return {string}
     */
    getOptionValueSource(e) {
      return this._optionValueSources[e];
    }
    /**
     * Get source of option value. See also .optsWithGlobals().
     * Expected values are default | config | env | cli | implied
     *
     * @param {string} key
     * @return {string}
     */
    getOptionValueSourceWithGlobals(e) {
      let t;
      return this._getCommandAndAncestors().forEach((i) => {
        i.getOptionValueSource(e) !== void 0 && (t = i.getOptionValueSource(e));
      }), t;
    }
    /**
     * Get user arguments from implied or explicit arguments.
     * Side-effects: set _scriptPath if args included script. Used for default program name, and subcommand searches.
     *
     * @private
     */
    _prepareUserArgs(e, t) {
      if (e !== void 0 && !Array.isArray(e))
        throw new Error("first parameter to parse must be array or undefined");
      if (t = t || {}, e === void 0 && t.from === void 0) {
        p.versions?.electron && (t.from = "electron");
        let n = p.execArgv ?? [];
        (n.includes("-e") || n.includes("--eval") || n.includes("-p") || n.includes("--print")) && (t.from = "eval");
      }
      e === void 0 && (e = p.argv), this.rawArgs = e.slice();
      let i;
      switch (t.from) {
        case void 0:
        case "node":
          this._scriptPath = e[1], i = e.slice(2);
          break;
        case "electron":
          p.defaultApp ? (this._scriptPath = e[1], i = e.slice(2)) : i = e.slice(1);
          break;
        case "user":
          i = e.slice(0);
          break;
        case "eval":
          i = e.slice(1);
          break;
        default:
          throw new Error(
            `unexpected parse option { from: '${t.from}' }`
          );
      }
      return !this._name && this._scriptPath && this.nameFromFilename(this._scriptPath), this._name = this._name || "program", i;
    }
    /**
     * Parse `argv`, setting options and invoking commands when defined.
     *
     * Use parseAsync instead of parse if any of your action handlers are async.
     *
     * Call with no parameters to parse `process.argv`. Detects Electron and special node options like `node --eval`. Easy mode!
     *
     * Or call with an array of strings to parse, and optionally where the user arguments start by specifying where the arguments are `from`:
     * - `'node'`: default, `argv[0]` is the application and `argv[1]` is the script being run, with user arguments after that
     * - `'electron'`: `argv[0]` is the application and `argv[1]` varies depending on whether the electron application is packaged
     * - `'user'`: just user arguments
     *
     * @example
     * program.parse(); // parse process.argv and auto-detect electron and special node flags
     * program.parse(process.argv); // assume argv[0] is app and argv[1] is script
     * program.parse(my-args, { from: 'user' }); // just user supplied arguments, nothing special about argv[0]
     *
     * @param {string[]} [argv] - optional, defaults to process.argv
     * @param {object} [parseOptions] - optionally specify style of options with from: node/user/electron
     * @param {string} [parseOptions.from] - where the args are from: 'node', 'user', 'electron'
     * @return {Command} `this` command for chaining
     */
    parse(e, t) {
      let i = this._prepareUserArgs(e, t);
      return this._parseCommand([], i), this;
    }
    /**
     * Parse `argv`, setting options and invoking commands when defined.
     *
     * Call with no parameters to parse `process.argv`. Detects Electron and special node options like `node --eval`. Easy mode!
     *
     * Or call with an array of strings to parse, and optionally where the user arguments start by specifying where the arguments are `from`:
     * - `'node'`: default, `argv[0]` is the application and `argv[1]` is the script being run, with user arguments after that
     * - `'electron'`: `argv[0]` is the application and `argv[1]` varies depending on whether the electron application is packaged
     * - `'user'`: just user arguments
     *
     * @example
     * await program.parseAsync(); // parse process.argv and auto-detect electron and special node flags
     * await program.parseAsync(process.argv); // assume argv[0] is app and argv[1] is script
     * await program.parseAsync(my-args, { from: 'user' }); // just user supplied arguments, nothing special about argv[0]
     *
     * @param {string[]} [argv]
     * @param {object} [parseOptions]
     * @param {string} parseOptions.from - where the args are from: 'node', 'user', 'electron'
     * @return {Promise}
     */
    async parseAsync(e, t) {
      let i = this._prepareUserArgs(e, t);
      return await this._parseCommand([], i), this;
    }
    /**
     * Execute a sub-command executable.
     *
     * @private
     */
    _executeSubCommand(e, t) {
      t = t.slice();
      let i = !1, n = [".js", ".ts", ".tsx", ".mjs", ".cjs"];
      function r(c, m) {
        let d = C.resolve(c, m);
        if (K.existsSync(d)) return d;
        if (n.includes(C.extname(m))) return;
        let b = n.find(
          (f) => K.existsSync(`${d}${f}`)
        );
        if (b) return `${d}${b}`;
      }
      u(r, "findFile"), this._checkForMissingMandatoryOptions(), this._checkForConflictingOptions();
      let o = e._executableFile || `${this._name}-${e._name}`, l = this._executableDir || "";
      if (this._scriptPath) {
        let c;
        try {
          c = K.realpathSync(this._scriptPath);
        } catch {
          c = this._scriptPath;
        }
        l = C.resolve(
          C.dirname(c),
          l
        );
      }
      if (l) {
        let c = r(l, o);
        if (!c && !e._executableFile && this._scriptPath) {
          let m = C.basename(
            this._scriptPath,
            C.extname(this._scriptPath)
          );
          m !== this._name && (c = r(
            l,
            `${m}-${e._name}`
          ));
        }
        o = c || o;
      }
      i = n.includes(C.extname(o));
      let a;
      p.platform !== "win32" ? i ? (t.unshift(o), t = he(p.execArgv).concat(t), a = Y.spawn(p.argv[0], t, { stdio: "inherit" })) : a = Y.spawn(
      o, t, { stdio: "inherit" }) : (t.unshift(o), t = he(p.execArgv).concat(t), a = Y.spawn(p.execPath, t, { stdio: "inherit" })), a.killed ||
      ["SIGUSR1", "SIGUSR2", "SIGTERM", "SIGINT", "SIGHUP"].forEach((m) => {
        p.on(m, () => {
          a.killed === !1 && a.exitCode === null && a.kill(m);
        });
      });
      let h = this._exitCallback;
      a.on("close", (c) => {
        c = c ?? 1, h ? h(
          new z(
            c,
            "commander.executeSubCommandAsync",
            "(close)"
          )
        ) : p.exit(c);
      }), a.on("error", (c) => {
        if (c.code === "ENOENT") {
          let m = l ? `searched for local subcommand relative to directory '${l}'` : "no directory for search for local subcommand, use .exe\
cutableDir() to supply a custom directory", d = `'${o}' does not exist
 - if '${e._name}' is not meant to be an executable command, remove description parameter from '.command()' and use '.description()' instead\

 - if the default executable name is not suitable, use the executableFile option to supply a custom name or path
 - ${m}`;
          throw new Error(d);
        } else if (c.code === "EACCES")
          throw new Error(`'${o}' not executable`);
        if (!h)
          p.exit(1);
        else {
          let m = new z(
            1,
            "commander.executeSubCommandAsync",
            "(error)"
          );
          m.nestedError = c, h(m);
        }
      }), this.runningCommand = a;
    }
    /**
     * @private
     */
    _dispatchSubcommand(e, t, i) {
      let n = this._findCommand(e);
      n || this.help({ error: !0 });
      let r;
      return r = this._chainOrCallSubCommandHook(
        r,
        n,
        "preSubcommand"
      ), r = this._chainOrCall(r, () => {
        if (n._executableHandler)
          this._executeSubCommand(n, t.concat(i));
        else
          return n._parseCommand(t, i);
      }), r;
    }
    /**
     * Invoke help directly if possible, or dispatch if necessary.
     * e.g. help foo
     *
     * @private
     */
    _dispatchHelpCommand(e) {
      e || this.help();
      let t = this._findCommand(e);
      return t && !t._executableHandler && t.help(), this._dispatchSubcommand(
        e,
        [],
        [this._getHelpOption()?.long ?? this._getHelpOption()?.short ?? "--help"]
      );
    }
    /**
     * Check this.args against expected this.registeredArguments.
     *
     * @private
     */
    _checkNumberOfArguments() {
      this.registeredArguments.forEach((e, t) => {
        e.required && this.args[t] == null && this.missingArgument(e.name());
      }), !(this.registeredArguments.length > 0 && this.registeredArguments[this.registeredArguments.length - 1].variadic) && this.args.length >
      this.registeredArguments.length && this._excessArguments(this.args);
    }
    /**
     * Process this.args using this.registeredArguments and save as this.processedArgs!
     *
     * @private
     */
    _processArguments() {
      let e = /* @__PURE__ */ u((i, n, r) => {
        let o = n;
        if (n !== null && i.parseArg) {
          let l = `error: command-argument value '${n}' is invalid for argument '${i.name()}'.`;
          o = this._callParseArg(
            i,
            n,
            r,
            l
          );
        }
        return o;
      }, "myParseArg");
      this._checkNumberOfArguments();
      let t = [];
      this.registeredArguments.forEach((i, n) => {
        let r = i.defaultValue;
        i.variadic ? n < this.args.length ? (r = this.args.slice(n), i.parseArg && (r = r.reduce((o, l) => e(i, l, o), i.defaultValue))) : r ===
        void 0 && (r = []) : n < this.args.length && (r = this.args[n], i.parseArg && (r = e(i, r, i.defaultValue))), t[n] = r;
      }), this.processedArgs = t;
    }
    /**
     * Once we have a promise we chain, but call synchronously until then.
     *
     * @param {(Promise|undefined)} promise
     * @param {Function} fn
     * @return {(Promise|undefined)}
     * @private
     */
    _chainOrCall(e, t) {
      return e && e.then && typeof e.then == "function" ? e.then(() => t()) : t();
    }
    /**
     *
     * @param {(Promise|undefined)} promise
     * @param {string} event
     * @return {(Promise|undefined)}
     * @private
     */
    _chainOrCallHooks(e, t) {
      let i = e, n = [];
      return this._getCommandAndAncestors().reverse().filter((r) => r._lifeCycleHooks[t] !== void 0).forEach((r) => {
        r._lifeCycleHooks[t].forEach((o) => {
          n.push({ hookedCommand: r, callback: o });
        });
      }), t === "postAction" && n.reverse(), n.forEach((r) => {
        i = this._chainOrCall(i, () => r.callback(r.hookedCommand, this));
      }), i;
    }
    /**
     *
     * @param {(Promise|undefined)} promise
     * @param {Command} subCommand
     * @param {string} event
     * @return {(Promise|undefined)}
     * @private
     */
    _chainOrCallSubCommandHook(e, t, i) {
      let n = e;
      return this._lifeCycleHooks[i] !== void 0 && this._lifeCycleHooks[i].forEach((r) => {
        n = this._chainOrCall(n, () => r(this, t));
      }), n;
    }
    /**
     * Process arguments in context of this command.
     * Returns action result, in case it is a promise.
     *
     * @private
     */
    _parseCommand(e, t) {
      let i = this.parseOptions(t);
      if (this._parseOptionsEnv(), this._parseOptionsImplied(), e = e.concat(i.operands), t = i.unknown, this.args = e.concat(t), e && this.
      _findCommand(e[0]))
        return this._dispatchSubcommand(e[0], e.slice(1), t);
      if (this._getHelpCommand() && e[0] === this._getHelpCommand().name())
        return this._dispatchHelpCommand(e[1]);
      if (this._defaultCommandName)
        return this._outputHelpIfRequested(t), this._dispatchSubcommand(
          this._defaultCommandName,
          e,
          t
        );
      this.commands.length && this.args.length === 0 && !this._actionHandler && !this._defaultCommandName && this.help({ error: !0 }), this.
      _outputHelpIfRequested(i.unknown), this._checkForMissingMandatoryOptions(), this._checkForConflictingOptions();
      let n = /* @__PURE__ */ u(() => {
        i.unknown.length > 0 && this.unknownOption(i.unknown[0]);
      }, "checkForUnknownOptions"), r = `command:${this.name()}`;
      if (this._actionHandler) {
        n(), this._processArguments();
        let o;
        return o = this._chainOrCallHooks(o, "preAction"), o = this._chainOrCall(
          o,
          () => this._actionHandler(this.processedArgs)
        ), this.parent && (o = this._chainOrCall(o, () => {
          this.parent.emit(r, e, t);
        })), o = this._chainOrCallHooks(o, "postAction"), o;
      }
      if (this.parent && this.parent.listenerCount(r))
        n(), this._processArguments(), this.parent.emit(r, e, t);
      else if (e.length) {
        if (this._findCommand("*"))
          return this._dispatchSubcommand("*", e, t);
        this.listenerCount("command:*") ? this.emit("command:*", e, t) : this.commands.length ? this.unknownCommand() : (n(), this._processArguments());
      } else this.commands.length ? (n(), this.help({ error: !0 })) : (n(), this._processArguments());
    }
    /**
     * Find matching command.
     *
     * @private
     * @return {Command | undefined}
     */
    _findCommand(e) {
      if (e)
        return this.commands.find(
          (t) => t._name === e || t._aliases.includes(e)
        );
    }
    /**
     * Return an option matching `arg` if any.
     *
     * @param {string} arg
     * @return {Option}
     * @package
     */
    _findOption(e) {
      return this.options.find((t) => t.is(e));
    }
    /**
     * Display an error message if a mandatory option does not have a value.
     * Called after checking for help flags in leaf subcommand.
     *
     * @private
     */
    _checkForMissingMandatoryOptions() {
      this._getCommandAndAncestors().forEach((e) => {
        e.options.forEach((t) => {
          t.mandatory && e.getOptionValue(t.attributeName()) === void 0 && e.missingMandatoryOptionValue(t);
        });
      });
    }
    /**
     * Display an error message if conflicting options are used together in this.
     *
     * @private
     */
    _checkForConflictingLocalOptions() {
      let e = this.options.filter((i) => {
        let n = i.attributeName();
        return this.getOptionValue(n) === void 0 ? !1 : this.getOptionValueSource(n) !== "default";
      });
      e.filter(
        (i) => i.conflictsWith.length > 0
      ).forEach((i) => {
        let n = e.find(
          (r) => i.conflictsWith.includes(r.attributeName())
        );
        n && this._conflictingOption(i, n);
      });
    }
    /**
     * Display an error message if conflicting options are used together.
     * Called after checking for help flags in leaf subcommand.
     *
     * @private
     */
    _checkForConflictingOptions() {
      this._getCommandAndAncestors().forEach((e) => {
        e._checkForConflictingLocalOptions();
      });
    }
    /**
     * Parse options from `argv` removing known options,
     * and return argv split into operands and unknown arguments.
     *
     * Examples:
     *
     *     argv => operands, unknown
     *     --known kkk op => [op], []
     *     op --known kkk => [op], []
     *     sub --unknown uuu op => [sub], [--unknown uuu op]
     *     sub -- --unknown uuu op => [sub --unknown uuu op], []
     *
     * @param {string[]} argv
     * @return {{operands: string[], unknown: string[]}}
     */
    parseOptions(e) {
      let t = [], i = [], n = t, r = e.slice();
      function o(a) {
        return a.length > 1 && a[0] === "-";
      }
      u(o, "maybeOption");
      let l = null;
      for (; r.length; ) {
        let a = r.shift();
        if (a === "--") {
          n === i && n.push(a), n.push(...r);
          break;
        }
        if (l && !o(a)) {
          this.emit(`option:${l.name()}`, a);
          continue;
        }
        if (l = null, o(a)) {
          let h = this._findOption(a);
          if (h) {
            if (h.required) {
              let c = r.shift();
              c === void 0 && this.optionMissingArgument(h), this.emit(`option:${h.name()}`, c);
            } else if (h.optional) {
              let c = null;
              r.length > 0 && !o(r[0]) && (c = r.shift()), this.emit(`option:${h.name()}`, c);
            } else
              this.emit(`option:${h.name()}`);
            l = h.variadic ? h : null;
            continue;
          }
        }
        if (a.length > 2 && a[0] === "-" && a[1] !== "-") {
          let h = this._findOption(`-${a[1]}`);
          if (h) {
            h.required || h.optional && this._combineFlagAndOptionalValue ? this.emit(`option:${h.name()}`, a.slice(2)) : (this.emit(`option\
:${h.name()}`), r.unshift(`-${a.slice(2)}`));
            continue;
          }
        }
        if (/^--[^=]+=/.test(a)) {
          let h = a.indexOf("="), c = this._findOption(a.slice(0, h));
          if (c && (c.required || c.optional)) {
            this.emit(`option:${c.name()}`, a.slice(h + 1));
            continue;
          }
        }
        if (o(a) && (n = i), (this._enablePositionalOptions || this._passThroughOptions) && t.length === 0 && i.length === 0) {
          if (this._findCommand(a)) {
            t.push(a), r.length > 0 && i.push(...r);
            break;
          } else if (this._getHelpCommand() && a === this._getHelpCommand().name()) {
            t.push(a), r.length > 0 && t.push(...r);
            break;
          } else if (this._defaultCommandName) {
            i.push(a), r.length > 0 && i.push(...r);
            break;
          }
        }
        if (this._passThroughOptions) {
          n.push(a), r.length > 0 && n.push(...r);
          break;
        }
        n.push(a);
      }
      return { operands: t, unknown: i };
    }
    /**
     * Return an object containing local option values as key-value pairs.
     *
     * @return {object}
     */
    opts() {
      if (this._storeOptionsAsProperties) {
        let e = {}, t = this.options.length;
        for (let i = 0; i < t; i++) {
          let n = this.options[i].attributeName();
          e[n] = n === this._versionOptionName ? this._version : this[n];
        }
        return e;
      }
      return this._optionValues;
    }
    /**
     * Return an object containing merged local and global option values as key-value pairs.
     *
     * @return {object}
     */
    optsWithGlobals() {
      return this._getCommandAndAncestors().reduce(
        (e, t) => Object.assign(e, t.opts()),
        {}
      );
    }
    /**
     * Display error message and exit (or call exitOverride).
     *
     * @param {string} message
     * @param {object} [errorOptions]
     * @param {string} [errorOptions.code] - an id string representing the error
     * @param {number} [errorOptions.exitCode] - used with process.exit
     */
    error(e, t) {
      this._outputConfiguration.outputError(
        `${e}
`,
        this._outputConfiguration.writeErr
      ), typeof this._showHelpAfterError == "string" ? this._outputConfiguration.writeErr(`${this._showHelpAfterError}
`) : this._showHelpAfterError && (this._outputConfiguration.writeErr(`
`), this.outputHelp({ error: !0 }));
      let i = t || {}, n = i.exitCode || 1, r = i.code || "commander.error";
      this._exit(n, r, e);
    }
    /**
     * Apply any option related environment variables, if option does
     * not have a value from cli or client code.
     *
     * @private
     */
    _parseOptionsEnv() {
      this.options.forEach((e) => {
        if (e.envVar && e.envVar in p.env) {
          let t = e.attributeName();
          (this.getOptionValue(t) === void 0 || ["default", "config", "env"].includes(
            this.getOptionValueSource(t)
          )) && (e.required || e.optional ? this.emit(`optionEnv:${e.name()}`, p.env[e.envVar]) : this.emit(`optionEnv:${e.name()}`));
        }
      });
    }
    /**
     * Apply any implied option values, if option is undefined or default value.
     *
     * @private
     */
    _parseOptionsImplied() {
      let e = new ze(this.options), t = /* @__PURE__ */ u((i) => this.getOptionValue(i) !== void 0 && !["default", "implied"].includes(this.
      getOptionValueSource(i)), "hasCustomOptionValue");
      this.options.filter(
        (i) => i.implied !== void 0 && t(i.attributeName()) && e.valueFromOption(
          this.getOptionValue(i.attributeName()),
          i
        )
      ).forEach((i) => {
        Object.keys(i.implied).filter((n) => !t(n)).forEach((n) => {
          this.setOptionValueWithSource(
            n,
            i.implied[n],
            "implied"
          );
        });
      });
    }
    /**
     * Argument `name` is missing.
     *
     * @param {string} name
     * @private
     */
    missingArgument(e) {
      let t = `error: missing required argument '${e}'`;
      this.error(t, { code: "commander.missingArgument" });
    }
    /**
     * `Option` is missing an argument.
     *
     * @param {Option} option
     * @private
     */
    optionMissingArgument(e) {
      let t = `error: option '${e.flags}' argument missing`;
      this.error(t, { code: "commander.optionMissingArgument" });
    }
    /**
     * `Option` does not have a value, and is a mandatory option.
     *
     * @param {Option} option
     * @private
     */
    missingMandatoryOptionValue(e) {
      let t = `error: required option '${e.flags}' not specified`;
      this.error(t, { code: "commander.missingMandatoryOptionValue" });
    }
    /**
     * `Option` conflicts with another option.
     *
     * @param {Option} option
     * @param {Option} conflictingOption
     * @private
     */
    _conflictingOption(e, t) {
      let i = /* @__PURE__ */ u((o) => {
        let l = o.attributeName(), a = this.getOptionValue(l), h = this.options.find(
          (m) => m.negate && l === m.attributeName()
        ), c = this.options.find(
          (m) => !m.negate && l === m.attributeName()
        );
        return h && (h.presetArg === void 0 && a === !1 || h.presetArg !== void 0 && a === h.presetArg) ? h : c || o;
      }, "findBestOptionFromValue"), n = /* @__PURE__ */ u((o) => {
        let l = i(o), a = l.attributeName();
        return this.getOptionValueSource(a) === "env" ? `environment variable '${l.envVar}'` : `option '${l.flags}'`;
      }, "getErrorMessage"), r = `error: ${n(e)} cannot be used with ${n(t)}`;
      this.error(r, { code: "commander.conflictingOption" });
    }
    /**
     * Unknown option `flag`.
     *
     * @param {string} flag
     * @private
     */
    unknownOption(e) {
      if (this._allowUnknownOption) return;
      let t = "";
      if (e.startsWith("--") && this._showSuggestionAfterError) {
        let n = [], r = this;
        do {
          let o = r.createHelp().visibleOptions(r).filter((l) => l.long).map((l) => l.long);
          n = n.concat(o), r = r.parent;
        } while (r && !r._enablePositionalOptions);
        t = ue(e, n);
      }
      let i = `error: unknown option '${e}'${t}`;
      this.error(i, { code: "commander.unknownOption" });
    }
    /**
     * Excess arguments, more than expected.
     *
     * @param {string[]} receivedArgs
     * @private
     */
    _excessArguments(e) {
      if (this._allowExcessArguments) return;
      let t = this.registeredArguments.length, i = t === 1 ? "" : "s", r = `error: too many arguments${this.parent ? ` for '${this.name()}'` :
      ""}. Expected ${t} argument${i} but got ${e.length}.`;
      this.error(r, { code: "commander.excessArguments" });
    }
    /**
     * Unknown command.
     *
     * @private
     */
    unknownCommand() {
      let e = this.args[0], t = "";
      if (this._showSuggestionAfterError) {
        let n = [];
        this.createHelp().visibleCommands(this).forEach((r) => {
          n.push(r.name()), r.alias() && n.push(r.alias());
        }), t = ue(e, n);
      }
      let i = `error: unknown command '${e}'${t}`;
      this.error(i, { code: "commander.unknownCommand" });
    }
    /**
     * Get or set the program version.
     *
     * This method auto-registers the "-V, --version" option which will print the version number.
     *
     * You can optionally supply the flags and description to override the defaults.
     *
     * @param {string} [str]
     * @param {string} [flags]
     * @param {string} [description]
     * @return {(this | string | undefined)} `this` command for chaining, or version string if no arguments
     */
    version(e, t, i) {
      if (e === void 0) return this._version;
      this._version = e, t = t || "-V, --version", i = i || "output the version number";
      let n = this.createOption(t, i);
      return this._versionOptionName = n.attributeName(), this._registerOption(n), this.on("option:" + n.name(), () => {
        this._outputConfiguration.writeOut(`${e}
`), this._exit(0, "commander.version", e);
      }), this;
    }
    /**
     * Set the description.
     *
     * @param {string} [str]
     * @param {object} [argsDescription]
     * @return {(string|Command)}
     */
    description(e, t) {
      return e === void 0 && t === void 0 ? this._description : (this._description = e, t && (this._argsDescription = t), this);
    }
    /**
     * Set the summary. Used when listed as subcommand of parent.
     *
     * @param {string} [str]
     * @return {(string|Command)}
     */
    summary(e) {
      return e === void 0 ? this._summary : (this._summary = e, this);
    }
    /**
     * Set an alias for the command.
     *
     * You may call more than once to add multiple aliases. Only the first alias is shown in the auto-generated help.
     *
     * @param {string} [alias]
     * @return {(string|Command)}
     */
    alias(e) {
      if (e === void 0) return this._aliases[0];
      let t = this;
      if (this.commands.length !== 0 && this.commands[this.commands.length - 1]._executableHandler && (t = this.commands[this.commands.length -
      1]), e === t._name)
        throw new Error("Command alias can't be the same as its name");
      let i = this.parent?._findCommand(e);
      if (i) {
        let n = [i.name()].concat(i.aliases()).join("|");
        throw new Error(
          `cannot add alias '${e}' to command '${this.name()}' as already have command '${n}'`
        );
      }
      return t._aliases.push(e), this;
    }
    /**
     * Set aliases for the command.
     *
     * Only the first alias is shown in the auto-generated help.
     *
     * @param {string[]} [aliases]
     * @return {(string[]|Command)}
     */
    aliases(e) {
      return e === void 0 ? this._aliases : (e.forEach((t) => this.alias(t)), this);
    }
    /**
     * Set / get the command usage `str`.
     *
     * @param {string} [str]
     * @return {(string|Command)}
     */
    usage(e) {
      if (e === void 0) {
        if (this._usage) return this._usage;
        let t = this.registeredArguments.map((i) => Ye(i));
        return [].concat(
          this.options.length || this._helpOption !== null ? "[options]" : [],
          this.commands.length ? "[command]" : [],
          this.registeredArguments.length ? t : []
        ).join(" ");
      }
      return this._usage = e, this;
    }
    /**
     * Get or set the name of the command.
     *
     * @param {string} [str]
     * @return {(string|Command)}
     */
    name(e) {
      return e === void 0 ? this._name : (this._name = e, this);
    }
    /**
     * Set the name of the command from script filename, such as process.argv[1],
     * or require.main.filename, or __filename.
     *
     * (Used internally and public although not documented in README.)
     *
     * @example
     * program.nameFromFilename(require.main.filename);
     *
     * @param {string} filename
     * @return {Command}
     */
    nameFromFilename(e) {
      return this._name = C.basename(e, C.extname(e)), this;
    }
    /**
     * Get or set the directory for searching for executable subcommands of this command.
     *
     * @example
     * program.executableDir(__dirname);
     * // or
     * program.executableDir('subcommands');
     *
     * @param {string} [path]
     * @return {(string|null|Command)}
     */
    executableDir(e) {
      return e === void 0 ? this._executableDir : (this._executableDir = e, this);
    }
    /**
     * Return program help documentation.
     *
     * @param {{ error: boolean }} [contextOptions] - pass {error:true} to wrap for stderr instead of stdout
     * @return {string}
     */
    helpInformation(e) {
      let t = this.createHelp();
      return t.helpWidth === void 0 && (t.helpWidth = e && e.error ? this._outputConfiguration.getErrHelpWidth() : this._outputConfiguration.
      getOutHelpWidth()), t.formatHelp(this, t);
    }
    /**
     * @private
     */
    _getHelpContext(e) {
      e = e || {};
      let t = { error: !!e.error }, i;
      return t.error ? i = /* @__PURE__ */ u((n) => this._outputConfiguration.writeErr(n), "write") : i = /* @__PURE__ */ u((n) => this._outputConfiguration.
      writeOut(n), "write"), t.write = e.write || i, t.command = this, t;
    }
    /**
     * Output help information for this command.
     *
     * Outputs built-in help, and custom text added using `.addHelpText()`.
     *
     * @param {{ error: boolean } | Function} [contextOptions] - pass {error:true} to write to stderr instead of stdout
     */
    outputHelp(e) {
      let t;
      typeof e == "function" && (t = e, e = void 0);
      let i = this._getHelpContext(e);
      this._getCommandAndAncestors().reverse().forEach((r) => r.emit("beforeAllHelp", i)), this.emit("beforeHelp", i);
      let n = this.helpInformation(i);
      if (t && (n = t(n), typeof n != "string" && !Buffer.isBuffer(n)))
        throw new Error("outputHelp callback must return a string or a Buffer");
      i.write(n), this._getHelpOption()?.long && this.emit(this._getHelpOption().long), this.emit("afterHelp", i), this._getCommandAndAncestors().
      forEach(
        (r) => r.emit("afterAllHelp", i)
      );
    }
    /**
     * You can pass in flags and a description to customise the built-in help option.
     * Pass in false to disable the built-in help option.
     *
     * @example
     * program.helpOption('-?, --help' 'show help'); // customise
     * program.helpOption(false); // disable
     *
     * @param {(string | boolean)} flags
     * @param {string} [description]
     * @return {Command} `this` command for chaining
     */
    helpOption(e, t) {
      return typeof e == "boolean" ? (e ? this._helpOption = this._helpOption ?? void 0 : this._helpOption = null, this) : (e = e ?? "-h, --\
help", t = t ?? "display help for command", this._helpOption = this.createOption(e, t), this);
    }
    /**
     * Lazy create help option.
     * Returns null if has been disabled with .helpOption(false).
     *
     * @returns {(Option | null)} the help option
     * @package
     */
    _getHelpOption() {
      return this._helpOption === void 0 && this.helpOption(void 0, void 0), this._helpOption;
    }
    /**
     * Supply your own option to use for the built-in help option.
     * This is an alternative to using helpOption() to customise the flags and description etc.
     *
     * @param {Option} option
     * @return {Command} `this` command for chaining
     */
    addHelpOption(e) {
      return this._helpOption = e, this;
    }
    /**
     * Output help information and exit.
     *
     * Outputs built-in help, and custom text added using `.addHelpText()`.
     *
     * @param {{ error: boolean }} [contextOptions] - pass {error:true} to write to stderr instead of stdout
     */
    help(e) {
      this.outputHelp(e);
      let t = p.exitCode || 0;
      t === 0 && e && typeof e != "function" && e.error && (t = 1), this._exit(t, "commander.help", "(outputHelp)");
    }
    /**
     * Add additional text to be displayed with the built-in help.
     *
     * Position is 'before' or 'after' to affect just this command,
     * and 'beforeAll' or 'afterAll' to affect this command and all its subcommands.
     *
     * @param {string} position - before or after built-in help
     * @param {(string | Function)} text - string to add, or a function returning a string
     * @return {Command} `this` command for chaining
     */
    addHelpText(e, t) {
      let i = ["beforeAll", "before", "after", "afterAll"];
      if (!i.includes(e))
        throw new Error(`Unexpected value for position to addHelpText.
Expecting one of '${i.join("', '")}'`);
      let n = `${e}Help`;
      return this.on(n, (r) => {
        let o;
        typeof t == "function" ? o = t({ error: r.error, command: r.command }) : o = t, o && r.write(`${o}
`);
      }), this;
    }
    /**
     * Output help information if help flags specified
     *
     * @param {Array} args - array of options to search for help flags
     * @private
     */
    _outputHelpIfRequested(e) {
      let t = this._getHelpOption();
      t && e.find((n) => t.is(n)) && (this.outputHelp(), this._exit(0, "commander.helpDisplayed", "(outputHelp)"));
    }
  };
  function he(s) {
    return s.map((e) => {
      if (!e.startsWith("--inspect"))
        return e;
      let t, i = "127.0.0.1", n = "9229", r;
      return (r = e.match(/^(--inspect(-brk)?)$/)) !== null ? t = r[1] : (r = e.match(/^(--inspect(-brk|-port)?)=([^:]+)$/)) !== null ? (t =
      r[1], /^\d+$/.test(r[3]) ? n = r[3] : i = r[3]) : (r = e.match(/^(--inspect(-brk|-port)?)=([^:]+):(\d+)$/)) !== null && (t = r[1], i =
      r[3], n = r[4]), t && n !== "0" ? `${t}=${i}:${parseInt(n) + 1}` : e;
    });
  }
  u(he, "incrementNodeInspectorPort");
  ce.Command = Q;
});

// ../node_modules/commander/index.js
var ge = _((g) => {
  var { Argument: pe } = V(), { Command: X } = me(), { CommanderError: Qe, InvalidArgumentError: de } = A(), { Help: Xe } = L(), { Option: fe } = J();
  g.program = new X();
  g.createCommand = (s) => new X(s);
  g.createOption = (s, e) => new fe(s, e);
  g.createArgument = (s, e) => new pe(s, e);
  g.Command = X;
  g.Option = fe;
  g.Argument = pe;
  g.Help = Xe;
  g.CommanderError = Qe;
  g.InvalidArgumentError = de;
  g.InvalidOptionArgumentError = de;
});

// ../node_modules/walk-up-path/dist/cjs/index.js
var be = _((H) => {
  "use strict";
  Object.defineProperty(H, "__esModule", { value: !0 });
  H.walkUp = void 0;
  var _e = O("path"), Ze = /* @__PURE__ */ u(function* (s) {
    for (s = (0, _e.resolve)(s); s; ) {
      yield s;
      let e = (0, _e.dirname)(s);
      if (e === s)
        break;
      s = e;
    }
  }, "walkUp");
  H.walkUp = Ze;
});

// ../node_modules/picocolors/picocolors.js
var ve = _((Ut, ie) => {
  var we = process.argv || [], D = process.env, lt = !("NO_COLOR" in D || we.includes("--no-color")) && ("FORCE_COLOR" in D || we.includes("\
--color") || process.platform === "win32" || O != null && O("tty").isatty(1) && D.TERM !== "dumb" || "CI" in D), ut = /* @__PURE__ */ u((s, e, t = s) => (i) => {
    let n = "" + i, r = n.indexOf(e, s.length);
    return ~r ? s + ht(n, e, t, r) + e : s + n + e;
  }, "formatter"), ht = /* @__PURE__ */ u((s, e, t, i) => {
    let n = "", r = 0;
    do
      n += s.substring(r, i) + t, r = i + e.length, i = s.indexOf(e, r);
    while (~i);
    return n + s.substring(r);
  }, "replaceClose"), ye = /* @__PURE__ */ u((s = lt) => {
    let e = s ? ut : () => String;
    return {
      isColorSupported: s,
      reset: e("\x1B[0m", "\x1B[0m"),
      bold: e("\x1B[1m", "\x1B[22m", "\x1B[22m\x1B[1m"),
      dim: e("\x1B[2m", "\x1B[22m", "\x1B[22m\x1B[2m"),
      italic: e("\x1B[3m", "\x1B[23m"),
      underline: e("\x1B[4m", "\x1B[24m"),
      inverse: e("\x1B[7m", "\x1B[27m"),
      hidden: e("\x1B[8m", "\x1B[28m"),
      strikethrough: e("\x1B[9m", "\x1B[29m"),
      black: e("\x1B[30m", "\x1B[39m"),
      red: e("\x1B[31m", "\x1B[39m"),
      green: e("\x1B[32m", "\x1B[39m"),
      yellow: e("\x1B[33m", "\x1B[39m"),
      blue: e("\x1B[34m", "\x1B[39m"),
      magenta: e("\x1B[35m", "\x1B[39m"),
      cyan: e("\x1B[36m", "\x1B[39m"),
      white: e("\x1B[37m", "\x1B[39m"),
      gray: e("\x1B[90m", "\x1B[39m"),
      bgBlack: e("\x1B[40m", "\x1B[49m"),
      bgRed: e("\x1B[41m", "\x1B[49m"),
      bgGreen: e("\x1B[42m", "\x1B[49m"),
      bgYellow: e("\x1B[43m", "\x1B[49m"),
      bgBlue: e("\x1B[44m", "\x1B[49m"),
      bgMagenta: e("\x1B[45m", "\x1B[49m"),
      bgCyan: e("\x1B[46m", "\x1B[49m"),
      bgWhite: e("\x1B[47m", "\x1B[49m"),
      blackBright: e("\x1B[90m", "\x1B[39m"),
      redBright: e("\x1B[91m", "\x1B[39m"),
      greenBright: e("\x1B[92m", "\x1B[39m"),
      yellowBright: e("\x1B[93m", "\x1B[39m"),
      blueBright: e("\x1B[94m", "\x1B[39m"),
      magentaBright: e("\x1B[95m", "\x1B[39m"),
      cyanBright: e("\x1B[96m", "\x1B[39m"),
      whiteBright: e("\x1B[97m", "\x1B[39m"),
      bgBlackBright: e("\x1B[100m", "\x1B[49m"),
      bgRedBright: e("\x1B[101m", "\x1B[49m"),
      bgGreenBright: e("\x1B[102m", "\x1B[49m"),
      bgYellowBright: e("\x1B[103m", "\x1B[49m"),
      bgBlueBright: e("\x1B[104m", "\x1B[49m"),
      bgMagentaBright: e("\x1B[105m", "\x1B[49m"),
      bgCyanBright: e("\x1B[106m", "\x1B[49m"),
      bgWhiteBright: e("\x1B[107m", "\x1B[49m")
    };
  }, "createColors");
  ie.exports = ye();
  ie.exports.createColors = ye;
});

// ../node_modules/ts-dedent/dist/index.js
var ke = _((E) => {
  "use strict";
  Object.defineProperty(E, "__esModule", { value: !0 });
  E.dedent = void 0;
  function Ee(s) {
    for (var e = [], t = 1; t < arguments.length; t++)
      e[t - 1] = arguments[t];
    var i = Array.from(typeof s == "string" ? [s] : s);
    i[i.length - 1] = i[i.length - 1].replace(/\r?\n([\t ]*)$/, "");
    var n = i.reduce(function(l, a) {
      var h = a.match(/\n([\t ]+|(?!\s).)/g);
      return h ? l.concat(h.map(function(c) {
        var m, d;
        return (d = (m = c.match(/[\t ]/g)) === null || m === void 0 ? void 0 : m.length) !== null && d !== void 0 ? d : 0;
      })) : l;
    }, []);
    if (n.length) {
      var r = new RegExp(`
[	 ]{` + Math.min.apply(Math, n) + "}", "g");
      i = i.map(function(l) {
        return l.replace(r, `
`);
      });
    }
    i[0] = i[0].replace(/^\r?\n/, "");
    var o = i[0];
    return e.forEach(function(l, a) {
      var h = o.match(/(?:^|\n)( *)$/), c = h ? h[1] : "", m = l;
      typeof l == "string" && l.includes(`
`) && (m = String(l).split(`
`).map(function(d, b) {
        return b === 0 ? d : "" + c + d;
      }).join(`
`)), o += m + i[a + 1];
    }), o;
  }
  u(Ee, "dedent");
  E.dedent = Ee;
  E.default = Ee;
});

// src/cli/bin/index.ts
var k = S(ge(), 1);
import { getEnvConfig as $e, parseList as Ct, versions as xt } from "@storybook/core/common";
import { addToGlobalContext as wt } from "@storybook/core/telemetry";
import { logger as Ve } from "@storybook/core/node-logger";

// ../node_modules/fd-package-json/dist/esm/main.js
var Z = S(be(), 1);
import { resolve as Oe } from "node:path";
import { stat as et, readFile as tt } from "node:fs/promises";
import { statSync as it, readFileSync as nt } from "node:fs";
async function rt(s) {
  try {
    return (await et(s)).isFile();
  } catch {
    return !1;
  }
}
u(rt, "fileExists");
function st(s) {
  try {
    return it(s).isFile();
  } catch {
    return !1;
  }
}
u(st, "fileExistsSync");
async function ot(s) {
  for (let e of (0, Z.walkUp)(s)) {
    let t = Oe(e, "package.json");
    if (await rt(t))
      return t;
  }
  return null;
}
u(ot, "findPackagePath");
async function P(s) {
  let e = await ot(s);
  if (!e)
    return null;
  try {
    let t = await tt(e, { encoding: "utf8" });
    return JSON.parse(t);
  } catch {
    return null;
  }
}
u(P, "findPackage");
function at(s) {
  for (let e of (0, Z.walkUp)(s)) {
    let t = Oe(e, "package.json");
    if (st(t))
      return t;
  }
  return null;
}
u(at, "findPackagePathSync");
function Ce(s) {
  let e = at(s);
  if (!e)
    return null;
  try {
    let t = nt(e, { encoding: "utf8" });
    return JSON.parse(t);
  } catch {
    return null;
  }
}
u(Ce, "findPackageSync");

// node_modules/leven/index.js
var ee = [], xe = [];
function te(s, e) {
  if (s === e)
    return 0;
  let t = s;
  s.length > e.length && (s = e, e = t);
  let i = s.length, n = e.length;
  for (; i > 0 && s.charCodeAt(~-i) === e.charCodeAt(~-n); )
    i--, n--;
  let r = 0;
  for (; r < i && s.charCodeAt(r) === e.charCodeAt(r); )
    r++;
  if (i -= r, n -= r, i === 0)
    return n;
  let o, l, a, h, c = 0, m = 0;
  for (; c < i; )
    xe[c] = s.charCodeAt(r + c), ee[c] = ++c;
  for (; m < n; )
    for (o = e.charCodeAt(r + m), a = m++, l = m, c = 0; c < i; c++)
      h = o === xe[c] ? a : a + 1, a = ee[c], l = ee[c] = a > l ? h > l ? l + 1 : h : h > a ? a + 1 : h;
  return l;
}
u(te, "leven");

// src/cli/bin/index.ts
var N = S(ve(), 1);

// ../node_modules/tiny-invariant/dist/esm/tiny-invariant.js
var ct = process.env.NODE_ENV === "production", ne = "Invariant failed";
function v(s, e) {
  if (!s) {
    if (ct)
      throw new Error(ne);
    var t = typeof e == "function" ? e() : e, i = t ? "".concat(ne, ": ").concat(t) : ne;
    throw new Error(i);
  }
}
u(v, "invariant");

// src/cli/build.ts
import { cache as mt } from "@storybook/core/common";
import { buildStaticStandalone as pt, withTelemetry as dt } from "@storybook/core/core-server";
var Ae = /* @__PURE__ */ u(async (s) => {
  let e = await P(__dirname);
  v(e, "Failed to find the closest package.json file.");
  let t = {
    ...s,
    configDir: s.configDir || "./.storybook",
    outputDir: s.outputDir || "./storybook-static",
    ignorePreview: !!s.previewUrl && !s.forceBuildPreview,
    configType: "PRODUCTION",
    cache: mt,
    packageJson: e
  };
  await dt(
    "build",
    { cliOptions: s, presetOptions: t },
    () => pt(t)
  );
}, "build");

// src/cli/dev.ts
import { cache as ft } from "@storybook/core/common";
import { buildDevStandalone as gt, withTelemetry as _t } from "@storybook/core/core-server";
import { logger as y, instance as bt } from "@storybook/core/node-logger";
var re = S(ke(), 1);
function Ot(s) {
  bt.heading = "", s instanceof Error ? s.error ? y.error(s.error) : s.stats && s.stats.compilation.errors ? s.stats.compilation.errors.forEach(
  (e) => y.plain(e)) : y.error(s) : s.compilation?.errors && s.compilation.errors.forEach((e) => y.plain(e)), y.line(), y.warn(
    s.close ? re.dedent`
          FATAL broken build!, will close the process,
          Fix the error below and restart storybook.
        ` : re.dedent`
          Broken build, fix the error above.
          You may need to refresh the browser.
        `
  ), y.line();
}
u(Ot, "printError");
var Se = /* @__PURE__ */ u(async (s) => {
  process.env.NODE_ENV = process.env.NODE_ENV || "development";
  let e = await P(__dirname);
  v(e, "Failed to find the closest package.json file.");
  let t = {
    ...s,
    configDir: s.configDir || "./.storybook",
    configType: "DEVELOPMENT",
    ignorePreview: !!s.previewUrl && !s.forceBuildPreview,
    cache: ft,
    packageJson: e
  };
  await _t(
    "dev",
    {
      cliOptions: s,
      presetOptions: t,
      printError: Ot
    },
    () => gt(t)
  );
}, "dev");

// src/cli/bin/index.ts
wt("cliVersion", xt.storybook);
var w = Ce(__dirname);
v(w, "Failed to find the closest package.json file.");
var T = console, He = /* @__PURE__ */ u((s) => k.program.command(s).option(
  "--disable-telemetry",
  "Disable sending telemetry data",
  // default value is false, but if the user sets STORYBOOK_DISABLE_TELEMETRY, it can be true
  process.env.STORYBOOK_DISABLE_TELEMETRY && process.env.STORYBOOK_DISABLE_TELEMETRY !== "false"
).option("--debug", "Get more logs in debug mode", !1).option("--enable-crash-reports", "Enable sending crash reports to telemetry data"), "\
command");
He("dev").option("-p, --port <number>", "Port to run Storybook", (s) => parseInt(s, 10)).option("-h, --host <string>", "Host to run Storyboo\
k").option("-c, --config-dir <dir-name>", "Directory where to load Storybook configurations from").option(
  "--https",
  "Serve Storybook over HTTPS. Note: You must provide your own certificate information."
).option(
  "--ssl-ca <ca>",
  "Provide an SSL certificate authority. (Optional with --https, required if using a self-signed certificate)",
  Ct
).option("--ssl-cert <cert>", "Provide an SSL certificate. (Required with --https)").option("--ssl-key <key>", "Provide an SSL key. (Require\
d with --https)").option("--smoke-test", "Exit after successful start").option("--ci", "CI mode (skip interactive prompts, don't open browse\
r)").option("--no-open", "Do not open Storybook automatically in the browser").option("--loglevel <level>", "Control level of logging during\
 build").option("--quiet", "Suppress verbose build output").option("--no-version-updates", "Suppress update check", !0).option("--debug-webp\
ack", "Display final webpack configurations for debugging purposes").option(
  "--webpack-stats-json [directory]",
  "Write Webpack stats JSON to disk (synonym for `--stats-json`)"
).option("--stats-json [directory]", "Write stats JSON to disk").option(
  "--preview-url <string>",
  "Disables the default storybook preview and lets your use your own"
).option("--force-build-preview", "Build the preview iframe even if you are using --preview-url").option("--docs", "Build a documentation-on\
ly site using addon-docs").option("--exact-port", "Exit early if the desired port is not available").option(
  "--initial-path [path]",
  "URL path to be appended when visiting Storybook for the first time"
).action(async (s) => {
  Ve.setLevel(s.loglevel), T.log(N.default.bold(`${w.name} v${w.version}`) + N.default.reset(`
`)), $e(s, {
    port: "SBCONFIG_PORT",
    host: "SBCONFIG_HOSTNAME",
    staticDir: "SBCONFIG_STATIC_DIR",
    configDir: "SBCONFIG_CONFIG_DIR",
    ci: "CI"
  }), parseInt(`${s.port}`, 10) && (s.port = parseInt(`${s.port}`, 10)), await Se({ ...s, packageJson: w }).catch(() => process.exit(1));
});
He("build").option("-o, --output-dir <dir-name>", "Directory where to store built files").option("-c, --config-dir <dir-name>", "Directory w\
here to load Storybook configurations from").option("--quiet", "Suppress verbose build output").option("--loglevel <level>", "Control level \
of logging during build").option("--debug-webpack", "Display final webpack configurations for debugging purposes").option(
  "--webpack-stats-json [directory]",
  "Write Webpack stats JSON to disk (synonym for `--stats-json`)"
).option("--stats-json [directory]", "Write stats JSON to disk").option(
  "--preview-url <string>",
  "Disables the default storybook preview and lets your use your own"
).option("--force-build-preview", "Build the preview iframe even if you are using --preview-url").option("--docs", "Build a documentation-on\
ly site using addon-docs").option("--test", "Build stories optimized for testing purposes.").action(async (s) => {
  process.env.NODE_ENV = process.env.NODE_ENV || "production", Ve.setLevel(s.loglevel), T.log(N.default.bold(`${w.name} v${w.version}
`)), $e(s, {
    staticDir: "SBCONFIG_STATIC_DIR",
    outputDir: "SBCONFIG_OUTPUT_DIR",
    configDir: "SBCONFIG_CONFIG_DIR"
  }), await Ae({
    ...s,
    packageJson: w,
    test: !!s.test || process.env.SB_TESTBUILD === "true"
  }).catch(() => process.exit(1));
});
k.program.on("command:*", ([s]) => {
  T.error(
    ` Invalid command: %s.
 See --help for a list of available commands.`,
    s
  );
  let t = k.program.commands.map((i) => i.name()).find((i) => te(i, s) < 3);
  t && T.info(`
 Did you mean ${t}?`), process.exit(1);
});
k.program.usage("<command> [options]").version(String(w.version)).parse(process.argv);
