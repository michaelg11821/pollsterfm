"use server";

import { prisma } from "./prisma";

import { type PollsterProfile } from "./types/pollsterUser";

export async function getProfile(
  username: string
): Promise<PollsterProfile | null> {
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
      // later, include polls, friends, and other public info
    },
  });

  return matchingUser as PollsterProfile | null;
}
