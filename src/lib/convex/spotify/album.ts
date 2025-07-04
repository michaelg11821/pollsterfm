import { v } from "convex/values";
import { action } from "../_generated/server";
import { getClientCredentials } from "./credentials";

import type {
  SpotifyAlbumSearchResponse,
  SpotifyAlbumTracksResponse,
} from "../../types/spotifyResponses";
import { isSimilar } from "../../utils";
import { ALBUM_PAGE_TRACK_LIMIT } from "../pollster/config";

export const getFirstFromQuery = action({
  args: { artistName: v.string(), albumQuery: v.string() },
  handler: async (ctx, args) => {
    try {
      const credentials = await getClientCredentials();

      if (!credentials) throw new Error("invalid credentials");

      const query = `artist:"${args.artistName}" album:"${args.albumQuery}"`;
      const encodedQuery = encodeURIComponent(query);

      const res = await fetch(
        `https://api.spotify.com/v1/search?q=${encodedQuery}&type=album&limit=1`,
        { headers: { Authorization: `Bearer ${credentials}` } },
      );

      if (!res.ok) throw new Error("failed to get first album from query");

      const results: SpotifyAlbumSearchResponse = await res.json();

      const firstAlbum = results.albums.items[0];

      if (!firstAlbum) {
        throw new Error("no valid result");
      }

      const match = isSimilar(args.albumQuery, firstAlbum.name);

      if (match) {
        return firstAlbum;
      } else {
        return null;
      }
    } catch (err: unknown) {
      console.error("error getting first album from query:", err);

      return null;
    }
  },
});

export const getAlbumTracks = action({
  args: { spotifyId: v.string(), next: v.optional(v.string()) },
  handler: async (ctx, args) => {
    try {
      const credentials = await getClientCredentials();

      if (!credentials) throw new Error("invalid credentials");

      const res = args.next
        ? await fetch(args.next, {
            headers: { Authorization: `Bearer ${credentials}` },
          })
        : await fetch(
            `https://api.spotify.com/v1/albums/${args.spotifyId}/tracks?limit=${ALBUM_PAGE_TRACK_LIMIT}`,
            { headers: { Authorization: `Bearer ${credentials}` } },
          );

      if (!res.ok) throw new Error("failed to get album tracks");

      const tracks: SpotifyAlbumTracksResponse = await res.json();

      return tracks;
    } catch (err: unknown) {
      console.error("error getting album tracks:", err);

      return null;
    }
  },
});
