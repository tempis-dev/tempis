import { describe, it, expect } from "vitest";
import { TimelineDataSet } from "../TimelineDataSet";

describe("TimelineDataSet", () => {
    const baseOptions = {
        items: [
            { id: 1, label: "Item 1", start: "2026-01-05", end: "2026-01-15", grouping: "Group A", category: "cat-a" },
            { id: 2, label: "Item 2", start: "2026-01-10", end: "2026-01-20", grouping: "Group A" },
            { id: 3, label: "Item 3", start: "2026-01-08", end: "2026-01-18", grouping: "Group B", category: "cat-b" }
        ],
        categories: [
            { name: "cat-a", label: "Category A", style: { backgroundColor: "#ff0000" } },
            { name: "cat-b", label: "Category B", style: { backgroundColor: "#00ff00" } }
        ]
    };

    it("creates groupings from items", () => {
        const ds = new TimelineDataSet(baseOptions);
        expect(ds.groupings.length).toBe(2);
        expect(ds.groupings[0].group).toBe("Group A");
        expect(ds.groupings[1].group).toBe("Group B");
    });

    it("creates categories", () => {
        const ds = new TimelineDataSet(baseOptions);
        expect(ds.categories.length).toBe(2);
    });

    it("finds item by id", () => {
        const ds = new TimelineDataSet(baseOptions);
        expect(ds.getItemById(2)?.label).toBe("Item 2");
    });

    it("returns null for unknown item id", () => {
        const ds = new TimelineDataSet(baseOptions);
        expect(ds.getItemById(99)).toBeNull();
    });

    it("finds category by name", () => {
        const ds = new TimelineDataSet(baseOptions);
        expect(ds.getCategory("cat-a")?.label).toBe("Category A");
    });

    it("returns null for unknown category", () => {
        const ds = new TimelineDataSet(baseOptions);
        expect(ds.getCategory("unknown")).toBeNull();
    });

    it("calculates minDate from items", () => {
        const ds = new TimelineDataSet(baseOptions);
        expect(ds.minDate?.toISOString().slice(0, 10)).toBe("2026-01-05");
    });

    it("calculates maxDate from items", () => {
        const ds = new TimelineDataSet(baseOptions);
        expect(ds.maxDate?.toISOString().slice(0, 10)).toBe("2026-01-20");
    });

    it("returns null min/max for empty items", () => {
        const ds = new TimelineDataSet({ items: [] });
        expect(ds.minDate).toBeNull();
        expect(ds.maxDate).toBeNull();
    });

    it("returns selected items", () => {
        const ds = new TimelineDataSet({
            items: [
                { id: 1, label: "A", start: "2026-01-01", end: "2026-01-10", selected: true },
                { id: 2, label: "B", start: "2026-01-05", end: "2026-01-15" },
                { id: 3, label: "C", start: "2026-01-08", end: "2026-01-18", selected: true }
            ]
        });
        const selected = ds.getSelectedItems();
        expect(selected.length).toBe(2);
        expect(selected.map((i) => i.id)).toContain(1);
        expect(selected.map((i) => i.id)).toContain(3);
    });

    it("updates with new options", () => {
        const ds = new TimelineDataSet(baseOptions);
        expect(ds.groupings.length).toBe(2);

        ds.update({
            items: [{ id: 10, label: "New", start: "2026-03-01", end: "2026-03-10", grouping: "New Group" }]
        });
        expect(ds.groupings.length).toBe(1);
        expect(ds.groupings[0].group).toBe("New Group");
    });
});
