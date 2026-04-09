"use client";

import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { authClient } from "@/shared/auth/index";
import type { Locale } from "@/shared/config/index";
import { GitHubIcon, GoogleIcon, YandexIcon } from "@/shared/ui";
import { SocialAuthButton } from "./social-auth-button";

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
        setError(result.error.message ?? result.error.statusText ?? t("errorStatus", { status: result.error.status }));
        setLoading(null);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : t("unknownError"));
      setLoading(null);
    }
  }

  async function handleYandex() {
    setLoading("yandex");
    setError(null);
    try {
      const result = await authClient.signIn.oauth2({ providerId: "yandex", callbackURL });
      if (result.error) {
        setError(result.error.message ?? result.error.statusText ?? t("errorStatus", { status: result.error.status }));
        setLoading(null);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : t("unknownError"));
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
            <SocialAuthButton
              disabled={!!loading}
              onClick={() => void handleSocial("github")}
              icon={<GitHubIcon />}
              label={loading === "github" ? "..." : t("loginWith", { provider: "GitHub" })}
            />
            <SocialAuthButton
              disabled={!!loading}
              onClick={() => void handleSocial("google")}
              icon={<GoogleIcon />}
              label={loading === "google" ? "..." : t("loginWith", { provider: "Google" })}
            />
            <SocialAuthButton
              disabled={!!loading}
              onClick={() => void handleYandex()}
              icon={<YandexIcon />}
              label={loading === "yandex" ? "..." : t("loginWith", { provider: t("providers.yandex") })}
            />
          </div>

          {/* Ошибка */}
          {error && (
            <p className="text-center text-xs text-red-400">{error}</p>
          )}

          <p className="text-center text-xs text-faint">
            {t("terms")}
          </p>
        </div>
      </div>
    </div>
  );
}
