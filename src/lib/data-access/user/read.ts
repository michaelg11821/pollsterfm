"use server";

import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/lib/convex/_generated/api";

/**
 * Checks if a pollster.fm user has imported their Spotify listening history imported.
 *
 * @param username A pollster.fm user's username,
 * @returns A boolean.
 */
export async function spotifyHistoryImported(username: string) {
  const token = await convexAuthNextjsToken();
  const importStatus = await fetchQuery(
    api.user.getListeningHistoryImportStatus,
    { username },
    { token },
  );

  return importStatus === "imported";
}
