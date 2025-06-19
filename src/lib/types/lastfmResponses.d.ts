import type { Album, Artist, Tag } from "./lastfm";

export type LastfmArtistSearchResponse = {
  results: {
    artistmatches: {
      artist: Artist[];
    };
  };
};

export type LastfmArtistTagsResponse = {
  toptags: {
    tag: Tag[];
  };
};

export type LastfmArtistTopAlbumsResponse = {
  topalbums: {
    album: Album[];
  };
};

export type LastfmArtistAlbumsResponse = {
  topalbums: {
    album: Album[];
    "@attr": {
      page: string;
      totalPages: string;
    };
  };
};

export type LastfmAlbumTagsResponse = LastfmArtistTagsResponse;

export type LastfmAlbumSearchResponse = {
  results: {
    albummatches: {
      album: Album[];
    };
  };
};

export type LastfmSimilarArtistsResponse = {
  similarartists: {
    artist: Artist[];
  };
};
