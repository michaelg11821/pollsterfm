import { affinities } from "../constants/affinities";
import { pollTypes } from "../constants/polls";

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

export type SimilarArtist = {
  name: string;
  image: string | null;
};

export type PollType = (typeof pollTypes)[number];

export type Affinity = (typeof affinities)[number];
