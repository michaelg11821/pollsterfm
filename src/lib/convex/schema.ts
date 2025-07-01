import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const schema = defineSchema({
  ...authTables,
  users: defineTable({
    name: v.optional(v.string()),
    username: v.string(),
    aboutMe: v.optional(v.string()),
    image: v.optional(v.union(v.string(), v.id("_storage"))),
    headerImage: v.optional(v.id("_storage")),
    email: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
    phone: v.optional(v.string()),
    phoneVerificationTime: v.optional(v.number()),
    spotifyProfileLink: v.optional(v.string()),
    isAnonymous: v.optional(v.boolean()),
    spotifyAccessToken: v.optional(v.string()),
    spotifyRefreshToken: v.optional(v.string()),
    spotifyExpiresAt: v.optional(v.number()),
  })
    .index("email", ["email"])
    .index("username", ["username"]),
});

export default schema;
