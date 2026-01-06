import { getAuthUserId } from "@convex-dev/auth/server";
import {
  customMutation,
  customQuery,
} from "convex-helpers/server/customFunctions";
import { UNAUTHORIZED } from "../constants/errors";
import {
  internalMutation,
  internalQuery,
  mutation,
  query,
} from "./_generated/server";

export const authedQuery = customQuery(query, {
  args: {},
  input: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (userId === null) {
      throw new Error(UNAUTHORIZED);
    }

    return {
      ctx: { ...ctx, userId },
      args,
    };
  },
});

export const authedInternalQuery = customQuery(internalQuery, {
  args: {},
  input: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (userId === null) {
      throw new Error(UNAUTHORIZED);
    }

    return {
      ctx: { ...ctx, userId },
      args,
    };
  },
});

export const authedMutation = customMutation(mutation, {
  args: {},
  input: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (userId === null) {
      throw new Error(UNAUTHORIZED);
    }

    return {
      ctx: { ...ctx, userId },
      args,
    };
  },
});

export const authedInternalMutation = customMutation(internalMutation, {
  args: {},
  input: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (userId === null) {
      throw new Error(UNAUTHORIZED);
    }

    return {
      ctx: { ...ctx, userId },
      args,
    };
  },
});
