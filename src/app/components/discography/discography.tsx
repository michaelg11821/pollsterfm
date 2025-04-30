import Image from "next/image";
import Link from "next/link";

import { Star } from "lucide-react"; // Assuming icon import

import styles from "./discography.module.css";

async function Discography() {
  const topAlbums = [
    {
      id: "a1",
      name: "Neon Dreams Very Long Album Title That Should Be Truncated",
      year: "2023",
      image: null,
      rating: 4.8,
    },
    {
      id: "a2",
      name: "City Lights",
      year: "2021",
      image: null,
      rating: 4.5,
    },
    { id: "a3", name: "First Signal", year: "2019", image: null, rating: 4.7 },
    {
      id: "a4",
      name: "Retro Future",
      year: "2017",
      image: null,
      rating: 4.0,
    },
  ];

  // get from last fm (most plentiful db)

  return (
    <div>
      <div className={styles.albumsSectionHeader}>
        <h2 className={styles.albumsSectionTitle}>Albums</h2>
        <button className={styles.albumsViewAllButton}>View All Albums</button>
      </div>

      <div className={styles.albumsGridContainer}>
        {topAlbums.map((album) => (
          <Link
            href={`/album/${album.id}`}
            key={album.id}
            className={styles.albumCardLink}
          >
            <div className={styles.albumImageWrapper}>
              {album.image && (
                <Image
                  src={album.image}
                  alt={album.name}
                  fill
                  sizes="100%"
                  className={styles.albumImageElement}
                />
              )}
            </div>
            <h3 className={styles.albumNameHeading}>{album.name}</h3>
            <div className={styles.albumMetadata}>
              <span className={styles.albumYearText}>{album.year}</span>
              <div className={styles.albumRatingContainer}>
                <Star className={styles.albumRatingStarIcon} />
                <span className={styles.albumRatingValueText}>
                  {album.rating}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Discography;
