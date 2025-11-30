import { getAuthUserId } from "@convex-dev/auth/server";
import { type Infer, v } from "convex/values";
import {
  INTERNAL_SERVER_ERROR,
  NO_PLATFORM,
  NOT_FOUND,
  UNAUTHORIZED,
} from "../constants/errors";
import { capitalize, getChoiceItemName, utsToIsoString } from "../convex-utils";
import {
  LastfmCurrentlyPlayingResponse,
  LastfmRecentlyPlayedResponse,
} from "../types/lastfmResponses";
import type { Platform, PollActivity } from "../types/pollster";
import {
  SpotifyCurrentlyPlayingResponse,
  SpotifyRecentlyPlayedResponse,
} from "../types/spotifyResponses";
import { api } from "./_generated/api";
import type { Id } from "./_generated/dataModel";
import {
  action,
  mutation,
  MutationCtx,
  query,
  QueryCtx,
} from "./_generated/server";
import {
  getCurrentlyPlayingLastfmTrack,
  getRecentlyPlayedLastfmTracks,
} from "./lastfm/user";
import {
  getCurrentlyPlayingSpotifyTrack,
  getRecentlyPlayedSpotifyTracks,
} from "./spotify/user";

async function getCurrentUser(ctx: QueryCtx | MutationCtx) {
  const userId = await getAuthUserId(ctx);

  if (userId === null) {
    return null;
  }

  return await ctx.db.get(userId);
}

export const currentUser = query({
  args: {},
  handler: async (ctx) => {
    return await getCurrentUser(ctx);
  },
});

async function getProfileImages(
  originalProfileIcon: string | undefined,
  originalHeaderImage: string | undefined,
  ctx: QueryCtx,
) {
  let profileIcon: string | null | undefined;
  let headerImage: string | null | undefined;

  if (originalProfileIcon && !originalProfileIcon?.startsWith("https://")) {
    profileIcon = await ctx.storage.getUrl(
      originalProfileIcon as Id<"_storage">,
    );
  } else {
    profileIcon = originalProfileIcon;
  }

  if (!originalHeaderImage) {
    headerImage = undefined;
  } else {
    headerImage = await ctx.storage.getUrl(
      originalHeaderImage as Id<"_storage">,
    );
  }

  return { profileIcon, headerImage };
}

export const getProfile = query({
  args: { username: v.optional(v.string()) },
  handler: async (ctx, args) => {
    let user;

    if (args.username !== undefined) {
      user = await ctx.db
        .query("users")
        .withIndex("username", (q) => q.eq("username", args.username!))
        .unique();
    } else {
      user = await getCurrentUser(ctx);
    }

    if (user === null) {
      return null;
    }

    const { profileIcon, headerImage } = await getProfileImages(
      user.image,
      user.headerImage,
      ctx,
    );

    return {
      aboutMe: user.aboutMe,
      createdAt: user._creationTime,
      image: profileIcon,
      username: user.username,
      headerImage,
      name: user.name,
      createdPolls: user.createdPolls,
    };
  },
});

export const checkForExisting = query({
  args: { username: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("username", (q) => q.eq("username", args.username))
      .unique();

    if (user) {
      return true;
    } else {
      return false;
    }
  },
});

const updateProfileValidator = v.object({
  name: v.string(),
  username: v.string(),
  aboutMe: v.optional(v.string()),
  image: v.optional(v.union(v.string(), v.id("_storage"))),
  headerImage: v.optional(v.id("_storage")),
});

export type UpdateProfileArgs = Infer<typeof updateProfileValidator>;

export const updateProfile = mutation({
  args: updateProfileValidator,
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (userId === null) {
      return null;
    }

    await ctx.db.patch(userId, args);
  },
});

export const getName = query({
  args: { username: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("username", (q) => q.eq("username", args.username))
      .unique();

    if (!user) return null;

    return user.name;
  },
});

export const addVote = mutation({
  args: {
    artist: v.string(),
    album: v.union(v.string(), v.null()),
    track: v.union(v.string(), v.null()),
    pollId: v.id("polls"),
    affinities: v.array(v.string()),
    choiceIndex: v.number(),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);

    if (user === null) {
      throw new Error("user not found");
    }

    const hasVoted = user.choices?.some(
      (choice) => choice.pollId === args.pollId,
    );

    if (hasVoted) {
      throw new Error("user has already voted on this poll");
    }

    const newChoice = {
      artist: args.artist,
      album: args.album,
      track: args.track,
      pollId: args.pollId,
      affinities: args.affinities,
    };

    const newChoices = user.choices
      ? [...user.choices, newChoice]
      : [newChoice];

    await ctx.db.patch(user._id, { choices: newChoices });

    const poll = await ctx.db.get(args.pollId);

    if (poll === null) {
      throw new Error("poll not found");
    }

    const pollChoicesCopy = [...poll.choices];
    pollChoicesCopy[args.choiceIndex].totalVotes += 1;

    const { profileIcon } = await getProfileImages(
      user.image,
      user.headerImage,
      ctx,
    );

    const userActivity: PollActivity = {
      user: { username: user.username, image: profileIcon ?? undefined },
      action: "voted for",
      choice: getChoiceItemName(newChoice)!,
      timestamp: Date.now(),
    };
    const newRecentActivity = poll.recentActivity
      ? [userActivity, ...poll.recentActivity]
      : [userActivity];

    await ctx.db.patch(args.pollId, {
      totalVotes: poll.totalVotes + 1,
      choices: pollChoicesCopy,
      recentActivity: newRecentActivity,
    });

    return null;
  },
});

export const getAffinities = query({
  args: {
    amount: v.optional(v.number()),
    username: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("username", (q) => q.eq("username", args.username))
      .unique();

    if (user === null) {
      return null;
    }

    if (!user.choices || user.choices.length === 0) {
      return [];
    }

    const affinityCounts = new Map<string, number>();

    user.choices.forEach((choice) => {
      choice.affinities.forEach((affinity) => {
        const currentCount = affinityCounts.get(affinity) || 0;

        affinityCounts.set(affinity, currentCount + 1);
      });
    });

    const totalChoices = user.choices.length;

    const affinityScores = Array.from(affinityCounts.entries())
      .map(([name, count]) => {
        const frequencyScore = Math.round((count / totalChoices) * 100);

        const countBonus = Math.min(20, count * 5);
        const finalScore = Math.min(100, frequencyScore + countBonus);

        return {
          name: capitalize(name),
          score: finalScore,
        };
      })
      .sort((a, b) => b.score - a.score);

    const amount = args.amount || affinityScores.length;

    return affinityScores.slice(0, amount);
  },
});

export const getAccountPlatform = query({
  args: {
    username: v.string(),
  },
  handler: async (ctx, args): Promise<Platform | null> => {
    const user = await ctx.db
      .query("users")
      .withIndex("username", (q) => q.eq("username", args.username))
      .unique();

    if (user === null) {
      return null;
    }

    if (user.spotifyAccessToken) {
      return "spotify";
    } else if (user.lastfmSessionKey) {
      return "lastfm";
    }

    return null;
  },
});

export const getRecentlyPlayedTracks = action({
  args: {
    username: v.string(),
    limit: v.number(),
    next: v.optional(v.string()),
    page: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    try {
      const platform = await ctx.runQuery(api.user.getAccountPlatform, {
        username: args.username,
      });

      if (!platform) return { error: NO_PLATFORM };

      let rawTracks:
        | SpotifyRecentlyPlayedResponse["items"]
        | LastfmRecentlyPlayedResponse["recenttracks"]["track"];

      switch (platform) {
        case "spotify":
          const spotifyTracks = await getRecentlyPlayedSpotifyTracks(
            ctx,
            args.username,
            args.limit,
            args.next,
          );

          if ("error" in spotifyTracks) {
            const error = spotifyTracks;

            return error;
          }

          rawTracks = spotifyTracks.items;
          break;
        case "lastfm":
          const lastfmTracks = await getRecentlyPlayedLastfmTracks(
            ctx,
            args.username,
            args.limit,
            args.page,
            false,
          );

          if ("error" in lastfmTracks) {
            const error = lastfmTracks;

            return error;
          }

          rawTracks = lastfmTracks.recenttracks.track;
          break;
      }

      const tracks = rawTracks!.map((trackData) =>
        "track" in trackData
          ? {
              name: trackData.track.name,
              image: trackData.track.album.images[1].url,
              artists: trackData.track.artists.map((artist) => artist.name),
              albumName: trackData.track.album.name,
              playedAt: trackData.played_at,
            }
          : {
              name: trackData.name,
              image: trackData.image[1]["#text"],
              artists: [trackData.artist["#text"]],
              albumName: trackData.album["#text"],
              playedAt: utsToIsoString(trackData.date!.uts),
            },
      );

      return tracks;
    } catch (err: unknown) {
      console.error("error getting recently played tracks:", err);

      return { error: INTERNAL_SERVER_ERROR };
    }
  },
});

export const getCurrentlyPlayingTrack = action({
  args: {
    username: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      const platform = await ctx.runQuery(api.user.getAccountPlatform, {
        username: args.username,
      });

      if (!platform) return { error: NO_PLATFORM };

      let rawTrack:
        | SpotifyCurrentlyPlayingResponse["item"]
        | LastfmCurrentlyPlayingResponse;

      switch (platform) {
        case "spotify":
          const spotifyTrack = await getCurrentlyPlayingSpotifyTrack(
            ctx,
            args.username,
          );

          if (!spotifyTrack) return null;

          if ("error" in spotifyTrack) {
            const error = spotifyTrack;

            return error;
          } else if (spotifyTrack.item.is_local) {
            return null;
          }

          rawTrack = spotifyTrack.item;
          break;
        case "lastfm":
          const lastfmTrack = await getCurrentlyPlayingLastfmTrack(
            ctx,
            args.username,
          );

          if (!lastfmTrack) return null;

          if ("error" in lastfmTrack) {
            const error = lastfmTrack;

            return error;
          }

          rawTrack = lastfmTrack;
          break;
      }

      const track =
        "image" in rawTrack!
          ? {
              name: rawTrack!.name,
              image: rawTrack.image[3]["#text"],
              artists: [rawTrack.artist["#text"]],
              albumName: rawTrack.album["#text"],
            }
          : {
              name: rawTrack!.name,
              image: rawTrack!.album.images[1].url,
              artists: rawTrack!.album.artists.map((artist) => artist.name),
              albumName: rawTrack!.album.name,
            };

      return track;
    } catch (err: unknown) {
      console.error("error getting currently playing track:", err);

      return { error: INTERNAL_SERVER_ERROR };
    }
  },
});

export const followUser = mutation({
  args: { username: v.string() },
  handler: async (ctx, args) => {
    try {
      const sender = await getCurrentUser(ctx);

      if (sender === null) return { error: UNAUTHORIZED };

      const recipient = await ctx.db
        .query("users")
        .withIndex("username", (q) => q.eq("username", args.username))
        .unique();

      if (recipient === null) return { error: NOT_FOUND };

      await ctx.db.insert("follows", {
        recipient: recipient._id,
        sender: sender._id,
      });

      const senderProfileLink = `${process.env.SITE_URL}user/${sender.username}`;

      await ctx.db.insert("notifications", {
        userId: recipient._id,
        description: `${sender.username} is now following you.`,
        link: `${senderProfileLink}`,
      });
    } catch (err: unknown) {
      console.error(`error following user ${args.username}: ${err}`);

      return { error: INTERNAL_SERVER_ERROR };
    }
  },
});

export const unfollowUser = mutation({
  args: { username: v.string() },
  handler: async (ctx, args) => {
    try {
      const sender = await getCurrentUser(ctx);

      if (sender === null) return { error: UNAUTHORIZED };

      const recipient = await ctx.db
        .query("users")
        .withIndex("username", (q) => q.eq("username", args.username))
        .unique();

      if (recipient === null) return { error: NOT_FOUND };

      const followToRemove = await ctx.db
        .query("follows")
        .withIndex("by_recipient_sender", (q) =>
          q.eq("recipient", recipient._id).eq("sender", sender._id),
        )
        .unique();

      if (followToRemove === null) return { error: NOT_FOUND };

      await ctx.db.delete(followToRemove._id);
    } catch (err: unknown) {
      console.error(`error following user ${args.username}: ${err}`);

      return { error: INTERNAL_SERVER_ERROR };
    }
  },
});

export const isFollowing = query({
  args: { username: v.string() },
  handler: async (ctx, args) => {
    try {
      const sender = await getCurrentUser(ctx);

      if (sender === null) return null;

      const recipient = await ctx.db
        .query("users")
        .withIndex("username", (q) => q.eq("username", args.username))
        .unique();

      if (recipient === null) return null;

      const follow = await ctx.db
        .query("follows")
        .withIndex("by_recipient_sender", (q) =>
          q.eq("recipient", recipient._id).eq("sender", sender._id),
        )
        .unique();

      if (follow === null) return false;

      return true;
    } catch (err: unknown) {
      console.error(
        `error checking if user is following ${args.username}: ${err}`,
      );

      return null;
    }
  },
});
