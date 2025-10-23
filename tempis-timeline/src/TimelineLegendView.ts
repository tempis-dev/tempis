import { TempisTimelineLegendOptions, TempisTimelineLegendPosition } from "./TempisTimelineOptions";
import { TimelineDataSet } from "./TimelineDataSet";
import { TimelineItemCategory } from "./TimelineItemCategory";
import { isNullOrUndefined } from "./Utilities";

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

    xPositionStart: number;

    xPositionEnd: number;

    yPositionStart: number;

    yPositionEnd: number;
}

/** The default amount of margin to use for each category. */
const DEFAULT_CATEGORY_MARGIN: number = 2;

export class TimelineLegendView {
    /** The timeline canvas. */
    private readonly _canvas: HTMLCanvasElement;

    /** The underlying dataset model. */
    private readonly _dataSet: TimelineDataSet;

    /** The timeline legend options. */
    private readonly _options: TempisTimelineLegendOptions;

    /** The current view draw plan. */
    private _drawPlan: LegendViewDrawPlan | null = null;

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

        // TODO Draw a test rectangle at the view position.
        context.fillStyle = "#595959";
        context.beginPath();
        context.roundRect(0, yPosition, this._drawPlan.width, this._drawPlan.height);
        context.fill();

        // TODO Draw the categories.
        context.fillStyle = "#ffffff";
        context.textBaseline = "top";
        context.fillText(this._dataSet.categories.map((category) => category.name).join(" - "), 6, yPosition + 6);
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

        // Create an array to hold the unpositioned legend elements.
        const elements: { category: TimelineItemCategory, width: number; height: number; labelHeight: number; markerLabelGap: number; }[] = [];

        // Calculate the label height to use for every category (to be consistent).
        const { actualBoundingBoxAscent, actualBoundingBoxDescent } = context.measureText("Category Label");
        const labelHeight = actualBoundingBoxAscent + actualBoundingBoxDescent;

        // Calculate the gap between the colour marker and the label, this should be derived from the text size.
        const markerLabelGap = labelHeight / 2; 

        // Create a legend element for each category with it's drawn width and height.
        for (const category of this._dataSet.categories) {
            // We shouldn't create elements for categories with no name.
            if (isNullOrUndefined(category.name) || category.name === "") {
                continue;
            }

            // Measure the category name text dimensions to get the width of the label.
            const { width } = context.measureText(category.name);

            elements.push({ 
                category, 
                width: width + markerLabelGap + (DEFAULT_CATEGORY_MARGIN * 2), 
                height: labelHeight + (DEFAULT_CATEGORY_MARGIN * 2),
                labelHeight,
                markerLabelGap
            });
        }

        // TODO Make an empty 2d array to hold our items, iterate over each element and when the sum of all widths of items in newest row > canvas width then start on new row

        this._drawPlan = {
            // TODO Fix this!
            height: 50,
            width: context.canvas.clientWidth,
            categoryDrawPlans: []
        };
    }
}