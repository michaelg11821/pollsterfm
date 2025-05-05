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
  url: string;
  image: Image[];
};
