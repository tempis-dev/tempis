import type { Meta, StoryObj } from "@storybook/react";
import { TempisTimeline } from "../TempisTimeline";

const items = [
    { id: 1, label: "Design", start: "2026-01-05", end: "2026-01-15", grouping: "Frontend" },
    { id: 2, label: "Build", start: "2026-01-12", end: "2026-01-28", grouping: "Frontend" },
    { id: 3, label: "API", start: "2026-01-08", end: "2026-01-25", grouping: "Backend" },
    { id: 4, label: "Testing", start: "2026-01-20", end: "2026-01-29", grouping: "Backend" },
    { id: 5, label: "Deploy", start: "2026-01-25", end: "2026-02-05", grouping: "DevOps" },
    { id: 6, label: "Monitor", start: "2026-01-28", end: "2026-02-10", grouping: "DevOps" }
];

const range = { start: "2026-01-01", end: "2026-02-15", position: "bottom" as const };

const meta: Meta<typeof TempisTimeline> = {
    title: "Layout/Layout",
    component: TempisTimeline,
    parameters: {
        layout: "padded",
        docs: {
            description: {
                component: "Layout options controlling vertical fill, stacking, range position, and text direction."
            }
        }
    }
};
export default meta;

type Story = StoryObj<typeof TempisTimeline>;

export const FillCanvas: Story = {
    args: { height: 450, items, options: { responsive: true, verticalFill: "fill-canvas", range } }
};

export const ContentHeight: Story = {
    args: { height: 450, items, options: { responsive: true, verticalFill: "content", range } }
};

export const CompactStacking: Story = {
    args: { height: 400, items, options: { responsive: true, stackMode: "compact", range } }
};

export const StableStacking: Story = {
    args: { height: 400, items, options: { responsive: true, stackMode: "stable", range } }
};

export const RTL: Story = {
    args: { height: 350, items, options: { responsive: true, rtl: true, range } }
};

export const RangeTop: Story = {
    args: { height: 350, items, options: { responsive: true, range: { ...range, position: "top" } } }
};

export const RangeBoth: Story = {
    args: { height: 400, items, options: { responsive: true, range: { ...range, position: "both" } } }
};

export const CollapsibleGroups: Story = {
    args: {
        height: 400,
        items,
        options: { responsive: true, verticalFill: "fill-canvas", grouping: { collapsible: true }, range }
    }
};
