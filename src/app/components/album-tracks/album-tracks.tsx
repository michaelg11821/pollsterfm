import { api } from "@/lib/convex/_generated/api";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { fetchAction } from "convex/nextjs";
import LastfmAlbumTracks from "./lastfm";
import SpotifyAlbumTracks from "./spotify";

type AlbumTracksProps = {
  artistName: string;
  albumName: string;
};

async function AlbumTracks({ artistName, albumName }: AlbumTracksProps) {
  const token = await convexAuthNextjsToken();

  const artistData = await fetchAction(
    api.pollster.artist.getCachedArtist,
    { artistName },
    { token },
  );

  if (!artistData) return null;

  const albumData = await fetchAction(
    api.pollster.album.getCachedAlbum,
    { artistName: artistData.name, albumName },
    { token },
  );

  if (!albumData) return null;

  return (
    <section>
      <h2 className="mb-6 text-2xl font-bold">Tracks</h2>
      {!albumData.spotifyUrl ? (
        <LastfmAlbumTracks
          artistName={artistData.name}
          albumName={albumData.name}
        />
      ) : (
        <SpotifyAlbumTracks
          artistName={artistData.name}
          albumName={albumData.name}
          spotifyUrl={albumData.spotifyUrl}
        />
      )}
    </section>
  );
}

export default AlbumTracks;
