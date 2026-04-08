// Главная страница — заглушка, детали будут в src/pages/home
import { getTranslations, getLocale } from "next-intl/server";
import Link from "next/link";

// Иконка стрелки вправо
function ArrowRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M3 8h10M9 4l4 4-4 4" />
    </svg>
  );
}

export default async function HomePage() {
  const t = await getTranslations("home");
  const locale = await getLocale();

  return (
    <div className="page-container page-x fade-in">
      {/* ─── Hero ─────────────────────────────────────────────────────── */}
      <section className="py-20 md:py-28">
        <p className="font-mono text-sm text-muted mb-3">
          <span className="text-accent">$</span> whoami
        </p>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
          {t("hero.greeting")}{" "}
          <span className="text-accent">mwkeay</span>
          <span className="text-muted">.</span>
        </h1>
        <p className="text-xl md:text-2xl text-muted mb-4">
          {t("hero.role")}
        </p>
        <p className="max-w-xl text-base text-faint leading-relaxed mb-8">
          {t("hero.bio")}
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href={`/${locale}/projects`}
            className="inline-flex items-center gap-2 px-4 py-2 bg-accent-vivid text-white text-sm font-medium rounded-md no-underline hover:bg-accent-dim transition-colors"
          >
            {t("latestProjects")}
            <ArrowRight />
          </Link>
          <Link
            href={`/${locale}/blog`}
            className="inline-flex items-center gap-2 px-4 py-2 border border-border text-sm font-medium rounded-md no-underline hover:bg-subtle hover:border-transparent transition-colors"
          >
            {t("latestPosts")}
          </Link>
        </div>
      </section>

      {/* ─── Разделитель ────────────────────────────────────────────────── */}
      <hr className="border-border" />

      {/* ─── Последние посты ─────────────────────────────────────────── */}
      <section className="py-14">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-lg font-semibold accent-line">{t("latestPosts")}</h2>
          <Link
            href={`/${locale}/blog`}
            className="flex items-center gap-1 text-sm text-muted hover:text-accent no-underline transition-colors"
          >
            {t("viewAll")} <ArrowRight />
          </Link>
        </div>

        {/* Заглушка — в будущем заменится компонентом PostCard c Prisma */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass p-5 flex flex-col gap-3 animate-pulse">
              <div className="h-2 w-16 bg-subtle rounded" />
              <div className="h-4 w-3/4 bg-subtle rounded" />
              <div className="h-3 w-full bg-subtle rounded" />
              <div className="h-3 w-2/3 bg-subtle rounded" />
            </div>
          ))}
        </div>
      </section>

      {/* ─── Последние проекты ────────────────────────────────────────── */}
      <section className="py-14">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-lg font-semibold accent-line">{t("latestProjects")}</h2>
          <Link
            href={`/${locale}/projects`}
            className="flex items-center gap-1 text-sm text-muted hover:text-accent no-underline transition-colors"
          >
            {t("viewAll")} <ArrowRight />
          </Link>
        </div>

        {/* Заглушка — в будущем заменится компонентом ProjectCard c Prisma */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass p-5 flex flex-col gap-3 animate-pulse">
              <div className="h-4 w-1/2 bg-subtle rounded" />
              <div className="h-3 w-full bg-subtle rounded" />
              <div className="h-3 w-3/4 bg-subtle rounded" />
              <div className="mt-2 flex gap-2">
                <div className="h-5 w-12 bg-subtle rounded-full" />
                <div className="h-5 w-10 bg-subtle rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

