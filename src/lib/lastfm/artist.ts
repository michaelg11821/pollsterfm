import { isSimilar } from "../convex-utils";
import type {
  LastfmArtistAlbumsResponse,
  LastfmArtistCorrectionResponse,
  LastfmArtistSearchResponse,
  LastfmArtistTagsResponse,
  LastfmSimilarArtistsResponse,
} from "../types/lastfmResponses";
import { suffix } from "./suffix";

/**
 * Gets tags (genres) for an artist on Last.fm.
 *
 * @param artistName The name of an artist on Last.fm.
 * @returns The tags for an artist.
 */
export async function getLastfmArtistTags(artistName: string) {
  try {
    const res = await fetch(
      `http://ws.audioscrobbler.com/2.0/?method=artist.gettoptags&artist=${artistName}${suffix}`,
    );

    if (!res.ok) throw new Error("failed to get artist tags");

    const results: LastfmArtistTagsResponse = await res.json();

    const tags = results.toptags.tag;

    if (!tags) {
      throw new Error("no valid result");
    }

    return tags;
  } catch (err: unknown) {
    console.error("error getting artist tags:", err);

    return null;
  }
}

/**
 * Returns the first artist found from the Last.fm API with the given query.
 *
 * @param artistQuery The name of an artist on Last.fm.
 * @returns The first artist found with the given query.
 */
export async function getFirstLastfmArtistFromQuery(artistQuery: string) {
  try {
    // try autocorrect in query parameters

    const res = await fetch(
      `http://ws.audioscrobbler.com/2.0/?method=artist.getcorrection&artist=${artistQuery}${suffix}`,
    );

    if (!res.ok) throw new Error("failed to get first artist from query");

    const correctionResult: LastfmArtistCorrectionResponse = await res.json();

    const artist = correctionResult.corrections.correction.artist;

    if (!artist) {
      throw new Error("no valid result");
    }

    const match = isSimilar(artistQuery, artist.name);

    if (match) {
      return {
        name: artist.name,
        image: null,
        genres: await getLastfmArtistTags(artist.name),
        url: artist.url,
      };
    } else {
      return null;
    }
  } catch (err: unknown) {
    console.error("error getting first artist from query:", err);

    return null;
  }
}

/**
 * Gets the (first 5) top albums for an artist on Last.fm.
 *
 * @param artistName The name of an artist on Last.fm.
 * @returns The top albums for the given artist.
 */
export async function getLastfmArtistAlbums(
  artistName: string,
  page: number = 1,
  limit: number,
) {
  try {
    const res = await fetch(
      `http://ws.audioscrobbler.com/2.0/?method=artist.gettopalbums&artist=${artistName}&limit=${limit}&page=${page ?? 1}${suffix}`,
    );

    if (!res.ok) throw new Error(`failed to get albums for ${artistName}`);

    const albums: LastfmArtistAlbumsResponse = await res.json();

    if (!albums.topalbums.album) {
      throw new Error("no albums found");
    }

    return albums.topalbums;
  } catch (err: unknown) {
    console.error(`error getting top albums for ${artistName}:`, err);

    return null;
  }
}

/**
 * Returns artists on Last.fm similar to the one provided.
 *
 * @param artistName The name of an artist on Last.fm.
 * @param amount The amount of artists to return. Default is 4.
 * @returns The similar artists on Last.fm.
 */
export async function getSimilarLastfmArtists(
  artistName: string,
  amount: number = 4,
) {
  try {
    const res = await fetch(
      `http://ws.audioscrobbler.com/2.0/?method=artist.getsimilar&artist=${artistName}${suffix}`,
    );

    if (!res.ok)
      throw new Error(`failed to get similar artists for ${artistName}`);

    const results: LastfmSimilarArtistsResponse = await res.json();

    const relatedArtists = results.similarartists.artist.slice(0, amount);

    return relatedArtists;
  } catch (err: unknown) {
    console.error("error getting similar artists:", err);

    return null;
  }
}

/**
 * Returns the artists found from the Last.fm API with the given query.
 *
 * @param artistQuery The name of an artist on Last.fm.
 * @returns The artists found with the given query.
 */
export async function lastfmArtistSearch(artistQuery: string) {
  try {
    const res = await fetch(
      `http://ws.audioscrobbler.com/2.0/?method=artist.search&artist=${artistQuery}&limit=50${suffix}`,
    );

    if (!res.ok) throw new Error("failed to get artists from query");

    const searchResults: LastfmArtistSearchResponse = await res.json();

    if (!searchResults) {
      throw new Error("no valid result");
    }

    return searchResults.results.artistmatches.artist;
  } catch (err: unknown) {
    console.error("error getting artists from query:", err);

    return null;
  }
}
