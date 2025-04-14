"use server";

import { spotifyApiWithCredentials } from "./data-access/user";

import type {
  SpotifyCurrentlyPlayingResponse,
  SpotifyRecentlyPlayedResponse,
} from "./types/externalResponses";

/**
 * A function that verifies tokens from the Cloudflare Turnstile on the sign-in page.
 *
 * @param token A Cloudflare turnstile token.
 * @returns A success indicator, status, and possible errors.
 */
export async function verifyTurnstile(token: string) {
  if (process.env.NODE_ENV !== "production") return { success: true };

  const formData = new FormData();
  formData.append("secret", process.env.NEXT_PRIVATE_TURNSTILE_SECRET_KEY!);
  formData.append("response", token);

  try {
    const response = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();

    if (data.success) {
      return { success: true, status: 200 };
    } else {
      return { success: false, error: data["error-codes"], status: 401 };
    }
  } catch (error: unknown) {
    return { success: false, error, status: 500 };
  }
}

/**
 * A function that returns the user's currently playing track on Spotify.
 *
 *  @param username A Pollster.fm user's username.
 *
 */
export async function getCurrentlyPlayingTrack(
  username: string
): Promise<SpotifyCurrentlyPlayingResponse | null> {
  try {
    const spotify = await spotifyApiWithCredentials(username);

    if (!spotify) throw new Error("invalid spotify instance");

    const nowPlaying = await spotify.getCurrentlyPlayingTrack();

    return nowPlaying;
  } catch (err: unknown) {
    console.error(
      `error fetching currently playing track for ${username}:`,
      err
    );

    return null;
  }
}

/**
 * A function that returns the user's recently played tracks on Spotify.
 *
 * @param username A Pollster.fm user's username.
 * @param limit Minimum: 1. Default: 20. Maximum: 50.
 * @param next (optional) A URL for the next page of recently played tracks provided by the Spotify API. To obtain one, make a request for a user's recently played tracks.
 * @returns The user's recently played tracks on Spotify.
 */
export async function getRecentlyPlayedTracks(
  username: string,
  limit: number = 20,
  next?: string
): Promise<SpotifyRecentlyPlayedResponse | null> {
  try {
    const spotify = await spotifyApiWithCredentials(username);

    if (!spotify) throw new Error("invalid spotify instance");

    const computedLimit = Math.max(1, Math.min(limit, 50));

    const recentTracks = await spotify.getRecentlyPlayedTracks(
      computedLimit,
      next
    );

    return recentTracks;
  } catch (err: unknown) {
    console.error(`error fetching recent tracks for ${username}:`, err);

    return null;
  }
}
