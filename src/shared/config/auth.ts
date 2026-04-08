import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { genericOAuth } from "better-auth/plugins";
import { prisma } from "@/shared/lib/prisma";

export const auth = betterAuth({
  // БД через Prisma адаптер
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

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

            return {
              id: data.id,
              name: data.display_name ?? data.real_name ?? "Пользователь",
              email: data.default_email ?? null,
              emailVerified: !!data.default_email,
              image: data.default_avatar_id
                ? `https://avatars.yandex.net/get-yapic/${data.default_avatar_id}/islands-200`
                : undefined,
            };
          },
        },
      ],
    }),
  ],
});

// Тип сессии для использования в компонентах
export type Session = typeof auth.$Infer.Session;
