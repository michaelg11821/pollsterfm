import styles from "./skeleton.module.css";

function ClientArtistHeaderSkeleton() {
  return (
    <div className={styles.profileInfoBox}>
      <div className={styles.profileDetailRow}>
        <div className={styles.profilePictureFrame}>
          <div className={styles.profilePictureSkeleton}></div>
        </div>
        <div className={styles.profileDescriptionArea}>
          <div className={styles.profileDescriptionInner}>
            <div className={styles.profileDescriptionInnerWrapper}>
              <div className={styles.profileMetadataLine}>
                <div className={styles.profileArtistTypeBadgeSkeleton}></div>
              </div>
              <div className={styles.profileDisplayNameSkeleton}></div>
              <div className={styles.profileGenreList}>
                <div className={styles.profileGenreTagSkeleton}></div>
                <div className={styles.profileGenreDividerSkeleton}></div>
                <div className={styles.profileGenreTagSkeleton}></div>
                <div className={styles.profileGenreDividerSkeleton}></div>
                <div className={styles.profileGenreTagSkeleton}></div>
              </div>
            </div>
            <div className={styles.profileCreatePollActionSkeleton}></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClientArtistHeaderSkeleton;
