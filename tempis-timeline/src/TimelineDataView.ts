import { TimelineItemGrouping } from "./TimelineItemGrouping";
import { TimelineRange } from "./TimelineRange";

export class TimelineDataView {
    /** The minimum height of the data view. */
    private static _minimumHeight: number = 50;
    
    /** The timeline item groupings. */
    private _itemGroupings: TimelineItemGrouping[] = [];

    public constructor() {}

    public setGroupings(groupings: TimelineItemGrouping[]): void {
        this._itemGroupings = groupings;
    }

    /**
     * Draw the timeline data view onto the canvas.
     * @param context The canvas 2D context.
     * @param maxHeight The max height that we can draw the data view before it must start scrolling.
     */
    public draw(context: CanvasRenderingContext2D, range: TimelineRange): void {
        // TODO We shouldn't render a groups box to the left! We should split the view above the range bar and have the group label ON the group and have it sticky to the top.

        // TODO We need to calculate how much height this data view is ACTUALLY going to use before we use it

        // Find the max height that we can render the data view before we need to have it scroll.
        // This is determined by how much vertical space is taken up by the range bar.
        // TODO This will eventually have to cope with the position of the range changing or the number of them (top and bottom range)
        const maxDataViewHeight = context.canvas.height - range.calculateRequiredHeight();

        // Calculate the width of one millisecond as it would be rendered on the canvas.
        const milliRenderWidth = context.canvas.width / (range.toDt.getTime() - range.fromDt.getTime());

        // Draw a grey background for the entire dataview.
        context.fillStyle = "#F1F0F0";
        context.fillRect(0, 0, context.canvas.width, maxDataViewHeight);


    }
}