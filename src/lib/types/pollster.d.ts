import type { Infer } from "convex/values";
import { affinities } from "../constants/affinities";
import { platforms } from "../constants/platforms";
import { pollTypes } from "../constants/polls";
import type { Doc } from "../convex/_generated/dataModel";
import { activityValidator, pollChoiceValidator } from "../convex/validators";

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
export type CatalogItemType = PollType;

export type Affinity = (typeof affinities)[number];

export type Choice = Infer<typeof pollChoiceValidator>;
export type ChoiceInfo = Pick<Choice, PollType>;

export type Poll = Doc<"polls">;

export type PollActivity = Infer<typeof activityValidator>;

export type Platform = (typeof platforms)[number];
