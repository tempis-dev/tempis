import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { TempisTimeline } from "../TempisTimeline";

const meta: Meta<typeof TempisTimeline> = {
    title: "Basics/Simple Timeline",
    component: TempisTimeline,
    parameters: { layout: "padded" },
    args: {
        onItemClick: fn(),
        onItemDoubleClick: fn(),
        onItemHover: fn(),
        onRangeChange: fn(),
    },
    argTypes: {
        verticalFill: { control: "select", options: ["content", "fill-canvas", "grow-canvas"] },
        stackMode: { control: "select", options: ["compact", "stable"] },
        selection: { control: "select", options: ["none", "single", "multi"] },
    },
};
export default meta;

type Story = StoryObj<typeof TempisTimeline>;

export const Default: Story = {
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

export const SingleItem: Story = {
    args: {
        responsive: true,
        height: 200,
        items: [
            { id: 1, label: "Solo Task", start: "2026-03-10", end: "2026-03-20" },
        ],
        range: { start: "2026-03-01", end: "2026-04-01", position: "bottom" },
    },
};

export const PointInTimeItems: Story = {
    args: {
        responsive: true,
        height: 300,
        items: [
            { id: 1, label: "Kickoff", start: "2026-02-01", grouping: "Milestones" },
            { id: 2, label: "Alpha", start: "2026-03-15", grouping: "Milestones" },
            { id: 3, label: "Beta", start: "2026-05-01", grouping: "Milestones" },
            { id: 4, label: "GA Release", start: "2026-06-15", grouping: "Milestones" },
            { id: 5, label: "Sprint 1", start: "2026-02-01", end: "2026-03-15", grouping: "Work" },
            { id: 6, label: "Sprint 2", start: "2026-03-15", end: "2026-05-01", grouping: "Work" },
            { id: 7, label: "Sprint 3", start: "2026-05-01", end: "2026-06-15", grouping: "Work" },
        ],
        range: { start: "2026-01-15", end: "2026-07-01", position: "bottom" },
    },
};

export const ManyGroups: Story = {
    args: {
        responsive: true,
        height: 450,
        verticalFill: "fill-canvas",
        items: [
            { id: 1, label: "Frontend", start: "2026-01-05", end: "2026-01-25", grouping: "Team Alpha" },
            { id: 2, label: "Backend", start: "2026-01-10", end: "2026-02-05", grouping: "Team Alpha" },
            { id: 3, label: "Mobile", start: "2026-01-08", end: "2026-01-30", grouping: "Team Beta" },
            { id: 4, label: "DevOps", start: "2026-01-15", end: "2026-02-10", grouping: "Team Beta" },
            { id: 5, label: "Design", start: "2026-01-03", end: "2026-01-20", grouping: "Team Gamma" },
            { id: 6, label: "Research", start: "2026-01-12", end: "2026-02-01", grouping: "Team Gamma" },
            { id: 7, label: "QA", start: "2026-01-20", end: "2026-02-15", grouping: "Team Delta" },
            { id: 8, label: "Docs", start: "2026-01-25", end: "2026-02-10", grouping: "Team Delta" },
        ],
        range: { start: "2026-01-01", end: "2026-02-20", position: "bottom" },
    },
};
