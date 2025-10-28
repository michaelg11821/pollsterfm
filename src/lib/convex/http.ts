import { httpRouter } from "convex/server";
import { auth } from "./auth";
import {
  lastfmAuthorize,
  lastfmCallback,
  lastfmToken,
  lastfmUserinfo,
} from "./lastfm/oauth";

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

export default http;
