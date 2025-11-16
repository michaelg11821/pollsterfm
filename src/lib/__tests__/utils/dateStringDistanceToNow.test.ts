import { dateStringDistanceToNow } from "@/lib/convex-utils";

const FIXED_NOW = new Date("2025-07-13T18:48:00.000Z");

beforeAll(() => {
  vi.useFakeTimers();
  vi.setSystemTime(FIXED_NOW);
});

afterAll(() => {
  vi.useRealTimers();
});

it("returns 'less than a minute ago' for a date just now", () => {
  const nowISOString = FIXED_NOW.toISOString();
  const result = dateStringDistanceToNow(nowISOString);

  expect(result).toEqual("less than a minute ago");
});

it("returns '5 minutes ago' for a date 5 minutes ago", () => {
  const fiveMinAgo = new Date(
    FIXED_NOW.getTime() - 5 * 60 * 1000,
  ).toISOString();
  const result = dateStringDistanceToNow(fiveMinAgo);

  expect(result).toEqual("5 minutes ago");
});

it("returns '2 hours ago' for a date 2 hours ago", () => {
  const twoHrAgo = new Date(
    FIXED_NOW.getTime() - 2 * 60 * 60 * 1000,
  ).toISOString();
  const result = dateStringDistanceToNow(twoHrAgo);

  expect(result).toEqual("2 hours ago");
});

it("returns formatted date for a date over 24 hours ago", () => {
  const over24HoursAgo = new Date("2025-07-12T15:30:00.000Z").toISOString();
  const result = dateStringDistanceToNow(over24HoursAgo);

  expect(result).toEqual("12 Jul 3:30 pm");
});

it("returns formatted date for a date 2 months ago", () => {
  const twoMonthsAgo = new Date("2025-05-13T10:00:00.000Z").toISOString();
  const result = dateStringDistanceToNow(twoMonthsAgo);

  expect(result).toEqual("13 May 10:00 am");
});

it("returns formatted date for a date 5 years ago", () => {
  const fiveYearsAgo = new Date("2020-10-27T18:01:18.000Z").toISOString();
  const result = dateStringDistanceToNow(fiveYearsAgo);

  expect(result).toEqual("27 Oct 2020, 6:01 pm");
});
