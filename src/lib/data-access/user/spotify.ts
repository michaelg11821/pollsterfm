"use server";

import { prisma } from "../../db";

import type {
  SpotifyAccessTokenResponse,
  SpotifyCurrentlyPlayingResponse,
  SpotifyRecentlyPlayedResponse,
} from "../../types/spotifyResponses";

/**
 * A state container for Spotify endpoints that require authentication.
 * Automatically refreshes access tokens based on an initial expiresAt value.
 *
 * @param accessToken A valid access token from the Spotify API.
 * @param refreshToken A valid refresh token from the Spotify API.
 * @param expiresAt The expires_in value associated with each token.
 * @param providerAccountId The Spotify account ID referenced in the database.
 */
function spotifyWithAuth(
  accessToken: string,
  refreshToken: string,
  expiresAt: number,
  providerAccountId: string,
) {
  const accountId = providerAccountId;

  let access = accessToken;
  let refresh = refreshToken;
  let expires = expiresAt;

  const getAuthHeader = () => ({
    Authorization: `Bearer ${access}`,
  });

  /**
   * Runs before everything that requires authentication with the Spotify API.
   * Refreshes expired access tokens and keeps valid ones as is.
   */
  const validateSpotifyAccessToken = async () => {
    if (expires * 1000 < Date.now()) {
      try {
        const res = await fetch("https://accounts.spotify.com/api/token", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            grant_type: "refresh_token",
            refresh_token: refresh,
            client_id: process.env.AUTH_SPOTIFY_ID!,
          }),
          cache: "no-store",
        });

        const newTokensOrError: SpotifyAccessTokenResponse = await res.json();

        if (!res.ok) throw newTokensOrError;

        const { refresh_token, expires_in, access_token } = newTokensOrError;

        await prisma.account.update({
          data: {
            access_token: access_token,
            expires_at: Math.floor(Date.now() / 1000 + expires_in),
            refresh_token: refresh_token ?? refresh,
          },
          where: {
            provider_providerAccountId: {
              provider: "spotify",
              providerAccountId: accountId,
            },
          },
        });

        access = access_token;
        refresh = refresh_token ?? refresh;
        expires = Math.floor(Date.now() / 1000 + expires_in);
      } catch (err: unknown) {
        console.error("error refreshing spotify access token", err);
      }
    }
  };

  const fetchWithRetry = async (
    url: string,
    options: RequestInit,
    retries = 3,
  ) => {
    let res = await fetch(url, options);

    if (res.status === 401 && retries > 0) {
      await validateSpotifyAccessToken();

      const newOptions = {
        ...options,
        headers: getAuthHeader(),
      };

      res = await fetchWithRetry(url, newOptions, retries - 1);
    }
    return res;
  };

  /**
   * Gets the user's currently playing track on Spotify.
   *
   * @returns The title of the currently playing track.
   */
  const getCurrentlyPlayingTrack = async () => {
    try {
      await validateSpotifyAccessToken();

      const res = await fetchWithRetry(
        "https://api.spotify.com/v1/me/player/currently-playing",
        { headers: getAuthHeader() },
      );

      if (!res.ok) throw new Error("failed to get currently playing track");

      if (res.status === 204) return null;

      const trackInfo: SpotifyCurrentlyPlayingResponse = await res.json();

      if (!trackInfo?.item) {
        throw new Error("malformed track data");
      }

      return trackInfo;
    } catch (err: unknown) {
      console.error("error getting currently playing track:", err);

      return null;
    }
  };

  /**
   * Gets the given amount of recently played tracks for the user.
   *
   * @param limit The amount of tracks to get. Max is 50.
   * @param next (optional) The endpoint for the next page of recently played tracks provided by the Spotify API.
   * @returns The user's recently played tracks on Spotify.
   */
  const getRecentlyPlayedTracks = async (limit: number, next?: string) => {
    try {
      await validateSpotifyAccessToken();

      const res = next
        ? await fetchWithRetry(next, {
            headers: getAuthHeader(),
            cache: "no-store",
          })
        : await fetchWithRetry(
            `https://api.spotify.com/v1/me/player/recently-played?limit=${limit}`,
            { headers: getAuthHeader(), cache: "no-store" },
          );

      if (!res.ok) throw new Error("failed to get recently played tracks");

      const trackInfo: SpotifyRecentlyPlayedResponse = await res.json();

      if (!trackInfo?.items) {
        throw new Error("malformed track data");
      }

      return trackInfo;
    } catch (err: unknown) {
      console.error("error getting currently recently played tracks:", err);

      return null;
    }
  };

  return {
    getCurrentlyPlayingTrack,
    getRecentlyPlayedTracks,
  };
}

/**
 * A function that returns an instance of a Spotify state container with valid credentials.
 *
 * @param username A pollster.fm user's username.
 * @returns A Spotify state container with valid credentials.
 */
async function spotifyForUser(username: string) {
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

    return spotifyWithAuth(
      access_token,
      refresh_token,
      expires_at,
      providerAccountId,
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
  username: string,
): Promise<SpotifyCurrentlyPlayingResponse | null> {
  try {
    const spotify = await spotifyForUser(username);

    if (!spotify) throw new Error("invalid spotify instance");

    const nowPlaying = await spotify.getCurrentlyPlayingTrack();

    return nowPlaying;
  } catch (err: unknown) {
    console.error(
      `error fetching currently playing track for ${username}:`,
      err,
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
  next?: string,
): Promise<SpotifyRecentlyPlayedResponse | null> {
  try {
    const spotify = await spotifyForUser(username);

    if (!spotify) throw new Error("invalid spotify instance");

    const computedLimit = Math.max(1, Math.min(limit, 50));

    const recentTracks = await spotify.getRecentlyPlayedTracks(
      computedLimit,
      next,
    );

    return recentTracks;
  } catch (err: unknown) {
    console.error(`error fetching recent tracks for ${username}:`, err);

    return null;
  }
}
