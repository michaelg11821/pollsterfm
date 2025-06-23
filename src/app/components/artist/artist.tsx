import { findFirstArtistByName } from "@/lib/pollster/artist";
import { redirect } from "next/navigation";
import ClientArtistHeader from "./client";

type ArtistHeaderProps = {
  artistName: string;
};

async function ArtistHeader({ artistName }: ArtistHeaderProps) {
  const artistData = await findFirstArtistByName(artistName);

  if (!artistData) return redirect("/not-found");

  return <ClientArtistHeader artistData={artistData} />;
}

export default ArtistHeader;
