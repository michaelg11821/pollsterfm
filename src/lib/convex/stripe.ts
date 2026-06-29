import { getAuthUserId } from "@convex-dev/auth/server";
import {
  httpAction,
  internalMutation,
  internalQuery,
  query,
} from "./_generated/server";

import { v } from "convex/values";
import { NO_STRIPE_CUSTOMER } from "../constants/errors";
import { api, internal } from "./_generated/api";
import { authedInternalMutation, authedInternalQuery } from "./helpers";
import { stripePaymentValidator } from "./validators";

export const getStripeCustomerId = authedInternalQuery({
  handler: async (ctx) => {
    const user = await ctx.db.get(ctx.userId);
    if (user?.stripeCustomerId) return user.stripeCustomerId;

    const stripeData = await ctx.db
      .query("stripeCustomerData")
      .withIndex("by_userId", (q) => q.eq("userId", ctx.userId))
      .unique();

    if (!stripeData) return undefined;

    return stripeData.stripeCustomerId;
  },
});

export const getPaymentStatus = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) return { hasPaid: false };

    const stripeData = await ctx.db
      .query("stripeCustomerData")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();

    if (!stripeData || !stripeData.payment) return { hasPaid: false };

    const payment = stripeData.payment;

    if ("status" in payment && payment.status === "succeeded") {
      return { hasPaid: true };
    }

    return { hasPaid: false };
  },
});

export const createStripeCustomer = authedInternalMutation({
  args: {
    stripeCustomerId: v.string(),
  },
  handler: async (ctx, args) => {
    const { userId } = ctx;
    const { stripeCustomerId } = args;

    const stripeCustomerData = await ctx.db
      .query("stripeCustomerData")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();

    await ctx.db.patch(userId, { stripeCustomerId });

    if (!stripeCustomerData) {
      await ctx.db.insert("stripeCustomerData", { userId, stripeCustomerId });
      return;
    }

    if (
      stripeCustomerData.stripeCustomerId &&
      stripeCustomerData.stripeCustomerId !== stripeCustomerId
    ) {
      throw new Error("stripe customer id mismatch for user");
    }

    await ctx.db.patch(stripeCustomerData._id, { stripeCustomerId });
  },
});

export const setPaymentData = authedInternalMutation({
  args: {
    payment: stripePaymentValidator,
  },
  handler: async (ctx, args) => {
    const { userId } = ctx;
    const { payment } = args;

    const stripeCustomerData = await ctx.db
      .query("stripeCustomerData")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();

    if (!stripeCustomerData) throw new Error(NO_STRIPE_CUSTOMER);

    await ctx.db.patch(stripeCustomerData._id, { payment });
  },
});

export const getUserIdByStripeCustomerId = internalQuery({
  args: {
    stripeCustomerId: v.string(),
  },
  handler: async (ctx, args) => {
    const stripeData = await ctx.db
      .query("stripeCustomerData")
      .withIndex("by_stripeCustomerId", (q) =>
        q.eq("stripeCustomerId", args.stripeCustomerId),
      )
      .unique();

    if (!stripeData) return null;

    return stripeData.userId;
  },
});

export const _setPaymentDataByUserId = internalMutation({
  args: {
    userId: v.id("users"),
    payment: stripePaymentValidator,
  },
  handler: async (ctx, args) => {
    const stripeCustomerData = await ctx.db
      .query("stripeCustomerData")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .unique();

    if (!stripeCustomerData) throw new Error(NO_STRIPE_CUSTOMER);

    await ctx.db.patch(stripeCustomerData._id, { payment: args.payment });
  },
});

export const syncStripePaymentData = httpAction(async (ctx) => {
  const user = await ctx.runQuery(api.user.currentUser);

  if (!user?.stripeCustomerId) {
    return new Response(null, {
      status: 302,
      headers: { Location: "/" },
    });
  }

  await ctx.runAction(internal.stripeNode.syncStripePaymentDataByCustomerId, {
    stripeCustomerId: user.stripeCustomerId,
  });

  return new Response(null, {
    status: 302,
    headers: { Location: "/" },
  });
});

export const stripeWebhook = httpAction(async (ctx, req) => {
  try {
    const body = await req.text();
    const signature = req.headers.get("Stripe-Signature");

    if (!signature) return Response.json({}, { status: 400 });

    if (typeof signature !== "string") {
      throw new Error("stripe header is not a string");
    }

    await ctx.scheduler.runAfter(0, internal.stripeNode.processEvent, {
      payload: body,
      signature,
    });
  } catch (err: unknown) {
    console.error("error processing events:", err);
  } finally {
    return Response.json({ received: true });
  }
});
