import type {
  ArtistAlbumsResponse,
  FirstArtistResult,
} from "../../types/internalResponses";
import type {
  PollsterAlbum,
  SimilarArtist,
  TopAlbum,
} from "../../types/pollster";
import { DISCOGRAPHY_PAGE_LIMIT } from "./config";

import {
  getFirstLastfmArtistFromQuery,
  getLastfmArtistAlbums,
  getSimilarLastfmArtists,
} from "@/lib/lastfm/artist";
import {
  getFirstSpotifyArtistFromQuery,
  getSpotifyArtistAlbums,
  getSpotifyArtistTopAlbums,
  spotifyArtistSearch,
} from "@/lib/spotify/artist";
import type { Artist as SpotifyArtist } from "@/lib/types/spotify";
import { ActionCache } from "@convex-dev/action-cache";
import { v } from "convex/values";
import { components, internal } from "../_generated/api";
import { action, internalAction, query } from "../_generated/server";
import { getPollsFromChoices } from "./poll";

const artistCache = new ActionCache(components.actionCache, {
  action: internal.pollster.artist.findFirstByName,
  name: "artistCache",
  ttl: 1000 * 60 * 60 * 24 * 7,
});

export const getCachedArtist = action({
  args: { artistName: v.string() },
  handler: async (ctx, args): Promise<FirstArtistResult | null> => {
    const result = await artistCache.fetch(ctx, {
      artistName: args.artistName,
    });

    // remove misspelled entries like "elliot smit"
    if (result && result.name !== decodeURIComponent(args.artistName)) {
      await artistCache.remove(ctx, { artistName: args.artistName });
    }

    return result;
  },
});

export const findFirstByName = internalAction({
  args: { artistName: v.string() },
  handler: async (_, args): Promise<FirstArtistResult | null> => {
    const sanitized = decodeURIComponent(args.artistName);

    try {
      const spotifyResult = getFirstSpotifyArtistFromQuery(sanitized);
      const lastfmResult = getFirstLastfmArtistFromQuery(sanitized);

      const [spotifyArtist, lastfmArtist] = await Promise.all([
        spotifyResult,
        lastfmResult,
      ]);

      if (spotifyArtist && lastfmArtist) {
        return {
          name: spotifyArtist.name,
          image: spotifyArtist.images[0].url,
          genres: spotifyArtist.genres,
          spotifyUrl: spotifyArtist.external_urls.spotify,
          lastfmUrl: lastfmArtist.url,
        };
      } else if (spotifyArtist && !lastfmArtist) {
        return {
          name: spotifyArtist.name,
          image: spotifyArtist.images[0].url,
          genres: spotifyArtist.genres,
          spotifyUrl: spotifyArtist.external_urls.spotify,
          lastfmUrl: null,
        };
      } else if (!spotifyArtist && lastfmArtist) {
        return {
          name: lastfmArtist.name,
          image: null,
          genres: lastfmArtist.genres
            ? lastfmArtist.genres.map(({ name }) => name)
            : null,
          spotifyUrl: null,
          lastfmUrl: lastfmArtist.url,
        };
      } else {
        throw new Error("no artist found");
      }
    } catch (err: unknown) {
      console.error(`error searching for ${sanitized}:`, err);

      return null;
    }
  },
});

export const getTopAlbums = action({
  args: {
    artistName: v.string(),
    spotifyUrl: v.union(v.string(), v.null()),
    lastfmUrl: v.union(v.string(), v.null()),
  },
  handler: async (_, args) => {
    const { artistName, spotifyUrl, lastfmUrl } = args;

    try {
      if ((spotifyUrl && !lastfmUrl) || (spotifyUrl && lastfmUrl)) {
        const parts = new URL(spotifyUrl).pathname.split("/");
        const spotifyId = parts[parts.length - 1];

        const spotifyTopAlbums = await getSpotifyArtistTopAlbums(spotifyId);

        if (!spotifyTopAlbums) throw new Error("no results from spotify");

        const normalizedTopAlbums: TopAlbum[] = spotifyTopAlbums.map(
          (album) => {
            return {
              name: album.name,
              images: album.images,
              releaseDate: album.release_date,
            };
          },
        );

        // and eventually get pollster ratings (in separate query)

        return normalizedTopAlbums;
      } else if (!spotifyUrl && lastfmUrl) {
        const lastfmTopAlbums = await getLastfmArtistAlbums(artistName, 1, 5);

        if (!lastfmTopAlbums || !lastfmTopAlbums.album)
          throw new Error("no results from lastfm");

        const normalizedTopAlbums: TopAlbum[] = lastfmTopAlbums.album
          .map((album) => {
            return {
              name: album.name,
              images: album.image.map((img) => {
                return {
                  url: img["#text"],
                };
              }),
              releaseDate: null, // last fm does not provide release dates
            };
          })
          .filter((album) => album.name !== "(null)");

        // and eventually get pollster ratings in sep query

        return normalizedTopAlbums;
      } else {
        return null;
      }
    } catch (err: unknown) {
      console.error(`error getting top albums for ${artistName}:`, err);

      return null;
    }
  },
});

export const getAlbums = action({
  args: {
    artistName: v.string(),
    spotifyUrl: v.union(v.string(), v.null()),
    lastfmUrl: v.union(v.string(), v.null()),
    page: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { artistName, spotifyUrl, lastfmUrl, page } = args;

    try {
      if ((!spotifyUrl && lastfmUrl) || (lastfmUrl && spotifyUrl)) {
        const lastfmAlbums = await getLastfmArtistAlbums(
          artistName,
          page,
          DISCOGRAPHY_PAGE_LIMIT,
        );

        if (!lastfmAlbums) throw new Error("no results from lastfm");

        const normalizedAlbums: PollsterAlbum[] = lastfmAlbums.album
          .map((album) => {
            return {
              name: album.name,
              images: album.image.map((img) => {
                return {
                  url: img["#text"],
                };
              }),
              releaseDate: null, // last fm does not provide release dates
            };
          })
          .filter((album) => album.name !== "(null)");

        const totalPages: number = Number(lastfmAlbums["@attr"].totalPages);

        // and eventually get pollster ratings in sep query

        return { albums: normalizedAlbums, totalPages } as ArtistAlbumsResponse;
      } else if (spotifyUrl && !lastfmUrl) {
        const parts = new URL(spotifyUrl).pathname.split("/");
        const spotifyId = parts[parts.length - 1];

        const spotifyAlbums = await getSpotifyArtistAlbums(spotifyId, page);

        if (!spotifyAlbums) throw new Error("no results from spotify");

        const normalizedAlbums: PollsterAlbum[] = spotifyAlbums.items.map(
          (album) => {
            return {
              name: album.name,
              images: album.images,
              releaseDate: album.release_date,
            };
          },
        );

        const totalPages = Math.ceil(
          spotifyAlbums.total / DISCOGRAPHY_PAGE_LIMIT,
        );

        // and eventually get pollster ratings in sep query

        return { albums: normalizedAlbums, totalPages } as ArtistAlbumsResponse;
      } else {
        return null;
      }
    } catch (err: unknown) {
      console.error(`error getting albums for ${artistName}:`, err);

      return null;
    }
  },
});

export const getSimilar = action({
  args: {
    artistName: v.string(),
    lastfmUrl: v.union(v.string(), v.null()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { artistName, lastfmUrl, limit } = args;

    try {
      if (lastfmUrl) {
        const lastfmSimilarArtists = await getSimilarLastfmArtists(
          artistName,
          limit ?? 4,
        );

        if (!lastfmSimilarArtists) throw new Error("no results from lastfm");

        const normalizedSimilarArtists: SimilarArtist[] =
          lastfmSimilarArtists.map((artist) => {
            return {
              name: artist.name,
              image: null,
            };
          });

        // and eventually get affinity match percentage

        return normalizedSimilarArtists;
      } else {
        return null;
      }
    } catch (err: unknown) {
      console.error(`error getting similar artists for ${name}:`, err);

      return null;
    }
  },
});

export const search = action({
  args: { query: v.string() },
  handler: async (_, args): Promise<SpotifyArtist[] | null> => {
    const sanitized = decodeURIComponent(args.query);

    try {
      const spotifyResults = await spotifyArtistSearch(sanitized);

      if (!spotifyResults) throw new Error("no artists found");

      return spotifyResults;
    } catch (err: unknown) {
      console.error(`error searching for ${sanitized}:`, err);

      return null;
    }
  },
});

export const getPollsFeaturedIn = query({
  args: { artist: v.string() },
  handler: async (ctx, args) => {
    const choices = await ctx.db
      .query("pollChoices")
      .withIndex("by_artist", (q) =>
        q.eq("artist", decodeURIComponent(args.artist)),
      )
      .collect();

    return await getPollsFromChoices(ctx, choices);
  },
});
