import { v } from "convex/values";
import { mutation, query } from "../_generated/server";

export const create = mutation({
  args: {
    author: v.string(),
    question: v.string(),
    description: v.optional(v.string()),
    duration: v.number(),
    pollType: v.string(),
    choices: v.array(
      v.object({
        image: v.string(),
        artist: v.string(),
        album: v.union(v.string(), v.null()),
        track: v.union(v.string(), v.null()),
        affinities: v.array(v.string()),
      }),
    ),
  },
  handler: async (ctx, args) => {
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
