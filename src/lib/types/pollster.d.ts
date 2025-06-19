import type { Tag } from "./lastfm";

type TopAlbumImage = {
  url: string;
};

export type TopAlbum = {
  name: string;
  images: TopAlbumImage[];
  releaseDate: string | null;
  // rating
};

export type PollsterAlbum = TopAlbum;

export type PollsterGenres = string[] | Tag[] | null;

export type SimilarArtist = {
  name: string;
  image: string | null;
};
