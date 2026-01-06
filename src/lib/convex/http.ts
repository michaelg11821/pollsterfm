import { httpRouter } from "convex/server";
import { auth } from "./auth";
import {
  lastfmAuthorize,
  lastfmCallback,
  lastfmToken,
  lastfmUserinfo,
} from "./lastfm/oauth";
import { stripeWebhook, syncStripePaymentData } from "./stripe";

const http = httpRouter();

auth.addHttpRoutes(http);

http.route({
  path: "/api/lastfm/authorize",
  method: "GET",
  handler: lastfmAuthorize,
});

http.route({
  path: "/api/lastfm/callback",
  method: "GET",
  handler: lastfmCallback,
});

http.route({
  path: "/api/lastfm/token",
  method: "POST",
  handler: lastfmToken,
});

http.route({
  path: "/api/lastfm/userinfo",
  method: "GET",
  handler: lastfmUserinfo,
});

http.route({
  path: "/success",
  method: "GET",
  handler: syncStripePaymentData,
});

http.route({
  path: "/api/stripe",
  method: "POST",
  handler: stripeWebhook,
});

export default http;
