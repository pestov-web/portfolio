export function getLocalizedItem<T extends { locale: string }>(items: T[], locale: string) {
    return items.find((item) => item.locale === locale) ?? items[0] ?? null;
}
