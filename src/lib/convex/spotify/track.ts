import { v } from "convex/values";
import { action } from "../_generated/server";
import { getClientCredentials } from "./credentials";

import type { SpotifyTrackSearchResponse } from "../../types/spotifyResponses";
import { isSimilar } from "../../utils";

export const getFirstFromQuery = action({
  args: {
    artistName: v.string(),
    albumName: v.string(),
    trackQuery: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      const credentials = await getClientCredentials();

      if (!credentials) throw new Error("invalid credentials");

      const query = `artist:"${args.artistName}" album:"${args.albumName}" track:"${args.trackQuery}"`;
      const encodedQuery = encodeURIComponent(query);

      const res = await fetch(
        `https://api.spotify.com/v1/search?q=${encodedQuery}&type=track&limit=1`,
        { headers: { Authorization: `Bearer ${credentials}` } },
      );

      if (!res.ok) throw new Error("failed to get first track from query");

      const results: SpotifyTrackSearchResponse = await res.json();

      const firstTrack = results.tracks.items[0];

      if (!firstTrack) {
        throw new Error("no valid result");
      }

      const match = isSimilar(args.trackQuery, firstTrack.name);

      if (match) {
        return firstTrack;
      } else {
        return null;
      }
    } catch (err: unknown) {
      console.error("error getting first track from query:", err);

      return null;
    }
  },
});
