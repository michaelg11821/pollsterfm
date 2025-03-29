import NextAuth from "next-auth";
import Spotify from "next-auth/providers/spotify";

import { PrismaAdapter } from "@auth/prisma-adapter";

import { prisma } from "./prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: {
    ...PrismaAdapter(prisma),
    createUser: async (userData) => {
      const user = await prisma.user.create({
        data: userData,
      });

      return user;
    },
  },
  providers: [
    Spotify({
      authorization:
        "https://accounts.spotify.com/authorize?scope=user-read-currently-playing user-read-playback-position user-top-read user-read-recently-played user-read-email",
    }),
  ],
  pages: {
    signIn: "/sign-in",
    error: "/error",
  },
});
