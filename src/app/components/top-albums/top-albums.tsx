import { getCachedArtist, getTopAlbums } from "@/lib/pollster/artist";
import Album from "../album/album";
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
          <Album key={index} artistName={artistData.name} albumData={album} />
        ))}
      </div>
    </div>
  );
}

export default TopAlbums;
