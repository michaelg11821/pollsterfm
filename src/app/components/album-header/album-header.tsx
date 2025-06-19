import { findFirstAlbumByName } from "@/lib/pollster/album";
import { findFirstArtistByName } from "@/lib/pollster/artist";
import ClientAlbumHeader from "./client";

type AlbumHeaderProps = {
  artistName: string;
  albumName: string;
};

async function AlbumHeader({ artistName, albumName }: AlbumHeaderProps) {
  const artistData = await findFirstArtistByName(artistName);

  if (!artistData) return null;

  const albumData = await findFirstAlbumByName(artistData, albumName);

  if (!albumData) return null;

  return (
    <ClientAlbumHeader artistName={artistData.name} albumData={albumData} />
  );
}

export default AlbumHeader;
