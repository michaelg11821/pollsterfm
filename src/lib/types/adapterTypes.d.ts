export type Awaitable<T> = T | PromiseLike<T>;

export type AdapterUser = {
  email: string;
  image: null | string;
  username: string;
};
