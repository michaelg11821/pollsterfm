import { getAuthUserId } from "@convex-dev/auth/server";
import { type Infer, v } from "convex/values";
import { capitalize, getChoiceItemName } from "../convex-utils";
import type { PollActivity } from "../types/pollster";
import type { Id } from "./_generated/dataModel";
import { mutation, query, QueryCtx } from "./_generated/server";

export const currentUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);

    if (userId === null) {
      return null;
    }

    return await ctx.db.get(userId);
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
      const userId = await getAuthUserId(ctx);

      if (userId === null) {
        return null;
      }

      user = await ctx.db.get(userId);
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
    const userId = await getAuthUserId(ctx);

    if (userId === null) {
      throw new Error("user not logged in");
    }

    const user = await ctx.db.get(userId);

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

    await ctx.db.patch(userId, { choices: newChoices });

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
