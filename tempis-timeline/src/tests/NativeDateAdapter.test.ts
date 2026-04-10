import { describe, it, expect } from "vitest";
import { NativeDateAdapter } from "../NativeDateAdapter";

const adapter = new NativeDateAdapter();

describe("NativeDateAdapter.parse", () => {
    it("parses an ISO string", () => {
        const ts = adapter.parse("2026-03-15T12:00:00Z");
        expect(ts).toBe(new Date("2026-03-15T12:00:00Z").getTime());
    });

    it("parses a Date object", () => {
        const d = new Date("2026-06-01T00:00:00Z");
        expect(adapter.parse(d)).toBe(d.getTime());
    });

    it("passes through a numeric timestamp", () => {
        expect(adapter.parse(1000)).toBe(1000);
    });

    it("returns null for null/undefined", () => {
        expect(adapter.parse(null as never)).toBeNull();
        expect(adapter.parse(undefined as never)).toBeNull();
    });

    it("returns null for NaN number", () => {
        expect(adapter.parse(NaN)).toBeNull();
    });

    it("returns null for invalid date string", () => {
        expect(adapter.parse("not-a-date")).toBeNull();
    });

    it("returns null for invalid Date object", () => {
        expect(adapter.parse(new Date("invalid"))).toBeNull();
    });
});

describe("NativeDateAdapter.startOf", () => {
    // Use a known timestamp: 2026-03-15T14:35:22.456Z (Sunday)
    const ts = new Date("2026-03-15T14:35:22.456Z").getTime();

    it("startOf year", () => {
        const result = new Date(adapter.startOf(ts, "year"));
        expect(result.getFullYear()).toBe(2026);
        expect(result.getMonth()).toBe(0);
        expect(result.getDate()).toBe(1);
        expect(result.getHours()).toBe(0);
        expect(result.getMinutes()).toBe(0);
        expect(result.getSeconds()).toBe(0);
        expect(result.getMilliseconds()).toBe(0);
    });

    it("startOf month", () => {
        const result = new Date(adapter.startOf(ts, "month"));
        expect(result.getMonth()).toBe(2); // March
        expect(result.getDate()).toBe(1);
        expect(result.getHours()).toBe(0);
    });

    it("startOf day", () => {
        const result = new Date(adapter.startOf(ts, "day"));
        expect(result.getDate()).toBe(15);
        expect(result.getHours()).toBe(0);
        expect(result.getMinutes()).toBe(0);
    });

    it("startOf hour", () => {
        const result = new Date(adapter.startOf(ts, "hour"));
        expect(result.getMinutes()).toBe(0);
        expect(result.getSeconds()).toBe(0);
    });

    it("startOf minute", () => {
        const result = new Date(adapter.startOf(ts, "minute"));
        expect(result.getSeconds()).toBe(0);
        expect(result.getMilliseconds()).toBe(0);
    });

    it("startOf second", () => {
        const result = new Date(adapter.startOf(ts, "second"));
        expect(result.getMilliseconds()).toBe(0);
    });

    it("startOf millisecond returns the same instant", () => {
        expect(adapter.startOf(ts, "millisecond")).toBe(ts);
    });

    it("throws for unknown unit", () => {
        expect(() => adapter.startOf(ts, "decade" as never)).toThrow("Unknown time unit");
    });
});

describe("NativeDateAdapter.add", () => {
    const ts = new Date("2026-01-15T10:00:00Z").getTime();

    it("adds years", () => {
        const result = new Date(adapter.add(ts, "year", 2));
        expect(result.getFullYear()).toBe(2028);
    });

    it("adds months", () => {
        const result = new Date(adapter.add(ts, "month", 3));
        expect(result.getMonth()).toBe(3); // April
    });

    it("adds months across year boundary", () => {
        const result = new Date(adapter.add(ts, "month", 12));
        expect(result.getFullYear()).toBe(2027);
        expect(result.getMonth()).toBe(0);
    });

    it("adds weeks", () => {
        const result = new Date(adapter.add(ts, "week", 1));
        expect(result.getDate()).toBe(22);
    });

    it("adds days", () => {
        const result = new Date(adapter.add(ts, "day", 5));
        expect(result.getDate()).toBe(20);
    });

    it("adds hours", () => {
        const result = new Date(adapter.add(ts, "hour", 3));
        expect(result.getUTCHours()).toBe(13);
    });

    it("adds minutes", () => {
        const result = new Date(adapter.add(ts, "minute", 45));
        expect(result.getUTCMinutes()).toBe(45);
    });

    it("adds seconds", () => {
        const result = new Date(adapter.add(ts, "second", 30));
        expect(result.getUTCSeconds()).toBe(30);
    });

    it("adds milliseconds", () => {
        expect(adapter.add(ts, "millisecond", 500)).toBe(ts + 500);
    });

    it("subtracts with negative amounts", () => {
        const result = new Date(adapter.add(ts, "day", -10));
        expect(result.getDate()).toBe(5);
    });

    it("throws for unknown unit", () => {
        expect(() => adapter.add(ts, "decade" as never, 1)).toThrow("Unknown time unit");
    });
});

describe("NativeDateAdapter.format", () => {
    const ts = new Date("2026-06-15T09:05:03.000Z").getTime();

    it("formats with a pattern", () => {
        const result = adapter.format(ts, "YYYY");
        expect(result).toBe("2026");
    });

    it("returns a non-empty string for default pattern", () => {
        const result = adapter.format(ts, "D MMMM HH:mm:ss");
        expect(result.length).toBeGreaterThan(0);
        expect(result).toContain("June");
    });
});
