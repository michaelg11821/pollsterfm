"use client";

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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

import { Camera, ImageIcon, SquarePen, Trash2 } from "lucide-react";

import { headerImageSchema, profileIconSchema } from "@/lib/schemas/user";
import { toastManager } from "@/lib/toast";
import { cn } from "@/lib/utils";

import type { EditProfileFormData } from "@/lib/types/formData";

import { siteName } from "@/config";
import { api } from "@/lib/convex/_generated/api";
import { Id } from "@/lib/convex/_generated/dataModel";
import { UpdateProfileArgs } from "@/lib/convex/user";
import { editProfileSchema } from "@/lib/schemas/forms";
import { useMutation, useQuery } from "convex/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ZodError } from "zod";
import { Button, buttonVariants } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

type EditProfileProps = {
  headerImage: string | null | undefined;
  profileIcon: string | undefined;
  name: string | undefined;
  username: string;
  aboutMe: string | undefined;
};

function EditProfile({
  headerImage,
  profileIcon,
  name,
  username,
  aboutMe,
}: EditProfileProps) {
  const [open, setOpen] = useState<boolean>(false);
  const [headerImgPreview, setHeaderImgPreview] = useState<
    string | null | undefined
  >(headerImage);
  const [profileIconPreview, setProfileIconPreview] = useState<
    string | null | undefined
  >(profileIcon);
  const [saving, setSaving] = useState<boolean>(false);
  const [formData, setFormData] = useState<EditProfileFormData>({
    newHeaderImg: null,
    newProfileIcon: null,
    newName: name,
    newUsername: username,
    newAboutMe: aboutMe,
    deleteHeaderImg: false,
    deleteProfileIcon: false,
  });

  const formRef = useRef<HTMLFormElement>(null);
  const headerImgInputRef = useRef<HTMLInputElement>(null);
  const profilePicInputRef = useRef<HTMLInputElement>(null);

  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const deleteImage = useMutation(api.files.deleteById);
  const currentUser = useQuery(api.user.currentUser);
  const existingUser = useQuery(api.user.checkForExisting, {
    username: formData.newUsername,
  });
  const updateProfile = useMutation(api.user.updateProfile);

  const router = useRouter();

  useEffect(() => {
    if (!formData.newHeaderImg) return;

    const imageUrl = URL.createObjectURL(formData.newHeaderImg);

    setHeaderImgPreview(imageUrl);

    return () => URL.revokeObjectURL(imageUrl);
  }, [formData.newHeaderImg]);

  useEffect(() => {
    if (!formData.newProfileIcon) return;

    const imageUrl = URL.createObjectURL(formData.newProfileIcon);

    setProfileIconPreview(imageUrl);

    return () => URL.revokeObjectURL(imageUrl);
  }, [formData.newProfileIcon]);

  useEffect(() => {
    if (!open) {
      setHeaderImgPreview(headerImage);
      setProfileIconPreview(profileIcon);

      setFormData({
        newHeaderImg: null,
        newProfileIcon: null,
        newName: name,
        newUsername: username,
        newAboutMe: aboutMe,
        deleteHeaderImg: false,
        deleteProfileIcon: false,
      });

      if (formRef.current) {
        formRef.current.reset();
      }
    }
  }, [open, headerImage, profileIcon, name, username, aboutMe]);

  const validateFile = (
    file: File,
    schema: typeof headerImageSchema | typeof profileIconSchema,
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

      result.error.errors.forEach(({ message }) =>
        toastManager.add({
          title: "Error",
          description: message,
        }),
      );

      return false;
    } else {
      return true;
    }
  };

  const handleHeaderImgChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      const isValid = validateFile(file, headerImageSchema);

      if (isValid)
        setFormData((prev) => ({
          ...prev,
          newHeaderImg: file,
        }));
    }
  };

  const handleProfileIconChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      const isValid = validateFile(file, profileIconSchema);

      if (isValid)
        setFormData((prev) => ({
          ...prev,
          newProfileIcon: file,
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

    try {
      if (!currentUser) throw new Error("Please log in to make changes.");

      const result = editProfileSchema.parse(formData);

      const {
        newHeaderImg,
        newProfileIcon,
        newName,
        newUsername,
        newAboutMe,
        deleteHeaderImg,
        deleteProfileIcon,
      } = result;

      setSaving(true);

      const args: UpdateProfileArgs = {
        name: newName,
        username: newUsername,
        aboutMe: newAboutMe,
      };

      if (deleteHeaderImg && currentUser.headerImage) {
        await deleteImage({ storageId: currentUser.headerImage });

        args.headerImage = undefined;
      }

      if (deleteProfileIcon && currentUser.image) {
        if (!currentUser.image.startsWith("https://")) {
          await deleteImage({ storageId: currentUser.image as Id<"_storage"> });
        }

        args.image = undefined;
      }

      if (newProfileIcon) {
        if (currentUser.image && !currentUser.image.startsWith("https://")) {
          await deleteImage({ storageId: currentUser.image as Id<"_storage"> });
        }

        const uploadUrl = await generateUploadUrl();

        const result = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": newProfileIcon.type },
          body: newProfileIcon,
        });

        const { storageId } = await result.json();

        args.image = storageId;
      }

      if (newHeaderImg) {
        if (currentUser.headerImage) {
          await deleteImage({ storageId: currentUser.headerImage });
        }

        const uploadUrl = await generateUploadUrl();

        const result = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": newHeaderImg.type },
          body: newHeaderImg,
        });

        const { storageId } = await result.json();

        args.headerImage = storageId;
      }

      if (newUsername !== username && existingUser) {
        throw new Error("Username already taken.");
      } else {
        await updateProfile(args);
      }

      router.replace(`/user/${newUsername}`);

      setOpen(false);

      toastManager.add({
        title: "Success",
        description: "Profile updated successfully.",
      });
    } catch (err: unknown) {
      console.error(
        `error updating profile for ${currentUser?.username}:`,
        err,
      );

      if (err instanceof ZodError) {
        err.issues.forEach(({ message }) => {
          toastManager.add({
            title: "Error",
            description: message,
          });
        });
      } else if (
        err instanceof Error &&
        err.message === "Username already taken."
      ) {
        toastManager.add({
          title: "Error",
          description: err.message,
        });
      } else {
        toastManager.add({
          title: "Error",
          description: "An unexpected server error occurred. Please try again.",
        });
      }
    } finally {
      setSaving(false);
    }
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
    if (profilePicInputRef.current) {
      profilePicInputRef.current.value = "";
    }

    setFormData((prev) => ({
      ...prev,
      newProfileIcon: null,
      deleteProfileIcon: true,
    }));

    setProfileIconPreview(null);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <button
                    className="absolute top-2 right-2 inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border-none bg-black/60 p-0 text-white transition-[background-color]"
                    aria-label="Upload header image"
                  >
                    <Camera className="h-4 w-4" />
                  </button>
                }
              />
              <DropdownMenuContent sideOffset={2}>
                <DropdownMenuItem
                  onClick={() => headerImgInputRef.current?.click()}
                >
                  <ImageIcon className="h-5 w-5" />
                  Upload Image
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => onHeaderImgReset()}
                  data-testid="header-remove"
                >
                  <Trash2 className="h-5 w-5" />
                  Remove Image
                </DropdownMenuItem>
              </DropdownMenuContent>
              <input
                type="file"
                ref={headerImgInputRef}
                name="headerImage"
                accept="image/jpeg,image/png,image/webp"
                className="visually-hidden"
                data-testid="header-upload"
                onChange={handleHeaderImgChange}
              />
            </DropdownMenu>
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
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <button
                      className="absolute right-0 bottom-0 inline-flex h-6 w-6 cursor-pointer items-center justify-center rounded-full border-none bg-black/60 p-0 text-white transition-[background-color]"
                      aria-label="Upload profile picture"
                    >
                      <Camera className="h-3 w-3" />
                    </button>
                  }
                />
                <DropdownMenuContent>
                  <DropdownMenuItem
                    onClick={() => profilePicInputRef.current?.click()}
                  >
                    <ImageIcon className="h-5 w-5" />
                    Upload Image
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => onProfileIconReset()}
                    data-testid="profile-picture-remove"
                  >
                    <Trash2 className="h-5 w-5" />
                    Remove Image
                  </DropdownMenuItem>
                </DropdownMenuContent>
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
              </DropdownMenu>
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
              className={cn(
                buttonVariants({
                  variant: "outline",
                  size: "default",
                }),
                "cursor-pointer",
              )}
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
