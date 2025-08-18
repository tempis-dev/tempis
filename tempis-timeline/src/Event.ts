/**
 * An event object passed when the OnSelectionChange callback is invoked.
 */
export type SelectionChangeEvent = {
    /** The identifier of the item for which the selection state has changed. */
    id: string | number;

    /** A flag defining the updated selected state of the item. */
    selected: boolean;
};