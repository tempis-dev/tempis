import { TempisTimelineRangeOptions } from "./TempisTimelineOptions";

export type Unit = 'millisecond' | 'second' | 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year';

export type UnitAndStep = { unit: Unit, step: number };

export class TimelineRange {
    /** The timeline canvas. */
    private readonly _canvas: HTMLCanvasElement;

    /** The timeline range options. */
    private readonly _options: TempisTimelineRangeOptions;

    /**
     * The current from date of the timeline range.
     * Defaults to the current date.
     */
    private _fromDt: Date = new Date();

    /**
     * The current to date of the timeline range.
     * Defaults to 10 years from now.
     */
    private _toDt: Date = new Date(this._fromDt.getTime() + 315569520000);

    /** The current minor tick unit and step. */
    private _minorTickUnitAndStep: UnitAndStep = { unit: 'year', step: 2 };

    /** The calculated minor unit tick dates fro the current range and canvas width. */
    private _minorTickUnitDates: Date[] = [];

    /**
     * Creates a new instance of the TimelineRange class.
     * @param canvas The canvas.
     * @param options The timeline range options.
     */
    public constructor(canvas: HTMLCanvasElement, options: TempisTimelineRangeOptions = {}) {
        this._canvas = canvas;
        this._options = options;
    }

    /**
     * Sets the from and to date value of the range.
     * @param from 
     * @param to 
     */
    public setRange(from: Date, to: Date): void {
        this._fromDt = from;
        this._toDt = to;

        // Our range has changed so we will need to recalculate our minor unit ticks.
        this.calculateMinorUnitTickDates();
    }

    /**
     * Moves the from and to date value of the range uniformly.
     * @param unit 
     * @param step 
     */
    public moveRange(unit: Unit, step: number): void {
        if (unit === "millisecond") {
            this._fromDt.setMilliseconds(this._fromDt.getMilliseconds() + step);
            this._toDt.setMilliseconds(this._toDt.getMilliseconds() + step);
        } else if (unit === "second") {
            this._fromDt.setSeconds(this._fromDt.getSeconds() + step);
            this._toDt.setSeconds(this._toDt.getSeconds() + step);
        } else if (unit === "minute") {
            this._fromDt.setMinutes(this._fromDt.getMinutes() + step);
            this._toDt.setMinutes(this._toDt.getMinutes() + step);
        } else if (unit === "hour") {
            this._fromDt.setHours(this._fromDt.getHours() + step);
            this._toDt.setHours(this._toDt.getHours() + step);
        } else {
            // This is a unit that we cannot move.
            return;
        }

        // Our range has changed so we will need to recalculate our minor unit ticks.
        this.calculateMinorUnitTickDates();
    }

    /**
     * Zooms the from and to date value of the range.
     * @param unit 
     * @param step 
     */
    public zoomRange(unit: Unit, step: number): void {
        if (unit === "millisecond") {
            this._fromDt.setMilliseconds(this._fromDt.getMilliseconds() - step);
            this._toDt.setMilliseconds(this._toDt.getMilliseconds() + step);
        } else if (unit === "second") {
            this._fromDt.setSeconds(this._fromDt.getSeconds() - step);
            this._toDt.setSeconds(this._toDt.getSeconds() + step);
        } else if (unit === "minute") {
            this._fromDt.setMinutes(this._fromDt.getMinutes() - step);
            this._toDt.setMinutes(this._toDt.getMinutes() + step);
        } else if (unit === "hour") {
            this._fromDt.setHours(this._fromDt.getHours() - step);
            this._toDt.setHours(this._toDt.getHours() + step);
        } else {
            // This is a unit that we cannot zoom.
            return;
        }

        // Our range has changed so we will need to recalculate our minor unit ticks.
        this.calculateMinorUnitTickDates();
    }

    public clear(): void {
        // Clearing the range is just a matter of putting the default from/to back.
        this.setRange(new Date(0), new Date(4102444800000));
    }

    public calculateRequiredHeight(): number {
        // TODO Work this out properly by determining how much height the minor/major unit labels take up.
        return 50;
    }
    
    public calculateMinorUnitTickDates(): void {
        // Find a sensible number of minor ticks to render.
        const targetTickCount = Math.floor(this._canvas.width / 120);

        // Calculate a sensible minor unit and step for the range.
        const sensibleUnitAndStep = this._findSensibleMinorUnitAndStep(targetTickCount);

        // Get our minor unit tick dates.
        this._minorTickUnitDates = this._getMinorTickDates(sensibleUnitAndStep);
    }

    /**
     * Draw the timeline range onto the canvas.
     * @param context The canvas 2D context.
     */
    public draw(context: CanvasRenderingContext2D): void {
        // Get the dimensions of the canvas
        var sizeWidth = context.canvas.clientWidth;
        var sizeHeight = context.canvas.clientHeight;

        // Figure out our range container dimensions.
        const rangeContainerHeight = this.calculateRequiredHeight();
        const rangeContainerWidth = sizeWidth;    

        const milliRenderWidth = sizeWidth / (this._toDt.getTime() - this._fromDt.getTime());

        // Draw the top line of the range bar.
        context.lineWidth = 0.8;
        context.strokeStyle="#8a8a8a";
        context.beginPath();
        context.moveTo(0, sizeHeight - rangeContainerHeight);
        context.lineTo(rangeContainerWidth, sizeHeight - rangeContainerHeight);
        context.stroke();

        for (const minorTickDate of this._minorTickUnitDates) {
            const tickX = milliRenderWidth * (minorTickDate.getTime() - this._fromDt.getTime());
            const tickY = sizeHeight - rangeContainerHeight;

            // Start a new Path
            context.beginPath();
            context.moveTo(tickX, tickY);
            context.lineTo(tickX, tickY + 30);

            // Draw the Path
            context.stroke();

            // Draw the date label text
            context.lineWidth = 0.5;
            context.font = "14px Arial";
            context.fillStyle = "#595959";
            context.fillText(minorTickDate.toLocaleDateString(), tickX + 3, tickY + 14);
            context.fillText(minorTickDate.toLocaleTimeString(), tickX + 3, tickY + 28);
        }
    }

    /**
     * https://jsfiddle.net/h2drotkz/6/
     * @param targetMinorTickCount 
     * @returns 
     */
    private _findSensibleMinorUnitAndStep(targetMinorTickCount: number = 5): UnitAndStep {
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

    /**
     * https://jsfiddle.net/mxh08wLd/1/
     * @param unitAndStep 
     * @returns 
     */
    private _getMinorTickDates(unitAndStep: { unit: Unit, step: number }): any {
        let currentDate;

        // We need to strip unit values below the tick unit
        if (unitAndStep.unit === "year") {
            currentDate = new Date(this._fromDt.getFullYear(), 0);
        }
        else if (unitAndStep.unit === "month") {
            currentDate = new Date(this._fromDt.getFullYear(), this._fromDt.getMonth());
        }
        else if (unitAndStep.unit === "week") {
            currentDate = new Date(this._fromDt.getFullYear(), this._fromDt.getMonth());
            //currentDate.setWeek(fromDt.getWeek());
        }
        else if (unitAndStep.unit === "day") {
            currentDate = new Date(this._fromDt.getFullYear(), this._fromDt.getMonth(), this._fromDt.getDate());
            //currentDate.setWeek(fromDt.getWeek());
        }
        else if (unitAndStep.unit === "hour") {
            currentDate = new Date(this._fromDt.getFullYear(), this._fromDt.getMonth(), this._fromDt.getDate(), this._fromDt.getHours());
            //currentDate.setWeek(fromDt.getWeek());
        }
        else if (unitAndStep.unit === "minute") {
            currentDate = new Date(this._fromDt.getFullYear(), this._fromDt.getMonth(), this._fromDt.getDate(), this._fromDt.getHours(), this._fromDt.getMinutes());
            //currentDate.setWeek(fromDt.getWeek());
        }
        else if (unitAndStep.unit === "second") {
            currentDate = new Date(this._fromDt.getFullYear(), this._fromDt.getMonth(), this._fromDt.getDate(), this._fromDt.getHours(), this._fromDt.getMinutes(), this._fromDt.getSeconds());
            //currentDate.setWeek(fromDt.getWeek());
        }
        else if (unitAndStep.unit === "millisecond") {
            currentDate = new Date(this._fromDt.getFullYear(), this._fromDt.getMonth(), this._fromDt.getDate(), this._fromDt.getHours(), this._fromDt.getMinutes(), this._fromDt.getSeconds(), this._fromDt.getMilliseconds());
            //currentDate.setWeek(fromDt.getWeek());
        } else {
            throw new Error("unknown unit!");
        }

        const minorTickDates = [currentDate];

        // This should give an array of tick dates with the first and last being outside the from/to range (wont be rendered)
        while (currentDate.getTime() < this._toDt.getTime()) {
            currentDate = new Date(currentDate.getTime());

            if (unitAndStep.unit === "year") {
                currentDate.setFullYear(currentDate.getFullYear() + unitAndStep.step);
            }
            if (unitAndStep.unit === "month") {
                currentDate.setMonth(currentDate.getMonth() + unitAndStep.step);
            }
            if (unitAndStep.unit === "week") {
                // TODO Figure out what to do here.
            }
            if (unitAndStep.unit === "day") {
                currentDate.setDate(currentDate.getDate() + unitAndStep.step);
            }
            if (unitAndStep.unit === "hour") {
                currentDate.setHours(currentDate.getHours() + unitAndStep.step);
            }
            if (unitAndStep.unit === "minute") {
                currentDate.setMinutes(currentDate.getMinutes() + unitAndStep.step);
            }
            if (unitAndStep.unit === "second") {
                currentDate.setSeconds(currentDate.getSeconds() + unitAndStep.step);
            }
            if (unitAndStep.unit === "millisecond") {
                currentDate.setMilliseconds(currentDate.getMilliseconds() + unitAndStep.step);
            }

            minorTickDates.push(currentDate);
        }

        return minorTickDates;
    }
}