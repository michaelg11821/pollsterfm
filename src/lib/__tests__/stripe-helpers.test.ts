import {
  getLatestSuccessfulPayment,
  mapPaymentIntentToPaymentData,
} from "@/lib/convex/stripeNode";
import Stripe from "stripe";
import { describe, expect, test } from "vitest";

const paymentIntent = (
  id: string,
  status: Stripe.PaymentIntent.Status,
  created: number,
) =>
  ({
    id,
    status,
    created,
    metadata: { priceId: "price_plus" },
    payment_method: {
      card: {
        brand: "visa",
        last4: "4242",
      },
    },
  }) as unknown as Stripe.PaymentIntent;

describe("getLatestSuccessfulPayment", () => {
  test("returns null when there is no successful payment", () => {
    const latest = getLatestSuccessfulPayment([
      paymentIntent("pi_1", "processing", 10),
      paymentIntent("pi_2", "requires_payment_method", 20),
    ]);

    expect(latest).toBeNull();
  });

  test("returns latest succeeded payment by created timestamp", () => {
    const latest = getLatestSuccessfulPayment([
      paymentIntent("pi_old", "succeeded", 10),
      paymentIntent("pi_new", "succeeded", 20),
      paymentIntent("pi_pending", "processing", 30),
    ]);

    expect(latest?.id).toBe("pi_new");
  });
});

describe("mapPaymentIntentToPaymentData", () => {
  test("maps payment intent into stored payment shape", () => {
    const mapped = mapPaymentIntentToPaymentData(
      paymentIntent("pi_123", "succeeded", 99),
    );

    expect(mapped).toEqual({
      paymentId: "pi_123",
      status: "succeeded",
      created: 99,
      priceId: "price_plus",
      paymentMethod: {
        brand: "visa",
        last4: "4242",
      },
    });
  });
});
