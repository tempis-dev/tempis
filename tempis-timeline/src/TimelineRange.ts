import { TempisTimelineRangeOptions } from "./TempisTimelineOptions";

export type Unit = 'millisecond' | 'second' | 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year';

export class TimelineRange {
    /** The timeline range options. */
    private readonly _options: TempisTimelineRangeOptions;

    /**
     * The current from date of the timeline range.
     * Defaults to Thu Jan 01 1970 01:00:00 GMT+0100.
     */
    private _fromDt: Date = new Date(0);

    /**
     * The current to date of the timeline range.
     * Defaults to Fri Jan 01 2100 00:00:00 GMT+0000.
     */
    private _toDt: Date = new Date(4102444800000);

    /**
     * The current major unit of the timeline range.
     * Defaults to "year" for the default timeline range of 100 years.
     */
    private _majorUnit: Unit = "year";

    /**
     * The current major unit step value of the timeline range.
     * Defaults to 20 for the default timeline range of 100 years, giving 5 major ticks.
     */
    private _majorUnitStep: number = 20;

    /**
     * Creates a new instance of the TimelineRange class.
     * @param options The timeline range options.
     */
    public constructor(options: TempisTimelineRangeOptions = {}) {
        this._options = options;
    }

    public setRange(from: Date, to: Date): void {
        this._fromDt = from;
        this._toDt = to;
    }

    public setSensibleMajorUnitAndStep(targetMajorTickCount: number = 5): void {
        // Get the millis difference between the two dates.
        const millisDiff = this._toDt.getTime() - this._fromDt.getTime();

        const units = [
            { unit: 'millisecond', factor: 1 },
            { unit: 'second', factor: 1000 },
            { unit: 'minute', factor: 60 * 1000 },
            { unit: 'hour', factor: 60 * 60 * 1000 },
            { unit: 'day', factor: 24 * 60 * 60 * 1000 },
            { unit: 'week', factor: 7 * 24 * 60 * 60 * 1000 },
            { unit: 'month', factor: 30 * 24 * 60 * 60 * 1000 }, // Approximate a month.
            { unit: 'year', factor: 365 * 24 * 60 * 60 * 1000 }, // Approximate a year.
        ];

        // Calculate how many major ticks we would show for each unit if using a step value of one.
        const unitMajorTickCounts = units.map(({ unit, factor }) => ({ unit, ticks: millisDiff / factor }));
    }
}