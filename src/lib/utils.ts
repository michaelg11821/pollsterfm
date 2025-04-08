import { formatDistanceToNowStrict } from "date-fns";

/**
 * A helper function that parses the given ISO 8601 string and returns a string containing the strict formatted distance to now.
 *
 * @param dateString A string in the ISO 8601 format.
 * @returns The distance from now to the date in the string given.
 */
export function dateStringDistanceToNow(dateString: string): string {
  const parsed = Date.parse(dateString);

  const parsedDate = new Date(parsed);

  const distanceString = formatDistanceToNowStrict(parsedDate, {
    addSuffix: true,
  });

  return distanceString;
}
