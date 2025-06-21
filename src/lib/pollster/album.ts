import {
  getFirstLastfmAlbumFromQuery,
  getLastfmAlbumTags,
} from "../lastfm/album";
import { getFirstSpotifyAlbumFromQuery } from "../spotify/album";
import type {
  FirstAlbumResult,
  FirstArtistResult,
} from "../types/internalResponses";

/**
 * Returns information about the first albums that appear in each search. The result is cached by Next.js.
 *
 * @param artistData See the FirstArtistResult type.
 * @param albumName The name of an album.
 * @returns An object containing an image, a name, and genres for the album.
 */
export async function findFirstAlbumByName(
  artistData: FirstArtistResult,
  albumName: string,
): Promise<FirstAlbumResult | null> {
  const sanitized = decodeURIComponent(albumName);

  try {
    const spotifyResult = getFirstSpotifyAlbumFromQuery(
      artistData.name,
      sanitized,
    );
    const lastfmResult = getFirstLastfmAlbumFromQuery(
      artistData.name,
      sanitized,
    );

    const [spotifyAlbum, lastfmAlbum] = await Promise.all([
      spotifyResult,
      lastfmResult,
    ]);

    if (spotifyAlbum && lastfmAlbum) {
      const genresFromLastfm = await getLastfmAlbumTags(
        artistData.name,
        sanitized,
      );

      return {
        name: spotifyAlbum.name,
        artists: spotifyAlbum.artists.map(({ name }) => name),
        image: spotifyAlbum.images[0].url,
        genres: genresFromLastfm
          ? genresFromLastfm.map(({ name }) => name)
          : null,
        spotifyUrl: spotifyAlbum.external_urls.spotify,
        lastfmUrl: lastfmAlbum.url,
      };
    } else if (spotifyAlbum && !lastfmAlbum) {
      return {
        name: spotifyAlbum.name,
        artists: spotifyAlbum.artists.map(({ name }) => name),
        image: spotifyAlbum.images[0].url,
        genres: null,
        spotifyUrl: spotifyAlbum.external_urls.spotify,
        lastfmUrl: null,
      };
    } else if (!spotifyAlbum && lastfmAlbum) {
      return {
        name: lastfmAlbum.name,
        artists: [lastfmAlbum.artist],
        image: lastfmAlbum.image[3]["#text"],
        genres: lastfmAlbum.genres
          ? lastfmAlbum.genres.map(({ name }) => name)
          : null,
        spotifyUrl: null,
        lastfmUrl: lastfmAlbum.url,
      };
    } else {
      throw new Error("no album found");
    }
  } catch (err: unknown) {
    console.error(`error searching for ${sanitized}:`, err);

    return null;
  }
}
