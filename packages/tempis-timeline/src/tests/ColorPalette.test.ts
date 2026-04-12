import { describe, it, expect } from "vitest";
import { ColorPalette } from "../ColorPalette";

describe("ColorPalette", () => {
    it("returns a non-empty default palette", () => {
        const palette = ColorPalette.get();
        expect(palette.length).toBeGreaterThan(0);
    });

    it("sets and gets a custom palette", () => {
        const original = [...ColorPalette.get()];
        const custom = ["#ff0000", "#00ff00", "#0000ff"];
        ColorPalette.set(custom);
        expect(ColorPalette.get()).toEqual(custom);
        // Restore
        ColorPalette.set(original);
    });

    it("throws for empty palette", () => {
        expect(() => ColorPalette.set([])).toThrow();
    });

    it("throws for non-array", () => {
        expect(() => ColorPalette.set(null as never)).toThrow();
    });
});
