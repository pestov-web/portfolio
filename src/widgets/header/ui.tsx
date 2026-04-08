"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { useState } from "react";
import { ThemeToggle } from "@/shared/ui/theme-toggle";
import { locales, type Locale } from "@/shared/config/i18n";
import { useSession, signOut } from "@/shared/config/auth-client";

// Иконка гамбургера
function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      aria-hidden
    >
      {open ? (
        <>
          <line x1="4" y1="4" x2="16" y2="16" />
          <line x1="16" y1="4" x2="4" y2="16" />
        </>
      ) : (
        <>
          <line x1="3" y1="6" x2="17" y2="6" />
          <line x1="3" y1="10" x2="17" y2="10" />
          <line x1="3" y1="14" x2="17" y2="14" />
        </>
      )}
    </svg>
  );
}

// Иконка внешней ссылки
function ExternalIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M2 10L10 2M4 2h6v6" />
    </svg>
  );
}

export function Header() {
  const t = useTranslations("nav");
  const locale = useLocale() as Locale;
  const rawPathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const { data: session } = useSession();

  const isAdmin = session?.user.role === "ADMIN";

  // Убираем префикс локали из pathname для сравнения (usePathname может вернуть null вне роута)
  const pathWithoutLocale = (rawPathname ?? `/${locale}`).replace(new RegExp(`^/${locale}`), "") || "/";

  const navLinks = [
    { href: "/",         label: t("home") },
    { href: "/blog",     label: t("blog") },
    { href: "/projects", label: t("projects") },
    { href: "/contact",  label: t("contact") },
  ] as const;

  const isActive = (href: string) =>
    href === "/" ? pathWithoutLocale === "/" : pathWithoutLocale.startsWith(href);

  // Переключатель языка — сохраняет текущий путь
  const otherLocale = locales.find((l) => l !== locale) as Locale;
  const switchHref = `/${otherLocale}${pathWithoutLocale}`;

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg/90 backdrop-blur-sm">
      <div className="page-container page-x">
        <div className="flex h-14 items-center justify-between gap-4">

          {/* Логотип / имя */}
          <Link
            href={`/${locale}`}
            className="font-mono text-sm font-medium text-fg no-underline"
            onClick={() => setMenuOpen(false)}
          >
            <span className="text-accent">~/</span>
            <span>portfolio</span>
          </Link>

          {/* Десктопная навигация */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Основная навигация">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={`/${locale}${href}`}
                className={[
                  "px-3 py-1.5 text-sm rounded-md no-underline transition-colors",
                  isActive(href)
                    ? "text-fg bg-subtle font-medium"
                    : "text-muted hover:text-fg hover:bg-subtle",
                ].join(" ")}
              >
                {label}
              </Link>
            ))}
            {/* Внешняя ссылка Hype Voice */}
            <a
              href="https://hype-voice.ru"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-3 py-1.5 text-sm text-muted hover:text-fg hover:bg-subtle rounded-md no-underline transition-colors"
            >
              {t("hypeVoice")}
              <ExternalIcon />
            </a>
          </nav>

          {/* Правая часть: язык + тема + auth + мобильное меню */}
          <div className="flex items-center gap-1">
            {/* Переключатель языка */}
            <Link
              href={switchHref}
              className="px-2 py-1 text-xs font-mono text-faint hover:text-fg hover:bg-subtle rounded-md no-underline transition-colors uppercase"
              aria-label={`Switch to ${otherLocale}`}
            >
              {otherLocale}
            </Link>

            <ThemeToggle />

            {/* Auth: войти / выйти / админ */}
            {session ? (
              <div className="hidden md:flex items-center gap-1">
                {isAdmin && (
                  <Link
                    href={`/${locale}/admin`}
                    className="px-3 py-1.5 text-xs font-medium text-accent hover:bg-subtle rounded-md no-underline transition-colors"
                  >
                    Admin
                  </Link>
                )}
                <button
                  onClick={() => void signOut({ fetchOptions: { onSuccess: () => window.location.reload() } })}
                  className="px-3 py-1.5 text-xs text-muted hover:text-fg hover:bg-subtle rounded-md transition-colors"
                >
                  {t("signOut")}
                </button>
              </div>
            ) : (
              <Link
                href={`/${locale}/login`}
                className="hidden md:inline-flex px-3 py-1.5 text-xs font-medium text-accent hover:bg-subtle rounded-md no-underline transition-colors"
              >
                {t("signIn")}
              </Link>
            )}

            {/* Кнопка мобильного меню */}
            <button
              className="md:hidden size-8 flex items-center justify-center text-muted hover:text-fg hover:bg-subtle rounded-md transition-colors"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"}
              aria-expanded={menuOpen}
            >
              <MenuIcon open={menuOpen} />
            </button>
          </div>
        </div>
      </div>

      {/* Мобильное меню */}
      {menuOpen && (
        <div className="md:hidden border-t border-border bg-bg">
          <nav className="page-container page-x py-3 flex flex-col gap-1" aria-label="Мобильная навигация">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={`/${locale}${href}`}
                onClick={() => setMenuOpen(false)}
                className={[
                  "px-3 py-2 text-sm rounded-md no-underline transition-colors",
                  isActive(href)
                    ? "text-fg bg-subtle font-medium"
                    : "text-muted hover:text-fg hover:bg-subtle",
                ].join(" ")}
              >
                {label}
              </Link>
            ))}
            <a
              href="https://hype-voice.ru"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-1.5 px-3 py-2 text-sm text-muted hover:text-fg hover:bg-subtle rounded-md no-underline transition-colors"
            >
              {t("hypeVoice")}
              <ExternalIcon />
            </a>

            {/* Auth в мобильном меню */}
            <div className="pt-2 mt-1 border-t border-border flex flex-col gap-1">
              {session ? (
                <>
                  {isAdmin && (
                    <Link
                      href={`/${locale}/admin`}
                      onClick={() => setMenuOpen(false)}
                      className="px-3 py-2 text-sm font-medium text-accent hover:bg-subtle rounded-md no-underline transition-colors"
                    >
                      Admin
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      void signOut({ fetchOptions: { onSuccess: () => window.location.reload() } });
                    }}
                    className="text-left px-3 py-2 text-sm text-muted hover:text-fg hover:bg-subtle rounded-md transition-colors"
                  >
                    {t("signOut")}
                  </button>
                </>
              ) : (
                <Link
                  href={`/${locale}/login`}
                  onClick={() => setMenuOpen(false)}
                  className="px-3 py-2 text-sm font-medium text-accent hover:bg-subtle rounded-md no-underline transition-colors"
                >
                  {t("signIn")}
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
