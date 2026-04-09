// Поддерживаемые локали и настройки i18n
export const locales = ["ru", "en"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "ru";
