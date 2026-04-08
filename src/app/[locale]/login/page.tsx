"use client";

import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { authClient } from "@/shared/config/auth-client";
import type { Locale } from "@/shared/config/i18n";

// Иконки провайдеров
function GitHubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483v-1.688c-2.782.6-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844a9.59 9.59 0 012.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855v2.751c0 .269.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  );
}

// Иконка Яндекса
function YandexIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M2.04 12c0-5.523 4.476-10 10-10 5.523 0 10 4.477 10 10s-4.477 10-10 10c-5.524 0-10-4.477-10-10z" fill="#FC3F1D"/>
      <path d="M13.32 7.666h-.924c-1.694 0-2.585.858-2.585 2.123 0 1.43.616 2.1 1.881 2.959l1.045.704-3.003 4.548H7.49L10.2 13.78c-1.518-1.077-2.386-2.1-2.386-3.861 0-2.144 1.474-3.554 4.103-3.554h3.003v11.635h-1.6V7.666z" fill="#fff"/>
    </svg>
  );
}

export default function LoginPage() {
  const t = useTranslations("auth");
  const locale = useLocale() as Locale;
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState<string | null>(null);

  // Читаем ошибку из URL (?error=...) — Better Auth редиректит сюда при неудаче OAuth
  const urlError = searchParams?.get("error");
  const urlErrorDescription = searchParams?.get("error_description");
  const [error, setError] = useState<string | null>(
    urlErrorDescription ?? urlError ?? null
  );

  const callbackURL = `/${locale}`;

  async function handleSocial(provider: "github" | "google") {
    setLoading(provider);
    setError(null);
    try {
      const result = await authClient.signIn.social({ provider, callbackURL });
      if (result.error) {
        setError(result.error.message ?? result.error.statusText ?? `Ошибка ${result.error.status}`);
        setLoading(null);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Неизвестная ошибка");
      setLoading(null);
    }
  }

  async function handleYandex() {
    setLoading("yandex");
    setError(null);
    try {
      const result = await authClient.signIn.oauth2({ providerId: "yandex", callbackURL });
      if (result.error) {
        setError(result.error.message ?? result.error.statusText ?? `Ошибка ${result.error.status}`);
        setLoading(null);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Неизвестная ошибка");
      setLoading(null);
    }
  }

  return (
    <div className="page-container page-x fade-in">
      <div className="min-h-[60vh] flex items-center justify-center py-14">
        <div className="glass p-8 w-full max-w-sm flex flex-col gap-6">
          {/* Заголовок */}
          <div className="text-center">
            <p className="font-mono text-xs text-faint mb-2">
              <span className="text-accent">$</span> auth --login
            </p>
            <h1 className="text-xl font-semibold">{t("login")}</h1>
            <p className="mt-1 text-sm text-muted">{t("loginDescription")}</p>
          </div>

          {/* Провайдеры */}
          <div className="flex flex-col gap-3">
            <button
              type="button"
              disabled={!!loading}
              onClick={() => void handleSocial("github")}
              className="flex items-center justify-center gap-3 h-10 w-full rounded-md border border-border bg-surface text-sm font-medium hover:bg-subtle hover:border-transparent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <GitHubIcon />
              {loading === "github" ? "..." : t("loginWith", { provider: "GitHub" })}
            </button>
            <button
              type="button"
              disabled={!!loading}
              onClick={() => void handleSocial("google")}
              className="flex items-center justify-center gap-3 h-10 w-full rounded-md border border-border bg-surface text-sm font-medium hover:bg-subtle hover:border-transparent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <GoogleIcon />
              {loading === "google" ? "..." : t("loginWith", { provider: "Google" })}
            </button>
            <button
              type="button"
              disabled={!!loading}
              onClick={() => void handleYandex()}
              className="flex items-center justify-center gap-3 h-10 w-full rounded-md border border-border bg-surface text-sm font-medium hover:bg-subtle hover:border-transparent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <YandexIcon />
              {loading === "yandex" ? "..." : t("loginWith", { provider: "Яндекс" })}
            </button>
          </div>

          {/* Ошибка */}
          {error && (
            <p className="text-center text-xs text-red-400">{error}</p>
          )}

          <p className="text-center text-xs text-faint">
            {locale === "ru"
              ? "Авторизуясь, вы принимаете условия использования."
              : "By signing in, you agree to the terms of use."}
          </p>
        </div>
      </div>
    </div>
  );
}
