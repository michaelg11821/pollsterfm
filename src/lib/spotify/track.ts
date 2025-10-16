import { isSimilar } from "../convex-utils";
import type { SpotifyTrackSearchResponse } from "../types/spotifyResponses";
import { getClientCredentials } from "./credentials";

/**
 * Returns the first track found from the Spotify API with the given query.
 *
 * @param artistName The name of an artist. Usually the first in a list if applicable.
 * @param albumName The name of an album.
 * @param trackQuery The name of a track.
 * @returns The first track found with the given query.
 */
export async function getFirstSpotifyTrackFromQuery(
  artistName: string,
  albumName: string,
  trackQuery: string,
) {
  try {
    const credentials = await getClientCredentials();

    if (!credentials) throw new Error("invalid credentials");

    const query = `artist:"${artistName}" album:"${albumName}" track:"${trackQuery}"`;
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

/**
 * Returns the tracks found from the Spotify API with the given query.
 *
 * @param trackQuery The name of a track.
 * @returns The tracks found with the given query.
 */
export async function spotifyTrackSearch(trackQuery: string) {
  try {
    const credentials = await getClientCredentials();

    if (!credentials) throw new Error("could not get credentials");

    const res = await fetch(
      `https://api.spotify.com/v1/search?q=${trackQuery.toLowerCase()}&type=track&limit=50`,
      { headers: { Authorization: `Bearer ${credentials}` } },
    );

    if (!res.ok) throw new Error("failed to get tracks from query");

    const results: SpotifyTrackSearchResponse = await res.json();

    const tracks = results.tracks.items;

    if (!tracks) {
      throw new Error("no valid result");
    }

    return tracks;
  } catch (err: unknown) {
    console.error("error getting tracks from query:", err);

    return null;
  }
}
