import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const generateUploadUrl = mutation({
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const getProfileIconStorageId = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);

    if (userId === null) return null;

    const userImageIds = await ctx.db
      .query("userImageIds")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();

    if (userImageIds === null) return null;

    return userImageIds.profileIconId;
  },
});

export const getHeaderImageStorageId = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);

    if (userId === null) return null;

    const userImageIds = await ctx.db
      .query("userImageIds")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();

    if (userImageIds === null) return null;

    return userImageIds.headerImageId;
  },
});

export const deleteById = mutation({
  args: {
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    return await ctx.storage.delete(args.storageId);
  },
});
