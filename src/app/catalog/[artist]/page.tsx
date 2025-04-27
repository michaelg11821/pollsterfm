import { type Metadata } from "next";

import ArtistAffinities from "@/app/components/artist-affinities/artist-affinities";
import ArtistHeader from "@/app/components/artist-header/artist-header";
import Discography from "@/app/components/discography/discography";
import FeaturedIn from "@/app/components/featured-in/featured-in";
import SimilarArtists from "@/app/components/similar-artists/similar-artists";
import TopListeners from "@/app/components/top-listeners/top-listeners";
import styles from "./page.module.css";

type ArtistProps = {
  params: Promise<{ artist: string }>;
};

export const metadata: Metadata = {
  title: "(artist) | Pollster.fm",
  description: "Find more about (artist) on Pollster.fm.",
};

async function Artist({ params }: ArtistProps) {
  const { artist } = await params;

  // if (!artist) return redirect("/not-found");

  // look for img on spotify first

  // make ALL of these components more responsive

  return (
    <main className={styles.pageContainer}>
      <ArtistHeader />
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
