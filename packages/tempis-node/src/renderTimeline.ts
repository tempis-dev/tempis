import { createCanvas, Path2D, GlobalFonts } from "@napi-rs/canvas";
import { TempisTimeline, type TempisTimelineOptions } from "@tempis/timeline";
import { ensureDefaultFont } from "./fonts";

// Make Path2D available globally for the core library's PIT item rendering.
if (typeof globalThis.Path2D === "undefined") {
    (globalThis as any).Path2D = Path2D;
}

/** The maximum initial canvas height used when height is not specified. */
const MAX_INITIAL_HEIGHT = 10000;

/**
 * Options for rendering a timeline image on the server.
 */
export interface RenderTimelineOptions
    extends Omit<TempisTimelineOptions, "responsive" | "headless"> {
    /** The width of the output image in CSS pixels. */
    width: number;

    /** The height of the output image in CSS pixels. If omitted, the height is derived from the content. */
    height?: number;

    /** The device pixel ratio for the output. Defaults to 1. Use 2 for retina-quality images. */
    dpr?: number;

    /** The output image format. Defaults to "png". */
    format?: "png" | "jpeg" | "webp";

    /** The image quality for lossy formats (0-1). Defaults to 0.9. */
    quality?: number;

    /** Optional background colour (e.g. "#ffffff"). Transparent by default for PNG. */
    backgroundColor?: string;
}

/**
 * The result of a server-side timeline render.
 */
export interface RenderTimelineOutput {
    /** The rendered image as a Buffer. */
    buffer: Buffer;

    /** The MIME type of the output image. */
    mimeType: string;

    /** The final image width in CSS pixels. */
    width: number;

    /** The final image height in CSS pixels. */
    height: number;
}

/**
 * Renders a Tempis Timeline to an image buffer on the server.
 *
 * @param options The timeline options plus output dimensions and format.
 * @returns A promise that resolves with the image buffer and metadata.
 */
export async function renderTimeline(options: RenderTimelineOptions): Promise<RenderTimelineOutput> {
    const {
        width,
        height,
        dpr = 1,
        format = "png",
        quality = 0.9,
        backgroundColor,
        ...timelineOptions
    } = options;

    // Ensure the default font is registered.
    ensureDefaultFont();

    // Determine the canvas dimensions.
    const cssWidth = width;
    const cssHeight = height ?? MAX_INITIAL_HEIGHT;
    const pixelWidth = Math.round(cssWidth * dpr);
    const pixelHeight = Math.round(cssHeight * dpr);

    // Create the canvas at the target pixel dimensions.
    const canvas = createCanvas(pixelWidth, pixelHeight);
    const ctx = canvas.getContext("2d");

    // Apply DPR scaling so the core library draws in CSS pixel coordinates.
    ctx.scale(dpr, dpr);

    // Stub browser properties that the core library reads during rendering.
    stubCanvasProperties(canvas, cssWidth, cssHeight);

    // Construct the timeline in headless mode.
    const timeline = new TempisTimeline(canvas as unknown as HTMLCanvasElement, {
        ...timelineOptions,
        headless: true,
        responsive: false,
        verticalFill: height ? (timelineOptions.verticalFill ?? "fill-canvas") : "content",
    });

    // If height was not specified, we need to find the actual content height and re-render.
    let finalCssHeight = cssHeight;
    if (!height) {
        finalCssHeight = findContentHeight(canvas, dpr);

        // Destroy the initial timeline.
        timeline.destroy();

        // Create a correctly-sized canvas and re-render.
        const finalPixelWidth = Math.round(cssWidth * dpr);
        const finalPixelHeight = Math.round(finalCssHeight * dpr);
        const finalCanvas = createCanvas(finalPixelWidth, finalPixelHeight);
        const finalCtx = finalCanvas.getContext("2d");
        finalCtx.scale(dpr, dpr);
        stubCanvasProperties(finalCanvas, cssWidth, finalCssHeight);

        const finalTimeline = new TempisTimeline(finalCanvas as unknown as HTMLCanvasElement, {
            ...timelineOptions,
            headless: true,
            responsive: false,
            verticalFill: "fill-canvas",
        });

        // Draw the background if specified.
        if (backgroundColor) {
            finalCtx.save();
            finalCtx.resetTransform();
            finalCtx.fillStyle = backgroundColor;
            finalCtx.fillRect(0, 0, finalPixelWidth, finalPixelHeight);
            finalCtx.restore();
            finalCtx.scale(dpr, dpr);
            finalTimeline.redraw();
        }

        const buffer = await encodeCanvas(finalCanvas, format, quality);
        finalTimeline.destroy();

        return {
            buffer,
            mimeType: getMimeType(format),
            width: cssWidth,
            height: finalCssHeight,
        };
    }

    // Fixed height path — draw background if specified.
    if (backgroundColor) {
        ctx.save();
        ctx.resetTransform();
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, pixelWidth, pixelHeight);
        ctx.restore();
        ctx.scale(dpr, dpr);
        timeline.redraw();
    }

    const buffer = await encodeCanvas(canvas, format, quality);
    timeline.destroy();

    return {
        buffer,
        mimeType: getMimeType(format),
        width: cssWidth,
        height: cssHeight,
    };
}

/**
 * Stubs browser-specific properties on a @napi-rs/canvas canvas instance.
 */
function stubCanvasProperties(canvas: any, cssWidth: number, cssHeight: number): void {
    Object.defineProperty(canvas, "clientWidth", { get: () => cssWidth, configurable: true });
    Object.defineProperty(canvas, "clientHeight", { get: () => cssHeight, configurable: true });
    Object.defineProperty(canvas, "offsetWidth", { get: () => cssWidth, configurable: true });
    Object.defineProperty(canvas, "offsetHeight", { get: () => cssHeight, configurable: true });
    canvas.style = canvas.style || {};
    canvas.parentElement = null;
    canvas.setPointerCapture = () => {};
    canvas.releasePointerCapture = () => {};
    canvas.addEventListener = () => {};
    canvas.removeEventListener = () => {};
    canvas.getBoundingClientRect = () => ({
        left: 0, top: 0, right: cssWidth, bottom: cssHeight,
        width: cssWidth, height: cssHeight, x: 0, y: 0, toJSON: () => ({}),
    });
}

/**
 * Scans the canvas pixel data to find the last row with non-transparent content.
 * Returns the content height in CSS pixels.
 */
function findContentHeight(canvas: any, dpr: number): number {
    const ctx = canvas.getContext("2d");
    const pixelWidth = canvas.width;
    const pixelHeight = canvas.height;
    const imageData = ctx.getImageData(0, 0, pixelWidth, pixelHeight);
    const data = imageData.data;

    let lastRowWithContent = 0;
    for (let y = pixelHeight - 1; y >= 0; y--) {
        for (let x = 0; x < pixelWidth; x++) {
            const alpha = data[(y * pixelWidth + x) * 4 + 3];
            if (alpha > 0) {
                lastRowWithContent = y;
                break;
            }
        }
        if (lastRowWithContent > 0) break;
    }

    // Convert pixel row to CSS pixels and add a small margin.
    return Math.ceil((lastRowWithContent + 1) / dpr) + 2;
}

/**
 * Encodes the canvas to a buffer in the specified format.
 */
async function encodeCanvas(canvas: any, format: string, quality: number): Promise<Buffer> {
    switch (format) {
        case "jpeg":
            return Buffer.from(await canvas.encode("jpeg", Math.round(quality * 100)));
        case "webp":
            return Buffer.from(await canvas.encode("webp", Math.round(quality * 100)));
        case "png":
        default:
            return Buffer.from(await canvas.encode("png"));
    }
}

/**
 * Returns the MIME type for the given format.
 */
function getMimeType(format: string): string {
    switch (format) {
        case "jpeg": return "image/jpeg";
        case "webp": return "image/webp";
        case "png":
        default: return "image/png";
    }
}
