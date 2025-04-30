import { cache } from "react";
import { getFirstLastfmArtistFromQuery } from "../lastfm";
import { getFirstSpotifyArtistFromQuery } from "../spotifyClient";
import type { FirstArtistResult } from "../types/serverResponses";

/**
 * Returns information about the first artists that appear in each search.
 *
 * Currently searches Spotify and Last.fm. Images from Last.fm are not provided.
 *
 * @param artistName The name of an artist.
 * @returns An object containing an image, a name, and genres for the artist.
 */
async function findFirstArtistByName(
  artistName: string
): Promise<FirstArtistResult | null> {
  const sanitized = decodeURIComponent(artistName);

  try {
    const spotifyResult = getFirstSpotifyArtistFromQuery(sanitized);
    const lastfmResult = getFirstLastfmArtistFromQuery(sanitized);

    const [spotifyArtist, lastfmArtist] = await Promise.all([
      spotifyResult,
      lastfmResult,
    ]);

    if (spotifyArtist && lastfmArtist) {
      return {
        name: spotifyArtist.name,
        image: spotifyArtist.images[0].url,
        genres: spotifyArtist.genres,
        spotifyUrl: spotifyArtist.external_urls.spotify,
        lastfmUrl: lastfmArtist.url,
      };
    } else if (spotifyArtist && !lastfmArtist) {
      return {
        name: spotifyArtist.name,
        image: spotifyArtist.images[0].url,
        genres: spotifyArtist.genres,
        spotifyUrl: spotifyArtist.external_urls.spotify,
        lastfmUrl: null,
      };
    } else if (!spotifyArtist && lastfmArtist) {
      return {
        name: lastfmArtist.name,
        image: null,
        genres: lastfmArtist.genres,
        spotifyUrl: null,
        lastfmUrl: lastfmArtist.url,
      };
    } else {
      throw new Error("no artist found");
    }
  } catch (err: unknown) {
    console.error(`error searching for ${sanitized}:`, err);

    return null;
  }
}

export const getCachedArtist = cache(async (artistName: string) => {
  return await findFirstArtistByName(artistName);
});
