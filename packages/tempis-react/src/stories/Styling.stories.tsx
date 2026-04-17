import type { Meta, StoryObj } from "@storybook/react";
import { TempisTimeline } from "../TempisTimeline";

const items = [
    { id: 1, label: "Design", start: "2026-01-05", end: "2026-01-15", grouping: "Frontend" },
    { id: 2, label: "Build", start: "2026-01-12", end: "2026-01-28", grouping: "Frontend" },
    { id: 3, label: "API", start: "2026-01-08", end: "2026-01-25", grouping: "Backend" },
    { id: 4, label: "Testing", start: "2026-01-20", end: "2026-01-29", grouping: "Backend" },
];

const range = { start: "2026-01-01", end: "2026-02-01", position: "bottom" as const };

const meta: Meta<typeof TempisTimeline> = {
    title: "Styling/Styling",
    component: TempisTimeline,
    parameters: { layout: "padded" },
};
export default meta;

type Story = StoryObj<typeof TempisTimeline>;

export const DarkBackground: Story = {
    args: {
        height: 350,
        items,
        options: {
            responsive: true,
            range,
            style: { item: { backgroundColor: "#1a1a2e", fontColor: "#e0e0e0" } },
            scrollbar: { color: "rgba(255, 255, 255, 0.3)" },
        },
    },
};

export const CustomFont: Story = {
    args: {
        height: 350,
        items,
        options: {
            responsive: true,
            range,
            style: { font: { family: "Georgia, serif", size: 13 } },
        },
    },
};

export const PerItemStyles: Story = {
    args: {
        height: 350,
        items: [
            { id: 1, label: "Normal", start: "2026-01-05", end: "2026-01-15" },
            { id: 2, label: "Dashed Border", start: "2026-01-10", end: "2026-01-22", style: { borderColor: "#e11d48", borderThickness: 2, borderStyle: "dashed" } },
            { id: 3, label: "Custom Colors", start: "2026-01-18", end: "2026-01-28", style: { backgroundColor: "#7c3aed", fontColor: "#fff", borderRadius: 12 } },
            { id: 4, label: "Dotted", start: "2026-01-08", end: "2026-01-20", style: { borderColor: "#059669", borderThickness: 2, borderStyle: "dotted" } },
        ],
        options: { responsive: true, range },
    },
};

export const FixedDimensions: Story = {
    args: {
        width: 600,
        height: 250,
        items,
        options: { responsive: false, range },
    },
};
