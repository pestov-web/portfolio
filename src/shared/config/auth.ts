import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { prisma } from "@/shared/lib/prisma";

export const auth = betterAuth({
  // БД через Prisma адаптер
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  // OAuth провайдеры
  socialProviders: {
    github: {
      clientId: process.env.AUTH_GITHUB_ID!,
      clientSecret: process.env.AUTH_GITHUB_SECRET!,
    },
    google: {
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    },
  },

  // Страницы авторизации
  pages: {
    signIn: "/login",
    error: "/login",
  },

  plugins: [
    // Автоматически устанавливает cookies в Server Actions (Next.js 16)
    nextCookies(),
  ],
});

// Тип сессии для использования в компонентах
export type Session = typeof auth.$Infer.Session;
