import { getAuthUserId } from "@convex-dev/auth/server";
import { paginationOptsValidator } from "convex/server";
import { type Infer, v } from "convex/values";
import {
  INTERNAL_SERVER_ERROR,
  NO_PLATFORM,
  NOT_FOUND,
  UNAUTHORIZED,
  USER_NOT_FOUND,
} from "../constants/errors";
import { capitalize, getChoiceItemName, utsToIsoString } from "../convex-utils";
import {
  LastfmCurrentlyPlayingResponse,
  LastfmRecentlyPlayedResponse,
} from "../types/lastfmResponses";
import type { Platform } from "../types/pollster";
import {
  SpotifyCurrentlyPlayingResponse,
  SpotifyRecentlyPlayedResponse,
} from "../types/spotifyResponses";
import { api } from "./_generated/api";
import type { Doc, Id } from "./_generated/dataModel";
import {
  action,
  mutation,
  MutationCtx,
  query,
  QueryCtx,
} from "./_generated/server";
import { authedMutation, authedQuery } from "./helpers";
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

function extractProfileDataFromUser(user: Doc<"users">) {
  return {
    aboutMe: user.aboutMe,
    createdAt: user._creationTime,
    image: user.image,
    username: user.username,
    headerImage: user.headerImage,
    name: user.name,
  };
}

export const getProfileById = query({
  args: { userId: v.optional(v.id("users")) },
  handler: async (ctx, args) => {
    if (!args.userId) return undefined;

    const user = await ctx.db.get(args.userId);

    if (user === null) {
      return null;
    }

    return extractProfileDataFromUser(user);
  },
});

export const getProfileByUsername = query({
  args: { username: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("username", (q) => q.eq("username", args.username))
      .unique();

    if (user === null) {
      return null;
    }

    return extractProfileDataFromUser(user);
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
  image: v.optional(v.string()),
  headerImage: v.optional(v.string()),
});

export type UpdateProfileArgs = Infer<typeof updateProfileValidator>;

export const updateProfile = mutation({
  args: updateProfileValidator,
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    let headerImage: string | undefined;
    let headerImageStorageId: Id<"_storage"> | undefined;

    let profileIcon: string | undefined;
    let profileIconStorageId: Id<"_storage"> | undefined;

    if (userId === null) {
      return null;
    }

    if (!args.headerImage) {
      headerImage = undefined;
      headerImageStorageId = undefined;
    } else if (args.headerImage.startsWith("https://")) {
      headerImage = args.headerImage;
      headerImageStorageId = undefined;
    } else {
      headerImage =
        (await ctx.storage.getUrl(args.headerImage as Id<"_storage">)) ??
        undefined;

      headerImageStorageId = args.headerImage as Id<"_storage">;
    }

    if (args.image && !args.image?.startsWith("https://")) {
      profileIcon =
        (await ctx.storage.getUrl(args.image as Id<"_storage">)) ?? undefined;

      profileIconStorageId = args.image as Id<"_storage">;
    } else {
      profileIcon = args.image;
      profileIconStorageId = undefined;
    }

    const existingUserImages = await ctx.db
      .query("userImageIds")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();

    if (!existingUserImages) {
      await ctx.db.insert("userImageIds", {
        userId,
        headerImageId: headerImageStorageId,
        profileIconId: profileIconStorageId,
      });
    } else {
      const imagePatch: {
        headerImageId?: Id<"_storage"> | undefined;
        profileIconId?: Id<"_storage"> | undefined;
      } = {};

      if (args.headerImage !== undefined) {
        if (
          existingUserImages.headerImageId &&
          existingUserImages.headerImageId !== headerImageStorageId
        ) {
          await ctx.storage.delete(existingUserImages.headerImageId);
        }

        imagePatch.headerImageId = headerImageStorageId;
      }

      if (args.image !== undefined) {
        if (
          existingUserImages.profileIconId &&
          existingUserImages.profileIconId !== profileIconStorageId
        ) {
          await ctx.storage.delete(existingUserImages.profileIconId);
        }

        imagePatch.profileIconId = profileIconStorageId;
      }

      if (Object.keys(imagePatch).length > 0) {
        await ctx.db.patch(existingUserImages._id, imagePatch);
      }
    }

    const userPatch: Partial<UpdateProfileArgs> = {
      name: args.name,
      username: args.username,
    };

    if (args.aboutMe !== undefined) {
      userPatch.aboutMe = args.aboutMe;
    }

    if (args.image !== undefined) {
      userPatch.image = profileIcon;
    }

    if (args.headerImage !== undefined) {
      userPatch.headerImage = headerImage;
    }

    await ctx.db.patch(userId, userPatch);
  },
});

export const updateListeningHistoryPrivacy = authedMutation({
  args: {
    isPrivate: v.boolean(),
  },
  handler: async (ctx, args) => {
    const { userId } = ctx;

    await ctx.db.patch(userId, { listeningHistoryPrivate: args.isPrivate });
  },
});

export const deleteAccount = authedMutation({
  args: {},
  handler: async (ctx) => {
    const { userId } = ctx;

    const sentFollows = await ctx.db
      .query("follows")
      .withIndex("sender", (q) => q.eq("sender", userId))
      .collect();

    for (const follow of sentFollows) {
      await ctx.db.delete(follow._id);
    }

    const receivedFollows = await ctx.db
      .query("follows")
      .withIndex("recipient", (q) => q.eq("recipient", userId))
      .collect();

    for (const follow of receivedFollows) {
      await ctx.db.delete(follow._id);
    }

    const notifications = await ctx.db
      .query("notifications")
      .filter((q) => q.eq(q.field("userId"), userId))
      .collect();

    for (const notification of notifications) {
      await ctx.db.delete(notification._id);
    }

    const userImages = await ctx.db
      .query("userImageIds")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();

    if (userImages) {
      if (userImages.profileIconId) {
        await ctx.storage.delete(userImages.profileIconId);
      }

      if (userImages.headerImageId) {
        await ctx.storage.delete(userImages.headerImageId);
      }

      await ctx.db.delete(userImages._id);
    }

    const stripeData = await ctx.db
      .query("stripeCustomerData")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();

    if (stripeData) {
      await ctx.db.delete(stripeData._id);
    }

    await ctx.db.delete(userId);

    return { success: true };
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

export const addVote = authedMutation({
  args: {
    artist: v.string(),
    album: v.union(v.string(), v.null()),
    track: v.union(v.string(), v.null()),
    pollId: v.id("polls"),
    affinities: v.array(v.string()),
    choiceIndex: v.number(),
  },
  handler: async (ctx, args) => {
    const poll = await ctx.db.get(args.pollId);

    if (!poll) {
      throw new Error(NOT_FOUND);
    }

    const existingChoice = await ctx.db
      .query("userChoices")
      .withIndex("by_userId_pollId", (q) =>
        q.eq("userId", ctx.userId).eq("pollId", args.pollId),
      )
      .unique();

    if (existingChoice) {
      throw new Error("user has already voted in this poll");
    }

    await ctx.db.insert("userChoices", { ...args, userId: ctx.userId });

    const user = await ctx.db.get(ctx.userId);

    if (!user) {
      throw new Error(USER_NOT_FOUND);
    }

    const choice = args;

    await ctx.db.insert("pollActivity", {
      user: { username: user.username, image: user.image },
      action: "voted for",
      choice: getChoiceItemName(choice)!,
      timestamp: Date.now(),
      userId: ctx.userId,
      pollId: args.pollId,
    });

    const choicesCopy = [...poll.choices];
    choicesCopy[args.choiceIndex].totalVotes += 1;

    await ctx.db.patch(args.pollId, {
      totalVotes: poll.totalVotes + 1,
      choices: choicesCopy,
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

    const choices = await ctx.db
      .query("userChoices")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .collect();

    if (!choices || choices.length === 0) {
      return [];
    }

    const affinityCounts = new Map<string, number>();

    choices.forEach((choice) => {
      choice.affinities.forEach((affinity) => {
        const currentCount = affinityCounts.get(affinity) || 0;

        affinityCounts.set(affinity, currentCount + 1);
      });
    });

    const totalChoices = choices.length;

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

export const getFollowers = query({
  args: { username: v.string(), paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    try {
      const user = await ctx.db
        .query("users")
        .withIndex("username", (q) => q.eq("username", args.username))
        .unique();

      if (!user) {
        return {
          page: [] as {
            name: string | undefined;
            username: string;
            image: string | undefined;
          }[],
          isDone: true,
          continueCursor: "",
        };
      }

      const followsPage = await ctx.db
        .query("follows")
        .withIndex("recipient", (q) => q.eq("recipient", user._id))
        .paginate(args.paginationOpts);

      const followers = (
        await Promise.all(
          followsPage.page.map((follow) => ctx.db.get(follow.sender)),
        )
      )
        .filter((f) => f !== null)
        .map(({ name, username, image }) => ({ name, username, image }));

      return {
        ...followsPage,
        page: followers,
      };
    } catch (err: unknown) {
      console.error(
        `error getting followers for user ${args.username}: ${err}`,
      );

      return {
        page: [] as {
          name: string | undefined;
          username: string;
          image: string | undefined;
        }[],
        isDone: true,
        continueCursor: "",
      };
    }
  },
});

export const getFollowing = query({
  args: { username: v.string(), paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    try {
      const user = await ctx.db
        .query("users")
        .withIndex("username", (q) => q.eq("username", args.username))
        .unique();

      if (!user) {
        return {
          page: [] as {
            name: string | undefined;
            username: string;
            image: string | undefined;
          }[],
          isDone: true,
          continueCursor: "",
        };
      }

      const followingPage = await ctx.db
        .query("follows")
        .withIndex("sender", (q) => q.eq("sender", user._id))
        .paginate(args.paginationOpts);

      const following = (
        await Promise.all(
          followingPage.page.map((follow) => ctx.db.get(follow.recipient)),
        )
      )
        .filter((f) => f !== null)
        .map(({ name, username, image }) => ({ name, username, image }));

      return {
        ...followingPage,
        page: following,
      };
    } catch (err: unknown) {
      console.error(
        `error getting following for user ${args.username}: ${err}`,
      );

      return {
        page: [] as {
          name: string | undefined;
          username: string;
          image: string | undefined;
        }[],
        isDone: true,
        continueCursor: "",
      };
    }
  },
});

export const getFollowersCount = query({
  args: { username: v.string() },
  handler: async (ctx, args) => {
    try {
      const user = await ctx.db
        .query("users")
        .withIndex("username", (q) => q.eq("username", args.username))
        .unique();

      if (!user) return 0;

      const followers = await ctx.db
        .query("follows")
        .withIndex("recipient", (q) => q.eq("recipient", user._id))
        .collect();

      return followers.length;
    } catch (err: unknown) {
      console.error(
        `error getting followers count for user ${args.username}: ${err}`,
      );

      return 0;
    }
  },
});

export const getFollowingCount = query({
  args: { username: v.string() },
  handler: async (ctx, args) => {
    try {
      const user = await ctx.db
        .query("users")
        .withIndex("username", (q) => q.eq("username", args.username))
        .unique();

      if (!user) return 0;

      const following = await ctx.db
        .query("follows")
        .withIndex("sender", (q) => q.eq("sender", user._id))
        .collect();

      return following.length;
    } catch (err: unknown) {
      console.error(
        `error getting following count for user ${args.username}: ${err}`,
      );

      return 0;
    }
  },
});

export const hasVotedInPoll = authedQuery({
  args: {
    pollId: v.id("polls"),
  },
  handler: async (ctx, args) => {
    const existingChoice = await ctx.db
      .query("userChoices")
      .withIndex("by_userId_pollId", (q) =>
        q.eq("userId", ctx.userId).eq("pollId", args.pollId),
      )
      .unique();

    if (!existingChoice) {
      return false;
    }

    return true;
  },
});

export const getCreatedPollsCount = query({
  args: {
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

    const createdPolls = await ctx.db
      .query("polls")
      .withIndex("authorId", (q) => q.eq("authorId", user._id))
      .collect();

    return createdPolls.length;
  },
});
