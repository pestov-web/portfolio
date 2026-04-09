"use client";

import { ThemeProvider } from "@/shared/ui/theme-provider";
import { Button } from "@/shared/ui/button";
import { ErrorState } from "@/shared/ui/error-state";

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-bg text-fg font-sans">
        <ThemeProvider>
          <ErrorState
            code="500"
            title="Что-то пошло не так"
            description="Произошла критическая ошибка приложения. Попробуй перезагрузить страницу или повторить действие ещё раз."
            actions={(
              <Button type="button" variant="primary" onClick={() => reset()}>
                Попробовать снова
              </Button>
            )}
            details={process.env.NODE_ENV === "development" ? error.message : error.digest ?? null}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}