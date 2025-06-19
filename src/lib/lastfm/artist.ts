"use server";

import { ALBUM_PAGE_LIMIT } from "../pollster/config";
import type {
  LastfmArtistAlbumsResponse,
  LastfmArtistSearchResponse,
  LastfmArtistTagsResponse,
  LastfmArtistTopAlbumsResponse,
  LastfmSimilarArtistsResponse,
} from "../types/lastfmResponses";
import { isSimilar } from "../utils";
import { suffix } from "./suffix";

/**
 * Gets tags (genres) for an artist on Last.fm.
 *
 * @param artistName The name of an artist on Last.fm.
 * @returns The tags for an artist.
 */
export async function getArtistTags(artistName: string) {
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
    const res = await fetch(
      `http://ws.audioscrobbler.com/2.0/?method=artist.search&artist=${artistQuery}&limit=1${suffix}`,
    );

    if (!res.ok) throw new Error("failed to get first artist from query");

    const searchResults: LastfmArtistSearchResponse = await res.json();

    const firstArtist = searchResults.results.artistmatches.artist[0];

    if (!firstArtist) {
      throw new Error("no valid result");
    }

    const match = isSimilar(artistQuery, firstArtist.name);

    if (match) {
      const tags = await getArtistTags(firstArtist.name);

      return {
        name: firstArtist.name,
        image: null,
        genres: tags,
        url: firstArtist.url,
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
export async function getLastfmArtistTopAlbums(artistName: string) {
  try {
    const res = await fetch(
      `http://ws.audioscrobbler.com/2.0/?method=artist.gettopalbums&artist=${artistName}${suffix}`,
    );

    if (!res.ok) throw new Error(`failed to get top albums for ${artistName}`);

    const topAlbums: LastfmArtistTopAlbumsResponse = await res.json();

    if (!topAlbums.topalbums.album) {
      throw new Error("no albums found");
    }

    return topAlbums.topalbums.album.slice(0, 5);
  } catch (err: unknown) {
    console.error(`error getting top albums for ${artistName}:`, err);

    return null;
  }
}

/**
 * Gets a page of albums for an artist on Last.fm.
 *
 * @param artistName The name of an artist on Last.fm.
 * @param page The page of albums. Defaults to 1.
 * @returns The albums for the given artist.
 */
export async function getLastfmArtistAlbums(
  artistName: string,
  page: number = 1,
) {
  try {
    const res = await fetch(
      `http://ws.audioscrobbler.com/2.0/?method=artist.gettopalbums&artist=${artistName}&limit=${ALBUM_PAGE_LIMIT}&page=${page}${suffix}`,
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
