import { USER_NOT_FOUND } from "@/lib/constants/errors";
import { v } from "convex/values";
import { query } from "../_generated/server";

export const getReviews = query({
  args: {},
  handler: async (ctx) => {
    const reviews = await ctx.db
      .query("reviews")
      .order("desc")
      .collect();

    const reviewsWithUser = [];

    for (const review of reviews) {
      const user = await ctx.db.get(review.userId);

      if (!user) continue;

      reviewsWithUser.push({
        ...review,
        user: { username: user.username, image: user.image },
      });
    }

    return reviewsWithUser;
  },
});

export const getReviewById = query({
  args: {
    id: v.id("reviews"),
  },
  handler: async (ctx, args) => {
    const review = await ctx.db.get(args.id);

    if (!review) return null;

    const user = await ctx.db.get(review.userId);

    if (!user) return null;

    return {
      ...review,
      user: { username: user.username, image: user.image },
    };
  },
});

export const getUserReviews = query({
  args: { username: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("username", (q) => q.eq("username", args.username))
      .unique();

    if (!user) throw new Error(USER_NOT_FOUND);

    const reviews = await ctx.db
      .query("reviews")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .order("desc")
      .collect();

    return reviews.map((review) => ({
      ...review,
      user: { username: user.username, image: user.image },
    }));
  },
});
