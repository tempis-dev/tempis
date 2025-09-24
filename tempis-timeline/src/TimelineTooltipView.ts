import { DateFormatter } from "./DateFormatter";
import { TempisTimelineTooltipOptions } from "./TempisTimelineOptions";
import { TimelineDataView } from "./TimelineDataView";
import { TimelineTooltip } from "./TimelineTooltip";
import { isNullOrUndefined } from "./Utilities";

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

    /** The active tooltip. */
    private _activeTooltip: TimelineTooltip | null = null;

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

            // If we are not hovering over an item then we should clear the active tooltip.
            if (!item) {
                this._activeTooltip?.destroy();
                this._activeTooltip = null;
            } else {
                // Do we already have an active tooltip?
                if (this._activeTooltip && this._activeTooltip.id === item.id) {
                    this._activeTooltip.setPosition(event.clientX, event.clientY);
                    return;
                } else if (this._activeTooltip && this._activeTooltip.id !== item.id) {
                    this._activeTooltip?.destroy();
                    this._activeTooltip = null;
                }

                // Create the tooltip.
                this._activeTooltip = new TimelineTooltip(item, this._dateFormatter, event.clientX, event.clientY, this._options.delay);
            }
        });

        // TODO Add a handler for the cursor moving off of the canvas to clear up any active tooltip.
    }
}