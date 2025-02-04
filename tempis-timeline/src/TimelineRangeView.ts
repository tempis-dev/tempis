import { format } from 'date-format-parse';

import { TempisTimelineRangeOptions, TempisTimelineRangeUnitLabelFormats } from "./TempisTimelineOptions";
import { clamp } from "./Utilities";

export type Unit = 'millisecond' | 'second' | 'minute' | 'hour' | 'day' | 'month' | 'year' | 'none';

export type UnitAndStep = { unit: Unit, step: number };

export type RangeTick = { xPosition: number, date: Date };

const DEFAULT_MINOR_UNIT_LABEL_FORMATS: TempisTimelineRangeUnitLabelFormats = {
    millisecond: 'SSS',
    second: 'HH:mm:ss',
    minute: 'HH:mm',
    hour: 'HH:mm',
    day: 'D',
    month: 'MMM',
    year: 'YYYY'
}

const DEFAULT_MAJOR_UNIT_LABEL_FORMATS: TempisTimelineRangeUnitLabelFormats = {
    second: 'D MMMM HH:mm:ss',
    minute: 'D MMMM HH:mm',
    hour: 'ddd D MMMM HH:mm',
    day: 'ddd D MMMM',
    month: 'MMMM YYYY',
    year: 'YYYY'
}

export class TimelineRangeView {
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

    /** The current major tick unit and step. */
    private _majorTickUnitAndStep: UnitAndStep = { unit: 'year', step: 10 };

    /** The calculated minor unit tick dates for the current range and canvas width. */
    private _minorUnitTicks: RangeTick[] = [];

    /** The calculated major unit tick dates for the current range and canvas width. */
    private _majorUnitTicks: RangeTick[] = [];

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
     * Gets the fromDt of the range. DO NOT MODIFY!
     */
    public get fromDt(): Date {
        return this._fromDt;
    }

    /**
     * Gets the toDt of the range. DO NOT MODIFY!
     */
    public get toDt(): Date {
        return this._toDt;
    }

    /**
     * Gets the calculated minor unit ticks for the current range and canvas width.
     */
    public get minorTicks(): RangeTick[] {
        return this._minorUnitTicks;
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
        this.calculateMinorAndMajorUnitTicks();
    }

    /**
     * Moves the from and to date value of the range uniformly.
     * @param movementX The x movement value.
     */
    public moveByXMovement(movementX: number): void {
        // Get the number of milliseconds shown in the current range.
        const rangeXMillisValue = (this._toDt.getTime() - this._fromDt.getTime()) / this._canvas.width;

        // Update the from and to date to account for the movement.
        this._fromDt.setTime(this._fromDt.getTime() + (rangeXMillisValue * movementX));
        this._toDt.setTime(this._toDt.getTime() + (rangeXMillisValue * movementX));

        // Our range has changed so we will need to recalculate our minor unit ticks.
        this.calculateMinorAndMajorUnitTicks();
    }

    /**
     * Moves the from and to date value of the range uniformly.
     * @param unit The unit of the step.
     * @param step The step value.
     */
    public moveByStep(unit: Unit, step: number): void {
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
        } else if (unit === "day") {
            this._fromDt.setDate(this._fromDt.getDate() + step);
            this._toDt.setDate(this._toDt.getDate() + step);
        } else if (unit === "month") {
            this._fromDt.setMonth(this._fromDt.getMonth() + step);
            this._toDt.setMonth(this._toDt.getMonth() + step);
        } else if (unit === "year") {
            this._fromDt.setFullYear(this._fromDt.getFullYear() + step);
            this._toDt.setFullYear(this._toDt.getFullYear() + step);
        }

        // Our range has changed so we will need to recalculate our minor unit ticks.
        this.calculateMinorAndMajorUnitTicks();
    }

    /**
     * Zooms the from and to date value of the range.
     * @param unit amount
     */
    public zoomRange(amount: number): void {
        // Get the millis difference between the two dates.
        const zoomValue = (this._toDt.getTime() - this._fromDt.getTime()) * (clamp(amount, -1, 1) * 0.1);

        this._fromDt.setMilliseconds(this._fromDt.getMilliseconds() - zoomValue);
        this._toDt.setMilliseconds(this._toDt.getMilliseconds() + zoomValue);

        // Our range has changed so we will need to recalculate our minor unit ticks.
        this.calculateMinorAndMajorUnitTicks();
    }

    public clearRange(): void {
        // Clearing the range is just a matter of putting the default from/to back.
        this.setRange(new Date(0), new Date(4102444800000));
    }

    public calculateRequiredHeight(): number {
        // TODO Work this out properly by determining how much height the minor/major unit labels take up.
        return 50;
    }
    
    public calculateMinorAndMajorUnitTicks(): void {
        // Find a sensible number of minor and major ticks to render, this will depend on the canvas width.
        const minorTargetTickCount = Math.floor(this._canvas.width / 120);
        const majorTargetTickCount = Math.floor(this._canvas.width / 320);

        // Calculate the width of one millisecond as it would be rendered on the canvas.
        const milliRenderWidth = this._canvas.width / (this._toDt.getTime() - this._fromDt.getTime());

        // Calculate a sensible minor unit and step for the range.
        this._minorTickUnitAndStep = this._findSensibleUnitAndStep(minorTargetTickCount);

        // We need to determine the major tick unit now, this will be based on the minor unit.
        this._majorTickUnitAndStep = this._findSensibleUnitAndStep(majorTargetTickCount, this._minorTickUnitAndStep.unit);

        // Get our minor unit tick dates.
        const minorTickDates = this._getTickDates(this._minorTickUnitAndStep);

        // Get our major unit tick dates.
        const majorTickDates = this._getTickDates(this._majorTickUnitAndStep);

        // Convert our minor unit tick dates into tick objects representing the date and the x position of that date on the canvas.
        this._minorUnitTicks = minorTickDates.map((tickDate) => {
            return {
                date: tickDate,
                xPosition: milliRenderWidth * (tickDate.getTime() - this._fromDt.getTime())
            }
        });

        // Convert our major unit tick dates into tick objects representing the date and the x position of that date on the canvas.
        this._majorUnitTicks = majorTickDates.map((tickDate) => {
            return {
                date: tickDate,
                xPosition: milliRenderWidth * (tickDate.getTime() - this._fromDt.getTime())
            }
        });
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

        const tickY = sizeHeight - rangeContainerHeight;

        // Draw our minor unit ticks.
        for (const { date, xPosition } of this._minorUnitTicks) {
            // Draw the actual tick.
            context.lineWidth = 3;
            context.lineCap = "round";
            context.beginPath();
            context.moveTo(xPosition, tickY + 5);
            context.lineTo(xPosition, tickY + (rangeContainerHeight / 2) - 2);
            context.stroke();

            // Draw the minor date/time label text.
            context.font = "16px Arial";
            context.fillStyle = "#595959";
            context.beginPath();
            context.fillText(this._formatDate(date, this._minorTickUnitAndStep.unit, DEFAULT_MINOR_UNIT_LABEL_FORMATS), xPosition + 4, tickY + 20);
            context.stroke();
        }

        // Draw our major unit ticks, but only if our minor unit isn't 'year'.
        if (this._minorTickUnitAndStep.unit !== "year") {
            for (let tickIndex = 0; tickIndex < this._majorUnitTicks.length; tickIndex++) {
                const { date, xPosition } = this._majorUnitTicks[tickIndex];

                // Is this tick the for the first major tick? If so it will need to be sticky.
                const isStickyLabel = date.getTime() <= this._fromDt.getTime();

                // Draw the actual tick but only if this label isn't the sticky one.
                if (!isStickyLabel) {
                    context.lineWidth = 3;
                    context.lineCap = "round";
                    context.beginPath();
                    context.moveTo(xPosition, tickY + (rangeContainerHeight / 2) + 5);
                    context.lineTo(xPosition, tickY + rangeContainerHeight - 4);
                    context.stroke();
                }

                // Get the tick label.
                const tickLabel = this._formatDate(date, this._majorTickUnitAndStep.unit, DEFAULT_MAJOR_UNIT_LABEL_FORMATS);

                let labelXPosition = xPosition + 5;
                
                // If our label is sticky then it should always be drawn inside the visible as the earliest major tick.
                // Our sticky label should also be pushed out of the way by the next major tick label as we don't want overlaps.
                if (isStickyLabel) {
                    // Calculate the width of the label, plus the smidge at the start.
                    const labelWidth = context.measureText(tickLabel).width + 5;

                    // Grab the position of the next tick label, we need this to work out how much to offset our sticky label by (if at all)
                    const nextTickXPosition = this._majorUnitTicks[tickIndex + 1].xPosition;

                    labelXPosition = nextTickXPosition > labelWidth ? 3 : nextTickXPosition - labelWidth;
                }
    
                // Draw the major date/time label text.
                context.lineWidth = 0.5;
                context.font = "16px Arial";
                context.fillStyle = "#595959";
                context.beginPath();
                context.fillText(tickLabel, labelXPosition, tickY + 44);
                context.stroke();
            }
        }

        // Draw the minor/major unit split.
        context.lineWidth = 0.5;
        context.fillStyle = "#595959";
        context.beginPath();
        context.moveTo(0, tickY);
        context.lineTo(this._canvas.width, tickY);
        context.stroke();
    }

    /**
     * https://jsfiddle.net/h2drotkz/6/
     * @param targetTickCount 
     * @returns 
     */
    private _findSensibleUnitAndStep(targetTickCount: number, minorUnit?: Unit): UnitAndStep {
        // Get the millis difference between the two dates.
        const millisDiff = this._toDt.getTime() - this._fromDt.getTime();

        // An array of potential units and their factors.
        const units: { unit: Unit, factor: number }[] = [];

        // If we already have a minor unit then we must exclude it as an option for the major unit.
        if (minorUnit === "millisecond") {
            units.push({ unit: 'second', factor: 1000 });
            units.push({ unit: 'minute', factor: 60 * 1000 });
            units.push({ unit: 'hour', factor: 60 * 60 * 1000 });
            units.push({ unit: 'day', factor: 24 * 60 * 60 * 1000 });
            units.push({ unit: 'month', factor: 30 * 24 * 60 * 60 * 1000 });
            units.push({ unit: 'year', factor: 365 * 24 * 60 * 60 * 1000 });
        } else if (minorUnit === "second") {
            units.push({ unit: 'minute', factor: 60 * 1000 });
            units.push({ unit: 'hour', factor: 60 * 60 * 1000 });
            units.push({ unit: 'day', factor: 24 * 60 * 60 * 1000 });
            units.push({ unit: 'month', factor: 30 * 24 * 60 * 60 * 1000 });
            units.push({ unit: 'year', factor: 365 * 24 * 60 * 60 * 1000 });
        } else if (minorUnit === "minute") {
            units.push({ unit: 'hour', factor: 60 * 60 * 1000 });
            units.push({ unit: 'day', factor: 24 * 60 * 60 * 1000 });
            units.push({ unit: 'month', factor: 30 * 24 * 60 * 60 * 1000 });
            units.push({ unit: 'year', factor: 365 * 24 * 60 * 60 * 1000 });
        } else if (minorUnit === "hour") {
            units.push({ unit: 'day', factor: 24 * 60 * 60 * 1000 });
            units.push({ unit: 'month', factor: 30 * 24 * 60 * 60 * 1000 });
            units.push({ unit: 'year', factor: 365 * 24 * 60 * 60 * 1000 });
        } else if (minorUnit === "day") {
            units.push({ unit: 'month', factor: 30 * 24 * 60 * 60 * 1000 });
            units.push({ unit: 'year', factor: 365 * 24 * 60 * 60 * 1000 });
        } else if (minorUnit === "month") {
            units.push({ unit: 'year', factor: 365 * 24 * 60 * 60 * 1000 });
        } else if (minorUnit === "year") {
            units.push({ unit: 'year', factor: 365 * 24 * 60 * 60 * 1000 });
        } else {
            // We have no minor unit, so we much be trying to find our minor unit.
            units.push({ unit: 'millisecond', factor: 1 });
            units.push({ unit: 'second', factor: 1000 });
            units.push({ unit: 'minute', factor: 60 * 1000 });
            units.push({ unit: 'hour', factor: 60 * 60 * 1000 });
            units.push({ unit: 'day', factor: 24 * 60 * 60 * 1000 });
            units.push({ unit: 'month', factor: 30 * 24 * 60 * 60 * 1000 });
            units.push({ unit: 'year', factor: 365 * 24 * 60 * 60 * 1000 });
        }

        const unitTickCounts: { unit: Unit, ticks: number, step: number }[] = [];

        units.forEach(({ unit, factor }) => {
            const viableStepValues: number[] = [];

            // The step values we use should really depend on the unit type. (50 or 100 minutes is silly, but 20 makes sense...maybe)
            if (unit === "millisecond") {
                viableStepValues.push(1, 10, 50, 100, 500);
            } else if (unit === "second") {
                viableStepValues.push(1, 10, 15, 30);
            } else if (unit === "minute") {
                viableStepValues.push(1, 10, 15, 30);
            } else if (unit === "hour") {
                viableStepValues.push(1, 2, 6, 12);
            } else if (unit === "day") {
                viableStepValues.push(1, 2, 5, 10);
            } else if (unit === "month") {
                viableStepValues.push(1, 3, 6);
            } else if (unit === "year") {
                viableStepValues.push(1, 2, 5, 10, 20, 50, 100, 500);
            }

            viableStepValues.forEach((step) => {
                unitTickCounts.push({ unit, ticks: (millisDiff / factor) / step, step })
            });
        });

        unitTickCounts.sort((a, b) => {
            return Math.abs(a.ticks - targetTickCount) - Math.abs(b.ticks - targetTickCount);
        });

        return { unit: unitTickCounts[0].unit, step: unitTickCounts[0].step };
    }

    /**
     * https://jsfiddle.net/mxh08wLd/1/
     * @param unitAndStep 
     * @returns 
     */
    private _getTickDates(unitAndStep: { unit: Unit, step: number }): Date[] {
        let currentDate;

        // We need to strip unit values below the tick unit
        if (unitAndStep.unit === "year") {
            currentDate = new Date(this._fromDt.getFullYear(), 0);
        }
        else if (unitAndStep.unit === "month") {
            currentDate = new Date(this._fromDt.getFullYear(), this._fromDt.getMonth());
        }
        else if (unitAndStep.unit === "day") {
            currentDate = new Date(this._fromDt.getFullYear(), this._fromDt.getMonth(), this._fromDt.getDate());
        }
        else if (unitAndStep.unit === "hour") {
            currentDate = new Date(this._fromDt.getFullYear(), this._fromDt.getMonth(), this._fromDt.getDate(), this._fromDt.getHours());
        }
        else if (unitAndStep.unit === "minute") {
            currentDate = new Date(this._fromDt.getFullYear(), this._fromDt.getMonth(), this._fromDt.getDate(), this._fromDt.getHours(), this._fromDt.getMinutes());
        }
        else if (unitAndStep.unit === "second") {
            currentDate = new Date(this._fromDt.getFullYear(), this._fromDt.getMonth(), this._fromDt.getDate(), this._fromDt.getHours(), this._fromDt.getMinutes(), this._fromDt.getSeconds());
        }
        else if (unitAndStep.unit === "millisecond") {
            currentDate = new Date(this._fromDt.getFullYear(), this._fromDt.getMonth(), this._fromDt.getDate(), this._fromDt.getHours(), this._fromDt.getMinutes(), this._fromDt.getSeconds(), this._fromDt.getMilliseconds());
        } else {
            throw new Error(`unknown unit: ${unitAndStep.unit}`);
        }

        const minorTickDates: Date[] = [currentDate];

        // This should give an array of tick dates with the first and last being outside the from/to range (wont be rendered)
        while (currentDate.getTime() < this._toDt.getTime()) {
            currentDate = new Date(currentDate.getTime());

            switch (unitAndStep.unit) {
                case "year":
                    currentDate.setFullYear(currentDate.getFullYear() + unitAndStep.step);
                    break;
                
                case "month":
                    currentDate.setMonth(currentDate.getMonth() + unitAndStep.step);
                    break;

                case "day":
                    currentDate.setDate(currentDate.getDate() + unitAndStep.step);
                    break;

                case "hour":
                    currentDate.setHours(currentDate.getHours() + unitAndStep.step);
                    break;

                case "minute":
                    currentDate.setMinutes(currentDate.getMinutes() + unitAndStep.step);
                    break;

                case "second":
                    currentDate.setSeconds(currentDate.getSeconds() + unitAndStep.step);
                    break;

                case "millisecond":
                    currentDate.setMilliseconds(currentDate.getMilliseconds() + unitAndStep.step);
                    break;

                default:
                    throw new Error(`unknown unit: ${unitAndStep.unit}`);
            }

            minorTickDates.push(currentDate);
        }

        return minorTickDates;
    }

    /**
     * Formats the given date as a string, using the label format for the specified unit.
     * @param date 
     * @param unit 
     * @param labelFormats 
     * @returns 
     */
    private _formatDate(date: Date, unit: Unit, labelFormats: TempisTimelineRangeUnitLabelFormats): string {
        // TODO We should be checking the range options for a non-default label format for this unit.
        // TODO We should be using a date adapter to get this label.
        return format(date, (labelFormats as any)[unit]);
    }
}