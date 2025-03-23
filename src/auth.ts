import NextAuth from "next-auth";
import Spotify from "next-auth/providers/spotify";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Spotify({
      authorization:
        "https://accounts.spotify.com/authorize?scope=user-read-currently-playing user-read-playback-position user-top-read user-read-recently-played user-read-email",
    }),
  ],
  pages: {
    signIn: "/sign-in",
  },
  callbacks: {
    async signIn({ account }) {
      try {
        const turnstileToken = account?.turnstileToken;

        if (!turnstileToken) return "/sign-in?error=no_turnstile_token";

        const response = await fetch(
          "https://challenges.cloudflare.com/turnstile/v0/siteverify",
          {
            method: "POST",
            body: JSON.stringify({
              secret: process.env.TURNSTILE_SECRET_KEY,
              response: turnstileToken,
            }),
            headers: { "Content-Type": "application/json" },
          }
        );

        const data = await response.json();

        if (!data.success) return "/sign-in?error=turnstile_failed";

        return true;
      } catch (error) {
        console.error("Sign-in error:", error);

        return "/sign-in?error=server_error";
      }
    },
  },
});
