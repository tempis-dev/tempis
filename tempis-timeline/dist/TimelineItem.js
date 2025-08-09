"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimelineItem = void 0;
const Utilities_1 = require("./Utilities");
/** The default item style. */
const DEFAULT_ITEM_STYLE = {
    backgroundColor: "#2C318F",
    fontColor: "#FFFFFF",
    padding: 12,
    borderRadius: 5
};
class TimelineItem {
    constructor(definition) {
        var _a, _b;
        this._id = definition.id;
        this._caption = (_a = definition.caption) !== null && _a !== void 0 ? _a : "";
        this._start = (0, Utilities_1.parseDate)(definition.start);
        this._end = definition.end ? (0, Utilities_1.parseDate)(definition.end) : null;
        this._style = (0, Utilities_1.defaults)((_b = definition.style) !== null && _b !== void 0 ? _b : {}, DEFAULT_ITEM_STYLE);
    }
    get id() {
        return this._id;
    }
    get caption() {
        return this._caption;
    }
    get start() {
        return this._start;
    }
    get end() {
        return this._end;
    }
    get style() {
        return this._style;
    }
}
exports.TimelineItem = TimelineItem;
