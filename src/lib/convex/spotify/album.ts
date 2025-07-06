import { getSpotifyAlbumTracks } from "@/lib/spotify/album";
import { v } from "convex/values";
import { action } from "../_generated/server";

export const getTracks = action({
  args: {
    spotifyUrl: v.string(),
    nextUrl: v.optional(v.string()),
  },
  handler: async (_, args) => {
    const parts = new URL(args.spotifyUrl).pathname.split("/");
    const spotifyId = parts[parts.length - 1];

    return await getSpotifyAlbumTracks(spotifyId, args.nextUrl);
  },
});
