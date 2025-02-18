import { TempisTimelineFont } from "./TempisTimelineOptions";

/** The default values for any undefined font options. */
export const TIMELINE_FONT_DEFAULT_SIZE: number = 14;
export const TIMELINE_FONT_DEFAULT_FAMILY: string = "'Helvetica', 'Arial', sans-serif";
export const TIMELINE_FONT_DEFAULT_STYLE: string = "normal";
export const TIMELINE_FONT_DEFAULT_WEIGHT: "normal" | "bold" | "lighter" | "bolder" | number = "normal";

export class TimelineFont {
    /** The font options. */
    private readonly _options: TempisTimelineFont;

    public constructor(options: TempisTimelineFont = {}) {
        this._options = options;
    }

    /** Gets the font options. */
    public get options(): TempisTimelineFont {
        return this._options;
    }

    /** Gets the fully constructed CSS font string. */
    public get font(): string {
        const style = this._options.style ?? "";
        const weight = this._options.weight ?? "";
        const size = this._options.size ?? TIMELINE_FONT_DEFAULT_SIZE;
        const lineHeight = this._options.lineHeight ?? "";
        const family = this._options.family ?? TIMELINE_FONT_DEFAULT_FAMILY;

        return `${style} ${weight} ${size}px ${lineHeight} ${family}`;
    }

    /**
     * Gets the text metrics for the given string and context based on the font.
     * @param text 
     * @param context 
     * @returns The text metrics for the given string and context based on the font.
     */
    public getTextMetrics(text: string, context: CanvasRenderingContext2D): TextMetrics {
        // Our text must be a valid string.
        if (typeof text !== "string") {
            throw new Error("expected text to be defined.");
        }

        // Grab the original canvas context font.
        const originalFont = context.font;

        // Apply the font string to the canvas so that any metrics we get will be accurate.
        context.font = this.font;

        const textMetrics =  context.measureText(text);

        // Reapply the original font string.
        context.font = originalFont;

        return textMetrics;
    }
}