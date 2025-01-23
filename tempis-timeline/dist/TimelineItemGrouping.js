"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimelineItemGrouping = void 0;
const TimelineItem_1 = require("./TimelineItem");
class TimelineItemGrouping {
    constructor(group, items) {
        this._group = group;
        this._items = items.map((itemDefinition) => new TimelineItem_1.TimelineItem(itemDefinition));
    }
    get group() {
        return this._group;
    }
    get items() {
        return this._items;
    }
}
exports.TimelineItemGrouping = TimelineItemGrouping;
