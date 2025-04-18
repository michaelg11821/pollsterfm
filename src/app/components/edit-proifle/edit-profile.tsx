"use client";

import {
  type ChangeEvent,
  FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";

import { Dialog } from "@base-ui-components/react/dialog";
import { AlertDialog } from "@base-ui-components/react/alert-dialog";
import { Camera, SquarePen } from "lucide-react";

import { updateProfile } from "@/lib/data-access/user";
import { fileToBlobUrl } from "../../../lib/utils";
import { headerImageSchema, profileIconSchema } from "../../../lib/schemas";

import type { EditProfileFormData } from "@/lib/types/formData";

import Image from "next/image";

import styles from "./edit-profile.module.css";

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
  const [open, setOpen] = useState<boolean>(false);
  const [headerImgPreview, setHeaderImgPreview] = useState<string | null>(
    headerImage
  );
  const [profileIconPreview, setProfileIconPreview] = useState<string | null>(
    profileIcon
  );
  const [error, setError] = useState<string>("");
  const [errorOpen, setErrorOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState<EditProfileFormData>({
    newHeaderImg: null,
    newProfileIcon: null,
    newName: name,
    newUsername: username,
    newAboutMe: aboutMe,
    oldHeaderImg: headerImage,
    oldProfileIcon: profileIcon,
  });

  const formRef = useRef<HTMLFormElement>(null);
  const headerImgInputRef = useRef<HTMLInputElement>(null);
  const profilePicInputRef = useRef<HTMLInputElement>(null);

  const router = useRouter();

  useEffect(() => {
    if (!formData.newHeaderImg) return;

    const imageUrl = fileToBlobUrl(formData.newHeaderImg);

    setHeaderImgPreview(imageUrl);

    return () => URL.revokeObjectURL(imageUrl);
  }, [formData.newHeaderImg]);

  useEffect(() => {
    if (!formData.newProfileIcon) return;

    const imageUrl = fileToBlobUrl(formData.newProfileIcon);

    setProfileIconPreview(imageUrl);

    return () => URL.revokeObjectURL(imageUrl);
  }, [formData.newProfileIcon]);

  const validateFile = (
    file: File,
    schema: typeof headerImageSchema | typeof profileIconSchema
  ) => {
    const result = schema.safeParse(file);

    if (!result.success) {
      if (schema === headerImageSchema) {
        if (headerImgInputRef.current) {
          headerImgInputRef.current.value = "";
        }
      } else {
        if (profilePicInputRef.current) {
          profilePicInputRef.current.value = "";
        }
      }

      setError(result.error.errors[0].message);
      setErrorOpen(true);

      return false;
    } else {
      setError("");

      return true;
    }
  };

  const handleHeaderImgChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      const isValid = validateFile(file, headerImageSchema);

      if (isValid) setFormData((prev) => ({ ...prev, newHeaderImg: file }));
    }
  };

  const handleProfileIconChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      const isValid = validateFile(file, profileIconSchema);

      if (isValid) setFormData((prev) => ({ ...prev, newProfileIcon: file }));
    }
  };

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, newName: e.target.value }));
  };

  const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, newUsername: e.target.value }));
  };

  const handleAboutMeChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, newAboutMe: e.target.value }));
  };

  const onSubmitChanges = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setOpen(false);

    await updateProfile(username, formData);

    router.refresh();
  };

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(open) => {
        if (!open) {
          setTimeout(() => {
            setHeaderImgPreview(headerImage);
            setProfileIconPreview(profileIcon);

            if (formRef.current) {
              formRef.current.reset();
            }
          }, 500);
        }

        setOpen(open);
      }}
    >
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
          <form
            className={styles.form}
            ref={formRef}
            onSubmit={onSubmitChanges}
          >
            <div className={styles.headerContainer}>
              {headerImgPreview && (
                <Image
                  src={headerImgPreview}
                  alt="Header image preview"
                  fill
                  sizes="100%"
                  className={styles.headerImgPreview}
                />
              )}
              <button className={styles.headerButton}>
                <Camera className={styles.cameraIcon} />
                <input
                  type="file"
                  ref={headerImgInputRef}
                  name="headerImage"
                  aria-label="Upload header image"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(e) => handleHeaderImgChange(e)}
                />
              </button>
              <div className={styles.headerImageOverlay}>Header Image</div>
            </div>
            <div className={styles.profileImages}>
              <div className={styles.avatarContainer}>
                {profileIconPreview && (
                  <Image
                    src={profileIconPreview}
                    alt="Profile picture preview"
                    fill
                    sizes="100%"
                    className={styles.profilePicPreview}
                  />
                )}
                <button className={styles.avatarButton}>
                  <Camera className={styles.cameraIconSmall} />
                  <input
                    type="file"
                    ref={profilePicInputRef}
                    name="profileIcon"
                    aria-label="Upload profile picture"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={(e) => handleProfileIconChange(e)}
                  />
                </button>
              </div>
              <div className={styles.profileInfo}>
                <p className={styles.fontMedium}>Profile Picture</p>
                <p className={styles.recSize}>Recommended size: 400x400px</p>
              </div>
            </div>
            <div className={styles.nameInputContainer}>
              <div className={styles.formRow}>
                <label htmlFor="nameInput" className={styles.label}>
                  Name
                </label>
                <input
                  name="name"
                  id="nameInput"
                  type="text"
                  defaultValue={name ? name : ""}
                  onChange={(e) => handleNameChange(e)}
                  autoComplete="name"
                  className={styles.input}
                />
              </div>
              <div className={styles.formRow}>
                <label htmlFor="usernameInput" className={styles.label}>
                  Username
                </label>
                <div className={styles.relativeFormRow}>
                  <span className={styles.usernamePrefix}>@</span>
                  <input
                    name="username"
                    id="usernameInput"
                    type="text"
                    defaultValue={username}
                    onChange={(e) => handleUsernameChange(e)}
                    autoComplete="username"
                    className={`${styles.input} ${styles.inputUsername}`}
                  />
                </div>
              </div>
            </div>
            <div className={styles.formRow}>
              <label htmlFor="aboutMeTextArea" className={styles.label}>
                About Me
              </label>
              <textarea
                id="aboutMeTextArea"
                name="aboutMe"
                defaultValue={aboutMe ? aboutMe : ""}
                placeholder="Tell us about yourself and your music taste..."
                onChange={(e) => handleAboutMeChange(e)}
                className={styles.textarea}
              />
              <p className={styles.characterLimit}>250 characters max</p>
            </div>
            <div className={styles.Actions}>
              <Dialog.Close className={styles.outlineButton} type="button">
                Cancel
              </Dialog.Close>
              <button className={styles.primaryButton} type="submit">
                Save Changes
              </button>
            </div>
          </form>
        </Dialog.Popup>
      </Dialog.Portal>

      <AlertDialog.Root open={errorOpen} onOpenChange={setErrorOpen}>
        <AlertDialog.Portal>
          <AlertDialog.Popup className={styles.Popup}>
            <AlertDialog.Title className={styles.Title}>
              Error
            </AlertDialog.Title>
            <AlertDialog.Description className={styles.Description}>
              {error}
            </AlertDialog.Description>
            <div className={styles.Actions}>
              <AlertDialog.Close
                className={`${styles.outlineButton} ${styles.errorClose}`}
              >
                OK
              </AlertDialog.Close>
            </div>
          </AlertDialog.Popup>
        </AlertDialog.Portal>
      </AlertDialog.Root>
    </Dialog.Root>
  );
}

export default EditProfile;
