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
    const randomAffinities: Affinity[] = [];

    for (let i = 0; i < args.amount; i++) {
      const randomIndex = Math.floor(Math.random() * affinities.length);
      const affinity: Affinity = affinities[randomIndex];

      if (args.upper) {
        randomAffinities.push(capitalize(affinity) as Affinity);
      } else {
        randomAffinities.push(affinity);
      }
    }

    return randomAffinities;
  },
});
