"use client";

import { Dialog } from "@base-ui-components/react/dialog";
import { Camera, SquarePen } from "lucide-react";

import styles from "./edit-profile.module.css";
import Image from "next/image";

type EditProfileProps = {
  headerImage: string | null;
  profileIcon: string | null;
  name: string | null;
  username: string;
  aboutMe: string | null;
};

function EditProfile({
  headerImage,
  profileIcon,
  name,
  username,
  aboutMe,
}: EditProfileProps) {
  return (
    <Dialog.Root>
      <Dialog.Trigger
        render={
          <button className={styles.editProfileBtn}>
            <SquarePen className={styles.editProfileIcon} />
            Edit Profile
          </button>
        }
      />
      <Dialog.Portal keepMounted>
        <Dialog.Backdrop className={styles.Backdrop} />
        <Dialog.Popup className={styles.Popup}>
          <Dialog.Title className={styles.Title}>Edit Profile</Dialog.Title>
          <Dialog.Description className={styles.Description}>
            Update your profile information and customize your presence on
            Pollster.
          </Dialog.Description>
          <form className={styles.form}>
            <div className={styles.headerContainer}>
              <Image src={headerImage!} alt="Header image" fill sizes="100%" />
              <button className={styles.headerButton}>
                <Camera className={styles.cameraIcon} />
              </button>
              <div className={styles.headerImageOverlay}>Header Image</div>
            </div>
            <div className={styles.profileImages}>
              <div className={styles.avatarContainer}>
                <Image
                  src={profileIcon!}
                  alt="Profile icon"
                  fill
                  sizes="100%"
                />
                <button className={styles.avatarButton}>
                  <Camera className={styles.cameraIconSmall} />
                </button>
              </div>
              <div className={styles.profileInfo}>
                <p className={styles.fontMedium}>Profile Picture</p>
                <p className={styles.recSize}>Recommended size: 400x400px</p>
              </div>
            </div>
            <div className={styles.nameInputContainer}>
              <div className={styles.formRow}>
                <label htmlFor="name" className={styles.label}>
                  Display Name
                </label>
                <input
                  id="name"
                  defaultValue={name ? name : ""}
                  className={styles.input}
                />
              </div>
              <div className={styles.formRow}>
                <label htmlFor="username" className={styles.label}>
                  Username
                </label>
                <div className={styles.relativeFormRow}>
                  <span className={styles.usernamePrefix}>@</span>
                  <input
                    id="username"
                    defaultValue={username}
                    className={`${styles.input} ${styles.inputUsername}`}
                  />
                </div>
              </div>
            </div>
            <div className={styles.formRow}>
              <label htmlFor="aboutMe" className={styles.label}>
                About Me
              </label>
              <textarea
                id="aboutMe"
                defaultValue={aboutMe ? aboutMe : ""}
                className={styles.textarea}
                placeholder="Tell us about yourself and your music taste..."
              />
              <p className={styles.characterLimit}>250 characters max</p>
            </div>
          </form>
          <div className={styles.Actions}>
            <Dialog.Close className={styles.outlineButton}>Cancel</Dialog.Close>
            <button className={styles.primaryButton}>Save Changes</button>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default EditProfile;
