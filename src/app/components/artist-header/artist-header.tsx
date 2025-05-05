import { getCachedArtist } from "@/lib/pollster/artist";

import ClientArtistHeader from "./client";

type ArtistHeaderProps = {
  artistName: string;
};

async function ArtistHeader({ artistName }: ArtistHeaderProps) {
  const artistData = await getCachedArtist(artistName);

  if (!artistData) return null;

  return (
    <ClientArtistHeader artistData={artistData} originalQuery={artistName} />
  );
}

export default ArtistHeader;
