import type { Meta, StoryObj } from "@storybook/react";
import { useRef } from "react";
import { TempisTimeline } from "../TempisTimeline";
import type { TempisTimelineRef, TempisTimelineItem } from "../index";

const meta: Meta<typeof TempisTimeline> = {
    title: "Ref API/Ref API",
    component: TempisTimeline,
    parameters: { layout: "padded" },
};
export default meta;

type Story = StoryObj<typeof TempisTimeline>;

// ── Focus ──

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
                height={300}
                items={items}
                options={{
                    responsive: true,
                    range: { start: "2026-03-25", end: "2026-05-15", position: "bottom" },
                }}
            />
        </div>
    );
}

export const Focus: Story = { render: () => <FocusDemo /> };

// ── Programmatic Selection ──

function SelectionDemo() {
    const ref = useRef<TempisTimelineRef>(null);
    const items: TempisTimelineItem[] = [
        { id: 1, label: "Task A", start: "2026-03-01", end: "2026-03-10", grouping: "Sprint 1" },
        { id: 2, label: "Task B", start: "2026-03-05", end: "2026-03-15", grouping: "Sprint 1" },
        { id: 3, label: "Task C", start: "2026-03-10", end: "2026-03-20", grouping: "Sprint 2" },
        { id: 4, label: "Task D", start: "2026-03-15", end: "2026-03-25", grouping: "Sprint 2" },
    ];

    return (
        <div>
            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                <button onClick={() => ref.current?.setSelection([1, 3])}>Select A + C</button>
                <button onClick={() => ref.current?.setSelection([2, 4])}>Select B + D</button>
                <button onClick={() => ref.current?.setSelection([1, 2, 3, 4])}>Select All</button>
                <button onClick={() => ref.current?.clearSelection()}>Clear</button>
            </div>
            <TempisTimeline
                ref={ref}
                height={300}
                items={items}
                options={{
                    responsive: true,
                    selection: "multi",
                    range: { start: "2026-02-25", end: "2026-04-01", position: "bottom" },
                }}
            />
        </div>
    );
}

export const ProgrammaticSelection: Story = { render: () => <SelectionDemo /> };
