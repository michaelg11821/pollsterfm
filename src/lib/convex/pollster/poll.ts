import { v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { pollValidator } from "../validators";

export const create = mutation({
  args: pollValidator,
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
