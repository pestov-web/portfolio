"use client";

import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { authClient } from "@/shared/auth/index";
import type { Locale } from "@/shared/config/index";
import { GitHubIcon, GoogleIcon, YandexIcon } from "@/shared/ui";
import { useToast } from "@/shared/ui/index.client";
import { SocialAuthButton } from "./social-auth-button";

type EnabledProviders = {
  github: boolean;
  google: boolean;
  yandex: boolean;
};

type LoginClientProps = {
  enabledProviders: EnabledProviders;
};

export default function LoginClient({ enabledProviders }: LoginClientProps) {
  const t = useTranslations("auth");
  const locale = useLocale() as Locale;
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState<string | null>(null);
  const { showToast } = useToast();

  const urlError = searchParams?.get("error");
  const urlErrorDescription = searchParams?.get("error_description");
  const [error, setError] = useState<string | null>(
    urlErrorDescription ?? urlError ?? null
  );

  const callbackURL = `/${locale}`;
  const hasEnabledProviders = Object.values(enabledProviders).some(Boolean);

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
      const message = e instanceof Error ? e.message : t("unknownError");
      setError(message);
      showToast({ description: message, variant: "error" });
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
      const message = e instanceof Error ? e.message : t("unknownError");
      setError(message);
      showToast({ description: message, variant: "error" });
      setLoading(null);
    }
  }

  return (
    <div className="page-container page-x fade-in">
      <div className="min-h-[60vh] flex items-center justify-center py-14">
        <div className="glass p-8 w-full max-w-sm flex flex-col gap-6">
          <div className="text-center">
            <p className="font-mono text-xs text-faint mb-2">
              <span className="text-accent">$</span> auth --login
            </p>
            <h1 className="text-xl font-semibold">{t("login")}</h1>
            <p className="mt-1 text-sm text-muted">{t("loginDescription")}</p>
          </div>

          {hasEnabledProviders ? (
            <div className="flex flex-col gap-3">
              {enabledProviders.github ? (
                <SocialAuthButton
                  disabled={!!loading}
                  onClick={() => void handleSocial("github")}
                  icon={<GitHubIcon />}
                  label={loading === "github" ? "..." : t("loginWith", { provider: "GitHub" })}
                />
              ) : null}
              {enabledProviders.google ? (
                <SocialAuthButton
                  disabled={!!loading}
                  onClick={() => void handleSocial("google")}
                  icon={<GoogleIcon />}
                  label={loading === "google" ? "..." : t("loginWith", { provider: "Google" })}
                />
              ) : null}
              {enabledProviders.yandex ? (
                <SocialAuthButton
                  disabled={!!loading}
                  onClick={() => void handleYandex()}
                  icon={<YandexIcon />}
                  label={loading === "yandex" ? "..." : t("loginWith", { provider: t("providers.yandex") })}
                />
              ) : null}
            </div>
          ) : (
            <p className="text-center text-sm text-muted">{t("providersUnavailable")}</p>
          )}

          {error ? (
            <p className="text-center text-xs text-red-400">{error}</p>
          ) : null}

          <p className="text-center text-xs text-faint">
            {t("terms")}
          </p>
        </div>
      </div>
    </div>
  );
}