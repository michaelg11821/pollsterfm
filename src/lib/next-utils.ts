import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import nextConfig from "../../next.config";

/**
 * Merges Tailwind classes into one className.
 *
 * @param inputs Tailwind classes.
 * @returns The inputs merged into one className.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * @returns A RegExp containing each approved image hostname.
 */
export function getImageHostnamesRegex(): RegExp {
  const hostnames = nextConfig.images?.remotePatterns?.map(
    (pattern) => pattern.hostname,
  );

  const hostnamesRegex = new RegExp(
    `^(${hostnames!.map((h) => h.replace(/\./g, "\\.")).join("|")})$`,
  );

  return hostnamesRegex;
}
