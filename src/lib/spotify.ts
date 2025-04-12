import { prisma } from "./prisma";

import type {
  SpotifyCurrentlyPlayingResponse,
  SpotifyAccessTokenResponse,
  SpotifyRecentlyPlayedResponse,
} from "./types/externalResponses";

/**
 * A Spotify API wrapper based on individual users and made exclusively for Pollster.fm.
 * Automatically refreshes access tokens based on an initial expiresAt value.
 * Includes a Prisma client to update tokens in the database.
 *
 * @param accessToken A valid access token from the Spotify API.
 * @param refreshToken A valid refresh token from the Spotify API.
 * @param expiresAt The expires_in value associated with each token.
 * @param providerAccountId The Spotify account ID referenced in the database.
 */
export default function SpotifyApi(
  accessToken: string,
  refreshToken: string,
  expiresAt: number,
  providerAccountId: string
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
    retries = 1
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
    await validateSpotifyAccessToken();

    const res = await fetchWithRetry(
      "https://api.spotify.com/v1/me/player/currently-playing",
      { headers: getAuthHeader() }
    );

    if (!res.ok) return {};

    if (res.status === 204) return {};

    const trackInfo: SpotifyCurrentlyPlayingResponse = await res.json();

    if (!trackInfo?.item) {
      return {};
    }

    return trackInfo;
  };

  /**
   * Gets the given amount of recently played tracks for the user.
   *
   * @param limit The amount of tracks to get. Max is 50.
   * @param next (optional) The endpoint for the next page of recently played tracks provided by the Spotify API.
   * @returns The user's recently played tracks on Spotify.
   */
  const getRecentlyPlayedTracks = async (limit: number, next?: string) => {
    await validateSpotifyAccessToken();

    const res = next
      ? await fetchWithRetry(next, { headers: getAuthHeader() })
      : await fetchWithRetry(
          `https://api.spotify.com/v1/me/player/recently-played?limit=${limit}`,
          { headers: getAuthHeader() }
        );

    if (!res.ok) return {};

    const trackInfo: SpotifyRecentlyPlayedResponse = await res.json();

    if (!trackInfo?.items) {
      return {};
    }

    return trackInfo;
  };

  return { getCurrentlyPlayingTrack, getRecentlyPlayedTracks };
}
