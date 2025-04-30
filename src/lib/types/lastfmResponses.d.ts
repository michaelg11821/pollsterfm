import type { Artist } from "./lastfm";

export type LastfmArtistSearchResponse = {
  results: {
    artistmatches: {
      artist: Artist[] | [];
    };
  };
};

export type LastfmArtistTagsResponse = {
  toptags: {
    tag: Tag[] | [];
  };
};
