import { describe, it, expect } from "vitest";
import { TimelineItem, DEFAULT_ITEM_STYLE } from "../TimelineItem";

describe("TimelineItem", () => {
    const style = { ...DEFAULT_ITEM_STYLE };

    it("constructs a range item", () => {
        const item = new TimelineItem({ id: 1, start: "2026-01-10", end: "2026-01-20", label: "Task" }, style);
        expect(item.id).toBe(1);
        expect(item.label).toBe("Task");
        expect(item.start).toBeInstanceOf(Date);
        expect(item.end).toBeInstanceOf(Date);
        expect(item.end!.getTime()).toBeGreaterThan(item.start.getTime());
    });

    it("constructs a PIT item (no end)", () => {
        const item = new TimelineItem({ id: "pit-1", start: "2026-03-15T12:00:00Z" }, style);
        expect(item.id).toBe("pit-1");
        expect(item.end).toBeNull();
    });

    it("defaults label to empty string", () => {
        const item = new TimelineItem({ id: 1, start: "2026-01-01" }, style);
        expect(item.label).toBe("");
    });

    it("defaults category to null", () => {
        const item = new TimelineItem({ id: 1, start: "2026-01-01" }, style);
        expect(item.category).toBeNull();
    });

    it("reads category from definition", () => {
        const item = new TimelineItem({ id: 1, start: "2026-01-01", category: "urgent" }, style);
        expect(item.category).toBe("urgent");
    });

    it("exposes the resolved style", () => {
        const custom = { ...DEFAULT_ITEM_STYLE, backgroundColor: "#ff0000" };
        const item = new TimelineItem({ id: 1, start: "2026-01-01" }, custom);
        expect(item.style.backgroundColor).toBe("#ff0000");
    });

    it("defaults isSelected to false", () => {
        const item = new TimelineItem({ id: 1, start: "2026-01-01" }, style);
        expect(item.isSelected).toBe(false);
    });

    it("reads selected from definition", () => {
        const item = new TimelineItem({ id: 1, start: "2026-01-01", selected: true }, style);
        expect(item.isSelected).toBe(true);
    });

    it("allows toggling isSelected", () => {
        const item = new TimelineItem({ id: 1, start: "2026-01-01" }, style);
        item.isSelected = true;
        expect(item.isSelected).toBe(true);
        item.isSelected = false;
        expect(item.isSelected).toBe(false);
    });

    it("accepts numeric timestamps as start/end", () => {
        const ts = new Date("2026-06-01T00:00:00Z").getTime();
        const item = new TimelineItem({ id: 1, start: ts, end: ts + 86400000 }, style);
        expect(item.start.getTime()).toBe(ts);
        expect(item.end!.getTime()).toBe(ts + 86400000);
    });

    it("accepts Date objects as start/end", () => {
        const start = new Date("2026-01-01");
        const end = new Date("2026-01-31");
        const item = new TimelineItem({ id: 1, start, end }, style);
        expect(item.start.getTime()).toBe(start.getTime());
        expect(item.end!.getTime()).toBe(end.getTime());
    });

    it("exposes the original definition", () => {
        const def = { id: 42, start: "2026-01-01", label: "Test" };
        const item = new TimelineItem(def, style);
        expect(item.definition).toBe(def);
    });
});

describe("DEFAULT_ITEM_STYLE", () => {
    it("has expected default values", () => {
        expect(DEFAULT_ITEM_STYLE.backgroundColor).toBeDefined();
        expect(DEFAULT_ITEM_STYLE.fontColor).toBeDefined();
        expect(DEFAULT_ITEM_STYLE.padding).toBeGreaterThan(0);
        expect(DEFAULT_ITEM_STYLE.borderRadius).toBeGreaterThanOrEqual(0);
    });
});

describe("TimelineItem — border styles", () => {
    const baseStyle = { ...DEFAULT_ITEM_STYLE };

    it("accepts borderColor in style", () => {
        const itemStyle = { ...baseStyle, borderColor: "#ff0000" };
        const item = new TimelineItem({ id: 1, start: "2026-01-01", label: "Test" }, itemStyle);
        expect(item.style.borderColor).toBe("#ff0000");
    });

    it("accepts borderThickness in style", () => {
        const itemStyle = { ...baseStyle, borderThickness: 3 };
        const item = new TimelineItem({ id: 1, start: "2026-01-01", label: "Test" }, itemStyle);
        expect(item.style.borderThickness).toBe(3);
    });

    it("accepts borderStyle solid in style", () => {
        const itemStyle = { ...baseStyle, borderStyle: "solid" as const };
        const item = new TimelineItem({ id: 1, start: "2026-01-01", label: "Test" }, itemStyle);
        expect(item.style.borderStyle).toBe("solid");
    });

    it("accepts borderStyle dashed in style", () => {
        const itemStyle = { ...baseStyle, borderStyle: "dashed" as const };
        const item = new TimelineItem({ id: 1, start: "2026-01-01", label: "Test" }, itemStyle);
        expect(item.style.borderStyle).toBe("dashed");
    });

    it("accepts borderStyle dotted in style", () => {
        const itemStyle = { ...baseStyle, borderStyle: "dotted" as const };
        const item = new TimelineItem({ id: 1, start: "2026-01-01", label: "Test" }, itemStyle);
        expect(item.style.borderStyle).toBe("dotted");
    });

    it("accepts borderStyle dash-dot in style", () => {
        const itemStyle = { ...baseStyle, borderStyle: "dash-dot" as const };
        const item = new TimelineItem({ id: 1, start: "2026-01-01", label: "Test" }, itemStyle);
        expect(item.style.borderStyle).toBe("dash-dot");
    });

    it("accepts borderStyle long-dash in style", () => {
        const itemStyle = { ...baseStyle, borderStyle: "long-dash" as const };
        const item = new TimelineItem({ id: 1, start: "2026-01-01", label: "Test" }, itemStyle);
        expect(item.style.borderStyle).toBe("long-dash");
    });

    it("defaults borderStyle to undefined when not set", () => {
        const item = new TimelineItem({ id: 1, start: "2026-01-01", label: "Test" }, baseStyle);
        expect(item.style.borderStyle).toBeUndefined();
    });

    it("accepts borderRadius in style", () => {
        const itemStyle = { ...baseStyle, borderRadius: 10 };
        const item = new TimelineItem({ id: 1, start: "2026-01-01", label: "Test" }, itemStyle);
        expect(item.style.borderRadius).toBe(10);
    });
});

describe("TimelineItem — progress", () => {
    const baseStyle = { ...DEFAULT_ITEM_STYLE };

    it("returns null when progress is not defined", () => {
        const item = new TimelineItem({ id: 1, start: "2026-01-01", end: "2026-01-10" }, baseStyle);
        expect(item.progress).toBeNull();
    });

    it("returns the progress value when set", () => {
        const item = new TimelineItem({ id: 1, start: "2026-01-01", end: "2026-01-10", progress: 0.5 }, baseStyle);
        expect(item.progress).toBe(0.5);
    });

    it("clamps progress to 0 when negative", () => {
        const item = new TimelineItem({ id: 1, start: "2026-01-01", end: "2026-01-10", progress: -0.5 }, baseStyle);
        expect(item.progress).toBe(0);
    });

    it("clamps progress to 1 when greater than 1", () => {
        const item = new TimelineItem({ id: 1, start: "2026-01-01", end: "2026-01-10", progress: 1.5 }, baseStyle);
        expect(item.progress).toBe(1);
    });

    it("returns 0 for progress of 0", () => {
        const item = new TimelineItem({ id: 1, start: "2026-01-01", end: "2026-01-10", progress: 0 }, baseStyle);
        expect(item.progress).toBe(0);
    });

    it("returns 1 for progress of 1", () => {
        const item = new TimelineItem({ id: 1, start: "2026-01-01", end: "2026-01-10", progress: 1 }, baseStyle);
        expect(item.progress).toBe(1);
    });

    it("returns null when progress is undefined", () => {
        const item = new TimelineItem(
            { id: 1, start: "2026-01-01", end: "2026-01-10", progress: undefined },
            baseStyle
        );
        expect(item.progress).toBeNull();
    });
});
