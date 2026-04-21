import { TimelineDataSet } from "./TimelineDataSet";
import { TimelineBand } from "./TimelineBand";
import { TimelineItem } from "./TimelineItem";
import { TempisTimelineStackMode, TempisTimelineScrollbarOptions } from "./TempisTimelineOptions";
import { RangeTick } from "./TimelineRangeView";
import { clamp, doDateRangesOverlap, drawClippedText, EasingFunction, GRID_COLOUR, GRID_COLOUR_TRANSPARENT } from "./Utilities";

export interface DataViewDrawPlan {
    /** The height that is required to draw all groups and items within the specified date range. */
    height: number;

    /** The width of the drawn view. */
    width: number;

    /** The group draw plans. */
    groupDrawPlans: DataViewGroupDrawPlan[];
}

export interface DataViewGroupDrawPlan {
    /** The group label. */
    label: string;

    /** The row stacks of all visible items in this group that need to be rendered. */
    rows: DataViewItemDrawPlan[][];

    yPositionStart: number;

    yPositionEnd: number;
}

export interface DataViewItemDrawPlan {
    /** The item. */
    item: TimelineItem;

    /** The item font. */
    font?: string;

    /** The height that is required to draw this item. */
    height: number;

    xPointInTimePosition: number | null;

    xPositionStart: number;

    xPositionEnd: number;

    yPositionStart: number;

    yPositionEnd: number;
}

/** The default amount of margin to use for group labels. */
const DEFAULT_GROUP_LABEL_MARGIN: number = 6;

/** The default amount of vertical margin to use for items. */
const DEFAULT_ITEM_VERTICAL_MARGIN: number = 4;

/** The default amount of vertical margin to use for each group. */
const DEFAULT_GROUP_MARGIN: number = 8;

/** The minimum amount of available horizontal space required to render a label. */
const MINIMUM_RENDERED_LABEL_WIDTH: number = 5;

/** The background colour to use for any unfocused items. */
const UNFOCUSED_ITEM_BACKGROUND_COLOUR = "#d6d6d6ff";

/** The text colour to use for any unfocused items. */
const UNFOCUSED_ITEM_FONT_COLOUR = "#ffffffff";

export class TimelineDataView {
    /** The underlying dataset model. */
    private readonly _dataSet: TimelineDataSet;

    /** The flag defining whether the timeline is being rendered right-to-left. */
    private readonly _isRTL: boolean;

    /** The stack mode controlling how items are vertically arranged. */
    private readonly _stackMode: TempisTimelineStackMode;

    /** The current scroll Y offset. */
    private _scrollYOffset: number = 0;

    /** Gets the y position from where this view was last drawn. */
    private _lastDrawYPosition: number = 0;

    /** Gets the height of his view when last drawn. */
    private _lastDrawHeight: number = 0;

    /** The current data view draw plan. */
    private _drawPlan: DataViewDrawPlan | null = null;

    /** Cached row structure for stable mode (maps items to row numbers). */
    private _cachedStableRowStructure: Map<string, Map<TimelineItem, number>> | null = null;

    /** The last zoom level (range in milliseconds) used for stable mode caching. */
    private _lastZoomRange: number = 0;

    /** The last canvas width used for stable mode caching. */
    private _lastCanvasWidth: number = 0;

    /** Animation frame ID for scroll animations. */
    private _animationFrameId: number | null = null;

    /** Whether the mouse is currently hovering over the data view. */
    private _isHovering: boolean = false;

    /** Whether the data view is currently being panned. */
    private _isPanning: boolean = false;

    /** The scrollbar options. */
    private _scrollbarOptions: TempisTimelineScrollbarOptions;

    /**
     * Creates a new instance of the TimelineDataView class.
     * @param dataSet The timeline dataset model.
     * @param isRTL Whether the timeline is being rendered right-to-left.
     * @param stackMode The stack mode controlling how items are vertically arranged.
     * @param scrollbarOptions The scrollbar options.
     */
    public constructor(
        dataSet: TimelineDataSet,
        isRTL: boolean,
        stackMode: TempisTimelineStackMode,
        scrollbarOptions?: TempisTimelineScrollbarOptions
    ) {
        this._dataSet = dataSet;
        this._isRTL = isRTL;
        this._stackMode = stackMode;
        this._scrollbarOptions = scrollbarOptions ?? {};

        // Register a callback to invalidate cached row structure when dataset changes.
        this._dataSet.registerUpdateCallback(() => {
            this._cachedStableRowStructure = null;
        });
    }

    /**
     * Scroll the y offset of the view by the specified amount.
     * @param movementY The y offset amount.
     */
    public scrollByYMovement(movementY: number): void {
        this._scrollYOffset += movementY;
    }

    /**
     * Set whether the mouse is hovering over the data view.
     * @param isHovering Whether the mouse is hovering.
     */
    public setHovering(isHovering: boolean): void {
        this._isHovering = isHovering;
    }

    /**
     * Set whether the data view is currently being panned.
     * @param isPanning Whether the view is being panned.
     */
    public setPanning(isPanning: boolean): void {
        this._isPanning = isPanning;
    }

    /**
     * Create a draw plan for the view without actually drawing.
     * This is useful for calculating the required height before rendering.
     * @param context The canvas 2D context.
     * @param fromDt The range from date.
     * @param toDt The range to date.
     * @returns A draw plan containing layout information including total height.
     */
    public createDrawPlan(context: CanvasRenderingContext2D, fromDt: Date, toDt: Date): DataViewDrawPlan {
        return this._createViewDrawPlan(context, fromDt, toDt);
    }

    /**
     * Draw the timeline data view onto the canvas.
     * @param context The canvas 2D context.
     * @param fromDt The range from date.
     * @param toDt The range to date.
     * @param minorTicks The minor ticks to render onto the data view.
     * @param bands The bands to render onto the data view.
     * @param yPosition The y position from where to start drawing the view.
     * @param maxHeight The max height that we can draw the data view before it must start scrolling.
     * @param fillVertically Whether the timeline data view should fill the vertical space available to it.
     * @param hideScrollbar Whether to suppress scrollbar rendering. Defaults to `false`.
     */
    public draw(
        context: CanvasRenderingContext2D,
        fromDt: Date,
        toDt: Date,
        minorTicks: RangeTick[],
        bands: TimelineBand[],
        yPosition: number,
        maxHeight: number,
        fillVertically: boolean,
        hideScrollbar?: boolean
    ): number {
        // We should create our plan for drawing the groups and items of the view. This will also give us exactly how much space would be required to do so.
        this._drawPlan = this._createViewDrawPlan(context, fromDt, toDt);

        // We should clamp our scroll offset to the allowed values now that we know the height required to render all groups.
        this._scrollYOffset = clamp(this._scrollYOffset, Math.min(0, maxHeight - this._drawPlan.height), 0);

        // Calculate the height of this rendered view, this may be less than the max height.
        // If fillVertically is true then we should always use the max height.
        this._lastDrawHeight = fillVertically ? maxHeight : Math.min(this._drawPlan.height, maxHeight);

        // Clear the data view area.
        context.clearRect(0, yPosition, context.canvas.width, this._lastDrawHeight);

        // Draw any configured timeline bands first.
        this._drawBands(context, bands, fromDt, toDt, yPosition, this._lastDrawHeight);

        // Draw minor unit tick bars.
        // TODO Only do this is configured.
        this._drawMinorUnitBars(context, minorTicks, yPosition, this._lastDrawHeight);

        // Draw our groups and items!
        this._drawGroups(context, yPosition);

        // Draw the scrollbar if there's vertical overflow and we arent explicitly hiding it.
        if (!hideScrollbar) {
            this._drawScrollbar(context, yPosition, this._lastDrawHeight);
        }

        // Set the y position from where this view was last drawn.
        // This will be used to help align absolute canvas pointer positions with data view elements.
        this._lastDrawYPosition = yPosition;

        // Return the height of the rendered view.
        return this._lastDrawHeight;
    }

    /**
     * Gets the item at the specified point in the view, or null if there is no item at that point.
     * @param point The point at which to get the item.
     * @returns The item at the specified point, or null if there is no item at that point.
     */
    public getItemAtPoint(point: { x: number; y: number }): TimelineItem | null {
        // There is nothing to do if we have no draw plan.
        if (!this._drawPlan) {
            return null;
        }

        // Do not get items for points that overflow the vertical constraints of the data view.
        if (point.y < this._lastDrawYPosition || point.y > this._lastDrawYPosition + this._lastDrawHeight) {
            return null;
        }

        // Iterate over each group and each item in the group to see if the point is within the bounds of the item.
        for (const groupDrawPlan of this._drawPlan.groupDrawPlans) {
            for (const itemDrawPlan of groupDrawPlan.rows.flat()) {
                if (
                    point.x >= itemDrawPlan.xPositionStart &&
                    point.x <= itemDrawPlan.xPositionEnd &&
                    point.y >= itemDrawPlan.yPositionStart + this._scrollYOffset + this._lastDrawYPosition &&
                    point.y <= itemDrawPlan.yPositionEnd + this._scrollYOffset + this._lastDrawYPosition
                ) {
                    return itemDrawPlan.item;
                }
            }
        }

        // We did not find an item at the specified point.
        return null;
    }

    /**
     * Draw a vertical band for every timeline band model.
     * @param context The canvas context.
     * @param bands The timeline band models.
     * @param rangeFromDt The range from date.
     * @param rangeToDt The range to date.
     * @param yPosition The y position of the top of the view.
     * @param height The available height of the view.
     */
    private _drawBands(
        context: CanvasRenderingContext2D,
        bands: TimelineBand[],
        rangeFromDt: Date,
        rangeToDt: Date,
        yPosition: number,
        height: number
    ): void {
        // Calculate the width of one millisecond as it would be rendered on the canvas.
        const milliRenderWidth = context.canvas.clientWidth / (rangeToDt.getTime() - rangeFromDt.getTime());

        for (const band of bands) {
            // Is this band a range or is it a PIT?
            if (band.end) {
                // Don't bother drawing this band if it doesn't overlap the current range.
                if (!doDateRangesOverlap(band.start, band.end, rangeFromDt, rangeToDt)) {
                    continue;
                }

                // Calculate the start/end canvas x position of this band based on the current range and whether we are rendering right-to-left.
                const xPositionStart = this._isRTL
                    ? milliRenderWidth * (rangeToDt.getTime() - band.end.getTime())
                    : milliRenderWidth * (band.start.getTime() - rangeFromDt.getTime());
                const xPositionEnd = this._isRTL
                    ? milliRenderWidth * (rangeToDt.getTime() - band.start.getTime())
                    : milliRenderWidth * (band.end.getTime() - rangeFromDt.getTime());

                // Draw the band rectangle to the canvas.
                context.fillStyle = band.style.color!;
                context.globalAlpha = band.style.opacity!;
                context.beginPath();
                context.rect(xPositionStart, yPosition, xPositionEnd - xPositionStart, height);
                context.fill();

                // TODO Draw the left/right borders if they are defined.
            } else {
                // PIT band - draw a vertical line
                // Calculate the x position of this band based on the current range and whether we are rendering right-to-left.
                const xPosition = this._isRTL
                    ? milliRenderWidth * (rangeToDt.getTime() - band.start.getTime())
                    : milliRenderWidth * (band.start.getTime() - rangeFromDt.getTime());

                // Use border color if available, otherwise fall back to band color
                const lineColor = band.style.borderColor || band.style.color || "#000000";
                const lineWidth = band.style.borderThickness || 2;

                // Draw the vertical line
                context.strokeStyle = lineColor;
                context.lineWidth = lineWidth;
                context.globalAlpha = band.style.opacity || 1;
                context.setLineDash([]);
                context.beginPath();
                context.moveTo(xPosition, yPosition);
                context.lineTo(xPosition, yPosition + height);
                context.stroke();
            }
        }

        // Reset the canvas context alpha.
        context.globalAlpha = 1;
    }

    /**
     * Draw a vertical bar for every minor unit tick.
     * @param context The canvas context.
     * @param rangeMinorTicks The range minor ticks.
     * @param yPosition The y position of the top of the view.
     * @param height The available height of the view.
     */
    private _drawMinorUnitBars(
        context: CanvasRenderingContext2D,
        rangeMinorTicks: RangeTick[],
        yPosition: number,
        height: number
    ): void {
        context.lineWidth = 1;
        context.strokeStyle = GRID_COLOUR;
        context.setLineDash([3, 3]); /* dashes are 5px and spaces are 3px */
        context.beginPath();

        for (const { xPosition } of rangeMinorTicks) {
            // We should only render a unit bar if its not right at the edge of the canvas as it looks a little weird.
            if (xPosition > 0 && xPosition < context.canvas.width) {
                // Render the unit bar at a half-pixel unit so we dont get blur.
                const x = Math.round(xPosition) + 0.5;
                context.moveTo(x, yPosition);
                context.lineTo(x, yPosition + height);
            }
        }

        // Reset the line dash to be solid.
        context.stroke();
        context.setLineDash([]);
    }

    /**
     * Draw a passive scrollbar on the end side of the data view to indicate vertical overflow.
     * @param context The canvas context.
     * @param yPosition The y position of the top of the view.
     * @param height The available height of the view.
     */
    private _drawScrollbar(context: CanvasRenderingContext2D, yPosition: number, height: number): void {
        // Only draw scrollbar if there's content overflow
        if (!this._drawPlan || this._drawPlan.height <= height) {
            return;
        }

        // Check visibility based on configuration
        let shouldShow = false;
        switch (this._scrollbarOptions.visibility ?? "hover") {
            case "always":
                shouldShow = true;
                break;
            case "hover":
                shouldShow = this._isHovering || this._isPanning;
                break;
            case "panning":
                shouldShow = this._isPanning;
                break;
            case "never":
                shouldShow = false;
                break;
        }

        if (!shouldShow) {
            return;
        }

        const scrollbarWidth = 8;
        const scrollbarPadding = 4;
        const scrollbarMargin = 6; // Margin from top and bottom
        const scrollbarX = this._isRTL
            ? scrollbarPadding
            : context.canvas.clientWidth - scrollbarWidth - scrollbarPadding;

        // Calculate scrollbar thumb size and position with margins
        const availableHeight = height - scrollbarMargin * 2;
        const visibleRatio = height / this._drawPlan.height;
        const thumbHeight = Math.max(30, availableHeight * visibleRatio); // Minimum 30px thumb
        const scrollableHeight = availableHeight - thumbHeight;
        const scrollRatio = Math.abs(this._scrollYOffset) / (this._drawPlan.height - height);
        const thumbY = yPosition + scrollbarMargin + scrollRatio * scrollableHeight;

        const scrollbarColor = this._scrollbarOptions.color ?? GRID_COLOUR_TRANSPARENT;

        // Draw scrollbar track (subtle background)
        context.save();
        context.globalAlpha = 0.15;
        context.fillStyle = scrollbarColor;
        context.beginPath();
        context.roundRect(scrollbarX, yPosition + scrollbarMargin, scrollbarWidth, availableHeight, scrollbarWidth / 2);
        context.fill();
        context.restore();

        // Draw scrollbar thumb
        context.fillStyle = scrollbarColor;
        context.beginPath();
        context.roundRect(scrollbarX, thumbY, scrollbarWidth, thumbHeight, scrollbarWidth / 2);
        context.fill();
    }

    /**
     * Draw the groups and items based on the view draw plan.
     * @param context The canvas context.
     * @param yPosition The y position of the top of the view.
     */
    private _drawGroups(context: CanvasRenderingContext2D, yPosition: number): void {
        // There is nothing to do if we have no draw plan.
        if (!this._drawPlan) {
            return;
        }

        const scrolledYPosition = yPosition + this._scrollYOffset;

        // Set the text align based on whether we are rendering right-to-left.
        context.textAlign = this._isRTL ? "right" : "left";

        // Draw each group.
        for (
            let groupDrawPlanIndex = 0;
            groupDrawPlanIndex < this._drawPlan.groupDrawPlans.length;
            groupDrawPlanIndex++
        ) {
            const groupDrawPlan = this._drawPlan.groupDrawPlans[groupDrawPlanIndex];

            // If this is not our first group then we should draw a group separator line.
            if (groupDrawPlanIndex > 0) {
                context.lineWidth = 0.5;
                context.strokeStyle = GRID_COLOUR;
                context.beginPath();
                const separatorY = Math.round(scrolledYPosition + groupDrawPlan.yPositionStart - 1) + 0.5;
                context.moveTo(0, separatorY);
                context.lineTo(context.canvas.clientWidth, separatorY);
                context.stroke();
            }

            // Draw the group label if we have one.
            if (groupDrawPlan.label) {
                context.textBaseline = "top";
                context.fillStyle = GRID_COLOUR;
                context.beginPath();
                // If rendering right-to-left then the group labels will be rendered to the right of the canvas, otherwise left.
                if (this._isRTL) {
                    context.fillText(
                        groupDrawPlan.label,
                        context.canvas.clientWidth - DEFAULT_GROUP_LABEL_MARGIN,
                        scrolledYPosition + groupDrawPlan.yPositionStart + DEFAULT_GROUP_LABEL_MARGIN
                    );
                } else {
                    context.fillText(
                        groupDrawPlan.label,
                        DEFAULT_GROUP_LABEL_MARGIN,
                        scrolledYPosition + groupDrawPlan.yPositionStart + DEFAULT_GROUP_LABEL_MARGIN
                    );
                }
                context.stroke();
            }

            // For each row in the group draw plan ...
            for (const groupDrawPlanRow of groupDrawPlan.rows) {
                // ... and each item in that group draw plan row ...
                for (const itemDrawPlan of groupDrawPlanRow) {
                    // ... draw the item.
                    this._drawGroupItem(itemDrawPlan, context, scrolledYPosition);
                }
            }
        }

        // We need a second pass to draw selection outlines on top of all selected items so they're never occluded.
        for (const groupDrawPlan of this._drawPlan.groupDrawPlans) {
            for (const groupDrawPlanRow of groupDrawPlan.rows) {
                for (const itemDrawPlan of groupDrawPlanRow) {
                    if (!itemDrawPlan.item.isSelected) continue;

                    const selX = itemDrawPlan.xPositionStart;
                    const selY = scrolledYPosition + itemDrawPlan.yPositionStart;
                    const selW = itemDrawPlan.xPositionEnd - itemDrawPlan.xPositionStart;
                    const selH = itemDrawPlan.yPositionEnd - itemDrawPlan.yPositionStart;
                    const pad = 3;
                    const borderRadius = itemDrawPlan.item.style.borderRadius ?? 0;

                    context.lineWidth = 2;
                    context.lineCap = "round";
                    context.strokeStyle = "rgba(128, 128, 128, 0.8)";
                    context.setLineDash([4, 4]);
                    context.lineDashOffset = 0;
                    context.beginPath();
                    context.roundRect(selX - pad, selY - pad, selW + pad * 2, selH + pad * 2, borderRadius + pad);
                    context.stroke();
                }
            }
        }

        context.setLineDash([]);
        context.lineDashOffset = 0;
        context.lineCap = "butt";

        // We need a third pass to draw dependency arrows between items (only if any dependencies exist).
        if (this._dataSet.hasDependencies) {
            this._drawDependencyArrows(context, scrolledYPosition);
        }

        // Always revert the canvas text align to be left.
        context.textAlign = "left";
    }

    /**
     * Draw a single group item.
     * @param itemDrawPlan The item draw plan.
     * @param context The canvas context.
     * @param scrolledYPosition The y position of the top of the view, taking into account the current scroll offset.
     */
    private _drawGroupItem(
        itemDrawPlan: DataViewItemDrawPlan,
        context: CanvasRenderingContext2D,
        scrolledYPosition: number
    ) {
        // Get the item and the item category (if it is associated with a category).
        const item = itemDrawPlan.item;
        const itemCategory = item.category ? this._dataSet.getCategory(item.category) : null;

        // Get the item styles.
        const itemPadding = item.style.padding!;
        const itemBorderRadius = item.style.borderRadius!;
        const itemBorderThickness = item.style.borderThickness;
        const itemBorderStyle = item.style.borderStyle ?? "solid";
        let itemBackgroundColor = item.style.backgroundColor!;
        let itemFontColor = item.style.fontColor!;
        let itemBorderColor = item.style.borderColor;

        // If the item is too small to be rendered then we should just skip it to improve performance.
        if (itemDrawPlan.xPositionEnd - itemDrawPlan.xPositionStart < 1) {
            return;
        }

        // If a category is being focused, but this item doesn't belong to that category, then render it with the unfocused item background and font colour.
        // TODO This should eventually just use a lighter version of item.style.backgroundColor! based on the result of some function.
        if (this._dataSet.focusedCategory && !this._dataSet.focusedCategory.isDisabled && !itemCategory?.isFocused) {
            itemBackgroundColor = UNFOCUSED_ITEM_BACKGROUND_COLOUR;
            itemBorderColor = UNFOCUSED_ITEM_BACKGROUND_COLOUR;
            itemFontColor = UNFOCUSED_ITEM_FONT_COLOUR;
        }

        // If this is a PIT item we should draw the downward marker line.
        if (itemDrawPlan.xPointInTimePosition !== null) {
            // Set the width of the PIT marker line.
            // TODO Make this configurable.
            context.lineWidth = 2;

            // The color we use to draw the downward marker line and the little downward triangle should be:
            // - The item background color if no border is being drawn.
            // - The item border color if an item border is being drawn.
            context.fillStyle = itemBorderThickness && itemBorderColor ? itemBorderColor : itemBackgroundColor;
            context.strokeStyle = itemBorderThickness && itemBorderColor ? itemBorderColor : itemBackgroundColor;

            // Check if the entire item (box + triangle) is above the visible window
            // The triangle extends 6 pixels below the item box
            const itemBottomWithTriangle = scrolledYPosition + itemDrawPlan.yPositionEnd + 6;
            const isEntirelyAboveVisibleWindow = itemBottomWithTriangle < 0;

            // Use reduced opacity only if the entire item is above the visible window
            if (isEntirelyAboveVisibleWindow) {
                context.globalAlpha = 0.3;
            }

            // We need to draw a little downward triangle to join the item and the marker line.
            const itemMarkerConnectorPath = new Path2D();
            itemMarkerConnectorPath.moveTo(
                Math.max(itemDrawPlan.xPositionStart, itemDrawPlan.xPointInTimePosition - 20),
                scrolledYPosition +
                    itemDrawPlan.yPositionStart +
                    (itemDrawPlan.yPositionEnd - itemDrawPlan.yPositionStart) / 2
            );
            itemMarkerConnectorPath.lineTo(
                itemDrawPlan.xPointInTimePosition,
                scrolledYPosition + itemDrawPlan.yPositionEnd + 6
            );
            itemMarkerConnectorPath.lineTo(
                Math.min(itemDrawPlan.xPositionEnd, itemDrawPlan.xPointInTimePosition + 20),
                scrolledYPosition +
                    itemDrawPlan.yPositionStart +
                    (itemDrawPlan.yPositionEnd - itemDrawPlan.yPositionStart) / 2
            );
            context.fill(itemMarkerConnectorPath);

            // Draw the actual marker line from the item downward to the bottom of the canvas.
            context.beginPath();
            context.moveTo(itemDrawPlan.xPointInTimePosition, scrolledYPosition + itemDrawPlan.yPositionEnd);
            context.lineTo(itemDrawPlan.xPointInTimePosition, context.canvas.clientHeight);
            context.stroke();

            // Reset opacity if it was changed
            if (isEntirelyAboveVisibleWindow) {
                context.globalAlpha = 1.0;
            }
        }

        // Draw the item range rectangle.
        // When a border is configured, inset the fill so it doesn't bleed outside the stroke.
        const fillInset = itemBorderThickness && itemBorderColor ? itemBorderThickness / 2 : 0;
        context.fillStyle = itemBackgroundColor;
        context.beginPath();
        context.roundRect(
            itemDrawPlan.xPositionStart + fillInset,
            scrolledYPosition + itemDrawPlan.yPositionStart + fillInset,
            itemDrawPlan.xPositionEnd - itemDrawPlan.xPositionStart - fillInset * 2,
            itemDrawPlan.yPositionEnd - itemDrawPlan.yPositionStart - fillInset * 2,
            Math.max(0, itemBorderRadius - fillInset)
        );
        context.fill();

        // Draw the item border if a border thickness and border color are configured.
        if (itemBorderThickness && itemBorderColor) {
            context.strokeStyle = itemBorderColor;
            context.lineWidth = itemBorderThickness;

            // Apply the border style (solid, dashed, dotted, dash-dot, long-dash).
            const prevLineCap = context.lineCap;
            if (itemBorderStyle === "dashed") {
                context.setLineDash([8, 4]);
            } else if (itemBorderStyle === "dotted") {
                // Use round line caps so each tiny dash renders as a circle.
                context.lineCap = "round";
                context.setLineDash([0.5, itemBorderThickness * 2.5]);
            } else if (itemBorderStyle === "dash-dot") {
                context.lineCap = "round";
                context.setLineDash([8, 4, 0.5, 4]);
            } else if (itemBorderStyle === "long-dash") {
                context.setLineDash([14, 6]);
            } else {
                context.setLineDash([]);
            }

            context.beginPath();
            context.roundRect(
                itemDrawPlan.xPositionStart + context.lineWidth / 2,
                scrolledYPosition + itemDrawPlan.yPositionStart + context.lineWidth / 2,
                itemDrawPlan.xPositionEnd - itemDrawPlan.xPositionStart - context.lineWidth,
                itemDrawPlan.yPositionEnd - itemDrawPlan.yPositionStart - +context.lineWidth,
                itemBorderRadius
            );
            context.stroke();

            // Reset the line dash and line cap back to defaults.
            context.setLineDash([]);
            context.lineCap = prevLineCap;
        }

        // Draw the item label (if there is one).
        if (item.label) {
            // For stable mode PIT items, don't truncate labels - let them extend beyond canvas
            const isPitItem = itemDrawPlan.xPointInTimePosition !== null;
            const isStableMode = this._stackMode === "stable";

            if (isStableMode && isPitItem) {
                // Stable mode PIT items: render label at full width, centered on the item box
                context.textBaseline = "middle";
                context.textAlign = "center";
                context.fillStyle = itemFontColor;

                const labelCenterX = (itemDrawPlan.xPositionStart + itemDrawPlan.xPositionEnd) / 2;

                context.fillText(
                    item.label,
                    labelCenterX,
                    itemDrawPlan.yPositionStart +
                        (itemDrawPlan.yPositionEnd - itemDrawPlan.yPositionStart) / 2 +
                        1 +
                        scrolledYPosition
                );

                // Reset text align back to the default for subsequent items
                context.textAlign = this._isRTL ? "right" : "left";
            } else {
                // Compact mode or range items: keep label within bounds and truncate if needed
                // Calculate the actual x position of the label, we should attempt to keep this in the bounds of the view.
                // If rendering right-to-left then we will be rendering the label to the right of the item, otherwise the left.
                const labelStartPositionX = this._isRTL
                    ? Math.floor(
                          Math.min(context.canvas.clientWidth - itemPadding, itemDrawPlan.xPositionEnd - itemPadding)
                      )
                    : Math.floor(Math.max(itemPadding, itemDrawPlan.xPositionStart + itemPadding));

                // Calculate the max item label width.
                const maxLabelWidth = this._isRTL
                    ? Math.max(0, Math.ceil(labelStartPositionX - (itemDrawPlan.xPositionStart + itemPadding)) + 1)
                    : Math.max(0, Math.ceil(itemDrawPlan.xPositionEnd - itemPadding - labelStartPositionX));

                // Render the text label, but only if we have enough space to do so.
                if (maxLabelWidth > MINIMUM_RENDERED_LABEL_WIDTH) {
                    context.textBaseline = "middle";
                    context.fillStyle = itemFontColor;

                    // Draw the item label, but clip it if there is not enough available horizontal space to do so.
                    drawClippedText(
                        context,
                        item.label,
                        labelStartPositionX,
                        itemDrawPlan.yPositionStart +
                            (itemDrawPlan.yPositionEnd - itemDrawPlan.yPositionStart) / 2 +
                            1 +
                            scrolledYPosition,
                        maxLabelWidth
                    );
                }
            }
        }
    }

    /**
     * Draw dependency arrows between items that have dependencies defined.
     * Uses orthogonal routing with rounded corners:
     * - Straight line when source and target are on the same row with no overlap.
     * - Step connector (right → down/up → right) when target is to the right with space.
     * - S-shaped connector when items overlap horizontally.
     * @param context The canvas context.
     * @param scrolledYPosition The y position including scroll offset.
     */
    private _drawDependencyArrows(context: CanvasRenderingContext2D, scrolledYPosition: number): void {
        if (!this._drawPlan) return;

        const ARROW_SIZE = 6;
        const MARGIN = 12;
        const RADIUS = 6;

        // Build a lookup map of item ID → draw plan.
        const planMap = new Map<string | number, DataViewItemDrawPlan>();
        for (const group of this._drawPlan.groupDrawPlans) {
            for (const row of group.rows) {
                for (const plan of row) {
                    planMap.set(plan.item.id, plan);
                }
            }
        }

        context.strokeStyle = GRID_COLOUR;
        context.fillStyle = GRID_COLOUR;
        context.lineWidth = 1.5;
        context.setLineDash([]);

        for (const [, target] of planMap) {
            if (target.item.dependencies.length === 0) continue;

            for (const depId of target.item.dependencies) {
                const source = planMap.get(depId);
                if (!source) continue;

                const sx = source.xPositionEnd;
                const sy = scrolledYPosition + (source.yPositionStart + source.yPositionEnd) / 2;
                const tx = target.xPositionStart;
                const ty = scrolledYPosition + (target.yPositionStart + target.yPositionEnd) / 2;

                // Skip if both endpoints are off-screen.
                if ((sx < 0 && tx < 0) || (sx > context.canvas.clientWidth && tx > context.canvas.clientWidth)) continue;

                context.beginPath();

                if (sy === ty && tx > sx) {
                    // Same row, no overlap — straight line.
                    context.moveTo(sx, sy);
                    context.lineTo(tx, ty);
                } else if (tx > sx + MARGIN * 2) {
                    // Step connector: right → vertical → right.
                    const midX = (sx + tx) / 2;
                    const down = ty > sy;
                    const r = Math.min(RADIUS, Math.abs(midX - sx), Math.abs(ty - sy) / 2);

                    context.moveTo(sx, sy);
                    context.lineTo(midX - r, sy);
                    context.arcTo(midX, sy, midX, sy + (down ? r : -r), r);
                    context.lineTo(midX, ty + (down ? -r : r));
                    context.arcTo(midX, ty, midX + r, ty, r);
                    context.lineTo(tx, ty);
                } else {
                    // S-shaped connector: right → vertical → horizontal → vertical → right.
                    const down = ty >= sy;
                    const midY = down
                        ? scrolledYPosition + (source.yPositionEnd + target.yPositionStart) / 2
                        : scrolledYPosition + (target.yPositionEnd + source.yPositionStart) / 2;
                    const stubR = sx + MARGIN;
                    const stubL = tx - MARGIN;
                    const r = Math.min(RADIUS, Math.abs(midY - sy) / 2, MARGIN / 2);

                    context.moveTo(sx, sy);
                    context.lineTo(stubR - r, sy);
                    context.arcTo(stubR, sy, stubR, sy + (down ? r : -r), r);
                    context.lineTo(stubR, midY + (down ? -r : r));
                    context.arcTo(stubR, midY, stubR - r, midY, r);
                    context.lineTo(stubL + r, midY);
                    context.arcTo(stubL, midY, stubL, midY + (down ? r : -r), r);
                    context.lineTo(stubL, ty + (down ? -r : r));
                    context.arcTo(stubL, ty, stubL + r, ty, r);
                    context.lineTo(tx, ty);
                }

                context.stroke();

                // Arrowhead.
                context.beginPath();
                context.moveTo(tx, ty);
                context.lineTo(tx - ARROW_SIZE, ty - ARROW_SIZE / 2);
                context.lineTo(tx - ARROW_SIZE, ty + ARROW_SIZE / 2);
                context.closePath();
                context.fill();
            }
        }
    }

    /**
     * Create a draw plan for the view.
     * Delegates to either compact or stable mode based on configuration.
     * @param context The canvas context
     * @param rangeFromDt The range from date.
     * @param rangeToDt The range to date.
     * @returns A draw plan for the view.
     */
    private _createViewDrawPlan(
        context: CanvasRenderingContext2D,
        rangeFromDt: Date,
        rangeToDt: Date
    ): DataViewDrawPlan {
        if (this._stackMode === "stable") {
            return this._createStableDrawPlan(context, rangeFromDt, rangeToDt);
        } else {
            return this._createCompactDrawPlan(context, rangeFromDt, rangeToDt);
        }
    }

    /**
     * Create a draw plan using compact mode (current behavior).
     * - Only visible items are included in the layout
     * - PIT labels are adjusted to fit within canvas bounds
     * - Layout updates on every pan
     *
     * @param context The canvas context
     * @param rangeFromDt The range from date.
     * @param rangeToDt The range to date.
     * @returns A draw plan for the view.
     */
    private _createCompactDrawPlan(
        context: CanvasRenderingContext2D,
        rangeFromDt: Date,
        rangeToDt: Date
    ): DataViewDrawPlan {
        // Create an array to store all of our group draw plans.
        const groupDrawPlans: DataViewGroupDrawPlan[] = [];

        // Calculate the width of one millisecond as it would be rendered on the canvas.
        const milliRenderWidth = context.canvas.clientWidth / (rangeToDt.getTime() - rangeFromDt.getTime());

        // Work out all item stacks first. We aren't calculating any y positions or heights here we can do that after.
        for (const grouping of this._dataSet.groupings) {
            // Get all items in the current visible range.
            let itemsInRange = grouping.getItemsInRange(rangeFromDt, rangeToDt);

            // Filter out any items that are in disabled categories.
            itemsInRange = itemsInRange.filter((item) => {
                // Try to get the category for the item.
                const itemCategory = item.category ? this._dataSet.getCategory(item.category) : null;

                return !itemCategory?.isDisabled;
            });

            // If there are no items in this group that are within the current range view then we should just skip this group.
            if (!itemsInRange.length) {
                continue;
            }

            const itemDrawPlanStacks: DataViewItemDrawPlan[][] = [[]];

            // Populate the item draw plan stacks for this group.
            for (const item of itemsInRange) {
                let startPositionX = 0;
                let endPositionX = 0;
                let pointInTimePositionX = null;

                // Figure out the xPositionStart and xPositionEnd of the current item. Whether the item is a range or PIT will influence this.
                if (item.end) {
                    // This is a range item, the start and end positions of our x axis will always be derived from the start and end date.
                    // If rendering right-to-left then we need to flip the start/end positions.
                    if (this._isRTL) {
                        startPositionX = milliRenderWidth * (rangeToDt.getTime() - item.end.getTime());
                        endPositionX = milliRenderWidth * (rangeToDt.getTime() - item.start.getTime());
                    } else {
                        startPositionX = milliRenderWidth * (item.start.getTime() - rangeFromDt.getTime());
                        endPositionX = milliRenderWidth * (item.end.getTime() - rangeFromDt.getTime());
                    }
                } else {
                    // This is a PIT item, the start and end positions of our x axis will be derived from the width of the label and the start date.
                    // TODO Determine what to do when we have PIT item with no label.
                    // TODO Set the context font to be whatever we will be using to render the actual item label.
                    const itemLabelWidth = context.measureText(item.label ?? "?").width + item.style.padding! * 2;

                    // The point in time position should always be the start date regardless of the position or width of the PIT item box.
                    // If rendering right-to-left then we will need to calculate this from the right of the canvas rather than the left.
                    pointInTimePositionX = this._isRTL
                        ? milliRenderWidth * (rangeToDt.getTime() - item.start.getTime())
                        : milliRenderWidth * (item.start.getTime() - rangeFromDt.getTime());

                    // Let's set the start and end x position to be equidistant from the actual point in time that this item is for.
                    // The point in time position should always be the start date regardless of the position or width of the PIT item box.
                    startPositionX = pointInTimePositionX - itemLabelWidth / 2;
                    endPositionX = pointInTimePositionX + itemLabelWidth / 2;

                    // We may have to shift this item so that it is actually in the bounds of the range view.
                    if (startPositionX < 0) {
                        startPositionX = 0;
                        endPositionX = itemLabelWidth;
                    } else if (endPositionX > context.canvas.clientWidth) {
                        startPositionX = context.canvas.clientWidth - itemLabelWidth;
                        endPositionX = context.canvas.clientWidth;
                    }
                }

                // Create the draw plan for the current item.
                const itemDrawPlan: DataViewItemDrawPlan = {
                    item,
                    height: 0,
                    xPositionStart: startPositionX,
                    xPositionEnd: endPositionX,
                    yPositionStart: 0,
                    yPositionEnd: 0,
                    xPointInTimePosition: pointInTimePositionX
                };

                // Iterate over each row stack (starting from the first which will be at the top row in the view) and:
                //  - If the xPositionStart of the item is >= the xPositionEnd of the last item in the current row stack then add the item to the end of the row stack.
                //  - If the xPositionStart of the item is < the xPositionEnd of the last item in the current row stack then:
                //    - Move on to the next row stack if there is one.
                //    - Create a new empty row stack if there is no next row stack and add the item to it.

                let wasItemAddedToExistingRowStack = false;

                // Look for an existing row to place this item in. It may not fit in any due to overlaps.
                for (const rowStack of itemDrawPlanStacks) {
                    // Check whether the current item can fit at the end of the current row.
                    const canItemFitInCurrentRow = this._isRTL
                        ? rowStack.length > 0 &&
                          rowStack[rowStack.length - 1].xPositionStart >= itemDrawPlan.xPositionEnd
                        : rowStack.length > 0 &&
                          rowStack[rowStack.length - 1].xPositionEnd <= itemDrawPlan.xPositionStart;

                    if (rowStack.length === 0 || canItemFitInCurrentRow) {
                        // The current item will fit nicely into the current row.
                        rowStack.push(itemDrawPlan);

                        wasItemAddedToExistingRowStack = true;

                        // We found the right row for our item so there is no need to keep looking.
                        break;
                    }
                }

                // We were not able to place this item in any existing rows due to overlaps, so we will have to add it to a new row.
                if (!wasItemAddedToExistingRowStack) {
                    itemDrawPlanStacks.push([itemDrawPlan]);
                }
            }

            // Add the group draw plan to the array.
            groupDrawPlans.push({
                label: grouping.group,
                rows: itemDrawPlanStacks,
                yPositionStart: 0,
                yPositionEnd: 0
            });
        }

        let positionY = 0;

        // Now that we have all our groups and item stacks we can calculate the height that these things will take up and set the y positions on things.
        for (const groupDrawPlan of groupDrawPlans) {
            groupDrawPlan.yPositionStart = positionY;

            // The height of any group labels will have to be taken into consideration.
            if (groupDrawPlan.label) {
                const groupLabelMetrics = context.measureText(groupDrawPlan.label);

                // Add the vertical space required to draw the label.
                positionY += groupLabelMetrics.actualBoundingBoxAscent + groupLabelMetrics.actualBoundingBoxDescent;

                // Add a smidge of vertical padding for below and above the label.
                positionY += 2 * DEFAULT_GROUP_LABEL_MARGIN;
            }

            // We want to stick a little bit of a margin at the top of the group, but below the label
            positionY += DEFAULT_GROUP_MARGIN;

            // Process each row of items for the group.
            for (const itemRow of groupDrawPlan.rows) {
                // Each row gets some top padding.
                positionY += DEFAULT_ITEM_VERTICAL_MARGIN;

                // Process each item draw plan in this row.
                for (const itemDrawPlan of itemRow) {
                    // We should calculate the height of the item, this will be based on the height of an example label and any item padding.
                    const { actualBoundingBoxAscent, actualBoundingBoxDescent } = context.measureText("Label");
                    const itemHeight =
                        actualBoundingBoxAscent + actualBoundingBoxDescent + itemDrawPlan.item.style.padding! * 2;

                    itemDrawPlan.yPositionStart = positionY;
                    itemDrawPlan.yPositionEnd = positionY + itemHeight;
                }

                // Add the max height of the items in this row to our current y position. Our items can have different heights, so we need to find the largest yPositionEnd.
                positionY = Math.max(...itemRow.map((itemDrawPlan) => itemDrawPlan.yPositionEnd));

                // Each row gets some bottom padding.
                positionY += DEFAULT_ITEM_VERTICAL_MARGIN;
            }

            // We want to stick a little bit of a margin at the bottom of the group.
            positionY += DEFAULT_GROUP_MARGIN;

            groupDrawPlan.yPositionEnd = positionY;

            // Start the next group on the next pixel down.
            positionY += 1;
        }

        return {
            height: positionY,
            width: context.canvas.clientWidth,
            groupDrawPlans
        };
    }

    /**
     * Create a draw plan using stable mode.
     * - ALL items in the dataset are included in the layout
     * - PIT labels are always centered on their timestamp (not adjusted for canvas bounds)
     * - Row structure is cached and only recalculated on zoom or data changes
     * - X positions are recalculated on every draw to support panning
     * @param context The canvas context
     * @param rangeFromDt The range from date.
     * @param rangeToDt The range to date.
     * @returns A draw plan for the view.
     */
    private _createStableDrawPlan(
        context: CanvasRenderingContext2D,
        rangeFromDt: Date,
        rangeToDt: Date
    ): DataViewDrawPlan {
        // Calculate the current zoom range.
        const currentZoomRange = rangeToDt.getTime() - rangeFromDt.getTime();
        const milliRenderWidth = context.canvas.clientWidth / currentZoomRange;
        const currentCanvasWidth = context.canvas.clientWidth;

        // Check if we need to recalculate the row structure.
        // Row structure is recalculated if zoom changed significantly, canvas width changed, or cache is empty.
        const needsRowRecalculation =
            !this._cachedStableRowStructure ||
            this._lastZoomRange === 0 ||
            this._lastCanvasWidth !== currentCanvasWidth ||
            Math.abs(currentZoomRange - this._lastZoomRange) / this._lastZoomRange > 0.01;

        if (needsRowRecalculation) {
            // Recalculate row structure
            this._cachedStableRowStructure = this._calculateStableRowStructure(context, rangeFromDt, rangeToDt);
            this._lastZoomRange = currentZoomRange;
            this._lastCanvasWidth = currentCanvasWidth;
        }

        // Now create the draw plan using the cached row structure but with current x positions
        const groupDrawPlans: DataViewGroupDrawPlan[] = [];

        for (const grouping of this._dataSet.groupings) {
            // Get the cached row assignments for this grouping
            const rowAssignments = this._cachedStableRowStructure!.get(grouping.group);
            if (!rowAssignments || rowAssignments.size === 0) {
                continue;
            }

            // Determine the maximum row number from ALL items (not just visible)
            const maxRow = Math.max(...Array.from(rowAssignments.values()));

            // Create empty row arrays
            const itemDrawPlanStacks: DataViewItemDrawPlan[][] = Array.from({ length: maxRow + 1 }, () => []);

            // Get items in the current visible range (not all items)
            let itemsInRange = grouping.getItemsInRange(rangeFromDt, rangeToDt);

            // Filter out disabled categories
            itemsInRange = itemsInRange.filter((item) => {
                const itemCategory = item.category ? this._dataSet.getCategory(item.category) : null;
                return !itemCategory?.isDisabled;
            });

            // Process only VISIBLE items and calculate their current x positions
            for (const item of itemsInRange) {
                let startPositionX = 0;
                let endPositionX = 0;
                let pointInTimePositionX = null;

                if (item.end) {
                    // Range item - calculate x position based on current range
                    if (this._isRTL) {
                        startPositionX = milliRenderWidth * (rangeToDt.getTime() - item.end.getTime());
                        endPositionX = milliRenderWidth * (rangeToDt.getTime() - item.start.getTime());
                    } else {
                        startPositionX = milliRenderWidth * (item.start.getTime() - rangeFromDt.getTime());
                        endPositionX = milliRenderWidth * (item.end.getTime() - rangeFromDt.getTime());
                    }
                } else {
                    // Point-in-time item - calculate x position based on current range
                    const itemLabelWidth = context.measureText(item.label ?? "?").width + item.style.padding! * 2;

                    pointInTimePositionX = this._isRTL
                        ? milliRenderWidth * (rangeToDt.getTime() - item.start.getTime())
                        : milliRenderWidth * (item.start.getTime() - rangeFromDt.getTime());

                    // STABLE MODE: Always center the label on the timestamp
                    startPositionX = pointInTimePositionX - itemLabelWidth / 2;
                    endPositionX = pointInTimePositionX + itemLabelWidth / 2;
                }

                const itemDrawPlan: DataViewItemDrawPlan = {
                    item,
                    height: 0,
                    xPositionStart: startPositionX,
                    xPositionEnd: endPositionX,
                    yPositionStart: 0,
                    yPositionEnd: 0,
                    xPointInTimePosition: pointInTimePositionX
                };

                // Place the item in its pre-assigned row
                const assignedRow = rowAssignments.get(item);
                if (assignedRow !== undefined) {
                    itemDrawPlanStacks[assignedRow].push(itemDrawPlan);
                }
            }

            groupDrawPlans.push({
                label: grouping.group,
                rows: itemDrawPlanStacks,
                yPositionStart: 0,
                yPositionEnd: 0
            });
        }

        // Calculate vertical positions
        let positionY = 0;

        for (const groupDrawPlan of groupDrawPlans) {
            groupDrawPlan.yPositionStart = positionY;

            if (groupDrawPlan.label) {
                const groupLabelMetrics = context.measureText(groupDrawPlan.label);
                positionY += groupLabelMetrics.actualBoundingBoxAscent + groupLabelMetrics.actualBoundingBoxDescent;
                positionY += 2 * DEFAULT_GROUP_LABEL_MARGIN;
            }

            positionY += DEFAULT_GROUP_MARGIN;

            for (const itemRow of groupDrawPlan.rows) {
                positionY += DEFAULT_ITEM_VERTICAL_MARGIN;

                // Calculate the row height consistently, regardless of whether the row has visible items
                // Use the maximum item height that could exist in this row to ensure consistent spacing
                const { actualBoundingBoxAscent, actualBoundingBoxDescent } = context.measureText("Label");
                let maxItemHeight = actualBoundingBoxAscent + actualBoundingBoxDescent + 10 * 2; // Default padding is 10

                // Set y positions for all visible items in this row
                for (const itemDrawPlan of itemRow) {
                    const itemHeight =
                        actualBoundingBoxAscent + actualBoundingBoxDescent + itemDrawPlan.item.style.padding! * 2;
                    itemDrawPlan.yPositionStart = positionY;
                    itemDrawPlan.yPositionEnd = positionY + itemHeight;

                    // Track the maximum item height in this row
                    maxItemHeight = Math.max(maxItemHeight, itemHeight);
                }

                // Always advance by the maximum item height to maintain consistent row spacing
                positionY += maxItemHeight;
                positionY += DEFAULT_ITEM_VERTICAL_MARGIN;
            }

            positionY += DEFAULT_GROUP_MARGIN;
            groupDrawPlan.yPositionEnd = positionY;
            positionY += 1;
        }

        return {
            height: positionY,
            width: context.canvas.clientWidth,
            groupDrawPlans
        };
    }

    /**
     * Calculate the stable row structure for all groupings.
     * This determines which row each item should be in, based on overlap detection.
     * The row structure is cached and only recalculated when zoom changes.
     * @param context The canvas context
     * @param rangeFromDt The range from date.
     * @param rangeToDt The range to date.
     * @returns A map of grouping names to item-row assignments.
     */
    private _calculateStableRowStructure(
        context: CanvasRenderingContext2D,
        rangeFromDt: Date,
        rangeToDt: Date
    ): Map<string, Map<TimelineItem, number>> {
        const rowStructure = new Map<string, Map<TimelineItem, number>>();
        const milliRenderWidth = context.canvas.clientWidth / (rangeToDt.getTime() - rangeFromDt.getTime());

        for (const grouping of this._dataSet.groupings) {
            // Use ALL items in the grouping
            let allItems = grouping.items;

            // Filter out disabled categories
            allItems = allItems.filter((item) => {
                const itemCategory = item.category ? this._dataSet.getCategory(item.category) : null;
                return !itemCategory?.isDisabled;
            });

            if (!allItems.length) {
                continue;
            }

            const rowAssignments = new Map<TimelineItem, number>();
            const itemDrawPlanStacks: DataViewItemDrawPlan[][] = [[]];

            // Process all items to determine row assignments
            for (const item of allItems) {
                let startPositionX = 0;
                let endPositionX = 0;
                let pointInTimePositionX = null;

                if (item.end) {
                    // Range item
                    if (this._isRTL) {
                        startPositionX = milliRenderWidth * (rangeToDt.getTime() - item.end.getTime());
                        endPositionX = milliRenderWidth * (rangeToDt.getTime() - item.start.getTime());
                    } else {
                        startPositionX = milliRenderWidth * (item.start.getTime() - rangeFromDt.getTime());
                        endPositionX = milliRenderWidth * (item.end.getTime() - rangeFromDt.getTime());
                    }
                } else {
                    // Point-in-time item
                    const itemLabelWidth = context.measureText(item.label ?? "?").width + item.style.padding! * 2;

                    pointInTimePositionX = this._isRTL
                        ? milliRenderWidth * (rangeToDt.getTime() - item.start.getTime())
                        : milliRenderWidth * (item.start.getTime() - rangeFromDt.getTime());

                    startPositionX = pointInTimePositionX - itemLabelWidth / 2;
                    endPositionX = pointInTimePositionX + itemLabelWidth / 2;
                }

                const itemDrawPlan: DataViewItemDrawPlan = {
                    item,
                    height: 0,
                    xPositionStart: startPositionX,
                    xPositionEnd: endPositionX,
                    yPositionStart: 0,
                    yPositionEnd: 0,
                    xPointInTimePosition: pointInTimePositionX
                };

                // Find a row for this item
                let wasItemAddedToExistingRowStack = false;
                let assignedRowIndex = 0;

                for (let rowIndex = 0; rowIndex < itemDrawPlanStacks.length; rowIndex++) {
                    const rowStack = itemDrawPlanStacks[rowIndex];
                    const canItemFitInCurrentRow = this._isRTL
                        ? rowStack.length > 0 &&
                          rowStack[rowStack.length - 1].xPositionStart >= itemDrawPlan.xPositionEnd
                        : rowStack.length > 0 &&
                          rowStack[rowStack.length - 1].xPositionEnd <= itemDrawPlan.xPositionStart;

                    if (rowStack.length === 0 || canItemFitInCurrentRow) {
                        rowStack.push(itemDrawPlan);
                        wasItemAddedToExistingRowStack = true;
                        assignedRowIndex = rowIndex;
                        break;
                    }
                }

                if (!wasItemAddedToExistingRowStack) {
                    itemDrawPlanStacks.push([itemDrawPlan]);
                    assignedRowIndex = itemDrawPlanStacks.length - 1;
                }

                // Store the row assignment
                rowAssignments.set(item, assignedRowIndex);
            }

            rowStructure.set(grouping.group, rowAssignments);
        }

        return rowStructure;
    }

    /**
     * Scrolls to bring a specific item into view.
     * @param itemId The ID of the item to scroll to.
     * @param maxHeight The maximum height of the data view.
     * @param animate Whether to animate the scroll.
     * @param duration The animation duration in milliseconds.
     * @param easing The easing function to use.
     * @param onUpdate Optional callback called on each animation frame.
     * @param onComplete Optional callback called when animation completes.
     */
    public scrollToItem(
        itemId: string | number,
        maxHeight: number,
        animate: boolean = false,
        duration: number = 500,
        easing: EasingFunction = "easeInOut",
        onUpdate?: () => void,
        onComplete?: () => void
    ): void {
        const itemPosition = this.getItemVerticalPosition(itemId);

        if (itemPosition === null) {
            if (onComplete) {
                onComplete();
            }
            return;
        }

        const { yStart, yEnd } = itemPosition;

        // Calculate target scroll offset to center the item
        const itemCenter = (yStart + yEnd) / 2;
        const viewCenter = maxHeight / 2;
        let targetScrollOffset = -(itemCenter - viewCenter);

        // Clamp the scroll offset to valid bounds
        if (this._drawPlan) {
            const maxScroll = 0;
            const minScroll = Math.min(0, maxHeight - this._drawPlan.height);
            targetScrollOffset = Math.max(minScroll, Math.min(maxScroll, targetScrollOffset));
        }

        if (animate) {
            this.animateScrollTo(targetScrollOffset, duration, easing, onUpdate, onComplete);
        } else {
            this._scrollYOffset = targetScrollOffset;
            if (onUpdate) {
                onUpdate();
            }
            if (onComplete) {
                onComplete();
            }
        }
    }

    /**
     * Animates vertical scrolling to a target offset.
     * @param toOffset The target scroll offset.
     * @param duration The animation duration in milliseconds.
     * @param easing The easing function to use.
     * @param onUpdate Optional callback called on each animation frame.
     * @param onComplete Optional callback called when animation completes.
     */
    public animateScrollTo(
        toOffset: number,
        duration: number,
        easing: EasingFunction = "easeInOut",
        onUpdate?: () => void,
        onComplete?: () => void
    ): void {
        // Cancel any existing animation
        this.cancelAnimation();

        const startTime = performance.now();
        const fromOffset = this._scrollYOffset;

        const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Apply easing function
            const easedProgress = this._applyEasing(progress, easing);

            // Interpolate between start and target values
            this._scrollYOffset = fromOffset + (toOffset - fromOffset) * easedProgress;

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
     * Cancels any ongoing scroll animation.
     */
    public cancelAnimation(): void {
        if (this._animationFrameId !== null) {
            cancelAnimationFrame(this._animationFrameId);
            this._animationFrameId = null;
        }
    }

    /**
     * Gets the vertical position of an item in the current draw plan.
     * @param itemId The ID of the item to find.
     * @returns The vertical position or null if not found.
     */
    public getItemVerticalPosition(itemId: string | number): { yStart: number; yEnd: number } | null {
        if (!this._drawPlan) {
            return null;
        }

        for (const groupDrawPlan of this._drawPlan.groupDrawPlans) {
            for (const itemDrawPlan of groupDrawPlan.rows.flat()) {
                if (itemDrawPlan.item.id === itemId) {
                    return {
                        yStart: itemDrawPlan.yPositionStart,
                        yEnd: itemDrawPlan.yPositionEnd
                    };
                }
            }
        }
        return null;
    }

    /**
     * Creates a temporary draw plan for a specific date range without actually drawing.
     * Used for calculating item positions during animations.
     * @param context The canvas rendering context.
     * @param fromDt The from date.
     * @param toDt The to date.
     * @returns The temporary draw plan.
     */
    public createTemporaryDrawPlan(context: CanvasRenderingContext2D, fromDt: Date, toDt: Date): DataViewDrawPlan {
        return this._createViewDrawPlan(context, fromDt, toDt);
    }

    /**
     * Applies an easing function to a progress value.
     * @param progress The progress value (0-1).
     * @param easing The easing function name.
     * @returns The eased progress value.
     */
    private _applyEasing(progress: number, easing: EasingFunction): number {
        switch (easing) {
            case "linear":
                return progress;
            case "easeIn":
                return progress * progress;
            case "easeOut":
                return 1 - (1 - progress) * (1 - progress);
            case "easeInOut":
                return progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;
            case "easeInCubic":
                return progress * progress * progress;
            case "easeOutCubic":
                return 1 - Math.pow(1 - progress, 3);
            case "easeInOutCubic":
                return progress < 0.5 ? 4 * progress * progress * progress : 1 - Math.pow(-2 * progress + 2, 3) / 2;
            default:
                return progress;
        }
    }
}
