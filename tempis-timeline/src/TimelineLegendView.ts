import { TempisTimelineLegendOptions, TempisTimelineLegendPosition } from "./TempisTimelineOptions";
import { TimelineDataSet } from "./TimelineDataSet";

export class TimelineLegendView {
    /** The timeline canvas. */
    private readonly _canvas: HTMLCanvasElement;

    /** The underlying dataset model. */
    private readonly _dataSet: TimelineDataSet;

    /** The timeline legend options. */
    private readonly _options: TempisTimelineLegendOptions;

    /**
     * Creates a new instance of the TimelineLegendView class.
     * @param canvas The timeline canvas.
     * @param dataSet The timeline dataset model.
     * @param options The timeline legend options.
     */
    public constructor(canvas: HTMLCanvasElement, dataSet: TimelineDataSet, options: TempisTimelineLegendOptions = {}) {
        this._canvas = canvas;
        this._dataSet = dataSet;
        this._options = options;
    }

    /**
     * Gets the position option value.
     */
    public get position(): TempisTimelineLegendPosition {
        return this._options.position ?? "bottom";
    }

    /**
     * Calculate the height of this view when rendered.
     * @returns The height of this view when rendered.
     */
    public calculateRequiredHeight(): number {
        // Grab the canvas context.
        var context = this._canvas.getContext('2d')!;

        // TODO Return the correct value here.
        return 50;
    }

    /**
     * Draw the timeline legend onto the canvas.
     * @param context The canvas 2D context.
     * @param yPosition The y position to draw the legend at.
     */
    public draw(context: CanvasRenderingContext2D, yPosition: number): void {
        // Figure out our legend view dimensions.
        const legendContainerHeight = this.calculateRequiredHeight();

        // Clear the legend view area.
        context.clearRect(0, yPosition, context.canvas.clientWidth, legendContainerHeight);

        // TODO Draw a test rectangle at the view position.
        context.fillStyle = "#595959";
        context.beginPath();
        context.roundRect(0, yPosition, context.canvas.clientWidth, legendContainerHeight);
        context.fill();

        // TODO Draw the categories.
        context.fillStyle = "#ffffff";
        context.textBaseline = "top";
        context.fillText(this._dataSet.categories.map((category) => category.name).join(" - "), 6, yPosition + 6);
    }
}