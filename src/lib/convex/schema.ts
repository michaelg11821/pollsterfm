import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { pollChoiceValidator, stripePaymentValidator } from "./validators";

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
  })
    .index("email", ["email"])
    .index("username", ["username"]),
  polls: defineTable({
    authorId: v.id("users"),
    question: v.string(),
    description: v.optional(v.string()),
    duration: v.number(),
    pollType: v.string(),
    totalVotes: v.number(),
    liveStats: v.optional(
      v.object({
        currentViewers: v.array(v.id("users")),
        votesInLastHour: v.number(),
        peakVotingTime: v.number(),
      }),
    ),
    expiresAt: v.number(),
  })
    .index("authorId", ["authorId"])
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
  pollChoices: defineTable(pollChoiceValidator)
    .index("by_pollId", ["pollId"])
    .index("by_artist", ["artist"])
    .index("by_album", ["artist", "album"])
    .index("by_track", ["artist", "album", "track"]),
  userChoices: defineTable({
    userId: v.id("users"),
    affinities: v.array(v.string()),
    artist: v.string(),
    album: v.union(v.string(), v.null()),
    track: v.union(v.string(), v.null()),
    pollChoiceId: v.id("pollChoices"),
    pollId: v.id("polls"),
  })
    .index("by_userId", ["userId"])
    .index("by_pollId", ["pollId"])
    .index("by_userId_pollId", ["userId", "pollId"]),
  pollActivity: defineTable({
    user: v.object({ username: v.string(), image: v.optional(v.string()) }),
    userId: v.id("users"),
    pollId: v.id("polls"),
    action: v.string(),
    choice: v.string(),
    timestamp: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_pollId", ["pollId"]),
});

export default schema;
