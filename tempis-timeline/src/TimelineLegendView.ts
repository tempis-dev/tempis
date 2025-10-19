import { TempisTimelineLegendOptions, TempisTimelineLegendPosition } from "./TempisTimelineOptions";

export class TimelineLegendView {
    /** The timeline canvas. */
    private readonly _canvas: HTMLCanvasElement;

    /** The timeline legend options. */
    private readonly _options: TempisTimelineLegendOptions;

    /**
     * Creates a new instance of the TimelineLegendView class.
     * @param canvas The timeline canvas.
     * @param options The timeline legend options.
     */
    public constructor(canvas: HTMLCanvasElement, options: TempisTimelineLegendOptions = {}) {
        this._canvas = canvas;
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
    }
}