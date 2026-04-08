import { getRequestConfig } from "next-intl/server";
import { locales, defaultLocale } from "@/shared/config/i18n";

export default getRequestConfig(async ({ requestLocale }) => {
  // Берём локаль из запроса, fallback на defaultLocale
  let locale = await requestLocale;

  if (!locale || !locales.includes(locale as (typeof locales)[number])) {
    locale = defaultLocale;
  }

  return {
    locale,
    messages: (await import(`../../../messages/${locale}.json`)).default,
  };
});
