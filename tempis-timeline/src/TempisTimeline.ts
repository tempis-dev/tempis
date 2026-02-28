import { TempisTimelineItem, TempisTimelineItemSelectionMode, TempisTimelineOptions, TempisTimelineVerticalFillMode } from "./TempisTimelineOptions";
import { TimelineDataSet } from "./TimelineDataSet";
import { TimelineBand } from "./TimelineBand";
import { TimelineDataView } from "./TimelineDataView";
import { TimelineFont } from "./TimelineFont";
import { TimelineItem } from "./TimelineItem";
import { TimelineRangeView } from "./TimelineRangeView";
import { TimelineTooltipView } from "./TimelineTooltipView";
import { TimelineLegendView } from "./TimelineLegendView";
import { SelectionChangeEvent } from "./Event";
import { isNullOrUndefined, parseDate } from "./Utilities";
import { TempisTimelineDateAdapter } from "./TempisTimelineDateAdapter";
import { AdapterRegistry } from "./AdapterRegistry";

export class TempisTimeline {
    /** The timeline canvas. */
    private readonly _canvas: HTMLCanvasElement;

    /** The timeline options. */
    private readonly _options: TempisTimelineOptions;

    /** The timeline dataset. */
    private readonly _dataSet: TimelineDataSet;

    /** The timeline bands. */
    private readonly _bands: TimelineBand[];

    /** The timeline data view. */
    private readonly _dataView: TimelineDataView;

    /** The timeline range. */
    private readonly _rangeView: TimelineRangeView;

    /** The timeline legend view. */
    private readonly _legendView: TimelineLegendView;

    /** The timeline tooltip view. */
    private readonly _tooltipView: TimelineTooltipView;

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
        this._font = new TimelineFont(this._options.style?.font);

        this._dataSet = new TimelineDataSet(this._options);
        this._dataView = new TimelineDataView(this._dataSet, this._isRTL);
        this._rangeView = new TimelineRangeView(
            this._canvas,
            this._dataSet,
            this._isRTL,
            this._options.range
        );
        this._legendView = new TimelineLegendView(this._canvas, this._dataSet, this._isRTL, this._options.legend);
        this._tooltipView = new TimelineTooltipView(
            this._canvas,
            this._dataView,
            this._font,
            this._isRTL,
            this._options.tooltip
        );

        // Create the timeline bands.
        this._bands = (this._options.bands ?? []).map((definition) => new TimelineBand(definition));

        // Do our initial canvas resize.
        this._resizeCanvas();

        // Is our timeline going to be responsive?
        if (this._isResponsive) {
            // We should set up a resize observer to keep our canvas dimensions inline with that of its parent element if the timeline is responsive.
            this._createCanvasContainerResizeObserver();
        } else {
            // We still need to apply our DPR scaling to our canvas if we aren't rendering responsively.
            this._applyCanvasDPRScaling();
        }

        // Create the canvas event handlers.
        this._createCanvasEventHandlers();

        // We should register a callback to redraw the timeline every time our dataset is updated.
        this._dataSet.registerUpdateCallback(() => this._draw());

        // Do our initial draw.
        this._draw();
    }

    /**
     * Register a custom date adapter for the timeline library.
     * This allows you to use timezone-aware date libraries (like Luxon, date-fns-tz, or Temporal)
     * instead of the default native Date implementation.
     * @param adapter The date adapter implementation to use
     */
    static registerDateAdapter(adapter: TempisTimelineDateAdapter): void {
        AdapterRegistry.register(adapter);
    }

    /**
     * Get the currently registered date adapter.
     * If no custom adapter has been registered, returns the default NativeDateAdapter.
     * @returns The active date adapter instance
     */
    static getDateAdapter(): TempisTimelineDateAdapter {
        return AdapterRegistry.get();
    }

    /** Gets the item selection mode. */
    private get _selectionMode(): TempisTimelineItemSelectionMode {
        return this._options.selection ?? "none";
    }

    /** Gets whether the timeline is rendering responsively. */
    private get _isResponsive(): boolean {
        return this._options.responsive ?? false;
    }

    /** Gets whether the timeline is rendering right-to-left. */
    private get _isRTL(): boolean {
        return this._options.rtl ?? false;
    }

    /** Gets the vertical fill mode. */
    private get _verticalFillMode(): TempisTimelineVerticalFillMode {
        return this._options.verticalFill ?? "content";
    }

    /**
     * Gets the identifiers of the currently selected items.
     * @returns The identifiers of the currently selected items.
     */
    public getSelection(): (string | number)[] {
        return this._dataSet.getSelectedItems().map((item) => item.id);
    }

    /**
     * Sets the timeline items and redraws the timeline.
     * @param items The timeline items to set.
     */
    public setItems(items: TempisTimelineItem[]): void {
        // Update the timeline options with the new items.
        this._options.items = items;

        // Update the dataset with options object containing the updated items.
        this._dataSet.update(this._options);

        // Redraw the timeline to reflect the updated items.
        this._draw();
    }

    /**
     * Focuses the timeline on a specific item, date, or range.
     * @param options The options to focus the timeline on, if not defined, the timeline will focus on the full range of items.
     */
    public focus(options?: {
        id?: number | string;
        date?: string | number | Date;
        range?: [string | number | Date, string | number | Date];
    }): void {
        if (!options) {
            // No options were defined, so we will just set the range to the min and max dates of the dataset if they are defined.
            // This will effectively reset the timeline to show the full range of items.
            if (this._dataSet.minDate && this._dataSet.maxDate) {
                this._rangeView.setRange(this._dataSet.minDate, this._dataSet.maxDate);
            }
        } else if (!isNullOrUndefined(options.id)) {
            // We are going to focus on a item that has been specified by its identifier.
            const item = this._dataSet.getItemById(options.id!);

            if (!item) {
                throw new Error(`No item found with ID ${options.id}`);
            } else if (item.end) {
                // If the item has an end date, we will set the range to the start and end dates of the item.
                this._rangeView.setRange(item.start, item.end);
            } else {
                // If the item is a PIT item then we just want to center the timeline on the start date of the item.
                this._rangeView.centerOnDate(item.start);

                // TODO Need to scroll vertically to the item in the data view.
            }
        } else if (!isNullOrUndefined(options.date)) {
            // We are going to focus on a specific date.
            // Parse the date from the options to check if it is valid.
            const date = parseDate(options.date!);

            // If the date is valid, we will center the timeline on that date.
            this._rangeView.centerOnDate(date);
        } else if (options.range && options.range.length === 2) {
            // We are going to focus on a specific range.
            // Parse the start and end dates from the options to check if they are valid.
            const start = parseDate(options.range[0]);
            const end = parseDate(options.range[1]);

            this._rangeView.setRange(start, end);
        }

        // We may have updated the range so we need to redraw the timeline.
        this._draw();
    }

    /**
     * Redraw the timeline.
     */
    public redraw(): void {
        // Our canvas size or window scaling may have changed, so we should reapply the canvas DPR scaling.
        this._applyCanvasDPRScaling();

        // Our canvas size or window scaling may have changed, we will need to recalculate the ticks for our range.
        this._rangeView.calculateMinorAndMajorUnitTicks();

        // Draw the timeline.
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

        throw new Error("whatcha doing this isn't a valid value!");
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
        // Prevent default touch gestures like scroll/pinch.
        // TODO This will prevent pinch zooming on touch devices, we may want to allow this in the future.
        this._canvas.style.touchAction = "none";

        // The drag threshold is the minimum distance that the pointer must move before we consider it a drag.
        const dragPixelThreshold = 10;

        // A flag defining whether the pointer is currently down.
        // This is used to determine if we are currently dragging the timeline.
        let isPointerDown = false;

        // Variables to keep track of the starting position of the pointer when dragging.
        // This is used to calculate the movement of the pointer when dragging.
        let startX = 0;
        let startY = 0;

        // A function that gets the position on the canvas for the mouse event or pointer event.
        const getMouseOrPointerPosition = (event: PointerEvent | MouseEvent) => {
            const rect = this._canvas.getBoundingClientRect();
            return {
                x: ((event.clientX - rect.left) / (rect.right - rect.left)) * this._canvas.clientWidth,
                y: ((event.clientY - rect.top) / (rect.bottom - rect.top)) * this._canvas.clientHeight
            };
        };

        // Handle the pointer down event to start dragging.
        // We will use pointer events to handle both mouse and touch events.
        this._canvas.addEventListener("pointerdown", (event) => {
            isPointerDown = true;

            // Get the mouse position on the canvas so that we can calculate the movement later.
            startX = event.clientX;
            startY = event.clientY;

            // Capture pointer to ensure we get pointerup even if moved outside canvas
            this._canvas.setPointerCapture(event.pointerId);
        });

        // Handle pointer move events to drag the timeline.
        // We will use pointer events to handle both mouse and touch events.
        this._canvas.addEventListener("pointermove", (event) => {
            // There is nothing to do if the pointer is not currently down.
            if (!isPointerDown) {
                return;
            }

            // Use movementX for range scrolling.
            if (Math.abs(event.movementX) >= 1) {
                // If right-to-left then dragging right is moving the range forward in time, otherwise backwards.
                this._rangeView.moveRange(this._isRTL ? event.movementX : -event.movementX);
            }

            // Use movementY for data view scrolling.
            if (Math.abs(event.movementY) >= 1) {
                this._dataView.scrollByYMovement(event.movementY);
            }

            this._draw();
        });

        // Handle pointer up events to stop dragging.
        // We will use pointer events to handle both mouse and touch events.
        this._canvas.addEventListener("pointerup", (event) => {
            // There is nothing to do if the pointer is not currently down.
            if (!isPointerDown) {
                return;
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
                const clickedItem = this._dataView.getItemAtPoint(getMouseOrPointerPosition(event));

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
        // This is used to handle cases where the pointer is cancelled (e.g. touch events)
        this._canvas.addEventListener("pointercancel", () => {
            isPointerDown = false;
        });

        // Handle mouse wheel events for zooming the range view.
        this._canvas.addEventListener("wheel", (event) => {
            // Prevent default scrolling behavior, we want the timeline to handle it instead.
            event.preventDefault();

            // Zoom the range view based on the wheel delta and the mouse position.
            this._rangeView.zoomRange(event.deltaY, getMouseOrPointerPosition(event).x);

            // We will want to redraw the timeline after zooming.
            this._draw();
        });

        // Handle any double mouse click events for data view items.
        this._canvas.addEventListener(
            "dblclick",
            (evt) => {
                // Try to get the item at the double-clicked position.
                const clickedItem = this._dataView.getItemAtPoint(getMouseOrPointerPosition(evt));

                // If we have a clicked item, we will invoke the double-click handler.
                if (clickedItem) {
                    this._onItemDoubleClicked(clickedItem);
                }
            },
            false
        );
    }

    /**
     * Resize the canvas to match the size of its parent element if the timeline is configured to be responsive.
     */
    private _resizeCanvas(): void {
        // We should not resize the canvas if the timeline has not been configured to be responsive.
        if (!this._isResponsive) {
            return;
        }

        // Get the canvas parent element.
        const canvasContainerElement = this._canvas.parentElement;

        // The canvas element may be detached.
        if (!canvasContainerElement) {
            throw new Error("Cannot resize canvas as it has no parent element, is it detached?");
        }

        // Ensure the canvas is a block-level, border-box element to prevent layout feedback loops.
        // Without these, the canvas (which is inline by default) can cause its parent to grow slightly
        // on each resize, leading to an infinite vertical expansion.
        this._canvas.style.display = "block";
        this._canvas.style.boxSizing = "border-box";

        // Set actual display size of the canvas (css pixels).
        this._canvas.style.width = canvasContainerElement.clientWidth + "px";
        this._canvas.style.height = canvasContainerElement.clientHeight + "px";

        // Apply the window device pixel ratio scaling to the canvas.
        this._applyCanvasDPRScaling();

        // Now that the canvas has resized we will need to recalculate the ticks for our range.
        this._rangeView.calculateMinorAndMajorUnitTicks();
    }

    /**
     * Apply the window device pixel ratio scaling to the canvas.
     * This is used to ensure that the canvas is rendered at the correct size for the device.
     */
    private _applyCanvasDPRScaling(): void {
        // Get the canvas context.
        const canvasContext = this._canvas.getContext("2d")!;

        // Grab the CSS width and height of the canvas before we apply the scaling.
        const originalCanvasWidth = this._canvas.offsetWidth;
        const originalCanvasHeight = this._canvas.offsetHeight;

        // Get the device pixel ratio from the window, or default to 1.
        const dpr = window.devicePixelRatio || 1;

        // Set the "physical" size of the canvas, this is the number of pixels that the canvas has.
        this._canvas.width = this._canvas.offsetWidth * dpr;
        this._canvas.height = this._canvas.offsetHeight * dpr;

        // Scale the drawing context to account for the increased pixel density.
        canvasContext.scale(dpr, dpr);

        // If the CSS size of the canvas changed as a result of us setting the internal width/height then we should let
        // the user know that they need to define a width and height for their canvas in order to avoid layout issues.
        if (originalCanvasWidth !== this._canvas.offsetWidth || originalCanvasHeight !== this._canvas.offsetHeight) {
            console.warn(
                "tempis-timeline: Canvas layout changed after setting inner width/height. Define canvas CSS width/height to prevent layout issues."
            );
        }
    }

    /**
     * Draw the timeline.
     */
    private _draw(): void {
        // Grab the canvas context.
        const context = this._canvas.getContext("2d")!;

        // In "grow-canvas" mode, we need to calculate the required height BEFORE drawing
        // to avoid drawing twice (once to measure, once after resizing).
        if (this._verticalFillMode === "grow-canvas") {
            const requiredHeight = this._calculateRequiredCanvasHeight(context);
            
            // Only resize and reapply DPR scaling if the height actually changed.
            if (this._canvas.clientHeight !== requiredHeight) {
                this._canvas.style.height = requiredHeight + "px";
                this._applyCanvasDPRScaling();
            }
        }

        // Clear the canvas before doing a fresh draw.
        context.clearRect(0, 0, this._canvas.clientWidth, this._canvas.clientHeight);

        // The default direction for the timeline should ALWAYS be left-to-right.
        // The canvas will inherit the page direction otherwise which may cause issues with rendering.
        // If the timeline is rendering right-to-left then the views will handle the text alignment internally based on the `rtl` option.
        context.direction = "ltr";

        // Apply the default font to the canvas context.
        context.font = this._font.font;

        // Calculate how much height the range view will take up when drawn.
        const rangeViewHeight = this._rangeView.calculateRequiredHeight();

        // Calculate how much height the legend view will take up when drawn.
        const legendViewHeight = this._legendView.calculateRequiredHeight();

        // Set the default y position of the data view which would render the data view form the top of the canvas.
        // This will be corrected for if a range and/or legend will be rendered above the data view.
        let dataViewYPosition = 0;

        // If we are drawing a legend view above the data view then offset the data view y position by the calculated height of the legend view.
        if (this._legendView.position === "top") {
            dataViewYPosition += legendViewHeight;
        }

        // If we are drawing a range view above the data view then offset the data view y position by the calculated height of the range view.
        if (["top", "both"].includes(this._rangeView.position)) {
            dataViewYPosition += rangeViewHeight;
        }

        // Set the default max height of the data view which would render the data view from below any legend or range view at the top of the canvas to the bottom of the canvas.
        let dataViewMaxHeight = this._canvas.clientHeight - dataViewYPosition;

        // If we are drawing a range view below the data view then reduce the max height of the data view to account for it.
        if (["bottom", "both"].includes(this._rangeView.position)) {
            dataViewMaxHeight -= rangeViewHeight;
        }

        // If we are drawing a legend view below the data view then reduce the max height of the data view to account for it.
        if (this._legendView.position === "bottom") {
            dataViewMaxHeight -= legendViewHeight;
        }

        /**
         * The rendering of the views starts here and is done in the following order:
         * 1. Legend view (if configured 'top' or 'both')
         * 2. Range view (if configured 'top')
         * 3. Data view
         * 4. Range view (if configured 'bottom' or 'both')
         * 5. Legend view (if configured 'bottom')
         */

        // We are going to render our stacked legend/range/data views so we need to keep track of the overall y render offset position.
        let renderOffsetY = 0;

        // The first thing to render would be a top legend bar (if configured to do so).
        if (this._legendView.position === "top") {
            this._legendView.draw(context, renderOffsetY);
            renderOffsetY += legendViewHeight;
        }

        // The next thing to render would be a top range bar (if configured to do so).
        if (["top", "both"].includes(this._rangeView.position)) {
            this._rangeView.draw(context, renderOffsetY, "top");
            renderOffsetY += rangeViewHeight;
        }

        // The next thing to render would be the data view.
        // We need to clip an area of the canvas from the current y render offset to prevent the data view rendering over any top legend/range view.
        context.save();
        context.beginPath();
        context.rect(0, renderOffsetY, this._canvas.clientWidth, dataViewMaxHeight);
        context.clip();

        // Render the data view.
        // The result of this is the resulting data view height which we should add to the total render height.
        renderOffsetY += this._dataView.draw(
            context,
            this._rangeView.fromDt,
            this._rangeView.toDt,
            this._rangeView.minorTicks,
            this._bands,
            renderOffsetY,
            // For "grow-canvas" vertical fill mode we just give the data view a massive height to render into so that it can render all items safely.
            this._verticalFillMode === "grow-canvas" ? Number.MAX_SAFE_INTEGER : dataViewMaxHeight,
            this._verticalFillMode === "fill-canvas"
        );

        // Restore the original render context, this will bin the clipping rect we put in place to restrict the data view render.
        context.restore();

        // The next thing to render would be a bottom range bar (if configured to do so).
        if (["bottom", "both"].includes(this._rangeView.position)) {
            this._rangeView.draw(context, renderOffsetY, "bottom");
            renderOffsetY += rangeViewHeight;
        }

        // The last thing to render would be a bottom legend bar (if configured to do so).
        if (this._legendView.position === "bottom") {
            this._legendView.draw(context, renderOffsetY);
            renderOffsetY += legendViewHeight;
        }

        // Clear the canvas from below the bottom of the bottom range view or bottom of the timeline or the bottom of the legend.
        context.clearRect(0, renderOffsetY, this._canvas.clientWidth, this._canvas.clientHeight - renderOffsetY);
    }

    /**
     * Calculate the total required canvas height for "grow-canvas" mode.
     * This pre-calculates the height needed without actually drawing, preventing the need for a second draw pass.
     * @param context The canvas 2D context.
     * @returns The total height required to render all timeline content.
     */
    private _calculateRequiredCanvasHeight(context: CanvasRenderingContext2D): number {
        // Apply the default font to ensure accurate measurements.
        context.font = this._font.font;

        let totalHeight = 0;

        // Add height for top legend if configured.
        if (this._legendView.position === "top") {
            totalHeight += this._legendView.calculateRequiredHeight();
        }

        // Add height for top range view if configured.
        if (["top", "both"].includes(this._rangeView.position)) {
            totalHeight += this._rangeView.calculateRequiredHeight();
        }

        // Calculate the data view height by creating a draw plan without actually drawing.
        // The draw plan calculates all layout information including the total height needed.
        const dataViewDrawPlan = this._dataView.createDrawPlan(
            context,
            this._rangeView.fromDt,
            this._rangeView.toDt
        );
        totalHeight += dataViewDrawPlan.height;

        // Add height for bottom range view if configured.
        if (["bottom", "both"].includes(this._rangeView.position)) {
            totalHeight += this._rangeView.calculateRequiredHeight();
        }

        // Add height for bottom legend if configured.
        if (this._legendView.position === "bottom") {
            totalHeight += this._legendView.calculateRequiredHeight();
        }

        return totalHeight;
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
            selectedItems.forEach((item) => (item.isSelected = false));

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
                const selectionChangeEvents: SelectionChangeEvent[] = itemsToDeselect.map((item) => ({
                    id: item.id,
                    selected: false
                }));

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
                itemsToDeselect.forEach((selectedItem) => (selectedItem.isSelected = false));

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
        this._options.onItemClick?.(item.id);
    }

    /**
     * Called when an item is double-clicked.
     * @param item The double-clicked item.
     */
    private _onItemDoubleClicked(item: TimelineItem): void {
        // Invoke the 'onItemDoubleClick' callback if defined, passing the identifier of the double-clicked item.
        this._options.onItemDoubleClick?.(item.id);
    }
}
