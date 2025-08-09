"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimelineItemGrouping = void 0;
const TimelineItem_1 = require("./TimelineItem");
const Utilities_1 = require("./Utilities");
class TimelineItemGrouping {
    /** Creates a new instance of the TimelineItemGrouping class. */
    constructor(group, items) {
        this._group = group;
        // Create the group items. 
        this._items = items.map((itemDefinition) => new TimelineItem_1.TimelineItem(itemDefinition));
        // Our items should always be sorted by start date.
        this._sortItemsByStartDate();
    }
    /** Gets the group name. */
    get group() {
        return this._group;
    }
    /** Gets the group items. */
    get items() {
        return this._items;
    }
    /**
     * Gets all items in this group that have a start or end date that lie within the specified range inclusively.
     * @param fromDt The range from date.
     * @param toDt The range to date.
     * @returns All items in this group that have a start or end date that lie within the specified range inclusively.
     */
    getItemsInRange(fromDt, toDt) {
        return this._items.filter((item) => {
            if (item.end) {
                return (0, Utilities_1.doDateRangesOverlap)(item.start, item.end, fromDt, toDt);
            }
            else {
                return item.start.getTime() >= fromDt.getTime() && item.start.getTime() <= toDt.getTime();
            }
        });
    }
    /**
     * Sort the group items by start date.
     */
    _sortItemsByStartDate() {
        this._items.sort((a, b) => a.start.getTime() - b.start.getTime());
    }
}
exports.TimelineItemGrouping = TimelineItemGrouping;
