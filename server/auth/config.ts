import "server-only";
import type { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import { verifyUser } from "../services/user.service";
import { Role } from "@/lib/types";

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
        if (!parsed.success) {
          throw new Error("Invalid username or password");
        }

        const user = await verifyUser(
          parsed.data.username,
          parsed.data.password
        );

        if (!user) {
          throw new Error("Invalid username or password");
        }

        return user;
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.role = user.role;
      }
      return token;
    },

    async session({ session, token }) {
      session.user = {
        ...session.user,
        id: token.id as string,
        username: token.username as string,
        role: token.role as Role,
      };
      return session;
    },
  },

  pages: {
    signIn: "/signin",
  },
};
