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
    // Use a fixed local date to avoid timezone issues.
    // We construct via component parts so the test is timezone-independent.
    const date = new Date(2026, 5, 15, 9, 5, 3, 7); // June 15 2026, 09:05:03.007 local
    const ts = date.getTime();

    // ── Individual tokens ──

    it("YYYY — full year", () => {
        expect(adapter.format(ts, "YYYY")).toBe("2026");
    });

    it("MMMM — full month name", () => {
        expect(adapter.format(ts, "MMMM")).toBe("June");
    });

    it("MMM — short month name", () => {
        expect(adapter.format(ts, "MMM")).toBe("Jun");
    });

    it("MM — zero-padded month number", () => {
        expect(adapter.format(ts, "MM")).toBe("06");
    });

    it("D — day of month (no padding)", () => {
        expect(adapter.format(ts, "D")).toBe("15");
    });

    it("D — single digit day", () => {
        const d = new Date(2026, 0, 3, 12, 0, 0).getTime(); // Jan 3
        expect(adapter.format(d, "D")).toBe("3");
    });

    it("ddd — short weekday name", () => {
        // June 15 2026 is a Monday
        expect(adapter.format(ts, "ddd")).toBe("Mon");
    });

    it("HH — 24-hour hours, zero-padded", () => {
        expect(adapter.format(ts, "HH")).toBe("09");
    });

    it("HH — afternoon hours", () => {
        const d = new Date(2026, 5, 15, 14, 0, 0).getTime();
        expect(adapter.format(d, "HH")).toBe("14");
    });

    it("HH — midnight", () => {
        const d = new Date(2026, 5, 15, 0, 0, 0).getTime();
        expect(adapter.format(d, "HH")).toBe("00");
    });

    it("hh — 12-hour hours, zero-padded", () => {
        expect(adapter.format(ts, "hh")).toBe("09");
    });

    it("hh — afternoon converts to 12-hour", () => {
        const d = new Date(2026, 5, 15, 14, 0, 0).getTime();
        expect(adapter.format(d, "hh")).toBe("02");
    });

    it("hh — midnight shows as 12", () => {
        const d = new Date(2026, 5, 15, 0, 0, 0).getTime();
        expect(adapter.format(d, "hh")).toBe("12");
    });

    it("hh — noon shows as 12", () => {
        const d = new Date(2026, 5, 15, 12, 0, 0).getTime();
        expect(adapter.format(d, "hh")).toBe("12");
    });

    it("mm — minutes, zero-padded", () => {
        expect(adapter.format(ts, "mm")).toBe("05");
    });

    it("ss — seconds, zero-padded", () => {
        expect(adapter.format(ts, "ss")).toBe("03");
    });

    it("SSS — milliseconds, zero-padded to 3 digits", () => {
        expect(adapter.format(ts, "SSS")).toBe("007");
    });

    it("SSS — larger millisecond value", () => {
        const d = new Date(2026, 5, 15, 12, 0, 0, 456).getTime();
        expect(adapter.format(d, "SSS")).toBe("456");
    });

    it("A — uppercase AM/PM", () => {
        expect(adapter.format(ts, "A")).toBe("AM");
        const pm = new Date(2026, 5, 15, 14, 0, 0).getTime();
        expect(adapter.format(pm, "A")).toBe("PM");
    });

    it("a — lowercase am/pm", () => {
        expect(adapter.format(ts, "a")).toBe("am");
        const pm = new Date(2026, 5, 15, 14, 0, 0).getTime();
        expect(adapter.format(pm, "a")).toBe("pm");
    });

    // ── Composite patterns ──

    it("D MMMM HH:mm:ss — default tooltip pattern", () => {
        expect(adapter.format(ts, "D MMMM HH:mm:ss")).toBe("15 June 09:05:03");
    });

    it("ddd D MMMM — day with weekday", () => {
        expect(adapter.format(ts, "ddd D MMMM")).toBe("Mon 15 June");
    });

    it("MMMM YYYY — month and year", () => {
        expect(adapter.format(ts, "MMMM YYYY")).toBe("June 2026");
    });

    it("HH:mm — time only", () => {
        expect(adapter.format(ts, "HH:mm")).toBe("09:05");
    });

    it("hh:mm A — 12-hour time with AM/PM", () => {
        expect(adapter.format(ts, "hh:mm A")).toBe("09:05 AM");
        const pm = new Date(2026, 5, 15, 21, 30, 0).getTime();
        expect(adapter.format(pm, "hh:mm A")).toBe("09:30 PM");
    });

    it("ddd D MMMM HH:mm — major unit label pattern", () => {
        expect(adapter.format(ts, "ddd D MMMM HH:mm")).toBe("Mon 15 June 09:05");
    });

    it("D MMMM HH:mm — major unit label pattern (no weekday)", () => {
        expect(adapter.format(ts, "D MMMM HH:mm")).toBe("15 June 09:05");
    });

    // ── Edge cases ──

    it("preserves literal text between tokens", () => {
        expect(adapter.format(ts, "YYYY/MM/D")).toBe("2026/06/15");
    });

    it("handles pattern with no tokens", () => {
        expect(adapter.format(ts, "hello world")).toBe("hello world");
    });

    it("handles empty pattern", () => {
        expect(adapter.format(ts, "")).toBe("");
    });

    // ── All months ──

    it("formats all 12 months correctly (MMMM)", () => {
        const expected = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        for (let m = 0; m < 12; m++) {
            const d = new Date(2026, m, 1).getTime();
            expect(adapter.format(d, "MMMM")).toBe(expected[m]);
        }
    });

    it("formats all 12 months correctly (MMM)", () => {
        const expected = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        for (let m = 0; m < 12; m++) {
            const d = new Date(2026, m, 1).getTime();
            expect(adapter.format(d, "MMM")).toBe(expected[m]);
        }
    });

    // ── All weekdays ──

    it("formats all 7 weekdays correctly (ddd)", () => {
        // 2026-06-14 is a Sunday
        const expected = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        for (let i = 0; i < 7; i++) {
            const d = new Date(2026, 5, 14 + i).getTime();
            expect(adapter.format(d, "ddd")).toBe(expected[i]);
        }
    });
});
