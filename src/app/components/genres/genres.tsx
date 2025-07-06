import AlbumGenres from "./album/album";
import ArtistGenres from "./artist/artist";
import TrackGenres from "./track/track";

type GenresProps = {
  artistName: string;
  albumName?: string;
  trackName?: string;
};

async function Genres({ artistName, albumName, trackName }: GenresProps) {
  if (artistName && !albumName && !trackName) {
    return <ArtistGenres artistName={artistName} />;
  } else if (artistName && albumName && !trackName) {
    return <AlbumGenres artistName={artistName} albumName={albumName} />;
  } else if (artistName && albumName && trackName) {
    return (
      <TrackGenres
        artistName={artistName}
        albumName={albumName}
        trackName={trackName}
      />
    );
  } else {
    return null;
  }
}

export default Genres;
