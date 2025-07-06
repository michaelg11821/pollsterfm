import Genres from "@/app/components/genres/genres";
import GenresSkeleton from "@/app/components/genres/skeleton";
import { api } from "@/lib/convex/_generated/api";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { fetchAction } from "convex/nextjs";
import { redirect } from "next/navigation";
import { Suspense } from "react";

type TrackGenresPageProps = {
  params: Promise<{ artist: string; album: string; track: string }>;
};

export async function generateMetadata({ params }: TrackGenresPageProps) {
  const { artist, album, track } = await params;

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

  const trackData = await fetchAction(
    api.pollster.track.getCachedTrack,
    {
      artistName: artistData.name,
      albumName: albumData.name,
      albumImage: albumData.image,
      trackName: track,
    },
    { token },
  );

  if (!trackData) redirect("/not-found");

  return {
    title: `Genres for ${trackData.name} — ${artistData.name} | Pollster.fm`,
    description: `Find more about ${trackData.name} by ${artistData.name} on Pollster.fm.`,
  };
}

async function TrackGenresPage({ params }: TrackGenresPageProps) {
  const { artist, album, track } = await params;

  return (
    <div className="content-wrapper px-5 py-6">
      <Suspense fallback={<GenresSkeleton />}>
        <Genres artistName={artist} albumName={album} trackName={track} />
      </Suspense>
    </div>
  );
}

export default TrackGenresPage;
