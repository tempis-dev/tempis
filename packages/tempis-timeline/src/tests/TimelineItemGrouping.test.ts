import { describe, it, expect } from "vitest";
import { TimelineItemGrouping } from "../TimelineItemGrouping";
import { TimelineItem, DEFAULT_ITEM_STYLE } from "../TimelineItem";

const style = { ...DEFAULT_ITEM_STYLE };

function makeItem(id: number, start: string, end?: string) {
    return new TimelineItem({ id, start, end, label: `Item ${id}` }, style);
}

describe("TimelineItemGrouping", () => {
    it("stores the group name", () => {
        const grouping = new TimelineItemGrouping("Group A", []);
        expect(grouping.group).toBe("Group A");
    });

    it("stores items", () => {
        const items = [makeItem(1, "2026-01-05", "2026-01-10"), makeItem(2, "2026-01-08", "2026-01-15")];
        const grouping = new TimelineItemGrouping("Group A", items);
        expect(grouping.items).toHaveLength(2);
    });

    it("sorts items by start date", () => {
        const items = [makeItem(1, "2026-01-15", "2026-01-20"), makeItem(2, "2026-01-05", "2026-01-10")];
        const grouping = new TimelineItemGrouping("Group A", items);
        expect(grouping.items[0].id).toBe(2);
        expect(grouping.items[1].id).toBe(1);
    });

    it("defaults isCollapsed to false", () => {
        const grouping = new TimelineItemGrouping("Group A", []);
        expect(grouping.isCollapsed).toBe(false);
    });

    it("allows setting isCollapsed", () => {
        const grouping = new TimelineItemGrouping("Group A", []);
        grouping.isCollapsed = true;
        expect(grouping.isCollapsed).toBe(true);
        grouping.isCollapsed = false;
        expect(grouping.isCollapsed).toBe(false);
    });

    it("returns selected items", () => {
        const items = [makeItem(1, "2026-01-05", "2026-01-10"), makeItem(2, "2026-01-08", "2026-01-15")];
        items[0].isSelected = true;
        const grouping = new TimelineItemGrouping("Group A", items);
        expect(grouping.selectedItems).toHaveLength(1);
        expect(grouping.selectedItems[0].id).toBe(1);
    });

    it("finds item by id", () => {
        const items = [makeItem(1, "2026-01-05", "2026-01-10"), makeItem(2, "2026-01-08", "2026-01-15")];
        const grouping = new TimelineItemGrouping("Group A", items);
        expect(grouping.getItemById(2)?.id).toBe(2);
        expect(grouping.getItemById(99)).toBeNull();
    });
});

describe("TimelineItemGrouping.getItemsInRange", () => {
    const items = [
        makeItem(1, "2026-01-05", "2026-01-10"),
        makeItem(2, "2026-01-15", "2026-01-20"),
        makeItem(3, "2026-02-01", "2026-02-10")
    ];
    const grouping = new TimelineItemGrouping("Group A", items);

    it("returns items overlapping the range", () => {
        const result = grouping.getItemsInRange(new Date("2026-01-08"), new Date("2026-01-18"));
        expect(result).toHaveLength(2);
        expect(result.map((i) => i.id)).toContain(1);
        expect(result.map((i) => i.id)).toContain(2);
    });

    it("excludes items outside the range", () => {
        const result = grouping.getItemsInRange(new Date("2026-01-08"), new Date("2026-01-12"));
        expect(result).toHaveLength(1);
        expect(result[0].id).toBe(1);
    });

    it("returns empty for non-overlapping range", () => {
        const result = grouping.getItemsInRange(new Date("2026-03-01"), new Date("2026-03-10"));
        expect(result).toHaveLength(0);
    });

    it("includes items at exact boundary", () => {
        const result = grouping.getItemsInRange(new Date("2026-01-10"), new Date("2026-01-15"));
        expect(result).toHaveLength(2);
    });

    it("handles PIT items within range", () => {
        const pitItems = [makeItem(10, "2026-01-12")];
        const g = new TimelineItemGrouping("PIT", pitItems);
        const result = g.getItemsInRange(new Date("2026-01-10"), new Date("2026-01-15"));
        expect(result).toHaveLength(1);
    });

    it("excludes PIT items outside range", () => {
        const pitItems = [makeItem(10, "2026-01-12")];
        const g = new TimelineItemGrouping("PIT", pitItems);
        const result = g.getItemsInRange(new Date("2026-01-13"), new Date("2026-01-20"));
        expect(result).toHaveLength(0);
    });
});
