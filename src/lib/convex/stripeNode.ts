"use node";

import { v } from "convex/values";
import Stripe from "stripe";
import { USER_NOT_FOUND } from "../constants/errors";
import { allowedEvents } from "../constants/stripe";
import type { Payment } from "../types/stripe";
import { api, internal } from "./_generated/api";
import { action, type ActionCtx, internalAction } from "./_generated/server";

export const generateStripeCheckout = action({
  args: {},
  handler: async (ctx): Promise<{ url: string | null }> => {
    try {
      const user = await ctx.runQuery(api.user.currentUser);

      if (!user) throw new Error(USER_NOT_FOUND);

      const stripe = new Stripe(process.env.STRIPE_SECRET!);
      let stripeCustomerId = user.stripeCustomerId;

      if (!stripeCustomerId) {
        const newCustomer = await stripe.customers.create({
          email: user.email,
          metadata: {
            userId: user._id,
          },
        });

        await ctx.runMutation(internal.stripe.createStripeCustomer, {
          stripeCustomerId: newCustomer.id,
        });

        stripeCustomerId = newCustomer.id;
      }

      const session = await stripe.checkout.sessions.create({
        customer: stripeCustomerId,
        line_items: [
          {
            price: process.env.STRIPE_POLLSTER_PLUS_PRICE_ID!,
            quantity: 1,
          },
        ],
        mode: "payment",
        payment_intent_data: {
          metadata: {
            priceId: process.env.STRIPE_POLLSTER_PLUS_PRICE_ID!,
          },
        },
        success_url: `${process.env.SITE_URL}/success`,
      });

      if (!session.url) throw new Error("failed to create session");

      return { url: session.url };
    } catch (err) {
      console.error("error generating stripe checkout:", err);

      return { url: null };
    }
  },
});

export function getLatestSuccessfulPayment(
  paymentIntents: Stripe.PaymentIntent[],
) {
  return (
    paymentIntents
      .filter((pi) => pi.status === "succeeded")
      .sort((a, b) => b.created - a.created)[0] ?? null
  );
}

export function mapPaymentIntentToPaymentData(
  payment: Stripe.PaymentIntent,
): Payment {
  return {
    paymentId: payment.id,
    status: payment.status,
    created: payment.created,
    priceId: payment.metadata.priceId,
    paymentMethod:
      payment.payment_method && typeof payment.payment_method !== "string"
        ? {
            brand: payment.payment_method.card?.brand ?? null,
            last4: payment.payment_method.card?.last4 ?? null,
          }
        : null,
  };
}

const stripePaymentDataSyncer = async (
  ctx: ActionCtx,
  stripeCustomerId: string,
) => {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET!);

    const paymentIntents = await stripe.paymentIntents.list({
      customer: stripeCustomerId,
      limit: 10,
      expand: ["data.payment_method"],
    });

    const latestSuccessfulPayment = getLatestSuccessfulPayment(paymentIntents.data);

    if (!latestSuccessfulPayment) {
      if (stripeCustomerId) {
        const userId = await ctx.runQuery(
          internal.stripe.getUserIdByStripeCustomerId,
          {
            stripeCustomerId,
          },
        );

        if (!userId) return null;

        await ctx.runMutation(internal.stripe._setPaymentDataByUserId, {
          userId,
          payment: { status: "none" },
        });
      }
      return;
    }

    const paymentData = mapPaymentIntentToPaymentData(latestSuccessfulPayment);

    if (stripeCustomerId) {
      const userId = await ctx.runQuery(
        internal.stripe.getUserIdByStripeCustomerId,
        {
          stripeCustomerId,
        },
      );

      if (!userId) return null;

      await ctx.runMutation(internal.stripe._setPaymentDataByUserId, {
        userId,
        payment: paymentData,
      });
    }
  } catch (err: unknown) {
    console.error("error syncing Stripe data:", err);
  }
};

export const syncStripePaymentDataByCustomerId = internalAction({
  args: { stripeCustomerId: v.string() },
  handler: async (ctx, args) => {
    await stripePaymentDataSyncer(ctx, args.stripeCustomerId);
  },
});

export const processEvent = internalAction({
  args: { payload: v.string(), signature: v.string() },
  handler: async (ctx, { payload, signature }) => {
    const stripe = new Stripe(process.env.STRIPE_SECRET!);

    const event = stripe.webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );

    if (!allowedEvents.includes(event.type)) return;

    const { customer: stripeCustomerId } = event?.data?.object as {
      customer: string;
    };

    if (typeof stripeCustomerId !== "string") {
      throw new Error(`id isn't string.\nevent type: ${event.type}`);
    }

    await stripePaymentDataSyncer(ctx, stripeCustomerId);
  }
});
