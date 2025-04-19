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
import { Menu } from "@base-ui-components/react/menu";
import { Camera, ImageIcon, SquarePen, Trash2 } from "lucide-react";

import { updateProfile } from "../../../lib/data-access/user";
import { fileToBlobUrl } from "../../../lib/utils";
import { toastManager } from "../../../lib/toast";
import { headerImageSchema, profileIconSchema } from "../../../lib/schemas";

import type { EditProfileFormData } from "../../../lib/types/formData";

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
  const [saving, setSaving] = useState<boolean>(false);
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

      toastManager.add({
        title: "Error",
        description: result.error.errors[0].message,
      });

      return false;
    } else {
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

    setSaving(true);

    const result = await updateProfile(formData);

    if (result.success) {
      setOpen(false);

      router.refresh();

      toastManager.add({
        title: "Success",
        description: "Profile updated successfully.",
      });
    } else {
      console.error("error updating profile:", result.errors);

      result.errors?.forEach(({ message }) => {
        toastManager.add({
          title: "Error",
          description: message,
        });
      });
    }

    setSaving(false);
  };

  const onHeaderImgReset = () => {
    if (headerImgInputRef.current) {
      headerImgInputRef.current.value = "";
    }

    setFormData((prev) => ({ ...prev, newHeaderImg: null }));
    setHeaderImgPreview(null);
  };

  const onProfilePicReset = () => {
    if (headerImgInputRef.current) {
      headerImgInputRef.current.value = "";
    }

    setFormData((prev) => ({ ...prev, newProfileIcon: null }));
    setProfileIconPreview(null);
  };

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(open) => {
        if (!open) {
          setTimeout(() => {
            setHeaderImgPreview(headerImage);
            setProfileIconPreview(profileIcon);
            setFormData({
              newHeaderImg: null,
              newProfileIcon: null,
              newName: name,
              newUsername: username,
              newAboutMe: aboutMe,
              oldHeaderImg: headerImage,
              oldProfileIcon: profileIcon,
            });

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
              <Menu.Root>
                <Menu.Trigger
                  render={
                    <button
                      className={styles.headerButton}
                      aria-label="Upload header image"
                    >
                      <Camera className={styles.cameraIcon} />
                    </button>
                  }
                />
                <Menu.Portal>
                  <Menu.Positioner
                    className={styles.Positioner}
                    sideOffset={2}
                    alignOffset={0}
                  >
                    <Menu.Popup className={styles.MenuPopup}>
                      <Menu.Item
                        className={styles.MenuItem}
                        onClick={() => headerImgInputRef.current?.click()}
                      >
                        <ImageIcon className={styles.imageIcon} />
                        Upload Image
                      </Menu.Item>
                      <Menu.Separator className={styles.Separator} />
                      <Menu.Item
                        className={styles.MenuItem}
                        onClick={() => onHeaderImgReset()}
                        data-testid="header-remove"
                      >
                        <Trash2 className={styles.trashIcon} />
                        Remove Image
                      </Menu.Item>
                    </Menu.Popup>
                  </Menu.Positioner>
                </Menu.Portal>
                <input
                  type="file"
                  ref={headerImgInputRef}
                  name="headerImage"
                  accept="image/jpeg,image/png,image/webp"
                  className="visually-hidden"
                  data-testid="header-upload"
                  onChange={handleHeaderImgChange}
                />
              </Menu.Root>
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
                <Menu.Root>
                  <Menu.Trigger
                    render={
                      <button
                        className={styles.avatarButton}
                        aria-label="Upload profile picture"
                      >
                        <Camera className={styles.cameraIconSmall} />
                      </button>
                    }
                  />
                  <Menu.Portal>
                    <Menu.Positioner
                      className={styles.Positioner}
                      sideOffset={2}
                      alignOffset={-20}
                    >
                      <Menu.Popup className={styles.MenuPopup}>
                        <Menu.Item
                          className={styles.MenuItem}
                          onClick={() => profilePicInputRef.current?.click()}
                        >
                          <ImageIcon className={styles.imageIcon} />
                          Upload Image
                        </Menu.Item>
                        <Menu.Separator className={styles.Separator} />
                        <Menu.Item
                          className={styles.MenuItem}
                          onClick={() => onProfilePicReset()}
                          data-testid="profile-picture-remove"
                        >
                          <Trash2 className={styles.trashIcon} />
                          Remove Image
                        </Menu.Item>
                      </Menu.Popup>
                    </Menu.Positioner>
                  </Menu.Portal>
                  <input
                    type="file"
                    ref={profilePicInputRef}
                    title=""
                    name="profileIcon"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    className="visually-hidden"
                    data-testid="profile-picture-upload"
                    onChange={handleProfileIconChange}
                  />
                </Menu.Root>
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
                  minLength={1}
                  maxLength={15}
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
                    minLength={3}
                    maxLength={25}
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
                maxLength={250}
                defaultValue={aboutMe ? aboutMe : ""}
                placeholder="Tell us about yourself and your music taste..."
                onChange={(e) => handleAboutMeChange(e)}
                className={styles.textarea}
              />
              <p className={styles.characterLimit}>250 characters max</p>
            </div>
            <div className={styles.Actions}>
              <Dialog.Close
                className={styles.outlineButton}
                type="button"
                disabled={saving}
              >
                Cancel
              </Dialog.Close>
              <button
                className={styles.primaryButton}
                type="submit"
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default EditProfile;
