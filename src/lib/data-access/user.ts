import { redirect } from "next/navigation";

import SpotifyApi from "../spotify";

import { prisma } from "../prisma";
import { profileSchema } from "../schemas";
import { auth } from "../auth";

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
        pronouns: true,
        aboutMe: true,
        createdAt: true,
        image: true,
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
export async function updateProfile(username: string, formData: unknown) {
  const session = await auth();
  const user = session?.user;

  if (!user) {
    redirect("/sign-in");
  }

  if (user.username !== username) {
    throw new Error("unauthorized update");
  }

  try {
    if (!(formData instanceof FormData)) {
      throw new Error("bad form data");
    }

    const formDataObj = Object.fromEntries(formData.entries());
    const result = profileSchema.safeParse(formDataObj);

    if (!result.success) throw new Error("bad form data");

    await prisma.user.update({
      where: {
        username,
      },
      data: {
        name: result.data.name,
        username: result.data.username,
        aboutMe: result.data.aboutMe,
      },
    });
  } catch (err: unknown) {
    console.error(`error updating profile for user ${username}:`, err);
  }
}
