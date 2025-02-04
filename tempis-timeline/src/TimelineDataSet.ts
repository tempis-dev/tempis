import { TempisTimelineItem } from "./TempisTimelineOptions";
import { TimelineItemGrouping } from "./TimelineItemGrouping";
import { TempisTimelineItem as TimelineItemDefinition } from "./TempisTimelineOptions";

export class TimelineDataSet {
    /** The timeline item groupings. */
    private _itemGroupings: TimelineItemGrouping[] = [];

    /** The minimum date of any item. */
    private _minDate: Date | null = null;

    /** The maximum date of any item. */
    private _maxDate: Date | null = null;

    /** The callback to invoke whenever the dataset changes. */
    private readonly _onChange: (() => void) | null;

    /**
     * Creates a new instance of the TimelineDataSet class.
     * @param onChange A callback to invoke whenever the dataset changes.
     */
    public constructor(onChange?: () => void) {
        this._onChange = onChange ?? null;
    }

    /** Gets the item groupings. */
    public get groupings(): TimelineItemGrouping[] {
        return [...this._itemGroupings];
    }

    /** Gets the min date of any item in the dataset, or null if empty. */
    public get minDate(): Date | null {
        return this._minDate;
    }

    /** Gets the max date of any item in the dataset, or null if empty. */
    public get maxDate(): Date | null {
        return this._maxDate;
    }

    /**
     * Creates the timeline item groupings.
     */
    public createGroupings(itemDefinitions: TimelineItemDefinition[]) {
        // Clear any existing item groupings.
        this._itemGroupings = [];

        // Create a mapping of group names to item group item definitions.
        const itemGroupingMap: { [key: string]: TempisTimelineItem[] } = {};

        for (const itemDefinition of itemDefinitions ?? []) {
            // Our grouping key will default to just an empty string.
            const groupingKey = itemDefinition.grouping ?? "";

            // Try to get the existing grouping for this item.
            let group = itemGroupingMap[groupingKey];

            // Create a new group if there isn't one for this grouping.
            if (!group) {
                group = [];
                itemGroupingMap[groupingKey] = group;
            }

            // Add the definition for the current item to its group.
            group.push(itemDefinition);
        }

        // Create our new item groupings.
        for (const [key, value] of Object.entries(itemGroupingMap)) {
            this._itemGroupings.push(new TimelineItemGrouping(key, value));
        }

        // Find the min and max dates of any start/end item dates.
        this._findMinAndMaxDates();

        // Invoke the onChange callback.
        // TODO We should eventually try to only call this IF the state of our dataset has changed.
        this._onChange?.();
    }

    /**
     * Find the min and max dates of any start/end item dates.
     */
    private _findMinAndMaxDates(): void {
        // Do we have no items to use in finding a range?
        if (this._itemGroupings.length === 0 || this._itemGroupings[0].items.length === 0) {
            this._minDate = null;
            this._maxDate = null;
            return;
        }

        let minDate: Date | null = null;
        let maxDate: Date | null = null;

        for (const grouping of this._itemGroupings) {
            for (const item of grouping.items) {
                if (minDate === null || item.start.getTime() < minDate.getTime()) {
                    minDate = item.start;
                }
                if (maxDate === null || (item.end ?? item.start).getTime() > maxDate.getTime()) {
                    maxDate = item.end ?? item.start;
                }
            }
        }

        this._minDate = minDate;
        this._maxDate = maxDate;
    }
}