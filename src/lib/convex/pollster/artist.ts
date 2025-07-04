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

import { ArtistFromSearch as LastfmArtist } from "@/lib/types/lastfm";
import { Artist as SpotifyArtist } from "@/lib/types/spotify";
import { v } from "convex/values";
import { api } from "../_generated/api";
import { action } from "../_generated/server";

export const findFirstByName = action({
  args: { artistName: v.string() },
  handler: async (ctx, args) => {
    const sanitized = decodeURIComponent(args.artistName);

    try {
      const spotifyResult: Promise<SpotifyArtist | null> = ctx.runAction(
        api.spotify.artist.getFirstFromQuery,
        { artistQuery: sanitized },
      );
      const lastfmResult: Promise<LastfmArtist | null> = ctx.runAction(
        api.lastfm.artist.getFirstFromQuery,
        { artistQuery: sanitized },
      );

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
        } as FirstArtistResult;
      } else if (spotifyArtist && !lastfmArtist) {
        return {
          name: spotifyArtist.name,
          image: spotifyArtist.images[0].url,
          genres: spotifyArtist.genres,
          spotifyUrl: spotifyArtist.external_urls.spotify,
          lastfmUrl: null,
        } as FirstArtistResult;
      } else if (!spotifyArtist && lastfmArtist) {
        return {
          name: lastfmArtist.name,
          image: null,
          genres: lastfmArtist.genres
            ? lastfmArtist.genres.map(({ name }) => name)
            : null,
          spotifyUrl: null,
          lastfmUrl: lastfmArtist.url,
        } as FirstArtistResult;
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
  handler: async (ctx, args) => {
    const { artistName, spotifyUrl, lastfmUrl } = args;

    try {
      if ((spotifyUrl && !lastfmUrl) || (spotifyUrl && lastfmUrl)) {
        const parts = new URL(spotifyUrl).pathname.split("/");
        const spotifyId = parts[parts.length - 1];

        const spotifyTopAlbums = await ctx.runAction(
          api.spotify.artist.getTopAlbums,
          { spotifyId },
        );

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
        const lastfmTopAlbums = await ctx.runAction(
          api.lastfm.artist.getAlbums,
          { artistName, limit: 5 },
        );

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
        const lastfmAlbums = await ctx.runAction(api.lastfm.artist.getAlbums, {
          page,
          artistName,
          limit: DISCOGRAPHY_PAGE_LIMIT,
        });

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

        const spotifyAlbums = await ctx.runAction(
          api.spotify.artist.getAlbums,
          { page, spotifyId },
        );

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

export const getSimilarArtists = action({
  args: {
    artistName: v.string(),
    lastfmUrl: v.union(v.string(), v.null()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { artistName, lastfmUrl, limit } = args;

    try {
      if (lastfmUrl) {
        const lastfmSimilarArtists = await ctx.runAction(
          api.lastfm.artist.getSimilar,
          { artistName, limit: limit ?? 4 },
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
