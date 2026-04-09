"use client";

import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
import { MoonIcon, SunIcon } from "@/shared/ui/icons";
import { getThemeToggleButtonClassName, themeToggleClassNames } from "./theme-toggle.styles";
import type { ThemeToggleProps } from "./theme-toggle.types";

function useIsMounted() {
  return useSyncExternalStore(
    (cb) => { cb(); return () => {}; },
    () => true,
    () => false,
  );
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const t = useTranslations("theme");
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useIsMounted();

  if (!mounted) {
    return <div className={themeToggleClassNames.placeholder} />;
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={getThemeToggleButtonClassName(className)}
      aria-label={isDark ? t("toggleToLight") : t("toggleToDark")}
    >
      {isDark ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}

export { getThemeToggleButtonClassName, themeToggleClassNames } from "./theme-toggle.styles";
export type { ThemeToggleProps } from "./theme-toggle.types";