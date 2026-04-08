import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields, genericOAuthClient } from "better-auth/client/plugins";
import type { auth } from "./auth";

// Клиент для использования в Client Components
// inferAdditionalFields — типизирует кастомные поля (role) в useSession/session.user
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  plugins: [
    inferAdditionalFields<typeof auth>(),
    genericOAuthClient(),
  ],
});

export const { signIn, signOut, useSession } = authClient;
