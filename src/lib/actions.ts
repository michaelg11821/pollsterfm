"use server";

import SpotifyApi from "./spotify";

import { prisma } from "./prisma";

export async function verifyTurnstile(token: string) {
  if (process.env.NODE_ENV !== "production") return { success: true };

  const formData = new FormData();
  formData.append("secret", process.env.NEXT_PRIVATE_TURNSTILE_SECRET_KEY!);
  formData.append("response", token);

  try {
    const response = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();

    if (data.success) {
      return { success: true, status: 200 };
    } else {
      return { success: false, error: data["error-codes"], status: 401 };
    }
  } catch (error: unknown) {
    return { success: false, error, status: 500 };
  }
}

/**
 * A function that retrieves a user's Spotify API credentials from the database.
 *
 * @param username A Pollster.fm user's username.
 * @returns The credentials needed for Pollster.fm's Spotify API wrapper.
 */
async function getSpotifyApiCredentials(username: string) {
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

    return { refresh_token, expires_at, access_token, providerAccountId };
  } catch (err: unknown) {
    console.error("error getting credentials", err);

    return null;
  }
}

/**
 * A function that returns an instance of the Pollster.fm Spotify API wrapper with valid credentials.
 *
 * @param username A Pollster.fm user's username.
 * @returns A Pollster.fm Spotify API wrapper with valid credentials.
 */
export async function spotifyApiWithCredentials(username: string) {
  const credentials = await getSpotifyApiCredentials(username);

  if (!credentials) return null;

  const { refresh_token, expires_at, access_token, providerAccountId } =
    credentials;

  return SpotifyApi(access_token, refresh_token, expires_at, providerAccountId);
}

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
