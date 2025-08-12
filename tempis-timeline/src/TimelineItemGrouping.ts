import { TimelineItem } from "./TimelineItem";
import { doDateRangesOverlap } from "./Utilities";

/**
 * A named grouping of timeline items.
 */
export class TimelineItemGrouping {
    /** The group name. */
    private readonly _group: string;

    /** The group items. */
    private readonly _items: TimelineItem[];

    /**
     * Creates a new instance of the TimelineItemGrouping class.
     * @param group The group name.
     * @param items The groupe item models.
     */
    public constructor(group: string, items: TimelineItem[]) {
        this._group = group;

        this._items = items;

        // Our items should always be sorted by start date.
        this._sortItemsByStartDate();
    }

    /** Gets the group name. */
    public get group(): string {
        return this._group;
    }

    /** Gets the group items. */
    public get items(): TimelineItem[] {
        return this._items;
    }

    /**
     * Gets all items in this group that have a start or end date that lie within the specified range inclusively.
     * @param fromDt The range from date.
     * @param toDt The range to date.
     * @returns All items in this group that have a start or end date that lie within the specified range inclusively.
     */
    public getItemsInRange(fromDt: Date, toDt: Date): TimelineItem[] {
        return this._items.filter((item) => {
            if (item.end) {
                return doDateRangesOverlap(item.start, item.end, fromDt, toDt);
            } else {
                return item.start.getTime() >= fromDt.getTime() && item.start.getTime() <= toDt.getTime();
            }
        });
    }

    /**
     * Sort the group items by start date.
     */
    private _sortItemsByStartDate() : void {
        this._items.sort((a, b) => a.start.getTime() - b.start.getTime());
    }
}