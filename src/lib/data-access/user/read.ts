import SpotifyApi from "../../spotify";

import { prisma } from "../../prisma";

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
      providerAccountId,
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
