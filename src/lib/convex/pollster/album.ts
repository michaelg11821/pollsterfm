import type { FirstAlbumResult } from "../../types/internalResponses";
import type { Album as LastfmAlbum } from "../../types/lastfm";

import {
  getFirstLastfmAlbumFromQuery,
  lastfmAlbumSearch,
} from "@/lib/lastfm/album";
import { getFirstSpotifyAlbumFromQuery } from "@/lib/spotify/album";
import { ActionCache } from "@convex-dev/action-cache";
import { v } from "convex/values";
import { components, internal } from "../_generated/api";
import { action, internalAction, query } from "../_generated/server";
import { getPollsFromChoices } from "./poll";

const albumCache = new ActionCache(components.actionCache, {
  action: internal.pollster.album.findFirstByName,
  name: "albumCache",
  ttl: 1000 * 60 * 60 * 24 * 7,
});

export const getCachedAlbum = action({
  args: { artistName: v.string(), albumName: v.string() },
  handler: async (ctx, args): Promise<FirstAlbumResult | null> => {
    const result = await albumCache.fetch(ctx, {
      artistName: args.artistName,
      albumName: args.albumName,
    });

    // remove misspelled entries like "the great anihilator"
    if (result && result.name !== decodeURIComponent(args.albumName)) {
      await albumCache.remove(ctx, {
        artistName: args.artistName,
        albumName: args.albumName,
      });
    }

    return result;
  },
});

export const findFirstByName = internalAction({
  args: { artistName: v.string(), albumName: v.string() },
  handler: async (_, args) => {
    const sanitized = decodeURIComponent(args.albumName);

    try {
      const spotifyResult = getFirstSpotifyAlbumFromQuery(
        args.artistName,
        sanitized,
      );
      const lastfmResult = getFirstLastfmAlbumFromQuery(
        args.artistName,
        sanitized,
      );

      const [spotifyAlbum, lastfmAlbum] = await Promise.all([
        spotifyResult,
        lastfmResult,
      ]);

      if (spotifyAlbum && lastfmAlbum) {
        return {
          name: spotifyAlbum.name,
          artists: spotifyAlbum.artists.map(({ name }) => name),
          image: spotifyAlbum.images[0].url,
          genres: lastfmAlbum.genres
            ? lastfmAlbum.genres.map(({ name }) => name)
            : null,
          spotifyUrl: spotifyAlbum.external_urls.spotify,
          lastfmUrl: lastfmAlbum.url,
        } as FirstAlbumResult;
      } else if (spotifyAlbum && !lastfmAlbum) {
        return {
          name: spotifyAlbum.name,
          artists: spotifyAlbum.artists.map(({ name }) => name),
          image: spotifyAlbum.images[0].url,
          genres: null,
          spotifyUrl: spotifyAlbum.external_urls.spotify,
          lastfmUrl: null,
        } as FirstAlbumResult;
      } else if (!spotifyAlbum && lastfmAlbum) {
        return {
          name: lastfmAlbum.name,
          artists: [lastfmAlbum.artist],
          image: lastfmAlbum.image[3]["#text"],
          genres: lastfmAlbum.genres
            ? lastfmAlbum.genres.map(({ name }) => name)
            : null,
          spotifyUrl: null,
          lastfmUrl: lastfmAlbum.url,
        } as FirstAlbumResult;
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
  handler: async (_, args): Promise<LastfmAlbum[] | null> => {
    const sanitized = decodeURIComponent(args.query);

    try {
      const lastfmResults = await lastfmAlbumSearch(sanitized);

      if (!lastfmResults) throw new Error("no albums found");

      return lastfmResults
        .filter((album) => album.name !== "(null)")
        .map((album) => structuredClone(album));
    } catch (err: unknown) {
      console.error(`error searching for ${sanitized}:`, err);

      return null;
    }
  },
});

export const getPollsFeaturedIn = query({
  args: { artist: v.string(), album: v.string() },
  handler: async (ctx, args) => {
    const choices = await ctx.db
      .query("pollChoices")
      .withIndex("by_album", (q) =>
        q
          .eq("artist", decodeURIComponent(args.artist))
          .eq("album", decodeURIComponent(args.album)),
      )
      .collect();

    return await getPollsFromChoices(ctx, choices);
  },
});
