export interface TempisTimelineOptions {
    /** Whether the canvas should resize to match the dimensions of its parent container. */
    responsive?: boolean;

    /** The timeline range options. */
    range?: TempisTimelineRangeOptions;
    
    /** The timeline style options. */
    style?: TempisTimelineStyleOptions;

    /** The timeline item categories. */
    categories: TempisTimelineCategory[];

    /** The items to display on the timeline. */
    items: TempisTimelineItem[];
};

export interface TempisTimelineStyleOptions {
    /** The default font options to use in rendering text. */
    font?: TempisTimelineFont;

    /** The default item options to use in rendering items, overriding the library item style defaults only. */
    item?: TempisTimelineItemStyle;
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

    /** The border radius. */
    borderRadius?: number;
};

export type TempisTimelineRangePosition = "top" | "bottom" | "both" | "none";

export type TempisTimelineRangeUnitLabelFormats = {
    millisecond?: string,
    second?: string,
    minute?: string,
    hour?: string,
    day?: string,
    month?: string,
    year?: string
};

export interface TempisTimelineRangeUnitOptions {
    /** The font to apply to range unit labels. */
    font?: TempisTimelineFont;

    /** The range unit label formats. */
    formats?: TempisTimelineRangeUnitLabelFormats;
};

export interface TempisTimelineRangeOptions {
    /** The minor range unit options. */
    minorUnit?: TempisTimelineRangeUnitOptions;

    /** The major range unit options. */
    majorUnit?: TempisTimelineRangeUnitOptions;

    /** The range position. */
    position?: TempisTimelineRangePosition;
};

export interface TempisTimelineItem {
    /** The item identifier. */
    id: string | number;
    start: string | number | Date;
    end?: string | number | Date;
    caption?: string;
    grouping?: string;
    category?: string;
    style?: TempisTimelineItemStyle;
};

export interface TempisTimelineCategory {
    /** The category name, correlating to the 'category' property of items. */
    name: string;

    /** The style to apply to items in this category. The backgroundColor property will be applied as the legend key color. */
    style?: TempisTimelineItemStyle;
};