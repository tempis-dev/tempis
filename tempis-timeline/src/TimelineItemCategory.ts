import { TempisTimelineItemStyle } from "./TempisTimelineOptions";

export class TimelineItemCategory {
    /** The category name. */
    private readonly _name: string;

    /** The category label. */
    private readonly _label: string;

    /** The item style to apply to items linked to this category. */
    private readonly _style: TempisTimelineItemStyle;

    /** A flag defining whether the category is disabled. */
    private _isDisabled: boolean = false;

    /** A flag defining whether the category is focused. */
    private _isFocused: boolean = false;

    /**
     * Creates a new instance of the TimelineItemCategory class.
     * @param name The category name.
     * @param name The category label.
     * @param style The item style to apply to items linked to this category.
     */
    public constructor(name: string, label: string, style: TempisTimelineItemStyle) {
        this._name = name;
        this._label = label;
        this._style = style;
    }

    /** Gets the category name. */
    public get name(): string {
        return this._name;
    }

    /** Gets the category label. */
    public get label(): string {
        return this._label;
    }

    /** Gets the item style to apply to items linked to this category. */
    public get style(): TempisTimelineItemStyle {
        return this._style;
    }

    /** Gets or sets whether the category is disabled. */
    public get isDisabled(): boolean {
        return this._isDisabled;
    }
    public set isDisabled(value: boolean) {
        this._isDisabled = value;
    }

    /** Gets or sets whether the category is focused. */
    public get isFocused(): boolean {
        return this._isFocused;
    }
    public set isFocused(value: boolean) {
        this._isFocused = value;
    }
}