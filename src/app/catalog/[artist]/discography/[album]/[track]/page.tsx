import FeaturedIn from "@/app/components/featured-in/featured-in";
import TopAffinitiesSkeleton from "@/app/components/top-affinities/skeleton";
import TopAffinities from "@/app/components/top-affinities/top-affinities";
import TopListeners from "@/app/components/top-listeners/top-listeners";
import TrackHeaderSkeleton from "@/app/components/track-header/skeleton";
import TrackHeader from "@/app/components/track-header/track-header";
import { Suspense } from "react";

type TrackProps = {
  params: Promise<{ artist: string; album: string; track: string }>;
};

async function Track({ params }: TrackProps) {
  const { artist, album, track } = await params;

  return (
    <main className="px-0 py-8">
      <Suspense fallback={<TrackHeaderSkeleton />}>
        <TrackHeader artistName={artist} albumName={album} trackName={track} />
      </Suspense>
      <div className="content-wrapper mt-10 px-5 py-0 xl:p-0">
        <div className="flex flex-col gap-8 lg:grid lg:grid-cols-4">
          <div className="space-y-10 lg:col-span-3">
            <TopListeners category="track" itemName={track} />
            <FeaturedIn category="track" itemName={track} />
          </div>
          <aside className="flex flex-col gap-8 lg:col-span-1">
            <Suspense fallback={<TopAffinitiesSkeleton />}>
              <TopAffinities category="track" itemName={track} />
            </Suspense>
          </aside>
        </div>
      </div>
    </main>
  );
}

export default Track;
