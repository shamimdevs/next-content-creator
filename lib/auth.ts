import "server-only";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { APP_CONFIG, CREDIT_REASONS } from "@/config/app.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "database",
  },
  callbacks: {
    session({ session, user }) {
      session.user.id = user.id;
      return session;
    },
  },
  events: {
    async createUser({ user }) {
      // Grant signup bonus credits with audit log
      if (!user.id) return;
      await prisma.creditLog.create({
        data: {
          userId: user.id,
          delta: APP_CONFIG.defaultCredits,
          reason: CREDIT_REASONS.signupBonus,
        },
      });
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
});
