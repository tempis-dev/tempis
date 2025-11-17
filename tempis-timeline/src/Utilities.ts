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

/**
 * Draws text onto a canvas, truncating it visually with an ellipsis ("...") if it exceeds the specified maximum width.
 * @param {CanvasRenderingContext2D} context - The 2D rendering context of the canvas.
 * @param {string} text The text to render.
 * @param {number} x The x-coordinate where the text starts.
 * @param {number} y The y-coordinate where the text baseline is drawn.
 * @param {number} maxWidth The maximum allowed width for the text (including the ellipsis).
 */
export function drawClippedText(context: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number) {
    // There is nothing to do if we have no text to draw.
    if (!text) {
        return;
    }

    const ellipsis = "...";
    const ellipsisWidth = context.measureText(ellipsis).width;
    const textWidth = context.measureText(text).width;

    // If the text already fits then just draw it normally.
    if (textWidth <= maxWidth) {
        context.fillText(text, x, y);
        return;
    }

    // If the ellipsis alone doesn't fit, skip drawing.
    if (ellipsisWidth > maxWidth) {
        return;
    }

    // TODO Tidy following logic.

    // Grab the text alignment for the canvas context as this will influence how we render our text.
    const textAlign = context.textAlign || "left";

    // Are we rendering left-to-right?
    if (textAlign === "left" || textAlign === "center") {
        // Compute LEFT boundary
        const leftX = textAlign === "left" ? x :
                      textAlign === "center" ? x - maxWidth / 2 :
                      x;

        context.save();
        context.beginPath();
        context.rect(leftX, y - parseInt(context.font), maxWidth - ellipsisWidth, parseInt(context.font) * 2);
        context.clip();
        context.fillText(text, x, y);
        context.restore();

        // Ellipsis on the RIGHT
        context.textAlign = "right";
        context.fillText(ellipsis, leftX + maxWidth, y);
        context.textAlign = textAlign;
        return;
    }

    // Are we rendering right-to-left?
    if (textAlign === "right") {
        // Compute RIGHT boundary (where the text ends)
        const rightX = x;

        // In RTL, we want to keep the *end* (right side) and clip the *start* (left side)
        const clipLeftX = rightX - (maxWidth - ellipsisWidth);

        context.save();
        context.beginPath();
        context.rect(clipLeftX, y - parseInt(context.font), maxWidth - ellipsisWidth, parseInt(context.font) * 2);
        context.clip();
        context.fillText(text, x, y);  // will draw full text, clipped from LEFT
        context.restore();

        // Draw ellipsis on the LEFT
        context.textAlign = "right";
        context.fillText(ellipsis, clipLeftX, y);
        context.textAlign = textAlign;
        return;
    }
}

/**
 * Merges multiple source objects into the first one, assigning default values 
 * for properties that are `null` or `undefined` in the target.
 *
 * The function iterates over each source (from left to right) and copies any 
 * property that does not already exist (i.e., is `null` or `undefined`) on 
 * the target. The target is the first object in the argument list and is 
 * mutated in place.
 *
 * @template T - The object type of all source objects.
 * @param {...Partial<T>[]} sources - One or more partial objects to merge. 
 *   - The first object acts as the target to receive defaults.
 *   - Subsequent objects provide default values.
 *
 * @returns {Partial<T> | undefined} 
 * Returns the target object with defaults applied, or `undefined` if no sources are provided.
 *
 * @example
 * const a = { name: "Alice" };
 * const b = { age: 25, name: "Bob" };
 * const c = { country: "USA" };
 *
 * // Only fills missing fields in 'a' (since 'name' is already set)
 * const result = defaults(a, b, c);
 * console.log(result); 
 * // → { name: "Alice", age: 25, country: "USA" }
 *
 * @note
 * - This function mutates the first argument (`sources[0]`).
 * - Only `null` or `undefined` properties are replaced; falsy values like `0` or `""` are preserved.
 */
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