import { Base64 } from "convex/values";
import type { SpotifyClientCredentialsResponse } from "../types/spotifyResponses";

/**
 * Returns client credentials from Spotify.
 *
 * @returns A valid access token for the client.
 */
export async function getClientCredentials(): Promise<string | null> {
  const clientId = process.env.AUTH_SPOTIFY_ID!;
  const clientSecret = process.env.AUTH_SPOTIFY_SECRET!;

  try {
    const authCredentials = `${clientId}:${clientSecret}`;
    const uint8 = new TextEncoder().encode(authCredentials);
    const encoded = Base64.fromByteArray(uint8);

    const res = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: "Basic " + encoded,
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
