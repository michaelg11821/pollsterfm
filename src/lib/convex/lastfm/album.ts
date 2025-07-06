import { getLastfmAlbumTracks } from "@/lib/lastfm/album";
import { v } from "convex/values";
import { action } from "../_generated/server";

export const getTracks = action({
  args: {
    artistName: v.string(),
    albumName: v.string(),
  },
  handler: async (_, args) => {
    return await getLastfmAlbumTracks(args.artistName, args.albumName);
  },
});
