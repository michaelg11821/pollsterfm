import Genres from "@/app/components/genres/genres";
import GenresSkeleton from "@/app/components/genres/skeleton";
import { api } from "@/lib/convex/_generated/api";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { fetchAction } from "convex/nextjs";
import { redirect } from "next/navigation";
import { Suspense } from "react";

type ArtistGenresProps = {
  params: Promise<{ artist: string }>;
};

export async function generateMetadata({ params }: ArtistGenresProps) {
  const { artist } = await params;

  const token = await convexAuthNextjsToken();
  const artistData = await fetchAction(
    api.pollster.artist.getCachedArtist,
    { artistName: artist },
    { token },
  );

  if (!artistData) redirect("/not-found");

  return {
    title: `Genres for ${artistData.name} | Pollster.fm`,
    description: `Find more about ${artistData.name} on Pollster.fm.`,
  };
}

async function ArtistGenres({ params }: ArtistGenresProps) {
  const { artist } = await params;

  return (
    <div className="content-wrapper px-5 py-6">
      <Suspense fallback={<GenresSkeleton />}>
        <Genres category="artist" itemName={artist} />
      </Suspense>
    </div>
  );
}

export default ArtistGenres;
