import { GlobalFonts } from "@napi-rs/canvas";
import { resolve } from "path";

let defaultFontRegistered = false;

/**
 * Register a font file for use in timeline rendering.
 *
 * @param fontPath The absolute or relative path to the font file (.ttf, .otf, .woff).
 * @param family The font family name to register it under.
 */
export function registerFont(fontPath: string, family: string): void {
    GlobalFonts.registerFromPath(resolve(fontPath), family);
}

/**
 * Ensures the bundled default font is registered.
 * Called internally before rendering if no custom font has been set.
 */
export function ensureDefaultFont(): void {
    if (defaultFontRegistered) return;

    // Register the bundled Inter font as the default.
    const defaultFontPath = resolve(__dirname, "..", "fonts", "Inter-Regular.ttf");
    try {
        GlobalFonts.registerFromPath(defaultFontPath, "Inter");
        defaultFontRegistered = true;
    } catch {
        // Font file not found — user will need to register their own font.
    }
}
