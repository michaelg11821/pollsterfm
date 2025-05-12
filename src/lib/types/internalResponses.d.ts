export type UpdateProfileResult =
  | { success: true }
  | {
      success: false;
      errors: { path: (string | number)[]; message: string }[];
    };

export type FirstArtistResult = {
  name: string;
  image: string | null;
  genres: string[] | Tag[] | null;
  spotifyUrl: string | null;
  lastfmUrl: string | null;
};
