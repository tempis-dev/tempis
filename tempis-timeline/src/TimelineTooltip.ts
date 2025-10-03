import { DateFormatter } from "./DateFormatter";
import { TimelineFont } from "./TimelineFont";
import { TimelineItem } from "./TimelineItem";

export class TimelineTooltip {
    /** The item that the tooltip is being shown for. */
    private readonly _item: TimelineItem;

    /** The date formatter. */
    private readonly _dateFormatter: DateFormatter;

    /** The timeline font. */
    private readonly _font: TimelineFont;

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
     * @param x The initial tooltip x position.
     * @param y The initial tooltip y position.
     * @param showDelay The delay to wait before showing the tooltip element.
     */
    public constructor(item: TimelineItem, dateFormatter: DateFormatter, font: TimelineFont, x: number, y: number, showDelay: number = 0) {
        this._item = item;
        this._dateFormatter = dateFormatter;
        this._font = font;
        this._posX = x;
        this._posY = y;

        // Create the timer to show the tooltip.
        this._activeShowTimer = setTimeout(() => {
            this._activeShowTimer = null;
            this._createElement();
        }, showDelay);
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

        // TODO Handle tooltip template.

        this._activeElement = document.createElement('div');
        this._activeElement.classList.add('tempis-timeline-tooltip');

        // Apply the default styles for the default tooltip element.
        Object.assign(this._activeElement.style, {
            position: "fixed",
            pointerEvents: "none",
            background: "rgba(0,0,0,0.8)",
            color: "#fff",
            margin: "10px",
            padding: "0.3em",
            borderRadius: "5px",
            zIndex: "9999",
            font: this._font.font
        });

        // TODO Remove
        if (this._item.end) {
            this._activeElement.innerHTML = `<p style="margin:0.2em;font-weight:bold;">${this._item.caption}</p><p style="margin:0.2em;">${this._dateFormatter.format(this._item.start)} - ${this._dateFormatter.format(this._item.end)}</p>`;
        } else {
            this._activeElement.innerHTML = `<p style="margin:0.2em;font-weight:bold;">${this._item.caption}</p><p style="margin:0.2em;">${this._dateFormatter.format(this._item.start)}</p>`;
        }

        // Set the initial tooltip position.
        this._activeElement.style.left = `${this._posX}px`;
        this._activeElement.style.top = `${this._posY}px`;

        // Add the tooltip element to the document body.
        document.body.appendChild(this._activeElement);
    }
}