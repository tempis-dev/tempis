import type { Meta, StoryObj } from "@storybook/react";
import { useRef, useState } from "react";
import { TempisTimeline } from "../TempisTimeline";
import type { TempisTimelineRef, TempisTimelineItem } from "../index";

const meta: Meta<typeof TempisTimeline> = {
    title: "TempisTimeline",
    component: TempisTimeline,
    parameters: { layout: "padded" },
};
export default meta;

type Story = StoryObj<typeof TempisTimeline>;

// ── Basic ──

export const Basic: Story = {
    args: {
        responsive: true,
        height: 350,
        items: [
            { id: 1, label: "Design", start: "2026-01-05", end: "2026-01-15", grouping: "Frontend" },
            { id: 2, label: "Build", start: "2026-01-12", end: "2026-01-28", grouping: "Frontend" },
            { id: 3, label: "Launch", start: "2026-01-30", grouping: "Frontend" },
            { id: 4, label: "API", start: "2026-01-08", end: "2026-01-25", grouping: "Backend" },
            { id: 5, label: "Testing", start: "2026-01-20", end: "2026-01-29", grouping: "Backend" },
        ],
        range: { start: "2026-01-01", end: "2026-02-01", position: "bottom" },
    },
};

// ── Categories ──

export const Categories: Story = {
    args: {
        responsive: true,
        height: 400,
        categories: [
            { name: "dev", label: "Development", style: { backgroundColor: "#6366f1", fontColor: "#fff" } },
            { name: "design", label: "Design", style: { backgroundColor: "#f43f5e", fontColor: "#fff" } },
            { name: "qa", label: "QA", style: { backgroundColor: "#10b981", fontColor: "#fff" } },
            { name: "milestone", label: "Milestone", style: { backgroundColor: "#f59e0b", fontColor: "#111" } },
        ],
        legend: { position: "top" },
        items: [
            { id: 1, label: "Wireframes", start: "2026-02-01", end: "2026-02-14", category: "design", grouping: "Phase 1" },
            { id: 2, label: "UI Mockups", start: "2026-02-10", end: "2026-02-25", category: "design", grouping: "Phase 1" },
            { id: 3, label: "Auth Module", start: "2026-02-15", end: "2026-03-10", category: "dev", grouping: "Phase 1" },
            { id: 4, label: "Dashboard", start: "2026-03-01", end: "2026-03-20", category: "dev", grouping: "Phase 2" },
            { id: 5, label: "Integration Tests", start: "2026-03-10", end: "2026-03-25", category: "qa", grouping: "Phase 2" },
            { id: 6, label: "Beta Launch", start: "2026-03-28", category: "milestone", grouping: "Phase 2" },
        ],
        range: { start: "2026-01-25", end: "2026-04-05", position: "bottom" },
    },
};

// ── Selection ──

export const Selection: Story = {
    args: {
        responsive: true,
        height: 350,
        selection: "multi",
        items: [
            { id: 1, label: "Task A", start: "2026-03-01", end: "2026-03-10", grouping: "Team 1" },
            { id: 2, label: "Task B", start: "2026-03-05", end: "2026-03-15", grouping: "Team 1" },
            { id: 3, label: "Task C", start: "2026-03-08", end: "2026-03-20", grouping: "Team 2" },
            { id: 4, label: "Task D", start: "2026-03-12", end: "2026-03-22", grouping: "Team 2" },
            { id: 5, label: "Deadline", start: "2026-03-25", grouping: "Team 2" },
        ],
        range: { start: "2026-02-25", end: "2026-04-01", position: "bottom" },
    },
};

// ── Focus with Ref ──

function FocusDemo() {
    const ref = useRef<TempisTimelineRef>(null);
    const items: TempisTimelineItem[] = [
        { id: "design", label: "Design Sprint", start: "2026-04-01", end: "2026-04-14", grouping: "Product" },
        { id: "build", label: "Build", start: "2026-04-10", end: "2026-05-05", grouping: "Engineering" },
        { id: "launch", label: "Launch", start: "2026-05-10", grouping: "Product" },
    ];

    return (
        <div>
            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                <button onClick={() => ref.current?.focus({ id: "design", animate: true, duration: 600 })}>
                    Focus Design
                </button>
                <button onClick={() => ref.current?.focus({ id: "build", animate: true, duration: 600 })}>
                    Focus Build
                </button>
                <button onClick={() => ref.current?.focus({ id: "launch", animate: true, duration: 600 })}>
                    Focus Launch
                </button>
                <button onClick={() => ref.current?.focus({ animate: true, duration: 800 })}>
                    Show All
                </button>
            </div>
            <TempisTimeline
                ref={ref}
                responsive
                height={300}
                items={items}
                range={{ start: "2026-03-25", end: "2026-05-15", position: "bottom" }}
            />
        </div>
    );
}

export const Focus: Story = {
    render: () => <FocusDemo />,
};

// ── Reactive Items ──

function ReactiveDemo() {
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
            <div style={{ marginBottom: 12 }}>
                <button onClick={addItem}>Add Item ({items.length} items)</button>
                <button onClick={() => setItems([])} style={{ marginLeft: 8 }}>Clear</button>
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

export const ReactiveItems: Story = {
    render: () => <ReactiveDemo />,
};
