import { ActionCtx, httpAction } from "./_generated/server";

import { v } from "convex/values";
import { after } from "next/server";
import Stripe from "stripe";
import { NO_STRIPE_CUSTOMER, USER_NOT_FOUND } from "../constants/errors";
import { allowedEvents } from "../constants/stripe";
import type { Payment } from "../types/stripe";
import { api, internal } from "./_generated/api";
import { authedInternalMutation, authedInternalQuery } from "./helpers";
import { stripePaymentValidator } from "./validators";

const stripe = new Stripe(process.env.STRIPE_SECRET!);

export const getStripeCustomerId = authedInternalQuery({
  handler: async (ctx) => {
    const stripeData = await ctx.db
      .query("stripeCustomerData")
      .withIndex("by_userId", (q) => q.eq("userId", ctx.userId))
      .unique();

    if (!stripeData) return undefined;

    return stripeData.stripeCustomerId;
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

    if (stripeCustomerData) {
      throw new Error("user attempting to pay twice");
    }

    await ctx.db.insert("stripeCustomerData", { userId, stripeCustomerId });
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

export const generateStripeCheckout = httpAction(async (ctx) => {
  try {
    const user = await ctx.runQuery(api.user.currentUser);

    if (!user) throw new Error(USER_NOT_FOUND);

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

    return Response.redirect(session.url, 303);
  } catch (err: unknown) {
    console.error("error generating stripe checkout:", err);

    return Response.json(
      { error: "Error generating Stripe checkout." },
      { status: 500 },
    );
  }
});

const stripePaymentDataSyncer = async (ctx: ActionCtx) => {
  try {
    const customerId = await ctx.runQuery(internal.stripe.getStripeCustomerId);

    if (!customerId)
      return new Response(null, {
        status: 302,
        headers: {
          Location: "/",
        },
      });

    const paymentIntents = await stripe.paymentIntents.list({
      customer: customerId,
      limit: 10,
      expand: ["data.payment_method"],
    });

    const successfulPayments = paymentIntents.data
      .filter((pi) => pi.status === "succeeded")
      .sort((a, b) => b.created - a.created);

    if (successfulPayments.length === 0) {
      await ctx.runMutation(internal.stripe.setPaymentData, {
        payment: { status: "none" },
      });

      return new Response(null, {
        status: 302,
        headers: {
          Location: "/",
        },
      });
    }

    const payment = successfulPayments[0];
    const priceId = payment.metadata.priceId;

    const paymentData: Payment = {
      paymentId: payment.id,
      status: payment.status,
      created: payment.created,
      priceId,
      paymentMethod:
        payment.payment_method && typeof payment.payment_method !== "string"
          ? {
              brand: payment.payment_method.card?.brand ?? null,
              last4: payment.payment_method.card?.last4 ?? null,
            }
          : null,
    };

    await ctx.runMutation(internal.stripe.setPaymentData, {
      payment: paymentData,
    });
  } catch (err: unknown) {
    console.error("error syncing Stripe data:", err);
  } finally {
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/",
      },
    });
  }
};

export const syncStripePaymentData = httpAction(stripePaymentDataSyncer);

async function processEvent(ctx: ActionCtx, event: Stripe.Event) {
  if (!allowedEvents.includes(event.type)) return;

  const { customer: stripeCustomerId } = event?.data?.object as {
    customer: string;
  };

  if (typeof stripeCustomerId !== "string") {
    throw new Error(`id isn't string.\nevent type: ${event.type}`);
  }

  return await stripePaymentDataSyncer(ctx);
}

export const stripeWebhook = httpAction(async (ctx, req) => {
  try {
    const body = await req.text();
    const signature = req.headers.get("Stripe-Signature");

    if (!signature) return Response.json({}, { status: 400 });

    async function doEventProcessing() {
      if (typeof signature !== "string") {
        throw new Error("stripe header is not a string");
      }

      const event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!,
      );

      after(processEvent(ctx, event));
    }

    await doEventProcessing();
  } catch (err: unknown) {
    console.error("error processing events:", err);
  } finally {
    return Response.json({ recieved: true });
  }
});
