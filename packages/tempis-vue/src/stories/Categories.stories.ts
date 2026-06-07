import type { Meta, StoryObj } from "@storybook/vue3";
import { TempisTimeline } from "../TempisTimeline";

const meta: Meta<typeof TempisTimeline> = {
    title: "Basics/Categories",
    component: TempisTimeline,
    parameters: { layout: "padded" },
};
export default meta;

type Story = StoryObj<typeof TempisTimeline>;

export const WithLegend: Story = {
    args: {
        height: 350,
        items: [
            { id: 1, label: "Wireframes", start: "2026-02-01", end: "2026-02-12", category: "design", grouping: "Phase 1" },
            { id: 2, label: "Prototyping", start: "2026-02-10", end: "2026-02-20", category: "design", grouping: "Phase 1" },
            { id: 3, label: "Auth API", start: "2026-02-15", end: "2026-03-01", category: "dev", grouping: "Phase 2" },
            { id: 4, label: "Dashboard", start: "2026-02-22", end: "2026-03-10", category: "dev", grouping: "Phase 2" },
            { id: 5, label: "Integration Tests", start: "2026-03-01", end: "2026-03-12", category: "qa", grouping: "Phase 3" },
            { id: 6, label: "Load Testing", start: "2026-03-08", end: "2026-03-18", category: "qa", grouping: "Phase 3" },
        ],
        categories: [
            { name: "design", label: "Design", style: { backgroundColor: "#f43f5e", fontColor: "#fff" } },
            { name: "dev", label: "Development", style: { backgroundColor: "#6366f1", fontColor: "#fff" } },
            { name: "qa", label: "QA", style: { backgroundColor: "#10b981", fontColor: "#fff" } },
        ],
        options: {
            responsive: true,
            legend: { position: "bottom", alignment: "center" },
            range: { start: "2026-01-25", end: "2026-03-25", position: "bottom" },
        },
    },
};
