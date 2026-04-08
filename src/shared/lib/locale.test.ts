import { describe, expect, it } from "vitest";
import { buildLocaleSwitchHref, normalizeLocale, stripLocalePrefix, localizePath } from "./locale";

describe("locale helpers", () => {
  it("normalizes unsupported locale to default", () => {
    expect(normalizeLocale("de")).toBe("ru");
  });

  it("strips locale prefix from pathname", () => {
    expect(stripLocalePrefix("/ru/blog", "ru")).toBe("/blog");
    expect(stripLocalePrefix("/ru", "ru")).toBe("/");
  });

  it("preserves query params when switching locale", () => {
    expect(buildLocaleSwitchHref("/ru/blog", "tag=react&page=2", "ru", "en")).toBe(
      "/en/blog?tag=react&page=2"
    );
  });

  it("localizes paths consistently", () => {
    expect(localizePath("en", "/admin/posts")).toBe("/en/admin/posts");
    expect(localizePath("ru", "/")).toBe("/ru");
  });
});