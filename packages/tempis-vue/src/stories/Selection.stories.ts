import type { Meta, StoryObj } from "@storybook/vue3";
import { defineComponent, ref, h } from "vue";
import { TempisTimeline } from "../TempisTimeline";
import type { TempisTimelineItem } from "../index";

const meta: Meta<typeof TempisTimeline> = {
    title: "Selection/Selection",
    component: TempisTimeline,
    parameters: { layout: "padded" }
};
export default meta;

type Story = StoryObj<typeof TempisTimeline>;

// ── Controlled Selection (v-model:selection) ──

const ControlledSelectionDemo = defineComponent({
    setup() {
        const items: TempisTimelineItem[] = [
            { id: 1, label: "Task A", start: "2026-03-01", end: "2026-03-10", grouping: "Team 1" },
            { id: 2, label: "Task B", start: "2026-03-05", end: "2026-03-15", grouping: "Team 1" },
            { id: 3, label: "Task C", start: "2026-03-08", end: "2026-03-20", grouping: "Team 2" },
            { id: 4, label: "Task D", start: "2026-03-12", end: "2026-03-22", grouping: "Team 2" },
            { id: 5, label: "Task E", start: "2026-03-18", end: "2026-03-28", grouping: "Team 3" }
        ];

        const selection = ref<(string | number)[]>([]);

        const clearSelection = () => {
            selection.value = [];
        };

        return () =>
            h("div", [
                h("div", { style: "display:flex;gap:8px;margin-bottom:12px;align-items:center" }, [
                    h("span", `Selected: ${selection.value.length ? selection.value.join(", ") : "none"}`),
                    h("button", { onClick: clearSelection }, "Clear")
                ]),
                h(TempisTimeline, {
                    height: 350,
                    items,
                    selection: selection.value,
                    "onUpdate:selection": (ids: (string | number)[]) => {
                        selection.value = ids;
                    },
                    options: {
                        responsive: true,
                        selection: "multi",
                        range: { start: "2026-02-25", end: "2026-04-01", position: "bottom" }
                    }
                })
            ]);
    }
});

export const ControlledSelection: Story = {
    render: () => ({
        components: { ControlledSelectionDemo },
        template: "<ControlledSelectionDemo />"
    })
};

// ── Uncontrolled Selection ──

export const UncontrolledSelection: Story = {
    args: {
        height: 350,
        items: [
            { id: 1, label: "Task A", start: "2026-03-01", end: "2026-03-10", grouping: "Team 1" },
            { id: 2, label: "Task B", start: "2026-03-05", end: "2026-03-15", grouping: "Team 1" },
            { id: 3, label: "Task C", start: "2026-03-08", end: "2026-03-20", grouping: "Team 2" }
        ],
        options: {
            responsive: true,
            selection: "multi",
            range: { start: "2026-02-25", end: "2026-04-01", position: "bottom" }
        }
    }
};
