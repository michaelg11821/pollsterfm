import Image from "next/image";
import Link from "next/link";

import { Star } from "lucide-react"; // Assuming icon import

import { getCachedArtist, getTopAlbums } from "@/lib/pollster/artist";
import styles from "./top-albums.module.css";

type TopAlbumsProps = {
  artistName: string;
};

async function TopAlbums({ artistName }: TopAlbumsProps) {
  const artistData = await getCachedArtist(artistName);

  if (!artistData) return null;

  const topAlbumsData = await getTopAlbums(artistData);

  if (!topAlbumsData) return null;

  return (
    <div>
      <div className={styles.albumsSectionHeader}>
        <h2 className={styles.albumsSectionTitle}>Top Albums</h2>
        <button className={styles.albumsViewAllButton}>View Discography</button>
      </div>

      <div className={styles.albumsGridContainer}>
        {topAlbumsData.map((album, index) => (
          <Link
            href={`/catalog/${artistData.name}/discography/${encodeURIComponent(album.name)}`}
            key={index}
            className={styles.albumCardLink}
          >
            <div className={styles.albumImageWrapper}>
              <Image
                src={album.images[0].url}
                alt={album.name}
                fill
                sizes="100%"
                className={styles.albumImageElement}
              />
            </div>
            <h3 className={styles.albumNameHeading}>{album.name}</h3>
            <div className={styles.albumMetadata}>
              <span className={styles.albumYearText}>{album.releaseDate}</span>
              <div className={styles.albumRatingContainer}>
                <Star className={styles.albumRatingStarIcon} />
                <span className={styles.albumRatingValueText}>5</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default TopAlbums;
