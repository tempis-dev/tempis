"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimelineItem = void 0;
const Utilities_1 = require("./Utilities");
class TimelineItem {
    constructor(definition) {
        var _a;
        this._id = definition.id;
        this._caption = (_a = definition.caption) !== null && _a !== void 0 ? _a : "";
        this._start = (0, Utilities_1.parseDate)(definition.start);
        this._end = (0, Utilities_1.parseDate)(definition.end);
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
}
exports.TimelineItem = TimelineItem;
