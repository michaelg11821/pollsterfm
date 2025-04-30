"use server";

import type {
  SpotifyArtistSearchResponse,
  SpotifyClientCredentialsResponse,
} from "./types/spotifyResponses";
import { isSimilar } from "./utils";

/**
 * Returns client credentials from Spotify.
 *
 * @returns A valid access token for the client.
 */
async function getClientCredentials() {
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

    const res = await fetch(
      `https://api.spotify.com/v1/search?q=artist%3A${artistQuery}&type=artist`,
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
