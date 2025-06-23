"use server";

import { ALBUM_PAGE_TRACK_LIMIT } from "../pollster/config";
import type {
  SpotifyAlbumSearchResponse,
  SpotifyAlbumTracksResponse,
} from "../types/spotifyResponses";
import { isSimilar } from "../utils";
import { getClientCredentials } from "./credentials";

/**
 * Returns the first album found from the Spotify API with the given query.
 *
 * @param artistName The name of an artist.
 * @param albumQuery The name of an album.
 * @returns The first album found with the given query.
 */
export async function getFirstSpotifyAlbumFromQuery(
  artistName: string,
  albumQuery: string,
) {
  try {
    const credentials = await getClientCredentials();

    if (!credentials) throw new Error("invalid credentials");

    const query = `artist:"${artistName}" album:"${albumQuery}"`;
    const encodedQuery = encodeURIComponent(query);

    const res = await fetch(
      `https://api.spotify.com/v1/search?q=${encodedQuery}&type=album&limit=1`,
      { headers: { Authorization: `Bearer ${credentials}` } },
    );

    if (!res.ok) throw new Error("failed to get first album from query");

    const results: SpotifyAlbumSearchResponse = await res.json();

    const firstAlbum = results.albums.items[0];

    if (!firstAlbum) {
      throw new Error("no valid result");
    }

    const match = isSimilar(albumQuery, firstAlbum.name);

    if (match) {
      return firstAlbum;
    } else {
      return null;
    }
  } catch (err: unknown) {
    console.error("error getting first album from query:", err);

    return null;
  }
}

/**
 * Returns the tracks on the given album.
 *
 * @param spotifyId The {@link https://developer.spotify.com/documentation/web-api/concepts/spotify-uris-ids|Spotify ID} for the album.
 * @param next (optional) The endpoint for the next page of tracks provided by the Spotify API.
 * @returns The tracks on the given album.
 */
export async function getSpotifyAlbumTracks(spotifyId: string, next?: string) {
  try {
    const credentials = await getClientCredentials();

    if (!credentials) throw new Error("invalid credentials");

    const res = next
      ? await fetch(next, {
          headers: { Authorization: `Bearer ${credentials}` },
        })
      : await fetch(
          `https://api.spotify.com/v1/albums/${spotifyId}/tracks?limit=${ALBUM_PAGE_TRACK_LIMIT}`,
          { headers: { Authorization: `Bearer ${credentials}` } },
        );

    if (!res.ok) throw new Error("failed to get album tracks");

    const tracks: SpotifyAlbumTracksResponse = await res.json();

    return tracks;
  } catch (err: unknown) {
    console.error("error getting album tracks:", err);

    return null;
  }
}
