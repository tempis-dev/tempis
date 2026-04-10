import { describe, it, expect } from "vitest";
import { defaults, isNullOrUndefined, isValidDate, clamp, doDateRangesOverlap } from "../Utilities";

describe("defaults", () => {
    it("returns undefined for no arguments", () => {
        expect(defaults()).toBeUndefined();
    });

    it("returns the target unchanged when no sources", () => {
        const target = { a: 1 };
        expect(defaults(target)).toEqual({ a: 1 });
    });

    it("fills missing properties from source", () => {
        const result = defaults({ a: 1 } as Record<string, number>, { a: 99, b: 2 });
        expect(result).toEqual({ a: 1, b: 2 });
    });

    it("does not overwrite existing properties", () => {
        const result = defaults({ color: "red" }, { color: "blue", size: 10 });
        expect(result).toEqual({ color: "red", size: 10 });
    });

    it("overwrites null properties", () => {
        const result = defaults({ a: null as unknown as number }, { a: 5 });
        expect(result).toEqual({ a: 5 });
    });

    it("overwrites undefined properties", () => {
        const result = defaults({ a: undefined as unknown as number }, { a: 5 });
        expect(result).toEqual({ a: 5 });
    });

    it("preserves falsy values like 0 and empty string", () => {
        const result = defaults({ a: 0, b: "" }, { a: 99, b: "fallback" });
        expect(result).toEqual({ a: 0, b: "" });
    });

    it("merges multiple sources in order", () => {
        const result = defaults(
            { a: 1 } as Record<string, number>,
            { b: 2 } as Record<string, number>,
            { c: 3, b: 99 } as Record<string, number>
        );
        expect(result).toEqual({ a: 1, b: 2, c: 3 });
    });

    it("applies item style cascade: item > category > global > default", () => {
        const defaultStyle = { backgroundColor: "#000", fontColor: "#fff", padding: 10, borderRadius: 5 };
        const globalStyle = { padding: 12 };
        const categoryStyle = { backgroundColor: "#f00" };
        const itemStyle = { fontColor: "#0f0" };

        const result = defaults(itemStyle, categoryStyle, globalStyle, defaultStyle);

        expect(result).toEqual({
            fontColor: "#0f0",       // from item
            backgroundColor: "#f00", // from category
            padding: 12,             // from global
            borderRadius: 5          // from default
        });
    });
});

describe("isNullOrUndefined", () => {
    it("returns true for null", () => expect(isNullOrUndefined(null)).toBe(true));
    it("returns true for undefined", () => expect(isNullOrUndefined(undefined)).toBe(true));
    it("returns false for 0", () => expect(isNullOrUndefined(0)).toBe(false));
    it("returns false for empty string", () => expect(isNullOrUndefined("")).toBe(false));
    it("returns false for false", () => expect(isNullOrUndefined(false)).toBe(false));
});

describe("isValidDate", () => {
    it("returns true for a valid Date", () => expect(isValidDate(new Date())).toBe(true));
    it("returns false for an invalid Date", () => expect(isValidDate(new Date("nope"))).toBe(false));
    it("returns false for a string", () => expect(isValidDate("2026-01-01")).toBe(false));
    it("returns false for a number", () => expect(isValidDate(12345)).toBe(false));
    it("returns false for null", () => expect(isValidDate(null)).toBe(false));
});

describe("clamp", () => {
    it("returns value when within range", () => expect(clamp(5, 0, 10)).toBe(5));
    it("clamps to min", () => expect(clamp(-5, 0, 10)).toBe(0));
    it("clamps to max", () => expect(clamp(15, 0, 10)).toBe(10));
    it("works with only min", () => expect(clamp(-5, 0)).toBe(0));
    it("works with only max", () => expect(clamp(15, undefined, 10)).toBe(10));
    it("returns value when no bounds", () => expect(clamp(5)).toBe(5));
});

describe("doDateRangesOverlap", () => {
    const d = (s: string) => new Date(s);

    it("detects overlap when second starts inside first", () => {
        expect(doDateRangesOverlap(d("2026-01-01"), d("2026-01-10"), d("2026-01-05"), d("2026-01-15"))).toBe(true);
    });

    it("detects overlap when second ends inside first", () => {
        expect(doDateRangesOverlap(d("2026-01-05"), d("2026-01-15"), d("2026-01-01"), d("2026-01-10"))).toBe(true);
    });

    it("detects overlap when first is fully inside second", () => {
        expect(doDateRangesOverlap(d("2026-01-05"), d("2026-01-10"), d("2026-01-01"), d("2026-01-15"))).toBe(true);
    });

    it("returns false for non-overlapping ranges", () => {
        expect(doDateRangesOverlap(d("2026-01-01"), d("2026-01-05"), d("2026-01-10"), d("2026-01-15"))).toBe(false);
    });

    it("detects overlap at exact boundary", () => {
        expect(doDateRangesOverlap(d("2026-01-01"), d("2026-01-10"), d("2026-01-10"), d("2026-01-15"))).toBe(true);
    });
});
