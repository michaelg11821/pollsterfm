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

    await ctx.db.patch(args.pollId, {
      totalVotes: poll.totalVotes + 1,
      choices: pollChoicesCopy,
    });

    return null;
  },
});
