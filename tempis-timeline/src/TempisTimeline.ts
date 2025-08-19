import { TempisTimelineItemSelectionMode, TempisTimelineOptions } from "./TempisTimelineOptions";
import { TimelineDataSet } from "./TimelineDataSet";
import { TimelineDataView } from "./TimelineDataView";
import { TimelineFont } from "./TimelineFont";
import { TimelineItem } from "./TimelineItem";
import { TimelineRangeView } from "./TimelineRangeView";
import { SelectionChangeEvent } from "./Event";

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

    /** Gets the item selection mode. */
    private get _selectionMode(): TempisTimelineItemSelectionMode {
        return this._options.selection ?? "none";
    }

    /**
     * Gets the identifiers of the currently selected items.
     * @returns The identifiers of the currently selected items.
     */
    public getSelection(): (string | number)[] {
        return this._dataSet.getSelectedItems().map((item) => item.id);
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
     * Creates the canvas event handlers for timeline user interface interactions.
     */
    private _createCanvasEventHandlers() {
        // The drag threshold is the minimum distance that the pointer must move before we consider it a drag.
        const dragPixelThreshold = 10;

        // A flag defining whether the pointer is currently down.
        // This is used to determine if we are currently dragging the timeline.
        let isPointerDown = false;

        // Variables to keep track of the starting position of the pointer when dragging.
        // This is used to calculate the movement of the pointer when dragging.
        let startX = 0;
        let startY = 0;

        // A function that gets the position on the canvas for the mouse event.
        const getMousePos = (event: PointerEvent | MouseEvent) => {
            var rect = this._canvas.getBoundingClientRect();
            return {
                x: (event.clientX - rect.left) / (rect.right - rect.left) * this._canvas.clientWidth,
                y: (event.clientY - rect.top) / (rect.bottom - rect.top) * this._canvas.clientHeight
            };
        }

        // Handle the pointer down event to start dragging.
        // We will use pointer events to handle both mouse and touch events.
        this._canvas.addEventListener('pointerdown', (event) => {
            isPointerDown = true;

            // Get the mouse position on the canvas so that we can calculate the movement later.
            startX = event.clientX;
            startY = event.clientY;

            // Capture pointer to ensure we get pointerup even if moved outside canvas
            this._canvas.setPointerCapture(event.pointerId);
        });

        // Handle pointer move events to drag the timeline.
        // We will use pointer events to handle both mouse and touch events.
        this._canvas.addEventListener('pointermove', (event) => {
            // There is nothing to do if the pointer is not currently down.
            if (!isPointerDown) {
                return;
            }

            // Use movementX for range scrolling.
            if (Math.abs(event.movementX) >= 1) {
                this._rangeView.moveByXMovement(-event.movementX);
            }

            // Use movementY for data view scrolling.
            if (Math.abs(event.movementY) >= 1) {
                this._dataView.scrollByYMovement(event.movementY);
            }

            this._draw();
        });

        // Handle pointer up events to stop dragging.
        // We will use pointer events to handle both mouse and touch events.
        this._canvas.addEventListener('pointerup', (event) => {
            // There is nothing to do if the pointer is not currently down.
            if (!isPointerDown) {
                return
            }

            isPointerDown = false;

            // Work out the distance that the pointer has moved since it was pressed down.
            // We will use this to determine if the pointer has moved significantly or not.
            const dx = event.clientX - startX;
            const dy = event.clientY - startY;

            // If the pointer has not moved significantly, we consider it a click.
            // We will check if the pointer has moved less than the drag pixel threshold.
            if (Math.sqrt(dx * dx + dy * dy) < dragPixelThreshold) {
                // Try to find the item at the clicked position.
                const clickedItem = this._dataView.getItemAtPoint(getMousePos(event));

                // Did we actually click on an item?
                if (clickedItem) {
                    // Handle the item click.
                    this._onItemClicked(clickedItem);
                } else {
                    // If we did not click on an item, we will invoke the canvas click handler.
                    // This is used to handle clicks on the canvas when no items are clicked.
                    this._onCanvasClicked();
                }
            }

            // Release pointer capture
            this._canvas.releasePointerCapture(event.pointerId);
        });

        // Handle pointer cancel events to stop dragging.
        // This is used to handle cases where the pointer is cancelled (e.g. touch events
        this._canvas.addEventListener('pointercancel', () => {
            // TODO Work out why this is being called just after the use starts dragging on touch devices.
            isPointerDown = false;
        });

        // Handle mouse wheel events for zooming the range view.
        this._canvas.addEventListener('wheel', (event) => {
            // Prevent default scrolling behavior, we want the timeline to handle it instead.
            event.preventDefault();

            // Zoom the range view based on the wheel delta.
            this._rangeView.zoomRange(event.deltaY);

            // We will want to redraw the timeline after zooming.
            this._draw();
        });

        // Handle any double mouse click events for data view items.
        this._canvas.addEventListener('dblclick', (evt) => {
            // Try to get the item at the double-clicked position.
            const clickedItem = this._dataView.getItemAtPoint(getMousePos(evt));

            // If we have a clicked item, we will invoke the double-click handler.
            if (clickedItem) {
                this._onItemDoubleClicked(clickedItem);
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

    /**
     * Called when the canvas is clicked.
     * This is used to handle clicks on the canvas when no items are clicked.
     */
    private _onCanvasClicked(): void {
        // If we are not allowing selection, we do nothing.
        if (this._selectionMode === "none") {
            return;
        }

        const selectedItems = this._dataSet.getSelectedItems();

        // Is selection controlled or uncontrolled?
        if (this._options.onSelectionChange) {
            // This is controlled selection so the user has to handle selection state on their own.
            if (selectedItems.length) {
                this._options.onSelectionChange(selectedItems.map((item) => ({ id: item.id, selected: false })));
            }
        } else {
            // This is uncontrolled selection, so we will deselect all items.
            selectedItems.forEach((item) => item.isSelected = false);

            // We manually update the selection state of the items so we need to redraw.
            this._draw();
        }
    }

    /**
     * Called when an item is clicked.
     * @param item The clicked item.
     */
    private _onItemClicked(item: TimelineItem): void {
        const isItemInitiallySelected = item.isSelected;
        
        // Update item selection if we need to.
        if (this._selectionMode === "single") {
            // Get all items that are currently selected (we would only expect one at the most in this mode).
            const selectedItems = this._dataSet.getSelectedItems();

            // Get all the items that we are going to deselect, this will be all selected items except the one we just clicked.
            const itemsToDeselect = selectedItems.filter((selectedItem) => selectedItem.id !== item.id);

            // Is selection controlled or uncontrolled?
            if (this._options.onSelectionChange) {
                const selectionChangeEvents: SelectionChangeEvent[] = itemsToDeselect.map((item) => ({ id: item.id, selected: false }));

                // If the item was not initially selected, we need to add it to the list of selection change events.
                if (!isItemInitiallySelected) {
                    // If the item was not initially selected, we need to add it to the selection change
                    selectionChangeEvents.push({ id: item.id, selected: true });
                }

                // This is controlled selection so the user has to handle selection state on their own.
                if (selectionChangeEvents.length) {
                    this._options.onSelectionChange(selectionChangeEvents);
                }
            } else {
                // Deselect all selected items that are not the clicked item.
                // We will not deselect the clicked item if it was already selected.
                itemsToDeselect.forEach((selectedItem) => selectedItem.isSelected = false);

                // Ensure that the clicked item is selected.
                item.isSelected = true;

                // We manually updated the selection state of the items so we need to redraw.
                this._draw();
            }
        } else if (this._selectionMode === "multi") {
            // Is selection controlled or uncontrolled?
            if (this._options.onSelectionChange) {
                // If the item was not initially selected then clicking on it should prompt a selection change event.
                if (!isItemInitiallySelected) {
                    // This is controlled selection so the user has to handle selection state on their own.
                    this._options.onSelectionChange([{ id: item.id, selected: true }]);
                }
            } else {
                // Ensure that the clicked item is selected.
                item.isSelected = true;

                // We manually updated the selection state of the items so we need to redraw.
                this._draw();
            }

        }

        // Invoke the 'onItemClick' callback if defined, passing the identifier of the clicked item.
        this._options.onItemClick && this._options.onItemClick(item.id);
    }

    /**
     * Called when an item is double-clicked.
     * @param item The double-clicked item.
     */
    private _onItemDoubleClicked(item: TimelineItem): void {
        // Invoke the 'onItemDoubleClick' callback if defined, passing the identifier of the double-clicked item.
        this._options.onItemDoubleClick && this._options.onItemDoubleClick(item.id);
    }
}