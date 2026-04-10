import {
    TempisTimelineAlignment,
    TempisTimelineLegendOptions,
    TempisTimelineLegendPosition,
    TempisTimelineMarkerStyle
} from "./TempisTimelineOptions";
import { TimelineDataSet } from "./TimelineDataSet";
import { TimelineItemCategory } from "./TimelineItemCategory";
import { drawClippedText, isNullOrUndefined } from "./Utilities";

export interface LegendViewDrawPlan {
    /** The height of the view. */
    height: number;

    /** The width of the view. */
    width: number;

    /** The category draw plans. */
    categoryDrawPlans: LegendCategoryDrawPlan[];
}

export interface LegendCategoryDrawPlan {
    /** The category. */
    category: TimelineItemCategory;

    markerSize: number;

    markerLabelGap: number;

    xPositionStart: number;

    xPositionEnd: number;

    yPositionStart: number;

    yPositionEnd: number;

    width: number;

    height: number;
}

/** The default amount of padding to use for each legend category. */
const DEFAULT_CATEGORY_GAP: number = 4;

/** The default amount of padding to use for the legend. */
const DEFAULT_LEGEND_PADDING: number = 8;

/** The alpha to apply when rendering disabled legend categories. */
const DISABLED_CATEGORY_ALPHA: number = 0.4;

export class TimelineLegendView {
    /** The timeline canvas. */
    private readonly _canvas: HTMLCanvasElement;

    /** The underlying dataset model. */
    private readonly _dataSet: TimelineDataSet;

    /** The flag defining whether the timeline is being rendered right-to-left. */
    private readonly _isRTL: boolean;

    /** The timeline legend options. */
    private readonly _options: TempisTimelineLegendOptions;

    /** The current view draw plan. */
    private _drawPlan: LegendViewDrawPlan | null = null;

    /** Gets the y position from where this view was last drawn. */
    private _lastDrawYPosition: number = 0;

    /** Timer for debouncing category hover effects. */
    private _hoverDelayTimer: number | null = null;

    /** The event handler references for cleanup. */
    private _eventHandlers: {
        pointermove: ((event: PointerEvent) => void) | null;
        pointerdown: ((event: PointerEvent) => void) | null;
        pointerup: (() => void) | null;
        pointerout: (() => void) | null;
        wheel: (() => void) | null;
    } = {
        pointermove: null,
        pointerdown: null,
        pointerup: null,
        pointerout: null,
        wheel: null
    };

    /**
     * Creates a new instance of the TimelineLegendView class.
     * @param canvas The timeline canvas.
     * @param dataSet The timeline dataset model.
     * @param isRTL Whether the timeline is being rendered right-to-left.
     * @param options The timeline legend options.
     */
    public constructor(
        canvas: HTMLCanvasElement,
        dataSet: TimelineDataSet,
        isRTL: boolean,
        options: TempisTimelineLegendOptions = {}
    ) {
        this._canvas = canvas;
        this._dataSet = dataSet;
        this._isRTL = isRTL;
        this._options = options;

        this._createCanvasEventHandlers();
    }

    /**
     * Gets the position option value.
     */
    public get position(): TempisTimelineLegendPosition {
        return this._options.position ?? "bottom";
    }

    /**
     * Gets the alignment option value.
     */
    public get alignment(): TempisTimelineAlignment {
        return this._options.alignment ?? "center";
    }

    /**
     * Gets the legend item marker style.
     */
    public get itemMarkerStyle(): TempisTimelineMarkerStyle {
        return this._options.markerStyle ?? "square-rounded";
    }

    /**
     * Gets the legend item gap.
     */
    public get gap(): number {
        return this._options.gap ?? DEFAULT_CATEGORY_GAP;
    }

    /**
     * Gets a flag defining whether to highlight category items in the timeline when the corresponding category is hovered over in the legend.
     */
    public get isHighlightOnHover(): boolean {
        return this._options.isHighlightOnHover ?? true;
    }

    /**
     * Gets a flag defining whether clicking a category in the legend toggles the visibility of all timeline items belonging to that category.
     */
    public get isFilterOnClick(): boolean {
        return this._options.isFilterOnClick ?? true;
    }

    /**
     * Calculate the height of this view when rendered.
     * @returns The height of this view when rendered.
     */
    public calculateRequiredHeight(): number {
        // Grab the canvas context.
        const context = this._canvas.getContext("2d")!;

        // We need to create a draw plan for this view, without one we cannot determine the height of this view.
        this._createViewDrawPlan(context);

        // Return the draw plan height if we have one, otherwise just return zero.
        return this._drawPlan?.height ?? 0;
    }

    /**
     * Destroy the legend view and clean up all resources.
     * This removes all event listeners to prevent memory leaks.
     */
    public destroy(): void {
        // Clear any pending hover timer
        if (this._hoverDelayTimer !== null) {
            clearTimeout(this._hoverDelayTimer);
            this._hoverDelayTimer = null;
        }

        // Remove all event listeners
        if (this._eventHandlers.pointermove) {
            this._canvas.removeEventListener("pointermove", this._eventHandlers.pointermove);
        }
        if (this._eventHandlers.pointerdown) {
            this._canvas.removeEventListener("pointerdown", this._eventHandlers.pointerdown);
        }
        if (this._eventHandlers.pointerup) {
            this._canvas.removeEventListener("pointerup", this._eventHandlers.pointerup);
        }
        if (this._eventHandlers.pointerout) {
            this._canvas.removeEventListener("pointerout", this._eventHandlers.pointerout);
        }
        if (this._eventHandlers.wheel) {
            this._canvas.removeEventListener("wheel", this._eventHandlers.wheel);
        }
    }

    /**
     * Draw the timeline legend onto the canvas.
     * @param context The canvas 2D context.
     * @param yPosition The y position to draw the legend at.
     */
    public draw(context: CanvasRenderingContext2D, yPosition: number): void {
        // If we have no draw plan then there is noting to do.
        if (!this._drawPlan) {
            return;
        }

        // Clear the legend view area.
        context.clearRect(0, yPosition, this._drawPlan.width, this._drawPlan.height);

        // Draw a marker and label for each category.
        for (const categoryDrawPlan of this._drawPlan.categoryDrawPlans) {
            // If the category is disabled then we want to render it with some opacity.
            if (categoryDrawPlan.category.isDisabled) {
                context.globalAlpha = DISABLED_CATEGORY_ALPHA;
            }

            // Figure out the marker radius to use which is determines by the item marker style.
            let markerRadius = 0;
            switch (this.itemMarkerStyle) {
                case "square":
                    markerRadius = 0;
                    break;

                case "square-rounded":
                    markerRadius = categoryDrawPlan.markerSize / 4;
                    break;

                case "circle":
                    markerRadius = categoryDrawPlan.markerSize;
                    break;

                default:
                    throw new Error(`unknown marker style: ${this.itemMarkerStyle}`);
            }

            // Draw the category marker.
            context.fillStyle = categoryDrawPlan.category.style.backgroundColor!;
            context.beginPath();
            // If right-to-left then the marker will be drawn to the right of the label.
            if (this._isRTL) {
                context.roundRect(
                    Math.min(
                        categoryDrawPlan.xPositionEnd - this.gap - categoryDrawPlan.markerSize,
                        this._drawPlan.width - categoryDrawPlan.markerSize - DEFAULT_LEGEND_PADDING
                    ),
                    categoryDrawPlan.yPositionStart + this.gap + yPosition,
                    categoryDrawPlan.markerSize,
                    categoryDrawPlan.markerSize,
                    markerRadius
                );
            } else {
                context.roundRect(
                    categoryDrawPlan.xPositionStart + this.gap,
                    categoryDrawPlan.yPositionStart + this.gap + yPosition,
                    categoryDrawPlan.markerSize,
                    categoryDrawPlan.markerSize,
                    markerRadius
                );
            }
            context.fill();

            // Draw the category label clipped to the available legend view width.
            context.fillStyle = "#595959";
            context.textBaseline = "middle";
            // If right-to-left then the label will be drawn to the left of the marker.
            if (this._isRTL) {
                drawClippedText(
                    context,
                    categoryDrawPlan.category.label,
                    categoryDrawPlan.xPositionStart + this.gap,
                    categoryDrawPlan.yPositionStart + categoryDrawPlan.height / 2 + yPosition,
                    this._drawPlan.width -
                        (categoryDrawPlan.xPositionStart +
                            this.gap +
                            categoryDrawPlan.markerSize +
                            categoryDrawPlan.markerLabelGap) -
                        DEFAULT_LEGEND_PADDING
                );
            } else {
                drawClippedText(
                    context,
                    categoryDrawPlan.category.label,
                    categoryDrawPlan.xPositionStart +
                        this.gap +
                        categoryDrawPlan.markerSize +
                        categoryDrawPlan.markerLabelGap,
                    categoryDrawPlan.yPositionStart + categoryDrawPlan.height / 2 + yPosition,
                    this._drawPlan.width -
                        (categoryDrawPlan.xPositionStart +
                            this.gap +
                            categoryDrawPlan.markerSize +
                            categoryDrawPlan.markerLabelGap) -
                        DEFAULT_LEGEND_PADDING
                );
            }

            // Reset the context global alpha as we may have modified it if the category is disabled.
            context.globalAlpha = 1.0;
        }

        // Set the y position from where this view was last drawn.
        // This will be used to help align absolute canvas pointer positions with legend elements.
        this._lastDrawYPosition = yPosition;
    }

    /**
     * Create a draw plan for the view.
     * @returns A draw plan for the view.
     */
    private _createViewDrawPlan(context: CanvasRenderingContext2D): void {
        // If there are no categories then we have nothing to draw.
        if (this._dataSet.categories.length === 0) {
            this._drawPlan = null;
            return;
        }

        type SizedElement = {
            category: TimelineItemCategory;
            width: number;
            height: number;
            labelHeight: number;
            markerLabelGap: number;
        };

        // Create an array to hold the sized legend elements.
        const elements: SizedElement[] = [];

        // Calculate the label height to use for every category (to be consistent) and the item height.
        const { actualBoundingBoxAscent, actualBoundingBoxDescent } = context.measureText("Category Label");
        const labelHeight = actualBoundingBoxAscent + actualBoundingBoxDescent;
        const itemHeight = labelHeight + this.gap * 2;

        // Calculate the gap between the colour marker and the label, this should be derived from the text size.
        const markerLabelGap = labelHeight / 2;

        // Create a legend element for each category with it's drawn width and height.
        for (const category of this._dataSet.categories) {
            // We shouldn't create elements for categories with no name.
            if (isNullOrUndefined(category.label) || category.label === "") {
                continue;
            }

            // Measure the category name text dimensions to get the width of the label.
            const { width } = context.measureText(category.label);

            elements.push({
                category,
                width: width + markerLabelGap + labelHeight + this.gap * 2,
                height: itemHeight,
                labelHeight,
                markerLabelGap
            });
        }

        // Figure out the available width of the legend excluding the padding.
        const availableWidth = context.canvas.clientWidth - DEFAULT_LEGEND_PADDING * 2;

        // Make a 2D array to represent the rows of legend elements.
        const elementRows: SizedElement[][] = [[]];
        let currentElementRowWidth = 0;

        // Iterate over each element and add it to our 2D array representing the rows of elements in our legend.
        for (const element of elements) {
            // If adding this element would exceed the available width, start a new row.
            // If this item would be the only one in the row and is still wider than the view then it should still get its own row and overflow.
            // If the canvas width is not wide enough to show an item (probably has a long label or canvas is narrow) then we should show a label ellipses at draw.
            if (
                currentElementRowWidth + element.width > availableWidth &&
                elementRows[elementRows.length - 1].length > 0
            ) {
                elementRows.push([]);
                currentElementRowWidth = 0;
            }

            // Add the element to the current row.
            elementRows[elementRows.length - 1].push(element);

            // Update the running width.
            currentElementRowWidth += element.width;
        }

        const categoryDrawPlans: LegendCategoryDrawPlan[] = [];

        // Iterate over the element rows and elements in each row and create a category draw plan for each.
        for (const elementRow of elementRows) {
            // Get the index of the current row.
            const rowIndex = elementRows.indexOf(elementRow);

            // Calculate the width of all items in the row so we know where to start positioning them from.
            const rowTotalWidth = elementRow.reduce((previous, current) => previous + current.width, 0);

            let currentXPosition = 0;

            // We need to apply an initial x offset if we aren't aligning the items with the start of the container.
            if (this.alignment === "start") {
                // In right-to-left, "start" means align to the right edge, otherwise the left edge.
                currentXPosition = this._isRTL ? Math.max(0, availableWidth - rowTotalWidth) : 0;
            } else if (this.alignment === "center") {
                currentXPosition = Math.max(0, availableWidth / 2 - rowTotalWidth / 2);
            } else if (this.alignment === "end") {
                // In right-to-left, "end" means align to the left edge, otherwise the right edge.
                currentXPosition = this._isRTL ? 0 : Math.max(0, availableWidth - rowTotalWidth);
            }

            // Iterate over each element in the row and create a category item plan with the the correct x/y start/end values.
            // If we are rendering the timeline right-to-left then we need to reverse the order of the row elements.
            for (const element of this._isRTL ? elementRow.slice().reverse() : elementRow) {
                categoryDrawPlans.push({
                    category: element.category,
                    markerSize: element.labelHeight,
                    markerLabelGap: element.markerLabelGap,
                    xPositionStart: currentXPosition + DEFAULT_LEGEND_PADDING,
                    xPositionEnd: currentXPosition + element.width + DEFAULT_LEGEND_PADDING,
                    yPositionStart: rowIndex * element.height + DEFAULT_LEGEND_PADDING,
                    yPositionEnd: rowIndex * element.height + element.height + DEFAULT_LEGEND_PADDING,
                    width: element.width,
                    height: element.height
                });

                currentXPosition += element.width;
            }
        }

        // Set the draw plan.
        this._drawPlan = {
            height: itemHeight * elementRows.length + DEFAULT_LEGEND_PADDING * 2,
            width: context.canvas.clientWidth,
            categoryDrawPlans
        };
    }

    /**
     * Creates the canvas event handlers for timeline user interface interactions.
     */
    private _createCanvasEventHandlers() {
        // A function that gets the position on the canvas for the mouse event or pointer event.
        const getMouseOrPointerPosition = (event: PointerEvent | MouseEvent) => {
            const rect = this._canvas.getBoundingClientRect();
            return {
                x: ((event.clientX - rect.left) / (rect.right - rect.left)) * this._canvas.clientWidth,
                y: ((event.clientY - rect.top) / (rect.bottom - rect.top)) * this._canvas.clientHeight
            };
        };

        // TODO Throttle the pointer move handler, we don't need it every move.

        // A flag defining whether the pointer is currently down.
        let isPointerDown = false;

        // Handle the pointer move event.
        this._eventHandlers.pointermove = (event) => {
            // There is nothing to do if we have no draw plan as we have no rendered categories.
            if (!this._drawPlan) {
                return;
            }

            // There is nothing to do if we aren't going to be setting any focused categories.
            if (!this.isHighlightOnHover) {
                return;
            }

            // We don't want to toggle the focus of any categories if the user is just dragging over the legend view.
            if (isPointerDown) {
                return;
            }

            const pointerPosition = getMouseOrPointerPosition(event);

            // Do not get items for points that overflow the vertical constraints of the data view.
            if (
                pointerPosition.y < this._lastDrawYPosition ||
                pointerPosition.y > this._lastDrawYPosition + this._drawPlan.height
            ) {
                // Clear any pending hover timer.
                if (this._hoverDelayTimer !== null) {
                    clearTimeout(this._hoverDelayTimer);
                    this._hoverDelayTimer = null;
                }

                // Ensure that we are not leaving any categories focused.
                this._dataSet.unfocusCategories();
                return;
            }

            // Attempt to get the category at the pointer position
            const targetCategory = this._getCategoryAtPoint(pointerPosition);

            // Clear any existing hover timer.
            if (this._hoverDelayTimer !== null) {
                clearTimeout(this._hoverDelayTimer);
                this._hoverDelayTimer = null;
            }

            // Add a small delay before applying the hover effect.
            this._hoverDelayTimer = window.setTimeout(() => {
                // If we have a target category then we should set it as focused, otherwise we are unfocusing all categories.
                if (targetCategory) {
                    this._dataSet.focusCategory(targetCategory.name);
                } else {
                    this._dataSet.unfocusCategories();
                }
                this._hoverDelayTimer = null;
            }, 150);
        };
        this._canvas.addEventListener("pointermove", this._eventHandlers.pointermove);

        // Handle the pointer down event.
        this._eventHandlers.pointerdown = (event) => {
            isPointerDown = true;

            // Clear any pending hover timer.
            if (this._hoverDelayTimer !== null) {
                clearTimeout(this._hoverDelayTimer);
                this._hoverDelayTimer = null;
            }

            // There is nothing to do if we have no draw plan as we have no rendered categories.
            if (!this._drawPlan) {
                return;
            }

            // There is nothing to do if we aren't going to be toggling the enabled state of any categories when clicked.
            if (!this.isFilterOnClick) {
                return;
            }

            const pointerPosition = getMouseOrPointerPosition(event);

            // There is also nothing to do if the pointer event happened outside the bounds of this view.
            if (
                pointerPosition.y < this._lastDrawYPosition ||
                pointerPosition.y > this._lastDrawYPosition + this._drawPlan.height
            ) {
                return;
            }

            // Attempt to get the category at the pointer position
            const targetCategory = this._getCategoryAtPoint(pointerPosition);

            // If we didn't click on a category then there is nothing to do.
            if (!targetCategory) {
                return;
            }

            // Disable or enable the category based on whether it is already disabled.
            if (targetCategory.isDisabled) {
                this._dataSet.enableCategory(targetCategory.name);
            } else {
                this._dataSet.disableCategory(targetCategory.name);
            }

            this._dataSet.unfocusCategories();
        };
        this._canvas.addEventListener("pointerdown", this._eventHandlers.pointerdown);

        // Handle the pointer up event.
        this._eventHandlers.pointerup = () => {
            isPointerDown = false;
        };
        this._canvas.addEventListener("pointerup", this._eventHandlers.pointerup);

        // Handle the pointer leaving the canvas.
        this._eventHandlers.pointerout = () => {
            // Clear any pending hover timer.
            if (this._hoverDelayTimer !== null) {
                clearTimeout(this._hoverDelayTimer);
                this._hoverDelayTimer = null;
            }

            // Ensure that we don't leave any categories focused when our pointer leaves the canvas.
            this._dataSet.unfocusCategories();
        };
        this._canvas.addEventListener("pointerout", this._eventHandlers.pointerout);

        // Handle the wheel event.
        this._eventHandlers.wheel = () => {
            // Scrolling the wheel can update the position of the legend when `options.fillVertically` is not set.
            // This could potentially move our cursor off of a category we were focusing on and even move us onto another.
            // Clear any focused category....just in case.
            this._dataSet.unfocusCategories();
        };
        this._canvas.addEventListener("wheel", this._eventHandlers.wheel);
    }

    /**
     * Gets the legend category at the specified point in the view, or null if there is no item at that point.
     * @param point The point at which to get the legend category.
     * @returns The item at the specified point, or null if there is no item at that point.
     */
    private _getCategoryAtPoint(point: { x: number; y: number }): TimelineItemCategory | null {
        // There is nothing to do if we have no draw plan as we have no rendered categories.
        if (!this._drawPlan) {
            return null;
        }

        // Do not get items for points that overflow the vertical constraints of the legend view.
        if (point.y < this._lastDrawYPosition || point.y > this._lastDrawYPosition + this._drawPlan.height) {
            return null;
        }

        // Iterate over each category in the legend to see if the point is within the bounds of the category.
        for (const categoryDrawPlan of this._drawPlan.categoryDrawPlans) {
            if (
                point.x >= categoryDrawPlan.xPositionStart &&
                point.x <= categoryDrawPlan.xPositionEnd &&
                point.y >= categoryDrawPlan.yPositionStart + this._lastDrawYPosition &&
                point.y <= categoryDrawPlan.yPositionEnd + this._lastDrawYPosition
            ) {
                return categoryDrawPlan.category;
            }
        }

        // We did not find an category at the specified point.
        return null;
    }
}
