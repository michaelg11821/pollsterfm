import type { FirstAlbumResult } from "../types/internalResponses";
import type {
  LastfmTrackInfoResponse,
  LastfmTrackSearchResponse,
} from "../types/lastfmResponses";
import { isSimilar } from "../utils";
import { suffix } from "./suffix";

/**
 * Gets tags (genres) for a track on Last.fm.
 *
 * @param artistName The name of an artist on Last.fm.
 * @param trackName The name of a track on Last.fm.
 * @returns The tags for a track.
 */
export async function getLastfmTrackTags(
  artistName: string,
  trackName: string,
) {
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

/**
 * Returns the first track found from the Last.fm API with the given query.
 *
 * @param albumData See the FirstAlbumResult type.
 * @param trackQuery The name of a track.
 * @returns The first track found with the given query.
 */
export async function getFirstLastfmTrackFromQuery(
  albumData: FirstAlbumResult,
  trackQuery: string,
) {
  try {
    const res = await fetch(
      `http://ws.audioscrobbler.com/2.0/?method=track.search&track=${trackQuery}&artist=${albumData.artists[0]}&limit=1${suffix}`,
    );

    if (!res.ok) throw new Error("failed to get first track from query");

    const searchResults: LastfmTrackSearchResponse = await res.json();

    const firstTrack = searchResults.results.trackmatches.track[0];

    if (!firstTrack) {
      throw new Error("no valid result");
    }

    const match = isSimilar(trackQuery, firstTrack.name);

    if (match) {
      return {
        name: firstTrack.name,
        artist: firstTrack.artist,
        image: albumData.image,
        genres: await getLastfmTrackTags(albumData.artists[0], firstTrack.name),
        url: firstTrack.url,
        albumName: albumData.name,
      };
    } else {
      return null;
    }
  } catch (err: unknown) {
    console.error("error getting first album from query:", err);

    return null;
  }
}
