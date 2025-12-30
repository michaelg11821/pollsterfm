import { getAuthUserId } from "@convex-dev/auth/server";
import { httpAction, internalMutation } from "./_generated/server";

import { v } from "convex/values";
import Stripe from "stripe";
import { api, internal } from "./_generated/api";

const stripe = new Stripe(process.env.STRIPE_SECRET!);

export const setStripeCustomerId = internalMutation({
  args: {
    userId: v.id("users"),
    stripeCustomerId: v.string(),
  },
  handler: async (ctx, { userId, stripeCustomerId }) => {
    await ctx.db.patch(userId, { stripeCustomerId });
  },
});

export const generateStripeCheckout = httpAction(async (ctx) => {
  try {
    const userId = await getAuthUserId(ctx);

    if (!userId) throw new Error("no user logged in");

    const user = await ctx.runQuery(api.user.currentUser);

    if (!user) throw new Error("user not found");

    let stripeCustomerId = user.stripeCustomerId;

    if (!stripeCustomerId) {
      const newCustomer = await stripe.customers.create({
        email: user.email,
        metadata: {
          userId,
        },
      });

      await ctx.runMutation(internal.stripe.setStripeCustomerId, {
        userId,
        stripeCustomerId: newCustomer.id,
      });

      stripeCustomerId = newCustomer.id;
    }

    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,

      line_items: [
        {
          price: process.env.STRIPE_POLLSTER_PLUS_PRICE_ID,
          quantity: 1,
        },
      ],
      mode: "payment",
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
