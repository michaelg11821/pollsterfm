"use server";

import { DISCOGRAPHY_PAGE_LIMIT } from "../pollster/config";
import type { Track } from "../types/spotify";
import type {
  SpotifyArtistAlbumsResponse,
  SpotifyArtistSearchResponse,
  SpotifyArtistTopTracksResponse,
} from "../types/spotifyResponses";
import { isSimilar } from "../utils";
import { getClientCredentials } from "./credentials";

/**
 * Returns the first artist found from the Spotify API with the given query.
 *
 * @param artistQuery The name of an artist.
 * @returns The first artist found with the given query.
 */
export async function getFirstSpotifyArtistFromQuery(artistQuery: string) {
  try {
    const credentials = await getClientCredentials();

    if (!credentials) throw new Error("invalid credentials");

    const res = await fetch(
      `https://api.spotify.com/v1/search?q=${artistQuery.toLowerCase()}&type=artist&limit=1`,
      { headers: { Authorization: `Bearer ${credentials}` } },
    );

    if (!res.ok) throw new Error("failed to get first artist from query");

    const results: SpotifyArtistSearchResponse = await res.json();

    const firstArtist = results.artists.items[0];

    if (!firstArtist) {
      throw new Error("no valid result");
    }

    const match = isSimilar(artistQuery, firstArtist.name);

    if (match) {
      return firstArtist;
    } else {
      return null;
    }
  } catch (err: unknown) {
    console.error("error getting first artist from query:", err);

    return null;
  }
}

/**
 * Returns the top albums from the artist that maps to the given Spotify ID.
 *
 * @param spotifyId The {@link https://developer.spotify.com/documentation/web-api/concepts/spotify-uris-ids|Spotify ID} for the artist.
 * @returns The top albums from the artist that maps to the given Spotify ID.
 */
export async function getSpotifyArtistTopAlbums(spotifyId: string) {
  try {
    const credentials = await getClientCredentials();

    if (!credentials) throw new Error("invalid credentials");

    const res = await fetch(
      `https://api.spotify.com/v1/artists/${spotifyId}/top-tracks`,
      { headers: { Authorization: `Bearer ${credentials}` } },
    );

    if (!res.ok) throw new Error("failed to get top albums");

    const topTracks: SpotifyArtistTopTracksResponse = await res.json();

    const topAlbums = new Map<string, Track["album"]>();

    for (const track of topTracks.tracks) {
      const albumId = track.album.id;

      if (!topAlbums.has(albumId)) {
        topAlbums.set(albumId, track.album);
      }
    }

    return Array.from(topAlbums.values());
  } catch (err: unknown) {
    console.error("error getting top albums:", err);

    return null;
  }
}

/**
 * Returns the page of albums from the artist that maps to the given Spotify ID.
 *
 * @param spotifyId The {@link https://developer.spotify.com/documentation/web-api/concepts/spotify-uris-ids|Spotify ID} for the artist.
 * @param page The desired page of albums. 1 by default.
 * @returns The page of albums from the artist that maps to the given Spotify ID.
 */
export async function getSpotifyArtistAlbums(
  spotifyId: string,
  page: number = 1,
) {
  try {
    const credentials = await getClientCredentials();

    if (!credentials) throw new Error("invalid credentials");

    const pageOffset = DISCOGRAPHY_PAGE_LIMIT * page;

    const res = await fetch(
      `https://api.spotify.com/v1/artists/${spotifyId}/albums?limit=${DISCOGRAPHY_PAGE_LIMIT}&offset=${pageOffset}`,
      { headers: { Authorization: `Bearer ${credentials}` } },
    );

    if (!res.ok) throw new Error("failed to get albums");

    const albums: SpotifyArtistAlbumsResponse = await res.json();

    return albums;
  } catch (err: unknown) {
    console.error("error getting albums:", err);

    return null;
  }
}
