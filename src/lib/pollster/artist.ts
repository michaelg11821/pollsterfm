import { cache } from "react";
import {
  getArtistTags,
  getFirstLastfmArtistFromQuery,
  getLastfmArtistTopAlbums,
} from "../lastfm";
import {
  getFirstSpotifyArtistFromQuery,
  getSpotifyArtistTopAlbums,
} from "../spotifyClient";
import type { TopAlbum } from "../types/pollster";
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
        genres:
          spotifyArtist.genres.length !== 0
            ? spotifyArtist.genres
            : await getArtistTags(spotifyArtist.name),
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

/**
 * ONLY for use in server components.
 */
export const getCachedArtist = cache(async (artistName: string) => {
  return await findFirstArtistByName(artistName);
});

/**
 * Gets the top albums for an artist. Platform-agnostic.
 *
 * @param artistData The name and URLs for the platforms the artist is on. See FirstArtistResult and ... (more to come).
 * @returns The top albums for an artist.
 */
export async function getTopAlbums(artistData: FirstArtistResult) {
  const { name, spotifyUrl, lastfmUrl } = artistData;

  try {
    if ((spotifyUrl && !lastfmUrl) || (spotifyUrl && lastfmUrl)) {
      const parts = new URL(spotifyUrl).pathname.split("/");
      const spotifyId = parts[parts.length - 1];

      const spotifyTopAlbums = await getSpotifyArtistTopAlbums(spotifyId);

      if (!spotifyTopAlbums) throw new Error("no results from spotify");

      const normalizedTopAlbums: TopAlbum[] = spotifyTopAlbums.map((album) => {
        return {
          name: album.name,
          images: album.images,
          releaseDate: album.release_date,
        };
      });

      // and eventually get pollster ratings here

      return normalizedTopAlbums;
    } else if (!spotifyUrl && lastfmUrl) {
      const lastfmTopAlbums = await getLastfmArtistTopAlbums(name);

      if (!lastfmTopAlbums) throw new Error("no results from lastfm");

      const normalizedTopAlbums: TopAlbum[] = lastfmTopAlbums.map((album) => {
        return {
          name: album.name,
          images: album.image.map((img) => {
            return {
              url: img["#text"],
            };
          }),
          releaseDate: null, // last fm does not provide release dates
        };
      });

      // and eventually get pollster ratings here

      return normalizedTopAlbums;
    } else {
      return null;
    }
  } catch (err: unknown) {
    console.error(`error getting top albums for ${name}:`, err);

    return null;
  }
}
