import { api } from "@/lib/convex/_generated/api";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { fetchAction } from "convex/nextjs";
import { redirect } from "next/navigation";
import ClientAlbumGenres from "./client";

type AlbumGenresProps = {
  artistName: string;
  albumName: string;
};

async function AlbumGenres({ artistName, albumName }: AlbumGenresProps) {
  const token = await convexAuthNextjsToken();

  const artistData = await fetchAction(
    api.pollster.artist.getCachedArtist,
    { artistName },
    { token },
  );

  if (!artistData) return redirect("/not-found");

  const albumData = await fetchAction(
    api.pollster.album.getCachedAlbum,
    { artistName: artistData.name, albumName },
    { token },
  );

  if (!albumData) redirect("/not-found");

  return <ClientAlbumGenres albumData={albumData} />;
}

export default AlbumGenres;
