/**
 * Static registry for the global color palette.
 * Categories that don't specify an explicit backgroundColor will cycle through the colors in this palette.
 */
export class ColorPalette {
    /** The current global palette. */
    private static _palette: string[] = [
        "#7cb620",
        "#1982C4",
        "#6A4C93",
        "#FF595E",
        "#e2b436",
        "#BDBF09",
        "#2292A4",
        "#79B791",
        "#87255B",
        "#B370B0",
        "#646536",
        "#254441",
        "#EC4E20",
        "#429EA6"
    ];

    /**
     * Set the global color palette.
     * @param palette A non-empty array of color strings.
     */
    static set(palette: string[]): void {
        if (!Array.isArray(palette) || palette.length === 0) {
            throw new Error("Palette must be a non-empty array of color strings.");
        }
        ColorPalette._palette = palette;
    }

    /**
     * Get the current global color palette.
     * @returns The global color palette.
     */
    static get(): string[] {
        return ColorPalette._palette;
    }
}
