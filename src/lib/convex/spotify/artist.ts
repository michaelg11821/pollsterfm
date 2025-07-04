import { v } from "convex/values";
import type { Track } from "../../types/spotify";
import type {
  SpotifyArtistAlbumsResponse,
  SpotifyArtistSearchResponse,
  SpotifyArtistTopTracksResponse,
} from "../../types/spotifyResponses";
import { isSimilar } from "../../utils";
import { action } from "../_generated/server";
import { DISCOGRAPHY_PAGE_LIMIT } from "../pollster/config";
import { getClientCredentials } from "./credentials";

export const getFirstFromQuery = action({
  args: {
    artistQuery: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      const credentials = await getClientCredentials();

      if (!credentials) throw new Error("invalid credentials");

      const res = await fetch(
        `https://api.spotify.com/v1/search?q=${args.artistQuery.toLowerCase()}&type=artist&limit=1`,
        { headers: { Authorization: `Bearer ${credentials}` } },
      );

      if (!res.ok) throw new Error("failed to get first artist from query");

      const results: SpotifyArtistSearchResponse = await res.json();

      const firstArtist = results.artists.items[0];

      if (!firstArtist) {
        throw new Error("no valid result");
      }

      const match = isSimilar(args.artistQuery, firstArtist.name);

      if (match) {
        return firstArtist;
      } else {
        return null;
      }
    } catch (err: unknown) {
      console.error("error getting first artist from query:", err);

      return null;
    }
  },
});

export const getTopAlbums = action({
  args: { spotifyId: v.string() },
  handler: async (ctx, args) => {
    try {
      const credentials = await getClientCredentials();

      if (!credentials) throw new Error("invalid credentials");

      const res = await fetch(
        `https://api.spotify.com/v1/artists/${args.spotifyId}/top-tracks`,
        { headers: { Authorization: `Bearer ${credentials}` } },
      );

      if (!res.ok) throw new Error("failed to get top albums");

      const topTracks: SpotifyArtistTopTracksResponse = await res.json();

      const topAlbums = new Map<string, Track["album"]>();

      for (const track of topTracks.tracks) {
        const albumId = track.album.id;

        if (!topAlbums.has(albumId)) {
          topAlbums.set(albumId, track.album);
        }
      }

      return Array.from(topAlbums.values());
    } catch (err: unknown) {
      console.error("error getting top albums:", err);

      return null;
    }
  },
});

export const getAlbums = action({
  args: { spotifyId: v.string(), page: v.optional(v.number()) },
  handler: async (ctx, args) => {
    try {
      const credentials = await getClientCredentials();

      if (!credentials) throw new Error("invalid credentials");

      const pageOffset = DISCOGRAPHY_PAGE_LIMIT * (args.page ?? 1);

      const res = await fetch(
        `https://api.spotify.com/v1/artists/${args.spotifyId}/albums?limit=${DISCOGRAPHY_PAGE_LIMIT}&offset=${pageOffset}`,
        { headers: { Authorization: `Bearer ${credentials}` } },
      );

      if (!res.ok) throw new Error("failed to get albums");

      const albums: SpotifyArtistAlbumsResponse = await res.json();

      return albums;
    } catch (err: unknown) {
      console.error("error getting albums:", err);

      return null;
    }
  },
});
