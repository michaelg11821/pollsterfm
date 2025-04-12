"use server";

import SpotifyApi from "./spotify";

import { prisma } from "./prisma";
import type { SpotifyRecentlyPlayedResponse } from "./types/externalResponses";

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
 * A function that retrieves a user's Spotify API credentials from the database.
 *
 * @param username A Pollster.fm user's username.
 * @returns The credentials needed for Pollster.fm's Spotify API wrapper.
 */
async function getSpotifyApiCredentials(username: string) {
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

    return { refresh_token, expires_at, access_token, providerAccountId };
  } catch (err: unknown) {
    console.error("error getting credentials", err);

    return null;
  }
}

/**
 * A function that returns an instance of the Pollster.fm Spotify API wrapper with valid credentials.
 *
 * @param username A Pollster.fm user's username.
 * @returns A Pollster.fm Spotify API wrapper with valid credentials.
 */
export async function spotifyApiWithCredentials(username: string) {
  try {
    const credentials = await getSpotifyApiCredentials(username);

    if (!credentials) throw new Error("failed to get credentials");

    const { refresh_token, expires_at, access_token, providerAccountId } =
      credentials;

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

export async function getProfile(username: string) {
  try {
    const profile = await prisma.user.findUniqueOrThrow({
      where: {
        username,
      },
      select: {
        pronouns: true,
        aboutMe: true,
        createdAt: true,
        image: true,
        name: true,
      },
    });

    return profile;
  } catch (err: unknown) {
    console.error("error getting profile", err);

    return null;
  }
}

/**
 * A function that returns the user's recently played tracks on Spotify.
 *
 * @param username A Pollster.fm user's username.
 * @param limit Minimum: 1. Default: 20. Maximum: 50.
 * @param next A URL for the next page of recently played tracks provided by the Spotify API. To obtain one, make a request for a user's recently played tracks.
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
