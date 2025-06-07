import { findFirstArtistByName } from "@/lib/pollster/artist";
import ClientArtistHeader from "./client";

type ArtistHeaderProps = {
  artistName: string;
};

async function ArtistHeader({ artistName }: ArtistHeaderProps) {
  const artistData = await findFirstArtistByName(artistName);

  if (!artistData) return null;

  return <ClientArtistHeader artistData={artistData} />;
}

export default ArtistHeader;
