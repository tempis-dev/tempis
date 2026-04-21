import { TempisTimelineItemStyle, TempisTimelineItem as TimelineItemDefinition } from "./TempisTimelineOptions";
import { parseDate } from "./Utilities";

/**
 * The default item style.
 */
export const DEFAULT_ITEM_STYLE: TempisTimelineItemStyle = {
    backgroundColor: "#3b2680ff",
    fontColor: "#FFFFFF",
    padding: 10,
    borderRadius: 5
};

/**
 * Represents an item in the timeline.
 */
export class TimelineItem {
    private readonly _definition: TimelineItemDefinition;
    private readonly _id: string | number;
    private readonly _category: string | null;
    private readonly _label: string;
    private readonly _start: Date;
    private readonly _end: Date | null;
    private readonly _style: TempisTimelineItemStyle;

    /** Whether the item is currently selected. */
    private _isSelected: boolean;

    /** IDs of items this item depends on. */
    private readonly _dependencies: (string | number)[];

    /**
     * Creates a new instance of the TimelineItem class.
     * @param definition The item definition.
     * @param style The item style to use.
     */
    public constructor(definition: TimelineItemDefinition, style: TempisTimelineItemStyle) {
        this._definition = definition;
        this._id = definition.id;
        this._category = definition.category ?? null;
        this._label = definition.label ?? "";
        this._start = parseDate(definition.start);
        this._end = definition.end ? parseDate(definition.end) : null;
        this._style = style;
        this._isSelected = !!definition.selected;
        this._dependencies = definition.dependencies ?? [];
    }

    /** Gets the item definition. */
    public get definition(): TimelineItemDefinition {
        return this._definition;
    }

    /** Gets the item identifier. */
    public get id(): string | number {
        return this._id;
    }

    /** Gets the item category name, or null if no category is defined. */
    public get category(): string | null {
        return this._category;
    }

    /** Gets the item label. */
    public get label(): string {
        return this._label;
    }

    /** Gets the start date of the item. */
    public get start(): Date {
        return this._start;
    }

    /** Gets the end date of the item, or null if the item is a PIT item. */
    public get end(): Date | null {
        return this._end;
    }

    /** Gets the item style. */
    public get style(): TempisTimelineItemStyle {
        return this._style;
    }

    /** Gets or sets whether the item is currently selected. */
    public get isSelected(): boolean {
        return this._isSelected;
    }
    public set isSelected(value: boolean) {
        this._isSelected = value;
    }

    /** Gets the IDs of items this item depends on. */
    public get dependencies(): (string | number)[] {
        return this._dependencies;
    }
}
