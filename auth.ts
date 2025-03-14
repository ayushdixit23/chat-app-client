import axios from "axios";
import { API } from "./app/utils/constants";
import NextAuth, { CredentialsSignin } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    // Google provider
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    // Custom Credentials provider
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "email", type: "text" },
        password: { label: "password", type: "password" },
      },
      authorize: async (credentials) => {
        const { email, password } = credentials;

        try {
          const res = await axios.post(`${API}/auth/login`, {
            email,
            password,
          });

          if (res.data.success) {
            return {
              id: res.data.user.id,
              email: res.data.user.email,
              fullName: res.data.user.fullName,
              userName: res.data.user.userName,
              about: res.data.user.about,
              profilePic: res.data.user.profilePic,
              accessToken: res.data.token,
            };
          } else {
            return { error: res.data.message || "Invalid credentials" };
          }
        } catch (error: any) {

          if (error?.response) {
            throw new CredentialsSignin(
              error?.response?.data?.message || "Something went wrong."
            );
          } else if (error?.request) {
            throw new CredentialsSignin(
              "Server not responding. Please try again later."
            );
          } else {
            throw new CredentialsSignin(
              "An error occurred during login. Please try again."
            );
          }
        }
      },
    }),
  ],


  session: {
    strategy: "jwt",
    maxAge: 60 * 24 * 60 * 60,
  },

  callbacks: {
    // SignIn Callback

    async signIn({ account, user }: { account: any, user: any }) {

      if (account?.provider === "google") {
        try {
          const res = await axios.post(`${API}/auth/google`, {
            email: user.email,
            fullName: user.name,
            image: user.image,
            id: user.id,
          });

          if (res.data && res.data.user) {
            user.id = res.data.user.id;
            // @ts-ignore
            user.fullName = res.data.user.fullName;
            // @ts-ignore
            user.userName = res.data.user.userName;
            user.profilePic = res.data.user.profilePic;
            user.accessToken = res.data.token;
            user.about = res.data.user.about
          }
        } catch (error) {
          console.error(
            "Error fetching/updating user data from Google login:",
            error
          );
          return false; // Prevent sign-in if the API call fails
        }
      }
      return true;
    },
    
    // @ts-ignore
    async jwt({ token, user, account, trigger, session }: { token: any, user: any, account: any, trigger: any, session: any }) {
      if (user) {

        token.id = user.id;
        token.email = user.email;
        token.fullName = user.fullName;
        token.userName = user.userName;
        token.profilePic = user.profilePic;
        token.accessToken = user.accessToken;
        token.about = user.about;
      }

      if (trigger == "update") {
        if (session?.user?.email) {
          token.email = session.user.email
        }

        if (session?.user?.about) {
          token.about = session.user.about
        }

        if (session?.user?.about) {
          token.about = session.user.about
        }
        if (session?.user?.userName) {
          token.userName = session.user.userName
        }

        if (session?.user?.fullName) {
          token.fullName = session.user.fullName
        }

        if (session?.user?.profilePic) {
          token.profilePic = session.user.profilePic
        }

      }

      return token;
    },

    async session({ session, token }) {
      // Add token info to session
      session.user.id = token.id;
      session.user.email = token.email;
      session.user.fullName = token.fullName;
      session.user.userName = token.userName;
      session.user.profilePic = token.profilePic;
      session.user.accessToken = token.accessToken;
      session.user.about = token.about;
      return session;
    },
  },

  pages: {
    signIn: "/login",
  },

  secret: process.env.AUTH_SECRET,
});
