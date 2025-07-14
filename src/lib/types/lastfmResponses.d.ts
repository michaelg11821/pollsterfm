import type { Album, Artist, Image, Tag, Track } from "./lastfm";

export type LastfmArtistCorrectionResponse = {
  corrections: {
    correction: {
      artist: {
        name: string;
        url: string;
      };
    };
  };
};

export type LastfmArtistTagsResponse = {
  toptags: {
    tag: Tag[];
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

export type LastfmArtistSearchResponse = {
  results: {
    artistmatches: {
      artist: Artist[];
    };
  };
};

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

export type LastfmAlbumInfoResponse = {
  album: {
    tags: {
      tag: Tag[];
    };
    image: Image[];
    tracks: {
      track: Track[];
    };
    url: string;
    name: string;
  };
};

export type LastfmTrackCorrectionResponse = {
  corrections: {
    correction: {
      track: {
        name: string;
        url: string;
        artist: {
          name: string;
          url: string;
        };
      };
    };
  };
};

export type LastfmTrackInfoResponse = {
  track: {
    toptags: {
      tag: Tag[];
    };
    album: {
      artist: string;
      title: string;
      url: string;
      image: Image[];
    };
    url: string;
    name: string;
  };
};

export type LastfmTrackSearchResponse = {
  results: {
    trackmatches: {
      track: Track[];
    };
  };
};
