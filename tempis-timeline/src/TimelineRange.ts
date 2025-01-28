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

        // TODO
        // We need to draw our minor unit ticks, to do this:
        // Make a copy of fromDt and strip all unit values from the date UP TO the unit we are using. If the unit is minutes strip the seconds and millis, if its days then strip hours, minutes, seconds and millis.
        // e.g. Our fromDT is 'Jan 20 2025 09:00:00' and our toDt is 'Jan 26 2025 09:00:00' and our unit is 'day' and our step is 1.
        // Stripping everything below day from fromDt gives 'Jan 20 2025 00:00:00', this gives us the date of our first tick. In this case it is before fromDt so we don't draw it.
        // Keep modifying this copied date, adding unit*step and rendering the resulting date until it exceeds toDt.
        // We should get ticks for 'Jan 20 2025 00:00:00', 'Jan 21 2025 00:00:00', 'Jan 22 2025 00:00:00', 'Jan 23 2025 00:00:00', 'Jan 24 2025 00:00:00' and 'Jan 26 2025 00:00:00'
    }

    /**
     * https://jsfiddle.net/h2drotkz/6/
     * @param targetMinorTickCount 
     * @returns 
     */
    private _findSensibleMinorUnitAndStep(targetMinorTickCount: number = 5): { unit: Unit, step: number } {
        // Get the millis difference between the two dates.
        const millisDiff = this._toDt.getTime() - this._fromDt.getTime();

        const units: { unit: Unit, factor: number }[] = [
            { unit: 'millisecond', factor: 1 },
            { unit: 'second', factor: 1000 },
            { unit: 'minute', factor: 60 * 1000 },
            { unit: 'hour', factor: 60 * 60 * 1000 },
            { unit: 'day', factor: 24 * 60 * 60 * 1000 },
            { unit: 'week', factor: 7 * 24 * 60 * 60 * 1000 },
            { unit: 'month', factor: 30 * 24 * 60 * 60 * 1000 }, // Approximate a month.
            { unit: 'year', factor: 365 * 24 * 60 * 60 * 1000 }, // Approximate a year.
        ];

        const unitMinorTickCounts: { unit: Unit, ticks: number, step: number }[] = [];

        units.forEach(({ unit, factor }) => {
            // TODO The step values we use should really depend on the unit type. (50 or 100 minutes is silly, but 20 makes sense...maybe)
            [1, 2, 5, 10, 20, 50, 100].forEach((step) => {
                unitMinorTickCounts.push({ unit, ticks: (millisDiff / factor) / step, step })    
            });
        });

        unitMinorTickCounts.sort((a, b) => {
            return Math.abs(a.ticks - targetMinorTickCount) - Math.abs(b.ticks - targetMinorTickCount);
        });

        return { unit: unitMinorTickCounts[0].unit, step: unitMinorTickCounts[0].step };
    }
}