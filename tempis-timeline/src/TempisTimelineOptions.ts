export interface TempisTimelineOptions {
    /** Whether the canvas should resize to match the dimensions of its parent container. */
    responsive?: boolean;

    /** The timeline range options. */
    range?: TempisTimelineRangeOptions;
    
    /** The timeline style options. */
    style?: TempisTimelineStyleOptions;

    /** The items to display on the timeline. */
    items: TempisTimelineItem[];
};

export interface TempisTimelineStyleOptions {
    /** The default font to use in rendering text. */
    font?: TempisTimelineFont;
}

export interface TempisTimelineFont {
    size?: number;
    family?: string;
    style?: string;
    weight?: "normal" | "bold" | "lighter" | "bolder" | number;
    lineHeight?: number | string;
}

export interface TempisTimelineRangeOptions {
    minorUnit?: TempisTimelineRangeUnitOptions;
    majorUnit?: TempisTimelineRangeUnitOptions;
    position?: TempisTimelineRangePosition;
};

export interface TempisTimelineRangeUnitOptions {
    font?: TempisTimelineFont;
    formats?: TempisTimelineRangeUnitLabelFormats;
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

export interface TempisTimelineItem {
    id: string | number;
    start: string | number | Date;
    end?: string | number | Date;
    caption?: string;
    grouping?: string;
    style?: TempisTimelineItemStyle;
};