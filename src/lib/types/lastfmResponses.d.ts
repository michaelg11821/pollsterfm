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

export type LastfmProfileResponse = {
  user: {
    name: string;
    age: string;
    subscriber: string;
    realname: string;
    bootstrap: string;
    playcount: string;
    artist_count: string;
    playlists: string;
    track_count: string;
    album_count: string;
    image: Image[];
    registered: {
      unixtime: string;
      "#text": number;
    };
    country: string;
    gender: string;
    url: string;
    type: string;
  };
};

export type LastfmRecentlyPlayedResponse = {
  recenttracks: {
    track: {
      artist: {
        "#text": string;
      };
      image: Image[];
      album: {
        "#text": string;
      };
      name: string;
      "@attr"?: {
        nowplaying: "true";
      };
      date?: {
        uts: string;
        "#text": string;
      };
    }[];
    "@attr": {
      totalPages: string;
      page: string;
      total: string;
    };
  };
};

export type LastfmCurrentlyPlayingResponse = {
  artist: {
    "#text": string;
  };
  image: Image[];
  album: {
    "#text": string;
  };
  name: string;
  "@attr"?: {
    nowplaying: "true";
  };
  date?: {
    uts: string;
    "#text": string;
  };
};
