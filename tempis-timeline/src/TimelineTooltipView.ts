import { DateFormatter } from "./DateFormatter";
import { TempisTimelineTooltipOptions } from "./TempisTimelineOptions";
import { TimelineDataView } from "./TimelineDataView";
import { TimelineItem } from "./TimelineItem";
import { isNullOrUndefined } from "./Utilities";

type ActiveTooltip = {
    itemId: number;
    element: HTMLDivElement;
}

/**
 * A class responsible for tracking mouse movement over the timeline canvas and displaying tooltips.
 */
export class TimelineTooltipView {
    /** The timeline canvas. */
    private readonly _canvas: HTMLCanvasElement;

    /** The timeline data view. */
    private readonly _dataView: TimelineDataView;

    /** The date formatter. */
    private readonly _dateFormatter: DateFormatter;

    /** The tooltip options. */
    private readonly _options: TempisTimelineTooltipOptions;

    /** The active tooltip element. */
    private _activeTooltipElement: HTMLDivElement | null = null;

    /**
     * Creates a new instance of the TimelineTooltipView class.
     * @param canvas The timeline canvas.
     * @param dataView The timeline data view.
     * @param dateFormatter The date formatter.
     * @param options The tooltip options.
     */
    public constructor(canvas: HTMLCanvasElement, dataView: TimelineDataView, dateFormatter: DateFormatter, options: TempisTimelineTooltipOptions = {}) {
        this._canvas = canvas;
        this._dataView = dataView;
        this._dateFormatter = dateFormatter;
        this._options = options;

        this._createCanvasEventHandlers();
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

        this._canvas.addEventListener('pointermove', (event) => {
            // There is nothing to do if tooltips are not enabled.
            if (!isNullOrUndefined(this._options.enabled) && !this._options.enabled) {
                return;
            }

            // TODO If we have no active tooltip element then clear the current tooltip timer if there is one.
            
            // Try to find the item at mouse position.
            const item = this._dataView.getItemAtPoint(getMouseOrPointerPosition(event));

            // If we are not hovering over an item then we should clear the tooltip element id there is one and any pending timer.
            if (!item) {
                this._clearTooltipElement();
            } else {
                // If we are hovering over an item then we should create a tooltip element if there is not one already.
                if (!this._activeTooltipElement) {
                    this._createTooltipElement(item);
                }

                // Update the tooltip element position.
                this._updateTooltipPosition(event.clientX, event.clientY);
            }
        });

        // TODO Add a handler for the cursor moving off of the canvas to clear up any active tooltip.
    }

    private _createTooltipShowTimer(item: TimelineItem, posX: number, posY: number) {
        const timeout = setTimeout(() => {
            if (!this._activeTooltipElement) {
                // Create the tooltip element.
                this._createTooltipElement(item);

                 // Update the tooltip element position.
                this._updateTooltipPosition(posX, posY);
            }
        }, this._options.delay ?? 0);
    }

    private _createTooltipElement(item: TimelineItem): void {
        // There is nothing to do if we have already have a tooltip element.
        if (this._activeTooltipElement) {
            return;
        }

        // TODO Handle tooltip template.

        this._activeTooltipElement = document.createElement('div');
        this._activeTooltipElement.classList.add('tempis-timeline-tooltip');

        // Default styles
        Object.assign(this._activeTooltipElement.style, {
            position: "fixed",
            pointerEvents: "none",
            background: "rgba(0,0,0,0.7)",
            color: "#fff",
            padding: "4px 8px",
            margin: "10px",
            borderRadius: "5px",
            fontSize: "12px",
            zIndex: "9999"
        });

        // TODO Remove
        this._activeTooltipElement.textContent = item.caption;

        document.body.appendChild(this._activeTooltipElement);
    }

    private _updateTooltipPosition(x: number, y: number) {
        if (!this._activeTooltipElement) {
            return;
        }

        this._activeTooltipElement.style.left = `${x}px`;
        this._activeTooltipElement.style.top = `${y}px`;
    }

    private _clearTooltipElement() {
        if (!this._activeTooltipElement) {
            return;
        }

        this._activeTooltipElement.remove();
        this._activeTooltipElement = null;
    }
}