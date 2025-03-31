import NextAuth from "next-auth";
import Spotify from "next-auth/providers/spotify";

import { PrismaAdapter } from "@auth/prisma-adapter";

import { prisma } from "./prisma";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { type JWT } from "next-auth/jwt";
import { type AdapterUser } from "./types/adapterTypes";

export const { handlers, signIn, signOut, auth } = NextAuth({
  debug: true,
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
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
  callbacks: {
    jwt({ token, account, user }) {
      if (account) {
        token.access_token = account.access_token;
        token.refresh_token = account.refresh_token;
        token.expires_at = account.expires_at;
      }

      if (user) {
        token.user = {
          username: (user as AdapterUser).username,
          email: user.email,
          image: user.image,
        };
      }

      return token;
    },
    session({ session, token }) {
      session.access_token = token.access_token;
      session.expires_at = token.expires_at;

      if (token.user) {
        session.user = token.user;
      }

      return session;
    },
  },
});
