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

    /**
     * Sets the from and to date value of the range.
     * @param from 
     * @param to 
     */
    public setRange(from: Date, to: Date): void {
        this._fromDt = from;
        this._toDt = to;
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
        }
        else if (unit === "second") {
            this._fromDt.setSeconds(this._fromDt.getSeconds() + step);
            this._toDt.setSeconds(this._toDt.getSeconds() + step);
        }
        else if (unit === "minute") {
            this._fromDt.setMinutes(this._fromDt.getMinutes() + step);
            this._toDt.setMinutes(this._toDt.getMinutes() + step);
        }
        else if (unit === "hour") {
            this._fromDt.setHours(this._fromDt.getHours() + step);
            this._toDt.setHours(this._toDt.getHours() + step);
        }
    }

    public clear(): void {
        // Clearing the range is just a matter of putting the default from/to back.
        this.setRange(new Date(0), new Date(4102444800000));
    }

    /**
     * Draw the timeline range onto the canvas.
     * @param context The canvas 2D context.
     */
    public draw(context: CanvasRenderingContext2D): void {
        // Get the dimensions of the canvas
        var sizeWidth = context.canvas.clientWidth;
        var sizeHeight = context.canvas.clientHeight;
        var scaleWidth = sizeWidth/100;
        var scaleHeight = sizeHeight/100;

        // Find a sensible number of minor ticks to render.
        const targetTickCount = Math.floor(sizeWidth / 120);

        // Calculate a sensible minor unit and step for the range.
        const sensibleUnitAndStep = this._findSensibleMinorUnitAndStep(targetTickCount);

        // Get our minor tick dates.
        const minorTickDates = this._getMinorTickDates(sensibleUnitAndStep);

        console.log({ sizeWidth, sizeHeight });

        const rangeContainerHeight = 50;
        const rangeContainerWidth = sizeWidth;

        context.globalCompositeOperation = "source-over";
        context.fillStyle = "#FFFFFF";
        context.fillRect(0 , sizeHeight - rangeContainerHeight, rangeContainerWidth, rangeContainerHeight);
        context.globalCompositeOperation = "source-over";
        context.lineWidth = 2;
        context.strokeStyle="#8a8a8a";
        context.strokeRect(0, sizeHeight - rangeContainerHeight, rangeContainerWidth, rangeContainerHeight);

        const milliRenderWidth = sizeWidth / (this._toDt.getTime() - this._fromDt.getTime());

        for (const minorTickDate of minorTickDates) {
            const tickX = milliRenderWidth * (minorTickDate.getTime() - this._fromDt.getTime());
            const tickY = sizeHeight - rangeContainerHeight;

            // Start a new Path
            context.beginPath();
            context.moveTo(tickX, tickY);
            context.lineTo(tickX, tickY + 30);

            // Draw the Path
            context.stroke();

            // Draw the date label text
            context.font = "12px Arial";
            context.fillStyle = "#8a8a8a";
            context.fillText(minorTickDate.toLocaleDateString(), tickX + 3, tickY + 14);
            context.fillText(minorTickDate.toLocaleTimeString(), tickX + 3, tickY + 28);
        }
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

    /**
     * https://jsfiddle.net/mxh08wLd/1/
     * @param unitAndStep 
     * @returns 
     */
    private _getMinorTickDates(unitAndStep: { unit: Unit, step: number }): any {
        // Make a copy of fromDt and strip all unit values from the date UP TO the unit we are using. If the unit is minutes strip the seconds and millis, if its days then strip hours, minutes, seconds and millis.
        // e.g. Our fromDT is 'Jan 20 2025 09:00:00' and our toDt is 'Jan 26 2025 09:00:00' and our unit is 'day' and our step is 1.
        // Stripping everything below day from fromDt gives 'Jan 20 2025 00:00:00', this gives us the date of our first tick. In this case it is before fromDt so we don't draw it.
        // Keep modifying this copied date, adding unit*step and rendering the resulting date until it exceeds toDt.
        // We should get ticks for 'Jan 20 2025 00:00:00', 'Jan 21 2025 00:00:00', 'Jan 22 2025 00:00:00', 'Jan 23 2025 00:00:00', 'Jan 24 2025 00:00:00' and 'Jan 26 2025 00:00:00'

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