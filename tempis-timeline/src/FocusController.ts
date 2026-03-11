import { TimelineDataSet } from "./TimelineDataSet";
import { TimelineDataView } from "./TimelineDataView";
import { TimelineRangeView } from "./TimelineRangeView";
import { TimelineLegendView } from "./TimelineLegendView";
import { isNullOrUndefined, parseDate, EasingFunction } from "./Utilities";

/**
 * Options for focusing the timeline.
 */
export interface FocusOptions {
    /** Focus on a specific item by ID. */
    id?: number | string;
    /** Center the timeline on a specific date. */
    date?: string | number | Date;
    /** Focus on a specific date range. */
    range?: [string | number | Date, string | number | Date];
    /** Enable smooth animation. */
    animate?: boolean;
    /** Animation duration in milliseconds. */
    duration?: number;
    /** Easing function to use. */
    easing?: EasingFunction;
    /** Control zoom behavior for range items. */
    zoom?: boolean | 'auto';
}

/**
 * Controller for managing timeline focus operations.
 */
export class FocusController {
    private readonly _canvas: HTMLCanvasElement;
    private readonly _dataSet: TimelineDataSet;
    private readonly _dataView: TimelineDataView;
    private readonly _rangeView: TimelineRangeView;
    private readonly _legendView: TimelineLegendView;
    private readonly _onDraw: () => void;

    /**
     * Creates a new instance of the FocusController class.
     * @param canvas The timeline canvas.
     * @param dataSet The timeline dataset.
     * @param dataView The timeline data view.
     * @param rangeView The timeline range view.
     * @param legendView The timeline legend view.
     * @param onDraw Callback to trigger a redraw.
     */
    public constructor(
        canvas: HTMLCanvasElement,
        dataSet: TimelineDataSet,
        dataView: TimelineDataView,
        rangeView: TimelineRangeView,
        legendView: TimelineLegendView,
        onDraw: () => void
    ) {
        this._canvas = canvas;
        this._dataSet = dataSet;
        this._dataView = dataView;
        this._rangeView = rangeView;
        this._legendView = legendView;
        this._onDraw = onDraw;
    }

    /**
     * Focuses the timeline on specific items, dates, or the full range.
     * @param options The focus options.
     */
    public focus(options?: FocusOptions): void {
        // Cancel any ongoing animations
        this._rangeView.cancelAnimation();
        this._dataView.cancelAnimation();

        const animate = options?.animate ?? false;
        const duration = options?.duration ?? 500;
        const easing = options?.easing ?? 'easeInOut';
        const zoom = options?.zoom ?? 'auto';

        if (!options || (!options.id && !options.date && !options.range)) {
            // No specific target was defined, focus on the full range
            this._focusOnFullRange(animate, duration, easing);
        } else if (!isNullOrUndefined(options.id)) {
            // Focus on a specific item
            this._focusOnItem(options.id!, animate, duration, easing, zoom);
        } else if (!isNullOrUndefined(options.date)) {
            // Focus on a specific date
            this._focusOnDate(options.date!, animate, duration, easing);
        } else if (options.range && options.range.length === 2) {
            // Focus on a specific range
            this._focusOnRange(options.range[0], options.range[1], animate, duration, easing);
        }
    }

    /**
     * Focuses on the full range of items.
     */
    private _focusOnFullRange(animate: boolean, duration: number, easing: EasingFunction): void {
        if (this._dataSet.minDate && this._dataSet.maxDate) {
            if (animate) {
                this._rangeView.animateToRange(
                    this._dataSet.minDate,
                    this._dataSet.maxDate,
                    duration,
                    easing,
                    () => this._onDraw()
                );
            } else {
                this._rangeView.setRange(this._dataSet.minDate, this._dataSet.maxDate);
                this._onDraw();
            }
        }
    }

    /**
     * Focuses on a specific item.
     */
    private _focusOnItem(
        itemId: string | number,
        animate: boolean,
        duration: number,
        easing: EasingFunction,
        zoom: boolean | 'auto'
    ): void {
        const item = this._dataSet.getItemById(itemId);

        if (!item) {
            throw new Error(`No item found with ID ${itemId}`);
        }

        let targetFrom: Date;
        let targetTo: Date;

        if (item.end) {
            // Range item - determine zoom behavior
            const currentRangeLength = this._rangeView.toDt.getTime() - this._rangeView.fromDt.getTime();
            const itemDuration = item.end.getTime() - item.start.getTime();

            let shouldZoom: boolean;

            if (zoom === true) {
                shouldZoom = true;
            } else if (zoom === false) {
                shouldZoom = false;
            } else {
                // Auto mode: zoom if item is at least 80% of current range
                shouldZoom = itemDuration >= currentRangeLength * 0.8;
            }

            if (shouldZoom) {
                targetFrom = item.start;
                targetTo = item.end;
            } else {
                // Keep current zoom level, center on item
                const itemCenter = item.start.getTime() + itemDuration / 2;
                targetFrom = new Date(itemCenter - currentRangeLength / 2);
                targetTo = new Date(itemCenter + currentRangeLength / 2);
            }
        } else {
            // Point-in-time item - keep current zoom level, center on item
            const currentRangeLength = this._rangeView.toDt.getTime() - this._rangeView.fromDt.getTime();
            targetFrom = new Date(item.start.getTime() - currentRangeLength / 2);
            targetTo = new Date(item.start.getTime() + currentRangeLength / 2);
        }

        if (animate) {
            // Pre-calculate target vertical scroll position WITHOUT drawing
            // Create a temporary draw plan to get item positions without actually drawing
            const context = this._canvas.getContext('2d')!;
            const drawPlan = this._dataView.createTemporaryDrawPlan(context, targetFrom, targetTo);
            
            // Calculate target scroll from the temporary draw plan
            let targetVerticalScroll: number | null = null;
            const itemPosition = this._getItemPositionFromDrawPlan(drawPlan, itemId);
            if (itemPosition !== null) {
                const maxDataViewHeight = this._calculateMaxDataViewHeight();
                const itemCenter = (itemPosition.yStart + itemPosition.yEnd) / 2;
                const viewCenter = maxDataViewHeight / 2;
                let scrollOffset = -(itemCenter - viewCenter);
                
                // Clamp to valid bounds
                const maxScroll = 0;
                const minScroll = Math.min(0, maxDataViewHeight - drawPlan.height);
                targetVerticalScroll = Math.max(minScroll, Math.min(maxScroll, scrollOffset));
            }

            // Start both animations simultaneously
            // Use a flag to ensure we only draw once per frame even though both animations trigger callbacks
            let drawScheduled = false;
            const scheduleDraw = () => {
                if (!drawScheduled) {
                    drawScheduled = true;
                    requestAnimationFrame(() => {
                        this._onDraw();
                        drawScheduled = false;
                    });
                }
            };

            this._rangeView.animateToRange(targetFrom, targetTo, duration, easing, scheduleDraw);

            if (targetVerticalScroll !== null) {
                this._dataView.animateScrollTo(targetVerticalScroll, duration, easing, scheduleDraw);
            }
        } else {
            this._rangeView.setRange(targetFrom, targetTo);
            this._scrollToItemIfNeeded(itemId, false);
            this._onDraw();
        }
    }

    /**
     * Focuses on a specific date.
     */
    private _focusOnDate(
        date: string | number | Date,
        animate: boolean,
        duration: number,
        easing: EasingFunction
    ): void {
        const parsedDate = parseDate(date);
        const currentRangeLength = this._rangeView.toDt.getTime() - this._rangeView.fromDt.getTime();
        const targetFrom = new Date(parsedDate.getTime() - currentRangeLength / 2);
        const targetTo = new Date(parsedDate.getTime() + currentRangeLength / 2);

        if (animate) {
            this._rangeView.animateToRange(targetFrom, targetTo, duration, easing, () => this._onDraw());
        } else {
            this._rangeView.centerOnDate(parsedDate);
            this._onDraw();
        }
    }

    /**
     * Focuses on a specific date range.
     */
    private _focusOnRange(
        start: string | number | Date,
        end: string | number | Date,
        animate: boolean,
        duration: number,
        easing: EasingFunction
    ): void {
        const startDate = parseDate(start);
        const endDate = parseDate(end);

        if (animate) {
            this._rangeView.animateToRange(startDate, endDate, duration, easing, () => this._onDraw());
        } else {
            this._rangeView.setRange(startDate, endDate);
            this._onDraw();
        }
    }

    /**
     * Scrolls the timeline vertically to bring an item into view if needed.
     */
    private _scrollToItemIfNeeded(itemId: string | number, animate: boolean): void {
        const maxDataViewHeight = this._calculateMaxDataViewHeight();

        this._dataView.scrollToItem(
            itemId,
            maxDataViewHeight,
            animate,
            500,
            'easeInOut',
            () => this._onDraw()
        );
    }

    /**
     * Calculates the target scroll offset for an item without actually scrolling.
     */
    private _calculateTargetScrollForItem(itemId: string | number): number | null {
        const itemPosition = this._dataView.getItemVerticalPosition(itemId);

        if (itemPosition === null) {
            return null;
        }

        const { yStart, yEnd } = itemPosition;
        const maxDataViewHeight = this._calculateMaxDataViewHeight();

        // Calculate target scroll offset to center the item
        const itemCenter = (yStart + yEnd) / 2;
        const viewCenter = maxDataViewHeight / 2;
        let targetScrollOffset = -(itemCenter - viewCenter);

        // Clamp the scroll offset to valid bounds
        const drawPlan = this._dataView['_drawPlan'];
        if (drawPlan) {
            const maxScroll = 0;
            const minScroll = Math.min(0, maxDataViewHeight - drawPlan.height);
            targetScrollOffset = Math.max(minScroll, Math.min(maxScroll, targetScrollOffset));
        }

        return targetScrollOffset;
    }

    /**
     * Calculates the maximum height available for the data view.
     */
    private _calculateMaxDataViewHeight(): number {
        const legendHeight = this._legendView.calculateRequiredHeight();
        const rangeHeight = this._rangeView.calculateRequiredHeight();

        let dataViewYPosition = 0;
        if (this._legendView.position === 'top') {
            dataViewYPosition += legendHeight;
        }
        if (['top', 'both'].includes(this._rangeView.position)) {
            dataViewYPosition += rangeHeight;
        }

        let maxDataViewHeight = this._canvas.clientHeight - dataViewYPosition;
        if (['bottom', 'both'].includes(this._rangeView.position)) {
            maxDataViewHeight -= rangeHeight;
        }
        if (this._legendView.position === 'bottom') {
            maxDataViewHeight -= legendHeight;
        }

        return maxDataViewHeight;
    }

    /**
     * Gets the vertical position of an item from a draw plan.
     */
    private _getItemPositionFromDrawPlan(
        drawPlan: any,
        itemId: string | number
    ): { yStart: number; yEnd: number } | null {
        for (const groupDrawPlan of drawPlan.groupDrawPlans) {
            for (const itemDrawPlan of groupDrawPlan.rows.flat()) {
                if (itemDrawPlan.item.id === itemId) {
                    return {
                        yStart: itemDrawPlan.yPositionStart,
                        yEnd: itemDrawPlan.yPositionEnd
                    };
                }
            }
        }
        return null;
    }
}