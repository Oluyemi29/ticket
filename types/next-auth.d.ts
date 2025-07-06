import { Admin, User } from "../generated/prisma";

declare module "next-auth" {
  interface Session {
    user: User & Admin;
  }
}
declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    user: User & Admin;
  }
}
