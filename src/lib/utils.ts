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
 * A simple helper function that converts a Uint8Array into a Blob URL.
 *
 * @param arr A Uint8Array.
 * @returns An object URL for use in the src attribute of an img.
 */
export function uInt8ArrayToBlobUrl(arr: Uint8Array) {
  const blob = new Blob([arr]);

  return URL.createObjectURL(blob);
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

/**
 * Turns a File from the browser into a Uint8Array.
 *
 * @param file A file from the browser.
 * @returns A Uint8Array.
 */
export async function fileToUint8Array(file: File): Promise<Uint8Array> {
  const buffer = await file.arrayBuffer();

  return new Uint8Array(buffer);
}
