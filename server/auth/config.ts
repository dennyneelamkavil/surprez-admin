import "server-only";
import type { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import { verifyUser } from "../services/user.service";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },

  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(creds) {
        const schema = z.object({
          username: z.string().min(3),
          password: z.string().min(6),
        });

        const parsed = schema.safeParse(creds);
        if (!parsed.success) return null;

        return verifyUser(parsed.data.username, parsed.data.password);
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
      }
      return token;
    },

    async session({ session, token }) {
      session.user.id = token.id;
      session.user.username = token.username;
      return session;
    },
  },

  pages: {
    signIn: "/auth/sign-in",
  },
};
