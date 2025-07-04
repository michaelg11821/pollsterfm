import type { FirstTrackResult } from "../../types/internalResponses";

import { getFirstLastfmTrackFromQuery } from "@/lib/lastfm/track";
import { getFirstSpotifyTrackFromQuery } from "@/lib/spotify/track";
import { v } from "convex/values";
import { action } from "../_generated/server";

export const findFirstByName = action({
  args: {
    artistName: v.string(),
    albumName: v.string(),
    albumImage: v.union(v.string(), v.null()),
    trackName: v.string(),
  },
  handler: async (ctx, args) => {
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
        sanitized,
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
        } as FirstTrackResult;
      } else if (spotifyTrack && !lastfmTrack) {
        return {
          name: spotifyTrack.name,
          artists: spotifyTrack.album.artists.map(({ name }) => name),
          image: spotifyTrack.album.images[0].url,
          genres: null,
          spotifyUrl: spotifyTrack.external_urls.spotify,
          lastfmUrl: null,
          albumName: spotifyTrack.album.name,
        } as FirstTrackResult;
      } else if (!spotifyTrack && lastfmTrack) {
        return {
          name: lastfmTrack.name,
          artists: [lastfmTrack.artist.name],
          image: args.albumImage,
          genres: lastfmTrack.genres
            ? lastfmTrack.genres.map(({ name }) => name)
            : null,
          spotifyUrl: null,
          lastfmUrl: lastfmTrack.url,
          albumName: lastfmTrack.albumName,
        } as FirstTrackResult;
      } else {
        throw new Error("no album found");
      }
    } catch (err: unknown) {
      console.error(`error searching for ${sanitized}:`, err);

      return null;
    }
  },
});
