"use client";

import { Tag } from "@/lib/types/lastfm";
import Image from "next/image";
import Link from "next/link";
import { Fragment, useEffect } from "react";
import styles from "./artist-header.module.css";

type ArtistData = {
  name: string;
  image: string | null;
  genres: string[] | Tag[] | null;
};

type ClientArtistHeaderProps = {
  artistData: ArtistData;
  originalQuery: string;
};

function ClientArtistHeader({
  artistData,
  originalQuery,
}: ClientArtistHeaderProps) {
  useEffect(() => {
    if (originalQuery !== artistData.name) {
      window.history.replaceState(
        null,
        "",
        `/catalog/${encodeURIComponent(artistData.name)}`
      );
    }
  }, [artistData.name, originalQuery]);

  const genres = artistData.genres?.slice(0, 5).map((genre, i) => (
    <Fragment key={i}>
      <span className={styles.profileGenreTag}>
        {typeof genre === "string" ? genre : genre.name}
      </span>
      {artistData.genres && i < artistData.genres.length - 1 ? (
        <span className={styles.profileGenreDivider}>•</span>
      ) : (
        ""
      )}
    </Fragment>
  ));

  return (
    <div className={styles.profileInfoBox}>
      <div className={styles.profileDetailRow}>
        <div className={styles.profilePictureFrame}>
          {artistData.image && (
            <Image
              src={artistData.image}
              alt={artistData.name}
              width={224}
              height={224}
              className={styles.profilePicture}
              priority
            />
          )}
        </div>
        <div className={styles.profileDescriptionArea}>
          <div className={styles.profileDescriptionInner}>
            <div className={styles.profileDescriptionInnerWrapper}>
              <div className={styles.profileMetadataLine}>
                <span className={styles.profileArtistTypeBadge}>Artist</span>
              </div>
              <h1 className={styles.profileDisplayName}>{artistData.name}</h1>
              {genres && (
                <div className={styles.profileGenreList}>
                  {genres} ...
                  <Link
                    href={`/catalog/${encodeURIComponent(artistData.name)}/genres`}
                    className={styles.moreGenres}
                  >
                    more
                  </Link>
                </div>
              )}
            </div>
            <button className={styles.profileCreatePollAction}>
              Create Poll
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClientArtistHeader;
