"use server";

import { redirect } from "next/navigation";

import SpotifyApi from "../spotify";

import { prisma } from "../prisma";
import { editProfileSchema } from "../schemas";
import { auth } from "../auth";
import { getSupabaseFileName, supabase } from "../supabase";

import type { EditProfileFormData } from "../types/formData";

/**
 * A function that returns an instance of the Pollster.fm Spotify API wrapper with valid credentials.
 *
 * @param username A Pollster.fm user's username.
 * @returns A Pollster.fm Spotify API wrapper with valid credentials.
 */
export async function spotifyApiWithCredentials(username: string) {
  try {
    const tokens = await prisma.user.findUniqueOrThrow({
      where: {
        username,
      },
      select: {
        accounts: {
          where: {
            provider: "spotify",
          },
          select: {
            access_token: true,
            refresh_token: true,
            expires_at: true,
            providerAccountId: true,
          },
        },
      },
    });

    const { refresh_token, expires_at, access_token, providerAccountId } =
      tokens.accounts[0];

    if (!refresh_token || !expires_at || !access_token || !providerAccountId)
      throw new Error("user is missing one or more credentials");

    return SpotifyApi(
      access_token,
      refresh_token,
      expires_at,
      providerAccountId
    );
  } catch (err: unknown) {
    console.error(`error getting spotify instance for ${username}:`, err);

    return null;
  }
}

/**
 * Returns some basic (public) information about a Pollster.fm user.
 *
 * @param username A Pollster.fm user's username
 * @returns Basic profile information for a Pollster.fm user.
 */
export async function getProfile(username: string) {
  try {
    const profile = await prisma.user.findUniqueOrThrow({
      where: {
        username,
      },
      select: {
        aboutMe: true,
        createdAt: true,
        image: true,
        headerImage: true,
        name: true,
      },
    });

    return profile;
  } catch (err: unknown) {
    console.error("error getting profile", err);

    return null;
  }
}

/**
 * Returns a Pollster.fm user's name.
 *
 * @param username A Pollster.fm user's username
 * @returns A Pollster.fm user's name.
 */
export async function getName(username: string) {
  try {
    const { name } = await prisma.user.findUniqueOrThrow({
      where: {
        username,
      },
      select: {
        name: true,
      },
    });

    return name;
  } catch (err: unknown) {
    console.error("error getting name", err);

    return null;
  }
}

/**
 * A function that updates the given user's profile with the given form data.
 *
 * @param username A Pollster.fm user's username.
 * @param formData Data from the "Edit Profile" form. Will be validated on both the frontend and the backend.
 */
export async function updateProfile(
  username: string,
  formData: EditProfileFormData
) {
  const session = await auth();
  const user = session?.user;

  if (!user) {
    redirect("/sign-in");
  }

  if (user.username !== username) {
    throw new Error("unauthorized update");
  }

  try {
    const result = editProfileSchema.safeParse(formData);

    if (!result.success) throw new Error("bad form data");

    const {
      newHeaderImg,
      newProfileIcon,
      newName,
      newUsername,
      newAboutMe,
      oldHeaderImg,
      oldProfileIcon,
    } = result.data;

    let newHeaderImgUrl: string | null = null;
    let newProfileIconUrl: string | null = null;

    if (newHeaderImg) {
      if (oldHeaderImg) {
        const fileName = getSupabaseFileName(new URL(oldHeaderImg));

        const { error } = await supabase.storage
          .from("header-images")
          .remove([fileName]);

        if (error) throw error;
      }

      const { data, error } = await supabase.storage
        .from("header-images")
        .upload(newHeaderImg.name, newHeaderImg);

      if (error) throw error;

      const {
        data: { publicUrl },
      } = supabase.storage.from("header-images").getPublicUrl(data.path);

      newHeaderImgUrl = publicUrl;
    }

    if (newProfileIcon && oldProfileIcon) {
      const oldIconUrl = new URL(oldProfileIcon);

      if (oldIconUrl.origin === process.env.SUPABASE_URL!) {
        const fileName = getSupabaseFileName(oldIconUrl);

        const { error } = await supabase.storage
          .from("profile-icons")
          .remove([fileName]);

        if (error) throw error;
      }

      const { data, error } = await supabase.storage
        .from("profile-icons")
        .upload(newProfileIcon.name, newProfileIcon);

      if (error) throw error;

      const {
        data: { publicUrl },
      } = supabase.storage.from("profile-icons").getPublicUrl(data.path);

      newProfileIconUrl = publicUrl;
    }

    await prisma.user.update({
      where: {
        username,
      },
      data: {
        name: newName,
        username: newUsername,
        aboutMe: newAboutMe,
        image: newProfileIconUrl ?? oldProfileIcon,
        headerImage: newHeaderImgUrl ?? oldHeaderImg,
      },
    });
  } catch (err: unknown) {
    console.error(`error updating profile:`, err);
  }
}
