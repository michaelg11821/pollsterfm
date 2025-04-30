"use server";

import type {
  LastfmArtistSearchResponse,
  LastfmArtistTagsResponse,
} from "./types/lastfmResponses";
import { isSimilar } from "./utils";

const apiKey = process.env.LASTFM_API_KEY!;
const suffix = `&api_key=${apiKey}&format=json`;

export async function getArtistTags(artistName: string) {
  try {
    const res = await fetch(
      `http://ws.audioscrobbler.com/2.0/?method=artist.gettoptags&artist=${artistName}${suffix}`
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
 * @param artistQuery The name of an artist.
 * @returns The first artist found with the given query.
 */
export async function getFirstLastfmArtistFromQuery(artistQuery: string) {
  try {
    const res = await fetch(
      `http://ws.audioscrobbler.com/2.0/?method=artist.search&artist=${artistQuery}${suffix}`
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
