import { TempisTimelineItem as TimelineItemDefinition } from "./TempisTimelineOptions";
import { parseDate } from "./Utilities";

export class TimelineItem {
    private readonly _id: string | number;
    private readonly _caption: string;
    private readonly _start: Date;
    private readonly _end: Date | null;

    public constructor(definition: TimelineItemDefinition) {
        this._id = definition.id;
        this._caption = definition.caption ?? "";
        this._start = parseDate(definition.start);
        this._end = definition.end ? parseDate(definition.end) : null;
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
}