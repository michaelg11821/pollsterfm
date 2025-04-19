import { redirect } from "next/navigation";
import { enUS } from "date-fns/locale";

import { getProfile } from "@/lib/data-access/user";
import { auth } from "@/lib/auth";

import type { Month } from "date-fns";

import Image from "next/image";

import EditProfile from "../edit-profile/edit-profile";

import { CalendarIcon, EllipsisIcon } from "lucide-react";

import styles from "./profile-header.module.css";

type ProfileHeaderProps = {
  username: string;
};

async function ProfileHeader({ username }: ProfileHeaderProps) {
  const profile = await getProfile(username);

  if (!profile) return redirect("/not-found");

  const session = await auth();
  const loggedInUser = session?.user;

  const joinMonth = profile.createdAt.getMonth() as Month;

  const joinDate = `${enUS.localize.month(
    joinMonth
  )} ${profile.createdAt.getFullYear()}`;

  return (
    <>
      <div className={styles.headerImage}>
        {profile.headerImage && (
          <Image
            src={profile.headerImage}
            alt=""
            fill
            sizes="100%"
            className={styles.headerImageContent}
          />
        )}
      </div>
      <div className={styles.sectionWrapper}>
        <div className={styles.profileInfo}>
          <div className={styles.avatarContainer}>
            <div className={styles.avatar}>
              {profile.image && (
                <Image src={profile.image} alt="" fill sizes="100%" priority />
              )}
            </div>
          </div>
          <div className={styles.profileDetails}>
            <div className={styles.profileHeader}>
              <div>
                <h1 className={styles.displayName}>{profile.name}</h1>
                <p className={styles.username}>@{username}</p>
              </div>
              <div className={styles.actionButtons}>
                {loggedInUser?.username === username ? (
                  <EditProfile
                    headerImage={profile.headerImage}
                    profileIcon={profile.image}
                    name={profile.name}
                    username={username}
                    aboutMe={profile.aboutMe}
                  />
                ) : (
                  <button className={styles.followButton}>Follow</button>
                )}
                <button className={styles.moreButton}>
                  <EllipsisIcon className={styles.profileActions} />
                </button>
              </div>
            </div>
            <p className={styles.aboutMe}>{profile.aboutMe}</p>
            <div className={styles.profileMeta}>
              {profile.createdAt && (
                <div className={styles.metaItem}>
                  <CalendarIcon className={styles.iconSmaller} />
                  <span>Joined {joinDate}</span>
                </div>
              )}
            </div>
            <div className={styles.stats}>
              <a href="#" className={styles.statLink}>
                <span className={styles.statNumber}>33</span>
                <span className={styles.statLabel}>Following</span>
              </a>
              <a href="#" className={styles.statLink}>
                <span className={styles.statNumber}>33</span>
                <span className={styles.statLabel}>Followers</span>
              </a>
              <a href="#" className={styles.statLink}>
                <span className={styles.statNumber}>33</span>
                <span className={styles.statLabel}>Polls Created</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProfileHeader;
