import { v } from "convex/values";

export const choiceValidator = v.object({
  image: v.string(),
  artist: v.string(),
  album: v.union(v.string(), v.null()),
  track: v.union(v.string(), v.null()),
  affinities: v.array(v.string()),
  totalVotes: v.number(),
});

export const activityValidator = v.object({
  user: v.object({ username: v.string(), image: v.optional(v.string()) }),
  action: v.string(),
  choice: v.string(),
  timestamp: v.number(),
});

export const pollValidator = v.object({
  author: v.string(),
  question: v.string(),
  description: v.optional(v.string()),
  duration: v.number(),
  pollType: v.string(),
  choices: v.array(choiceValidator),
  totalVotes: v.number(),
  liveStats: v.optional(
    v.object({
      currentViewers: v.array(v.string()),
      votesInLastHour: v.number(),
      peakVotingTime: v.number(),
    }),
  ),
  recentActivity: v.optional(v.array(activityValidator)),
});
