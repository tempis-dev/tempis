import { TimelineDataSet } from "./TimelineDataSet";
import { RangeTick, TimelineRangeView } from "./TimelineRangeView";

/** The default item background colour. */
const DEFAULT_ITEM_BACKGROUND_COLOUR: string = "#2c318f";

export class TimelineDataView {
    /** The minimum height of the data view. */
    private static _minimumHeight: number = 50;
    
    public constructor() {}

    public scrollByYMovement(movementY: number): void {
        // TODO Do the scrolling baby!
    }

    /**
     * Draw the timeline data view onto the canvas.
     * @param context The canvas 2D context.
     * @param maxHeight The max height that we can draw the data view before it must start scrolling.
     */
    public draw(context: CanvasRenderingContext2D, dataSet: TimelineDataSet, range: TimelineRangeView): void {
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
        this._drawGroups(context, dataSet, range, height);
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

    private _drawGroups(context: CanvasRenderingContext2D, dataSet: TimelineDataSet, range: TimelineRangeView, height: number): void {
        // TODO Work this out sensibly!
        const scrollYOffset = 0;

        // Calculate the width of one millisecond as it would be rendered on the canvas.
        const milliRenderWidth = context.canvas.width / (range.toDt.getTime() - range.fromDt.getTime());

        for (const grouping of dataSet.groupings) {
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
                context.fillText(grouping.group, 4, scrollYOffset + 16);
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
                    context.roundRect(startPositionX, scrollYOffset + 40, endPositionX - startPositionX, 30, 5);
                    context.fill();

                    // Draw the item label (if there is one)
                    if (item.caption) {
                        context.font = "14px Arial";
                        context.fillStyle = "#FFFFFF";
                        context.beginPath();
                        context.fillText(item.caption, startPositionX + 4, scrollYOffset + 60);
                        context.stroke();
                    }
                } else {

                }
            }
        }
    }
}