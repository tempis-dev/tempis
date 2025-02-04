import { TempisTimelineItem as TimelineItemDefinition } from "./TempisTimelineOptions";
import { TimelineItem } from "./TimelineItem";

export class TimelineItemGrouping {
    /** The group name. */
    private readonly _group: string;

    /** The group items. */
    private readonly _items: TimelineItem[];

    /** Creates a new instance of the TimelineItemGrouping class. */
    public constructor(group: string, items: TimelineItemDefinition[]) {
        this._group = group;

        // Create the group items. 
        this._items = items.map((itemDefinition) => new TimelineItem(itemDefinition));

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
     * Sort the group items by start date.
     */
    private _sortItemsByStartDate() : void {
        this._items.sort((a, b) => b.start.getTime() - a.start.getTime());
    }
}