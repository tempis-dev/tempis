import { TimelineDataSet } from "./TimelineDataSet";
import { TimelineItem } from "./TimelineItem";
import { RangeTick, TimelineRangeView } from "./TimelineRangeView";
import { clamp, drawClippedText } from "./Utilities";

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

/** The default amount of vertical margin to use for group labels. */
const DEFAULT_GROUP_VERTICAL_LABEL_MARGIN: number = 6;

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
    /** The minimum height of the data view. */
    private static _minimumHeight: number = 50;

    /** The underlying dataset model. */
    private readonly _dataSet: TimelineDataSet;

    /** The current scroll Y offset. */
    private _scrollYOffset: number = 0;

    /** Gets the y position from where this view was last drawn. */
    private _lastDrawYPosition: number = 0;

    /** Gets the height of his view when last drawn. */
    private _lastDrawHeight: number = 0;

    /** The current data view draw plan. */
    private _drawPlan: DataViewDrawPlan | null = null;
    
    /**
     * Creates a new instance of the TimelineDataView class.
     * @param dataSet The timeline dataset model.
     */
    public constructor(dataSet: TimelineDataSet) {
        this._dataSet = dataSet;
    }

    /**
     * Scroll the y offset of the view by the specified amount. 
     * @param movementY The y offset amount.
     */
    public scrollByYMovement(movementY: number): void {
        // this._scrollYOffset = clamp(this._scrollYOffset + movementY, 0, 100 /** TODO This needs to be based on available height and height of all items. */);
        this._scrollYOffset += movementY;
    }

    /**
     * Draw the timeline data view onto the canvas.
     * @param context The canvas 2D context.
     * @param range The timeline range view.
     * @param yPosition The y position from where to start drawing the view.
     * @param maxHeight The max height that we can draw the data view before it must start scrolling.
     * @param fillVertically Whether the timeline data view should fill the vertical space available to it.
     */
    public draw(context: CanvasRenderingContext2D, range: TimelineRangeView, yPosition: number, maxHeight: number, fillVertically: boolean): number {
        // We should create our plan for drawing the groups and items of the view. This will also give us exactly how much space would be required to do so.
        this._drawPlan = this._createViewDrawPlan(context, range.fromDt, range.toDt);

        // We should clamp our scroll offset to the allowed values now that we know the height required to render all groups.
        this._scrollYOffset = clamp(this._scrollYOffset, Math.min(0, maxHeight - this._drawPlan.height), 0);

        // Calculate the height of this rendered view, this may be less than the max height.
        // If fillVertically is true then we should always use the max height.
        this._lastDrawHeight = fillVertically ? maxHeight : Math.min(this._drawPlan.height, maxHeight);

        // Clear the data view area.
        context.clearRect(0, yPosition, context.canvas.width, this._lastDrawHeight);

        // TODO Draw minor unit tick bars IF configured.
        this._drawMinorUnitBars(context, range.minorTicks, yPosition, this._lastDrawHeight);

        // Draw our groups and items!
        this._drawGroups(context, yPosition, maxHeight);

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
    public getItemAtPoint(point: { x: number; y: number; }): TimelineItem | null {
        // There is nothing to do if we have no draw plan.
        if (!this._drawPlan) {
            return null;
        }

        // Do not get items for points that overflow the vertical constraints of the data view.
        if (point.y < this._lastDrawYPosition || point.y > (this._lastDrawYPosition + this._lastDrawHeight)) {
            return null;
        }

        // Iterate over each group and each item in the group to see if the point is within the bounds of the item.
        for (const groupDrawPlan of this._drawPlan.groupDrawPlans) {
            for (const itemDrawPlan of groupDrawPlan.rows.flat()) {
                if (point.x >= itemDrawPlan.xPositionStart && point.x <= itemDrawPlan.xPositionEnd 
                    && point.y >= (itemDrawPlan.yPositionStart + this._scrollYOffset + this._lastDrawYPosition) && point.y <= (itemDrawPlan.yPositionEnd + this._scrollYOffset + this._lastDrawYPosition)) {
                    return itemDrawPlan.item;
                }
            }
        }

        // We did not find an item at the specified point.
        return null;
    }

    /**
     * Draw a vertical bar for every minor unit tick.
     * @param context
     * @param rangeMinorTicks 
     * @param height 
     */
    private _drawMinorUnitBars(context: CanvasRenderingContext2D, rangeMinorTicks: RangeTick[], yPosition: number, height: number): void {
        context.lineWidth = 1;
        context.strokeStyle = "#c2c2c2";
        context.setLineDash([3, 3]); /* dashes are 5px and spaces are 3px */
        context.beginPath();

        for (const { xPosition } of rangeMinorTicks) {
            // We should only render a unit bar if its not right at the edge of the canvas as it looks a little weird.
            if (xPosition > 0 && xPosition < context.canvas.width) {
                context.moveTo(xPosition, yPosition);
                context.lineTo(xPosition, yPosition + height);
            }
        }

        // Reset the line dash to be solid.
        context.stroke();
        context.setLineDash([]);
    }

    /**
     * Draw the groups and items based on the view draw plan.
     * @param context The canvas context.
     * @param yPosition The y position of the top of the view.
     * @param maxHeight The max height that this view can take on the canvas.
     */
    private _drawGroups(context: CanvasRenderingContext2D, yPosition: number, maxHeight: number): void {
        if (!this._drawPlan) {
            return;
        }

        const scrolledYPosition = yPosition + this._scrollYOffset;

        // Draw each group.
        for (let groupDrawPlanIndex = 0; groupDrawPlanIndex < this._drawPlan.groupDrawPlans.length; groupDrawPlanIndex++) {
            const groupDrawPlan = this._drawPlan.groupDrawPlans[groupDrawPlanIndex];

            // If this is not our first group then we should draw a group separator line.
            if (groupDrawPlanIndex > 0) {
                context.lineWidth = 0.5;
                context.strokeStyle = "#595959";
                context.beginPath();
                context.moveTo(0, scrolledYPosition + groupDrawPlan.yPositionStart - 1);
                context.lineTo(context.canvas.clientWidth, scrolledYPosition + groupDrawPlan.yPositionStart - 1);
                context.stroke();
            }

            // Draw the group label if we have one.
            if (groupDrawPlan.label) {
                context.textBaseline = "top";
                context.fillStyle = "#595959";
                context.beginPath();
                context.fillText(groupDrawPlan.label, 6, scrolledYPosition + groupDrawPlan.yPositionStart + DEFAULT_GROUP_VERTICAL_LABEL_MARGIN);
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
    }

    /**
     * Draw a single group item.
     * @param itemDrawPlan The item draw plan.
     * @param context The canvas context.
     * @param scrolledYPosition The y position of the top of the view, taking into account the current scroll offset.
     */
    private _drawGroupItem(itemDrawPlan: DataViewItemDrawPlan, context: CanvasRenderingContext2D, scrolledYPosition: number) {
        // Get the item and the item category (if it is associated with a category).
        const item = itemDrawPlan.item;
        const itemCategory = item.category ? this._dataSet.getCategory(item.category) : null;

        // Get the item styles.
        const itemPadding = item.style.padding!;
        const itemBorderRadius = item.style.borderRadius!;
        const itemBorderThickness = item.style.borderThickness;
        let itemBackgroundColor = item.style.backgroundColor!;
        let itemFontColor = item.style.fontColor!;
        let itemBorderColor = item.style.borderColor;

        // If the item is too small to be rendered then we should just skip it to improve performance.
        if ((itemDrawPlan.xPositionEnd - itemDrawPlan.xPositionStart) < 1) {
            return;
        }

        // If a category is being focused, but this item doesn't belong to that category, then render it with the unfocused item background and font colour. 
        // TODO This should eventually just use a lighter version of item.style.backgroundColor! based on the result of some function.
        if (this._dataSet.focusedCategory && !itemCategory?.isFocused) {
            itemBackgroundColor = UNFOCUSED_ITEM_BACKGROUND_COLOUR;
            itemBorderColor = UNFOCUSED_ITEM_BACKGROUND_COLOUR;
            itemFontColor = UNFOCUSED_ITEM_FONT_COLOUR;
        }

        // If the item is selected then we should rendering an underlying selection indicator rectangle.
        // TODO Improve the way we render the selected item, this is a bit hacky.
        if (item.isSelected) {
            context.shadowColor = "rgba(0, 0, 0, 1)";
            context.shadowBlur = 15;
            context.shadowOffsetX = 0;
            context.shadowOffsetY = 0;

            context.fillStyle = "rgba(0, 0, 0, 1)";
            context.beginPath();
            context.roundRect(itemDrawPlan.xPositionStart, scrolledYPosition + itemDrawPlan.yPositionStart, itemDrawPlan.xPositionEnd - itemDrawPlan.xPositionStart, itemDrawPlan.yPositionEnd - itemDrawPlan.yPositionStart, itemBorderRadius);
            context.fill();

            context.shadowColor = "transparent";
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

            // We need to draw a little downward triangle to join the item and the marker line.
            const itemMarkerConnectorPath = new Path2D();
            itemMarkerConnectorPath.moveTo(Math.max(itemDrawPlan.xPositionStart, itemDrawPlan.xPointInTimePosition - 20), scrolledYPosition + itemDrawPlan.yPositionStart + ((itemDrawPlan.yPositionEnd - itemDrawPlan.yPositionStart) / 2));
            itemMarkerConnectorPath.lineTo(itemDrawPlan.xPointInTimePosition, scrolledYPosition + itemDrawPlan.yPositionEnd + 6);
            itemMarkerConnectorPath.lineTo(Math.min(itemDrawPlan.xPositionEnd, itemDrawPlan.xPointInTimePosition + 20), scrolledYPosition + itemDrawPlan.yPositionStart + ((itemDrawPlan.yPositionEnd - itemDrawPlan.yPositionStart) / 2));
            context.fill(itemMarkerConnectorPath);

            // Draw the actual marker line.
            context.beginPath();
            context.moveTo(itemDrawPlan.xPointInTimePosition, scrolledYPosition + itemDrawPlan.yPositionStart + ((itemDrawPlan.yPositionEnd - itemDrawPlan.yPositionStart) / 2));
            // TODO Work out the height of the view and use that to draw the line to the bottom of the view instead of using a dumb value of 10000.
            context.lineTo(itemDrawPlan.xPointInTimePosition, 10000);
            context.stroke();
        }

        // Draw the item range rectangle.
        context.fillStyle = itemBackgroundColor;
        context.beginPath();
        context.roundRect(itemDrawPlan.xPositionStart, scrolledYPosition + itemDrawPlan.yPositionStart, itemDrawPlan.xPositionEnd - itemDrawPlan.xPositionStart, itemDrawPlan.yPositionEnd - itemDrawPlan.yPositionStart, itemBorderRadius);
        context.fill();

        // Draw the item border if a border thickness and border color are configured.
        if (itemBorderThickness && itemBorderColor) {
            context.strokeStyle = itemBorderColor;
            context.lineWidth = itemBorderThickness;
            context.beginPath();
            context.roundRect(itemDrawPlan.xPositionStart + (context.lineWidth / 2), scrolledYPosition + itemDrawPlan.yPositionStart + (context.lineWidth / 2), itemDrawPlan.xPositionEnd - itemDrawPlan.xPositionStart - context.lineWidth, itemDrawPlan.yPositionEnd - itemDrawPlan.yPositionStart - +context.lineWidth, itemBorderRadius);
            context.stroke();
        }

        // Draw the item label (if there is one).
        if (item.label) {
            // Calculate the actual x position of the label, we should attempt to keep this in the bounds of the view.
            const labelStartPositionX = Math.floor(Math.max(itemPadding, itemDrawPlan.xPositionStart + itemPadding));

            // Calculate the max item label width.
            const maxLabelWidth = Math.max(0, Math.ceil((itemDrawPlan.xPositionEnd - itemPadding) - labelStartPositionX));

            // Render the text label, but only if we have enough space to do so.
            if (maxLabelWidth > MINIMUM_RENDERED_LABEL_WIDTH) {
                context.textBaseline = "middle";
                context.fillStyle = itemFontColor;
      
                // Draw the item label, but clip it if there is not enough available horizontal space to do so.
                drawClippedText(
                    context, 
                    item.label, 
                    labelStartPositionX,
                    (itemDrawPlan.yPositionStart + ((itemDrawPlan.yPositionEnd - itemDrawPlan.yPositionStart) / 2) + 1) + scrolledYPosition,
                    maxLabelWidth
                );
            }
        }
    }

    /**
     * Create a draw plan for the view.
     * @param context The canvas context
     * @param rangeFromDt The range from date.
     * @param rangeToDt The range to date.
     * @returns A draw plan for the view.
     */
    private _createViewDrawPlan(context: CanvasRenderingContext2D, rangeFromDt: Date, rangeToDt: Date): DataViewDrawPlan {
        // Create an array to store all of our group draw plans.
        const groupDrawPlans: DataViewGroupDrawPlan[] = [];

        // Calculate the width of one millisecond as it would be rendered on the canvas.
        const milliRenderWidth = context.canvas.clientWidth / (rangeToDt.getTime() - rangeFromDt.getTime());

        // Work out all item stacks first. We aren't calculating any y positions or heights here we can do that after.
        for (const grouping of this._dataSet.groupings) {
            // Get all items in the current visible range.
            const itemsInRange = grouping.getItemsInRange(rangeFromDt, rangeToDt);

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
                    startPositionX = milliRenderWidth * (item.start.getTime() - rangeFromDt.getTime());
                    endPositionX = milliRenderWidth * (item.end.getTime() - rangeFromDt.getTime());
                } else {
                    // This is a PIT item, the start and end positions of our x axis will be derived from the width of the label and the start date.
                    // TODO Determine what to do when we have PIT item with no label.
                    // TODO Set the context font to be whatever we will be using to render the actual item label.
                    const itemLabelWidth = context.measureText(item.label ?? "?").width + (item.style.padding! * 2);

                    // Let's set the start and end x position to be equidistant from the actual point in time that this item is for.
                    startPositionX = (milliRenderWidth * (item.start.getTime() - rangeFromDt.getTime())) - (itemLabelWidth / 2);
                    endPositionX = startPositionX + itemLabelWidth;

                    // The point in time position should always be the start date regardless of the position or width of the PIT item box.
                    pointInTimePositionX = (milliRenderWidth * (item.start.getTime() - rangeFromDt.getTime()));

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
                    if (rowStack.length === 0 || rowStack[rowStack.length - 1].xPositionEnd < itemDrawPlan.xPositionStart) {
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
                positionY += (groupLabelMetrics.actualBoundingBoxAscent + groupLabelMetrics.actualBoundingBoxDescent);

                // Add a smidge of vertical padding for below and above the label.
                positionY += (2 * DEFAULT_GROUP_VERTICAL_LABEL_MARGIN);
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
                    const itemHeight = (actualBoundingBoxAscent + actualBoundingBoxDescent) + (itemDrawPlan.item.style.padding! * 2);

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
}