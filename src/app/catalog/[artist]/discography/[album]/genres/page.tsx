import Genres from "@/app/components/genres/genres";
import GenresSkeleton from "@/app/components/genres/skeleton";
import { api } from "@/lib/convex/_generated/api";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { fetchAction } from "convex/nextjs";
import { redirect } from "next/navigation";
import { Suspense } from "react";

type AlbumGenresPageProps = {
  params: Promise<{ artist: string; album: string }>;
};

export async function generateMetadata({ params }: AlbumGenresPageProps) {
  const { artist, album } = await params;

  const token = await convexAuthNextjsToken();

  const artistData = await fetchAction(
    api.pollster.artist.getCachedArtist,
    { artistName: artist },
    { token },
  );

  if (!artistData) redirect("/not-found");

  const albumData = await fetchAction(
    api.pollster.album.getCachedAlbum,
    { artistName: artistData.name, albumName: album },
    { token },
  );

  if (!albumData) redirect("/not-found");

  return {
    title: `Genres for ${albumData.name} — ${artistData.name} | Pollster.fm`,
    description: `Find more about ${albumData.name} on Pollster.fm.`,
  };
}

async function AlbumGenresPage({ params }: AlbumGenresPageProps) {
  const { artist, album } = await params;

  return (
    <div className="content-wrapper px-5 py-6">
      <Suspense fallback={<GenresSkeleton />}>
        <Genres artistName={artist} albumName={album} />
      </Suspense>
    </div>
  );
}

export default AlbumGenresPage;
