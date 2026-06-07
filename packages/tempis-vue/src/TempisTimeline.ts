import {
    defineComponent,
    ref,
    h,
    onMounted,
    onUnmounted,
    watch,
    type PropType,
    type CSSProperties,
} from "vue";
import {
    TempisTimeline as CoreTimeline,
    type TempisTimelineItem,
    type TempisTimelineCategory,
    type TempisTimelineBand,
    type TempisTimelineDependency,
    type TempisTimelineVerticalFillMode,
    type TempisTimelineStackMode,
    type TempisTimelineItemSelectionMode,
    type TempisTimelineRangeOptions,
    type TempisTimelineLegendOptions,
    type TempisTimelineTooltipOptions,
    type TempisTimelineStyleOptions,
    type TempisTimelineGroupingOptions,
    type TempisTimelineScrollbarOptions,
    type TempisTimelineAccessibilityOptions,
    type TempisTimelineMinimapOptions,
    type ImageGenerationOptions,
    type FocusOptions,
} from "@tempis/timeline";

/**
 * Configuration options that trigger a full instance recreate when changed.
 */
export interface TempisTimelineConfig {
    /** Whether the canvas should resize to match the dimensions of its parent container. */
    responsive?: boolean;

    /** The vertical fill mode. */
    verticalFill?: TempisTimelineVerticalFillMode;

    /** Whether the timeline should be rendered right-to-left. */
    rtl?: boolean;

    /** The stack mode controlling how items are vertically arranged. */
    stackMode?: TempisTimelineStackMode;

    /** The item selection mode. */
    selection?: TempisTimelineItemSelectionMode;

    /** The timeline range options. */
    range?: TempisTimelineRangeOptions;

    /** The timeline legend options. */
    legend?: TempisTimelineLegendOptions;

    /** The timeline tooltip options. */
    tooltip?: TempisTimelineTooltipOptions;

    /** The timeline style options. */
    style?: TempisTimelineStyleOptions;

    /** The scrollbar options. */
    scrollbar?: TempisTimelineScrollbarOptions;

    /** The timeline grouping options. */
    grouping?: TempisTimelineGroupingOptions;

    /** The timeline accessibility options. */
    accessibility?: TempisTimelineAccessibilityOptions;

    /** The minimap options. Provide to enable the minimap. */
    minimap?: TempisTimelineMinimapOptions;
}

/**
 * Methods exposed via template ref.
 */
export interface TempisTimelineExposed {
    /** Focuses the timeline on a specific item, date, or range. */
    focus(options?: FocusOptions): void;

    /** Gets the current visible range. */
    getRange(): { start: Date; end: Date };

    /** Sets timeline items and redraws. */
    setItems(items: TempisTimelineItem[]): void;

    /** Gets the current timeline items. */
    getItems(): TempisTimelineItem[];

    /** Sets timeline categories and redraws. */
    setCategories(categories: TempisTimelineCategory[]): void;

    /** Gets the current timeline categories. */
    getCategories(): TempisTimelineCategory[];

    /** Sets timeline bands and redraws. */
    setBands(bands: TempisTimelineBand[]): void;

    /** Sets item dependencies and redraws. */
    setDependencies(dependencies: TempisTimelineDependency[]): void;

    /** Programmatically sets the selected items by their identifiers. */
    setSelection(ids: (string | number)[]): void;

    /** Gets the identifiers of the currently selected items. */
    getSelection(): (string | number)[];

    /** Clears all item selections and redraws. */
    clearSelection(): void;

    /** Set or toggle the collapsed state of a group. */
    setGroupCollapsed(group: string, collapsed?: boolean): void;

    /** Returns whether a group is currently collapsed. */
    isGroupCollapsed(group: string): boolean;

    /** Exports the current timeline view as an image Blob. */
    toImage(options?: ImageGenerationOptions): Promise<Blob>;

    /** Redraws the timeline. */
    redraw(): void;

    /** Access the underlying core TempisTimeline instance. */
    getInstance(): CoreTimeline | null;

    /** Access the underlying canvas element. */
    getCanvas(): HTMLCanvasElement | null;
}

export const TempisTimeline = defineComponent({
    name: "TempisTimeline",

    props: {
        /** The timeline items. */
        items: {
            type: Array as PropType<TempisTimelineItem[]>,
            required: true,
        },
        /** The timeline item categories. */
        categories: {
            type: Array as PropType<TempisTimelineCategory[]>,
            default: undefined,
        },
        /** The timeline bands. */
        bands: {
            type: Array as PropType<TempisTimelineBand[]>,
            default: undefined,
        },
        /** Item dependencies. */
        dependencies: {
            type: Array as PropType<TempisTimelineDependency[]>,
            default: undefined,
        },
        /**
         * The selected item IDs (v-model:selection).
         * When provided, selection is controlled — the timeline won't update selection internally.
         * You must update this prop in response to the `update:selection` event.
         * When omitted, the timeline manages selection state automatically (uncontrolled).
         */
        selection: {
            type: Array as PropType<(string | number)[]>,
            default: undefined,
        },
        /** Configuration options — changes trigger full instance recreate. */
        options: {
            type: Object as PropType<TempisTimelineConfig>,
            default: () => ({}),
        },
        /** Width of the canvas. Defaults to "100%". */
        width: {
            type: [String, Number] as PropType<string | number>,
            default: "100%",
        },
        /** Height of the canvas. Defaults to 300. */
        height: {
            type: [String, Number] as PropType<string | number>,
            default: 300,
        },
        /** Optional CSS class for the wrapper div. */
        wrapperClass: {
            type: String,
            default: undefined,
        },
        /** Optional inline styles for the wrapper div. */
        wrapperStyle: {
            type: Object as PropType<CSSProperties>,
            default: undefined,
        },
    },

    emits: [
        /** Emitted when a timeline item is clicked. */
        "itemClick",
        /** Emitted when a timeline item is double-clicked. */
        "itemDoubleClick",
        /** Emitted when a timeline item is right-clicked (context menu). */
        "itemContextClick",
        /** Emitted when the mouse pointer enters or leaves a timeline item. */
        "itemHover",
        /** Emitted when the selected items change (v-model:selection). */
        "update:selection",
        /** Emitted when the visible range changes. */
        "rangeChange",
        /** Emitted when a group header is clicked to collapse or expand. */
        "groupToggle",
    ],

    setup(props, { emit, expose }) {
        const canvasRef = ref<HTMLCanvasElement | null>(null);
        let instance: CoreTimeline | null = null;

        // Selection is controlled when the `selection` prop is provided (even as an empty array).
        function isControlled(): boolean {
            return props.selection !== undefined;
        }

        function createInstance() {
            if (!canvasRef.value) return;

            const opts = props.options;

            instance = new CoreTimeline(canvasRef.value, {
                ...opts,
                // Proxy tooltip functions so they use the latest references.
                tooltip: {
                    ...opts.tooltip,
                    template: opts.tooltip?.template
                        ? (id) => props.options.tooltip?.template?.(id) ?? null
                        : undefined,
                    shouldShow: opts.tooltip?.shouldShow
                        ? (id) => props.options.tooltip?.shouldShow?.(id) ?? true
                        : undefined,
                },
                items: props.items,
                categories: props.categories,
                bands: props.bands,
                dependencies: props.dependencies,
                onItemClick: (id) => emit("itemClick", id),
                onItemDoubleClick: (id) => emit("itemDoubleClick", id),
                onItemContextClick: (id, position) => emit("itemContextClick", id, position),
                onItemHover: (id) => emit("itemHover", id),
                onSelectionChange: isControlled()
                    ? (changes) => {
                        // Compute the new selection array from the changes.
                        const current = new Set(props.selection ?? []);
                        changes.forEach((c) => {
                            if (c.selected) current.add(c.id);
                            else current.delete(c.id);
                        });
                        emit("update:selection", Array.from(current));
                    }
                    : undefined,
                onRangeChange: (start, end) => emit("rangeChange", start, end),
                onGroupToggle: (group, collapsed) => emit("groupToggle", group, collapsed),
            });
        }

        function destroyInstance() {
            if (instance) {
                instance.destroy();
                instance = null;
            }
        }

        onMounted(() => {
            createInstance();
        });

        onUnmounted(() => {
            destroyInstance();
        });

        // Recreate instance when structural options change.
        watch(
            () => JSON.stringify(props.options),
            () => {
                destroyInstance();
                createInstance();
            }
        );

        // Sync reactive data without recreating the instance.
        watch(
            () => props.items,
            (items) => {
                instance?.setItems(items);
            }
        );

        watch(
            () => props.categories,
            (categories) => {
                if (categories) instance?.setCategories(categories);
            }
        );

        watch(
            () => props.bands,
            (bands) => {
                if (bands) instance?.setBands(bands);
            }
        );

        watch(
            () => props.dependencies,
            (dependencies) => {
                if (dependencies) instance?.setDependencies(dependencies);
            }
        );

        // Sync controlled selection state.
        watch(
            () => props.selection,
            (selection) => {
                if (selection !== undefined) {
                    instance?.setSelection(selection);
                }
            }
        );

        // Expose imperative API via template ref.
        const exposed: TempisTimelineExposed = {
            focus: (opts) => instance?.focus(opts),
            getRange: () => instance!.getRange(),
            setItems: (i) => instance?.setItems(i),
            getItems: () => instance?.getItems() ?? [],
            setCategories: (c) => instance?.setCategories(c),
            getCategories: () => instance?.getCategories() ?? [],
            setBands: (b) => instance?.setBands(b),
            setDependencies: (d) => instance?.setDependencies(d),
            setSelection: (ids) => instance?.setSelection(ids),
            getSelection: () => instance?.getSelection() ?? [],
            clearSelection: () => instance?.clearSelection(),
            setGroupCollapsed: (group, collapsed) => instance?.setGroupCollapsed(group, collapsed),
            isGroupCollapsed: (group) => instance?.isGroupCollapsed(group) ?? false,
            toImage: (opts) => instance!.toImage(opts),
            redraw: () => instance?.redraw(),
            getInstance: () => instance,
            getCanvas: () => canvasRef.value,
        };

        expose(exposed);

        return () =>
            h(
                "div",
                {
                    class: props.wrapperClass,
                    style: props.wrapperStyle,
                },
                [
                    h("canvas", {
                        ref: canvasRef,
                        style: {
                            width: typeof props.width === "number" ? `${props.width}px` : props.width,
                            height: typeof props.height === "number" ? `${props.height}px` : props.height,
                            display: "block",
                        },
                    }),
                ]
            );
    },
});
