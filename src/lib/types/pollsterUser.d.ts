export type PollsterUser = {
  id: string;
  name: string;
  username: string;
  pronouns: null | string;
  aboutMe: null | string;
  email: string;
  emailVerified: null | Date;
  image: null | string;
  createdAt: string;
  updatedAt: string;
};

export type PollsterProfile = {
  pronouns: string;
  aboutMe: string;
  createdAt: string;
  image: string;
  name: string;
};
