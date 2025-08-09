
/**
 * The default global color palette.
 */
let defaultGlobalPalette: string[] = [
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
 * Sets the global color palette.
 * @param palette The global color palette.
 */
export function setGlobalPalette(palette: string[]): void {
    if (!Array.isArray(palette) || palette.length === 0) {
        throw new Error("Palette must be a non-empty array of color strings.");
    }

    defaultGlobalPalette = palette;
}

/**
 * Gets the global color palette.
 * @returns The global color palette.
 */
export function getGlobalPalette(): string[] {
    return defaultGlobalPalette;
}