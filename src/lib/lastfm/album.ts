import type {
  LastfmAlbumInfoResponse,
  LastfmAlbumSearchResponse,
} from "../types/lastfmResponses";
import { isSimilar } from "../utils";
import { suffix } from "./suffix";

/**
 * Gets tags (genres) for an album on Last.fm.
 *
 * @param albumName The name of an album on Last.fm.
 * @returns The tags for an album.
 */
export async function getLastfmAlbumTags(
  artistName: string,
  albumName: string,
) {
  try {
    const res = await fetch(
      `http://ws.audioscrobbler.com/2.0/?method=album.getinfo&artist=${artistName}&album=${albumName}${suffix}`,
    );

    if (!res.ok) throw new Error("failed to get album tags");

    const results: LastfmAlbumInfoResponse = await res.json();

    const tags = results.album.tags.tag;

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
        artist: firstAlbum.artist,
        image: firstAlbum.image,
        genres: await getLastfmAlbumTags(artistName, firstAlbum.name),
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

/**
 * Returns the tracks on the given album.
 *
 * @param artistName The name of an artist.
 * @param albumName The name of an album.
 * @returns The tracks on the given album.
 */
export async function getLastfmAlbumTracks(
  artistName: string,
  albumName: string,
) {
  try {
    const res = await fetch(
      `http://ws.audioscrobbler.com/2.0/?method=album.getinfo&artist=${artistName}&album=${albumName}${suffix}`,
    );

    if (!res.ok) throw new Error("failed to get album tracks");

    const results: LastfmAlbumInfoResponse = await res.json();

    const tracks = results.album.tracks;

    if (!tracks) {
      throw new Error("no valid result");
    }

    return tracks;
  } catch (err: unknown) {
    console.error("error getting album tracks:", err);

    return null;
  }
}

/**
 * Returns the albums found from the Last.fm API with the given query.
 *
 * @param albumQuery The name of an album on Last.fm.
 * @returns The albums found with the given query.
 */
export async function lastfmAlbumSearch(albumQuery: string) {
  try {
    const res = await fetch(
      `http://ws.audioscrobbler.com/2.0/?method=album.search&album=${albumQuery}&limit=50${suffix}`,
    );

    if (!res.ok) throw new Error("failed to get albums from query");

    const searchResults: LastfmAlbumSearchResponse = await res.json();

    if (!searchResults) {
      throw new Error("no valid result");
    }

    return searchResults.results.albummatches.album;
  } catch (err: unknown) {
    console.error("error getting albums from query:", err);

    return null;
  }
}
