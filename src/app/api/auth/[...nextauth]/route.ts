import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
import { Admin, User } from "../../../../../generated/prisma";

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        category: {
          label: "Category",
          type: "text",
          placeholder: "Category",
        },
        email: {
          label: "Email",
          type: "email",
          placeholder: "jsmith@gmail.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        const category = credentials?.category as string;
        const email = credentials.email as string;
        const password = credentials.password as string;
        if (category) {
          if (!email || !password || Number(category) < 1) {
            return null;
          }
          const user = await prisma.admin.findUnique({
            where: {
              categoryId: Number(category),
              email,
            },
          });
          if (!user) {
            return null;
          }
          if (!user.password) {
            return null;
          }
          const comparePassword = await bcrypt.compare(password, user.password);
          if (!comparePassword) {
            return null;
          }
          return {
            ...user,
            id: String(user.id),
          };
        } else {
          if (!email || !password) {
            return null;
          }
        }
        const user = await prisma.user.findUnique({
          where: {
            email,
          },
        });
        if (!user) {
          return null;
        }
        if (!user.password) {
          return null;
        }
        const comparePassword = await bcrypt.compare(
          password! as string,
          user.password as string
        );
        if (!comparePassword) {
          return null;
        }
        return {
          ...user,
          id: String(user.id),
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = { ...user, id: Number(user.id) } as Admin & User;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.user) {
        session.user = token.user;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handlers = NextAuth(authOptions as NextAuthOptions);
export { handlers as GET, handlers as POST };
