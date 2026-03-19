import { TempisTimelineTooltipOptions } from "./TempisTimelineOptions";
import { TimelineFont } from "./TimelineFont";
import { TimelineItem } from "./TimelineItem";
import { AdapterRegistry } from "./AdapterRegistry";

/** The default tooltip delay in millis. */
const DEFAULT_TOOLTIP_DELAY_MS = 500;

export class TimelineTooltip {
    /** The item that the tooltip is being shown for. */
    private readonly _item: TimelineItem;

    /** The timeline canvas. */
    private readonly _canvas: HTMLCanvasElement;

    /** The timeline font. */
    private readonly _font: TimelineFont;

    /** The flag defining whether the timeline is being rendered right-to-left. */
    private readonly _isRTL: boolean;

    /** The tooltip options. */
    private readonly _options: TempisTimelineTooltipOptions;

    /** The tooltip element. */
    private _activeElement: HTMLDivElement | null = null;

    /** The active show timer. */
    private _activeShowTimer: ReturnType<typeof setTimeout> | null = null;

    /** The tooltip x position. */
    private _posX: number = 0;

    /** The tooltip y position. */
    private _posY: number = 0;

    /**
     * Creates a new instance of the TimelineTooltip class and shows a tooltip for the given item.
     * @param item The tooltip item.
     * @param canvas The timeline canvas.
     * @param font The timeline font.
     * @param isRTL Whether the timeline is being rendered right-to-left.
     * @param options The tooltip options.
     * @param x The initial tooltip x position.
     * @param y The initial tooltip y position.
     */
    public constructor(
        item: TimelineItem,
        canvas: HTMLCanvasElement,
        font: TimelineFont,
        isRTL: boolean,
        options: TempisTimelineTooltipOptions,
        x: number,
        y: number
    ) {
        this._item = item;
        this._canvas = canvas;
        this._font = font;
        this._isRTL = isRTL;
        this._options = options;
        this._posX = x;
        this._posY = y;

        // Create the timer to show the tooltip.
        this._activeShowTimer = setTimeout(() => {
            this._activeShowTimer = null;
            this._createElement();
        }, options.delay ?? DEFAULT_TOOLTIP_DELAY_MS);
    }

    /**
     * Gets the tooltip identifier, which is just the tooltip item identifier.
     */
    public get id(): string | number {
        return this._item.id;
    }

    /**
     * Set the tooltip position.
     * @param x
     * @param y
     */
    public setPosition(x: number, y: number) {
        this._posX = x;
        this._posY = y;

        if (!this._activeElement) {
            return;
        }

        this._activeElement.style.left = `${x}px`;
        this._activeElement.style.top = `${y}px`;

        this._handleOverflow();
    }

    /**
     * Destroy the tooltip.
     */
    public destroy() {
        // Clear any active show timer.
        if (this._activeShowTimer) {
            clearTimeout(this._activeShowTimer);
        }

        // Remove the active tooltip from the DOM.
        this._activeElement?.remove();
        this._activeElement = null;
    }

    /**
     * Create the tooltip element.
     */
    private _createElement(): void {
        // There is nothing to do if we have already have a tooltip element.
        if (this._activeElement) {
            return;
        }

        // We shouldn't do anything if the user does not want ot show a tooltip for this item at this moment.
        if (this._options.shouldShow && !this._options.shouldShow(this._item.id)) {
            return;
        }

        // Create the tooltip element.
        this._activeElement = document.createElement("div");
        this._activeElement.classList.add("tempis-timeline-tooltip");

        // Apply the default styles for the tooltip element.
        Object.assign(this._activeElement.style, {
            position: "fixed",
            pointerEvents: "none",
            zIndex: "9999",
            font: this._font.font
        });

        // If the user has define a tooltip template then we may be using that to create the tooltip content instead of making a default tooltip.
        const customTooltipContent = this._options.template?.(this._item.id) ?? null;

        // If custom tooltip content was provided by a call to the template function then we should add it to our tooltip element. Otherwise, we should add the default tooltip content.
        if (customTooltipContent) {
            // We expect the user to have returned an element or a html string.
            if (customTooltipContent instanceof HTMLElement) {
                // Append the tooltip content element to the tooltip element.
                this._activeElement.appendChild(customTooltipContent);
            } else if (typeof customTooltipContent === "string") {
                // The tooltip content is a string that we will assume is valid html.
                this._activeElement.innerHTML = customTooltipContent;
            } else {
                throw new Error(
                    "The value returned from the tooltip template function was not a string or HTMLElement"
                );
            }
        } else {
            // Apply the default styles for the default tooltip element.
            Object.assign(this._activeElement.style, {
                background: "rgba(0,0,0,0.8)",
                color: "#fff",
                margin: "10px",
                padding: "0.2em",
                borderRadius: "5px",
                direction: this._isRTL ? "rtl" : "ltr"
            });

            const dateAdapter = AdapterRegistry.get();
            const dateFormat = this._options.dateFormat ?? "D MMMM HH:mm:ss";

            // Set the default tooltip content which is a header of the item label as well as the start date for PIT items and start and end date for range items.
            // TODO Improve the default tooltip content formatting and styling, as well as the rtl support.
            if (this._item.end) {
                this._activeElement.innerHTML = `<p style="margin:0.2em;font-weight:bold;">${this._item.label}</p><p style="margin:0.2em;">${dateAdapter.format(this._item.start.getTime(), dateFormat)} - ${dateAdapter.format(this._item.end.getTime(), dateFormat)}</p>`;
            } else {
                this._activeElement.innerHTML = `<p style="margin:0.2em;font-weight:bold;">${this._item.label}</p><p style="margin:0.2em;">${dateAdapter.format(this._item.start.getTime(), dateFormat)}</p>`;
            }
        }

        // Set the initial tooltip position.
        this._activeElement.style.left = `${this._posX}px`;
        this._activeElement.style.top = `${this._posY}px`;

        // Add the tooltip element to the document body.
        document.body.appendChild(this._activeElement);

        // Now that we have added the tooltip to the document we should handle any potential overflow.
        this._handleOverflow();
    }

    /**
     * Handle the tooltip overflow.
     * This will flip the tooltip to keep it in the defined bounds if the user has defined any overflow behavior
     */
    private _handleOverflow(): void {
        // There is nothing to do if we have no active tooltip element.
        if (!this._activeElement) {
            return;
        }

        // There is also nothing to do if the user has not defined any overflow behaviour.
        if (!this._options.overflowBehavior) {
            return;
        }

        let boundingRect: {
            left: number;
            top: number;
            width: number;
            height: number;
            right: number;
            bottom: number;
        };

        switch (this._options.overflowBehavior) {
            case "none":
                // There is also nothing to do if the user has explicitly set "none".
                return;

            case "canvas":
                boundingRect = this._canvas.getBoundingClientRect();
                break;

            case "viewport":
                boundingRect = {
                    left: 0,
                    top: 0,
                    right: window.innerWidth,
                    bottom: window.innerHeight,
                    width: window.innerWidth,
                    height: window.innerHeight
                };
                break;

            default:
                throw new Error(`Unknown overflow behavior: '${this._options.overflowBehavior}'`);
        }

        // Get the tooltip rect.
        const tooltipRect = this._activeElement.getBoundingClientRect();

        // Determine the x/y translation values we would need to potentially flip the tooltip to keep it in the defined bounds.
        const translateX = this._posX + tooltipRect.width >= boundingRect.right ? "-100%" : "0px";
        const translateY = this._posY + tooltipRect.height >= boundingRect.bottom ? "-100%" : "0px";

        // Apply the transform to the tooltip.
        this._activeElement.style.transform = `translate(${translateX}, ${translateY})`;
    }
}
