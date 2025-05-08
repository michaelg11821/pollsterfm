import Link from "next/link";

import type { TopAlbum } from "@/lib/types/pollster";
import { Star } from "lucide-react";

import Image from "next/image";

import styles from "./album.module.css";

type AlbumProps = {
  artistName: string;
  albumData: TopAlbum; // add other types
};

function Album({ artistName, albumData }: AlbumProps) {
  return (
    <Link
      href={`/catalog/${artistName}/discography/${encodeURIComponent(albumData.name)}`}
      className={styles.albumCardLink}
    >
      <div className={styles.albumImageWrapper}>
        <Image
          src={albumData.images[0].url}
          alt={albumData.name}
          fill
          sizes="100%"
          className={styles.albumImageElement}
        />
      </div>
      <h3 className={styles.albumNameHeading}>{albumData.name}</h3>
      <div className={styles.albumMetadata}>
        <span className={styles.albumYearText}>{albumData.releaseDate}</span>
        <div className={styles.albumRatingContainer}>
          <Star className={styles.albumRatingStarIcon} />
          <span className={styles.albumRatingValueText}>5</span>
        </div>
      </div>
    </Link>
  );
}

export default Album;
