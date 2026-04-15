import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { TempisTimeline } from "../TempisTimeline";

const meta: Meta<typeof TempisTimeline> = {
    title: "Features/Categories",
    component: TempisTimeline,
    parameters: { layout: "padded" },
    args: {
        onItemClick: fn(),
        onItemHover: fn(),
    },
};
export default meta;

type Story = StoryObj<typeof TempisTimeline>;

export const WithLegend: Story = {
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

export const BottomLegend: Story = {
    args: {
        ...WithLegend.args,
        legend: { position: "bottom" },
    },
};
