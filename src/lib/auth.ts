import NextAuth from "next-auth";
import Spotify from "next-auth/providers/spotify";

import { PrismaAdapter } from "@auth/prisma-adapter";

import { type AdapterUser } from "next-auth/adapters";

import { prisma } from "./prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: {
    ...PrismaAdapter(prisma),
    createUser: async (user) => {
      const newUser = await prisma.user.create({
        data: {
          name: user.name as string,
          email: user.email,
          image: user.image,
          emailVerified: user.emailVerified,
        },
      });

      const adapterUser: AdapterUser = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        emailVerified: newUser.emailVerified,
      };

      return adapterUser;
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
