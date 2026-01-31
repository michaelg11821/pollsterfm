import type { FirstTrackResult } from "../../types/internalResponses";

import { getFirstLastfmTrackFromQuery } from "@/lib/lastfm/track";
import {
  getFirstSpotifyTrackFromQuery,
  spotifyTrackSearch,
} from "@/lib/spotify/track";
import type { Track as SpotifyTrack } from "@/lib/types/spotify";
import { ActionCache } from "@convex-dev/action-cache";
import { v } from "convex/values";
import { components, internal } from "../_generated/api";
import { action, internalAction, query } from "../_generated/server";
import { getPollsFromChoices } from "./poll";

const trackCache = new ActionCache(components.actionCache, {
  action: internal.pollster.track.findFirstByName,
  name: "trackCache",
  ttl: 1000 * 60 * 60 * 24 * 7,
});

export const getCachedTrack = action({
  args: {
    artistName: v.string(),
    albumName: v.string(),
    albumImage: v.union(v.string(), v.null()),
    trackName: v.string(),
  },
  handler: async (ctx, args): Promise<FirstTrackResult | null> => {
    const result = await trackCache.fetch(ctx, {
      artistName: args.artistName,
      albumName: args.albumName,
      albumImage: args.albumImage,
      trackName: args.trackName,
    });

    // remove misspelled entries like "beter be quiet now"
    if (result && result.name !== decodeURIComponent(args.trackName)) {
      await trackCache.remove(ctx, {
        artistName: args.artistName,
        albumName: args.albumName,
        albumImage: args.albumImage,
        trackName: args.trackName,
      });
    }

    return result;
  },
});

export const findFirstByName = internalAction({
  args: {
    artistName: v.string(),
    albumName: v.string(),
    albumImage: v.union(v.string(), v.null()),
    trackName: v.string(),
  },
  handler: async (_, args): Promise<FirstTrackResult | null> => {
    const sanitized = decodeURIComponent(args.trackName);

    try {
      const spotifyResult = getFirstSpotifyTrackFromQuery(
        args.artistName,
        args.albumName,
        sanitized,
      );

      const lastfmResult = getFirstLastfmTrackFromQuery(
        args.artistName,
        args.albumName,
        args.albumImage,
        args.trackName,
      );

      const [spotifyTrack, lastfmTrack] = await Promise.all([
        spotifyResult,
        lastfmResult,
      ]);

      if (spotifyTrack && lastfmTrack) {
        return {
          name: spotifyTrack.name,
          artists: spotifyTrack.album.artists.map(({ name }) => name),
          image: spotifyTrack.album.images[0].url,
          genres: lastfmTrack.genres
            ? lastfmTrack.genres.map(({ name }) => name)
            : null,
          spotifyUrl: spotifyTrack.external_urls.spotify,
          lastfmUrl: lastfmTrack.url,
          albumName: spotifyTrack.album.name,
        };
      } else if (spotifyTrack && !lastfmTrack) {
        return {
          name: spotifyTrack.name,
          artists: spotifyTrack.album.artists.map(({ name }) => name),
          image: spotifyTrack.album.images[0].url,
          genres: null,
          spotifyUrl: spotifyTrack.external_urls.spotify,
          lastfmUrl: null,
          albumName: spotifyTrack.album.name,
        };
      } else if (!spotifyTrack && lastfmTrack) {
        return {
          name: lastfmTrack.name,
          artists: [lastfmTrack.artist],
          image: args.albumImage,
          genres: lastfmTrack.genres
            ? lastfmTrack.genres.map(({ name }) => name)
            : null,
          spotifyUrl: null,
          lastfmUrl: lastfmTrack.url,
          albumName: lastfmTrack.albumName,
        };
      } else {
        throw new Error("no album found");
      }
    } catch (err: unknown) {
      console.error(`error searching for ${sanitized}:`, err);

      return null;
    }
  },
});

export const search = action({
  args: { query: v.string() },
  handler: async (_, args): Promise<SpotifyTrack[] | null> => {
    const sanitized = decodeURIComponent(args.query);

    try {
      const lastfmResults = await spotifyTrackSearch(sanitized);

      if (!lastfmResults) throw new Error("no tracks found");

      return lastfmResults;
    } catch (err: unknown) {
      console.error(`error searching for ${sanitized}:`, err);

      return null;
    }
  },
});

export const getPollsFeaturedIn = query({
  args: { artist: v.string(), album: v.string(), track: v.string() },
  handler: async (ctx, args) => {
    const choices = await ctx.db
      .query("pollChoices")
      .withIndex("by_track", (q) =>
        q
          .eq("artist", decodeURIComponent(args.artist))
          .eq("album", decodeURIComponent(args.album))
          .eq("track", decodeURIComponent(args.track)),
      )
      .collect();

    return await getPollsFromChoices(ctx, choices);
  },
});
