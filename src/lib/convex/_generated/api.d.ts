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
import type * as lastfm_album from "../lastfm/album.js";
import type * as lastfm_artist from "../lastfm/artist.js";
import type * as lastfm_suffix from "../lastfm/suffix.js";
import type * as lastfm_track from "../lastfm/track.js";
import type * as pollster_artist from "../pollster/artist.js";
import type * as pollster_config from "../pollster/config.js";
import type * as spotify_album from "../spotify/album.js";
import type * as spotify_artist from "../spotify/artist.js";
import type * as spotify_credentials from "../spotify/credentials.js";
import type * as spotify_track from "../spotify/track.js";
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
  "lastfm/album": typeof lastfm_album;
  "lastfm/artist": typeof lastfm_artist;
  "lastfm/suffix": typeof lastfm_suffix;
  "lastfm/track": typeof lastfm_track;
  "pollster/artist": typeof pollster_artist;
  "pollster/config": typeof pollster_config;
  "spotify/album": typeof spotify_album;
  "spotify/artist": typeof spotify_artist;
  "spotify/credentials": typeof spotify_credentials;
  "spotify/track": typeof spotify_track;
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
