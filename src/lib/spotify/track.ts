import type { FirstAlbumResult } from "../types/internalResponses";
import type { SpotifyTrackSearchResponse } from "../types/spotifyResponses";
import { isSimilar } from "../utils";
import { getClientCredentials } from "./credentials";

/**
 * Returns the first track found from the Spotify API with the given query.
 *
 * @param albumData See the FirstAlbumResult type.
 * @param trackQuery The name of a track.
 * @returns The first track found with the given query.
 */
export async function getFirstSpotifyTrackFromQuery(
  albumData: FirstAlbumResult,
  trackQuery: string,
) {
  try {
    const credentials = await getClientCredentials();

    if (!credentials) throw new Error("invalid credentials");

    const query = `artist:"${albumData.artists[0]}" album:"${albumData.name}" track:"${trackQuery}"`;
    const encodedQuery = encodeURIComponent(query);

    const res = await fetch(
      `https://api.spotify.com/v1/search?q=${encodedQuery}&type=track&limit=1`,
      { headers: { Authorization: `Bearer ${credentials}` } },
    );

    if (!res.ok) throw new Error("failed to get first track from query");

    const results: SpotifyTrackSearchResponse = await res.json();

    const firstTrack = results.tracks.items[0];

    if (!firstTrack) {
      throw new Error("no valid result");
    }

    const match = isSimilar(trackQuery, firstTrack.name);

    if (match) {
      return firstTrack;
    } else {
      return null;
    }
  } catch (err: unknown) {
    console.error("error getting first track from query:", err);

    return null;
  }
}
