import ArtistHeader from "@/app/components/artist/artist";
import ArtistHeaderSkeleton from "@/app/components/artist/skeleton";
import FeaturedIn from "@/app/components/featured-in/featured-in";
import TopAffinities from "@/app/components/top-affinities/top-affinities";
import TopListeners from "@/app/components/top-listeners/top-listeners";
// import SimilarArtists from "@/app/components/similar-artists/similar-artists";
// import TopAlbumsSkeleton from "@/app/components/top-albums/skeleton/skeleton";
// import TopAlbums from "@/app/components/top-albums/top-albums";
import TopAffinitiesSkeleton from "@/app/components/top-affinities/skeleton";
import { siteName } from "@/config";
import { findFirstArtistByName } from "@/lib/pollster/artist";
import { redirect } from "next/navigation";
import { Suspense } from "react";

type ArtistProps = {
  params: Promise<{ artist: string }>;
};

export async function generateMetadata({ params }: ArtistProps) {
  const { artist } = await params;

  const artistData = await findFirstArtistByName(artist);

  if (!artistData) redirect("/not-found");

  return {
    title: `${artistData.name} | ${siteName}`,
    description: `Find more about ${artistData.name} on ${siteName}.`,
  };
}

async function Artist({ params }: ArtistProps) {
  const { artist } = await params;

  return (
    <main className="px-0 py-8">
      <Suspense fallback={<ArtistHeaderSkeleton />}>
        <ArtistHeader artistName={artist} />
      </Suspense>
      <div className="content-wrapper mt-10 px-5 py-0 xl:p-0">
        <div className="flex flex-col gap-8 lg:grid lg:grid-cols-4">
          <div className="flex flex-col gap-10 lg:col-span-3">
            <FeaturedIn category="artist" itemName={artist} />
            <TopListeners category="artist" itemName={artist} />
            {/* 
            <Suspense fallback={<TopAlbumsSkeleton />}>
              <TopAlbums artistName={artist} />
            </Suspense> */}
          </div>
          <aside className="flex flex-col gap-8 lg:col-span-1">
            <Suspense fallback={<TopAffinitiesSkeleton />}>
              <TopAffinities category="artist" itemName={artist} />
            </Suspense>
            {/* <SimilarArtists /> */}
          </aside>
        </div>
      </div>
    </main>
  );
}

export default Artist;
