import type {
  LastfmTrackCorrectionResponse,
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
      `http://ws.audioscrobbler.com/2.0/?method=track.getcorrection&artist=${artistName}&track=${trackQuery}${suffix}`,
    );

    if (!res.ok) throw new Error("failed to get first track from query");

    const correctionResult: LastfmTrackCorrectionResponse = await res.json();

    const track = correctionResult.corrections.correction.track;

    if (!track) {
      throw new Error("no valid result");
    }

    const match = isSimilar(decodeURIComponent(trackQuery), track.name);

    if (match) {
      return {
        name: track.name,
        artist: track.artist.name,
        image: albumImage,
        genres: await getLastfmTrackTags(artistName, track.name),
        url: track.url,
        albumName: albumName,
      };
    } else {
      return null;
    }
  } catch (err: unknown) {
    console.error("error getting first track from query:", err);

    return null;
  }
}

/**
 * Returns the tracks found from the Last.fm API with the given query.
 *
 * @param trackQuery The name of an track on Last.fm.
 * @returns The tracks found with the given query.
 */
export async function lastfmTrackSearch(trackQuery: string) {
  try {
    const res = await fetch(
      `http://ws.audioscrobbler.com/2.0/?method=track.search&track=${trackQuery}&limit=50${suffix}`,
    );

    if (!res.ok) throw new Error("failed to get tracks from query");

    const searchResults: LastfmTrackSearchResponse = await res.json();

    if (!searchResults) {
      throw new Error("no valid result");
    }

    return searchResults.results.trackmatches.track;
  } catch (err: unknown) {
    console.error("error getting tracks from query:", err);

    return null;
  }
}
