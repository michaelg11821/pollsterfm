/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as auth from "../auth.js";
import type * as files from "../files.js";
import type * as http from "../http.js";
import type * as pollster_album from "../pollster/album.js";
import type * as pollster_artist from "../pollster/artist.js";
import type * as pollster_config from "../pollster/config.js";
import type * as pollster_track from "../pollster/track.js";
import type * as spotify_user from "../spotify/user.js";
import type * as user from "../user.js";

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
  "pollster/album": typeof pollster_album;
  "pollster/artist": typeof pollster_artist;
  "pollster/config": typeof pollster_config;
  "pollster/track": typeof pollster_track;
  "spotify/user": typeof spotify_user;
  user: typeof user;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
