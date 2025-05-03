"use client";

import { Tag } from "@/lib/types/lastfm";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import styles from "./artist-genres-full.module.css";

type ArtistData = {
  name: string;
  image: string | null;
  genres: string[] | Tag[] | null;
};

type ClientArtistGenresFullProps = {
  artistData: ArtistData;
  originalQuery: string;
};

function ClientArtistGenresFull({
  artistData,
  originalQuery,
}: ClientArtistGenresFullProps) {
  useEffect(() => {
    if (originalQuery !== artistData.name) {
      window.history.replaceState(
        null,
        "",
        `/catalog/${encodeURIComponent(artistData.name)}/genres`
      );
    }
  }, [artistData.name, originalQuery]);

  const genres = artistData.genres?.map((genre, i) => (
    <Link href="#" key={i} className={styles.genreListItem}>
      <span className={styles.genreListItemName}>
        {typeof genre === "string" ? genre : genre.name}
      </span>
    </Link>
  ));

  return (
    <>
      <Link
        href={`/catalog/${encodeURIComponent(artistData.name)}`}
        className={styles.genresBackLink}
      >
        <ArrowLeft className={styles.genresBackLinkIcon} />
        Back to artist
      </Link>
      <div className={styles.genresHeaderRow}>
        <div className={styles.genresHeaderImageWrapper}>
          {artistData.image && (
            <Image
              src={artistData.image}
              alt={artistData.name}
              width={224}
              height={224}
              className={styles.genresHeaderImage}
              priority
            />
          )}
        </div>
        <div>
          <h1 className={styles.genresHeaderArtistName}>{artistData.name}</h1>
          <p className={styles.genresHeaderSubtitle}>All Genres</p>
        </div>
      </div>
      {genres && genres.length > 0 ? (
        <div className={styles.genresMainGrid}>
          <div className={styles.genresListCard}>
            <div className={styles.genresListCardContent}>
              <div className={styles.genresListGrid}>{genres}</div>
            </div>
          </div>
        </div>
      ) : (
        <p>No genres available.</p>
      )}
    </>
  );
}

export default ClientArtistGenresFull;
