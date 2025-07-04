export type Artist = {
  name: string;
  url: string;
};

export type Tag = {
  name: string;
  url: string;
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
