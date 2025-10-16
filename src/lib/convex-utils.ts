import { formatDistanceToNowStrict, type Month } from "date-fns";
import { enUS } from "date-fns/locale";
import { distance } from "fastest-levenshtein";
import { oneDayMs, oneMonthMs, oneWeekMs } from "./constants/time";
import type { Choice, ChoiceInfo } from "./types/pollster";

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

  const oneMinInMs = 60 * 1000;
  const oneDayInMs = 24 * 60 * oneMinInMs;
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
        timeZone: "UTC",
      })
      .toLowerCase();

    return `${day} ${month} ${time}`;
  } else if (timeDiffInMs < oneMinInMs) {
    return "less than a minute ago";
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

/**
 * Capitalizes a string.
 *
 * @returns A string with the first letter capitalized.
 */
export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * @param createdAt A millisecond value.
 * @returns A formatted date string.
 */
export function getDateFromCreatedAt(createdAt: number) {
  const createdAtDate = new Date(createdAt);
  const joinMonth = createdAtDate.getMonth() as Month;

  const dateString = `${enUS.localize.month(
    joinMonth,
  )} ${createdAtDate.getFullYear()}`;

  return dateString;
}

/**
 * @param duration A millisecond value.
 * @returns The duration in string form.
 */
export function durationToString(duration: number) {
  let str = "";

  switch (duration) {
    case oneDayMs:
      str = "1 day";
      break;
    case oneWeekMs:
      str = "1 week";
      break;
    case oneMonthMs:
      str = "1 month";
      break;
  }

  return str;
}

/**
 * Formats a time duration (in ms) as a countdown string.
 *
 * For example, if `ms` is the time remaining until an event, this function will return a string
 * like "6d 4h 12m" (for 6 days, 4 hours, and 12 minutes remaining), "2h 5m 10s", or "45s" depending on the value.
 * If the duration is zero or negative, returns "Expired".
 *
 * @param ms - The time duration in milliseconds.
 * @returns A formatted string representing the remaining time.
 */
export function formatTimeRemaining(ms: number): string {
  if (ms <= 0) return "Expired";

  const totalSeconds = Math.floor(ms / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (days > 0) {
    return `${days}d ${hours}h ${minutes}m`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m ${seconds}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  } else {
    return `${seconds}s`;
  }
}

/**
 * @param choices Choices from a poll.
 * @returns The choice with the most votes.
 */
export function getTopChoice(choices: Choice[]): Choice {
  let topChoice = choices[0];

  choices.forEach((choice) => {
    if (choice.totalVotes > topChoice.totalVotes) {
      topChoice = choice;
    }
  });

  return topChoice;
}

/**
 * @param choiceInfo Information for a choice in a poll.
 * @returns The name of the choice with the most votes.
 */
export function getChoiceItemName(choiceInfo: ChoiceInfo) {
  if (choiceInfo.artist === "") return undefined;

  let value = "";

  if (choiceInfo.track || choiceInfo.album) {
    value += `${choiceInfo.track || choiceInfo.album} — `;
  }

  value += choiceInfo.artist;

  return value;
}
