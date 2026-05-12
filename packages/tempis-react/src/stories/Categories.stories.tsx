import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { TempisTimeline } from "../TempisTimeline";

const meta: Meta<typeof TempisTimeline> = {
    title: "Features/Categories",
    component: TempisTimeline,
    parameters: { layout: "padded" },
    args: {
        onItemClick: fn(),
        onItemHover: fn()
    }
};
export default meta;

type Story = StoryObj<typeof TempisTimeline>;

export const WithLegend: Story = {
    args: {
        height: 400,
        categories: [
            { name: "dev", label: "Development", style: { backgroundColor: "#6366f1", fontColor: "#fff" } },
            { name: "design", label: "Design", style: { backgroundColor: "#f43f5e", fontColor: "#fff" } },
            { name: "qa", label: "QA", style: { backgroundColor: "#10b981", fontColor: "#fff" } },
            { name: "milestone", label: "Milestone", style: { backgroundColor: "#f59e0b", fontColor: "#111" } }
        ],
        items: [
            {
                id: 1,
                label: "Wireframes",
                start: "2026-02-01",
                end: "2026-02-14",
                category: "design",
                grouping: "Phase 1"
            },
            {
                id: 2,
                label: "UI Mockups",
                start: "2026-02-10",
                end: "2026-02-25",
                category: "design",
                grouping: "Phase 1"
            },
            {
                id: 3,
                label: "Auth Module",
                start: "2026-02-15",
                end: "2026-03-10",
                category: "dev",
                grouping: "Phase 1"
            },
            { id: 4, label: "Dashboard", start: "2026-03-01", end: "2026-03-20", category: "dev", grouping: "Phase 2" },
            {
                id: 5,
                label: "Integration Tests",
                start: "2026-03-10",
                end: "2026-03-25",
                category: "qa",
                grouping: "Phase 2"
            },
            { id: 6, label: "Beta Launch", start: "2026-03-28", category: "milestone", grouping: "Phase 2" }
        ],
        options: {
            responsive: true,
            legend: { position: "top" },
            range: { start: "2026-01-25", end: "2026-04-05", position: "bottom" }
        }
    }
};

export const BottomLegend: Story = {
    args: {
        ...WithLegend.args,
        options: {
            ...WithLegend.args!.options,
            legend: { position: "bottom" }
        }
    }
};

export const WithDependencies: Story = {
    args: {
        height: 400,
        categories: [
            { name: "dev", label: "Development", style: { backgroundColor: "#6366f1", fontColor: "#fff" } },
            { name: "design", label: "Design", style: { backgroundColor: "#f43f5e", fontColor: "#fff" } },
            { name: "qa", label: "QA", style: { backgroundColor: "#10b981", fontColor: "#fff" } }
        ],
        items: [
            {
                id: 1,
                label: "Wireframes",
                start: "2026-02-01",
                end: "2026-02-12",
                category: "design",
                grouping: "Phase 1"
            },
            {
                id: 2,
                label: "Prototype",
                start: "2026-02-14",
                end: "2026-02-22",
                category: "design",
                grouping: "Phase 1"
            },
            { id: 3, label: "Build", start: "2026-02-24", end: "2026-03-14", category: "dev", grouping: "Phase 2" },
            { id: 4, label: "Testing", start: "2026-03-16", end: "2026-03-28", category: "qa", grouping: "Phase 2" }
        ],
        dependencies: [
            { source: 1, target: 2 },
            { source: 2, target: 3, style: { color: "#6366f1", lineStyle: "dashed" } },
            { source: 3, target: 4, style: { color: "#10b981" } }
        ],
        options: {
            responsive: true,
            legend: { position: "top" },
            grouping: { collapsible: true },
            range: { start: "2026-01-25", end: "2026-04-05", position: "bottom" }
        }
    }
};

export const WithProgress: Story = {
    args: {
        height: 400,
        categories: [
            { name: "complete", label: "Complete", style: { backgroundColor: "#10b981", fontColor: "#fff" } },
            { name: "active", label: "Active", style: { backgroundColor: "#6366f1", fontColor: "#fff" } },
            { name: "pending", label: "Pending", style: { backgroundColor: "#94a3b8", fontColor: "#fff" } }
        ],
        items: [
            { id: 1, label: "Research", start: "2026-02-01", end: "2026-02-14", category: "complete", progress: 1.0 },
            { id: 2, label: "Design", start: "2026-02-10", end: "2026-02-25", category: "active", progress: 0.7 },
            { id: 3, label: "Build", start: "2026-02-20", end: "2026-03-10", category: "active", progress: 0.3 },
            { id: 4, label: "Test", start: "2026-03-05", end: "2026-03-20", category: "pending", progress: 0 }
        ],
        options: {
            responsive: true,
            legend: { position: "top", markerStyle: "circle" },
            style: { item: { borderRadius: 6, fontColor: "#fff" } },
            range: { start: "2026-01-25", end: "2026-03-25", position: "bottom" }
        }
    }
};
