export interface TempisTimelineOptions {
    /** Whether the canvas should resize to match the dimensions of its parent container. */
    responsive?: boolean;

    /** The timeline range options. */
    range?: TempisTimelineRangeOptions;

    /** The items to display on the timeline. */
    items: TempisTimelineItem[];
};

export interface TempisTimelineRangeOptions {
    minorUnit?: TempisTimelineRangeUnitOptions;
    majorUnit?: TempisTimelineRangeUnitOptions;
};

export interface TempisTimelineRangeUnitOptions {
    labelFormats?: TempisTimelineRangeUnitLabelFormats;
};

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