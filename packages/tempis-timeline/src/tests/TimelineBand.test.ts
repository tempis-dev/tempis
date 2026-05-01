import { describe, it, expect } from "vitest";
import { TimelineBand, DEFAULT_BAND_STYLE } from "../TimelineBand";

describe("TimelineBand", () => {
    it("constructs a range band", () => {
        const band = new TimelineBand({
            start: "2026-01-10",
            end: "2026-01-20"
        });
        expect(band.start).toBeInstanceOf(Date);
        expect(band.end).toBeInstanceOf(Date);
        expect(band.end!.getTime()).toBeGreaterThan(band.start.getTime());
    });

    it("constructs a PIT band (no end)", () => {
        const band = new TimelineBand({ start: "2026-03-15T12:00:00Z" });
        expect(band.start).toBeInstanceOf(Date);
        expect(band.end).toBeNull();
    });

    it("applies default style when none provided", () => {
        const band = new TimelineBand({ start: "2026-01-01" });
        expect(band.style.color).toBe(DEFAULT_BAND_STYLE.color);
        expect(band.style.opacity).toBe(DEFAULT_BAND_STYLE.opacity);
    });

    it("merges custom style with defaults", () => {
        const band = new TimelineBand({
            start: "2026-01-01",
            style: { color: "#ff0000" }
        });
        expect(band.style.color).toBe("#ff0000");
        expect(band.style.opacity).toBe(DEFAULT_BAND_STYLE.opacity); // default preserved
    });

    it("exposes the original definition", () => {
        const def = { start: "2026-01-01", end: "2026-01-10" };
        const band = new TimelineBand(def);
        expect(band.definition).toBe(def);
    });
});

describe("DEFAULT_BAND_STYLE", () => {
    it("has expected defaults", () => {
        expect(DEFAULT_BAND_STYLE.color).toBeDefined();
        expect(DEFAULT_BAND_STYLE.opacity).toBeGreaterThan(0);
        expect(DEFAULT_BAND_STYLE.opacity).toBeLessThanOrEqual(1);
    });
});

describe("TimelineBand — border styles", () => {
    it("accepts borderColor in style", () => {
        const band = new TimelineBand({
            start: "2026-01-01",
            style: { borderColor: "#ff0000" }
        });
        expect(band.style.borderColor).toBe("#ff0000");
    });

    it("accepts borderThickness in style", () => {
        const band = new TimelineBand({
            start: "2026-01-01",
            style: { borderThickness: 2 }
        });
        expect(band.style.borderThickness).toBe(2);
    });

    it("preserves other defaults when setting border style", () => {
        const band = new TimelineBand({
            start: "2026-01-01",
            style: { borderColor: "#00ff00" }
        });
        expect(band.style.color).toBe(DEFAULT_BAND_STYLE.color);
        expect(band.style.opacity).toBe(DEFAULT_BAND_STYLE.opacity);
    });
});
