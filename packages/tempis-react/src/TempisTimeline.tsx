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
 * The TempisTimeline component props.
 */
export interface TempisTimelineProps extends TempisTimelineOptions {
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
export const TempisTimeline = forwardRef<TempisTimelineRef, TempisTimelineProps>(
    function TempisTimeline(
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

        // We need to expose the imperative methods for the instance ref.
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
            getCanvas: () => canvasRef.current,
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
