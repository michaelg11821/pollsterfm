"use server";

import type {
  LastfmArtistAlbumsResponse,
  LastfmArtistSearchResponse,
  LastfmArtistTagsResponse,
  LastfmArtistTopAlbumsResponse,
} from "./types/lastfmResponses";
import { isSimilar } from "./utils";

const apiKey = process.env.LASTFM_API_KEY!;
const suffix = `&api_key=${apiKey}&format=json`;

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
    console.error("error getting first artist from query:", err);

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
      `http://ws.audioscrobbler.com/2.0/?method=artist.search&artist=${artistQuery}${suffix}`,
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
 * Gets 50 albums for an artist on Last.fm. Defaults to page 1.
 *
 * @param artistName The name of an artist on Last.fm.
 * @returns The top albums for the given artist.
 */
export async function getLastfmArtistAlbums(
  artistName: string,
  page: number = 1,
) {
  try {
    const res = await fetch(
      `http://ws.audioscrobbler.com/2.0/?method=artist.gettopalbums&artist=${artistName}&page=${page}${suffix}`,
    );

    if (!res.ok) throw new Error(`failed to get albums for ${artistName}`);

    const topAlbums: LastfmArtistAlbumsResponse = await res.json();

    if (!topAlbums.topalbums.album) {
      throw new Error("no albums found");
    }

    return topAlbums.topalbums.album;
  } catch (err: unknown) {
    console.error(`error getting top albums for ${artistName}:`, err);

    return null;
  }
}
