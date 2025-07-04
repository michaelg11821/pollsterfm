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
 * @param artistName The name of an artist. Usually the first in a list if applicable.
 * @param albumName The name of an album.
 * @param albumImage The URL to an album's cover.
 * @param trackQuery The name of a track.
 * @returns The first track found with the given query.
 */
export async function getFirstLastfmTrackFromQuery(
  artistName: string,
  albumName: string,
  albumImage: string | null,
  trackQuery: string,
) {
  try {
    const res = await fetch(
      `http://ws.audioscrobbler.com/2.0/?method=track.search&track=${trackQuery}&artist=${artistName}&limit=1${suffix}`,
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
        image: albumImage,
        genres: await getLastfmTrackTags(artistName, firstTrack.name),
        url: firstTrack.url,
        albumName: albumName,
      };
    } else {
      return null;
    }
  } catch (err: unknown) {
    console.error("error getting first album from query:", err);

    return null;
  }
}
