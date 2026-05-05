"use client";

import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import type { Locale } from "@/shared/config";
import { Button, ButtonLink, ErrorState } from "@/shared/ui";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  const t = useTranslations("errors");
  const locale = useLocale() as Locale;

  return (
    <ErrorState
      code="500"
      title={t("title")}
      description={t("description")}
      actions={(
        <>
          <Button type="button" variant="primary" onClick={() => reset()}>
            {t("retry")}
          </Button>
          <ButtonLink href={`/${locale}`} variant="secondary">
            {t("goHome")}
          </ButtonLink>
        </>
      )}
      details={process.env.NODE_ENV === "development" ? error.message : error.digest ?? null}
    />
  );
}