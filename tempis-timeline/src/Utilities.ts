/**
 * Gets whether the given value is null or undefined.
 * @param value The value to check.
 * @returns Whether the given value is null or undefined.
 */
export function isNullOrUndefined(value: any): boolean {
    return value === null || value === undefined;  
}

/**
 * Checks whether a value is a valid JavaScript Date object.
 * @param value The value to test.
 * @returns Whether a value is a valid JavaScript Date object.
 */
export function isValidDate(value: unknown): value is Date {
  return value instanceof Date && !isNaN(value.getTime());
}

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
 * Clamps the value to the optional min and max values.
 * @param value The value to clamp
 * @param min The minimum value to clamp to.
 * @param max The maximum value to clamp to.
 * @returns The clamped value.
 */
export function clamp(value: number, min?: number, max?: number): number {
    if (min !== undefined && value < min) {
        return min;
    }

    if (max !== undefined && value > max) {
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

export function defaults<T extends object>(...sources: Partial<T>[]): Partial<T> | undefined {
  if (sources.length === 0) return undefined;

  const target = sources[0] as Partial<T>;

  for (let i = 1; i < sources.length; i++) {
    const source = sources[i];
    if (!source) continue;

    Object.keys(source).forEach(key => {
      const typedKey = key as keyof T;
      if (target[typedKey] == null) {
        target[typedKey] = source[typedKey]!;
      }
    });
  }

  return target;
}