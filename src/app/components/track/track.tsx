import { randomUUID } from "crypto";

import { dateStringDistanceToNow } from "@/lib/utils";

import type { Album } from "@/lib/types/spotify";

import Image from "next/image";
import Link from "next/link";

import styles from "./track.module.css";

interface TrackProps {
  album: Album;
  trackTitle: string;
  /**
   * A string in the ISO 8601 format.
   */
  playedAt: string;
}

function Track({ album, trackTitle, playedAt }: TrackProps) {
  return (
    <Link className={styles.trackItem} href="#">
      <div className={styles.trackImageContainer}>
        <Image src={album.images[0].url} alt="" fill sizes="100%" priority />
      </div>
      <div className={styles.trackInfo}>
        <h4 className={styles.trackTitle}>{trackTitle}</h4>
        <p className={styles.trackDetails}>
          {album.artists.map(({ name }, index) => {
            if (index !== album.artists.length - 1) {
              return <span key={randomUUID()}>{name}, </span>;
            }

            return <span key={randomUUID()}>{name}</span>;
          })}{" "}
          <span> • {album.name}</span>
        </p>
      </div>
      <div className={styles.trackTime}>
        {dateStringDistanceToNow(playedAt)}
      </div>
    </Link>
  );
}

export default Track;
