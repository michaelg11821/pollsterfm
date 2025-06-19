import {
  getArtistTags,
  getFirstLastfmArtistFromQuery,
  getLastfmArtistAlbums,
  getLastfmArtistTopAlbums,
  getSimilarLastfmArtists,
} from "../lastfm/artist";
import {
  getFirstSpotifyArtistFromQuery,
  getSpotifyArtistAlbums,
  getSpotifyArtistTopAlbums,
} from "../spotify/artist";
import type {
  ArtistAlbumsResponse,
  FirstArtistResult,
} from "../types/internalResponses";
import type { PollsterAlbum, SimilarArtist, TopAlbum } from "../types/pollster";
import { ALBUM_PAGE_LIMIT } from "./config";

/**
 * Returns information about the first artists that appear in each search. The result is cached by Next.js.
 *
 * Currently searches Spotify and Last.fm. Images from Last.fm are not provided.
 *
 * @param artistName The name of an artist.
 * @returns An object containing an image, a name, and genres for the artist.
 */
export async function findFirstArtistByName(
  artistName: string,
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

/**
 * Gets a page of albums for an artist. Platform-agnostic.
 *
 * @param artistData The name and URLs for the platforms the artist is on. See FirstArtistResult and ... (more to come).
 * @param  page The desired page of albums. 1 by default.
 * @returns The page of albums for an artist.
 */
export async function getAlbums(
  artistData: FirstArtistResult,
  page: number = 1,
): Promise<ArtistAlbumsResponse | null> {
  const { name, spotifyUrl, lastfmUrl } = artistData;

  try {
    if ((!spotifyUrl && lastfmUrl) || (lastfmUrl && spotifyUrl)) {
      const lastfmAlbums = await getLastfmArtistAlbums(name, page);

      if (!lastfmAlbums) throw new Error("no results from lastfm");

      const normalizedAlbums: PollsterAlbum[] = lastfmAlbums.album
        .filter((album) => album.name !== "(null)")
        .map((album) => {
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

      const totalPages = Number(lastfmAlbums["@attr"].totalPages);

      // and eventually get pollster ratings here

      return { albums: normalizedAlbums, totalPages };
    } else if (spotifyUrl && !lastfmUrl) {
      const parts = new URL(spotifyUrl).pathname.split("/");
      const spotifyId = parts[parts.length - 1];

      const spotifyAlbums = await getSpotifyArtistAlbums(spotifyId, page);

      if (!spotifyAlbums) throw new Error("no results from spotify");

      const normalizedAlbums: PollsterAlbum[] = spotifyAlbums.items.map(
        (album) => {
          return {
            name: album.name,
            images: album.images,
            releaseDate: album.release_date,
          };
        },
      );

      const totalPages = Math.ceil(spotifyAlbums.total / ALBUM_PAGE_LIMIT);

      // and eventually get pollster ratings here

      return { albums: normalizedAlbums, totalPages };
    } else {
      return null;
    }
  } catch (err: unknown) {
    console.error(`error getting albums for ${name}:`, err);

    return null;
  }
}

/**
 * Gets similar/related artists to the one provided. Platform-agnostic.
 *
 * @param artistData The name and URLs for the platforms the artist is on. See FirstArtistResult and ... (more to come).
 * @param amount The amount of artists to return. Default is 4.
 * @returns The similar/related artists, if any.
 */
export async function getSimilarArtists(
  artistData: FirstArtistResult,
  amount: number = 4,
) {
  const { name, lastfmUrl } = artistData;

  try {
    if (lastfmUrl) {
      const lastfmSimilarArtists = await getSimilarLastfmArtists(name, amount);

      if (!lastfmSimilarArtists) throw new Error("no results from lastfm");

      const normalizedSimilarArtists: SimilarArtist[] =
        lastfmSimilarArtists.map((artist) => {
          return {
            name: artist.name,
            image: null,
          };
        });

      // and eventually get affinity match percentage here

      return normalizedSimilarArtists;
    } else {
      return null;
    }
  } catch (err: unknown) {
    console.error(`error getting similar artists for ${name}:`, err);

    return null;
  }
}
