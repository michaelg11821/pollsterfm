import { getFirstLastfmTrackFromQuery } from "../lastfm/track";
import { getFirstSpotifyTrackFromQuery } from "../spotify/track";
import type {
  FirstAlbumResult,
  FirstTrackResult,
} from "../types/internalResponses";

/**
 * Returns information about the first track that appears in each search. The result is cached by Next.js.
 *
 * @param albumData See the FirstAlbumResult type.
 * @param trackName The name of a track.
 * @returns An object containing an image, a name, and genres for the track.
 */
export async function findFirstTrackByName(
  albumData: FirstAlbumResult,
  trackName: string,
): Promise<FirstTrackResult | null> {
  const sanitized = decodeURIComponent(trackName);

  try {
    const spotifyResult = getFirstSpotifyTrackFromQuery(albumData, sanitized);
    const lastfmResult = getFirstLastfmTrackFromQuery(albumData, sanitized);

    const [spotifyTrack, lastfmTrack] = await Promise.all([
      spotifyResult,
      lastfmResult,
    ]);

    if (spotifyTrack && lastfmTrack) {
      return {
        name: spotifyTrack.name,
        artists: spotifyTrack.album.artists.map(({ name }) => name),
        image: spotifyTrack.album.images[0].url,
        genres: lastfmTrack.genres
          ? lastfmTrack.genres.map(({ name }) => name)
          : null,
        spotifyUrl: spotifyTrack.external_urls.spotify,
        lastfmUrl: lastfmTrack.url,
        albumName: spotifyTrack.album.name,
      };
    } else if (spotifyTrack && !lastfmTrack) {
      return {
        name: spotifyTrack.name,
        artists: spotifyTrack.album.artists.map(({ name }) => name),
        image: spotifyTrack.album.images[0].url,
        genres: null,
        spotifyUrl: spotifyTrack.external_urls.spotify,
        lastfmUrl: null,
        albumName: spotifyTrack.album.name,
      };
    } else if (!spotifyTrack && lastfmTrack) {
      return {
        name: lastfmTrack.name,
        artists: [lastfmTrack.artist.name],
        image: albumData.image,
        genres: lastfmTrack.genres
          ? lastfmTrack.genres.map(({ name }) => name)
          : null,
        spotifyUrl: null,
        lastfmUrl: lastfmTrack.url,
        albumName: lastfmTrack.albumName,
      };
    } else {
      throw new Error("no album found");
    }
  } catch (err: unknown) {
    console.error(`error searching for ${sanitized}:`, err);

    return null;
  }
}
