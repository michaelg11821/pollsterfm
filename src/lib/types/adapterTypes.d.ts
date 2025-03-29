export type Awaitable<T> = T | PromiseLike<T>;

export type AdapterUser = {
  email: string;
  emailVerified: null | Date;
  id: string;
  image: null | string;
  name: string;
  username: string;
};
