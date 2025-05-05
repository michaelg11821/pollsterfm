import ArtistAffinities from "@/app/components/artist-affinities/artist-affinities";
import ArtistHeader from "@/app/components/artist-header/artist-header";
import ClientArtistHeaderSkeleton from "@/app/components/artist-header/skeleton/skeleton";
import FeaturedIn from "@/app/components/featured-in/featured-in";
import SimilarArtists from "@/app/components/similar-artists/similar-artists";
import TopAlbumsSkeleton from "@/app/components/top-albums/skeleton/skeleton";
import TopAlbums from "@/app/components/top-albums/top-albums";
import TopListeners from "@/app/components/top-listeners/top-listeners";
import { getCachedArtist } from "@/lib/pollster/artist";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import styles from "./page.module.css";

type ArtistProps = {
  params: Promise<{ artist: string }>;
};

export async function generateMetadata({ params }: ArtistProps) {
  const { artist } = await params;

  const artistData = await getCachedArtist(artist);

  if (!artistData) redirect("/not-found");

  return {
    title: `${artistData.name} | Pollster.fm`,
    description: `Find more about ${artistData.name} on Pollster.fm.`,
  };
}

async function Artist({ params }: ArtistProps) {
  const { artist } = await params;

  return (
    <main className={styles.pageContainer}>
      <Suspense fallback={<ClientArtistHeaderSkeleton />}>
        <ArtistHeader artistName={artist} />
      </Suspense>
      <div className={styles.contentContainer}>
        <div className={styles.contentGrid}>
          <div className={styles.mainContent}>
            <FeaturedIn />
            <TopListeners />
            <Suspense fallback={<TopAlbumsSkeleton />}>
              <TopAlbums artistName={artist} />
            </Suspense>
          </div>
          <aside className={styles.sidebar}>
            <ArtistAffinities />
            <SimilarArtists />
          </aside>
        </div>
      </div>
    </main>
  );
}

export default Artist;
