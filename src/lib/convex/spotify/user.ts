import { v } from "convex/values";
import type {
  SpotifyAccessTokenResponse,
  SpotifyCurrentlyPlayingResponse,
  SpotifyRecentlyPlayedResponse,
} from "../../types/spotifyResponses";
import { internal } from "../_generated/api";
import {
  action,
  ActionCtx,
  internalAction,
  internalMutation,
  internalQuery,
} from "../_generated/server";

export const setSpotifyTokens = internalMutation({
  args: {
    username: v.string(),
    spotifyAccessToken: v.string(),
    spotifyRefreshToken: v.string(),
    spotifyExpiresAt: v.number(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("username", (q) => q.eq("username", args.username))
      .unique();

    if (!user) return null;

    const expirationTimestamp = args.spotifyExpiresAt * 1000;

    await ctx.db.patch(user._id, {
      spotifyAccessToken: args.spotifyAccessToken,
      spotifyRefreshToken: args.spotifyRefreshToken,
      spotifyExpiresAt: expirationTimestamp, // in milliseconds
    });
  },
});

export const refreshSpotifyTokens = internalAction({
  args: {
    username: v.string(),
    spotifyRefreshToken: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      const res = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "refresh_token",
          refresh_token: args.spotifyRefreshToken,
          client_id: process.env.AUTH_SPOTIFY_ID!,
        }),
      });

      const newTokens: SpotifyAccessTokenResponse = await res.json();

      if (!res.ok) throw new Error("failed to get tokens");

      const { refresh_token, expires_in, access_token } = newTokens;

      await ctx.runMutation(internal.spotify.user.setSpotifyTokens, {
        username: args.username,
        spotifyAccessToken: access_token,
        spotifyRefreshToken: refresh_token,
        spotifyExpiresAt: Date.now() + expires_in * 1000,
      });

      return {
        spotifyAccessToken: access_token,
        spotifyRefreshToken: refresh_token,
        spotifyExpiresAt: Date.now() + expires_in * 1000,
      };
    } catch (err: unknown) {
      console.error("error validating spotify tokens", err);

      return null;
    }
  },
});

export const getUserTokens = internalQuery({
  args: { username: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("username", (q) => q.eq("username", args.username))
      .unique();

    if (!user) return null;

    const { spotifyAccessToken, spotifyRefreshToken, spotifyExpiresAt } = user;

    if (!spotifyAccessToken || !spotifyRefreshToken || !spotifyExpiresAt) {
      return null;
    }

    return { spotifyAccessToken, spotifyRefreshToken, spotifyExpiresAt };
  },
});

async function getAccessToken(ctx: ActionCtx, username: string) {
  try {
    const tokens = await ctx.runQuery(internal.spotify.user.getUserTokens, {
      username,
    });

    if (!tokens) throw new Error("failed to get old tokens");

    if (tokens.spotifyExpiresAt > Date.now()) {
      return tokens.spotifyAccessToken;
    }

    const newTokens = await ctx.runAction(
      internal.spotify.user.refreshSpotifyTokens,
      { username, spotifyRefreshToken: tokens.spotifyRefreshToken },
    );

    if (!newTokens) {
      throw new Error("failed to get new tokens");
    }

    return newTokens.spotifyAccessToken;
  } catch (err: unknown) {
    console.error("failed to get access token", err);

    return null;
  }
}

export const getCurrentlyPlayingTrack = action({
  args: { username: v.string() },
  handler: async (ctx, args) => {
    try {
      const accessToken = await getAccessToken(ctx, args.username);

      if (!accessToken) throw new Error("error getting access token");

      const res = await fetch(
        "https://api.spotify.com/v1/me/player/currently-playing",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
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
  },
});

/**
 * Gets the given amount of recently played tracks for the user.
 *
 * @param limit The amount of tracks to get. Max is 50.
 * @param next (optional) The endpoint for the next page of recently played tracks provided by the Spotify API.
 * @returns The user's recently played tracks on Spotify.
 */
export const getRecentlyPlayedTracks = action({
  args: {
    username: v.string(),
    limit: v.number(),
    next: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    try {
      const accessToken = await getAccessToken(ctx, args.username);

      if (!accessToken) throw new Error("error getting access token");

      const res = args.next
        ? await fetch(args.next, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          })
        : await fetch(
            `https://api.spotify.com/v1/me/player/recently-played?limit=${args.limit}`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            },
          );

      if (!res.ok) throw new Error("failed to get recently played tracks");

      const trackInfo: SpotifyRecentlyPlayedResponse = await res.json();

      if (!trackInfo?.items) {
        throw new Error("malformed track data");
      }

      return trackInfo;
    } catch (err: unknown) {
      console.error("error getting recently played tracks:", err);

      return null;
    }
  },
});
