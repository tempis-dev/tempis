import {
    TempisTimelineRangeOptions,
    TempisTimelineRangePosition,
    TempisTimelineRangeUnitLabelFormats
} from "./TempisTimelineOptions";
import { TimelineDataSet } from "./TimelineDataSet";
import { clamp, isNullOrUndefined, parseDate, EasingFunction } from "./Utilities";
import { AdapterRegistry } from "./AdapterRegistry";

export type Unit = "millisecond" | "second" | "minute" | "hour" | "day" | "month" | "year" | "none";

export type UnitAndStep = { unit: Unit; step: number };

export type UnitAndFactor = { unit: Unit; factor: number };

export type RangeTick = { xPosition: number; date: Date };

const DEFAULT_MINOR_UNIT_LABEL_FORMATS: TempisTimelineRangeUnitLabelFormats = {
    millisecond: "SSS",
    second: "HH:mm:ss",
    minute: "HH:mm",
    hour: "HH:mm",
    day: "D",
    month: "MMM",
    year: "YYYY"
};

const DEFAULT_MAJOR_UNIT_LABEL_FORMATS: TempisTimelineRangeUnitLabelFormats = {
    second: "D MMMM HH:mm:ss",
    minute: "D MMMM HH:mm",
    hour: "ddd D MMMM HH:mm",
    day: "ddd D MMMM",
    month: "MMMM YYYY",
    year: "YYYY"
};

/** The default amount of padding to use for unit labels. */
const DEFAULT_UNIT_LABEL_PADDING: number = 4;

export class TimelineRangeView {
    /** The timeline canvas. */
    private readonly _canvas: HTMLCanvasElement;

    /** The underlying dataset model. */
    private readonly _dataSet: TimelineDataSet;

    /** The flag defining whether the timeline is being rendered right-to-left. */
    private readonly _isRTL: boolean;

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

    /** The minimum date that can be displayed on the timeline, which is set to the earliest possible date. */
    private _minDate: Date = new Date(-8640000000000000);

    /** The maximum date that can be displayed on the timeline, which is set to the latest possible date. */
    private _maxDate: Date = new Date(8640000000000000);

    /** The current minor tick unit and step. */
    private _minorTickUnitAndStep: UnitAndStep = { unit: "year", step: 2 };

    /** The current major tick unit and step. */
    private _majorTickUnitAndStep: UnitAndStep = { unit: "year", step: 10 };

    /** The calculated minor unit tick dates for the current range and canvas width. */
    private _minorUnitTicks: RangeTick[] = [];

    /** The calculated major unit tick dates for the current range and canvas width. */
    private _majorUnitTicks: RangeTick[] = [];

    /** Animation frame ID for range animations. */
    private _animationFrameId: number | null = null;

    /**
     * Creates a new instance of the TimelineRangeView class.
     * @param canvas The canvas.
     * @param dataSet The timeline dataset model.
     * @param isRTL Whether the timeline is being rendered right-to-left.
     * @param options The timeline range options.
     */
    public constructor(
        canvas: HTMLCanvasElement,
        dataSet: TimelineDataSet,
        isRTL: boolean,
        options: TempisTimelineRangeOptions = {}
    ) {
        this._canvas = canvas;
        this._dataSet = dataSet;
        this._isRTL = isRTL;
        this._options = options;

        // Parse the range options.
        this._parseOptions();
    }

    /**
     * Gets the position option value.
     */
    public get position(): TempisTimelineRangePosition {
        return this._options.position ?? "bottom";
    }

    /**
     * Gets the fromDt of the range.
     * This is a copy of the internal from date to avoid external modification.
     */
    public get fromDt(): Date {
        return new Date(this._fromDt.getTime());
    }

    /**
     * Gets the toDt of the range.
     * This is a copy of the internal to date to avoid external modification.
     */
    public get toDt(): Date {
        return new Date(this._toDt.getTime());
    }

    /**
     * Gets the calculated minor unit ticks for the current range and canvas width.
     */
    public get minorTicks(): RangeTick[] {
        return this._minorUnitTicks;
    }

    /**
     * Sets the from and to date value of the range.
     * @param from The range from date.
     * @param to The range to date.
     */
    public setRange(from: Date, to: Date): void {
        this._setFromTime(from.getTime());
        this._setToTime(to.getTime());

        // If our from and to date are the same then we cannot represent this single point in time on the timeline.
        // To get around this we should pad the time out by some arbitrary amount either side of the date.
        // TODO For now we can just add a minute either side, but we should probably make this configurable.
        if (this._fromDt.getTime() === this._toDt.getTime()) {
            this._setFromTime(this._fromDt.getTime() - 60 * 1000);
            this._setToTime(this._toDt.getTime() + 60 * 1000);
        }

        // Our range has changed so we will need to recalculate our minor unit ticks.
        this.calculateMinorAndMajorUnitTicks();
    }

    /**
     * Centers the timeline range on the specified date without changing the length of the range.
     * @param date The date to center the range on.
     */
    public centerOnDate(date: Date): void {
        // Get the current range length in milliseconds.
        const currentRangeLength = this._toDt.getTime() - this._fromDt.getTime();

        // TODO This needs to handle cases where the date exceeds the min/max.

        // Calculate the new from and to dates based on the specified date.
        this._fromDt.setTime(date.getTime() - currentRangeLength / 2);
        this._toDt.setTime(date.getTime() + currentRangeLength / 2);

        // Our range has changed so we will need to recalculate our minor unit ticks.
        this.calculateMinorAndMajorUnitTicks();
    }

    /**
     * Moves the from and to date value of the range uniformly.
     * @param movementX The x movement value.
     */
    public moveRange(movementX: number): void {
        // We should not move the range if the range is fixed.
        if (this._options.fixed) {
            return;
        }

        // Get the current range length in milliseconds.
        const currentRangeLength = this._toDt.getTime() - this._fromDt.getTime();

        // Get the range milli value of one unit of canvas client width.
        const rangeXMillisValue = currentRangeLength / this._canvas.clientWidth;

        // Calculate the new from and to times based on the current range and the movement value.
        const targetFrom = this._fromDt.getTime() + rangeXMillisValue * movementX;
        const targetTo = this._toDt.getTime() + rangeXMillisValue * movementX;

        // Get the millis range between the min and max range values.
        const minMaxRange = this._maxDate.getTime() - this._minDate.getTime();

        // We need to maintain the current milli range if we hit the min and/or max range values.
        if (targetFrom < this._minDate.getTime() && currentRangeLength < minMaxRange) {
            // Our range has moved too far below the min range value, we should clamp the full range value to the minimum.
            // The _setFromTime function will do the min clamping for us, no need to pass it.
            this._setFromTime(targetFrom);
            this._setToTime(this._fromDt.getTime() + currentRangeLength);
        } else if (targetTo > this._maxDate.getTime() && currentRangeLength < minMaxRange) {
            // Our range has moved too far above the max range value, we should clamp the full range value to the maximum.
            // The _setToTime function will do the max clamping for us, no need to pass it.
            this._setToTime(targetTo);
            this._setFromTime(this._toDt.getTime() - currentRangeLength);
        } else {
            // We can just move the range manually without having to worry about min-max range values, any min/max clamping will be handled for us.
            this._setFromTime(targetFrom);
            this._setToTime(targetTo);
        }

        // Our range has changed so we will need to recalculate our minor unit ticks.
        this.calculateMinorAndMajorUnitTicks();
    }

    /**
     * Zooms the from and to date value of the range.
     * @param amount The raw zoom amount from user input (e.g., mouse wheel deltaY or pinch distance change). Will be clamped to -1 to 1 range for normalization across devices.
     * @param targetPositionX The x position on the canvas where the zoom will be centered (in pixels).
     * @param sensitivity The zoom sensitivity multiplier. Higher values result in faster zoom. Defaults to 1.0.
     */
    public zoomRange(amount: number, targetPositionX: number, sensitivity: number = 1.0): void {
        // We should not zoom if the range is fixed or zooming is explicitly disabled.
        if (
            this._options.fixed ||
            (!isNullOrUndefined(this._options.zoom?.enabled) && this._options.zoom?.enabled === false)
        ) {
            return;
        }

        // Work out the target position in milliseconds. This is the position on the canvas that we want to zoom around.
        // If we are rendering right-to-left then we should flip the x position so that it would map to the correct millisecond value.
        const targetPositionMillis = this._isRTL
            ? this._fromDt.getTime() +
              ((this._canvas.clientWidth - targetPositionX) / this._canvas.clientWidth) *
                  (this._toDt.getTime() - this._fromDt.getTime())
            : this._fromDt.getTime() +
              (targetPositionX / this._canvas.clientWidth) * (this._toDt.getTime() - this._fromDt.getTime());

        // Calculate the zoom factor based on the amount and sensitivity.
        // Clamp amount to -1 to 1, then apply base zoom rate (0.1) and sensitivity multiplier.
        const zoomFactor = 1 - clamp(amount, -1, 1) * -0.1 * sensitivity;

        // Calculate the new from and to times based on the current range and zoom factor.
        let targetFrom = targetPositionMillis - (targetPositionMillis - this._fromDt.getTime()) * zoomFactor;
        let targetTo = targetPositionMillis + (this._toDt.getTime() - targetPositionMillis) * zoomFactor;

        // Get the new millis range based on the new from and to times.
        let targetRange = targetTo - targetFrom;

        // Clamp the new zoom range to the zoom min and max if they are defined.
        const clampedRange = clamp(targetRange, this._options.zoom?.min, this._options.zoom?.max);

        // If the clamped range is different to the calculated one (the range is outside the zoom min/max bounds) then we need to calculate the new clamped from/to dates.
        if (targetRange != clampedRange) {
            targetFrom = targetPositionMillis - (targetPositionMillis - targetFrom) * (clampedRange / targetRange);
            targetTo = targetPositionMillis + (targetTo - targetPositionMillis) * (clampedRange / targetRange);
            targetRange = clampedRange;
        }

        // Get the millis range between the min and max range values.
        const minMaxRange = this._maxDate.getTime() - this._minDate.getTime();

        // We need to maintain the current milli range if we hit the min and/or max range values.
        if (targetFrom < this._minDate.getTime() && targetRange < minMaxRange) {
            // Our range has moved too far below the min range value, we should clamp the full range value to the minimum.
            // The _setFromTime function will do the min clamping for us, no need to pass it.
            this._setFromTime(targetFrom);
            this._setToTime(this._fromDt.getTime() + targetRange);
        } else if (targetTo > this._maxDate.getTime() && targetRange < minMaxRange) {
            // Our range has moved too far above the max range value, we should clamp the full range value to the maximum.
            // The _setToTime function will do the max clamping for us, no need to pass it.
            this._setToTime(targetTo);
            this._setFromTime(this._toDt.getTime() - targetRange);
        } else {
            // We can just update the range manually without having to worry about min-max range values, any min/max clamping will be handled for us.
            this._setFromTime(targetFrom);
            this._setToTime(targetTo);
        }

        this.calculateMinorAndMajorUnitTicks();
    }

    /**
     * Clear the current range and reset it to the default values.
     */
    public clearRange(): void {
        // Clearing the range is just a matter of putting the default from/to back.
        this.setRange(new Date(0), new Date(4102444800000));
    }

    /**
     * Calculate the height of this view when rendered.
     * @returns The height of this view when rendered.
     */
    public calculateRequiredHeight(): number {
        // Grab the canvas context.
        const context = this._canvas.getContext("2d")!;

        // Apply the font that will be used to the render the labels.
        // TODO This should be set from some default or the configured font. Can use context save/reset to apply it.

        // Get the text metrics for an example date value.
        const unitLabelTextMetrics = context.measureText("Fri 13 April 1990");

        // The height of this view will be the height of our minor and major unit labels as well as our unit labels vertical padding.
        return (
            DEFAULT_UNIT_LABEL_PADDING * 4 +
            (unitLabelTextMetrics.actualBoundingBoxAscent + unitLabelTextMetrics.actualBoundingBoxDescent) * 2
        );
    }

    /**
     * Calculate the major and minor unit ticks dates and x positions for the current date range and canvas width.
     */
    public calculateMinorAndMajorUnitTicks(): void {
        // Find a sensible number of minor and major ticks to render, this will depend on the canvas width.
        const minorTargetTickCount = Math.floor(this._canvas.clientWidth / 120);
        const majorTargetTickCount = Math.floor(this._canvas.clientWidth / 320);

        // Find a sensible minor and major unit and step based on the target tick counts.
        const { minor: minorUnitAndStep, major: majorUnitAndStep } = this._findSensibleUnitsAndSteps(
            minorTargetTickCount,
            majorTargetTickCount
        );

        this._minorTickUnitAndStep = minorUnitAndStep;
        this._majorTickUnitAndStep = majorUnitAndStep;

        // Get our minor unit tick dates.
        const minorTickDates = this._getTickDates(this._minorTickUnitAndStep);

        // Get our major unit tick dates.
        const majorTickDates = this._getTickDates(this._majorTickUnitAndStep);

        // Calculate the width of one millisecond as it would be rendered on the canvas.
        const milliRenderWidth = this._canvas.clientWidth / (this._toDt.getTime() - this._fromDt.getTime());

        // Convert our minor unit tick dates into tick objects representing the date and the x position of that date on the canvas.
        this._minorUnitTicks = minorTickDates.map((tickDate) => {
            return {
                date: tickDate,
                // If we are rendering right-to-left then the ticks should start from the right of the timeline.
                xPosition: this._isRTL
                    ? this._canvas.clientWidth - milliRenderWidth * (tickDate.getTime() - this._fromDt.getTime())
                    : milliRenderWidth * (tickDate.getTime() - this._fromDt.getTime())
            };
        });

        // Convert our major unit tick dates into tick objects representing the date and the x position of that date on the canvas.
        this._majorUnitTicks = majorTickDates.map((tickDate) => {
            return {
                date: tickDate,
                // If we are rendering right-to-left then the ticks should start from the right of the timeline.
                xPosition: this._isRTL
                    ? this._canvas.clientWidth - milliRenderWidth * (tickDate.getTime() - this._fromDt.getTime())
                    : milliRenderWidth * (tickDate.getTime() - this._fromDt.getTime())
            };
        });
    }

    /**
     * Draw the timeline range onto the canvas.
     * @param context The canvas 2D context.
     * @param yPosition The y position to draw the range at.
     * @param position The position of the range, either "top" or "bottom".
     */
    public draw(context: CanvasRenderingContext2D, yPosition: number, position: "top" | "bottom"): void {
        // Figure out our range container dimensions.
        const rangeContainerHeight = this.calculateRequiredHeight();

        // Clear the range view area.
        context.clearRect(0, yPosition, context.canvas.clientWidth, rangeContainerHeight);

        // The vertical position of our minor and major ticks will depend on the position of the range bar.
        const minorTicksYPosition = position === "top" ? yPosition + rangeContainerHeight / 2 : yPosition;
        const majorTicksYPosition = position === "top" ? yPosition : yPosition + rangeContainerHeight / 2;

        // Draw our minor unit ticks.
        for (const { date, xPosition } of this._minorUnitTicks) {
            // We should only render a tick bar if its not right at the edge of the canvas as it looks a little weird.
            if (xPosition > 0 && xPosition < context.canvas.clientWidth) {
                // Draw the actual tick.
                context.lineWidth = 1;
                context.strokeStyle = "#c2c2c2";
                context.setLineDash([3, 3]); /* dashes are 5px and spaces are 3px */
                context.beginPath();
                context.moveTo(xPosition, minorTicksYPosition);
                context.lineTo(xPosition, minorTicksYPosition + rangeContainerHeight / 2);
                context.stroke();
            }

            // Create the formatted date label for this minor tick.
            const minorTickLabel = this._formatDate(
                date,
                this._minorTickUnitAndStep.unit,
                DEFAULT_MINOR_UNIT_LABEL_FORMATS
            );

            // Draw the minor date/time label text.
            context.textBaseline = "alphabetic";
            context.fillStyle = "#595959";
            context.beginPath();
            // If we are rendering right-to-left then the label should be rendered to the left of the tick, otherwise the right.
            if (this._isRTL) {
                context.fillText(
                    minorTickLabel,
                    xPosition - DEFAULT_UNIT_LABEL_PADDING - context.measureText(minorTickLabel).width,
                    minorTicksYPosition + rangeContainerHeight / 2 - DEFAULT_UNIT_LABEL_PADDING
                );
            } else {
                context.fillText(
                    minorTickLabel,
                    xPosition + DEFAULT_UNIT_LABEL_PADDING,
                    minorTicksYPosition + rangeContainerHeight / 2 - DEFAULT_UNIT_LABEL_PADDING
                );
            }
            context.stroke();
        }

        // We won't be drawing our major units if our minor units are already years.
        if (this._minorTickUnitAndStep.unit === "year") {
            return;
        }

        // Draw our major unit ticks.
        for (let tickIndex = 0; tickIndex < this._majorUnitTicks.length; tickIndex++) {
            // Grab the date and the x position of the current major tick.
            const { date, xPosition } = this._majorUnitTicks[tickIndex];

            // Grab the next major tick, if there is one.
            const nextMajorTick = this._majorUnitTicks[tickIndex + 1];

            // Is this tick the for the first major tick? If so the label for it will need to be sticky.
            const isStickyLabel =
                date.getTime() <= this._fromDt.getTime() &&
                nextMajorTick &&
                nextMajorTick.date.getTime() > this._fromDt.getTime();

            // Draw the actual tick but only if this label isn't the sticky one or if it is right at the edge of the canvas.
            if (!isStickyLabel && xPosition > 0 && xPosition < context.canvas.clientWidth) {
                context.lineWidth = 2;
                context.lineCap = "round";
                context.setLineDash([]);
                context.beginPath();
                context.moveTo(xPosition, majorTicksYPosition + 3);
                context.lineTo(xPosition, majorTicksYPosition + rangeContainerHeight / 2 - 3);
                context.stroke();
            }

            // Create the formatted date label for this major tick.
            const majorTickLabel = this._formatDate(
                date,
                this._majorTickUnitAndStep.unit,
                DEFAULT_MAJOR_UNIT_LABEL_FORMATS
            );

            // Determine the default major label x position.
            // If we are right-to-left then the label should be rendered to the left of the tick, otherwise the right.
            let labelXPosition = this._isRTL
                ? xPosition - DEFAULT_UNIT_LABEL_PADDING - context.measureText(majorTickLabel).width
                : xPosition + DEFAULT_UNIT_LABEL_PADDING;

            // If our label is sticky then it should always be drawn inside the visible area as the earliest major tick.
            // Our sticky label should also be pushed out of the way by the next major tick label as we don't want overlaps.
            if (isStickyLabel) {
                // Calculate the width of the label, plus a smidge for a little gap between the label and the tick.
                const labelWidth = context.measureText(majorTickLabel).width + DEFAULT_UNIT_LABEL_PADDING;

                if (nextMajorTick) {
                    if (this._isRTL) {
                        labelXPosition =
                            nextMajorTick.xPosition <= context.canvas.clientWidth - labelWidth
                                ? context.canvas.clientWidth - labelWidth
                                : nextMajorTick.xPosition + DEFAULT_UNIT_LABEL_PADDING;
                    } else {
                        labelXPosition =
                            nextMajorTick.xPosition >= labelWidth
                                ? DEFAULT_UNIT_LABEL_PADDING
                                : nextMajorTick.xPosition - labelWidth;
                    }
                }
            }

            // Draw the major date/time label text.
            context.lineWidth = 0.5;
            context.textBaseline = "alphabetic";
            context.fillStyle = "#595959";
            context.beginPath();
            context.fillText(
                majorTickLabel,
                labelXPosition,
                majorTicksYPosition + rangeContainerHeight / 2 - DEFAULT_UNIT_LABEL_PADDING
            );
            context.stroke();
        }
    }

    /**
     * Finds a sensible minor and major unit and step based on the target tick count.
     * @param minorTargetTickCount The number of minor ticks to aim for
     * @returns An object containing the minor and major unit and step.
     */
    private _findSensibleUnitsAndSteps(
        minorTargetTickCount: number,
        majorTargetTickCount: number
    ): { minor: UnitAndStep; major: UnitAndStep } {
        // A function to get the best unit and step based on the target tick count based on the provided units and their factors.
        const getBestUnitAndStep = (units: UnitAndFactor[], targetTickCount: number): UnitAndStep => {
            // Get the millis difference between the two dates.
            const millisDiff = this._toDt.getTime() - this._fromDt.getTime();

            const unitTickCounts: { unit: Unit; ticks: number; step: number }[] = [];

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
                    unitTickCounts.push({
                        unit,
                        ticks: millisDiff / factor / step,
                        step
                    });
                });
            });

            // Sort the unit tick counts by how close they are to the target tick count.
            unitTickCounts.sort((a, b) => {
                return (
                    Math.abs(a.ticks - Math.max(1, targetTickCount)) - Math.abs(b.ticks - Math.max(1, targetTickCount))
                );
            });

            return { unit: unitTickCounts[0].unit, step: unitTickCounts[0].step };
        };

        // We will always start by working out the minor unit first and the major unit will be based on that.
        // We also want a minimum of 1 for the minor target tick count, so we will clamp it to 1.
        const minorUnitAndStep = getBestUnitAndStep(
            [
                { unit: "millisecond", factor: 1 },
                { unit: "second", factor: 1000 },
                { unit: "minute", factor: 60 * 1000 },
                { unit: "hour", factor: 60 * 60 * 1000 },
                { unit: "day", factor: 24 * 60 * 60 * 1000 },
                { unit: "month", factor: 30 * 24 * 60 * 60 * 1000 },
                { unit: "year", factor: 365 * 24 * 60 * 60 * 1000 }
            ],
            minorTargetTickCount
        );

        const majorUnitsAndFactors: UnitAndFactor[] = [];

        // The units available for the major unit will depend on the minor unit.
        if (minorUnitAndStep.unit === "millisecond") {
            majorUnitsAndFactors.push({ unit: "second", factor: 1000 });
            majorUnitsAndFactors.push({ unit: "minute", factor: 60 * 1000 });
            majorUnitsAndFactors.push({ unit: "hour", factor: 60 * 60 * 1000 });
            majorUnitsAndFactors.push({ unit: "day", factor: 24 * 60 * 60 * 1000 });
            majorUnitsAndFactors.push({
                unit: "month",
                factor: 30 * 24 * 60 * 60 * 1000
            });
            majorUnitsAndFactors.push({
                unit: "year",
                factor: 365 * 24 * 60 * 60 * 1000
            });
        } else if (minorUnitAndStep.unit === "second") {
            majorUnitsAndFactors.push({ unit: "minute", factor: 60 * 1000 });
            majorUnitsAndFactors.push({ unit: "hour", factor: 60 * 60 * 1000 });
            majorUnitsAndFactors.push({ unit: "day", factor: 24 * 60 * 60 * 1000 });
            majorUnitsAndFactors.push({
                unit: "month",
                factor: 30 * 24 * 60 * 60 * 1000
            });
            majorUnitsAndFactors.push({
                unit: "year",
                factor: 365 * 24 * 60 * 60 * 1000
            });
        } else if (minorUnitAndStep.unit === "minute") {
            majorUnitsAndFactors.push({ unit: "hour", factor: 60 * 60 * 1000 });
            majorUnitsAndFactors.push({ unit: "day", factor: 24 * 60 * 60 * 1000 });
            majorUnitsAndFactors.push({
                unit: "month",
                factor: 30 * 24 * 60 * 60 * 1000
            });
            majorUnitsAndFactors.push({
                unit: "year",
                factor: 365 * 24 * 60 * 60 * 1000
            });
        } else if (minorUnitAndStep.unit === "hour") {
            majorUnitsAndFactors.push({ unit: "day", factor: 24 * 60 * 60 * 1000 });
            majorUnitsAndFactors.push({
                unit: "month",
                factor: 30 * 24 * 60 * 60 * 1000
            });
            majorUnitsAndFactors.push({
                unit: "year",
                factor: 365 * 24 * 60 * 60 * 1000
            });
        } else if (minorUnitAndStep.unit === "day") {
            majorUnitsAndFactors.push({
                unit: "month",
                factor: 30 * 24 * 60 * 60 * 1000
            });
            majorUnitsAndFactors.push({
                unit: "year",
                factor: 365 * 24 * 60 * 60 * 1000
            });
        } else if (minorUnitAndStep.unit === "month") {
            majorUnitsAndFactors.push({
                unit: "year",
                factor: 365 * 24 * 60 * 60 * 1000
            });
        } else if (minorUnitAndStep.unit === "year") {
            majorUnitsAndFactors.push({
                unit: "year",
                factor: 365 * 24 * 60 * 60 * 1000
            });
        } else {
            throw new Error(`unknown minor unit: ${minorUnitAndStep.unit}`);
        }

        return {
            minor: minorUnitAndStep,
            major: getBestUnitAndStep(majorUnitsAndFactors, majorTargetTickCount)
        };
    }

    /**
     * Gets the tick dates for the specified unit and step.
     * @param unitAndStep The unit and step to get the tick dates for.
     * @returns An array of dates representing the tick dates.
     */
    private _getTickDates(unitAndStep: UnitAndStep): Date[] {
        const dateAdapter = AdapterRegistry.get();
        
        // Get the starting timestamp by snapping to the appropriate unit boundary
        let currentTimestamp: number;
        
        // We need to snap to the beginning of the next unit up so ticks always start from that boundary
        if (unitAndStep.unit === "year" || unitAndStep.unit === "month") {
            // Snap to start of year
            currentTimestamp = dateAdapter.startOf(this._fromDt.getTime(), "year");
        } else if (unitAndStep.unit === "day") {
            // Snap to start of month
            currentTimestamp = dateAdapter.startOf(this._fromDt.getTime(), "month");
        } else if (unitAndStep.unit === "hour") {
            // Snap to start of day
            currentTimestamp = dateAdapter.startOf(this._fromDt.getTime(), "day");
        } else if (unitAndStep.unit === "minute") {
            // Snap to start of hour
            currentTimestamp = dateAdapter.startOf(this._fromDt.getTime(), "hour");
        } else if (unitAndStep.unit === "second") {
            // Snap to start of minute
            currentTimestamp = dateAdapter.startOf(this._fromDt.getTime(), "minute");
        } else if (unitAndStep.unit === "millisecond") {
            // Snap to start of second
            currentTimestamp = dateAdapter.startOf(this._fromDt.getTime(), "second");
        } else {
            throw new Error(`unknown unit: ${unitAndStep.unit}`);
        }

        const minorTickDates: Date[] = [new Date(currentTimestamp)];
        const toTimestamp = this._toDt.getTime();

        // Generate tick dates by adding the step amount until we exceed the to date
        while (currentTimestamp < toTimestamp) {
            currentTimestamp = dateAdapter.add(currentTimestamp, unitAndStep.unit, unitAndStep.step);
            minorTickDates.push(new Date(currentTimestamp));
        }

        return minorTickDates;
    }

    /**
     * Formats the given date as a string, using the label format for the specified unit.
     * @param date The date to format.
     * @param unit The date unit.
     * @param labelFormats  The label formats to source the pattern from.
     * @returns The given date as a string, using the label format for the specified unit.
     */
    private _formatDate(date: Date, unit: Unit, labelFormats: TempisTimelineRangeUnitLabelFormats): string {
        const dateAdapter = AdapterRegistry.get();
        const pattern = labelFormats[unit as keyof TempisTimelineRangeUnitLabelFormats] ?? "D MMMM HH:mm:ss";
        return dateAdapter.format(date.getTime(), pattern);
    }

    /**
     * Parse the options for the timeline range.
     */
    private _parseOptions(): void {
        // TODO Validate that the options are valid, e.g. min is before max, etc.

        // Set the minimum and maximum range dates based on the options provided.
        this._minDate = isNullOrUndefined(this._options.min)
            ? new Date(-8640000000000000)
            : parseDate(this._options.min!);
        this._maxDate = isNullOrUndefined(this._options.max)
            ? new Date(8640000000000000)
            : parseDate(this._options.max!);

        // We should attempt to reapply the current range now that we have updated the range min/max.
        this.setRange(this.fromDt, this.toDt);

        // Update the timeline range to reflect the min and max date of the dataset if they are defined (as in we have at least one item).
        if (this._dataSet.minDate && this._dataSet.maxDate) {
            this.setRange(this._dataSet.minDate, this._dataSet.maxDate);
        }

        // Set the initial start date if one has been defined.
        if (!isNullOrUndefined(this._options.start)) {
            this._setFromTime(parseDate(this._options.start!).getTime());
        }

        // Set the initial end date if one has been defined.
        if (!isNullOrUndefined(this._options.end)) {
            this._setToTime(parseDate(this._options.end!).getTime());
        }
    }

    /**
     * Set the from time of the range, clamping it to the min and max range value if they are set.
     * @param time The from time in milliseconds since the epoch.
     */
    private _setFromTime(time: number): void {
        // Set the from time, clamping it to the min and max if they are set.
        this._fromDt.setTime(clamp(time, this._minDate.getTime(), this._maxDate.getTime()));
    }

    /**
     * Set the to time of the range, clamping it to the min and max range value if they are set.
     * @param time The to time in milliseconds since the epoch.
     */
    private _setToTime(time: number): void {
        // Set the to time, clamping it to the min and max if they are set.
        this._toDt.setTime(clamp(time, this._minDate.getTime(), this._maxDate.getTime()));
    }

    /**
     * Animates the range from current values to target values.
     * @param from The target from date.
     * @param to The target to date.
     * @param duration The animation duration in milliseconds.
     * @param easing The easing function to use.
     * @param onUpdate Optional callback called on each animation frame.
     * @param onComplete Optional callback called when animation completes.
     */
    public animateToRange(
        from: Date,
        to: Date,
        duration: number,
        easing: EasingFunction,
        onUpdate?: () => void,
        onComplete?: () => void
    ): void {
        // Cancel any existing animation
        this.cancelAnimation();

        const startTime = performance.now();
        const startFromTime = this._fromDt.getTime();
        const startToTime = this._toDt.getTime();
        const targetFromTime = from.getTime();
        const targetToTime = to.getTime();

        const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Apply easing function
            const easedProgress = this._applyEasing(progress, easing);
            
            // Interpolate between start and target values
            const currentFromTime = startFromTime + (targetFromTime - startFromTime) * easedProgress;
            const currentToTime = startToTime + (targetToTime - startToTime) * easedProgress;
            
            this._setFromTime(currentFromTime);
            this._setToTime(currentToTime);
            
            if (onUpdate) {
                onUpdate();
            }

            if (progress < 1) {
                this._animationFrameId = requestAnimationFrame(animate);
            } else {
                this._animationFrameId = null;
                if (onComplete) {
                    onComplete();
                }
            }
        };

        this._animationFrameId = requestAnimationFrame(animate);
    }

    /**
     * Cancels any ongoing range animation.
     */
    public cancelAnimation(): void {
        if (this._animationFrameId !== null) {
            cancelAnimationFrame(this._animationFrameId);
            this._animationFrameId = null;
        }
    }

    /**
     * Applies an easing function to a progress value.
     * @param progress The progress value (0-1).
     * @param easing The easing function name.
     * @returns The eased progress value.
     */
    private _applyEasing(progress: number, easing: EasingFunction): number {
        switch (easing) {
            case 'linear':
                return progress;
            case 'easeIn':
                return progress * progress;
            case 'easeOut':
                return 1 - (1 - progress) * (1 - progress);
            case 'easeInOut':
                return progress < 0.5 
                    ? 2 * progress * progress 
                    : 1 - Math.pow(-2 * progress + 2, 2) / 2;
            case 'easeInQuad':
                return progress * progress;
            case 'easeOutQuad':
                return 1 - (1 - progress) * (1 - progress);
            case 'easeInOutQuad':
                return progress < 0.5 
                    ? 2 * progress * progress 
                    : 1 - Math.pow(-2 * progress + 2, 2) / 2;
            case 'easeInCubic':
                return progress * progress * progress;
            case 'easeOutCubic':
                return 1 - Math.pow(1 - progress, 3);
            case 'easeInOutCubic':
                return progress < 0.5 
                    ? 4 * progress * progress * progress 
                    : 1 - Math.pow(-2 * progress + 2, 3) / 2;
            default:
                return progress;
        }
    }
}
