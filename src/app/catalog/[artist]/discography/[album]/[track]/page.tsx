import FeaturedIn from "@/app/components/featured-in/featured-in";
import TopAffinitiesSkeleton from "@/app/components/top-affinities/skeleton";
import TopAffinities from "@/app/components/top-affinities/top-affinities";
import TopListeners from "@/app/components/top-listeners/top-listeners";
import TrackHeaderSkeleton from "@/app/components/track-header/skeleton";
import TrackHeader from "@/app/components/track-header/track-header";
import { siteName } from "@/config";
import { findFirstAlbumByName } from "@/lib/pollster/album";
import { findFirstArtistByName } from "@/lib/pollster/artist";
import { findFirstTrackByName } from "@/lib/pollster/track";
import { redirect } from "next/navigation";
import { Suspense } from "react";

type TrackProps = {
  params: Promise<{ artist: string; album: string; track: string }>;
};

export async function generateMetadata({ params }: TrackProps) {
  const { artist, album, track } = await params;

  const artistData = await findFirstArtistByName(artist);

  if (!artistData) return redirect("/not-found");

  const albumData = await findFirstAlbumByName(artistData, album);

  if (!albumData) return redirect("/not-found");

  const trackData = await findFirstTrackByName(albumData, track);

  if (!trackData) return redirect("/not-found");

  return {
    title: `${trackData.name} — ${artistData.name} | ${siteName}`,
    description: `Find more about ${trackData.name} by ${artistData.name} on ${siteName}.`,
  };
}

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
