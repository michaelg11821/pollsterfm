import type { Track } from "./spotify";

export interface SpotifyAccessTokenResponse {
  access_token: string;
  token_type: "Bearer";
  expires_in: 3600;
  refresh_token: string;
  scope: string;
}

export interface SpotifyCurrentlyPlayingResponse {
  progress_ms?: number;
  item?: Track;
}
