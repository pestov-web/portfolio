import createMiddleware from "next-intl/middleware";
import { getSessionCookie } from "better-auth/cookies";
import { NextRequest, NextResponse } from "next/server";
import { locales, defaultLocale } from "@/shared/config/i18n";

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: "always",
});

// Маршруты, требующие авторизации
const protectedRoutes = ["/admin"];

// В Next.js 16 middleware переименован в proxy
export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Снимаем префикс локали для проверки маршрута
  const pathnameWithoutLocale = locales.reduce(
    (acc, locale) => acc.replace(new RegExp(`^/${locale}`), ""),
    pathname
  );

  // Проверяем защищённые маршруты через cookie (быстро, без DB)
  const isProtected = protectedRoutes.some((route) =>
    pathnameWithoutLocale.startsWith(route)
  );

  if (isProtected) {
    const sessionCookie = getSessionCookie(request);
    if (!sessionCookie) {
      const locale = locales.find((l) => pathname.startsWith(`/${l}`)) ?? defaultLocale;
      return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
    }
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: [
    // Пропускаем служебные пути Next.js и статические файлы
    "/((?!_next|_vercel|api|.*\\..*).*)",
  ],
};
