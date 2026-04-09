import { getTranslations } from "next-intl/server";
import { ButtonLink, ErrorState } from "@/shared/ui";
import type { Locale } from "@/shared/config";

export default async function LocaleNotFound({
  params,
}: {
  params?: Promise<{ locale: Locale }>;
}) {
  const locale = params ? (await params).locale : "ru";
  const t = await getTranslations({ locale, namespace: "errors.notFound" });

  return (
    <ErrorState
      code="404"
      title={t("title")}
      description={t("description")}
      actions={(
        <>
          <ButtonLink href={`/${locale}`} variant="primary">
            {t("goHome")}
          </ButtonLink>
          <ButtonLink href={`/${locale}/blog`} variant="secondary">
            {t("goBlog")}
          </ButtonLink>
        </>
      )}
    />
  );
}