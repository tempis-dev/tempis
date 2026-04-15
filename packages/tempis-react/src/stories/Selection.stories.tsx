import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { TempisTimeline } from "../TempisTimeline";

const items = [
    { id: 1, label: "Task A", start: "2026-03-01", end: "2026-03-10", grouping: "Team 1" },
    { id: 2, label: "Task B", start: "2026-03-05", end: "2026-03-15", grouping: "Team 1" },
    { id: 3, label: "Task C", start: "2026-03-08", end: "2026-03-20", grouping: "Team 2" },
    { id: 4, label: "Task D", start: "2026-03-12", end: "2026-03-22", grouping: "Team 2" },
    { id: 5, label: "Deadline", start: "2026-03-25", grouping: "Team 2" },
];

const meta: Meta<typeof TempisTimeline> = {
    title: "Features/Selection",
    component: TempisTimeline,
    parameters: { layout: "padded" },
    args: {
        onItemClick: fn(),
        onSelectionChange: fn(),
    },
};
export default meta;

type Story = StoryObj<typeof TempisTimeline>;

export const SingleSelect: Story = {
    args: {
        responsive: true,
        height: 350,
        selection: "single",
        items,
        range: { start: "2026-02-25", end: "2026-04-01", position: "bottom" },
    },
};

export const MultiSelect: Story = {
    args: {
        responsive: true,
        height: 350,
        selection: "multi",
        items,
        range: { start: "2026-02-25", end: "2026-04-01", position: "bottom" },
    },
};

export const NoSelection: Story = {
    args: {
        responsive: true,
        height: 350,
        selection: "none",
        items,
        range: { start: "2026-02-25", end: "2026-04-01", position: "bottom" },
    },
};
