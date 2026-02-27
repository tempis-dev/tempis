/**
 * A type representing various date input formats that can be parsed.
 */
export type DateInput = Date | string | number;

/**
 * A type representing a specific moment in time as milliseconds since the Unix epoch (January 1, 1970 00:00:00 UTC).
 * This representation is timezone-independent and allows efficient comparison and arithmetic using native JavaScript operators.
 */
export type TimeInstant = number;

/**
 * Time units supported by the date adapter for calendar operations.
 */
export type Unit = 'year' | 'month' | 'week' | 'day' | 'hour' | 'minute' | 'second' | 'millisecond';

/**
 * Minimal adapter interface required by the Timeline Library.
 * 
 * All methods operate on instants represented as epoch milliseconds (TimeInstant).
 * Calendar semantics (local timezone vs specific timezone) are defined by the adapter implementation.
 * 
 * The timeline uses this adapter for calendar-aware operations (parsing, boundaries, arithmetic, formatting)
 * while using native JavaScript operators for comparisons (<, >, ===) and duration calculations (subtraction).
 */
export interface TempisTimelineDateAdapter {
  /**
   * Parse a user-provided value (Date | ISO string | epoch ms) into an instant (epoch ms).
   * 
   * @param input - The date input to parse (Date object, ISO 8601 string, or numeric timestamp)
   * @returns The parsed timestamp in milliseconds since epoch, or null if the input is invalid/unparseable
   * 
   * @example
   * ```typescript
   * adapter.parse(new Date('2024-01-01')); // Returns timestamp
   * adapter.parse('2024-01-01T12:00:00Z'); // Returns timestamp
   * adapter.parse(1704110400000); // Returns same timestamp
   * adapter.parse('invalid'); // Returns null
   * ```
   */
  parse(input: DateInput): TimeInstant | null;

  /**
   * Snap an instant down to the start of the given unit (in the adapter's calendar).
   * 
   * @param instant - The timestamp to snap
   * @param unit - The time unit to snap to
   * @returns A timestamp representing the start of the specified unit
   * 
   * @example
   * ```typescript
   * // Start of day returns midnight at the beginning of that day (in adapter's timezone/calendar)
   * adapter.startOf(instant, 'day'); // Returns 00:00:00.000 of that day
   * 
   * // Start of month returns first day of month at midnight
   * adapter.startOf(instant, 'month'); // Returns YYYY-MM-01 00:00:00.000
   * ```
   */
  startOf(instant: TimeInstant, unit: Unit): TimeInstant;

  /**
   * Add calendar units to an instant (in the adapter's calendar).
   * 
   * This method handles calendar arithmetic correctly, accounting for:
   * - Variable month lengths (28-31 days)
   * - Leap years
   * - Daylight saving time transitions (if adapter is timezone-aware)
   * 
   * @param instant - The starting timestamp
   * @param unit - The time unit to add
   * @param amount - The number of units to add (can be negative for subtraction)
   * @returns A new timestamp with the specified amount added
   * 
   * @example
   * ```typescript
   * // Add one month - handles variable month lengths
   * adapter.add(instant, 'month', 1); // Same wall-clock time next month (DST-safe per adapter rules)
   * 
   * // Subtract days using negative amount
   * adapter.add(instant, 'day', -7); // One week earlier
   * ```
   */
  add(instant: TimeInstant, unit: Unit, amount: number): TimeInstant;

  /**
   * Format an instant for display using pattern strings.
   * 
   * The pattern uses tokens like SSS, HH:mm, MMM, YYYY, etc., interpreted in the adapter's timezone/calendar.
   * 
   * @param instant - The timestamp to format
   * @param pattern - The format pattern string (e.g., "YYYY-MM-DD HH:mm:ss", "MMM D, YYYY")
   * @returns The formatted date string
   * 
   * @example
   * ```typescript
   * adapter.format(instant, 'YYYY-MM-DD'); // "2024-01-01"
   * adapter.format(instant, 'MMM D, YYYY HH:mm'); // "Jan 1, 2024 12:00"
   * ```
   */
  format(instant: TimeInstant, pattern: string): string;
}
