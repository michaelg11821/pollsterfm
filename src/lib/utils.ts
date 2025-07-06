import { clsx, type ClassValue } from "clsx";
import { formatDistanceToNowStrict, type Month } from "date-fns";
import { enUS } from "date-fns/locale";
import { distance } from "fastest-levenshtein";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * A helper function that parses the given ISO 8601 string and returns a string containing the strict formatted distance to now.
 *
 * @param dateString A string in the ISO 8601 format.
 * @returns The distance from now to the date in the string given.
 */
export function dateStringDistanceToNow(dateString: string): string {
  const parsed = Date.parse(dateString);

  const parsedDate = new Date(parsed);
  const now = new Date();

  const oneDayInMs = 24 * 60 * 60 * 1000;
  const timeDiffInMs = now.getTime() - parsedDate.getTime();

  if (timeDiffInMs >= oneDayInMs) {
    const monthNum = parsedDate.getMonth() as Month;
    const month = enUS.localize.month(monthNum, { width: "abbreviated" });

    const day = parsedDate.getDate();

    const time = parsedDate
      .toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
      .toLowerCase();

    return `${day} ${month} ${time}`;
  } else {
    return formatDistanceToNowStrict(parsedDate, {
      addSuffix: true,
    });
  }
}

/**
 * Removes diacritics, normalizes Unicode, and lowercases a string.
 *
 * @param str A string. Usually an artist name, an album name, or a track name.
 * @returns The normalized string.
 */
export function normalizeString(str: string): string {
  return str
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

/**
 * Checks if two strings are similar. Results will vary based on the provided threshold.
 *
 * @param query A search query.
 * @param candidate The string to compare to.
 * @param threshold Default: 3. How "forgiving" the comparison will be. Generally a number from 2-4.
 * @returns A boolean.
 */
export function isSimilar(
  query: string,
  candidate: string,
  threshold = 3,
): boolean {
  const normQuery = normalizeString(query);
  const normCandidate = normalizeString(candidate);

  return distance(normQuery, normCandidate) <= threshold;
}

/**
 * Converts a number of seconds into a duration.
 *
 * Example: 117 seconds -> 1:57.
 *
 * @param secondsVal A number of seconds.
 * @returns A duration.
 */
export function secondsToDuration(secondsVal: number) {
  const hrs = Math.floor(secondsVal / 3600);
  const mins = Math.floor((secondsVal % 3600) / 60);
  const secs = Math.floor(secondsVal % 60);

  const paddedSecs = secs.toString().padStart(2, "0");
  const paddedMins =
    hrs > 0 ? mins.toString().padStart(2, "0") : mins.toString();

  return hrs > 0
    ? `${hrs}:${paddedMins}:${paddedSecs}`
    : `${mins}:${paddedSecs}`;
}

/**
 * Converts a number of milliseconds into a duration.
 *
 * Example: 65000 ms -> 1:05.
 *
 * @param ms A number of milliseconds.
 * @returns A duration.
 */
export function msToDuration(ms: number) {
  const totalSeconds = Math.floor(ms / 1000);
  const hrs = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;

  const paddedSecs = secs.toString().padStart(2, "0");
  const paddedMins =
    hrs > 0 ? mins.toString().padStart(2, "0") : mins.toString();

  return hrs > 0
    ? `${hrs}:${paddedMins}:${paddedSecs}`
    : `${mins}:${paddedSecs}`;
}
