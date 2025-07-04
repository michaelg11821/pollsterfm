export type Artist = {
  name: string;
  url: string;
};

export type Tag = {
  name: string;
  url: string;
};

export type ArtistFromSearch = {
  name: string;
  url: string;
  image: null;
  genres: Tag[] | null;
};

export type Image = {
  /**
   * An image URL.
   */
  "#text": string;
  size: "small" | "medium" | "large" | "extralarge";
};

export type Album = {
  name: string;
  artist: string;
  url: string;
  image: Image[];
};

export type AlbumFromSearch = {
  name: string;
  artist: string;
  image: Image[];
  genres: Tag[] | null;
  url: string;
};

export type Track = {
  duration: number;
  url: string;
  name: string;
  "@attr": {
    /**
     * Track number on its corresponding album.
     */
    rank: number;
  };
  artist: {
    name: string;
  };
  album: {
    title: string;
  };
};

export type TrackFromSearch = {
  name: string;
  artist: {
    name: string;
  };
  image: string | null;
  genres: Tag[] | null;
  url: string;
  albumName: string;
};
