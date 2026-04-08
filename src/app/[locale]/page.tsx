// Главная страница — заглушка, детали будут в src/pages/home
import { getTranslations, getLocale } from "next-intl/server";
import Link from "next/link";
import { prisma } from "@/shared/lib/prisma";
import { PostCard } from "@/entities/post";
import { ProjectCard } from "@/entities/project";

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

  // Запросы к БД параллельно
  const [latestPosts, latestProjects] = await Promise.all([
    prisma.post.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
      take: 3,
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        coverImage: true,
        restricted: true,
        createdAt: true,
        tags: { select: { tag: { select: { name: true, slug: true } } } },
      },
    }),
    prisma.project.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
      take: 3,
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        coverImage: true,
        repoUrl: true,
        demoUrl: true,
        tags: { select: { tag: { select: { name: true, slug: true } } } },
      },
    }),
  ]);

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

        {/* Список постов */}
        {latestPosts.length === 0 ? (
          <p className="text-sm text-faint">{t("noPosts")}</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {latestPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                locale={locale}
                readMoreLabel={t("readMore")}
              />
            ))}
          </div>
        )}
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

        {/* Список проектов */}
        {latestProjects.length === 0 ? (
          <p className="text-sm text-faint">{t("noProjects")}</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {latestProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                locale={locale}
                viewProjectLabel={t("viewProject")}
                viewCodeLabel={t("viewCode")}
                viewDemoLabel={t("viewDemo")}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

