"use server";

import type { Track } from "./types/spotify";
import type {
  SpotifyArtistSearchResponse,
  SpotifyArtistTopTracksResponse,
  SpotifyClientCredentialsResponse,
} from "./types/spotifyResponses";
import { isSimilar } from "./utils";

/**
 * Returns client credentials from Spotify.
 *
 * @returns A valid access token for the client.
 */
async function getClientCredentials(): Promise<string | null> {
  const clientId = process.env.AUTH_SPOTIFY_ID!;
  const clientSecret = process.env.AUTH_SPOTIFY_SECRET!;

  try {
    const res = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization:
          "Basic " +
          Buffer.from(clientId + ":" + clientSecret).toString("base64"),
      },
      body: new URLSearchParams({
        grant_type: "client_credentials",
      }),
    });

    if (!res.ok) throw new Error("failed to get client credentials");

    const credentials: SpotifyClientCredentialsResponse = await res.json();

    return credentials.access_token;
  } catch (err: unknown) {
    console.error("error getting client credentials:", err);

    return null;
  }
}

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
      `https://api.spotify.com/v1/search?q=${artistQuery}&type=artist`,
      { headers: { Authorization: `Bearer ${credentials}` } }
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
      { headers: { Authorization: `Bearer ${credentials}` } }
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
