export type TempisTimelineOptions = {
    /** Whether the canvas should resize to match the dimensions of its parent container. */
    responsive?: boolean;

    /** The items to display on the timeline. */
    items: TempisTimelineItem[];
};

export type TempisTimelineItem = {
    id: string | number;
    start: string | number | Date;
    end?: string | number | Date;
    display: string;
};