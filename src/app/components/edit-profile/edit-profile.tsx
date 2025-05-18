"use client";

import { useRouter } from "next/navigation";

import {
  type ChangeEvent,
  type FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

import { SquarePen } from "lucide-react";

import { updateProfile } from "@/lib/data-access/user/update";
import { headerImageSchema, profileIconSchema } from "@/lib/schemas/user";
import { toastManager } from "@/lib/toast";
import { fileToUint8Array, uInt8ArrayToBlobUrl } from "@/lib/utils";

import type { EditProfileFormData, FileBytes } from "@/lib/types/formData";

import { siteName } from "@/config";
import Image from "next/image";
import { Button, buttonVariants } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

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
    headerImage,
  );
  const [profileIconPreview, setProfileIconPreview] = useState<string | null>(
    profileIcon,
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
    deleteHeaderImg: false,
    deleteProfileIcon: false,
  });

  const formRef = useRef<HTMLFormElement>(null);
  const headerImgInputRef = useRef<HTMLInputElement>(null);
  const profilePicInputRef = useRef<HTMLInputElement>(null);

  const router = useRouter();

  useEffect(() => {
    if (!formData.newHeaderImg) return;

    const imageUrl = uInt8ArrayToBlobUrl(formData.newHeaderImg.bytes);

    setHeaderImgPreview(imageUrl);

    return () => URL.revokeObjectURL(imageUrl);
  }, [formData.newHeaderImg]);

  useEffect(() => {
    if (!formData.newProfileIcon) return;

    const imageUrl = uInt8ArrayToBlobUrl(formData.newProfileIcon.bytes);

    setProfileIconPreview(imageUrl);

    return () => URL.revokeObjectURL(imageUrl);
  }, [formData.newProfileIcon]);

  const validateFileBytes = (
    fileBytes: FileBytes,
    schema: typeof headerImageSchema | typeof profileIconSchema,
  ) => {
    const result = schema.safeParse(fileBytes);

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

  const handleHeaderImgChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      const bytes = await fileToUint8Array(file);
      const fileBytesObj = { bytes, name: file.name, mimeType: file.type };

      const isValid = validateFileBytes(fileBytesObj, headerImageSchema);

      if (isValid)
        setFormData((prev) => ({
          ...prev,
          newHeaderImg: fileBytesObj,
        }));
    }
  };

  const handleProfileIconChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      const bytes = await fileToUint8Array(file);
      const fileBytesObj = { bytes, name: file.name, mimeType: file.type };

      const isValid = validateFileBytes(fileBytesObj, profileIconSchema);

      if (isValid)
        setFormData((prev) => ({
          ...prev,
          newProfileIcon: fileBytesObj,
        }));
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

      router.push(`/user/${formData.newUsername}`);

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

    setFormData((prev) => ({
      ...prev,
      newHeaderImg: null,
      deleteHeaderImg: true,
    }));
    setHeaderImgPreview(null);
  };

  const onProfileIconReset = () => {
    if (headerImgInputRef.current) {
      headerImgInputRef.current.value = "";
    }

    setFormData((prev) => ({
      ...prev,
      newProfileIcon: null,
      deleteProfileIcon: true,
    }));
    setProfileIconPreview(null);
  };

  return (
    <Dialog
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
              deleteHeaderImg: false,
              deleteProfileIcon: false,
            });

            if (formRef.current) {
              formRef.current.reset();
            }
          }, 500);
        }

        setOpen(open);
      }}
    >
      <DialogTrigger
        render={
          <Button
            variant="default"
            size="default"
            className="bg-primary cursor-pointer px-4 py-1.5"
          >
            <SquarePen className="h-4 w-4" />
            Edit Profile
          </Button>
        }
      />
      <DialogContent className="w-120">
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogDescription>
          Update your profile information and customize your presence on
          {` ${siteName}`}.
        </DialogDescription>
        <form
          className="flex flex-col gap-5 pt-7.5"
          ref={formRef}
          onSubmit={onSubmitChanges}
        >
          <div className="bg-background/50 relative h-26 w-full overflow-hidden rounded-[0.5rem]">
            {headerImgPreview && (
              <Image
                src={headerImgPreview}
                alt="Header image preview"
                fill
                sizes="100%"
                className="object-cover"
              />
            )}
            {/* <Menu.Root>
              <Menu.Trigger
                render={
                  <button
                    className="absolute top-2 right-2 inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-none bg-black/60 p-0 text-white transition-[background-color]"
                    aria-label="Upload header image"
                  >
                    <Camera className="h-4 w-4" />
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
                      <ImageIcon className="h-5 w-5" />
                      Upload Image
                    </Menu.Item>
                    <Menu.Separator className={styles.Separator} />
                    <Menu.Item
                      className={styles.MenuItem}
                      onClick={() => onHeaderImgReset()}
                      data-testid="header-remove"
                    >
                      <Trash2 className="h-5 w-5" />
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
            </Menu.Root> */}
            <div className="absolute bottom-2 left-4 rounded-lg bg-black/60 px-2 py-1 text-xs text-white/80">
              Header Image
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-background/5 relative h-20 w-20 rounded-full border-2">
              {profileIconPreview && (
                <Image
                  src={profileIconPreview}
                  alt="Profile picture preview"
                  fill
                  sizes="100%"
                  className="rounded-full object-cover"
                />
              )}
              {/* <Menu.Root>
                <Menu.Trigger
                  render={
                    <button
                      className="absolute right-0 bottom-0 inline-flex h-6 w-6 cursor-pointer items-center justify-center rounded-full border-none bg-black/60 p-0 text-white transition-[background-color]"
                      aria-label="Upload profile picture"
                    >
                      <Camera className="h-3 w-3" />
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
                        <ImageIcon className="h-5 w-5" />
                        Upload Image
                      </Menu.Item>
                      <Menu.Separator className={styles.Separator} />
                      <Menu.Item
                        className={styles.MenuItem}
                        onClick={() => onProfileIconReset()}
                        data-testid="profile-picture-remove"
                      >
                        <Trash2 className="h-5 w-5" />
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
              </Menu.Root> */}
            </div>
            <div className="text-foreground text-sm">
              <p className="font-medium">Profile Picture</p>
              <p className="text-muted-foreground text-xs">
                Recommended size: 400x400px
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label htmlFor="nameInput">Name</label>
              <Input
                name="name"
                id="nameInput"
                type="text"
                minLength={1}
                maxLength={15}
                defaultValue={name ? name : ""}
                onChange={(e) => handleNameChange(e)}
                autoComplete="name"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="usernameInput">Username</label>
              <div className="relative">
                <span className="text-muted-foreground absolute top-[50%] left-3 transform-[translateY(-50%)] select-none">
                  @
                </span>
                <Input
                  name="username"
                  id="usernameInput"
                  type="text"
                  minLength={3}
                  maxLength={25}
                  defaultValue={username}
                  onChange={(e) => handleUsernameChange(e)}
                  autoComplete="username"
                  className="pl-7"
                />
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="aboutMeTextArea">About Me</label>
            <Textarea
              id="aboutMeTextArea"
              name="aboutMe"
              maxLength={250}
              defaultValue={aboutMe ? aboutMe : ""}
              placeholder="Tell us about yourself and your music taste..."
              onChange={(e) => handleAboutMeChange(e)}
            />
            <p className="text-muted-foreground text-right text-xs">
              250 characters max
            </p>
          </div>
          <div className="mt-8 flex justify-end gap-2 border-t pt-4">
            <DialogClose
              className={buttonVariants({
                variant: "outlineWithPointer",
                size: "default",
              })}
              type="button"
              disabled={saving}
            >
              Cancel
            </DialogClose>
            <Button
              variant="default"
              size="default"
              className="bg-primary cursor-pointer"
              type="submit"
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default EditProfile;
