export type TempisTimelineOptions = {
    /** Whether the canvas should resize to match the dimensions of its parent container. */
    responsive?: boolean;

    /** The timeline range options. */
    range?: TempisTimelineRangeOptions;

    /** The items to display on the timeline. */
    items: TempisTimelineItem[];
};

export type TempisTimelineRangeOptions = {

};


export type TempisTimelineItem = {
    id: string | number;
    start: string | number | Date;
    // TODO Make optional to allow for point-in-time items.
    end: string | number | Date;
    caption?: string;
    grouping?: string;
};