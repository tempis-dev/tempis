import { useRef, useEffect, useImperativeHandle, forwardRef, type CSSProperties } from "react";
import {
    TempisTimeline as CoreTimeline,
    type TempisTimelineItem,
    type TempisTimelineCategory,
    type TempisTimelineBand,
    type TempisTimelineDependency,
    type TempisTimelineRangeOptions,
    type TempisTimelineLegendOptions,
    type TempisTimelineTooltipOptions,
    type TempisTimelineStyleOptions,
    type TempisTimelineGroupingOptions,
    type TempisTimelineScrollbarOptions,
    type TempisTimelineAccessibilityOptions,
    type TempisTimelineMinimapOptions,
    type TempisTimelineVerticalFillMode,
    type TempisTimelineStackMode,
    type TempisTimelineItemSelectionMode,
    type ImageGenerationOptions,
    type FocusOptions,
    type SelectionChangeEvent
} from "@tempis/timeline";

/**
 * The Tempis timeline instance ref.
 */
export interface TempisTimelineRef {
    /**
     * Focuses the timeline on a specific item, date, or range.
     * @param options The focus options. If not defined, the timeline will focus on the full range of items.
     */
    focus(options?: FocusOptions): void;

    /**
     * Gets the current visible range of the timeline.
     * @returns An object containing the start and end dates of the visible range.
     */
    getRange(): { start: Date; end: Date };

    /**
     * Sets the timeline items and redraws the timeline.
     * @param items The timeline items to set.
     */
    setItems(items: TempisTimelineItem[]): void;

    /**
     * Gets the current timeline items.
     * @returns The item definitions as last provided via the timeline options or setItems().
     */
    getItems(): TempisTimelineItem[];

    /**
     * Sets the timeline categories and redraws the timeline.
     * @param categories The timeline categories to set.
     */
    setCategories(categories: TempisTimelineCategory[]): void;

    /**
     * Gets the current timeline categories.
     * @returns The category definitions as last provided via the timeline options or setCategories().
     */
    getCategories(): TempisTimelineCategory[];

    /**
     * Sets the timeline bands and redraws the timeline.
     * @param bands The timeline bands to set.
     */
    setBands(bands: TempisTimelineBand[]): void;

    /**
     * Sets the item dependencies and redraws the timeline.
     * @param dependencies The dependency definitions.
     */
    setDependencies(dependencies: TempisTimelineDependency[]): void;

    /**
     * Programmatically sets the selected items by their identifiers.
     * This deselects all currently selected items and selects only the items matching the provided IDs.
     * @param ids The identifiers of the items to select.
     */
    setSelection(ids: (string | number)[]): void;

    /**
     * Gets the identifiers of the currently selected items.
     * @returns The identifiers of the currently selected items.
     */
    getSelection(): (string | number)[];

    /**
     * Clears all item selections and redraws the timeline.
     */
    clearSelection(): void;

    /**
     * Set or toggle the collapsed state of a group.
     * @param group The group name.
     * @param collapsed Whether the group should be collapsed. Omit to toggle.
     */
    setGroupCollapsed(group: string, collapsed?: boolean): void;

    /**
     * Returns whether a group is currently collapsed.
     * @param group The group name to check.
     */
    isGroupCollapsed(group: string): boolean;

    /**
     * Exports the current timeline view as an image Blob.
     * @param options The optional export settings.
     * @returns A Promise that resolves with the image Blob.
     */
    toImage(options?: ImageGenerationOptions): Promise<Blob>;

    /**
     * Redraws the timeline.
     */
    redraw(): void;

    /**
     * Access the underlying core TempisTimeline instance.
     * Use as an escape hatch when you need functionality not exposed by the ref API.
     */
    getInstance(): CoreTimeline | null;

    /**
     * Access the underlying canvas element.
     */
    getCanvas(): HTMLCanvasElement | null;
}

/**
 * The configuration options for the timeline instance.
 * Changes to these trigger a full instance recreate.
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
 * The TempisTimeline component props.
 */
export interface TempisTimelineProps {
    /** The timeline items. */
    items: TempisTimelineItem[];

    /** The timeline item categories. */
    categories?: TempisTimelineCategory[];

    /** The timeline bands. */
    bands?: TempisTimelineBand[];

    /** The timeline item dependencies. Each defines a source → target relationship rendered as a connector arrow. */
    dependencies?: TempisTimelineDependency[];

    /** The timeline configuration options. */
    options?: TempisTimelineConfig;

    /** Called when a timeline item is clicked. */
    onItemClick?(id: string | number): void;

    /** Called when a timeline item is double-clicked. */
    onItemDoubleClick?(id: string | number): void;

    /** Called when a timeline item is right-clicked (context menu). */
    onItemContextClick?(id: string | number, position: { x: number; y: number }): void;

    /** Called when the mouse pointer enters or leaves a timeline item. */
    onItemHover?(id: string | number | null): void;

    /** Called when the item selection changes. */
    onSelectionChange?(changes: SelectionChangeEvent[]): void;

    /** Called when the visible range changes. */
    onRangeChange?(start: Date, end: Date): void;

    /** Called when a group header is clicked to collapse or expand. */
    onGroupToggle?(group: string, collapsed: boolean): void;

    /** Optional CSS class for the wrapper div. */
    className?: string;

    /** Optional inline styles for the wrapper div. */
    wrapperStyle?: CSSProperties;

    /** Width of the canvas. Defaults to "100%". */
    width?: string | number;

    /** Height of the canvas. Defaults to 300. */
    height?: string | number;
}

/**
 * The TempisTimeline component.
 */
export const TempisTimeline = forwardRef<TempisTimelineRef, TempisTimelineProps>(function TempisTimeline(
    {
        className,
        wrapperStyle,
        width = "100%",
        height = 300,
        items,
        categories,
        bands,
        dependencies,
        options = {},
        onItemClick,
        onItemDoubleClick,
        onItemContextClick,
        onItemHover,
        onSelectionChange,
        onRangeChange,
        onGroupToggle
    },
    ref
) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const instanceRef = useRef<CoreTimeline | null>(null);

    // Store latest callbacks in a ref so we don't recreate the instance when they change.
    // This includes tooltip functions (template, shouldShow) which live inside the options object but are functions that shouldn't trigger a recreate.
    const callbacksRef = useRef({
        onItemClick,
        onItemDoubleClick,
        onItemContextClick,
        onItemHover,
        onSelectionChange,
        onRangeChange,
        onGroupToggle,
        tooltipTemplate: options.tooltip?.template,
        tooltipShouldShow: options.tooltip?.shouldShow
    });
    callbacksRef.current = {
        onItemClick,
        onItemDoubleClick,
        onItemContextClick,
        onItemHover,
        onSelectionChange,
        onRangeChange,
        onGroupToggle,
        tooltipTemplate: options.tooltip?.template,
        tooltipShouldShow: options.tooltip?.shouldShow
    };

    // Serialise the options object to detect actual value changes.
    // Functions are stripped by JSON.stringify, which is intentional — they're stored
    // in callbacksRef above and passed to the core instance via stable wrappers.
    const optionsKey = JSON.stringify(options);

    // Track whether onSelectionChange is provided to switch between controlled/uncontrolled mode.
    // The core library uses the presence of this callback to determine selection behavior.
    const isSelectionControlled = !!onSelectionChange;

    // Create / destroy the core instance.
    useEffect(() => {
        // Guard against SSR environments.
        if (typeof window === "undefined") {
            console.warn("[TempisTimeline] Skipping initialisation — no window (SSR environment).");
            return;
        }

        if (!canvasRef.current) return;

        const timeline = new CoreTimeline(canvasRef.current, {
            ...options,
            tooltip: {
                ...options.tooltip,
                template: options.tooltip?.template
                    ? (id) => callbacksRef.current.tooltipTemplate?.(id) ?? null
                    : undefined,
                shouldShow: options.tooltip?.shouldShow
                    ? (id) => callbacksRef.current.tooltipShouldShow?.(id) ?? true
                    : undefined
            },
            items,
            categories,
            bands,
            dependencies,
            onItemClick: (id) => callbacksRef.current.onItemClick?.(id),
            onItemDoubleClick: (id) => callbacksRef.current.onItemDoubleClick?.(id),
            onItemContextClick: (id, pos) => callbacksRef.current.onItemContextClick?.(id, pos),
            onItemHover: (id) => callbacksRef.current.onItemHover?.(id),
            onSelectionChange: onSelectionChange
                ? (changes) => callbacksRef.current.onSelectionChange?.(changes)
                : undefined,
            onRangeChange: (start, end) => callbacksRef.current.onRangeChange?.(start, end),
            onGroupToggle: (group, collapsed) => callbacksRef.current.onGroupToggle?.(group, collapsed)
        });

        instanceRef.current = timeline;

        return () => {
            timeline.destroy();
            instanceRef.current = null;
        };
    }, [optionsKey, isSelectionControlled]);

    // Sync items.
    useEffect(() => {
        instanceRef.current?.setItems(items);
    }, [items]);

    // Sync categories.
    useEffect(() => {
        if (categories) instanceRef.current?.setCategories(categories);
    }, [categories]);

    // Sync bands.
    useEffect(() => {
        if (bands) instanceRef.current?.setBands(bands);
    }, [bands]);

    // Sync dependencies.
    useEffect(() => {
        if (dependencies) instanceRef.current?.setDependencies(dependencies);
    }, [dependencies]);

    // We need to expose the imperative methods for the instance ref.
    useImperativeHandle(ref, () => ({
        focus: (opts) => instanceRef.current?.focus(opts),
        getRange: () => {
            if (!instanceRef.current) throw new Error("Timeline instance is not available.");
            return instanceRef.current.getRange();
        },
        setItems: (i) => instanceRef.current?.setItems(i),
        getItems: () => instanceRef.current?.getItems() ?? [],
        setCategories: (c) => instanceRef.current?.setCategories(c),
        getCategories: () => instanceRef.current?.getCategories() ?? [],
        setBands: (b) => instanceRef.current?.setBands(b),
        setDependencies: (d) => instanceRef.current?.setDependencies(d),
        setSelection: (ids) => instanceRef.current?.setSelection(ids),
        getSelection: () => instanceRef.current?.getSelection() ?? [],
        clearSelection: () => instanceRef.current?.clearSelection(),
        setGroupCollapsed: (group, collapsed) => instanceRef.current?.setGroupCollapsed(group, collapsed),
        isGroupCollapsed: (group) => instanceRef.current?.isGroupCollapsed(group) ?? false,
        toImage: (opts) => {
            if (!instanceRef.current) return Promise.reject(new Error("Timeline instance is not available."));
            return instanceRef.current.toImage(opts);
        },
        redraw: () => instanceRef.current?.redraw(),
        getInstance: () => instanceRef.current,
        getCanvas: () => canvasRef.current
    }));

    return (
        <div className={className} style={{ width: "100%", height: "100%", ...wrapperStyle }}>
            <canvas ref={canvasRef} style={{ width, height, display: "block" }} />
        </div>
    );
});

TempisTimeline.displayName = "TempisTimeline";
