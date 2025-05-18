import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
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
