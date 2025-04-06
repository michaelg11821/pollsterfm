import { addHours, getMinutes, getHours, getSeconds } from "date-fns";

/**
 * A helper function that converts the given amount of milliseconds into a duration.
 *
 * Ex: 200155 ms -> 3:22
 *
 * @param msAmount The amount of milliseconds in the duration.
 * @returns A formatted duration.
 */
export function convertToDuration(msAmount: number) {
  // works for the longest songs on spotify

  const normalizeTime = (time: string): string =>
    time.length === 1 ? `0${time}` : time;
  const MINUTES_IN_HOUR = 60;

  const date = new Date(msAmount);
  const timezoneDiff = date.getTimezoneOffset() / MINUTES_IN_HOUR;
  const dateWithoutTimezoneDiff = addHours(date, timezoneDiff);

  const hours = String(getHours(dateWithoutTimezoneDiff));
  const minutes = String(getMinutes(dateWithoutTimezoneDiff));
  const seconds = normalizeTime(String(getSeconds(dateWithoutTimezoneDiff)));

  const minutesOutput =
    hours.length >= 1 ? `${normalizeTime(minutes)}` : minutes;
  const hoursOutput = hours !== "0" ? `${hours}:` : "";

  return `${hoursOutput}${minutesOutput}:${seconds}`;
}
