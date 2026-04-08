import Link from "next/link";
import { getTranslations, getLocale } from "next-intl/server";

// Иконка GitHub
function GitHubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483v-1.688c-2.782.6-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844a9.59 9.59 0 012.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855v2.751c0 .269.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

export async function Footer() {
  const t = await getTranslations("common");
  const locale = await getLocale();
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-border">
      <div className="page-container page-x py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-faint">
          {/* Копирайт */}
          <p className="font-mono">
            <span className="text-accent">©</span>{" "}
            {year} — {t("author")}
          </p>

          {/* Ссылки */}
          <div className="flex items-center gap-4">
            {/* RSS (заглушка) */}
            <Link
              href={`/${locale}/blog/rss.xml`}
              className="no-underline text-faint hover:text-fg transition-colors font-mono"
            >
              rss
            </Link>

            {/* GitHub */}
            <a
              href="https://github.com/mwkeay"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="text-faint hover:text-fg transition-colors"
            >
              <GitHubIcon />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
