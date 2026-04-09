import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { genericOAuth } from "better-auth/plugins";
import { prisma } from "@/shared/lib/prisma";
import { mapYandexUserInfo } from "@/shared/lib/yandex-oauth";

const baseURL = process.env.BETTER_AUTH_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
const trustedOrigins = Array.from(new Set([
  baseURL,
  "http://localhost:3000",
  "http://localhost:3001",
])).filter(Boolean);

export const auth = betterAuth({
  baseURL,
  trustedOrigins,

  // БД через Prisma адаптер
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  account: {
    encryptOAuthTokens: true,
  },

  rateLimit: {
    enabled: true,
    window: 10,
    max: 100,
  },

  // Регистрируем кастомное поле role — чтобы оно было в сессии
  user: {
    additionalFields: {
      role: {
        type: ["USER", "FRIEND", "ADMIN"] as const,
        required: false,
        defaultValue: "USER",
        input: false, // пользователь не может менять роль сам
      },
    },
  },

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

    // Яндекс OAuth через generic-oauth (нет встроенного провайдера)
    genericOAuth({
      config: [
        {
          providerId: "yandex",
          clientId: process.env.AUTH_YANDEX_ID!,
          clientSecret: process.env.AUTH_YANDEX_SECRET!,
          authorizationUrl: "https://oauth.yandex.ru/authorize",
          tokenUrl: "https://oauth.yandex.ru/token",
          scopes: ["login:email", "login:info", "login:avatar"],
          // Яндекс возвращает нестандартный формат — маппим вручную
          getUserInfo: async (tokens) => {
            const res = await fetch("https://login.yandex.ru/info?format=json", {
              headers: { Authorization: `OAuth ${tokens.accessToken}` },
            });
            if (!res.ok) return null;

            const data = await res.json() as {
              id: string;
              display_name?: string;
              real_name?: string;
              default_email?: string;
              default_avatar_id?: string;
            };

            return mapYandexUserInfo(data);
          },
        },
      ],
    }),
  ],
});

// Тип сессии для использования в компонентах
export type Session = typeof auth.$Infer.Session;
