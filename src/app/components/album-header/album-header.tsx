import { findFirstAlbumByName } from "@/lib/pollster/album";
import { findFirstArtistByName } from "@/lib/pollster/artist";
import { redirect } from "next/navigation";
import ClientAlbumHeader from "./client";

type AlbumHeaderProps = {
  artistName: string;
  albumName: string;
};

async function AlbumHeader({ artistName, albumName }: AlbumHeaderProps) {
  const artistData = await findFirstArtistByName(artistName);

  if (!artistData) return redirect("/not-found");

  const albumData = await findFirstAlbumByName(artistData, albumName);

  if (!albumData) return redirect("/not-found");

  return <ClientAlbumHeader albumData={albumData} />;
}

export default AlbumHeader;
