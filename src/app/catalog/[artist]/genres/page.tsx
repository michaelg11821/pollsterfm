import ArtistGenresFull from "@/app/components/artist-genres-full/artist-genres-full";
import ArtistGenresFullSkeleton from "@/app/components/artist-genres-full/skeleton/skeleton";
import { getCachedArtist } from "@/lib/pollster/artist";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import styles from "./page.module.css";

type ArtistGenresProps = {
  params: Promise<{ artist: string }>;
};

export async function generateMetadata({ params }: ArtistGenresProps) {
  const { artist } = await params;

  const artistData = await getCachedArtist(artist);

  if (!artistData) redirect("/not-found");

  return {
    title: `Genres for ${artistData.name} | Pollster.fm`,
    description: `Find more about ${artistData.name} on Pollster.fm.`,
  };
}

async function ArtistGenres({ params }: ArtistGenresProps) {
  const { artist } = await params;

  return (
    <div className={styles.genresPageContainer}>
      <Suspense fallback={<ArtistGenresFullSkeleton />}>
        <ArtistGenresFull artistName={artist} />
      </Suspense>
    </div>
  );
}

export default ArtistGenres;
