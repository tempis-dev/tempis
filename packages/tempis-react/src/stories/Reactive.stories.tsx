import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { TempisTimeline } from "../TempisTimeline";
import type { TempisTimelineItem, TempisTimelineCategory } from "../index";

const meta: Meta<typeof TempisTimeline> = {
    title: "Reactive Data/Reactive Data",
    component: TempisTimeline,
    parameters: { layout: "padded" },
};
export default meta;

type Story = StoryObj<typeof TempisTimeline>;

// ── Dynamic Items ──

function DynamicItemsDemo() {
    const [items, setItems] = useState<TempisTimelineItem[]>([
        { id: 1, label: "Initial Task", start: "2026-06-01", end: "2026-06-10", grouping: "Sprint 1" },
    ]);

    const addItem = () => {
        const id = items.length + 1;
        const startDay = 1 + id * 3;
        const endDay = startDay + 7;
        setItems((prev) => [
            ...prev,
            {
                id,
                label: `Task ${id}`,
                start: `2026-06-${String(startDay).padStart(2, "0")}`,
                end: `2026-06-${String(Math.min(endDay, 30)).padStart(2, "0")}`,
                grouping: `Sprint ${Math.ceil(id / 3)}`,
            },
        ]);
    };

    return (
        <div>
            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                <button onClick={addItem}>Add Item ({items.length})</button>
                <button onClick={() => setItems([])}>Clear All</button>
            </div>
            <TempisTimeline
                responsive
                height={350}
                items={items}
                range={{ start: "2026-05-28", end: "2026-07-05", position: "bottom" }}
            />
        </div>
    );
}

export const DynamicItems: Story = { render: () => <DynamicItemsDemo /> };

// ── Toggle Categories ──

function ToggleCategoriesDemo() {
    const allCategories: TempisTimelineCategory[] = [
        { name: "dev", label: "Development", style: { backgroundColor: "#6366f1", fontColor: "#fff" } },
        { name: "design", label: "Design", style: { backgroundColor: "#f43f5e", fontColor: "#fff" } },
        { name: "qa", label: "QA", style: { backgroundColor: "#10b981", fontColor: "#fff" } },
    ];

    const [showCategories, setShowCategories] = useState(true);

    const items: TempisTimelineItem[] = [
        { id: 1, label: "Wireframes", start: "2026-02-01", end: "2026-02-14", category: "design" },
        { id: 2, label: "Auth Module", start: "2026-02-10", end: "2026-03-05", category: "dev" },
        { id: 3, label: "Unit Tests", start: "2026-02-20", end: "2026-03-10", category: "qa" },
        { id: 4, label: "Dashboard", start: "2026-03-01", end: "2026-03-20", category: "dev" },
        { id: 5, label: "E2E Tests", start: "2026-03-10", end: "2026-03-25", category: "qa" },
    ];

    return (
        <div>
            <div style={{ marginBottom: 12 }}>
                <button onClick={() => setShowCategories((v) => !v)}>
                    {showCategories ? "Remove Categories" : "Add Categories"}
                </button>
            </div>
            <TempisTimeline
                responsive
                height={350}
                items={items}
                categories={showCategories ? allCategories : undefined}
                legend={showCategories ? { position: "top" } : undefined}
                range={{ start: "2026-01-25", end: "2026-04-01", position: "bottom" }}
            />
        </div>
    );
}

export const ToggleCategories: Story = { render: () => <ToggleCategoriesDemo /> };
