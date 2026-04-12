import {
    useRef,
    useEffect,
    useImperativeHandle,
    forwardRef,
    type CSSProperties,
} from "react";
import {
    TempisTimeline as CoreTimeline,
    type TempisTimelineOptions,
    type TempisTimelineItem,
    type TempisTimelineCategory,
    type TempisTimelineBand,
    type ImageGenerationOptions,
    type FocusOptions,
} from "@tempis/timeline";

// ── Props ──

export interface TempisTimelineProps
    extends Omit<TempisTimelineOptions, "items"> {
    /** Timeline items (required). */
    items: TempisTimelineItem[];

    /** Optional CSS class for the wrapper div. */
    className?: string;

    /** Optional inline styles for the wrapper div. */
    wrapperStyle?: CSSProperties;

    /** Width of the canvas. Defaults to "100%". */
    width?: string | number;

    /** Height of the canvas. Defaults to 300. */
    height?: string | number;
}

// ── Ref handle ──

export interface TempisTimelineRef {
    /** Focus the timeline on an item, date, or range. */
    focus(options?: FocusOptions): void;
    /** Get the current visible range. */
    getRange(): { start: Date; end: Date };
    /** Replace all items. */
    setItems(items: TempisTimelineItem[]): void;
    /** Get current items. */
    getItems(): TempisTimelineItem[];
    /** Replace all categories. */
    setCategories(categories: TempisTimelineCategory[]): void;
    /** Get current categories. */
    getCategories(): TempisTimelineCategory[];
    /** Replace all bands. */
    setBands(bands: TempisTimelineBand[]): void;
    /** Programmatically select items by ID. */
    setSelection(ids: (string | number)[]): void;
    /** Get selected item IDs. */
    getSelection(): (string | number)[];
    /** Clear selection. */
    clearSelection(): void;
    /** Export as image blob. */
    toImage(options?: ImageGenerationOptions): Promise<Blob>;
    /** Force a redraw. */
    redraw(): void;
    /** Access the underlying core instance. */
    getInstance(): CoreTimeline | null;
}

// ── Component ──

export const TempisReactTimeline = forwardRef<TempisTimelineRef, TempisTimelineProps>(
    function TempisReactTimeline(
        {
            className,
            wrapperStyle,
            width = "100%",
            height = 300,
            items,
            categories,
            bands,
            ...options
        },
        ref
    ) {
        const canvasRef = useRef<HTMLCanvasElement>(null);
        const instanceRef = useRef<CoreTimeline | null>(null);

        // Store latest callbacks in refs so we don't recreate the instance when they change.
        const callbacksRef = useRef(options);
        callbacksRef.current = options;

        // Create / destroy the core instance.
        useEffect(() => {
            if (!canvasRef.current) return;

            const timeline = new CoreTimeline(canvasRef.current, {
                ...callbacksRef.current,
                items,
                categories,
                bands,
                onItemClick: (id) => callbacksRef.current.onItemClick?.(id),
                onItemDoubleClick: (id) => callbacksRef.current.onItemDoubleClick?.(id),
                onItemHover: (id) => callbacksRef.current.onItemHover?.(id),
                onSelectionChange: (changes) => callbacksRef.current.onSelectionChange?.(changes),
                onRangeChange: (start, end) => callbacksRef.current.onRangeChange?.(start, end),
            });

            instanceRef.current = timeline;

            return () => {
                timeline.destroy();
                instanceRef.current = null;
            };
            // Only recreate on options that require a new instance.
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [
            options.responsive,
            options.verticalFill,
            options.rtl,
            options.stackMode,
            options.selection,
        ]);

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

        // Expose imperative methods.
        useImperativeHandle(ref, () => ({
            focus: (opts) => instanceRef.current?.focus(opts),
            getRange: () => instanceRef.current!.getRange(),
            setItems: (i) => instanceRef.current?.setItems(i),
            getItems: () => instanceRef.current?.getItems() ?? [],
            setCategories: (c) => instanceRef.current?.setCategories(c),
            getCategories: () => instanceRef.current?.getCategories() ?? [],
            setBands: (b) => instanceRef.current?.setBands(b),
            setSelection: (ids) => instanceRef.current?.setSelection(ids),
            getSelection: () => instanceRef.current?.getSelection() ?? [],
            clearSelection: () => instanceRef.current?.clearSelection(),
            toImage: (opts) => instanceRef.current!.toImage(opts),
            redraw: () => instanceRef.current?.redraw(),
            getInstance: () => instanceRef.current,
        }));

        return (
            <div className={className} style={wrapperStyle}>
                <canvas
                    ref={canvasRef}
                    style={{ width, height, display: "block" }}
                />
            </div>
        );
    }
);
