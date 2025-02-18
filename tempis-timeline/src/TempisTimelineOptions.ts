export interface TempisTimelineOptions {
    /** Whether the canvas should resize to match the dimensions of its parent container. */
    responsive?: boolean;

    /** The timeline range options. */
    range?: TempisTimelineRangeOptions;

    /** The default font to use in rendering text. */
    font?: TempisTimelineFont;

    /** The items to display on the timeline. */
    items: TempisTimelineItem[];
};

export interface TempisTimelineFont {
    size?: number;
    family?: string;
    style?: string;
    weight?: "normal" | "bold" | "lighter" | "bolder" | number
    lineHeight?: number | string
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

export interface TempisTimelineItem {
    id: string | number;
    start: string | number | Date;
    end?: string | number | Date;
    caption?: string;
    grouping?: string;
};