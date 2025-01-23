"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseDate = parseDate;
/**
 * Parse the given input as a Date object.
 * @param input The input to parse as a Date object.
 */
function parseDate(input) {
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
    }
    else if (typeof input === "string") {
        if (isNaN(Date.parse(input))) {
            throw new Error(`Cannot parse input string '${input}' as date as it is not a valid date`);
        }
        return new Date(input);
    }
    else if (typeof input === "number") {
        if (isNaN(Date.parse(`${input}`))) {
            throw new Error(`Cannot parse input string '${input}' as date as it is not a valid date`);
        }
        return new Date(`${input}`);
    }
    throw new Error(`Cannot parse input '${input}' as date`);
}
