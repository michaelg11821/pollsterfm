import type { Artist, PlayHistory, Track } from "./spotify";

export type SpotifyAccessTokenResponse = {
  access_token: string;
  token_type: "Bearer";
  expires_in: 3600;
  refresh_token: string;
  scope: string;
};

export type SpotifyClientCredentialsResponse = {
  access_token: stirng;
  token_type: "Bearer";
  expires_in: 3600;
};

export type SpotifyCurrentlyPlayingResponse = {
  progress_ms: number;
  item: Track;
};

export type SpotifyRecentlyPlayedResponse = {
  next: string | null;
  progress_ms: number;
  items: PlayHistory[];
};

export type SpotifyArtistSearchResponse = {
  artists: {
    items: Artist[];
  };
};

export type SpotifyArtistTopTracksResponse = {
  tracks: Track[];
};
