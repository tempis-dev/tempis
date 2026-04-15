import type { Meta, StoryObj } from "@storybook/react";
import { TempisTimeline } from "../TempisTimeline";

const items = [
    { id: 1, label: "Design", start: "2026-01-05", end: "2026-01-15", grouping: "Frontend" },
    { id: 2, label: "Build", start: "2026-01-12", end: "2026-01-28", grouping: "Frontend" },
    { id: 3, label: "API", start: "2026-01-08", end: "2026-01-25", grouping: "Backend" },
    { id: 4, label: "Testing", start: "2026-01-20", end: "2026-01-29", grouping: "Backend" },
    { id: 5, label: "Deploy", start: "2026-01-25", end: "2026-02-05", grouping: "DevOps" },
    { id: 6, label: "Monitor", start: "2026-01-28", end: "2026-02-10", grouping: "DevOps" },
];

const meta: Meta<typeof TempisTimeline> = {
    title: "Layout/Layout",
    component: TempisTimeline,
    parameters: {
        layout: "padded",
        docs: {
            description: {
                component: "Layout options controlling vertical fill, stacking, range position, and text direction.",
            },
        },
    },
};
export default meta;

type Story = StoryObj<typeof TempisTimeline>;

export const FillCanvas: Story = {
    args: {
        responsive: true,
        height: 450,
        verticalFill: "fill-canvas",
        items,
        range: { start: "2026-01-01", end: "2026-02-15", position: "bottom" },
    },
};

export const ContentHeight: Story = {
    args: {
        responsive: true,
        height: 450,
        verticalFill: "content",
        items,
        range: { start: "2026-01-01", end: "2026-02-15", position: "bottom" },
    },
};

export const CompactStacking: Story = {
    args: {
        responsive: true,
        height: 400,
        stackMode: "compact",
        items,
        range: { start: "2026-01-01", end: "2026-02-15", position: "bottom" },
    },
};

export const StableStacking: Story = {
    args: {
        responsive: true,
        height: 400,
        stackMode: "stable",
        items,
        range: { start: "2026-01-01", end: "2026-02-15", position: "bottom" },
    },
};

export const RTL: Story = {
    args: {
        responsive: true,
        height: 350,
        rtl: true,
        items,
        range: { start: "2026-01-01", end: "2026-02-15", position: "bottom" },
    },
};

export const RangeTop: Story = {
    args: {
        responsive: true,
        height: 350,
        items,
        range: { start: "2026-01-01", end: "2026-02-15", position: "top" },
    },
};

export const RangeBoth: Story = {
    args: {
        responsive: true,
        height: 400,
        items,
        range: { start: "2026-01-01", end: "2026-02-15", position: "both" },
    },
};
