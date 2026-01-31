import CatalogHeader from "@/app/components/catalog-header/catalog-header";
import CatalogHeaderSkeleton from "@/app/components/catalog-header/skeleton";
import FeaturedIn from "@/app/components/featured-in/featured-in";
import SimilarArtists from "@/app/components/similar-artists/similar-artists";
import SimilarArtistsSkeleton from "@/app/components/similar-artists/skeleton";
import TopAffinitiesSkeleton from "@/app/components/top-affinities/skeleton";
import TopAffinities from "@/app/components/top-affinities/top-affinities";
import TopAlbumsSkeleton from "@/app/components/top-albums/skeleton";
import TopAlbums from "@/app/components/top-albums/top-albums";
import TopListeners from "@/app/components/top-listeners/top-listeners";
import { SITE_NAME } from "@/lib/constants/site-info";
import { api } from "@/lib/convex/_generated/api";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { fetchAction } from "convex/nextjs";
import { redirect } from "next/navigation";
import { Suspense } from "react";

type ArtistProps = {
  params: Promise<{ artist: string }>;
};

export async function generateMetadata({ params }: ArtistProps) {
  const { artist } = await params;

  const token = await convexAuthNextjsToken();
  const artistData = await fetchAction(
    api.pollster.artist.getCachedArtist,
    { artistName: artist },
    { token },
  );

  if (!artistData) redirect("/not-found");

  return {
    title: `${artistData.name} | ${SITE_NAME}`,
    description: `Find more about ${artistData.name} on ${SITE_NAME}.`,
  };
}

async function Artist({ params }: ArtistProps) {
  const { artist } = await params;

  return (
    <main className="px-0 py-8">
      <Suspense fallback={<CatalogHeaderSkeleton itemType="artist" />}>
        <CatalogHeader itemType="artist" artistName={artist} />
      </Suspense>
      <div className="content-wrapper mt-10 px-5 py-0 xl:p-0">
        <div className="flex flex-col gap-8 lg:grid lg:grid-cols-4">
          <div className="flex flex-col gap-10 lg:col-span-3">
            <FeaturedIn category="artist" artistName={artist} />
            <TopListeners category="artist" itemName={artist} />
            <Suspense fallback={<TopAlbumsSkeleton />}>
              <TopAlbums artistName={artist} />
            </Suspense>
          </div>
          <aside className="flex flex-col gap-8 lg:col-span-1">
            <Suspense fallback={<TopAffinitiesSkeleton />}>
              <TopAffinities category="artist" itemName={artist} />
            </Suspense>
            <Suspense fallback={<SimilarArtistsSkeleton />}>
              <SimilarArtists artistName={artist} />
            </Suspense>
          </aside>
        </div>
      </div>
    </main>
  );
}

export default Artist;
