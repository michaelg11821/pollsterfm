import { getCachedArtist } from "@/lib/pollster/artist";

import ClientArtistGenresFull from "./client";

type ArtistGenresFullProps = {
  artistName: string;
};

async function ArtistGenresFull({ artistName }: ArtistGenresFullProps) {
  const artistData = await getCachedArtist(artistName);

  if (!artistData || !artistData.genres) return <p>No genres found.</p>;

  return (
    <ClientArtistGenresFull
      artistData={artistData}
      originalQuery={artistName}
    />
  );
}

export default ArtistGenresFull;
