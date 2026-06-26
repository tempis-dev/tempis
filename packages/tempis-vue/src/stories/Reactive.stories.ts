import type { Meta, StoryObj } from "@storybook/vue3";
import { defineComponent, ref, h } from "vue";
import { TempisTimeline } from "../TempisTimeline";
import type { TempisTimelineItem, TempisTimelineCategory } from "../index";

const meta: Meta<typeof TempisTimeline> = {
    title: "Reactive Data/Reactive Data",
    component: TempisTimeline,
    parameters: { layout: "padded" }
};
export default meta;

type Story = StoryObj<typeof TempisTimeline>;

// ── Dynamic Items ──

const DynamicItemsDemo = defineComponent({
    setup() {
        const items = ref<TempisTimelineItem[]>([
            { id: 1, label: "Initial Task", start: "2026-06-01", end: "2026-06-10", grouping: "Sprint 1" }
        ]);

        const addItem = () => {
            const id = items.value.length + 1;
            const startDay = 1 + id * 3;
            const endDay = startDay + 7;
            items.value = [
                ...items.value,
                {
                    id,
                    label: `Task ${id}`,
                    start: `2026-06-${String(startDay).padStart(2, "0")}`,
                    end: `2026-06-${String(Math.min(endDay, 30)).padStart(2, "0")}`,
                    grouping: `Sprint ${Math.ceil(id / 3)}`
                }
            ];
        };

        const clearAll = () => {
            items.value = [];
        };

        return () =>
            h("div", [
                h("div", { style: "display:flex;gap:8px;margin-bottom:12px" }, [
                    h("button", { onClick: addItem }, `Add Item (${items.value.length})`),
                    h("button", { onClick: clearAll }, "Clear All")
                ]),
                h(TempisTimeline, {
                    height: 350,
                    items: items.value,
                    options: {
                        responsive: true,
                        range: { start: "2026-05-28", end: "2026-07-05", position: "bottom" }
                    }
                })
            ]);
    }
});

export const DynamicItems: Story = {
    render: () => ({ components: { DynamicItemsDemo }, template: "<DynamicItemsDemo />" })
};

// ── Toggle Categories ──

const ToggleCategoriesDemo = defineComponent({
    setup() {
        const allCategories: TempisTimelineCategory[] = [
            { name: "dev", label: "Development", style: { backgroundColor: "#6366f1", fontColor: "#fff" } },
            { name: "design", label: "Design", style: { backgroundColor: "#f43f5e", fontColor: "#fff" } },
            { name: "qa", label: "QA", style: { backgroundColor: "#10b981", fontColor: "#fff" } }
        ];

        const showCategories = ref(true);

        const items: TempisTimelineItem[] = [
            { id: 1, label: "Wireframes", start: "2026-02-01", end: "2026-02-14", category: "design" },
            { id: 2, label: "Auth Module", start: "2026-02-10", end: "2026-03-05", category: "dev" },
            { id: 3, label: "Unit Tests", start: "2026-02-20", end: "2026-03-10", category: "qa" },
            { id: 4, label: "Dashboard", start: "2026-03-01", end: "2026-03-20", category: "dev" },
            { id: 5, label: "E2E Tests", start: "2026-03-10", end: "2026-03-25", category: "qa" }
        ];

        return () =>
            h("div", [
                h("div", { style: "margin-bottom:12px" }, [
                    h(
                        "button",
                        { onClick: () => (showCategories.value = !showCategories.value) },
                        showCategories.value ? "Remove Categories" : "Add Categories"
                    )
                ]),
                h(TempisTimeline, {
                    height: 350,
                    items,
                    categories: showCategories.value ? allCategories : undefined,
                    options: {
                        responsive: true,
                        legend: showCategories.value ? { position: "top" } : undefined,
                        range: { start: "2026-01-25", end: "2026-04-01", position: "bottom" }
                    }
                })
            ]);
    }
});

export const ToggleCategories: Story = {
    render: () => ({ components: { ToggleCategoriesDemo }, template: "<ToggleCategoriesDemo />" })
};
