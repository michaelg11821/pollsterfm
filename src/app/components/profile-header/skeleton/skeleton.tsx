import { CalendarIcon } from "lucide-react";

import styles from "./skeleton.module.css";

function ProfileHeaderSkeleton() {
  return (
    <>
      <div className={styles.headerImage}>
        <div className={styles.headerImageSkeleton}></div>
      </div>

      <div className={styles.sectionWrapper}>
        <div className={styles.profileInfo}>
          <div className={styles.avatarContainer}>
            <div className={styles.avatarSkeleton}></div>
          </div>

          <div className={styles.profileDetails}>
            <div className={styles.profileHeader}>
              <div>
                <div className={styles.displayNameSkeleton}></div>
                <div className={styles.usernameSkeleton}></div>
              </div>
              <div className={styles.actionButtons}>
                <div className={styles.buttonSkeleton}></div>
                <div className={styles.moreButtonSkeleton}></div>
              </div>
            </div>
            <div className={styles.aboutMeSkeleton}></div>
            <div className={styles.profileMeta}>
              <div className={styles.metaItem}>
                <CalendarIcon className={styles.iconSmaller} />
                <div className={styles.metaTextSkeleton}></div>
              </div>
            </div>
            <div className={styles.stats}>
              <div className={styles.statSkeleton}></div>
              <div className={styles.statSkeleton}></div>
              <div className={styles.statSkeleton}></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProfileHeaderSkeleton;
