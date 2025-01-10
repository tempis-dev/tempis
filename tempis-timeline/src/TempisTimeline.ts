import { TempisTimelineOptions } from "./TempisTimelineOptions";

export class TempisTimeline {
    private readonly _context: CanvasRenderingContext2D;

    private readonly _options: TempisTimelineOptions;

    public constructor(context: string | CanvasRenderingContext2D | HTMLCanvasElement, options: TempisTimelineOptions) {
        this._options = options;

        this._context = this._getCanvasRenderingContext(context);
    }

    private _getCanvasRenderingContext(context: string | CanvasRenderingContext2D | HTMLCanvasElement): CanvasRenderingContext2D {
        if (!context) {
            throw new Error(`no canvas context defined`);
        } else if (context instanceof HTMLCanvasElement) {
            return context.getContext("2d")!;
        } else if (context instanceof CanvasRenderingContext2D) {
            return context;
        } else if (typeof context === "string") {
            // The context value is a string, so we can assume that it is a selector for our canvas element.
            const targetElement = document.querySelector(context);

            if (!targetElement || !(targetElement instanceof HTMLCanvasElement)) {
                throw new Error(`no HTMLCanvasElement element matching selector ${context}`);
            }

            return targetElement.getContext("2d")!;
        }

        throw new Error("whatcha doing this isn't a valid value!") 
    }
}