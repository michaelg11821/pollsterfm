import Spotify from "@auth/core/providers/spotify";
import { convexAuth } from "@convex-dev/auth/server";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [
    Spotify({
      authorization:
        "https://accounts.spotify.com/authorize?scope=user-read-playback-state user-read-currently-playing user-read-playback-position user-top-read user-read-recently-played user-read-email",
      profile(spotifyProfile, tokens) {
        return {
          id: spotifyProfile.id,
          name: spotifyProfile.display_name,
          username: spotifyProfile.id,
          email: spotifyProfile.email,
          image: spotifyProfile.images?.[0]?.url,
          spotifyProfileLink: spotifyProfile.external_urls.spotify,
          spotifyAccessToken: tokens.access_token,
          spotifyRefreshToken: tokens.refresh_token,
          spotifyExpiresAt: tokens.expires_at
            ? tokens.expires_at * 1000
            : undefined, // convert to ms
        };
      },
    }),
  ],
  callbacks: {
    async createOrUpdateUser(ctx, args) {
      const existingUser = args.existingUserId
        ? await ctx.db.get(args.existingUserId)
        : null;

      if (existingUser) {
        return existingUser._id;
      }

      return await ctx.db.insert("users", {
        name: args.profile.name,
        username: args.profile.username,
        email: args.profile.email,
        image: args.profile.image,
        spotifyProfileLink: args.profile.spotifyProfileLink,
        spotifyAccessToken: args.profile.spotifyAccessToken,
        spotifyRefreshToken: args.profile.spotifyRefreshToken,
        spotifyExpiresAt: args.profile.spotifyExpiresAt,
      });
    },
  },
});
