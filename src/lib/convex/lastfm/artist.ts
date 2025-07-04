import { v } from "convex/values";
import { action } from "../_generated/server";

import type {
  LastfmArtistAlbumsResponse,
  LastfmArtistSearchResponse,
  LastfmArtistTagsResponse,
  LastfmSimilarArtistsResponse,
} from "../../types/lastfmResponses";
import { isSimilar } from "../../utils";
import { suffix } from "./suffix";

async function getTags(artistName: string) {
  try {
    const res = await fetch(
      `http://ws.audioscrobbler.com/2.0/?method=artist.gettoptags&artist=${artistName}${suffix}`,
    );

    if (!res.ok) throw new Error("failed to get artist tags");

    const results: LastfmArtistTagsResponse = await res.json();

    const tags = results.toptags.tag;

    if (!tags) {
      throw new Error("no valid result");
    }

    return tags;
  } catch (err: unknown) {
    console.error("error getting artist tags:", err);

    return null;
  }
}

export const getGenres = action({
  args: { artistName: v.string() },
  handler: async (_, args) => {
    return await getTags(args.artistName);
  },
});

export const getFirstFromQuery = action({
  args: { artistQuery: v.string() },
  handler: async (_, args) => {
    try {
      const res = await fetch(
        `http://ws.audioscrobbler.com/2.0/?method=artist.search&artist=${args.artistQuery}&limit=1${suffix}`,
      );

      if (!res.ok) throw new Error("failed to get first artist from query");

      const searchResults: LastfmArtistSearchResponse = await res.json();

      const firstArtist = searchResults.results.artistmatches.artist[0];

      if (!firstArtist) {
        throw new Error("no valid result");
      }

      const match = isSimilar(args.artistQuery, firstArtist.name);

      if (match) {
        return {
          name: firstArtist.name,
          image: null,
          genres: await getTags(firstArtist.name),
          url: firstArtist.url,
        };
      } else {
        return null;
      }
    } catch (err: unknown) {
      console.error("error getting first artist from query:", err);

      return null;
    }
  },
});

export const getAlbums = action({
  args: {
    artistName: v.string(),
    page: v.optional(v.number()),
    limit: v.number(),
  },
  handler: async (_, args) => {
    try {
      const res = await fetch(
        `http://ws.audioscrobbler.com/2.0/?method=artist.gettopalbums&artist=${args.artistName}&limit=${args.limit}&page=${args.page ?? 1}${suffix}`,
      );

      if (!res.ok)
        throw new Error(`failed to get albums for ${args.artistName}`);

      const albums: LastfmArtistAlbumsResponse = await res.json();

      if (!albums.topalbums.album) {
        throw new Error("no albums found");
      }

      return albums.topalbums;
    } catch (err: unknown) {
      console.error(`error getting top albums for ${args.artistName}:`, err);

      return null;
    }
  },
});

export const getSimilar = action({
  args: { artistName: v.string(), limit: v.number() },
  handler: async (_, args) => {
    try {
      const res = await fetch(
        `http://ws.audioscrobbler.com/2.0/?method=artist.getsimilar&artist=${args.artistName}&limit=${args.limit}${suffix}`,
      );

      if (!res.ok)
        throw new Error(`failed to get similar artists for ${args.artistName}`);

      const results: LastfmSimilarArtistsResponse = await res.json();

      return results.similarartists.artist;
    } catch (err: unknown) {
      console.error("error getting similar artists:", err);

      return null;
    }
  },
});
