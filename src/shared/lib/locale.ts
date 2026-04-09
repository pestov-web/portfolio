import { defaultLocale, locales, type Locale } from "@/shared/config/i18n";

export function normalizeLocale(value?: string | null): Locale {
  return locales.includes(value as Locale) ? (value as Locale) : defaultLocale;
}

export function stripLocalePrefix(pathname: string, locale: Locale): string {
  const stripped = pathname.replace(new RegExp(`^/${locale}(?=/|$)`), "");
  return stripped || "/";
}

export function buildLocaleSwitchHref(
  pathname: string | null | undefined,
  search: string | null | undefined,
  currentLocale: Locale,
  nextLocale: Locale
): string {
  const pathWithoutLocale = stripLocalePrefix(pathname ?? `/${currentLocale}`, currentLocale);
  const normalizedPath = pathWithoutLocale === "/" ? "" : pathWithoutLocale;
  const normalizedSearch = search
    ? (search.startsWith("?") ? search : `?${search}`)
    : "";

  return `/${nextLocale}${normalizedPath}${normalizedSearch}`;
}

export function localizePath(locale: Locale, path: string): string {
  const normalizedPath = path === "/" ? "" : path;
  return `/${locale}${normalizedPath}`;
}