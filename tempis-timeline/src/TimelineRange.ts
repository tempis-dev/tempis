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

    /**
     * Draw the timeline range onto the canvas.
     * @param context The canvas 2D context.
     */
    public draw(context: CanvasRenderingContext2D): void {
        // Calculate a sensible minor unit and step for the range.
        const sensibleUnitAndStep = this._findSensibleMinorUnitAndStep();

        // console.log(sensibleUnitAndStep);

        // TODO We can work out major/minor tick position by doing getTime on each major/minor unit date.
    }

    private _findSensibleMinorUnitAndStep(targetMinorTickCount: number = 5): { unit: Unit, step: number } {
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
        const unitMinorTickCounts = units.map(({ unit, factor }) => {
            return { unit, ticks: millisDiff / factor };
        });

        console.log(unitMinorTickCounts);

        const sortedUnitMinorTickCounts = unitMinorTickCounts.sort((a, b) => {
            return Math.abs(a.ticks - targetMinorTickCount) - Math.abs(b.ticks - targetMinorTickCount);
        });

        // TODO For each ticks get a new ticks where new ticks is ticks divided by 2, 5, 10, 20, 50 then 100 

        console.log(sortedUnitMinorTickCounts);

        return { unit: "day", step: 1 };
    }
}