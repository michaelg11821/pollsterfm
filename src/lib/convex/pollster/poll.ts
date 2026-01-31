import { USER_NOT_FOUND } from "@/lib/constants/errors";
import { TRENDING_VOTE_COUNT } from "@/lib/constants/polls";
import { oneDayMs } from "@/lib/constants/time";
import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import type { Doc } from "../_generated/dataModel";
import { mutation, query, type QueryCtx } from "../_generated/server";
import { authedMutation } from "../helpers";
import { createPollValidator } from "../validators";

export const create = authedMutation({
  args: createPollValidator,
  handler: async (ctx, args) => {
    const { choices, ...poll } = args;

    try {
      const pollId = await ctx.db.insert("polls", poll);

      for (const choice of choices) {
        await ctx.db.insert("pollChoices", { ...choice, pollId });
      }

      return pollId;
    } catch (err: unknown) {
      console.error("error creating poll:", err);
    }
  },
});

export const getById = query({
  args: {
    id: v.id("polls"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const getChoicesById = query({
  args: {
    id: v.optional(v.id("polls")),
  },
  handler: async (ctx, args) => {
    const { id } = args;

    if (id === undefined) return [];

    return await ctx.db
      .query("pollChoices")
      .withIndex("by_pollId", (q) => q.eq("pollId", id))
      .collect();
  },
});

export const getPolls = query({
  handler: async (ctx) => {
    return await ctx.db.query("polls").collect();
  },
});

export const view = mutation({
  args: {
    id: v.id("polls"),
  },
  handler: async (ctx, args) => {
    const poll = await ctx.db.get(args.id);

    if (poll === null) {
      throw new Error("poll not found");
    }

    const userId = await getAuthUserId(ctx);

    if (userId === null) {
      throw new Error("user not logged in");
    }

    if (!poll.liveStats) {
      const newLiveStats = {
        currentViewers: [userId],
        votesInLastHour: poll.totalVotes,
        peakVotingTime: poll.totalVotes >= 1 ? Date.now() : 0,
      };

      return await ctx.db.patch(args.id, { liveStats: newLiveStats });
    } else {
      if (
        poll.liveStats.currentViewers.find((username) => username === userId)
      ) {
        // user is already viewing poll

        return null;
      }

      return await ctx.db.patch(args.id, {
        liveStats: {
          ...poll.liveStats,
          currentViewers: [...poll.liveStats.currentViewers, userId],
        },
      });
    }
  },
});

export const unview = mutation({
  args: {
    id: v.id("polls"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const poll = await ctx.db.get(args.id);

    if (poll === null) {
      throw new Error("poll not found");
    }

    if (!poll.liveStats) {
      const newLiveStats = {
        currentViewers: [],
        votesInLastHour: poll.totalVotes,
        peakVotingTime: poll.totalVotes >= 1 ? Date.now() : 0,
      };

      return await ctx.db.patch(args.id, { liveStats: newLiveStats });
    } else {
      return await ctx.db.patch(args.id, {
        liveStats: {
          ...poll.liveStats,
          currentViewers: poll.liveStats.currentViewers.filter(
            (userId) => userId !== args.userId,
          ),
        },
      });
    }
  },
});

export const getPopularPolls = query({
  handler: async (ctx) => {
    const pollDocs = await ctx.db
      .query("polls")
      .filter((q) =>
        q.and(
          q.gt(q.field("totalVotes"), TRENDING_VOTE_COUNT),
          q.lt(q.sub(Date.now(), q.field("_creationTime")), oneDayMs),
        ),
      )
      .collect();

    const popularPollsWithChoices: (Doc<"polls"> & {
      choices: Doc<"pollChoices">[];
    })[] = [];

    for (const pollDoc of pollDocs) {
      const choices = await ctx.db
        .query("pollChoices")
        .withIndex("by_pollId", (q) => q.eq("pollId", pollDoc._id))
        .collect();

      popularPollsWithChoices.push({ ...pollDoc, choices });
    }

    return popularPollsWithChoices;
  },
});

export const getMostPopularPoll = query({
  handler: async (ctx) => {
    const now = Date.now();

    const activePolls = await ctx.db
      .query("polls")
      .filter((q) => q.gt(q.field("expiresAt"), now))
      .collect();

    if (activePolls.length > 0) {
      return activePolls.reduce((mostPopular, current) =>
        current.totalVotes > mostPopular.totalVotes ? current : mostPopular,
      );
    }

    const allPolls = await ctx.db.query("polls").collect();

    if (allPolls.length === 0) return null;

    return allPolls.reduce((mostPopular, current) =>
      current.totalVotes > mostPopular.totalVotes ? current : mostPopular,
    );
  },
});

export const getUserPolls = query({
  args: { username: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("username", (q) => q.eq("username", args.username))
      .unique();

    if (!user) throw new Error(USER_NOT_FOUND);

    return await ctx.db
      .query("polls")
      .withIndex("authorId", (q) => q.eq("authorId", user._id))
      .order("desc")
      .collect();
  },
});

export const getRecentActivity = query({
  args: { pollId: v.id("polls") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("pollActivity")
      .withIndex("by_pollId", (q) => q.eq("pollId", args.pollId))
      .order("desc")
      .collect();
  },
});

export async function getPollsFromChoices(
  ctx: QueryCtx,
  choices: Doc<"pollChoices">[],
) {
  const polls: (Doc<"polls"> | null)[] = [];
  for (const choice of choices) {
    const poll = await ctx.db.get(choice.pollId);
    polls.push(poll);
  }

  return polls.filter((poll) => poll !== null);
}
