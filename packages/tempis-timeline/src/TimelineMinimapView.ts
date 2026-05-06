import { TempisTimelineMinimapOptions } from "./TempisTimelineOptions";
import { TimelineDataSet } from "./TimelineDataSet";
import { TimelineRangeView } from "./TimelineRangeView";

const DEFAULT_HEIGHT = 40;
const DEFAULT_BG = "rgba(128, 128, 128, 0.06)";
const DEFAULT_VIEWPORT_COLOR = "rgba(128, 128, 128, 0.15)";
const ITEM_BAR_HEIGHT = 4;
const ITEM_BAR_GAP = 1;
const PADDING_Y = 8;

/**
 * Renders a minimap overview bar showing the full timeline range
 * with a viewport indicator and item position markers.
 */
export class TimelineMinimapView {
    private readonly _options: TempisTimelineMinimapOptions;
    private readonly _dataSet: TimelineDataSet;
    private readonly _rangeView: TimelineRangeView;
    private readonly _isRTL: boolean;

    /** Whether the user is currently dragging the minimap viewport. */
    private _isDragging: boolean = false;

    /** The y position where the minimap was last drawn. */
    private _lastDrawY: number = 0;

    public constructor(
        dataSet: TimelineDataSet,
        rangeView: TimelineRangeView,
        isRTL: boolean,
        options?: TempisTimelineMinimapOptions
    ) {
        this._dataSet = dataSet;
        this._rangeView = rangeView;
        this._isRTL = isRTL;
        this._options = options ?? {};
    }

    /** Whether the minimap is enabled. */
    public get isEnabled(): boolean {
        return this._options.enabled === true;
    }

    /** The height of the minimap bar. */
    public get height(): number {
        return this.isEnabled ? (this._options.height ?? DEFAULT_HEIGHT) : 0;
    }

    /** Whether the user is currently dragging the minimap. */
    public get isDragging(): boolean {
        return this._isDragging;
    }

    /**
     * Draw the minimap at the specified y position.
     * @param context The canvas 2D context.
     * @param yPosition The y position to draw at (top of the minimap area).
     * @param width The available width.
     */
    public draw(context: CanvasRenderingContext2D, yPosition: number, width: number): void {
        if (!this.isEnabled) return;

        this._lastDrawY = yPosition;
        const height = this.height;
        const bgColor = this._options.backgroundColor ?? DEFAULT_BG;
        const viewportColor = this._options.viewportColor ?? DEFAULT_VIEWPORT_COLOR;

        // Draw background.
        context.fillStyle = bgColor;
        context.fillRect(0, yPosition, width, height);

        // Draw a subtle top border.
        context.strokeStyle = "rgba(128, 128, 128, 0.2)";
        context.lineWidth = 0.5;
        context.beginPath();
        context.moveTo(0, yPosition + 0.5);
        context.lineTo(width, yPosition + 0.5);
        context.stroke();

        // Get the full data range with some padding so items aren't jammed at the edges.
        const minDate = this._dataSet.minDate;
        const maxDate = this._dataSet.maxDate;
        if (!minDate || !maxDate || minDate.getTime() === maxDate.getTime()) return;

        const dataRange = maxDate.getTime() - minDate.getTime();
        const padding = dataRange * 0.05;
        const fullFrom = minDate.getTime() - padding;
        const fullTo = maxDate.getTime() + padding;
        const fullRange = fullTo - fullFrom;

        // Draw item indicators.
        const groupings = this._dataSet.groupings;
        const totalGroups = groupings.length;
        const availableHeight = height - PADDING_Y * 2;
        const rowHeight = Math.min(ITEM_BAR_HEIGHT + ITEM_BAR_GAP, availableHeight / Math.max(totalGroups, 1));

        for (let gi = 0; gi < totalGroups; gi++) {
            const grouping = groupings[gi];
            const barY = yPosition + PADDING_Y + gi * rowHeight;

            for (const item of grouping.items) {
                const itemStart = item.start.getTime();
                const itemEnd = item.end ? item.end.getTime() : itemStart;

                let x1: number;
                let x2: number;

                if (this._isRTL) {
                    x1 = width - ((itemEnd - fullFrom) / fullRange) * width;
                    x2 = width - ((itemStart - fullFrom) / fullRange) * width;
                } else {
                    x1 = ((itemStart - fullFrom) / fullRange) * width;
                    x2 = ((itemEnd - fullFrom) / fullRange) * width;
                }

                const barWidth = Math.max(2, x2 - x1);
                context.fillStyle = item.style.backgroundColor ?? "rgba(128, 128, 128, 0.4)";
                context.fillRect(x1, barY, barWidth, Math.min(ITEM_BAR_HEIGHT, rowHeight - ITEM_BAR_GAP));
            }
        }

        // Draw viewport indicator.
        const viewFrom = this._rangeView.fromDt.getTime();
        const viewTo = this._rangeView.toDt.getTime();

        let vpX1: number;
        let vpX2: number;

        if (this._isRTL) {
            vpX1 = width - ((viewTo - fullFrom) / fullRange) * width;
            vpX2 = width - ((viewFrom - fullFrom) / fullRange) * width;
        } else {
            vpX1 = ((viewFrom - fullFrom) / fullRange) * width;
            vpX2 = ((viewTo - fullFrom) / fullRange) * width;
        }

        // Clamp to canvas bounds.
        vpX1 = Math.max(0, vpX1);
        vpX2 = Math.min(width, vpX2);

        // Viewport fill.
        context.fillStyle = viewportColor;
        context.fillRect(vpX1, yPosition, vpX2 - vpX1, height);

        // Viewport border lines.
        context.strokeStyle = "rgba(128, 128, 128, 0.5)";
        context.lineWidth = 1;
        context.beginPath();
        context.moveTo(Math.round(vpX1) + 0.5, yPosition);
        context.lineTo(Math.round(vpX1) + 0.5, yPosition + height);
        context.moveTo(Math.round(vpX2) - 0.5, yPosition);
        context.lineTo(Math.round(vpX2) - 0.5, yPosition + height);
        context.stroke();
    }

    /**
     * Handle a pointer event on the minimap. Returns true if the event was consumed.
     * @param x The x position relative to the canvas.
     * @param y The y position relative to the canvas.
     * @param type The event type: "down", "move", or "up".
     * @param canvasWidth The canvas width.
     */
    public handlePointer(x: number, y: number, type: "down" | "move" | "up", canvasWidth: number): boolean {
        if (!this.isEnabled) return false;

        const minimapTop = this._lastDrawY;
        const minimapBottom = minimapTop + this.height;

        if (type === "down") {
            // Only start drag if the click is within the minimap area.
            if (y >= minimapTop && y <= minimapBottom) {
                this._isDragging = true;
                this._navigateToPosition(x, canvasWidth);
                return true;
            }
            return false;
        }

        if (type === "move" && this._isDragging) {
            this._navigateToPosition(x, canvasWidth);
            return true;
        }

        if (type === "up") {
            if (this._isDragging) {
                this._isDragging = false;
                return true;
            }
        }

        return false;
    }

    /**
     * Navigate the timeline so the viewport is centred on the given x position in the minimap.
     */
    private _navigateToPosition(x: number, canvasWidth: number): void {
        const minDate = this._dataSet.minDate;
        const maxDate = this._dataSet.maxDate;
        if (!minDate || !maxDate) return;

        const dataRange = maxDate.getTime() - minDate.getTime();
        const padding = dataRange * 0.05;
        const fullFrom = minDate.getTime() - padding;
        const fullTo = maxDate.getTime() + padding;
        const fullRange = fullTo - fullFrom;

        // Convert x position to a timestamp.
        let targetCenter: number;
        if (this._isRTL) {
            targetCenter = fullFrom + ((canvasWidth - x) / canvasWidth) * fullRange;
        } else {
            targetCenter = fullFrom + (x / canvasWidth) * fullRange;
        }

        // Centre the current viewport range on this timestamp.
        const currentRange = this._rangeView.toDt.getTime() - this._rangeView.fromDt.getTime();
        const newFrom = new Date(targetCenter - currentRange / 2);
        const newTo = new Date(targetCenter + currentRange / 2);

        this._rangeView.setRange(newFrom, newTo);
    }
}
