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

/**
 * Generates an MD5 hash from the provided content using a pure JavaScript implementation.
 *
 * @param content - The string content to hash.
 * @returns The MD5 hash as a hexadecimal string (32 characters).
 *
 * @example
 * ```
 * const hash = md5("Hello, world!");
 * console.log(hash); // "6cd3556deb0da54bca060b4c39479839"
 * ```
 *
 * @example
 * // Creating a signature for Last.fm API authentication
 * ```
 * const apiKey = "your_api_key";
 * const secret = "your_secret";
 * const token = "auth_token";
 * const raw = `api_key${apiKey}methodauth.getSessiontoken${token}${secret}`;
 * const signature = md5(raw);
 * ```
 */
export function md5(content: string): string {
  /**
   * Adds two 32-bit integers with proper overflow handling.
   */
  function add32(a: number, b: number): number {
    return (a + b) & 0xffffffff;
  }

  /**
   * Performs a left rotation on a 32-bit integer.
   */
  function rol32(num: number, shift: number): number {
    return (num << shift) | (num >>> (32 - shift));
  }

  /**
   * MD5 auxiliary functions.
   */
  function cmn(
    q: number,
    a: number,
    b: number,
    x: number,
    s: number,
    t: number,
  ): number {
    return add32(rol32(add32(add32(a, q), add32(x, t)), s), b);
  }

  function ff(
    a: number,
    b: number,
    c: number,
    d: number,
    x: number,
    s: number,
    t: number,
  ): number {
    return cmn((b & c) | (~b & d), a, b, x, s, t);
  }

  function gg(
    a: number,
    b: number,
    c: number,
    d: number,
    x: number,
    s: number,
    t: number,
  ): number {
    return cmn((b & d) | (c & ~d), a, b, x, s, t);
  }

  function hh(
    a: number,
    b: number,
    c: number,
    d: number,
    x: number,
    s: number,
    t: number,
  ): number {
    return cmn(b ^ c ^ d, a, b, x, s, t);
  }

  function ii(
    a: number,
    b: number,
    c: number,
    d: number,
    x: number,
    s: number,
    t: number,
  ): number {
    return cmn(c ^ (b | ~d), a, b, x, s, t);
  }

  /**
   * Converts a string to an array of 32-bit little-endian words.
   */
  function stringToWords(str: string): number[] {
    const len = str.length;
    const nWords = (((len + 8) >>> 6) << 4) + 16;
    const words: number[] = new Array(nWords).fill(0);

    for (let i = 0; i < len; i++) {
      words[i >> 2] |= (str.charCodeAt(i) & 0xff) << ((i % 4) * 8);
    }

    return words;
  }

  /**
   * Converts a 32-bit word array to a hexadecimal string.
   */
  function wordsToHex(words: number[]): string {
    const hexChars = "0123456789abcdef";
    let hex = "";

    for (let i = 0; i < words.length * 4; i++) {
      hex +=
        hexChars[(words[i >> 2] >> ((i % 4) * 8 + 4)) & 0xf] +
        hexChars[(words[i >> 2] >> ((i % 4) * 8)) & 0xf];
    }

    return hex;
  }

  const x = stringToWords(content);
  const len = content.length * 8;

  x[len >> 5] |= 0x80 << len % 32;
  x[(((len + 64) >>> 9) << 4) + 14] = len;

  let a = 0x67452301;
  let b = 0xefcdab89;
  let c = 0x98badcfe;
  let d = 0x10325476;

  for (let i = 0; i < x.length; i += 16) {
    const oldA = a;
    const oldB = b;
    const oldC = c;
    const oldD = d;

    a = ff(a, b, c, d, x[i + 0], 7, 0xd76aa478);
    d = ff(d, a, b, c, x[i + 1], 12, 0xe8c7b756);
    c = ff(c, d, a, b, x[i + 2], 17, 0x242070db);
    b = ff(b, c, d, a, x[i + 3], 22, 0xc1bdceee);
    a = ff(a, b, c, d, x[i + 4], 7, 0xf57c0faf);
    d = ff(d, a, b, c, x[i + 5], 12, 0x4787c62a);
    c = ff(c, d, a, b, x[i + 6], 17, 0xa8304613);
    b = ff(b, c, d, a, x[i + 7], 22, 0xfd469501);
    a = ff(a, b, c, d, x[i + 8], 7, 0x698098d8);
    d = ff(d, a, b, c, x[i + 9], 12, 0x8b44f7af);
    c = ff(c, d, a, b, x[i + 10], 17, 0xffff5bb1);
    b = ff(b, c, d, a, x[i + 11], 22, 0x895cd7be);
    a = ff(a, b, c, d, x[i + 12], 7, 0x6b901122);
    d = ff(d, a, b, c, x[i + 13], 12, 0xfd987193);
    c = ff(c, d, a, b, x[i + 14], 17, 0xa679438e);
    b = ff(b, c, d, a, x[i + 15], 22, 0x49b40821);

    a = gg(a, b, c, d, x[i + 1], 5, 0xf61e2562);
    d = gg(d, a, b, c, x[i + 6], 9, 0xc040b340);
    c = gg(c, d, a, b, x[i + 11], 14, 0x265e5a51);
    b = gg(b, c, d, a, x[i + 0], 20, 0xe9b6c7aa);
    a = gg(a, b, c, d, x[i + 5], 5, 0xd62f105d);
    d = gg(d, a, b, c, x[i + 10], 9, 0x02441453);
    c = gg(c, d, a, b, x[i + 15], 14, 0xd8a1e681);
    b = gg(b, c, d, a, x[i + 4], 20, 0xe7d3fbc8);
    a = gg(a, b, c, d, x[i + 9], 5, 0x21e1cde6);
    d = gg(d, a, b, c, x[i + 14], 9, 0xc33707d6);
    c = gg(c, d, a, b, x[i + 3], 14, 0xf4d50d87);
    b = gg(b, c, d, a, x[i + 8], 20, 0x455a14ed);
    a = gg(a, b, c, d, x[i + 13], 5, 0xa9e3e905);
    d = gg(d, a, b, c, x[i + 2], 9, 0xfcefa3f8);
    c = gg(c, d, a, b, x[i + 7], 14, 0x676f02d9);
    b = gg(b, c, d, a, x[i + 12], 20, 0x8d2a4c8a);

    a = hh(a, b, c, d, x[i + 5], 4, 0xfffa3942);
    d = hh(d, a, b, c, x[i + 8], 11, 0x8771f681);
    c = hh(c, d, a, b, x[i + 11], 16, 0x6d9d6122);
    b = hh(b, c, d, a, x[i + 14], 23, 0xfde5380c);
    a = hh(a, b, c, d, x[i + 1], 4, 0xa4beea44);
    d = hh(d, a, b, c, x[i + 4], 11, 0x4bdecfa9);
    c = hh(c, d, a, b, x[i + 7], 16, 0xf6bb4b60);
    b = hh(b, c, d, a, x[i + 10], 23, 0xbebfbc70);
    a = hh(a, b, c, d, x[i + 13], 4, 0x289b7ec6);
    d = hh(d, a, b, c, x[i + 0], 11, 0xeaa127fa);
    c = hh(c, d, a, b, x[i + 3], 16, 0xd4ef3085);
    b = hh(b, c, d, a, x[i + 6], 23, 0x04881d05);
    a = hh(a, b, c, d, x[i + 9], 4, 0xd9d4d039);
    d = hh(d, a, b, c, x[i + 12], 11, 0xe6db99e5);
    c = hh(c, d, a, b, x[i + 15], 16, 0x1fa27cf8);
    b = hh(b, c, d, a, x[i + 2], 23, 0xc4ac5665);

    a = ii(a, b, c, d, x[i + 0], 6, 0xf4292244);
    d = ii(d, a, b, c, x[i + 7], 10, 0x432aff97);
    c = ii(c, d, a, b, x[i + 14], 15, 0xab9423a7);
    b = ii(b, c, d, a, x[i + 5], 21, 0xfc93a039);
    a = ii(a, b, c, d, x[i + 12], 6, 0x655b59c3);
    d = ii(d, a, b, c, x[i + 3], 10, 0x8f0ccc92);
    c = ii(c, d, a, b, x[i + 10], 15, 0xffeff47d);
    b = ii(b, c, d, a, x[i + 1], 21, 0x85845dd1);
    a = ii(a, b, c, d, x[i + 8], 6, 0x6fa87e4f);
    d = ii(d, a, b, c, x[i + 15], 10, 0xfe2ce6e0);
    c = ii(c, d, a, b, x[i + 6], 15, 0xa3014314);
    b = ii(b, c, d, a, x[i + 13], 21, 0x4e0811a1);
    a = ii(a, b, c, d, x[i + 4], 6, 0xf7537e82);
    d = ii(d, a, b, c, x[i + 11], 10, 0xbd3af235);
    c = ii(c, d, a, b, x[i + 2], 15, 0x2ad7d2bb);
    b = ii(b, c, d, a, x[i + 9], 21, 0xeb86d391);

    a = add32(a, oldA);
    b = add32(b, oldB);
    c = add32(c, oldC);
    d = add32(d, oldD);
  }

  return wordsToHex([a, b, c, d]);
}

/**
 * Generates a random code for OAuth flow using pure TypeScript
 */
export function generateRandomCode(): string {
  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < 64; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
