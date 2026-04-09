import { describe, expect, it } from "vitest";
import { mapYandexUserInfo } from "./yandex-oauth";

describe("mapYandexUserInfo", () => {
  it("uses provider email when it exists", () => {
    expect(
      mapYandexUserInfo({
        id: "42",
        display_name: "Иван",
        default_email: "ivan@yandex.ru",
      })
    ).toMatchObject({
      email: "ivan@yandex.ru",
      emailVerified: true,
      name: "Иван",
    });
  });

  it("creates a deterministic fallback email when provider email is absent", () => {
    expect(
      mapYandexUserInfo({
        id: "42",
        real_name: "Иван Иванов",
      })
    ).toMatchObject({
      email: "yandex-42@oauth.local",
      emailVerified: false,
      name: "Иван Иванов",
    });
  });
});