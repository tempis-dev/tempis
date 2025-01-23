import { TempisTimelineItem as TimelineItemDefinition } from "./TempisTimelineOptions";
import { TimelineItem } from "./TimelineItem";

export class TimelineItemGrouping {
    private readonly _group: string;
    private readonly _items: TimelineItem[];

    public constructor(group: string, items: TimelineItemDefinition[]) {
        this._group = group;
        this._items = items.map((itemDefinition) => new TimelineItem(itemDefinition));
    }

    public get group(): string {
        return this._group;
    }

    public get items(): TimelineItem[] {
        return this._items;
    }
}