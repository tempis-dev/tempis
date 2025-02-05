import { TimelineDataSet } from "./TimelineDataSet";
import { TimelineItem } from "./TimelineItem";
import { RangeTick, TimelineRangeView } from "./TimelineRangeView";
import { clamp } from "./Utilities";

/** The default item background colour. */
const DEFAULT_ITEM_BACKGROUND_COLOUR: string = "#2c318f";

export interface DataViewDrawPlan {
    /** The height that is required to draw all groups and items within the specified date range. */
    height: number;

    /** The range from date used when making the plan. */
    fromDt: Date;

    /** The range to date used when making the plan. */
    toDt: Date;

    /** The group draw plans. */
    groupDrawPlans: DataViewGroupDrawPlan[];
}

export interface DataViewGroupDrawPlan {
    /** The group label. */
    label: string;

    /** The stacks of all visible items in this group that need to be rendered. */
    stacks: DataViewItemDrawPlan[][];

    // TODO Figure out of if need this.
    yPositionStart: number;

    // TODO Figure out of if need this.
    yPositionEnd: number;
}

export interface DataViewItemDrawPlan {
    /** The item. */
    item: TimelineItem;

    /** The height that is required to draw this item. */
    height: number;

    /** The item font. */
    font: string;

    /** The item foreground colour. */
    colour: string;

    backgroundColour: string;

    xPositionStart: number;

    xPositionEnd: number;

    // TODO Figure out of if need this.
    yPositionStart: number;

    // TODO Figure out of if need this.
    yPositionEnd: number;
}

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
     * @param maxHeight The max height that we can draw the data view before it must start scrolling.
     */
    public draw(context: CanvasRenderingContext2D, range: TimelineRangeView): void {
        // TODO We shouldn't render a groups box to the left! We should split the view above the range bar and have the group label ON the group and have it sticky to the top.

        // TODO We need to calculate how much height this data view is ACTUALLY going to use before we use it

        // Find the max height that we can render the data view before we need to have it scroll.
        // This is determined by how much vertical space is taken up by the range bar.
        // TODO This will eventually have to cope with the position of the range changing or the number of them (top and bottom range)
        const height = context.canvas.height - range.calculateRequiredHeight();

        // Draw a grey background for the entire dataview.
        context.fillStyle = "#f5f5f5";
        context.fillRect(0, 0, context.canvas.width, height);

        // TODO Draw minor unit tick bars IF configured.
        this._drawMinorUnitBars(context, range.minorTicks, height);

        // Draw our groups and items!
        this._drawGroups(context, range, height);
    }

    /**
     * Draw a vertical bar for every minor unit tick.
     * @param context
     * @param rangeMinorTicks 
     * @param height 
     */
    private _drawMinorUnitBars(context: CanvasRenderingContext2D, rangeMinorTicks: RangeTick[], height: number): void {
        context.lineWidth = 1;
        context.strokeStyle = "#c2c2c2";
        context.setLineDash([3, 3]); /* dashes are 5px and spaces are 3px */
        context.beginPath();

        for (const { xPosition } of rangeMinorTicks) {
            context.moveTo(xPosition, 0);
            context.lineTo(xPosition, height);
        }

        context.stroke();
        context.setLineDash([]);
    }

    private _drawGroups(context: CanvasRenderingContext2D, range: TimelineRangeView, height: number): void {
        // Calculate the width of one millisecond as it would be rendered on the canvas.
        const milliRenderWidth = context.canvas.width / (range.toDt.getTime() - range.fromDt.getTime());

        for (const grouping of this._dataSet.groupings) {
            // Get all items in the current visible range.
            const itemsInRange = grouping.getItemsInRange(range.fromDt, range.toDt);

            // If there are no items in this group that are within the current range view then we should just skip this group.
            if (!itemsInRange.length) {
                continue;
            }

            // Draw the group label if we have one.
            if (grouping.group) {
                context.font = "14px Arial";
                context.fillStyle = "#595959";
                context.beginPath();
                context.fillText(grouping.group, 4, this._scrollYOffset + 16);
                context.stroke();
            }

            for (const item of itemsInRange) {
                // Determine the x position of the start of this item.
                const startPositionX = milliRenderWidth * (item.start.getTime() - range.fromDt.getTime());

                // Is this a range item or a PIT item?
                if (item.end) {
                    // Determine the x position of the end of this item.
                    const endPositionX = milliRenderWidth * (item.end.getTime() - range.fromDt.getTime());

                    // Draw the item range rectangle.
                    context.fillStyle = DEFAULT_ITEM_BACKGROUND_COLOUR;
                    context.beginPath();
                    context.roundRect(startPositionX, this._scrollYOffset + 40, endPositionX - startPositionX, 30, 5);
                    context.fill();

                    // Draw the item label (if there is one)
                    if (item.caption) {
                        context.font = "14px Arial";
                        context.fillStyle = "#FFFFFF";
                        context.beginPath();
                        context.fillText(item.caption, startPositionX + 8, this._scrollYOffset + 60);
                        context.stroke();
                    }
                } else {

                }
            }
        }
    }

    private _createViewDrawPlan(context: CanvasRenderingContext2D, rangeFromDt: Date, rangeToDt: Date): DataViewDrawPlan {
        // Create an array to store all of our group draw plans.
        const groupDrawPlans: DataViewGroupDrawPlan[] = [];

        //  Work out all item stacks first. We aren't calculating any y positions of heights here we can do that after.
        for (const grouping of this._dataSet.groupings) {
            // Get all items in the current visible range.
            const itemsInRange = grouping.getItemsInRange(rangeFromDt, rangeToDt);

            // If there are no items in this group that are within the current range view then we should just skip this group.
            if (!itemsInRange.length) {
                continue;
            }

            const itemDrawPlanStacks: DataViewItemDrawPlan[][] = [];

            // TODO Create our item draw plan stacks!
            for (const item of itemsInRange) {
               
            }

            // Add the group draw plan to the array.
            groupDrawPlans.push({
                label: grouping.group,
                stacks: itemDrawPlanStacks
            } as any);
        }

        // The view content height that will be updated as groups and item stacks are worked out.
        let viewContentHeight = 0;

        // TODO Now that we have all our groups and item stacks we can calculate the height that these things will take up and set the y positions on things.

        return {
            height: viewContentHeight,
            groupDrawPlans
        } as any;
    }
}