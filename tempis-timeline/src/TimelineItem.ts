import { TempisTimelineItemStyle, TempisTimelineItem as TimelineItemDefinition } from "./TempisTimelineOptions";
import { parseDate } from "./Utilities";

/** The default item style. */
export const DEFAULT_ITEM_STYLE: TempisTimelineItemStyle = {
    backgroundColor: "#1a006eff",
    fontColor: "#FFFFFF",
    padding: 12,
    borderRadius: 5
};

export class TimelineItem {
    private readonly _definition: TimelineItemDefinition;
    private readonly _id: string | number;
    private readonly _caption: string;
    private readonly _start: Date;
    private readonly _end: Date | null;
    private readonly _style: TempisTimelineItemStyle;

    /** Whether the item is currently selected. */
    private _isSelected: boolean;

    /**
     * Creates a new instance of the TimelineItem class.
     * @param definition The item definition.
     * @param style The item style to use.
     */
    public constructor(definition: TimelineItemDefinition, style: TempisTimelineItemStyle) {
        this._definition = definition;
        this._id = definition.id;
        this._caption = definition.caption ?? "";
        this._start = parseDate(definition.start);
        this._end = definition.end ? parseDate(definition.end) : null;
        this._style = style;
        this._isSelected = !!definition.selected;
    }

    public get definition(): TimelineItemDefinition {
        return this._definition;
    }

    public get id(): string | number {
        return this._id;
    }

    public get caption(): string {
        return this._caption;
    }

    public get start(): Date {
        return this._start;
    }

    public get end(): Date | null {
        return this._end;
    }

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
}