import { TempisTimelineItemStyle, TempisTimelineItem as TimelineItemDefinition } from "./TempisTimelineOptions";
import { defaults, parseDate } from "./Utilities";

/** The default item style. */
export const DEFAULT_ITEM_STYLE: TempisTimelineItemStyle = {
    backgroundColor: "#1a006eff",
    fontColor: "#FFFFFF",
    padding: 12,
    borderRadius: 5
};

export class TimelineItem {
    private readonly _id: string | number;
    private readonly _caption: string;
    private readonly _start: Date;
    private readonly _end: Date | null;
    private readonly _style: TempisTimelineItemStyle;

    /**
     * Creates a new instance of the TimelineItem class.
     * @param definition The item definition.
     */
    public constructor(definition: Omit<TimelineItemDefinition, "style">, style: TempisTimelineItemStyle) {
        this._id = definition.id;
        this._caption = definition.caption ?? "";
        this._start = parseDate(definition.start);
        this._end = definition.end ? parseDate(definition.end) : null;
        this._style = style;
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
}