export type AuthProviderName = "github" | "google" | "yandex";

export type EnabledAuthProviders = Record<AuthProviderName, boolean>;

function isConfigured(...values: Array<string | undefined>) {
  return values.every((value) => typeof value === "string" && value.length > 0);
}

export const enabledAuthProviders: EnabledAuthProviders = {
  github: isConfigured(process.env.AUTH_GITHUB_ID, process.env.AUTH_GITHUB_SECRET),
  google: isConfigured(process.env.AUTH_GOOGLE_ID, process.env.AUTH_GOOGLE_SECRET),
  yandex: isConfigured(process.env.AUTH_YANDEX_ID, process.env.AUTH_YANDEX_SECRET),
};