import { format } from "date-format-parse";
import { TempisTimelineDateAdapter, DateInput, TimeInstant, Unit } from "./TempisTimelineDateAdapter";

/**
 * Default date adapter implementation using native JavaScript Date objects.
 *
 * This adapter operates in the browser's local timezone and provides a reference
 * implementation for custom adapters. It uses the native Date API for all calendar
 * operations, which means:
 * - All operations use the browser's configured timezone
 * - DST transitions are handled by the JavaScript engine
 * - Month arithmetic follows JavaScript Date semantics
 */
export class NativeDateAdapter implements TempisTimelineDateAdapter {
    /**
     * Parse a user-provided value into a timestamp.
     * Returns null for invalid inputs rather than throwing exceptions.
     */
    parse(input: DateInput): TimeInstant | null {
        // Handle null/undefined
        if (input == null) {
            return null;
        }

        // Handle number (already a timestamp)
        if (typeof input === "number") {
            return isNaN(input) ? null : input;
        }

        // Handle Date object
        if (input instanceof Date) {
            const timestamp = input.getTime();
            return isNaN(timestamp) ? null : timestamp;
        }

        // Handle string
        if (typeof input === "string") {
            const date = new Date(input);
            const timestamp = date.getTime();
            return isNaN(timestamp) ? null : timestamp;
        }

        // Unknown type
        return null;
    }

    startOf(instant: TimeInstant, unit: Unit): TimeInstant {
        const date = new Date(instant);

        switch (unit) {
            case "year":
                date.setMonth(0, 1);
                date.setHours(0, 0, 0, 0);
                break;

            case "month":
                date.setDate(1);
                date.setHours(0, 0, 0, 0);
                break;

            case "week": {
                // Week starts on Sunday (0)
                const day = date.getDay();
                date.setDate(date.getDate() - day);
                date.setHours(0, 0, 0, 0);
                break;
            }

            case "day":
                date.setHours(0, 0, 0, 0);
                break;

            case "hour":
                date.setMinutes(0, 0, 0);
                break;

            case "minute":
                date.setSeconds(0, 0);
                break;

            case "second":
                date.setMilliseconds(0);
                break;

            case "millisecond":
                return instant;

            default:
                throw new Error(`Unknown time unit: ${unit}`);
        }

        return date.getTime();
    }

    add(instant: TimeInstant, unit: Unit, amount: number): TimeInstant {
        const date = new Date(instant);

        switch (unit) {
            case "year":
                date.setFullYear(date.getFullYear() + amount);
                break;

            case "month":
                date.setMonth(date.getMonth() + amount);
                break;

            case "week":
                date.setDate(date.getDate() + amount * 7);
                break;

            case "day":
                date.setDate(date.getDate() + amount);
                break;

            case "hour":
                date.setHours(date.getHours() + amount);
                break;

            case "minute":
                date.setMinutes(date.getMinutes() + amount);
                break;

            case "second":
                date.setSeconds(date.getSeconds() + amount);
                break;

            case "millisecond":
                return instant + amount;

            default:
                throw new Error(`Unknown time unit: ${unit}`);
        }

        return date.getTime();
    }

    format(instant: TimeInstant, pattern: string): string {
        const date = new Date(instant);
        // Use date-format-parse library directly (DateFormatter is now redundant)
        return format(date, pattern ?? "D MMMM HH:mm:ss");
    }
}
