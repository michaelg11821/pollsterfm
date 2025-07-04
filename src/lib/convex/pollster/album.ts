import type { FirstAlbumResult } from "../../types/internalResponses";

import { getFirstLastfmAlbumFromQuery } from "@/lib/lastfm/album";
import { getFirstSpotifyAlbumFromQuery } from "@/lib/spotify/album";
import { v } from "convex/values";
import { action } from "../_generated/server";

export const findFirstByName = action({
  args: { artistName: v.string(), albumName: v.string() },
  handler: async (ctx, args) => {
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
