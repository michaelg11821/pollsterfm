"use client";

import { useEffect, useRef, useState, type ChangeEvent } from "react";

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

import { toastManager } from "@/lib/toast";
import { cn } from "@/lib/utils";

import { SITE_NAME } from "@/lib/constants/site-info";
import { api } from "@/lib/convex/_generated/api";
import type { Id } from "@/lib/convex/_generated/dataModel";
import { UpdateProfileArgs } from "@/lib/convex/user";
import { editProfileSchema, editProfileSchemaType } from "@/lib/zod/forms";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "convex/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { Button, buttonVariants } from "../ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
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

  const headerImgInputRef = useRef<HTMLInputElement>(null);
  const profilePicInputRef = useRef<HTMLInputElement>(null);

  const defaultValues = {
    newHeaderImg: null,
    newProfileIcon: null,
    newName: name ?? "",
    newUsername: username ?? "",
    newAboutMe: aboutMe ?? "",
    deleteHeaderImg: false,
    deleteProfileIcon: false,
  };

  const form = useForm<editProfileSchemaType>({
    resolver: zodResolver(editProfileSchema),
    defaultValues,
  });

  const newHeaderImg = useWatch({
    control: form.control,
    name: "newHeaderImg",
  });

  const newProfileIcon = useWatch({
    control: form.control,
    name: "newProfileIcon",
  });

  const newUsername = useWatch({
    control: form.control,
    name: "newUsername",
  });

  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const deleteImage = useMutation(api.files.deleteById);
  const currentUser = useQuery(api.user.currentUser);
  const existingUser = useQuery(api.user.checkForExisting, {
    username: newUsername,
  });
  const updateProfile = useMutation(api.user.updateProfile);

  const router = useRouter();

  useEffect(() => {
    if (!newHeaderImg) return;

    const imageUrl = URL.createObjectURL(newHeaderImg);

    setHeaderImgPreview(imageUrl);

    return () => URL.revokeObjectURL(imageUrl);
  }, [newHeaderImg]);

  useEffect(() => {
    if (!newProfileIcon) return;

    const imageUrl = URL.createObjectURL(newProfileIcon);

    setProfileIconPreview(imageUrl);

    return () => URL.revokeObjectURL(imageUrl);
  }, [newProfileIcon]);

  useEffect(() => {
    if (open) return;

    setHeaderImgPreview(headerImage);
    setProfileIconPreview(profileIcon);

    form.reset();
  }, [headerImage, profileIcon, form, open]);

  const onSubmit = async (values: editProfileSchemaType) => {
    if (!currentUser)
      return toastManager.add({
        title: "Error",
        description: "Please log in to make changes.",
      });

    const {
      newHeaderImg,
      newProfileIcon,
      newName,
      newUsername,
      newAboutMe,
      deleteHeaderImg,
      deleteProfileIcon,
    } = values;

    try {
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
        return toastManager.add({
          title: "Error",
          description: "Username already taken.",
        });
      }

      await updateProfile(args);

      router.replace(`/user/${newUsername}`);

      setOpen(false);

      return toastManager.add({
        title: "Success",
        description: "Profile updated successfully.",
      });
    } catch (err: unknown) {
      console.error(
        `error updating profile for ${currentUser?.username}:`,
        err,
      );

      return toastManager.add({
        title: "Error",
        description: "An unexpected server error occurred. Please try again.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleHeaderImgChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;

    form.setValue("deleteHeaderImg", false);
    form.setValue("newHeaderImg", file, { shouldValidate: true });
  };

  const handleProfileIconChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;

    form.setValue("deleteProfileIcon", false);
    form.setValue("newProfileIcon", file, { shouldValidate: true });
  };

  const onHeaderImgReset = () => {
    form.resetField("newHeaderImg");
    form.setValue("deleteHeaderImg", true);

    setHeaderImgPreview(null);
  };

  const onProfileIconReset = () => {
    form.resetField("newProfileIcon");
    form.setValue("deleteProfileIcon", true);

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
          {` ${SITE_NAME}`}.
        </DialogDescription>
        <Form {...form}>
          <form
            className="flex flex-col gap-5 pt-7.5"
            onSubmit={form.handleSubmit(onSubmit)}
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
              <FormField
                control={form.control}
                name="newName"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-2">
                    <FormLabel htmlFor="nameInput">Name</FormLabel>
                    <FormControl>
                      <Input
                        id="nameInput"
                        type="text"
                        maxLength={15}
                        autoComplete="name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="newUsername"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-2">
                    <FormLabel htmlFor="usernameInput">Username</FormLabel>
                    <div className="relative">
                      <span className="text-muted-foreground absolute top-[50%] left-3 transform-[translateY(-50%)] select-none">
                        @
                      </span>
                      <FormControl>
                        <Input
                          id="usernameInput"
                          type="text"
                          maxLength={25}
                          autoComplete="username"
                          className="pl-7"
                          {...field}
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="newAboutMe"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2">
                  <FormLabel htmlFor="aboutMeTextArea">About Me</FormLabel>
                  <FormControl>
                    <Textarea
                      id="aboutMeTextArea"
                      maxLength={250}
                      placeholder="Tell us about yourself and your music taste..."
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-right">
                    250 characters max
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
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
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default EditProfile;
