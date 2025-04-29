import Image from "next/image";

import styles from "./artist-header.module.css";

async function ArtistHeader() {
  const artistData = {
    name: "Radiohead",
    image: "/placeholder.svg?height=500&width=500&text=Radiohead",
    coverImage: null,
    genres: ["Alternative Rock", "Art Rock", "Experimental Rock", "Electronic"],
  };

  return (
    <div className={styles.profileHeaderSection}>
      <div className={styles.profileInfoBox}>
        <div className={styles.profileDetailRow}>
          <div className={styles.profilePictureFrame}>
            <Image
              src={artistData.image || "/placeholder-artist.svg"}
              alt={artistData.name}
              width={224}
              height={224}
              className={styles.profilePicture}
              priority
            />
          </div>
          <div className={styles.profileDescriptionArea}>
            <div className={styles.profileDescriptionInner}>
              <div>
                <div className={styles.profileMetadataLine}>
                  <span className={styles.profileArtistTypeBadge}>Artist</span>
                </div>
                <h1 className={styles.profileDisplayName}>{artistData.name}</h1>
                <div className={styles.profileGenreList}>
                  {(artistData.genres || []).map((genre, i) => (
                    <span key={i} className={styles.profileGenreTag}>
                      {genre}
                      {i < artistData.genres.length - 1 && (
                        <span className={styles.profileGenreDivider}>•</span>
                      )}
                    </span>
                  ))}
                </div>
              </div>
              <button className={styles.profileCreatePollAction}>
                Create Poll
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ArtistHeader;
