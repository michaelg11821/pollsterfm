"use server";

import type {
  LastfmAlbumSearchResponse,
  LastfmAlbumTagsResponse,
} from "../types/lastfmResponses";
import { isSimilar } from "../utils";
import { suffix } from "./suffix";

/**
 * Gets tags (genres) for an album on Last.fm.
 *
 * @param albumName The name of an album on Last.fm.
 * @returns The tags for an album.
 */
export async function getAlbumTags(artistName: string, albumName: string) {
  try {
    const res = await fetch(
      `http://ws.audioscrobbler.com/2.0/?method=album.gettoptags&artist=${artistName}&album=${albumName}${suffix}`,
    );

    if (!res.ok) throw new Error("failed to get album tags");

    const results: LastfmAlbumTagsResponse = await res.json();

    const tags = results.toptags.tag;

    if (!tags) {
      throw new Error("no valid result");
    }

    return tags;
  } catch (err: unknown) {
    console.error("error getting album tags:", err);

    return null;
  }
}

/**
 * Returns the first album found from the Last.fm API with the given query.
 *
 * @param albumQuery The name of an album on Last.fm.
 * @returns The first album found with the given query.
 */
export async function getFirstLastfmAlbumFromQuery(
  artistName: string,
  albumQuery: string,
) {
  try {
    const res = await fetch(
      `http://ws.audioscrobbler.com/2.0/?method=album.search&album=${albumQuery}&limit=1${suffix}`,
    );

    if (!res.ok) throw new Error("failed to get first album from query");

    const searchResults: LastfmAlbumSearchResponse = await res.json();

    const firstAlbum = searchResults.results.albummatches.album[0];

    if (!firstAlbum) {
      throw new Error("no valid result");
    }

    const match = isSimilar(albumQuery, firstAlbum.name);

    if (match) {
      return {
        name: firstAlbum.name,
        image: firstAlbum.image,
        genres: await getAlbumTags(artistName, firstAlbum.name),
        url: firstAlbum.url,
      };
    } else {
      return null;
    }
  } catch (err: unknown) {
    console.error("error getting first album from query:", err);

    return null;
  }
}
