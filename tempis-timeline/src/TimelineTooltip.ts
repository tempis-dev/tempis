import { DateFormatter } from "./DateFormatter";
import { TempisTimelineTooltipOptions } from "./TempisTimelineOptions";
import { TimelineFont } from "./TimelineFont";
import { TimelineItem } from "./TimelineItem";
import { isNullOrUndefined } from "./Utilities";

export class TimelineTooltip {
    /** The item that the tooltip is being shown for. */
    private readonly _item: TimelineItem;

    /** The date formatter. */
    private readonly _dateFormatter: DateFormatter;

    /** The timeline font. */
    private readonly _font: TimelineFont;

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
     * @param dateFormatter The date formatter.
     * @param font The timeline font.
     * @param options The tooltip options.
     * @param x The initial tooltip x position.
     * @param y The initial tooltip y position.
     */
    public constructor(item: TimelineItem, dateFormatter: DateFormatter, font: TimelineFont, options: TempisTimelineTooltipOptions, x: number, y: number) {
        this._item = item;
        this._dateFormatter = dateFormatter;
        this._font = font;
        this._options = options;
        this._posX = x;
        this._posY = y;

        // Create the timer to show the tooltip.
        this._activeShowTimer = setTimeout(() => {
            this._activeShowTimer = null;
            this._createElement();
        }, options.delay ?? 0);
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
        
        if (this._activeElement) {
            this._activeElement.style.left = `${x}px`;
            this._activeElement.style.top = `${y}px`;
        }
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
        this._activeElement = document.createElement('div');
        this._activeElement.classList.add('tempis-timeline-tooltip');

        // Apply the default styles for the tooltip element.
        Object.assign(this._activeElement.style, {
            position: "fixed",
            pointerEvents: "none",
            zIndex: "9999",
            font: this._font.font
        });

        // If the user has define a tooltip template then we will be using that to create the tooltip content instead of making a default tooltip.
        if (this._options.template) {
            // Call the template function to get the custom tooltip content element.
            const tooltipContentElement = this._options.template(this._item.id);

            // We should verify that the user actually provided an element.
            if (isNullOrUndefined(tooltipContentElement) || !(tooltipContentElement instanceof HTMLElement)) {
                throw new Error("The tooltip template function must return a HTMLElement");
            }

            // Append the tooltip content element to the tooltip element.
            this._activeElement.appendChild(tooltipContentElement);
        } else {
            // Apply the default styles for the default tooltip element.
            Object.assign(this._activeElement.style, {
                background: "rgba(0,0,0,0.8)",
                color: "#fff",
                margin: "10px",
                padding: "0.2em",
                borderRadius: "5px"
            });

            // Set the default tooltip content.
            // This will just be a header of the item caption as well as the start date for PIT items and start and end date for range items.
            if (this._item.end) {
                this._activeElement.innerHTML = `<p style="margin:0.2em;font-weight:bold;">${this._item.caption}</p><p style="margin:0.2em;">${this._dateFormatter.format(this._item.start)} - ${this._dateFormatter.format(this._item.end)}</p>`;
            } else {
                this._activeElement.innerHTML = `<p style="margin:0.2em;font-weight:bold;">${this._item.caption}</p><p style="margin:0.2em;">${this._dateFormatter.format(this._item.start)}</p>`;
            }
        }

        // Set the initial tooltip position.
        this._activeElement.style.left = `${this._posX}px`;
        this._activeElement.style.top = `${this._posY}px`;

        // Add the tooltip element to the document body.
        document.body.appendChild(this._activeElement);
    }
}