"use client";

import { Tag } from "@/lib/types/lastfm";
import Image from "next/image";
import { useEffect } from "react";
import styles from "./artist-header.module.css";

type ArtistData = {
  name: string;
  image: string | null;
  genres: string[] | Tag[] | null;
};

type ClientProps = {
  artistData: ArtistData;
  originalQuery: string;
};

function ClientArtistHeader({ artistData, originalQuery }: ClientProps) {
  useEffect(() => {
    if (originalQuery !== artistData.name) {
      window.history.replaceState(
        null,
        "",
        `/catalog/${encodeURIComponent(artistData.name)}`
      );
    }
  }, [artistData.name, originalQuery]);

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
            <div>
              <div className={styles.profileMetadataLine}>
                <span className={styles.profileArtistTypeBadge}>Artist</span>
              </div>
              <h1 className={styles.profileDisplayName}>{artistData.name}</h1>
              {artistData.genres && (
                <div className={styles.profileGenreList}>
                  {artistData.genres.map((genre, i) => (
                    <span key={i} className={styles.profileGenreTag}>
                      {typeof genre === "string" ? genre : genre.name}
                      {i < artistData.genres!.length - 1 && (
                        <span className={styles.profileGenreDivider}>•</span>
                      )}
                    </span>
                  ))}
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
