"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ToastProvider } from "@/shared/ui/toast";
import type { ThemeProviderProps } from "./theme-provider.types";

export function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange={false}
      scriptProps={{ suppressHydrationWarning: true }}
    >
      <ToastProvider>{children}</ToastProvider>
    </NextThemesProvider>
  );
}

export type { ThemeProviderProps } from "./theme-provider.types";