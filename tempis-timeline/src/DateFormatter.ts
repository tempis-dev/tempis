import { format } from 'date-format-parse';

export class DateFormatter {
    /**
     * Formats the given date as a string, using the label format for the specified unit.
     * @param date The date to format.
     * @param pattern The date format pattern to use.
     * @returns The formatted date string value.
     */
    public format(date: Date, pattern?: string): string {
        // TODO We should be using a date adapter to get this label.
        return format(date, pattern ?? 'D MMMM HH:mm:ss');
    }
}