import { getAuthUserId } from "@convex-dev/auth/server";
import { Infer, v } from "convex/values";
import { Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";

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

    let profileIcon: string | null | undefined;
    let headerImage: string | null | undefined;

    // spotify image url
    if (user.image?.startsWith("https://")) {
      profileIcon = user.image;
    } else if (!user.image) {
      profileIcon = undefined;
    } else {
      profileIcon = await ctx.storage.getUrl(user.image as Id<"_storage">);
    }

    if (!user.headerImage) {
      headerImage = undefined;
    } else {
      headerImage = await ctx.storage.getUrl(
        user.headerImage as Id<"_storage">,
      );
    }

    return {
      aboutMe: user.aboutMe,
      createdAt: user._creationTime,
      image: profileIcon,
      username: user.username,
      headerImage,
      name: user.name,
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
