import type { FirstTrackResult } from "../../types/internalResponses";

import { TrackFromSearch as LastfmTrack } from "@/lib/types/lastfm";
import { Track as SpotifyTrack } from "@/lib/types/spotify";
import { v } from "convex/values";
import { api } from "../_generated/api";
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
      const spotifyResult: Promise<SpotifyTrack | null> = ctx.runAction(
        api.spotify.track.getFirstFromQuery,
        {
          artistName: args.artistName,
          albumName: args.albumName,
          trackQuery: sanitized,
        },
      );
      const lastfmResult: Promise<LastfmTrack | null> = ctx.runAction(
        api.lastfm.track.getFirstFromQuery,
        {
          artistName: args.artistName,
          albumName: args.albumName,
          albumImage: args.albumImage,
          trackQuery: sanitized,
        },
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
