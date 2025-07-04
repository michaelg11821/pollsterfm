import { v } from "convex/values";
import { action } from "../_generated/server";

import { AlbumFromSearch } from "@/lib/types/lastfm";
import type {
  LastfmAlbumInfoResponse,
  LastfmAlbumSearchResponse,
} from "../../types/lastfmResponses";
import { isSimilar } from "../../utils";
import { suffix } from "./suffix";

async function getTags(artistName: string, albumName: string) {
  try {
    const res = await fetch(
      `http://ws.audioscrobbler.com/2.0/?method=album.getinfo&artist=${artistName}&album=${albumName}${suffix}`,
    );

    if (!res.ok) throw new Error("failed to get album tags");

    const results: LastfmAlbumInfoResponse = await res.json();

    const tags = results.album.tags.tag;

    if (!tags) {
      throw new Error("no valid result");
    }

    return tags;
  } catch (err: unknown) {
    console.error("error getting album tags:", err);

    return null;
  }
}

export const getFirstFromQuery = action({
  args: { artistName: v.string(), albumQuery: v.string() },
  handler: async (_, args) => {
    try {
      const res = await fetch(
        `http://ws.audioscrobbler.com/2.0/?method=album.search&album=${args.albumQuery}&limit=1${suffix}`,
      );

      if (!res.ok) throw new Error("failed to get first album from query");

      const searchResults: LastfmAlbumSearchResponse = await res.json();

      const firstAlbum = searchResults.results.albummatches.album[0];

      if (!firstAlbum) {
        throw new Error("no valid result");
      }

      const match = isSimilar(args.albumQuery, firstAlbum.name);

      if (match) {
        return {
          name: firstAlbum.name,
          artist: firstAlbum.artist,
          image: firstAlbum.image,
          genres: await getTags(args.artistName, firstAlbum.name),
          url: firstAlbum.url,
        } as AlbumFromSearch;
      } else {
        return null;
      }
    } catch (err: unknown) {
      console.error("error getting first album from query:", err);

      return null;
    }
  },
});

export const getTracks = action({
  args: { artistName: v.string(), albumName: v.string() },
  handler: async (_, args) => {
    try {
      const res = await fetch(
        `http://ws.audioscrobbler.com/2.0/?method=album.getinfo&artist=${args.artistName}&album=${args.albumName}${suffix}`,
      );

      if (!res.ok) throw new Error("failed to get album tracks");

      const results: LastfmAlbumInfoResponse = await res.json();

      const tracks = results.album.tracks;

      if (!tracks) {
        throw new Error("no valid result");
      }

      return tracks;
    } catch (err: unknown) {
      console.error("error getting album tracks:", err);

      return null;
    }
  },
});
