import { v } from "convex/values";

export const choiceValidator = v.array(
  v.object({
    image: v.string(),
    artist: v.string(),
    album: v.union(v.string(), v.null()),
    track: v.union(v.string(), v.null()),
    affinities: v.array(v.string()),
    totalVotes: v.number(),
  }),
);

export const pollValidator = v.object({
  author: v.string(),
  question: v.string(),
  description: v.optional(v.string()),
  duration: v.number(),
  pollType: v.string(),
  choices: choiceValidator,
  totalVotes: v.number(),
});
