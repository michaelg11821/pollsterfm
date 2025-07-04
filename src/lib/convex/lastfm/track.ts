import type { TrackFromSearch } from "@/lib/types/lastfm";
import { v } from "convex/values";
import type {
  LastfmTrackInfoResponse,
  LastfmTrackSearchResponse,
} from "../../types/lastfmResponses";
import { isSimilar } from "../../utils";
import { action } from "../_generated/server";
import { suffix } from "./suffix";

async function getTags(artistName: string, trackName: string) {
  try {
    const res = await fetch(
      `http://ws.audioscrobbler.com/2.0/?method=track.getinfo&artist=${artistName}&track=${trackName}${suffix}`,
    );

    if (!res.ok) throw new Error("failed to get track tags");

    const results: LastfmTrackInfoResponse = await res.json();

    const tags = results.track.toptags.tag;

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
  args: {
    artistName: v.string(),
    albumName: v.string(),
    albumImage: v.union(v.string(), v.null()),
    trackQuery: v.string(),
  },
  handler: async (_, args) => {
    try {
      const res = await fetch(
        `http://ws.audioscrobbler.com/2.0/?method=track.search&track=${args.trackQuery}&artist=${args.artistName}&limit=1${suffix}`,
      );

      if (!res.ok) throw new Error("failed to get first track from query");

      const searchResults: LastfmTrackSearchResponse = await res.json();

      const firstTrack = searchResults.results.trackmatches.track[0];

      if (!firstTrack) {
        throw new Error("no valid result");
      }

      const match = isSimilar(args.trackQuery, firstTrack.name);

      if (match) {
        return {
          name: firstTrack.name,
          artist: firstTrack.artist,
          image: args.albumImage,
          genres: await getTags(args.artistName, firstTrack.name),
          url: firstTrack.url,
          albumName: args.albumName,
        } as TrackFromSearch;
      } else {
        return null;
      }
    } catch (err: unknown) {
      console.error("error getting first album from query:", err);

      return null;
    }
  },
});
