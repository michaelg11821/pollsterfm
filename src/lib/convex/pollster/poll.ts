import { TRENDING_VOTE_COUNT } from "@/lib/constants/polls";
import { oneDayMs } from "@/lib/constants/time";
import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { pollValidator } from "../validators";

export const create = mutation({
  args: pollValidator,
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (userId === null) {
      throw new Error("user not logged in");
    }

    const user = await ctx.db.get(userId);

    if (user === null) {
      throw new Error("user not found");
    }

    const createdPollsCopy = user.createdPolls ? [...user.createdPolls] : [];

    await ctx.db.patch(userId, { createdPolls: [...createdPollsCopy, args] });

    return await ctx.db.insert("polls", args);
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

    const user = await ctx.db.get(userId);

    if (user === null) {
      throw new Error("user not found");
    }

    if (!poll.liveStats) {
      const newLiveStats = {
        currentViewers: [user.username],
        votesInLastHour: poll.totalVotes,
        peakVotingTime: poll.totalVotes >= 1 ? Date.now() : 0,
      };

      return await ctx.db.patch(args.id, { liveStats: newLiveStats });
    } else {
      if (
        poll.liveStats.currentViewers.find(
          (username) => username === user.username,
        )
      ) {
        // user is already viewing poll

        return null;
      }

      return await ctx.db.patch(args.id, {
        liveStats: {
          ...poll.liveStats,
          currentViewers: [...poll.liveStats.currentViewers, user.username],
        },
      });
    }
  },
});

export const unview = mutation({
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

    const user = await ctx.db.get(userId);

    if (user === null) {
      throw new Error("user not found");
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
            (username) => username !== user.username,
          ),
        },
      });
    }
  },
});

export const getPopularPolls = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("polls")
      .filter((q) =>
        q.and(
          q.gt(q.field("totalVotes"), TRENDING_VOTE_COUNT),
          q.lt(q.sub(Date.now(), q.field("_creationTime")), oneDayMs),
        ),
      )
      .collect();
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

export const getMyPolls = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);

    if (userId === null) {
      return null;
    }

    const user = await ctx.db.get(userId);

    if (user === null) {
      return null;
    }

    return await ctx.db
      .query("polls")
      .withIndex("author", (q) => q.eq("author", user.username))
      .order("desc")
      .collect();
  },
});

export const getUserPolls = query({
  args: { username: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("polls")
      .withIndex("author", (q) => q.eq("author", args.username))
      .order("desc")
      .collect();
  },
});
