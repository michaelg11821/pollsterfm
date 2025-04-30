import ArtistAffinities from "@/app/components/artist-affinities/artist-affinities";
import ArtistHeader from "@/app/components/artist-header/artist-header";
import Discography from "@/app/components/discography/discography";
import FeaturedIn from "@/app/components/featured-in/featured-in";
import SimilarArtists from "@/app/components/similar-artists/similar-artists";
import TopListeners from "@/app/components/top-listeners/top-listeners";
import { getCachedArtist } from "@/lib/pollster/artist";
import { redirect } from "next/navigation";
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
      <ArtistHeader artistName={artist} />
      <div className={styles.contentContainer}>
        <div className={styles.contentGrid}>
          <aside className={styles.sidebar}>
            <ArtistAffinities />

            <SimilarArtists />
          </aside>
          <div className={styles.mainContent}>
            <Discography />
            <TopListeners />
            <FeaturedIn />
          </div>
        </div>
      </div>
    </main>
  );
}

export default Artist;
