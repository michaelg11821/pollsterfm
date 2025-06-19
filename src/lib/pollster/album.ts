import { getFirstLastfmAlbumFromQuery } from "../lastfm/album";
import { getFirstSpotifyAlbumFromQuery } from "../spotify/album";
import type {
  FirstAlbumResult,
  FirstArtistResult,
} from "../types/internalResponses";

/**
 * Returns information about the first albums that appear in each search. The result is cached by Next.js.
 *
 * @param artistData pollster.fm artist data.
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
      return {
        name: spotifyAlbum.name,
        image: spotifyAlbum.images[0].url,
        genres: artistData.genres,
        spotifyUrl: spotifyAlbum.external_urls.spotify,
        lastfmUrl: lastfmAlbum.url,
      };
    } else if (spotifyAlbum && !lastfmAlbum) {
      return {
        name: spotifyAlbum.name,
        image: spotifyAlbum.images[0].url,
        genres: artistData.genres,
        spotifyUrl: spotifyAlbum.external_urls.spotify,
        lastfmUrl: null,
      };
    } else if (!spotifyAlbum && lastfmAlbum) {
      return {
        name: lastfmAlbum.name,
        image: lastfmAlbum.image[3]["#text"],
        genres: lastfmAlbum.genres,
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
