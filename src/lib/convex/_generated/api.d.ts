/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as auth from "../auth.js";
import type * as files from "../files.js";
import type * as http from "../http.js";
import type * as lastfm_album from "../lastfm/album.js";
import type * as lastfm_oauth from "../lastfm/oauth.js";
import type * as misc from "../misc.js";
import type * as pollster_affinity from "../pollster/affinity.js";
import type * as pollster_album from "../pollster/album.js";
import type * as pollster_artist from "../pollster/artist.js";
import type * as pollster_config from "../pollster/config.js";
import type * as pollster_poll from "../pollster/poll.js";
import type * as pollster_track from "../pollster/track.js";
import type * as spotify_album from "../spotify/album.js";
import type * as spotify_user from "../spotify/user.js";
import type * as user from "../user.js";
import type * as validators from "../validators.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  files: typeof files;
  http: typeof http;
  "lastfm/album": typeof lastfm_album;
  "lastfm/oauth": typeof lastfm_oauth;
  misc: typeof misc;
  "pollster/affinity": typeof pollster_affinity;
  "pollster/album": typeof pollster_album;
  "pollster/artist": typeof pollster_artist;
  "pollster/config": typeof pollster_config;
  "pollster/poll": typeof pollster_poll;
  "pollster/track": typeof pollster_track;
  "spotify/album": typeof spotify_album;
  "spotify/user": typeof spotify_user;
  user: typeof user;
  validators: typeof validators;
}>;
declare const fullApiWithMounts: typeof fullApi;

export declare const api: FilterApi<
  typeof fullApiWithMounts,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApiWithMounts,
  FunctionReference<any, "internal">
>;

export declare const components: {
  actionCache: {
    crons: {
      purge: FunctionReference<
        "mutation",
        "internal",
        { expiresAt?: number },
        null
      >;
    };
    lib: {
      get: FunctionReference<
        "query",
        "internal",
        { args: any; name: string; ttl: number | null },
        { kind: "hit"; value: any } | { expiredEntry?: string; kind: "miss" }
      >;
      put: FunctionReference<
        "mutation",
        "internal",
        {
          args: any;
          expiredEntry?: string;
          name: string;
          ttl: number | null;
          value: any;
        },
        { cacheHit: boolean; deletedExpiredEntry: boolean }
      >;
      remove: FunctionReference<
        "mutation",
        "internal",
        { args: any; name: string },
        null
      >;
      removeAll: FunctionReference<
        "mutation",
        "internal",
        { batchSize?: number; before?: number; name?: string },
        null
      >;
    };
  };
};
