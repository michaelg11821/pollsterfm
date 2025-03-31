"use server";

import { prisma } from "./prisma";

import { SpotifyAPI } from "@statsfm/spotify.js";

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
  const matchingUser = await prisma.user.findUnique({
    where: {
      username,
    },
    select: {
      pronouns: true,
      aboutMe: true,
      createdAt: true,
      image: true,
      name: true,
      id: true,
      // later, include polls, friends, and other public info
    },
  });

  let currentlyPlaying: string | undefined;

  if (matchingUser) {
    const tokens = await prisma.account.findFirst({
      where: {
        userId: matchingUser.id,
      },
      select: {
        access_token: true,
        refresh_token: true,
      },
    });

    if (tokens?.access_token && tokens?.refresh_token) {
      const spotify = new SpotifyAPI({
        clientCredentials: {
          clientId: process.env.AUTH_SPOTIFY_ID!,
          clientSecret: process.env.AUTH_SPOTIFY_SECRET!,
        },
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
      });

      try {
        const currentlyPlayingTrack = await spotify.me.getPlaybackState();

        currentlyPlaying =
          currentlyPlayingTrack?.item?.name || "Nothing playing";
      } catch (error) {
        console.error("Error fetching Spotify data:", error);
      }
    }
  }

  return {
    ...matchingUser,
    currentlyPlaying,
  };
}
