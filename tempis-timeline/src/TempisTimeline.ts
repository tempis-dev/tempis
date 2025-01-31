import { TempisTimelineItem, TempisTimelineOptions } from "./TempisTimelineOptions";
import { TimelineDataView } from "./TimelineDataView";
import { TimelineItemGrouping } from "./TimelineItemGrouping";
import { TimelineRange } from "./TimelineRange";

export class TempisTimeline {
    /** The timeline canvas. */
    private readonly _canvas: HTMLCanvasElement;

    /** The timeline options. */
    private readonly _options: TempisTimelineOptions;
    
    /** The timeline range. */
    private readonly _range: TimelineRange;

    /** The timeline data view. */
    private readonly _dataView: TimelineDataView;

    /** The canvas container resize observer. */
    private _canvasContainerResizeObserver: ResizeObserver | null = null;

    /** The timeline item groupings. */
    private _itemGroupings: TimelineItemGrouping[] = [];

    public constructor(context: string | HTMLCanvasElement, options: TempisTimelineOptions) {
        this._options = options;

        this._canvas = this._getCanvas(context);
        this._range = new TimelineRange(this._canvas, this._options.range);
        this._dataView = new TimelineDataView();

        // Create our initial item groupings.
        this._createItemGroupings();

        // Do our initial canvas resize.
        this._resizeCanvas();

        // Set the initial timeline range.
        this._setRange();

        // We should set up a resize observer to keep our canvas dimensions inline with that of its parent element if the timeline is responsive.
        if (options.responsive !== false) {
           this._createCanvasContainerResizeObserver();
        }

        // Create the canvas event handlers.
        this._createCanvasEventHandlers();

        // Do our initial draw.
        this._draw();
    }

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
     * Creates the timeline item groupings.
     */
    private _createItemGroupings() {
        // Clear any existing item groupings.
        this._itemGroupings = [];

        // Create a mapping of group names to item group item definitions.
        const itemGroupingMap: { [key: string]: TempisTimelineItem[] } = {};

        for (const itemDefinition of this._options.items ?? []) {
            // Our grouping key will default to just an empty string.
            const groupingKey = itemDefinition.grouping ?? "";

            // Try to get the existing grouping for this item.
            let group = itemGroupingMap[groupingKey];

            // Create a new group if there isn't one for this grouping.
            if (!group) {
                group = [];
                itemGroupingMap[groupingKey] = group;
            }

            // Add the definition for the current item to its group.
            group.push(itemDefinition);
        }

        // Create our new item groupings.
        for (const [key, value] of Object.entries(itemGroupingMap)) {
            this._itemGroupings.push(new TimelineItemGrouping(key, value));
        }

        // Update our data view.
        this._dataView.setGroupings(this._itemGroupings);
    }

    /**
     * Sets the range.
     */
    private _setRange(): void {
        // Do we have no items to use in finding a range?
        if (this._itemGroupings.length === 0 || this._itemGroupings[0].items.length === 0) {
            this._range.clear();
            return;
        }

        let minDate: Date | null = null;
        let maxDate: Date | null = null;

        for (const grouping of this._itemGroupings) {
            for (const item of grouping.items) {
                if (minDate === null || item.start.getTime() < minDate.getTime()) {
                    minDate = item.start;
                }
                if (maxDate === null || item.end.getTime() > maxDate.getTime()) {
                    maxDate = item.end;
                }
            }
        }

        this._range.setRange(minDate!, maxDate!);
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

        const getMousePos = (evt: MouseEvent) => {
            var rect = this._canvas.getBoundingClientRect();
            return {
                x: (evt.clientX - rect.left) / (rect.right - rect.left) * this._canvas.width,
                y: (evt.clientY - rect.top) / (rect.bottom - rect.top) * this._canvas.height
            };
        }

        this._canvas.addEventListener("wheel", (evt) => {
            // this._range.moveRange("minute", evt.deltaY * 0.1);
            this._range.zoomRange(evt.deltaY);
            this._draw();
        });

        this._canvas.addEventListener('mousemove', (evt) => {
            var pos = getMousePos(evt);
            var context = this._canvas.getContext('2d')!;
            // context.fillStyle = "#000000";
            // context.fillRect(pos.x, pos.y, 2, 2);
        }, false);
    }

    /**
     * Resize the canvas to match the size of its parent element if the timeline is configured to be responsive.
     * @returns 
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
        
        // Update the size of the canvas to match the size of it's container.
        this._canvas.width = canvasContainerElement.getBoundingClientRect().width;
        this._canvas.height = canvasContainerElement.getBoundingClientRect().height;

        // Now that the canvas has resized we will need to recalculate the ticks for our range.
        this._range.calculateMinorAndMajorUnitTicks();
    }

    private _draw(): void {
        // Grab the canvas context.
        var context = this._canvas.getContext('2d')!;

        // Clear the canvas before doing a fresh draw.
        context.clearRect(0, 0, this._canvas.width, this._canvas.height);

        // TODO If not responsive then the canvas MUST be already set to the expected width/height.

        // Find the max height that we can render the data view before we need to have it scroll.
        // This is determined by how much vertical space is taken up by the range bar.
        // TODO This will eventually have to cope with the position of the range changing or the number of them (top and bottom range)
        const maxDataViewHeight = this._canvas.height - this._range.calculateRequiredHeight();

        // Draw the data view
        this._dataView.draw(context, this._range);

        // Draw the range.
        this._range.draw(context);

        // TODO Need to draw color grouping legend if using groups and colours.
    }
}