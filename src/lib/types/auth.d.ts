import { type DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      username: string;
    } & DefaultSession["user"];
    access_token?: string;
    refresh_token?: string;
    expires_at?: number;
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `auth`, when using JWT sessions */
  interface JWT {
    access_token?: string;
    refresh_token?: string;
    expires_at?: number;
    user: Session.user;
  }
}
