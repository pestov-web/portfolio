"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useId, useRef, useState } from "react";
import { useSession, signOut } from "@/shared/auth/index";
import { locales, type Locale } from "@/shared/config/index";
import { buildLocaleSwitchHref, stripLocalePrefix } from "@/shared/lib/locale";
import { ExternalLinkIcon, MenuIcon } from "@/shared/ui";
import { ThemeToggle } from "@/shared/ui/theme-toggle";
import { headerClassNames, getHeaderMobileNavLinkClassName, getHeaderNavLinkClassName } from "./ui.styles";
import type { HeaderNavLink } from "./ui.types";

export function Header() {
  const t = useTranslations("nav");
  const locale = useLocale() as Locale;
  const rawPathname = usePathname();
  const searchParams = useSearchParams();
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();
  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    const onPointerDown = (event: PointerEvent) => {
      if (event.target instanceof Node && !headerRef.current?.contains(event.target)) setMenuOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('pointerdown', onPointerDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('pointerdown', onPointerDown);
    };
  }, [menuOpen]);
  const { data: session } = useSession();

  const isAdmin = session?.user.role === "ADMIN";
  const pathWithoutLocale = stripLocalePrefix(rawPathname ?? `/${locale}`, locale);

  const navLinks: HeaderNavLink[] = [
    { href: "/", label: t("home") },
    { href: "/blog", label: t("blog") },
    { href: "/projects", label: t("projects") },
    { href: "/contact", label: t("contact") },
  ];

  const isActive = (href: string) =>
    href === "/" ? pathWithoutLocale === "/" : pathWithoutLocale.startsWith(href);

  const otherLocale = locales.find((item) => item !== locale) as Locale;
  const switchHref = buildLocaleSwitchHref(
    rawPathname,
    searchParams?.toString() ?? "",
    locale,
    otherLocale
  );

  return (
    <header ref={headerRef} className={headerClassNames.root}>
      <div className={headerClassNames.container}>
        <div className={headerClassNames.row}>
          <Link href={`/${locale}`} className={headerClassNames.brand} onClick={() => setMenuOpen(false)}>
            <span className={headerClassNames.brandAccent}>~/</span>
            <span>portfolio</span>
          </Link>

          <nav className={headerClassNames.desktopNav} aria-label={t("mainNavigation")}>
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={`/${locale}${href}`}
                className={getHeaderNavLinkClassName(isActive(href))}
              >
                {label}
              </Link>
            ))}
            <a
              href="https://voice.pestov-web.ru"
              target="_blank"
              rel="noopener noreferrer"
              className={headerClassNames.desktopExternalLink}
            >
              {t("hypeVoice")}
              <ExternalLinkIcon width={11} height={11} />
            </a>
          </nav>

          <div className={headerClassNames.controls}>
            <Link
              href={switchHref}
              className={headerClassNames.localeSwitch}
              aria-label={t("switchToLocale", { locale: otherLocale.toUpperCase() })}
            >
              {otherLocale}
            </Link>

            <ThemeToggle />

            {session ? (
              <div className={headerClassNames.desktopAuth}>
                {isAdmin ? (
                  <Link href={`/${locale}/admin`} className={headerClassNames.authLink}>
                    {t("admin")}
                  </Link>
                ) : null}
                <button
                  onClick={() => void signOut({ fetchOptions: { onSuccess: () => window.location.reload() } })}
                  className={headerClassNames.authButton}
                >
                  {t("signOut")}
                </button>
              </div>
            ) : (
              <Link href={`/${locale}/login`} className={`hidden md:inline-flex ${headerClassNames.authLink}`}>
                {t("signIn")}
              </Link>
            )}

            <button
              className={headerClassNames.mobileMenuButton}
              onClick={() => setMenuOpen((value) => !value)}
              aria-label={menuOpen ? t("closeMenu") : t("openMenu")}
              aria-expanded={menuOpen}
              aria-controls={menuId}
              ref={menuButtonRef}
            >
              <MenuIcon open={menuOpen} />
            </button>
          </div>
        </div>
      </div>

      {menuOpen ? (
        <div id={menuId} className={headerClassNames.mobileMenu}>
          <nav className={headerClassNames.mobileNav} aria-label={t("mobileNavigation")}>
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={`/${locale}${href}`}
                onClick={() => setMenuOpen(false)}
                className={getHeaderMobileNavLinkClassName(isActive(href))}
              >
                {label}
              </Link>
            ))}
            <a
              href="https://voice.pestov-web.ru"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMenuOpen(false)}
              className={headerClassNames.mobileExternalLink}
            >
              {t("hypeVoice")}
              <ExternalLinkIcon width={11} height={11} />
            </a>

            <div className={headerClassNames.mobileAuth}>
              {session ? (
                <>
                  {isAdmin ? (
                    <Link href={`/${locale}/admin`} onClick={() => setMenuOpen(false)} className={headerClassNames.authLink}>
                      {t("admin")}
                    </Link>
                  ) : null}
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      void signOut({ fetchOptions: { onSuccess: () => window.location.reload() } });
                    }}
                    className={headerClassNames.mobileAuthButton}
                  >
                    {t("signOut")}
                  </button>
                </>
              ) : (
                <Link href={`/${locale}/login`} onClick={() => setMenuOpen(false)} className={headerClassNames.authLink}>
                  {t("signIn")}
                </Link>
              )}
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}

export { headerClassNames, getHeaderMobileNavLinkClassName, getHeaderNavLinkClassName } from "./ui.styles";
export type { HeaderNavLink } from "./ui.types";
