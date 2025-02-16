import { TimelineDataSet } from "./TimelineDataSet";
import { TimelineItem } from "./TimelineItem";
import { RangeTick, TimelineRangeView } from "./TimelineRangeView";
import { clamp, fitCanvasText } from "./Utilities";

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

    // TODO Figure out of if need this.
    yPositionStart: number;

    // TODO Figure out of if need this.
    yPositionEnd: number;
}

export interface DataViewItemDrawPlan {
    /** The item. */
    item: TimelineItem;

    /** The item font. */
    font?: string;

    /** The item foreground colour. */
    colour?: string;

    /** The item background colour. */
    backgroundColour?: string;

    /** The height that is required to draw this item. */
    height: number;

    xPointInTimePosition: number | null;

    xPositionStart: number;

    xPositionEnd: number;

    // TODO Figure out of if need this.
    yPositionStart: number;

    // TODO Figure out of if need this.
    yPositionEnd: number;
}

/** The default item background colour. */
const DEFAULT_ITEM_BACKGROUND_COLOUR: string = "#2c318f";

/** The default item foreground colour. */
const DEFAULT_ITEM_FOREGROUND_COLOUR: string = "#ffffff";

/** The default amount of vertical margin to use for group labels. */
const DEFAULT_GROUP_VERTICAL_LABEL_MARGIN: number = 6;

/** The default amount of vertical margin to use for items. */
const DEFAULT_ITEM_VERTICAL_MARGIN: number = 8;

/** The default amount of vertical margin to use for each group. */
const DEFAULT_GROUP_MARGIN: number = 12;

/** The default amount of padding to use for items. */
const DEFAULT_ITEM_PADDING: number = 12;

export class TimelineDataView {
    /** The minimum height of the data view. */
    private static _minimumHeight: number = 50;

    /** The underlying dataset model. */
    private readonly _dataSet: TimelineDataSet;

    /** The current scroll Y offset. */
    private _scrollYOffset: number = 0;
    
    /**
     * Creates anew instance of the TimelineDataView class.
     * @param dataSet The underlying dataset model.
     */
    public constructor(dataSet: TimelineDataSet) {
        this._dataSet = dataSet;
    }

    /**
     * Scroll the y offset of the view by the specified amount. 
     * @param movementY The y offset amount.
     */
    public scrollByYMovement(movementY: number): void {
        this._scrollYOffset = clamp(this._scrollYOffset + movementY, 0, 100 /** TODO This needs to be based on available height and height of all items. */);
    }

    /**
     * Draw the timeline data view onto the canvas.
     * @param context The canvas 2D context.
     * @param range The timeline range view.
     * @param yPosition The y position from where to start drawing the view.
     * @param maxHeight The max height that we can draw the data view before it must start scrolling.
     */
    public draw(context: CanvasRenderingContext2D, range: TimelineRangeView, yPosition: number, maxHeight: number): number {
        // We should create our plan for drawing the groups and items of the view. This will also give us exactly how much space would be required to do so.
        const drawPlan = this._createViewDrawPlan(context, range.fromDt, range.toDt);

        // Calculate the height of this rendered view, this may be less than the max height.
        const viewHeight = Math.min(drawPlan.height, maxHeight);

        // Draw a white background for the entire dataview.
        context.fillStyle = "#FFFFFF";
        context.fillRect(0, yPosition, context.canvas.width, viewHeight);

        // TODO Draw minor unit tick bars IF configured.
        this._drawMinorUnitBars(context, range.minorTicks, yPosition, viewHeight);

        // Draw our groups and items!
        this._drawGroups(context, drawPlan, yPosition, maxHeight);
        
        // Return the height of the rendered view.
        return viewHeight;
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

        context.stroke();
        context.setLineDash([]);
    }

    /**
     * Draw the groups and items based on the view draw plan.
     * @param context The canvas context.
     * @param drawPlan The view draw plan.
     * @param yPosition The y position of the top of the view.
     * @param maxHeight The max height that this view can take on the canvas.
     */
    private _drawGroups(context: CanvasRenderingContext2D, drawPlan: DataViewDrawPlan, yPosition: number, maxHeight: number): void {
        // Draw each group.
        for (let groupDrawPlanIndex = 0; groupDrawPlanIndex < drawPlan.groupDrawPlans.length; groupDrawPlanIndex++) {
            const groupDrawPlan = drawPlan.groupDrawPlans[groupDrawPlanIndex];

            // If this is not our first group then we should draw a group separator line.
            if (groupDrawPlanIndex > 0) {
                context.lineWidth = 0.5;
                context.strokeStyle = "#595959";
                context.beginPath();
                context.moveTo(0, this._scrollYOffset + groupDrawPlan.yPositionStart - 1);
                context.lineTo(context.canvas.width, this._scrollYOffset + groupDrawPlan.yPositionStart - 1);
                context.stroke();
            }

            // Draw the group label if we have one.
            if (groupDrawPlan.label) {
                context.textBaseline = "top";
                context.font = "14px Arial";
                context.fillStyle = "#595959";
                context.beginPath();
                context.fillText(groupDrawPlan.label, 6, this._scrollYOffset + groupDrawPlan.yPositionStart + DEFAULT_GROUP_VERTICAL_LABEL_MARGIN);
                context.stroke();
            }

            for (const row of groupDrawPlan.rows) {
                for (const itemDrawPlan of row) {
                    // If this is a PIT item we should draw the downward marker line.
                    if (itemDrawPlan.xPointInTimePosition !== null) {
                        context.lineWidth = 2;
                        context.strokeStyle = DEFAULT_ITEM_BACKGROUND_COLOUR;
                        context.fillStyle = DEFAULT_ITEM_BACKGROUND_COLOUR;

                        // We need to draw a little downward triangle to join the item and the marker line.
                        const itemMarkerConnectorPath = new Path2D();
                        itemMarkerConnectorPath.moveTo(Math.max(itemDrawPlan.xPositionStart, itemDrawPlan.xPointInTimePosition - 20), this._scrollYOffset + itemDrawPlan.yPositionStart + ((itemDrawPlan.yPositionEnd - itemDrawPlan.yPositionStart) / 2));
                        itemMarkerConnectorPath.lineTo(itemDrawPlan.xPointInTimePosition, this._scrollYOffset + itemDrawPlan.yPositionEnd + 6);
                        itemMarkerConnectorPath.lineTo(Math.min(itemDrawPlan.xPositionEnd, itemDrawPlan.xPointInTimePosition + 20), this._scrollYOffset + itemDrawPlan.yPositionStart + ((itemDrawPlan.yPositionEnd - itemDrawPlan.yPositionStart) / 2));
                        context.fill(itemMarkerConnectorPath);

                        // Draw the actual marker line.
                        context.beginPath();
                        context.moveTo(itemDrawPlan.xPointInTimePosition, this._scrollYOffset + itemDrawPlan.yPositionStart + ((itemDrawPlan.yPositionEnd - itemDrawPlan.yPositionStart) / 2));
                        context.lineTo(itemDrawPlan.xPointInTimePosition, 1000 /** TODO Work this out properly. */);
                        context.stroke();
                    } 

                    // Draw the item range rectangle.
                    context.fillStyle = DEFAULT_ITEM_BACKGROUND_COLOUR;
                    context.beginPath();
                    context.roundRect(itemDrawPlan.xPositionStart, this._scrollYOffset + itemDrawPlan.yPositionStart, itemDrawPlan.xPositionEnd - itemDrawPlan.xPositionStart, itemDrawPlan.yPositionEnd - itemDrawPlan.yPositionStart, 5);
                    context.fill();

                    // Draw the item label (if there is one)
                    if (itemDrawPlan.item.caption) {
                        // Calculate the actual x position of the label, we should attempt to keep this in the bounds of the view.
                        const labelStartPositionX = Math.max(DEFAULT_ITEM_PADDING, itemDrawPlan.xPositionStart + DEFAULT_ITEM_PADDING);

                        // Calculate the max item label width, we are adding 1 as sometime PIT label ends get cut off.
                        const maxLabelWidth = Math.max(0, (itemDrawPlan.xPositionEnd - DEFAULT_ITEM_PADDING) - labelStartPositionX) + 1;

                        context.textBaseline = "middle";
                        context.font = "14px Arial";
                        context.fillStyle = DEFAULT_ITEM_FOREGROUND_COLOUR;
                        context.beginPath();
                        context.fillText(fitCanvasText(context, itemDrawPlan.item.caption, maxLabelWidth), labelStartPositionX, (itemDrawPlan.yPositionStart + ((itemDrawPlan.yPositionEnd - itemDrawPlan.yPositionStart) / 2)) + this._scrollYOffset);
                        context.stroke();
                    }
                }
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
        const milliRenderWidth = context.canvas.width / (rangeToDt.getTime() - rangeFromDt.getTime());

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
                    // TODO Determine what to do when we have PIT item with no caption.
                    // TODO Set the context font to be whatever we will be using to render the actual item label.
                    context.font = "14px Arial";
                    const itemLabelWidth = context.measureText(item.caption ?? "?").width + (DEFAULT_ITEM_PADDING * 2);

                    // Let's set the start and end x position to be equidistant from the actual point in time that this item is for.
                    startPositionX = (milliRenderWidth * (item.start.getTime() - rangeFromDt.getTime())) - (itemLabelWidth / 2);
                    endPositionX = startPositionX + itemLabelWidth;

                    // The point in time position should always be the start date regardless of the position or width of the PIT item box.
                    pointInTimePositionX = (milliRenderWidth * (item.start.getTime() - rangeFromDt.getTime()));

                    // We may have to shift this item so that it is actually in the bounds of the range view.
                    if (startPositionX < 0) {
                        startPositionX = 0;
                        endPositionX = itemLabelWidth;
                    } else if (endPositionX > context.canvas.width) {
                        startPositionX = context.canvas.width - itemLabelWidth;
                        endPositionX = context.canvas.width;
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
                context.font = "14px Arial";
                const groupLabelMetrics = context.measureText(groupDrawPlan.label);

                // Add the vertical space required to draw the label.
                positionY += (groupLabelMetrics.actualBoundingBoxAscent + groupLabelMetrics.actualBoundingBoxDescent);

                // Add a smidge of vertical padding for below and above the label.
                positionY += (2 * DEFAULT_GROUP_VERTICAL_LABEL_MARGIN);
            }

            // We want to stick a little bit of a margin at the top of the group, but below the label
            positionY += DEFAULT_GROUP_MARGIN;

            // We should calculate the height of any items, this will be based on the height of an example label and any item padding.
            context.font = "14px Arial";
            const { actualBoundingBoxAscent, actualBoundingBoxDescent } = context.measureText("Label");
            const itemHeight = (actualBoundingBoxAscent + actualBoundingBoxDescent) + (DEFAULT_ITEM_PADDING * 2);

            // Process each row of items for the group.
            for (const itemRow of groupDrawPlan.rows) {
                // Each row gets some top padding.
                positionY += DEFAULT_ITEM_VERTICAL_MARGIN;

                // Process each item in this row.
                for (const item of itemRow) {
                    item.yPositionStart = positionY;
                    item.yPositionEnd = positionY + itemHeight;
                }

                // Add the height of the items in this row to our current y position.
                positionY += itemHeight;

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
            width: context.canvas.width,
            groupDrawPlans
        };
    }
}