import { TempisTimelineItemStyle } from "./TempisTimelineOptions";

export class TimelineItemCategory {
    /** The category name. */
    private readonly _name: string;

    /** The item style to apply to items linked to this category. */
    private readonly _style: TempisTimelineItemStyle;

    /**
     * Creates a new instance of the TimelineItemCategory class.
     * @param name The category name.
     * @param style The item style to apply to items linked to this category.
     */
    public constructor(name: string, style: TempisTimelineItemStyle) {
        this._name = name;
        this._style = style;
    }

    /** Gets the category name. */
    public get name(): string {
        return this._name;
    }

    /** Gets the item style to apply to items linked to this category. */
    public get style(): TempisTimelineItemStyle {
        return this._style;
    }
}