import { TempisTimelineBand, TempisTimelineBandStyle } from "./TempisTimelineOptions";
import { defaults, parseDate } from "./Utilities";

/**
 * The default band style.
 */
export const DEFAULT_BAND_STYLE: TempisTimelineBandStyle = {
    color: "#3b2680ff",
    opacity: 0.4
};

/**
 * Represents a band in the timeline.
 */
export class TimelineBand {
    private readonly _definition: TempisTimelineBand;
    private readonly _start: Date;
    private readonly _end: Date | null;
    private readonly _style: TempisTimelineBandStyle;

    /**
     * Creates a new instance of the TimelineBand class.
     * @param definition The band definition.
     */
    public constructor(definition: TempisTimelineBand) {
        this._definition = definition;
        this._start = parseDate(definition.start);
        this._end = definition.end ? parseDate(definition.end) : null;
        this._style = defaults(definition.style ?? {}, DEFAULT_BAND_STYLE)!;
    }

    /** Gets the start date of the band. */
    public get start(): Date {
        return this._start;
    }

    /** Gets the end date of the band, or null if the band is a PIT band. */
    public get end(): Date | null {
        return this._end;
    }

    /** Gets the band style. */
    public get style(): TempisTimelineBandStyle {
        return this._style;
    }
}
