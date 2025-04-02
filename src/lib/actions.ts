"use server";

import SpotifyApi from "./spotify";

import { prisma } from "./prisma";

// import { type PollsterProfile } from "./types/pollsterUser";

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

export async function getProfile(username: string) {
  try {
    const profile = await prisma.user.findUnique({
      where: {
        username,
      },
      select: {
        pronouns: true,
        aboutMe: true,
        createdAt: true,
        image: true,
        name: true,
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
        // later, include polls, friends, and other public info
      },
    });

    if (!profile) throw new Error("user does not exist");

    const { refresh_token, expires_at, access_token, providerAccountId } =
      profile.accounts[0]; // just spotify for now

    if (!refresh_token || !expires_at || !access_token || !providerAccountId)
      throw new Error("user has invalid login info");

    const spotify = SpotifyApi(
      access_token,
      refresh_token,
      expires_at,
      providerAccountId
    );

    const currentlyPlaying = await spotify.getCurrentlyPlayingTrack();

    return {
      ...profile,
      currentlyPlaying,
    };
  } catch (err: unknown) {
    console.error("error getting profile", err);

    return null;
  }
}
