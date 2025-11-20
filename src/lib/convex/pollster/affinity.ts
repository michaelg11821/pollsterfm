import { v } from "convex/values";
import { query } from "../_generated/server";

import { affinities } from "@/lib/constants/affinities";
import { capitalize } from "@/lib/convex-utils";
import type { Affinity } from "@/lib/types/pollster";

export const getAffinities = query({
  args: {},
  handler: async () => {
    return affinities;
  },
});

export const getRandomAffinities = query({
  args: { amount: v.number(), upper: v.boolean() },
  handler: async (_, args) => {
    const shuffled = [...affinities].sort(() => Math.random() - 0.5);

    const selected = shuffled.slice(0, Math.min(args.amount, shuffled.length));

    if (args.upper) {
      return selected.map((affinity) => capitalize(affinity) as Affinity);
    }

    return selected;
  },
});
