import { query } from "../_generated/server";

import { affinities } from "@/lib/constants/affinities";

export const getAffinities = query({
  args: {},
  handler: async () => {
    return affinities;
  },
});
