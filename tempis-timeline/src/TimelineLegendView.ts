import { TempisTimelineAlignment, TempisTimelineLegendOptions, TempisTimelineLegendPosition, TempisTimelineMarkerStyle } from "./TempisTimelineOptions";
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

/** The default amount of margin to use for each legend category. */
const DEFAULT_CATEGORY_MARGIN: number = 4;

/** The default amount of padding to use for the legend. */
const DEFAULT_LEGEND_PADDING: number = 8;

export class TimelineLegendView {
    /** The timeline canvas. */
    private readonly _canvas: HTMLCanvasElement;

    /** The underlying dataset model. */
    private readonly _dataSet: TimelineDataSet;

    /** The timeline legend options. */
    private readonly _options: TempisTimelineLegendOptions;

    /** The current view draw plan. */
    private _drawPlan: LegendViewDrawPlan | null = null;

    /** Gets the y position from where this view was last drawn. */
    private _lastDrawYPosition: number = 0;

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
        return this._options.item?.markerStyle ?? "square-rounded";
    }

    /**
     * Calculate the height of this view when rendered.
     * @returns The height of this view when rendered.
     */
    public calculateRequiredHeight(): number {
        // Grab the canvas context.
        var context = this._canvas.getContext('2d')!;

        // We need to create a draw plan for this view, without one we cannot determine the height of this view.
        this._createViewDrawPlan(context);

        // Return the draw plan height if we have one, otherwise just return zero.
        return this._drawPlan?.height ?? 0;
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
            context.roundRect(categoryDrawPlan.xPositionStart + DEFAULT_CATEGORY_MARGIN, categoryDrawPlan.yPositionStart + DEFAULT_CATEGORY_MARGIN + yPosition, categoryDrawPlan.markerSize, categoryDrawPlan.markerSize, markerRadius);
            context.fill();
            
            // Draw the category label clipped to the available legend view width.
            context.fillStyle = "#595959";
            context.textBaseline = "middle";
            drawClippedText(
                context, 
                categoryDrawPlan.category.label,
                categoryDrawPlan.xPositionStart + DEFAULT_CATEGORY_MARGIN + categoryDrawPlan.markerSize + categoryDrawPlan.markerLabelGap, 
                categoryDrawPlan.yPositionStart + (categoryDrawPlan.height / 2) + yPosition,
                this._drawPlan.width - (categoryDrawPlan.xPositionStart + DEFAULT_CATEGORY_MARGIN + categoryDrawPlan.markerSize + categoryDrawPlan.markerLabelGap) - DEFAULT_LEGEND_PADDING
            )
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

        type SizedElement = { category: TimelineItemCategory, width: number; height: number; labelHeight: number; markerLabelGap: number; };

        // Create an array to hold the sized legend elements.
        const elements: SizedElement[] = [];

        // Calculate the label height to use for every category (to be consistent) and the item height.
        const { actualBoundingBoxAscent, actualBoundingBoxDescent } = context.measureText("Category Label");
        const labelHeight = actualBoundingBoxAscent + actualBoundingBoxDescent;
        const itemHeight = labelHeight + (DEFAULT_CATEGORY_MARGIN * 2);

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
                width: width + markerLabelGap + labelHeight + (DEFAULT_CATEGORY_MARGIN * 2), 
                height: itemHeight,
                labelHeight,
                markerLabelGap
            });
        }

        // Figure out the available width of the legend excluding the padding.
        const availableWidth = context.canvas.clientWidth - (DEFAULT_LEGEND_PADDING * 2);

        // Make a 2D array to represent the rows of legend elements.
        const elementRows: SizedElement[][] = [[]];
        let currentElementRowWidth = 0;

        // Iterate over each element and add it to our 2D array representing the rows of elements in our legend.
        for (const element of elements) {
            // If adding this element would exceed the available width, start a new row.
            // If this item would be the only one in the row and is still wider than the view then it should still get its own row and overflow.
            // If the canvas width is not wide enough to show an item (probably has a long label or canvas is narrow) then we should show a label ellipses at draw.
            if (currentElementRowWidth + element.width > availableWidth && elementRows[elementRows.length - 1].length > 0) {
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
            if (this.alignment === "center") {
                currentXPosition = Math.max(0, (availableWidth / 2) - (rowTotalWidth / 2));
            } else if (this.alignment === "end") {
                currentXPosition = Math.max(0, availableWidth - rowTotalWidth);
            }

            // Iterate over each element in the row and create a category item plan with the the correct x/y start/end values.
            for (const element of elementRow) {
                categoryDrawPlans.push({
                    category: element.category,
                    markerSize: element.labelHeight,
                    markerLabelGap: element.markerLabelGap,
                    xPositionStart: currentXPosition + DEFAULT_LEGEND_PADDING,
                    xPositionEnd: currentXPosition + element.width + DEFAULT_LEGEND_PADDING,
                    yPositionStart: (rowIndex * element.height) + DEFAULT_LEGEND_PADDING,
                    yPositionEnd: (rowIndex * element.height) + element.height + DEFAULT_LEGEND_PADDING,
                    width: element.width,
                    height: element.height
                });
                
                currentXPosition += element.width;
            }
        }

        // Set the draw plan.
        this._drawPlan = {
            height: (itemHeight * elementRows.length) + (DEFAULT_LEGEND_PADDING * 2),
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
            var rect = this._canvas.getBoundingClientRect();
            return {
                x: (event.clientX - rect.left) / (rect.right - rect.left) * this._canvas.clientWidth,
                y: (event.clientY - rect.top) / (rect.bottom - rect.top) * this._canvas.clientHeight
            };
        }

        // TODO Throttle the pointer move handler, we don't need it every move. 

        // Handle the pointer move event.
        this._canvas.addEventListener('pointermove', (event) => {
            // There is nothing to do if we have no draw plan as we have no rendered categories.
            if (!this._drawPlan) {
                return null;
            }

            const pointerPosition = getMouseOrPointerPosition(event);

            // Do not get items for points that overflow the vertical constraints of the data view.
            if (pointerPosition.y < this._lastDrawYPosition || pointerPosition.y > (this._lastDrawYPosition + this._drawPlan.height)) {
                return null;
            }

            // Attempt to get the category at the pointer position
            const targetCategory = this._getCategoryAtPoint(pointerPosition);

            // If we have a target category then we should set it as focused, otherwise we are unfocusing all categories.
            if (targetCategory) {
                this._dataSet.focusCategory(targetCategory.name);
            } else {
                this._dataSet.unfocusCategories();
            }
        });

        // Handle the pointer down event.
        this._canvas.addEventListener('pointerdown', (event) => {
            // There is nothing to do if we have no draw plan as we have no rendered categories.
            if (!this._drawPlan) {
                return null;
            }

            const pointerPosition = getMouseOrPointerPosition(event);

            // There is also nothing to do if the pointer event happened outside the bounds of this view.
            if (pointerPosition.y < this._lastDrawYPosition || pointerPosition.y > (this._lastDrawYPosition + this._drawPlan.height)) {
                return null;
            }

            // TODO Handle legend click.
        });

        // Add a handler for the cursor moving off of the canvas to ensure that we don't leave any categories focused.
        this._canvas.addEventListener('pointerout', (event) => {
            this._dataSet.unfocusCategories();
        });
    }

    /**
     * Gets the legend category at the specified point in the view, or null if there is no item at that point.
     * @param point The point at which to get the legend category.
     * @returns The item at the specified point, or null if there is no item at that point.
     */
    private _getCategoryAtPoint(point: { x: number; y: number; }): TimelineItemCategory | null {
        // There is nothing to do if we have no draw plan as we have no rendered categories.
        if (!this._drawPlan) {
            return null;
        }

        // Do not get items for points that overflow the vertical constraints of the legend view.
        if (point.y < this._lastDrawYPosition || point.y > (this._lastDrawYPosition + this._drawPlan.height)) {
            return null;
        }

        // Iterate over each category in the legend to see if the point is within the bounds of the category.
        for (const categoryDrawPlan of this._drawPlan.categoryDrawPlans) {
            if (point.x >= categoryDrawPlan.xPositionStart && point.x <= categoryDrawPlan.xPositionEnd 
                && point.y >= (categoryDrawPlan.yPositionStart + this._lastDrawYPosition) && point.y <= (categoryDrawPlan.yPositionEnd + this._lastDrawYPosition)) {
                return categoryDrawPlan.category;
            }
        }

        // We did not find an category at the specified point.
        return null;
    }
}