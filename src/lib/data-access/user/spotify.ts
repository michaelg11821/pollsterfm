"use server";

import SpotifyApi from "../../spotify";

import { prisma } from "../../prisma";

import type {
  SpotifyCurrentlyPlayingResponse,
  SpotifyRecentlyPlayedResponse,
} from "../../types/spotifyResponses";

/**
 * A function that returns an instance of the Pollster.fm Spotify API wrapper with valid credentials.
 *
 * @param username A Pollster.fm user's username.
 * @returns A Pollster.fm Spotify API wrapper with valid credentials.
 */
async function spotifyApiWithCredentials(username: string) {
  try {
    const tokens = await prisma.user.findUniqueOrThrow({
      where: {
        username,
      },
      select: {
        accounts: {
          where: {
            provider: "spotify",
          },
          select: {
            access_token: true,
            refresh_token: true,
            expires_at: true,
            providerAccountId: true,
          },
        },
      },
    });

    const { refresh_token, expires_at, access_token, providerAccountId } =
      tokens.accounts[0];

    if (!refresh_token || !expires_at || !access_token || !providerAccountId)
      throw new Error("user is missing one or more credentials");

    return SpotifyApi(
      access_token,
      refresh_token,
      expires_at,
      providerAccountId
    );
  } catch (err: unknown) {
    console.error(`error getting spotify instance for ${username}:`, err);

    return null;
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
