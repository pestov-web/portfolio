import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import type { Locale } from "@/shared/config/index";
import { locales } from "@/shared/config/index";
import { toRenderableFileUrl } from "@/shared/lib/media";
import { prisma } from "@/shared/lib/prisma";
import { ArrowRightIcon, ButtonLink, ExternalLinkIcon, GitHubIcon, LockIcon } from "@/shared/ui";
import { HeroPlayground } from "./hero-playground";
import { homeClassNames as styles } from "./home.styles";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home" });

  return {
    title: t("hero.role"),
    description: t("hero.bio"),
    alternates: {
      canonical: `${APP_URL}/${locale}`,
      languages: Object.fromEntries(locales.map((item) => [item, `${APP_URL}/${item}`])),
    },
    openGraph: {
      title: `${t("hero.name")} — ${t("hero.role")}`,
      description: t("hero.bio"),
      url: `${APP_URL}/${locale}`,
    },
  };
}

type PostTranslationPreview = { locale: Locale; title: string; slug: string };
type ProjectTranslationPreview = { locale: Locale; title: string; slug: string; description: string | null };

function formatDate(date: Date, locale: Locale) {
  return new Intl.DateTimeFormat(locale === "ru" ? "ru-RU" : "en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export default async function HomePage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home" });

  const [latestPosts, latestProjects] = await Promise.all([
    prisma.post.findMany({
      where: { published: true, translations: { some: { locale } } },
      orderBy: { createdAt: "desc" },
      take: 2,
      select: {
        id: true,
        restricted: true,
        createdAt: true,
        translations: { where: { locale }, select: { locale: true, title: true, slug: true } },
      },
    }),
    prisma.project.findMany({
      where: { published: true, translations: { some: { locale } } },
      orderBy: { order: "asc" },
      take: 1,
      select: {
        id: true,
        coverImage: true,
        repoUrl: true,
        demoUrl: true,
        tags: { select: { tag: { select: { name: true, slug: true } } } },
        translations: { where: { locale }, select: { locale: true, title: true, slug: true, description: true } },
      },
    }),
  ]);

  const posts = latestPosts.flatMap((post) => {
    const translation = post.translations[0] as PostTranslationPreview | undefined;
    return translation ? [{ ...post, ...translation }] : [];
  });
  const projects = latestProjects.flatMap((project) => {
    const translation = project.translations[0] as ProjectTranslationPreview | undefined;
    return translation ? [{ ...project, ...translation }] : [];
  });
  const featuredProject = projects[0];

  return (
    <div className={styles.root}>
      <div className={styles.backdrop} aria-hidden="true" />

      <div className={styles.container}>
        <section className={styles.hero} aria-labelledby="hero-title">
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>{t("hero.eyebrow")}</p>
            <h1 id="hero-title" className={styles.title}>
              <span className={styles.titleLine}>{t("hero.title")}</span>
              <span className={styles.titleAccent}>{t("hero.titleAccent")}</span>
            </h1>
            <p className={styles.bio}>{t("hero.bio")}</p>
            <div className={styles.heroActions}>
              <ButtonLink href={`/${locale}/projects`} variant="primary" className={styles.primaryAction}>
                {t("viewWork")} <ArrowRightIcon />
              </ButtonLink>
              <Link href={`/${locale}/contact`} className={styles.heroLink}>
                {t("cta.action")} <ArrowRightIcon />
              </Link>
            </div>
          </div>

          <HeroPlayground label={t("hero.visualLabel")} />
        </section>
      </div>

      <section id="selected-work" className={styles.workSection} aria-labelledby="work-title">
        <div className={styles.container}>
          <header className={styles.workHeader}>
            <p className={styles.workIndex}>01 / {t("workEyebrow")}</p>
            <h2 id="work-title" className={styles.workTitle}>{t("workTitle")}</h2>
            <Link href={`/${locale}/projects`} className={styles.workLink}>
              {t("viewAll")} <ArrowRightIcon />
            </Link>
          </header>

          {featuredProject ? (
            <article className={styles.featured}>
              <div className={styles.featuredBody}>
                <div>
                  <h3 className={styles.featuredTitle}>{featuredProject.title}</h3>
                  {featuredProject.description ? (
                    <p className={styles.featuredDescription}>{featuredProject.description}</p>
                  ) : null}
                </div>

                <div className={styles.featuredFooter}>
                  <div className={styles.featuredTags} translate="no">
                    {featuredProject.tags.map(({ tag }) => (
                      <span key={tag.slug} className={styles.featuredTag}>{tag.name}</span>
                    ))}
                  </div>
                  <div className={styles.featuredActions}>
                    <Link href={`/${locale}/projects/${featuredProject.slug}`} className={styles.featuredAction}>
                      {t("viewProject")} <ArrowRightIcon />
                    </Link>
                    {featuredProject.repoUrl ? (
                      <a href={featuredProject.repoUrl} target="_blank" rel="noopener noreferrer" className={styles.featuredAction}>
                        <GitHubIcon aria-hidden="true" /> {t("viewCode")}
                      </a>
                    ) : null}
                    {featuredProject.demoUrl ? (
                      <a href={featuredProject.demoUrl} target="_blank" rel="noopener noreferrer" className={styles.featuredAction}>
                        {t("viewDemo")} <ExternalLinkIcon aria-hidden="true" />
                      </a>
                    ) : null}
                  </div>
                </div>
              </div>

              <div className={styles.featuredMedia}>
                {featuredProject.coverImage ? (
                  <Image
                    src={toRenderableFileUrl(featuredProject.coverImage)}
                    alt={featuredProject.title}
                    fill
                    unoptimized
                    sizes="(max-width: 768px) 100vw, 58vw"
                    className={styles.featuredImage}
                  />
                ) : (
                  <div className={styles.featuredPlaceholder} aria-hidden="true">
                    <span className={styles.featuredMonogram}>{featuredProject.title.slice(0, 2).toUpperCase()}</span>
                  </div>
                )}
              </div>
            </article>
          ) : (
            <p className={styles.empty}>{t("noProjects")}</p>
          )}
        </div>
      </section>

      <section className={styles.notesSection} aria-labelledby="notes-title">
        <div className={styles.container}>
          <div className={styles.notesLayout}>
            <header className={styles.notesHeader}>
              <p className={styles.notesIndex}>02 / {t("postEyebrow")}</p>
              <h2 id="notes-title" className={styles.notesTitle}>{t("postTitle")}</h2>
              <Link href={`/${locale}/blog`} className={styles.notesLink}>
                {t("viewAll")} <ArrowRightIcon />
              </Link>
            </header>

            {posts.length > 0 ? (
              <div className={styles.posts}>
                {posts.map((post) => (
                  <article key={post.id} className={styles.postRow}>
                    <time dateTime={post.createdAt.toISOString()} className={styles.postDate}>
                      {formatDate(post.createdAt, locale)}
                    </time>
                    <h3 className={styles.postTitle}>
                      <Link href={`/${locale}/blog/${post.slug}`} className={styles.postTitleLink}>
                        {post.restricted ? <LockIcon className={styles.postLock} aria-hidden="true" /> : null}
                        {post.title}
                      </Link>
                    </h3>
                    <Link
                      href={`/${locale}/blog/${post.slug}`}
                      className={styles.postArrow}
                      aria-label={`${t("readMore")}: ${post.title}`}
                    >
                      <ArrowRightIcon aria-hidden="true" />
                    </Link>
                  </article>
                ))}
              </div>
            ) : (
              <p className={styles.empty}>{t("noPosts")}</p>
            )}
          </div>
        </div>
      </section>

      <div className={styles.container}>
        <section className={styles.cta} aria-labelledby="cta-title">
          <p className={styles.ctaIndex}>03 / {t("contactEyebrow")}</p>
          <Link href={`/${locale}/contact`} className={styles.ctaLink}>
            <h2 id="cta-title" className={styles.ctaTitle}>{t("cta.title")}</h2>
            <span className={styles.ctaArrow} aria-hidden="true">
              <ArrowRightIcon size={24} />
            </span>
          </Link>
        </section>
      </div>
    </div>
  );
}
