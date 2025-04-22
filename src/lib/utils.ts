import { formatDistanceToNowStrict, type Month } from "date-fns";
import { enUS } from "date-fns/locale";

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

  let distanceString = "";

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

    distanceString = `${day} ${month} ${time}`;
  } else {
    distanceString = formatDistanceToNowStrict(parsedDate, {
      addSuffix: true,
    });
  }

  return distanceString;
}

/**
 * A simple helper function that converts a file into a Blob URL.
 *
 * @param file A Blob/File.
 * @returns An object URL for use in images.
 */
export function fileToBlobUrl(file: Blob) {
  return URL.createObjectURL(file);
}

/**
 * Returns the file name in a Supabase Storage resource.
 *
 * @param supabaseUrl A URL to a Supabase Storage resource.
 * @returns The name of a file in (public) Supabase Storage.
 */
export function getSupabaseFileName(supabaseUrl: URL) {
  const pathnames = supabaseUrl.pathname.split("/");
  const fileName = pathnames[pathnames.length - 1];

  return fileName;
}
