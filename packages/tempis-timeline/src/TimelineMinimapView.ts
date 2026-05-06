import { TempisTimelineMinimapOptions } from "./TempisTimelineOptions";
import { TimelineDataSet } from "./TimelineDataSet";
import { TimelineRangeView } from "./TimelineRangeView";

/** Default minimap height in pixels. */
const DEFAULT_MINIMAP_HEIGHT = 40;

/** Default background colour for the minimap area. */
const DEFAULT_MINIMAP_BACKGROUND = "rgba(128, 128, 128, 0.06)";

/** Default colour for the viewport indicator overlay. */
const DEFAULT_VIEWPORT_INDICATOR_COLOR = "rgba(128, 128, 128, 0.15)";

/** Height of each item indicator bar in pixels. */
const ITEM_INDICATOR_HEIGHT = 4;

/** Vertical gap between item indicator rows. */
const ITEM_INDICATOR_GAP = 1;

/** Vertical padding inside the minimap (top and bottom). */
const MINIMAP_VERTICAL_PADDING = 8;

/** Padding added to each side of the data range (as a fraction of the total range). */
const DATA_RANGE_PADDING_FRACTION = 0.05;

/** Minimum rendered width for an item indicator (ensures PIT items are visible). */
const MINIMUM_INDICATOR_WIDTH = 2;

/**
 * Renders a minimap overview bar at the bottom of the timeline canvas.
 *
 * The minimap provides a birds-eye view of the full data range, showing:
 * - Coloured bars representing item positions (grouped by row).
 * - A highlighted viewport indicator showing the currently visible range.
 *
 * Users can click or drag the minimap to navigate the timeline.
 * The minimap always shows ALL items regardless of category filtering or group collapse state.
 */
export class TimelineMinimapView {
    /** The minimap configuration options, or null if the minimap is disabled. */
    private readonly _options: TempisTimelineMinimapOptions | null;

    /** The timeline dataset containing all items and groupings. */
    private readonly _dataSet: TimelineDataSet;

    /** The range view used to read/set the current viewport position. */
    private readonly _rangeView: TimelineRangeView;

    /** Whether the timeline renders right-to-left. */
    private readonly _isRTL: boolean;

    /** Whether the user is currently dragging the minimap to navigate. */
    private _isDragging: boolean = false;

    /** The y position (in canvas coordinates) where the minimap was last drawn. Used for hit detection. */
    private _lastDrawYPosition: number = 0;

    /**
     * Creates a new minimap view.
     * @param dataSet The timeline dataset.
     * @param rangeView The range view for reading/setting the visible range.
     * @param isRTL Whether the timeline is rendering right-to-left.
     * @param options The minimap configuration options. If undefined, the minimap is disabled.
     */
    public constructor(
        dataSet: TimelineDataSet,
        rangeView: TimelineRangeView,
        isRTL: boolean,
        options?: TempisTimelineMinimapOptions
    ) {
        this._dataSet = dataSet;
        this._rangeView = rangeView;
        this._isRTL = isRTL;
        this._options = options ?? null;
    }

    /** Whether the minimap is enabled. Determined by the presence of a minimap config object. */
    public get isEnabled(): boolean {
        return this._options !== null;
    }

    /** The total height of the minimap bar in pixels. Returns 0 when disabled. */
    public get height(): number {
        return this.isEnabled ? (this._options!.height ?? DEFAULT_MINIMAP_HEIGHT) : 0;
    }

    /** Whether the user is currently dragging the minimap viewport indicator. */
    public get isDragging(): boolean {
        return this._isDragging;
    }

    /**
     * Draws the minimap at the specified y position on the canvas.
     * @param context The canvas 2D rendering context.
     * @param yPosition The y coordinate of the top edge of the minimap area.
     * @param canvasWidth The available canvas width.
     */
    public draw(context: CanvasRenderingContext2D, yPosition: number, canvasWidth: number): void {
        if (!this.isEnabled) return;

        this._lastDrawYPosition = yPosition;

        const minimapHeight = this.height;
        const backgroundColor = this._options!.backgroundColor ?? DEFAULT_MINIMAP_BACKGROUND;
        const viewportIndicatorColor = this._options!.viewportColor ?? DEFAULT_VIEWPORT_INDICATOR_COLOR;

        // Reset line dash to prevent state leaking from previous rendering (e.g. dashed item borders).
        context.setLineDash([]);

        // ── Background ──
        context.fillStyle = backgroundColor;
        context.fillRect(0, yPosition, canvasWidth, minimapHeight);

        // ── Top separator line ──
        context.strokeStyle = "rgba(128, 128, 128, 0.2)";
        context.lineWidth = 0.5;
        context.beginPath();
        context.moveTo(0, yPosition + 0.5);
        context.lineTo(canvasWidth, yPosition + 0.5);
        context.stroke();

        // ── Calculate the full data range (with padding) ──
        const earliestDate = this._dataSet.minDate;
        const latestDate = this._dataSet.maxDate;
        if (!earliestDate || !latestDate || earliestDate.getTime() === latestDate.getTime()) return;

        const dataRangeMs = latestDate.getTime() - earliestDate.getTime();
        const paddingMs = dataRangeMs * DATA_RANGE_PADDING_FRACTION;
        const minimapRangeStart = earliestDate.getTime() - paddingMs;
        const minimapRangeEnd = latestDate.getTime() + paddingMs;
        const minimapRangeMs = minimapRangeEnd - minimapRangeStart;

        // ── Draw item indicators ──
        // Each group gets a horizontal row. Items are drawn as small coloured bars
        // at their proportional position within the full data range.
        const groupings = this._dataSet.groupings;
        const groupCount = groupings.length;
        const availableContentHeight = minimapHeight - MINIMAP_VERTICAL_PADDING * 2;
        const rowHeight = Math.min(
            ITEM_INDICATOR_HEIGHT + ITEM_INDICATOR_GAP,
            availableContentHeight / Math.max(groupCount, 1)
        );

        for (let groupIndex = 0; groupIndex < groupCount; groupIndex++) {
            const grouping = groupings[groupIndex];
            const indicatorY = yPosition + MINIMAP_VERTICAL_PADDING + groupIndex * rowHeight;
            const indicatorHeight = Math.min(ITEM_INDICATOR_HEIGHT, rowHeight - ITEM_INDICATOR_GAP);

            for (const item of grouping.items) {
                const itemStartMs = item.start.getTime();
                const itemEndMs = item.end ? item.end.getTime() : itemStartMs;

                // Calculate the x position of the item indicator within the minimap.
                let indicatorX: number;
                let indicatorEndX: number;

                if (this._isRTL) {
                    indicatorX = canvasWidth - ((itemEndMs - minimapRangeStart) / minimapRangeMs) * canvasWidth;
                    indicatorEndX = canvasWidth - ((itemStartMs - minimapRangeStart) / minimapRangeMs) * canvasWidth;
                } else {
                    indicatorX = ((itemStartMs - minimapRangeStart) / minimapRangeMs) * canvasWidth;
                    indicatorEndX = ((itemEndMs - minimapRangeStart) / minimapRangeMs) * canvasWidth;
                }

                // Ensure a minimum width so even PIT items are visible as dots.
                const indicatorWidth = Math.max(MINIMUM_INDICATOR_WIDTH, indicatorEndX - indicatorX);

                context.fillStyle = item.style.backgroundColor ?? "rgba(128, 128, 128, 0.4)";
                context.fillRect(indicatorX, indicatorY, indicatorWidth, indicatorHeight);
            }
        }

        // ── Draw viewport indicator ──
        // Shows the currently visible range as a highlighted rectangle within the minimap.
        const viewportStartMs = this._rangeView.fromDt.getTime();
        const viewportEndMs = this._rangeView.toDt.getTime();

        let viewportX: number;
        let viewportEndX: number;

        if (this._isRTL) {
            viewportX = canvasWidth - ((viewportEndMs - minimapRangeStart) / minimapRangeMs) * canvasWidth;
            viewportEndX = canvasWidth - ((viewportStartMs - minimapRangeStart) / minimapRangeMs) * canvasWidth;
        } else {
            viewportX = ((viewportStartMs - minimapRangeStart) / minimapRangeMs) * canvasWidth;
            viewportEndX = ((viewportEndMs - minimapRangeStart) / minimapRangeMs) * canvasWidth;
        }

        // Clamp the viewport indicator to the canvas bounds.
        viewportX = Math.max(0, viewportX);
        viewportEndX = Math.min(canvasWidth, viewportEndX);

        // Viewport fill overlay.
        context.fillStyle = viewportIndicatorColor;
        context.fillRect(viewportX, yPosition, viewportEndX - viewportX, minimapHeight);

        // Viewport edge lines (rendered at half-pixel for crisp 1px lines).
        context.strokeStyle = "rgba(128, 128, 128, 0.5)";
        context.lineWidth = 1;
        context.beginPath();
        context.moveTo(Math.round(viewportX) + 0.5, yPosition);
        context.lineTo(Math.round(viewportX) + 0.5, yPosition + minimapHeight);
        context.moveTo(Math.round(viewportEndX) - 0.5, yPosition);
        context.lineTo(Math.round(viewportEndX) - 0.5, yPosition + minimapHeight);
        context.stroke();
    }

    /**
     * Handles a pointer event for minimap interaction (click/drag to navigate).
     * Returns true if the event was consumed by the minimap.
     *
     * @param x The x position relative to the canvas.
     * @param y The y position relative to the canvas.
     * @param eventType The pointer event type.
     * @param canvasWidth The canvas width (needed for position-to-timestamp conversion).
     * @returns Whether the event was handled by the minimap.
     */
    public handlePointer(x: number, y: number, eventType: "down" | "move" | "up", canvasWidth: number): boolean {
        if (!this.isEnabled) return false;

        const minimapTop = this._lastDrawYPosition;
        const minimapBottom = minimapTop + this.height;

        if (eventType === "down") {
            // Only start dragging if the pointer is within the minimap area.
            if (y >= minimapTop && y <= minimapBottom) {
                this._isDragging = true;
                this._navigateToPosition(x, canvasWidth);
                return true;
            }
            return false;
        }

        if (eventType === "move" && this._isDragging) {
            this._navigateToPosition(x, canvasWidth);
            return true;
        }

        if (eventType === "up" && this._isDragging) {
            this._isDragging = false;
            return true;
        }

        return false;
    }

    /**
     * Navigates the timeline so the current viewport is centred on the timestamp
     * corresponding to the given x position within the minimap.
     *
     * @param x The x position within the minimap (canvas coordinates).
     * @param canvasWidth The canvas width.
     */
    private _navigateToPosition(x: number, canvasWidth: number): void {
        const earliestDate = this._dataSet.minDate;
        const latestDate = this._dataSet.maxDate;
        if (!earliestDate || !latestDate) return;

        // Calculate the same padded range used for rendering.
        const dataRangeMs = latestDate.getTime() - earliestDate.getTime();
        const paddingMs = dataRangeMs * DATA_RANGE_PADDING_FRACTION;
        const minimapRangeStart = earliestDate.getTime() - paddingMs;
        const minimapRangeEnd = latestDate.getTime() + paddingMs;
        const minimapRangeMs = minimapRangeEnd - minimapRangeStart;

        // Convert the x position to a timestamp within the minimap range.
        let targetCenterMs: number;
        if (this._isRTL) {
            targetCenterMs = minimapRangeStart + ((canvasWidth - x) / canvasWidth) * minimapRangeMs;
        } else {
            targetCenterMs = minimapRangeStart + (x / canvasWidth) * minimapRangeMs;
        }

        // Centre the current viewport on the target timestamp (preserving the current zoom level).
        const currentViewportRangeMs = this._rangeView.toDt.getTime() - this._rangeView.fromDt.getTime();
        const newFrom = new Date(targetCenterMs - currentViewportRangeMs / 2);
        const newTo = new Date(targetCenterMs + currentViewportRangeMs / 2);

        this._rangeView.setRange(newFrom, newTo);
    }
}
