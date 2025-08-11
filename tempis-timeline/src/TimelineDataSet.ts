import { TempisTimelineItem, TempisTimelineOptions } from "./TempisTimelineOptions";
import { TimelineItemGrouping } from "./TimelineItemGrouping";
import { TimelineItemCategory } from "./TimelineItemCategory";
import { getGlobalPalette } from "./ColorPalette";

export class TimelineDataSet {
    /** The timeline item groupings. */
    private _groupings: TimelineItemGrouping[] = [];

    /** The timeline item categories. */
    private _categories: TimelineItemCategory[] = [];

    /** The minimum date of any item. */
    private _minDate: Date | null = null;

    /** The maximum date of any item. */
    private _maxDate: Date | null = null;

    /** The callback to invoke whenever the dataset changes. */
    private readonly _onChange: (() => void) | null;

    /**
     * Creates a new instance of the TimelineDataSet class.
     * @param onChange A callback to invoke whenever the dataset changes.
     */
    public constructor(onChange?: () => void) {
        this._onChange = onChange ?? null;
    }

    /** Gets the item groupings. */
    public get groupings(): TimelineItemGrouping[] {
        return [...this._groupings];
    }

    /** Gets the item categories. */
    public get categories(): TimelineItemCategory[] {
        return [...this._categories];
    }

    /** Gets the min date of any item in the dataset, or null if empty. */
    public get minDate(): Date | null {
        return this._minDate;
    }

    /** Gets the max date of any item in the dataset, or null if empty. */
    public get maxDate(): Date | null {
        return this._maxDate;
    }

    /**
     * Updates the dataset.
     */
    public update(options: TempisTimelineOptions) {
        // We first need to create our categories.
        this._createCategories(options);

        // Then we need to create our actual groupings and item models.
        this._createGroupings(options);        
    }

    /**
     * Creates the item categories.
     * @param options The timeline options.
     */
    private _createCategories(options: TempisTimelineOptions): void {
        // Clear any existing item categories.
        this._categories = [];

        // Keep track of existing category names to handle duplicates.
        const categoryNames: string[] = [];

        // A generator function to get the next available palette color.
        function* paletteCycle(): Generator<string, never, unknown> {
            let paletteIndex = 0;

            // Grab the global color palette.
            const palette = getGlobalPalette();

            while (true) {
                yield palette[paletteIndex];

                paletteIndex = (paletteIndex + 1) % palette.length;
            }
        }

        const getNextPaletteColor = paletteCycle();

        for (const categoryDefinition of options.categories ?? []) {
            // A valid category must have a name.
            if (!categoryDefinition.name) {
                continue;
            }

            // We cannot allow for duplicate category names.
            if (categoryNames.includes(categoryDefinition.name)) {
                throw new Error("Duplicate category name");
            }

            const categoryStyle = categoryDefinition.style ?? {};

            // Each category must have a unique background color defined, this background color is used as the category color.
            // If the user has not defined a category color then we will grab the next available one from the global color palette.
            categoryStyle.backgroundColor = categoryStyle.backgroundColor ?? getNextPaletteColor.next().value;

            this._categories.push(new TimelineItemCategory(categoryDefinition.name, categoryStyle));

            categoryNames.push(categoryDefinition.name);
        }
    }

    /**
     * Creates the item groupings and grouped item models.
     * @param options The item definitions.
     */
    private _createGroupings(options: TempisTimelineOptions): void {
        // Clear any existing item groupings.
        this._groupings = [];

        // Create a mapping of group names to item group item definitions.
        const itemGroupingMap: { [key: string]: TempisTimelineItem[] } = {};

        for (const itemDefinition of options.items ?? []) {
            // Our grouping key will default to just an empty string.
            const groupingKey = itemDefinition.grouping ?? "";

            // Try to get the existing grouping for this item.
            let group = itemGroupingMap[groupingKey];

            // Create a new group if there isn't one for this grouping.
            if (!group) {
                group = [];
                itemGroupingMap[groupingKey] = group;
            }

            // Add the definition for the current item to its group.
            group.push(itemDefinition);
        }

        // Create our new item groupings.
        for (const [key, value] of Object.entries(itemGroupingMap)) {
            this._groupings.push(new TimelineItemGrouping(key, value));
        }

        // Find the min and max dates of any start/end item dates.
        this._findMinAndMaxDates();

        // Invoke the onChange callback.
        // TODO We should eventually try to only call this IF the state of our dataset has changed.
        this._onChange?.();
    }

    /**
     * Find the min and max dates of any start/end item dates.
     */
    private _findMinAndMaxDates(): void {
        // Do we have no items to use in finding a range?
        if (this._groupings.length === 0 || this._groupings[0].items.length === 0) {
            this._minDate = null;
            this._maxDate = null;
            return;
        }

        let minDate: Date | null = null;
        let maxDate: Date | null = null;

        for (const grouping of this._groupings) {
            for (const item of grouping.items) {
                if (minDate === null || item.start.getTime() < minDate.getTime()) {
                    minDate = item.start;
                }
                if (maxDate === null || (item.end ?? item.start).getTime() > maxDate.getTime()) {
                    maxDate = item.end ?? item.start;
                }
            }
        }

        this._minDate = minDate;
        this._maxDate = maxDate;
    }
}