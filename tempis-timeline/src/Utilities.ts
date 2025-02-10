/**
 * Parse the given input as a Date object.
 * @param input The input to parse as a Date object.
 */
export function parseDate(input: string | number | Date): Date {
    if (!input) {
        throw new Error("Cannot parse input as date as it is not defined");
    }

    // Is the object already a Date object?
    if (input instanceof Date) {
        // Check to make sure that the Date object is actually valid.
        if (isNaN(input.getTime())) {
            throw new Error(`Date is not valid`);
        }

        return input;
    } else if (typeof input === "string") {
        if (isNaN(Date.parse(input))) {
            throw new Error(`Cannot parse input string '${input}' as date as it is not a valid date`);
        }

        return new Date(input);
    } else if (typeof input === "number") {
        if (isNaN(Date.parse(`${input}`))) {
            throw new Error(`Cannot parse input string '${input}' as date as it is not a valid date`);
        }

        return new Date(`${input}`);
    }

    throw new Error(`Cannot parse input '${input}' as date`);
}

/**
 * Clamps the value to the min and max range.
 * @param value 
 * @param min 
 * @param max 
 * @returns 
 */
export function clamp(value: number, min: number, max: number): number {
    if (value < min) {
        return min;
    } else if (value > max) {
        return max;
    }

    return value;
}

/**
 * Gets whether the two specified two date ranges overlap.
 * @param aStart The start date of the first range.
 * @param aEnd The end date of the first range.
 * @param bStart The start date of the second range.
 * @param bEnd The end date of the second range.
 * @returns Whether the two specified two date ranges overlap.
 */
export function doDateRangesOverlap(aStart: Date, aEnd: Date, bStart: Date, bEnd: Date): boolean {
    if (aStart <= bStart && bStart <= aEnd) return true; // The second range starts in the first.
    if (aStart <= bEnd && bEnd <= aEnd) return true; // The second range ends in the first.
    if (bStart < aStart && aEnd < bEnd) return true; // The first range starts and ends in the second.
    return false;
}

export function fitCanvasText(context: CanvasRenderingContext2D, value: string, maxWidth: number): string {
    // Get the width of the entire string.
    let stringWidth = context.measureText(value).width;

    // Is the string empty or the width of our string already less than the max width? If so just return it.
    if (!value || stringWidth <= maxWidth) {
        return value;
    }

    const ellipsisWidth = context.measureText("...").width;

    // If our ellipses width is already greater than our max width then return an empty string.
    if (ellipsisWidth > maxWidth) {
        return "";
    }

    let stringCharacterLength = value.length;

    // Find the longest possible length of our string that will give a width (including the ellipsis width) that is less than the max width.
    while (stringWidth >= maxWidth - ellipsisWidth && stringCharacterLength-- > 1) {
        value = value.substring(0, stringCharacterLength);
        stringWidth = context.measureText(value).width;
    }
    
    return `${value}...`;
}