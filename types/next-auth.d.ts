import NextAuth, { type DefaultSession } from "next-auth"

export type ExtendedUser = Omit<DefaultSession["user"], "name" | "image"> & {
  id: string
  email: string
  fullName: string
  userName: string
  profilePic: string
  about:string
  accessToken: string
}

declare module "next-auth" {
  interface Session {
    user: ExtendedUser
  }
}

import { JWT } from "next-auth/jwt"

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `auth`, when using JWT sessions */
  interface JWT {
    id: string
    email: string
    fullName: string
    userName: string
    profilePic: string
    accessToken: string
    about:string
  }
}


export type User = {
  _id: string
  id: string
  fullName: string
  userName: string
  profilePic: string
  email: string
  about: string
  bio:string
  friends: string[]
  sentFriendRequests: string[]
}