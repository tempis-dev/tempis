import { TempisTimelineOptions } from "./TempisTimelineOptions";
import { TimelineDataSet } from "./TimelineDataSet";
import { TimelineDataView } from "./TimelineDataView";
import { TimelineFont } from "./TimelineFont";
import { TimelineRangeView } from "./TimelineRangeView";

export class TempisTimeline {
    /** The timeline canvas. */
    private readonly _canvas: HTMLCanvasElement;

    /** The timeline options. */
    private readonly _options: TempisTimelineOptions;

    /** The timeline dataset. */
    private readonly _dataSet: TimelineDataSet;
    
    /** The timeline range. */
    private readonly _rangeView: TimelineRangeView;

    /** The timeline data view. */
    private readonly _dataView: TimelineDataView;

    /** The default timeline font. */
    private readonly _font: TimelineFont;

    /** The canvas container resize observer. */
    private _canvasContainerResizeObserver: ResizeObserver | null = null;

    /**
     * Creates a new instance of the TempisTimeline class.
     * @param context The canvas context.
     * @param options The timeline options.
     */
    public constructor(context: string | HTMLCanvasElement, options: TempisTimelineOptions) {
        this._options = options;

        this._canvas = this._getCanvas(context);
        this._rangeView = new TimelineRangeView(this._canvas, this._options.range);
        this._dataSet = new TimelineDataSet(() => this._onDataSetChange());
        this._dataView = new TimelineDataView(this._dataSet);
        this._font = new TimelineFont(this._options.style?.font);

        // Populate our dataset with the initial item configuration.
        this._dataSet.update(this._options);

        // Do our initial canvas resize.
        this._resizeCanvas();

        // We should set up a resize observer to keep our canvas dimensions inline with that of its parent element if the timeline is responsive.
        if (options.responsive !== false) {
           this._createCanvasContainerResizeObserver();
        }

        // Create the canvas event handlers.
        this._createCanvasEventHandlers();

        // Do our initial draw.
        this._draw();
    }

    /**
     * Gets a reference to the canvas based on the specified context.
     * @param context The context.
     * @returns A reference to the canvas based on the specified context.
     */
    private _getCanvas(context: string | HTMLCanvasElement): HTMLCanvasElement {
        if (!context) {
            throw new Error(`no canvas defined`);
        } else if (context instanceof HTMLCanvasElement) {
            return context;
        } else if (typeof context === "string") {
            // The context value is a string, so we can assume that it is a selector for our canvas element.
            const targetElement = document.querySelector(context);

            if (!targetElement || !(targetElement instanceof HTMLCanvasElement)) {
                throw new Error(`no HTMLCanvasElement element matching selector ${context}`);
            }

            return targetElement;
        }

        throw new Error("whatcha doing this isn't a valid value!") 
    }

    /**
     * Creates the canvas container resize observer.
     */
    private _createCanvasContainerResizeObserver() {
        // Get the canvas parent element.
        const canvasContainerElement = this._canvas.parentElement;

        // The canvas element may be detached.
        if (!canvasContainerElement) {
            throw new Error("Cannot resize canvas as it has no parent element, is it detached?");
        }

        // Create our resize observer which will resize our canvas to match the new dimensions of the canvas parent container and then redraw.
        this._canvasContainerResizeObserver = new ResizeObserver(() => {
            this._resizeCanvas();
            this._draw();
        });

        this._canvasContainerResizeObserver.observe(canvasContainerElement);
    }

    /**
     * Creates the canvas event handlers.
     */
    private _createCanvasEventHandlers() {
        // Gets the position on the canvas for the mouse event.
        const getMousePos = (evt: MouseEvent) => {
            var rect = this._canvas.getBoundingClientRect();
            return {
                x: (evt.clientX - rect.left) / (rect.right - rect.left) * this._canvas.clientWidth,
                y: (evt.clientY - rect.top) / (rect.bottom - rect.top) * this._canvas.clientHeight
            };
        }

        // The mouse wheel should zoom the data range (for now)
        this._canvas.addEventListener("wheel", (evt) => {
            this._rangeView.zoomRange(evt.deltaY);
            this._draw();
        });

        let isMouseDown = false;

        this._canvas.addEventListener('mousedown', (evt) => {
            isMouseDown = true;
        }, false);

        this._canvas.addEventListener('mouseup', (evt) => {
            isMouseDown = false;
        }, false);

        this._canvas.addEventListener('mouseleave', (evt) => {
            isMouseDown = false;
        }, false);

        this._canvas.addEventListener('mousemove', (evt) => {
            // We only care about this event if the user is holding the mouse button down.
            if (isMouseDown) {
                // Use movementX for range scrolling.
                if (Math.abs(evt.movementX) >= 1) {
                    this._rangeView.moveByXMovement(-evt.movementX);
                }

                // Use movementY for data view scrolling.
                if (Math.abs(evt.movementY) >= 1) {
                    this._dataView.scrollByYMovement(evt.movementY);
                }

                // Our view may have changed, let's redraw.
                this._draw();
            }
        }, false);

        // Handle any click events for data view items.
        this._canvas.addEventListener('click', (evt) => {
            const clickedItem = this._dataView.getItemAtPoint(getMousePos(evt));
            if (clickedItem) {
                console.log(`clicked item ${clickedItem.caption}`);
            }
        }, false);

        // Handle any double click events for data view items.
        this._canvas.addEventListener('dblclick', (evt) => {
            const clickedItem = this._dataView.getItemAtPoint(getMousePos(evt));
            if (clickedItem) {
                console.log(`double clicked item ${clickedItem.caption}`);
            }
        }, false);
    }

    /**
     * Resize the canvas to match the size of its parent element if the timeline is configured to be responsive.
     */
    private _resizeCanvas(): void {
        // We should not resize the canvas if the timeline has not been configured to be responsive. 
        if (this._options.responsive === false) {
            return;
        }

        // Get the canvas parent element.
        const canvasContainerElement = this._canvas.parentElement;

        // The canvas element may be detached.
        if (!canvasContainerElement) {
            throw new Error("Cannot resize canvas as it has no parent element, is it detached?");
        }

        // Get the canvas context.
        const canvasContext = this._canvas.getContext("2d")!;

        // Set actual display size of the canvas (css pixels).
        this._canvas.style.width = canvasContainerElement.getBoundingClientRect().width + "px";
        this._canvas.style.height = canvasContainerElement.getBoundingClientRect().height + "px";

        const dpr = window.devicePixelRatio || 1; 

        // Set the "physical" size of the canvas, this is the number of pixels that the canvas has.
        this._canvas.width = this._canvas.offsetWidth * dpr;
        this._canvas.height = this._canvas.offsetHeight * dpr;

        // Scale the drawing context to account for the increased pixel density.
        canvasContext.scale(dpr, dpr);

        // Now that the canvas has resized we will need to recalculate the ticks for our range.
        this._rangeView.calculateMinorAndMajorUnitTicks();
    }

    /**
     * Called whenever the state of the timeline dataset changes.
     */
    private _onDataSetChange(): void {
        // Update the timeline range to reflect the min and max date of the dataset (if they are defined)
        if (this._dataSet.minDate && this._dataSet.maxDate) {
            this._rangeView.setRange(this._dataSet.minDate, this._dataSet.maxDate);
        } else {
            this._rangeView.clearRange();
        }
    }

    /**
     * Draw the timeline.
     */
    private _draw(): void {
        // Grab the canvas context.
        var context = this._canvas.getContext('2d')!;

        // Clear the canvas before doing a fresh draw.
        context.clearRect(0, 0, this._canvas.clientWidth, this._canvas.clientHeight);

        // Apply the default font to the canvas context.
        context.font = this._font.font;

        // Calculate how much height the range view will take up when drawn.
        const rangeViewHeight = this._rangeView.calculateRequiredHeight();

        // Find the max height that we can render the data view before we need to have it scroll.
        // This is determined by how much vertical space is taken up by the range bar(s).
        // TODO This will eventually have to take the legend height into account.
        const dataViewYPosition = ["top", "both"].includes(this._rangeView.position) ? rangeViewHeight : 0;
        const dataViewMaxHeight = this._canvas.clientHeight - dataViewYPosition - (["bottom", "both"].includes(this._rangeView.position) ? rangeViewHeight : 0);

        // Draw the data view and get the height of it.
        const dataViewHeight = this._dataView.draw(context, this._rangeView, dataViewYPosition, dataViewMaxHeight);

        // Keep track of how much height we have taken up when rendering all timeline elements.
        let totalRenderHeight = dataViewHeight;

        // Are we rendering a top range bar?
        if (["top", "both"].includes(this._rangeView.position)) {
            this._rangeView.draw(context, 0 , "top");
            totalRenderHeight += rangeViewHeight;
        }

        // Are we rendering a bottom range bar?
        if (["bottom", "both"].includes(this._rangeView.position)) {
            this._rangeView.draw(context, dataViewYPosition + dataViewHeight, "bottom");
            totalRenderHeight += rangeViewHeight;
        }

        // TODO Need to draw color grouping legend if using groups and colours.

        // Clear the canvas from below the bottom of the bottom range view or bottom of the timeline or the bottom of the legend. 
        context.clearRect(0, totalRenderHeight, this._canvas.clientWidth, this._canvas.clientHeight - totalRenderHeight);
    }
}