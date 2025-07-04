import type { FirstAlbumResult } from "../../types/internalResponses";

import type { AlbumFromSearch as LastfmAlbum } from "@/lib/types/lastfm";
import type { SimplifiedAlbum as SpotifyAlbum } from "@/lib/types/spotify";
import { v } from "convex/values";
import { api } from "../_generated/api";
import { action } from "../_generated/server";

export const findFirstByName = action({
  args: { artistName: v.string(), albumName: v.string() },
  handler: async (ctx, args) => {
    const sanitized = decodeURIComponent(args.albumName);

    try {
      const spotifyResult: Promise<SpotifyAlbum | null> = ctx.runAction(
        api.spotify.album.getFirstFromQuery,
        {
          artistName: args.artistName,
          albumQuery: sanitized,
        },
      );
      const lastfmResult: Promise<LastfmAlbum | null> = ctx.runAction(
        api.lastfm.album.getFirstFromQuery,
        {
          artistName: args.artistName,
          albumQuery: sanitized,
        },
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
