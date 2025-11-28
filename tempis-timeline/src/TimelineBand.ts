import { TempisTimelineBand } from "./TempisTimelineOptions";
import { parseDate } from "./Utilities";

/**
 * Represents a band in the timeline.
 */
export class TimelineBand {
    private readonly _definition: TempisTimelineBand; 
    private readonly _start: Date;
    private readonly _end: Date | null;

    /**
     * Creates a new instance of the TimelineBand class.
     * @param definition The band definition.
     */
    public constructor(definition: TempisTimelineBand) {
        this._definition = definition;
        this._start = parseDate(definition.start);
        this._end = definition.end ? parseDate(definition.end) : null;
    }

    /** Gets the start date of the band. */
    public get start(): Date {
        return this._start;
    }

    /** Gets the end date of the band, or null if the band is a PIT band. */
    public get end(): Date | null {
        return this._end;
    }

    // TODO Add band style properties.
}