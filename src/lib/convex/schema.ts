import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { pollValidator, stripePaymentValidator } from "./validators";

const schema = defineSchema({
  ...authTables,
  users: defineTable({
    name: v.optional(v.string()),
    username: v.string(),
    aboutMe: v.optional(v.string()),
    image: v.optional(v.string()),
    headerImage: v.optional(v.string()),
    email: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
    phone: v.optional(v.string()),
    phoneVerificationTime: v.optional(v.number()),
    spotifyProfileLink: v.optional(v.string()),
    lastfmProfileLink: v.optional(v.string()),
    isAnonymous: v.optional(v.boolean()),
    spotifyAccessToken: v.optional(v.string()),
    spotifyRefreshToken: v.optional(v.string()),
    spotifyExpiresAt: v.optional(v.number()),
    lastfmUsername: v.optional(v.string()),
    lastfmSessionKey: v.optional(v.string()),
    stripeCustomerId: v.optional(v.string()),
    listeningHistoryPrivate: v.optional(v.boolean()),
    choices: v.optional(
      v.array(
        v.object({
          artist: v.string(),
          album: v.union(v.string(), v.null()),
          track: v.union(v.string(), v.null()),
          pollId: v.id("polls"),
          affinities: v.array(v.string()),
        }),
      ),
    ),
    createdPolls: v.optional(v.array(pollValidator)),
  })
    .index("email", ["email"])
    .index("username", ["username"]),
  polls: defineTable(pollValidator)
    .index("author", ["author"])
    .index("pollType", ["pollType"])
    .index("expiresAt", ["expiresAt"]),
  lastfmOAuthState: defineTable({
    authCode: v.string(),
    lastfmToken: v.optional(v.string()),
    redirectUri: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("authCode", ["authCode"])
    .index("createdAt", ["createdAt"]),
  follows: defineTable({
    recipient: v.id("users"),
    sender: v.id("users"),
  })
    .index("recipient", ["recipient"])
    .index("sender", ["sender"])
    .index("by_recipient_sender", ["recipient", "sender"]),
  notifications: defineTable({
    description: v.string(),
    link: v.string(),
    userId: v.id("users"),
  }),
  userImageIds: defineTable({
    userId: v.id("users"),
    profileIconId: v.optional(v.id("_storage")),
    headerImageId: v.optional(v.id("_storage")),
  }).index("by_userId", ["userId"]),
  stripeCustomerData: defineTable({
    userId: v.id("users"),
    stripeCustomerId: v.optional(v.string()),
    payment: v.optional(v.union(stripePaymentValidator, v.null())),
  }).index("by_userId", ["userId"]),
});

export default schema;
