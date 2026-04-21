import { SelectionChangeEvent } from "./Event";

/**
 * The options passed when creating an instance of TempisTimeline.
 */
export interface TempisTimelineOptions {
    /** Whether the canvas should resize to match the dimensions of its parent container. */
    responsive?: boolean;

    /**
     * The vertical fill mode which defines how the timeline should fill the vertical space. Defaults to `"content"`
     * - `"content"` – The timeline height is determined purely by its content and will only take up as much vertical space as required to render all visible items.
     * - `"fill-canvas"` – The timeline expands to fill the available vertical space of the canvas.
     * - `"grow-canvas"`– The timeline grows the canvas element itself to match the required content height.
     */
    verticalFill?: TempisTimelineVerticalFillMode;

    /** Whether the timeline and any default tooltips should be rendered right-to-left. */
    rtl?: boolean;

    /** The timeline range options. */
    range?: TempisTimelineRangeOptions;

    /** The timeline legend options. */
    legend?: TempisTimelineLegendOptions;

    /** The timeline tooltip options. */
    tooltip?: TempisTimelineTooltipOptions;

    /** The timeline style options. */
    style?: TempisTimelineStyleOptions;

    /** The scrollbar visibility options. */
    scrollbar?: TempisTimelineScrollbarOptions;

    /** The timeline grouping options. */
    grouping?: TempisTimelineGroupingOptions;

    /** The timeline item categories. */
    categories?: TempisTimelineCategory[];

    /** The timeline bands. */
    bands?: TempisTimelineBand[];

    /** The items to display on the timeline. */
    items: TempisTimelineItem[];

    /**
     * The stack mode which defines how items are vertically arranged. Defaults to `"stable"`.
     * - `"compact"` – Items are dynamically stacked based on visible items only. PIT labels are adjusted to fit within canvas bounds. Layout updates when panning.
     * - `"stable"` – All items are included in the layout. PIT labels are always centered on their timestamp. Layout only updates on zoom or data changes.
     */
    stackMode?: TempisTimelineStackMode;

    /**
     * The item selection mode which defines how items in the timeline can be selected. Defaults to `"none"`.
     * - `"none"` – No items can be selected (view-only mode).
     * - `"single"` – Only one item can be selected at a time. Selecting a new item clears the previous selection.
     * - `"multi"`– Multiple items can be selected at once. Each item can be toggled independently.
     */
    selection?: TempisTimelineItemSelectionMode;

    /**
     * Called when a timeline item is clicked.
     * @param id The identifier of the clicked item.
     */
    onItemClick?(id: string | number): void;

    /**
     * Called when a timeline item is double-clicked.
     * @param id The identifier of the double-clicked item.
     */
    onItemDoubleClick?(id: string | number): void;

    /**
     * Called when the mouse pointer enters or leaves a timeline item.
     * @param id The identifier of the item being hovered, or `null` when the pointer leaves all items.
     */
    onItemHover?(id: string | number | null): void;

    /**
     * Called when the item selection changes due to user interaction.
     * Providing this callback enables controlled selection mode — the timeline will not update
     * selection state internally. You must call `setSelection()` to apply the changes.
     * Omit this callback for uncontrolled selection where the timeline manages state automatically.
     * @param changes An array of selection change events describing which items were selected or deselected.
     */
    onSelectionChange?(changes: SelectionChangeEvent[]): void;

    /**
     * Called when the visible range of the timeline changes due to panning, zooming, or programmatic updates.
     * @param start The start date of the visible range.
     * @param end The end date of the visible range.
     */
    onRangeChange?(start: Date, end: Date): void;
}

/**
 * Defines how the timeline should fill the vertical space.
 * - `"content"` – The timeline height is determined purely by its content and will only take up as much vertical space as required to render all visible items.
 * - `"fill-canvas"` – The timeline expands to fill the available vertical space of the canvas.
 * - `"grow-canvas"`– The timeline grows the canvas element itself to match the required content height.
 */
export type TempisTimelineVerticalFillMode = "content" | "fill-canvas" | "grow-canvas";

/**
 * Defines how items are vertically stacked in the timeline.
 * - `"compact"` – Items are dynamically stacked based on visible items only. More compact but items may shift when panning.
 * - `"stable"` – All items are included in the layout. Items maintain stable positions when panning. (Default)
 */
export type TempisTimelineStackMode = "compact" | "stable";

/**
 * Defines how items in a timeline can be selected.
 * - `"none"` – No items can be selected (view-only mode).
 * - `"single"` – Only one item can be selected at a time. Selecting a new item clears the previous selection.
 * - `"multi"`– Multiple items can be selected at once. Each item can be toggled independently.
 */
export type TempisTimelineItemSelectionMode = "none" | "single" | "multi";

export interface TempisTimelineTooltipOptions {
    /** Whether tooltips are enabled. Defaults to `true`. */
    enabled?: boolean;

    /** The tooltip delay in milliseconds. Defaults to `0`. */
    delay?: number;

    /**
     * The date format pattern used for displaying dates in the default tooltip.
     * Uses the same format tokens as the range unit labels (e.g., `"D MMMM HH:mm:ss"` for 24-hour or `"D MMMM h:mm:ss A"` for 12-hour).
     * Defaults to `"D MMMM HH:mm:ss"`.
     */
    dateFormat?: string;

    /**
     * Controls how tooltip positioning behaves when near edges. Defaults to `"none"`.
     * - `"none"`: The tooltip is positioned directly near the cursor and may overflow the viewport or canvas.
     * - `"canvas"`: The tooltip will attempt to stay within the canvas bounds by flipping horizontally/vertically as needed.
     * - `"viewport"`: The tooltip will attempt to stay within the browser viewport by flipping horizontally/vertically as needed.
     */
    overflowBehavior?: TempisTimelineTooltipOverflowBehavior;

    /**
     * Optional function for customizing the content of timeline item tooltips.
     *
     * If provided, this function will be called whenever a tooltip is shown.
     * It receives the identifier of the timeline item being hovered/focused and should return either:
     *
     * - An `HTMLElement`: appended directly as the tooltip content.
     * - A `string`: injected into the tooltip as raw HTML (`innerHTML`).
     *
     * If no template is provided, or the template function returns null, a default tooltip showing the item label and date range will be used.
     *
     * @param {string | number} id The identifier of the item for which the tooltip is being generated.
     * @returns {HTMLElement | string} Custom tooltip content.
     */
    template?: (id: string | number) => HTMLElement | string | null;

    /**
     * Optional predicate to decide if the tooltip for a specific item should be shown.
     * If not provided, tooltips are always shown unless all tooltips are disabled.
     *
     * @param {string | number} id The identifier of the item for which the tooltip is potentially being shown.
     * @returns {boolean} Whether the tooltip should be shown.
     */
    shouldShow?: (id: string | number) => boolean;
}

/**
 * Controls how tooltip positioning behaves when near edges.
 * - `"none"`: The tooltip is positioned directly near the cursor and may overflow the viewport or canvas.
 * - `"canvas"`: The tooltip will attempt to stay within the canvas bounds by flipping horizontally/vertically as needed.
 * - `"viewport"`: The tooltip will attempt to stay within the browser viewport by flipping horizontally/vertically as needed.
 */
export type TempisTimelineTooltipOverflowBehavior = "none" | "canvas" | "viewport";

export interface TempisTimelineStyleOptions {
    /** The default font options to use in rendering text. */
    font?: TempisTimelineFont;

    /** The default item options to use in rendering items, overriding the library item style defaults only. */
    item?: TempisTimelineItemStyle;
}

export interface TempisTimelineScrollbarOptions {
    /**
     * Controls when the scrollbar is visible. Defaults to `"hover"`.
     * - `"always"` – The scrollbar is always visible when there is vertical overflow.
     * - `"hover"` – The scrollbar is visible when hovering over the timeline or actively panning.
     * - `"panning"` – The scrollbar is only visible when actively panning the timeline.
     * - `"never"` – The scrollbar is never shown.
     */
    visibility?: TempisTimelineScrollbarVisibility;

    /** The colour of the scrollbar thumb and track. Defaults to the grid colour with transparency. */
    color?: string;
}

/**
 * Controls when the scrollbar is visible.
 * - `"always"` – The scrollbar is always visible when there is vertical overflow.
 * - `"hover"` – The scrollbar is visible when hovering over the timeline or actively panning.
 * - `"panning"` – The scrollbar is only visible when actively panning the timeline.
 * - `"never"` – The scrollbar is never shown.
 */
export type TempisTimelineScrollbarVisibility = "always" | "hover" | "panning" | "never";

export interface TempisTimelineGroupingOptions {
    /**
     * A comparator function used to sort groups.
     * Receives two group name strings and should return a negative number, zero, or positive number.
     * If not provided, groups are ordered by first encounter in the items array.
     */
    sort?: (a: string, b: string) => number;
}

export interface TempisTimelineFont {
    /** The font size. */
    size?: number;

    /** The font family. */
    family?: string;

    /** The font style. */
    style?: string;

    /** The font weight. */
    weight?: "normal" | "bold" | "lighter" | "bolder" | number;

    /** The line height. */
    lineHeight?: number | string;
}

export interface TempisTimelineItemStyle {
    /** The background color of the item. Will also be used to style the marker for point-in-time items unless a border is defined. */
    backgroundColor?: string;

    /** The font color of the item. */
    fontColor?: string;

    /** The amount of padding to apply to the item. */
    padding?: number;

    /** The border color. Will also be used to style the marker for point-in-time items. */
    borderColor?: string;

    /** The border thickness. */
    borderThickness?: number;

    /** The border style. Defaults to "solid". */
    borderStyle?: "solid" | "dashed" | "dotted" | "dash-dot" | "long-dash";

    /** The border radius. */
    borderRadius?: number;
}

export type TempisTimelineRangeUnitLabelFormats = {
    millisecond?: string;
    second?: string;
    minute?: string;
    hour?: string;
    day?: string;
    month?: string;
    year?: string;
};

export interface TempisTimelineRangeUnitOptions {
    /** The font to apply to range unit labels. */
    font?: TempisTimelineFont;

    /** The range unit label formats. */
    formats?: TempisTimelineRangeUnitLabelFormats;
}

export type TempisTimelineRangePosition = "top" | "bottom" | "both" | "none";

/**
 * The options for the timeline range.
 */
export interface TempisTimelineRangeOptions {
    /** Whether the timeline range is fixed and cannot be modified via user interaction. */
    fixed?: boolean;

    /** The minor range unit options. */
    minorUnit?: TempisTimelineRangeUnitOptions;

    /** The major range unit options. */
    majorUnit?: TempisTimelineRangeUnitOptions;

    /** The range position. */
    position?: TempisTimelineRangePosition;

    /** The minimum date that can be displayed. */
    min?: string | number | Date;

    /** The maximum date that can be displayed. */
    max?: string | number | Date;

    /** The initial start range value. */
    start?: string | number | Date;

    /** The initial end range value. */
    end?: string | number | Date;

    /** The timeline range zoom options. */
    zoom?: TempisTimelineRangeZoomOptions;
}

export interface TempisTimelineRangeZoomOptions {
    /** Whether zooming is enabled. */
    enabled?: boolean;

    /** The minimum range that can be zoomed to in milliseconds. */
    min?: number;

    /** The maximum range that can be zoomed to in milliseconds. */
    max?: number;

    /** The mouse wheel zoom sensitivity multiplier. Higher values = faster zoom. Defaults to 1.0. */
    wheelSensitivity?: number;

    /** The touch pinch zoom sensitivity multiplier. Higher values = faster zoom. Defaults to 1.0. */
    pinchSensitivity?: number;
}

export type TempisTimelineLegendPosition = "top" | "bottom" | "none";

export type TempisTimelineAlignment = "start" | "center" | "end";

export type TempisTimelineMarkerStyle = "square" | "square-rounded" | "circle";

/**
 * The options for the timeline legend.
 */
export interface TempisTimelineLegendOptions {
    /** The legend position. */
    position?: TempisTimelineLegendPosition;

    /** The legend horizontal alignment. */
    alignment?: TempisTimelineAlignment;

    /** The legend item marker style. Defaults to `"square-rounded"` */
    markerStyle?: TempisTimelineMarkerStyle;

    /** The flag defining whether to highlight category items in the timeline when the corresponding category is hovered over in the legend. Defaults to `true` */
    isHighlightOnHover?: boolean;

    /** The flag defining whether clicking a category in the legend toggles the visibility of all timeline items belonging to that category. Defaults to `true` */
    isFilterOnClick?: boolean;

    /** The amount of gap between legend items. */
    gap?: number;
}

/**
 * The options for a timeline item.
 */
export interface TempisTimelineItem {
    /** The item identifier. */
    id: string | number;

    /** The item start date as a date string, number of millis or Date object. */
    start: string | number | Date;

    /** The item end date (if item is a range) as a date string, number of millis or Date object. */
    end?: string | number | Date;

    /** The item label. */
    label?: string;

    /** The item grouping. */
    grouping?: string;

    /** The item category. */
    category?: string;

    /** The item style. */
    style?: TempisTimelineItemStyle;

    /** A flag defining whether the item is selected. */
    selected?: boolean;

    /** IDs of items that this item depends on. Renders connector arrows from each dependency to this item. */
    dependencies?: (string | number)[];
}

/**
 * The options for a timeline category.
 */
export interface TempisTimelineCategory {
    /** The category name, correlating to the 'category' property of items. */
    name: string;

    /** The category label. */
    label: string;

    /** The style to apply to items in this category. The backgroundColor property will be applied as the legend key color. */
    style?: TempisTimelineItemStyle;
}

/**
 * The options for a timeline band.
 */
export interface TempisTimelineBand {
    /** The band start date as a date string, number of millis or Date object. */
    start: string | number | Date;

    /** The band end date as a date string, number of millis or Date object. */
    end?: string | number | Date;

    /** The band style. */
    style?: TempisTimelineBandStyle;
}

/**
 * The style options for a timeline band.
 */
export interface TempisTimelineBandStyle {
    /** The colour of the band. */
    color?: string;

    /** The border color. */
    borderColor?: string;

    /** The border thickness. */
    borderThickness?: number;

    /** The band opacity. */
    opacity?: number;
}
