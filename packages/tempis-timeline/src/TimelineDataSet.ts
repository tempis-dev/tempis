import { TempisTimelineItem, TempisTimelineItemStyle, TempisTimelineOptions } from "./TempisTimelineOptions";
import { TimelineItemGrouping } from "./TimelineItemGrouping";
import { TimelineItemCategory } from "./TimelineItemCategory";
import { ColorPalette } from "./ColorPalette";
import { DEFAULT_ITEM_STYLE, TimelineItem } from "./TimelineItem";
import { defaults } from "./Utilities";

/**
 * A callback function that can be registered to be invoked when the dataset is updated.
 */
export type UpdateCallback = () => void;

/**
 * The timeline dataset model.
 */
export class TimelineDataSet {
    /** The timeline item groupings. */
    private _groupings: TimelineItemGrouping[] = [];

    /** The timeline item categories. */
    private _categories: TimelineItemCategory[] = [];

    /** A mapping of category names to timeline item categories. This is used for quick lookup. */
    private _categoriesMap: Record<string, TimelineItemCategory> = {};

    /** The minimum date of any item. */
    private _minDate: Date | null = null;

    /** The maximum date of any item. */
    private _maxDate: Date | null = null;

    /** The currently focused category. */
    private _focusedCategory: TimelineItemCategory | null = null;

    /** Whether any items in the dataset have dependencies defined. */
    private _hasDependencies: boolean = false;

    /** The registered update callbacks that are to be invoked when the dataset is updated. */
    private _registeredUpdateCallbacks: UpdateCallback[] = [];

    /**
     * Create a new instance of the TimelineDataSet class.
     * @param options The timeline options.
     */
    public constructor(options: TempisTimelineOptions) {
        // Populate our dataset with the initial item configuration.
        this.update(options);
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

    /** Gets the currently focused category, or null if there is no focused category. */
    public get focusedCategory(): TimelineItemCategory | null {
        return this._focusedCategory;
    }

    /** Whether any items in the dataset have dependencies. */
    public get hasDependencies(): boolean {
        return this._hasDependencies;
    }

    /**
     * Gets the item with the specified identifier, or null if it does not exist.
     * @param id The item identifier to search for.
     * @return The item with the specified identifier, or null if it does not exist.
     */
    public getItemById(id: number | string): TimelineItem | null {
        // We need to check each group for the item with the specified identifier.
        for (const group of this._groupings) {
            // Try to get the item from the current group with the specified identifier.
            const item = group.getItemById(id);

            if (item) {
                return item;
            }
        }

        // We were unable to find the item with the specified identifier in any group.
        return null;
    }

    /**
     * Gets the category with the specified name.
     * @param name The category name.
     * @returns The category with the specified name, or null if one does not exist.
     */
    public getCategory(name: string): TimelineItemCategory | null {
        return this._categoriesMap[name] ?? null;
    }

    /**
     * Enables the category with the specified name.
     * @param name The category name.
     */
    public enableCategory(name: string): void {
        // Try to get the category with the given name.
        const category = this.getCategory(name);

        if (category && category.isDisabled) {
            // Mark the disabled category as enabled.
            category.isDisabled = false;

            this._invokeUpdateCallbacks();
        }
    }

    /**
     * Disables the category with the specified name.
     * @param name The category name.
     */
    public disableCategory(name: string): void {
        // Try to get the category with the given name.
        const category = this.getCategory(name);

        if (category && !category.isDisabled) {
            // Mark the enabled category as disabled.
            category.isDisabled = true;

            this._invokeUpdateCallbacks();
        }
    }

    /**
     * Sets the specified category as being focused and sets all others to not being focused.
     * @param name The category name.
     */
    public focusCategory(name: string): void {
        // If the category is already focused then there is nothing to do.
        if (this._focusedCategory?.name === name) {
            return;
        }

        let newlyFocusedCategory: TimelineItemCategory | null = null;

        // Update the focused state of all categories.
        for (const category of this._categories) {
            // Is this category the one to focus?
            const isFocusedCategory = category.name === name;

            // Update the focused state of the category.
            category.isFocused = isFocusedCategory;

            if (isFocusedCategory) {
                newlyFocusedCategory = category;
            }
        }

        // Has our focused category changed?
        if (this._focusedCategory !== newlyFocusedCategory) {
            this._focusedCategory = newlyFocusedCategory;
            this._invokeUpdateCallbacks();
        }
    }

    /**
     * Sets the specified category as being focused and sets all others to not being focused.
     * @param name The category name.
     */
    public unfocusCategories(): void {
        // If there is no focused category then there is nothing to do.
        if (!this._focusedCategory) {
            return;
        }

        // Update the focused state of the focused category, all others should already be unfocused.
        this._focusedCategory.isFocused = false;

        // Clear the focused category.
        this._focusedCategory = null;

        this._invokeUpdateCallbacks();
    }

    /**
     * Gets all selected timeline items.
     * @returns All selected timeline items.
     */
    public getSelectedItems(): TimelineItem[] {
        const selectedItems = [];

        for (const group of this._groupings) {
            selectedItems.push(...group.selectedItems);
        }

        return selectedItems;
    }

    /**
     * Updates the dataset.
     */
    public update(options: TempisTimelineOptions) {
        // We first need to create our categories.
        this._createCategories(options);

        // Then we need to create our actual groupings and item models.
        this._createGroupings(options);

        // Check if any items have dependencies.
        this._hasDependencies = this._groupings.some((grouping) =>
            grouping.items.some((item) => item.dependencies.length > 0)
        );

        // We have updated the dataset, so any registered update callbacks should be invoked.
        this._invokeUpdateCallbacks();
    }

    /**
     * Register a callback to be invoked when the dataset is updated.
     * @param callback The callback to be invoked when the dataset is updated.
     */
    public registerUpdateCallback(callback: UpdateCallback): void {
        this._registeredUpdateCallbacks.push(callback);
    }

    /**
     * Creates the item categories.
     * @param options The timeline options.
     */
    private _createCategories(options: TempisTimelineOptions): void {
        // Capture the current disabled state of categories so we can restore it after rebuilding.
        const previousDisabledState = new Map<string, boolean>();
        for (const category of this._categories) {
            if (category.isDisabled) {
                previousDisabledState.set(category.name, true);
            }
        }

        // Clear any existing item categories.
        this._categories = [];

        // Keep track of existing category names to handle duplicates.
        const categoryNames: string[] = [];

        // A generator function to get the next available palette color.
        function* paletteCycle(): Generator<string, never, unknown> {
            let paletteIndex = 0;

            // Grab the global color palette.
            const palette = ColorPalette.get();

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
                throw new Error(`Duplicate category name '${categoryDefinition.name}'`);
            }

            const categoryStyle = categoryDefinition.style ?? {};

            // Each category must have a unique background color defined, this background color is used as the category color.
            // If the user has not defined a category color then we will grab the next available one from the global color palette.
            categoryStyle.backgroundColor = categoryStyle.backgroundColor ?? getNextPaletteColor.next().value;

            this._categories.push(
                new TimelineItemCategory(categoryDefinition.name, categoryDefinition.label, categoryStyle)
            );

            // Restore the disabled state if this category was previously disabled.
            if (previousDisabledState.has(categoryDefinition.name)) {
                this._categories[this._categories.length - 1].isDisabled = true;
            }

            categoryNames.push(categoryDefinition.name);
        }

        // Update our categories map.
        this._categoriesMap = this._categories.reduce(
            (map, category) => {
                map[category.name] = category;
                return map;
            },
            {} as Record<string, TimelineItemCategory>
        );
    }

    /**
     * Creates the item grouping models.
     * @param options The timeline options.
     */
    private _createGroupings(options: TempisTimelineOptions): void {
        // Clear any existing item groupings.
        this._groupings = [];

        // Create a mapping of group names to item group item definitions.
        const itemGroupingMap: { [key: string]: TempisTimelineItem[] } = {};

        // Populate out mapping of group names to definitions of items that are included in those groups.
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

        // Create our item groupings.
        for (const [group, groupItemDefinitions] of Object.entries(itemGroupingMap)) {
            this._groupings.push(
                new TimelineItemGrouping(group, this._createGroupingItems(options, groupItemDefinitions))
            );
        }

        // Sort groups if a sort function is provided.
        if (options.grouping?.sort) {
            const sortFunction = options.grouping.sort;
            this._groupings.sort((a, b) => sortFunction(a.group, b.group));
        }

        // Find the min and max dates of any start/end item dates.
        this._findMinAndMaxDates();
    }

    /**
     * Creates the item grouping item models.
     * @param options The timeline options.
     * @returns The created item grouping item models.
     */
    private _createGroupingItems(
        options: TempisTimelineOptions,
        itemDefinitions: TempisTimelineItem[]
    ): TimelineItem[] {
        return itemDefinitions.map((itemDefinition) => {
            // Attempt to get the category for this item if it is associated with one.
            const category = itemDefinition.category ? this.getCategory(itemDefinition.category) : null;

            // There are multiple places that the style for an item can be defined, these are (in order of precedence high to low):
            // - The item style applied directly to the item definition.
            // - The item style defined for the category linked to the item.
            // - The general item style applied to all items via 'options.style.item'.
            // - The application default item styles defined as 'DEFAULT_ITEM_STYLE'.
            const resolvedItemStyle: TempisTimelineItemStyle = defaults(
                itemDefinition.style ?? {},
                category?.style ?? {},
                options.style?.item ?? {},
                DEFAULT_ITEM_STYLE
            )!;

            return new TimelineItem(itemDefinition, resolvedItemStyle);
        });
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

    /**
     * Invoke all registered update callbacks.
     */
    private _invokeUpdateCallbacks(): void {
        for (const callback of this._registeredUpdateCallbacks) {
            callback();
        }
    }
}
