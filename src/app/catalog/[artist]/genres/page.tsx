import Genres from "@/app/components/genres/genres";
import GenresSkeleton from "@/app/components/genres/skeleton";
import { SITE_NAME } from "@/lib/constants/site-info";
import { api } from "@/lib/convex/_generated/api";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { fetchAction } from "convex/nextjs";
import { redirect } from "next/navigation";
import { Suspense } from "react";

type ArtistGenresPageProps = {
  params: Promise<{ artist: string }>;
};

export async function generateMetadata({ params }: ArtistGenresPageProps) {
  const { artist } = await params;

  const token = await convexAuthNextjsToken();
  const artistData = await fetchAction(
    api.pollster.artist.getCachedArtist,
    { artistName: artist },
    { token },
  );

  if (!artistData) redirect("/not-found");

  return {
    title: `Genres for ${artistData.name} | ${SITE_NAME}`,
    description: `Find more about ${artistData.name} on ${SITE_NAME}.`,
  };
}

async function ArtistGenresPage({ params }: ArtistGenresPageProps) {
  const { artist } = await params;

  return (
    <div className="content-wrapper px-5 py-6">
      <Suspense fallback={<GenresSkeleton />}>
        <Genres artistName={artist} />
      </Suspense>
    </div>
  );
}

export default ArtistGenresPage;
