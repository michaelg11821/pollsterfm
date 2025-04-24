"use server";

import { prisma } from "../../prisma";

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
