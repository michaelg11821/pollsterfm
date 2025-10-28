import { generateRandomCode, md5 } from "@/lib/convex-utils";
import type { LastfmProfile } from "@/lib/types/lastfmResponses";
import { v } from "convex/values";
import { internal } from "../_generated/api";
import {
  httpAction,
  internalMutation,
  internalQuery,
} from "../_generated/server";

export const getOAuthStateByAuthCode = internalQuery({
  args: {
    authCode: v.string(),
  },
  handler: async (ctx, args) => {
    const result = await ctx.db
      .query("lastfmOAuthState")
      .withIndex("authCode", (q) => q.eq("authCode", args.authCode))
      .first();

    return result;
  },
});

export const storeOAuthState = internalMutation({
  args: {
    authCode: v.string(),
    redirectUri: v.optional(v.string()),
    lastfmToken: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("lastfmOAuthState", {
      authCode: args.authCode,
      redirectUri: args.redirectUri,
      lastfmToken: args.lastfmToken,
      createdAt: Date.now(),
    });
  },
});

export const updateOAuthStateWithToken = internalMutation({
  args: {
    id: v.id("lastfmOAuthState"),
    lastfmToken: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      lastfmToken: args.lastfmToken,
    });
  },
});

export const deleteOAuthState = internalMutation({
  args: {
    id: v.id("lastfmOAuthState"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

/**
 * Creates a signature to sign API calls that require authentication for Last.fm.
 * @param token A token from the Last.fm auth flow.
 * @returns A signature for use in API calls that require authentication for Last.fm.
 */
export function createApiSig(token: string): string {
  const raw = `api_key${process.env.LASTFM_API_KEY}methodauth.getSessiontoken${token}${process.env.LASTFM_SECRET}`;

  return md5(raw);
}

export const lastfmAuthorize = httpAction(async (ctx, request) => {
  const url = new URL(request.url);
  const redirectUri = url.searchParams.get("redirect_uri");

  if (!redirectUri) {
    return new Response("Missing redirect_uri.", { status: 400 });
  }

  const authCode = generateRandomCode();

  try {
    await ctx.runMutation(internal.lastfm.oauth.storeOAuthState, {
      authCode,
      redirectUri,
    });
  } catch (err: unknown) {
    console.error("error storing oauth state:", err);

    return new Response("Error storing OAuth state.", { status: 500 });
  }

  const callbackUrl = `${process.env.CONVEX_HTTP_ACTION_ENDPOINT}/api/lastfm/callback?authCode=${authCode}`;
  const location = `http://www.last.fm/api/auth/?api_key=${process.env.LASTFM_API_KEY}&cb=${encodeURIComponent(callbackUrl)}`;

  return new Response(null, {
    status: 302,
    headers: {
      Location: location,
    },
  });
});

export const lastfmCallback = httpAction(async (ctx, request) => {
  const url = new URL(request.url);
  const token = url.searchParams.get("token");
  const authCode = url.searchParams.get("authCode");

  if (!token || !authCode) {
    return new Response("Missing token or authCode.", { status: 400 });
  }

  try {
    const storedData = await ctx.runQuery(
      internal.lastfm.oauth.getOAuthStateByAuthCode,
      {
        authCode,
      },
    );

    if (!storedData) {
      return new Response("Invalid authCode", { status: 400 });
    }

    await ctx.runMutation(internal.lastfm.oauth.updateOAuthStateWithToken, {
      id: storedData._id,
      lastfmToken: token,
    });

    const finalAuthCode = generateRandomCode();

    await ctx.runMutation(internal.lastfm.oauth.storeOAuthState, {
      authCode: finalAuthCode,
      lastfmToken: token,
      redirectUri: storedData.redirectUri,
    });

    const redirectUrl = new URL(storedData.redirectUri || "");
    redirectUrl.searchParams.set("code", finalAuthCode);

    return new Response(null, {
      status: 302,
      headers: {
        Location: redirectUrl.toString(),
      },
    });
  } catch (err: unknown) {
    console.error("error in attempting to redirect to auth.js:", err);

    return new Response("Error in attempting to redirect to Auth,js.", {
      status: 500,
    });
  }
});

export const lastfmToken = httpAction(async (ctx, request) => {
  const body = await request.text();
  const params = new URLSearchParams(body);
  const code = params.get("code");

  if (!code) {
    return new Response(
      JSON.stringify({
        error: "invalid_request",
        error_description: "No code provided.",
      }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  const storedData = await ctx.runQuery(
    internal.lastfm.oauth.getOAuthStateByAuthCode,
    {
      authCode: code,
    },
  );

  if (!storedData || !storedData.lastfmToken) {
    return new Response(
      JSON.stringify({
        error: "invalid_grant",
        error_description: "Invalid code or missing token.",
      }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  const token = storedData.lastfmToken;
  const sig = createApiSig(token);

  try {
    const res = await fetch(
      `https://ws.audioscrobbler.com/2.0/?method=auth.getSession&api_key=${process.env.LASTFM_API_KEY}&token=${token}&api_sig=${sig}&format=json`,
    );

    const data = await res.json();

    if (!res.ok || data.error) {
      return new Response(
        JSON.stringify({
          error: "invalid_grant",
          error_description:
            data.message || "Failed to get session from Last.fm.",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    if (!data.session || !data.session.key) {
      return new Response(
        JSON.stringify({
          error: "invalid_grant",
          error_description: "Invalid session response from Last.fm.",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    await ctx.runMutation(internal.lastfm.oauth.deleteOAuthState, {
      id: storedData._id,
    });

    const tokenSet = {
      access_token: data.session.key,
      expires_in: 3600,
      token_type: "bearer",
    };

    return new Response(JSON.stringify(tokenSet), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: unknown) {
    console.error("error fetching session token from last.fm:", err);

    return new Response(
      JSON.stringify({
        error: "server_error",
        error_description: "Error fetching session token from Last.fm",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
});

export const lastfmUserinfo = httpAction(async (_, request) => {
  const authHeader = request.headers.get("Authorization");

  if (!authHeader) {
    return new Response(
      JSON.stringify({
        error: "invalid_request",
        error_description: "No 'Authorization' header provided.",
      }),
      {
        status: 401,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  const sessionKey = authHeader.replace("Bearer ", "");

  try {
    const res = await fetch(
      `https://ws.audioscrobbler.com/2.0/?method=user.getInfo&api_key=${process.env.LASTFM_API_KEY}&sk=${sessionKey}&format=json`,
    );

    const data: LastfmProfile = await res.json();

    if (!res.ok || !data.user) {
      return new Response(
        JSON.stringify({
          error: "invalid_token",
          error_description: "Failed to get user info from Last.fm",
        }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    const userInfo = {
      id: md5(data.user.registered.unixtime),
      email: `${data.user.name}@lastfmplaceholder.com`,
      username: data.user.name,
      name: data.user.realname,
      image: data.user.image[1]["#text"],
      lastfmProfileLink: data.user.url,
    };

    return new Response(JSON.stringify(userInfo), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: unknown) {
    console.error("error fetching user info from last.fm:", err);

    return new Response(
      JSON.stringify({
        error: "server_error",
        error_description: "Error fetching user info from Last.fm.",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
});
