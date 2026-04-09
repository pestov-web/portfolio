import { getTranslations } from "next-intl/server";
import {
  PROJECTS_PER_PAGE,
  type Locale,
} from "@/shared/config/index";
import { prisma } from "@/shared/lib/prisma";
import {
  buildPageHref,
  buildPaginationLinks,
  getPaginationMeta,
  parsePageParam,
} from "@/shared/lib/pagination";
import { ProjectCard } from "@/entities/project";
import { FilterBar, Pagination, PageHeader } from "@/shared/ui";

export default async function ProjectsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { locale } = await params;
  const resolvedSearchParams = await searchParams;
  const t = await getTranslations({ locale, namespace: "projects" });
  const tc = await getTranslations({ locale, namespace: "common.pagination" });
  const tf = await getTranslations({ locale, namespace: "common.filters" });
  const requestedPage = parsePageParam(resolvedSearchParams.page);
  const activeTag = Array.isArray(resolvedSearchParams.tag)
    ? resolvedSearchParams.tag[0]
    : resolvedSearchParams.tag;

  const publishedProjectsWhere = {
    published: true,
    ...(activeTag ? { tags: { some: { tag: { slug: activeTag } } } } : {}),
  } as const;

  const [totalProjects, availableTags] = await Promise.all([
    prisma.project.count({ where: publishedProjectsWhere }),
    prisma.tag.findMany({
      where: { projects: { some: { project: { published: true } } } },
      orderBy: { name: "asc" },
      select: { name: true, slug: true },
    }),
  ]);

  const pagination = getPaginationMeta(totalProjects, PROJECTS_PER_PAGE, requestedPage);

  const projects = await prisma.project.findMany({
    where: publishedProjectsWhere,
    orderBy: { order: "asc" },
    skip: pagination.skip,
    take: pagination.pageSize,
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
  });

  return (
    <div className="page-container page-x fade-in">
      <section className="py-14">
        <PageHeader
          title={t("title")}
          description={t("description")}
        />

        <FilterBar
          title={tf("title")}
          items={[
            {
              label: tf("all"),
              href: buildPageHref(`/${locale}/projects`, 1, { ...resolvedSearchParams, tag: undefined }),
              isActive: !activeTag,
            },
            ...availableTags.map((tag) => ({
              label: tag.name,
              href: buildPageHref(`/${locale}/projects`, 1, { ...resolvedSearchParams, tag: tag.slug }),
              isActive: tag.slug === activeTag,
            })),
          ]}
        />

        {projects.length === 0 ? (
          <p className="text-sm text-faint">{activeTag ? t("emptyFiltered") : t("empty")}</p>
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
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
            {pagination.totalPages > 1 ? (
              <Pagination
                summary={tc("summary", {
                  page: pagination.currentPage,
                  totalPages: pagination.totalPages,
                  totalItems: pagination.totalItems,
                })}
                previousLabel={tc("previous")}
                nextLabel={tc("next")}
                previousHref={pagination.currentPage > 1
                  ? buildPageHref(`/${locale}/projects`, pagination.currentPage - 1, resolvedSearchParams)
                  : undefined}
                nextHref={pagination.currentPage < pagination.totalPages
                  ? buildPageHref(`/${locale}/projects`, pagination.currentPage + 1, resolvedSearchParams)
                  : undefined}
                links={buildPaginationLinks(
                  `/${locale}/projects`,
                  pagination.currentPage,
                  pagination.totalPages,
                  resolvedSearchParams
                )}
              />
            ) : null}
          </>
        )}
      </section>
    </div>
  );
}
