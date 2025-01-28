import { TempisTimelineItem, TempisTimelineOptions } from "./TempisTimelineOptions";
import { TimelineItemGrouping } from "./TimelineItemGrouping";

export class TempisTimeline {
    /** The timeline canvas. */
    private readonly _canvas: HTMLCanvasElement;

    /** The timeline options. */
    private readonly _options: TempisTimelineOptions;

    /** The canvas container resize observer. */
    private _canvasContainerResizeObserver: ResizeObserver | null = null;

    /** The timeline item groupings. */
    private _itemGroupings: TimelineItemGrouping[] = [];

    public constructor(context: string | HTMLCanvasElement, options: TempisTimelineOptions) {
        this._options = options;

        this._canvas = this._getCanvas(context);

        // Create our initial item groupings.
        this._createItemGroupings();

        // Do our initial canvas resize.
        this._resizeCanvas();

        // We should set up a resize observer to keep our canvas dimensions inline with that of its parent element if the timeline is responsive.
        if (options.responsive !== false) {
           this._createCanvasContainerResizeObserver();
        }

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
    }

    private _draw(): void {
        var context = this._canvas.getContext('2d')!;
        context.fillStyle = "black";
        context.font = "12px Arial";
        context.fillText(`Got ${this._itemGroupings.length} groups!!!!`, 0, 50);
        context.globalCompositeOperation = "destination-over";
        context.fillStyle = "#00FFFF";
        context.fillRect(0,0,this._canvas.width,this._canvas.height);//for white background
        context.globalCompositeOperation = "source-over";
        context.lineWidth = 2;
        context.strokeStyle="#FF0000";
        context.strokeRect(0, 0, this._canvas.width, this._canvas.height);//for white background
    }
}