import {
  INTERNAL_SERVER_ERROR,
  PRIVATE_LASTFM_PROFILE,
  SERVICE_ERROR,
} from "@/lib/constants/errors";
import type { LastfmRecentlyPlayedResponse } from "@/lib/types/lastfmResponses";
import { v } from "convex/values";
import { internal } from "../_generated/api";
import { action, internalQuery, type ActionCtx } from "../_generated/server";

export const getLastfmUsername = internalQuery({
  args: { username: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("username", (q) => q.eq("username", args.username))
      .unique();

    if (!user) return null;

    if (!user.lastfmUsername) return null;

    return user.lastfmUsername;
  },
});

/**
 * Gets the given amount of recently played tracks for the user.
 *
 * @param limit The amount of tracks to get. Max is 50.
 * @param next (optional) The endpoint for the next page of recently played tracks provided by the Spotify API.
 * @returns The user's recently played tracks on Spotify.
 */
export async function getRecentlyPlayedLastfmTracks(
  ctx: ActionCtx,
  username: string,
  limit: number,
  page?: number,
  includeLastTrack: boolean = false,
) {
  try {
    const lastfmUsername = await ctx.runQuery(
      internal.lastfm.user.getLastfmUsername,
      {
        username,
      },
    );

    if (!lastfmUsername) throw new Error("could not find lastfm username");

    const computedPage = page ?? 1;
    const computedLimit = computedPage === 1 ? limit + 1 : limit;

    const res = await fetch(
      `http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${lastfmUsername}&limit=${computedLimit}&page=${computedPage}&api_key=${process.env.LASTFM_API_KEY}&format=json`,
    );

    if (res.status === 403) {
      return { error: PRIVATE_LASTFM_PROFILE };
    } else if (res.status < 200 || res.status > 299) {
      return { error: SERVICE_ERROR };
    }

    const trackInfo: LastfmRecentlyPlayedResponse = await res.json();

    if (!trackInfo?.recenttracks.track) {
      return { error: SERVICE_ERROR };
    }

    const firstTrack = trackInfo.recenttracks.track[0];

    if (firstTrack["@attr"]?.nowplaying === "true") {
      trackInfo.recenttracks.track.shift();
    }

    if (includeLastTrack === false) {
      trackInfo.recenttracks.track.pop();
    }

    if (computedLimit === limit + 1) {
      const { total } = trackInfo.recenttracks["@attr"];

      trackInfo.recenttracks["@attr"].totalPages = String(
        Math.ceil(Number(total) / limit),
      );
    }

    return trackInfo;
  } catch (err: unknown) {
    console.error("error getting recently played tracks:", err);

    return { error: INTERNAL_SERVER_ERROR };
  }
}

export const getRecentlyPlayedTracks = action({
  args: {
    username: v.string(),
    limit: v.number(),
    page: v.number(),
  },
  handler: async (ctx, args) => {
    return await getRecentlyPlayedLastfmTracks(
      ctx,
      args.username,
      args.limit,
      args.page,
      true,
    );
  },
});

export async function getCurrentlyPlayingLastfmTrack(
  ctx: ActionCtx,
  username: string,
) {
  try {
    const lastfmUsername = await ctx.runQuery(
      internal.lastfm.user.getLastfmUsername,
      {
        username,
      },
    );

    if (!lastfmUsername) throw new Error("could not find lastfm username");

    const res = await fetch(
      `http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${lastfmUsername}&limit=1&page=1&api_key=${process.env.LASTFM_API_KEY}&format=json`,
    );

    if (res.status === 403) {
      return { error: PRIVATE_LASTFM_PROFILE };
    } else if (res.status < 200 || res.status > 299) {
      return { error: SERVICE_ERROR };
    }

    const trackInfo: LastfmRecentlyPlayedResponse = await res.json();

    if (!trackInfo?.recenttracks.track) {
      return { error: SERVICE_ERROR };
    }

    const track = trackInfo.recenttracks.track[0];

    if (!track["@attr"]?.nowplaying) {
      return null;
    }

    return track;
  } catch (err: unknown) {
    console.error("error getting recently played tracks:", err);

    return { error: INTERNAL_SERVER_ERROR };
  }
}
