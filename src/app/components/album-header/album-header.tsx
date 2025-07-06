import { api } from "@/lib/convex/_generated/api";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { fetchAction } from "convex/nextjs";
import { redirect } from "next/navigation";
import ClientAlbumHeader from "./client";

type AlbumHeaderProps = {
  artistName: string;
  albumName: string;
};

async function AlbumHeader({ artistName, albumName }: AlbumHeaderProps) {
  const token = await convexAuthNextjsToken();

  const artistData = await fetchAction(
    api.pollster.artist.getCachedArtist,
    { artistName },
    { token },
  );

  if (!artistData) redirect("/not-found");

  const albumData = await fetchAction(
    api.pollster.album.getCachedAlbum,
    { artistName: artistData.name, albumName },
    { token },
  );

  if (!albumData) redirect("/not-found");

  return <ClientAlbumHeader albumData={albumData} />;
}

export default AlbumHeader;
