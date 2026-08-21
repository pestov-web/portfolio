import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { PROJECTS_PER_PAGE, type Locale } from '@/shared/config/index';
import { locales } from '@/shared/config/index';
import { prisma } from '@/shared/lib/prisma';
import { buildPageHref, buildPaginationLinks, getPaginationMeta, parsePageParam } from '@/shared/lib/pagination';
import { getLocalizedItem } from '@/shared/lib/content-localization';
import { ProjectCard } from '@/entities/project';
import { FilterBar, Pagination, PageHeader } from '@/shared/ui';
import { projectsPageClassNames as styles } from './projects.styles';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'projects' });

    return {
        title: t('title'),
        description: t('description'),
        alternates: {
            canonical: `${APP_URL}/${locale}/projects`,
            languages: Object.fromEntries(locales.map((l) => [l, `${APP_URL}/${l}/projects`])),
        },
        openGraph: {
            title: t('title'),
            description: t('description'),
            url: `${APP_URL}/${locale}/projects`,
        },
    };
}

export default async function ProjectsPage({
    params,
    searchParams,
}: {
    params: Promise<{ locale: Locale }>;
    searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
    const { locale } = await params;
    const resolvedSearchParams = await searchParams;
    const t = await getTranslations({ locale, namespace: 'projects' });
    const tc = await getTranslations({ locale, namespace: 'common.pagination' });
    const tf = await getTranslations({ locale, namespace: 'common.filters' });
    const requestedPage = parsePageParam(resolvedSearchParams.page);
    const activeTag = Array.isArray(resolvedSearchParams.tag) ? resolvedSearchParams.tag[0] : resolvedSearchParams.tag;

    const publishedProjectsWhere = {
        published: true,
        translations: { some: { locale } },
        ...(activeTag ? { tags: { some: { tag: { slug: activeTag } } } } : {}),
    } as const;

    const [totalProjects, availableTags] = await Promise.all([
        prisma.project.count({ where: publishedProjectsWhere }),
        prisma.tag.findMany({
            where: { projects: { some: { project: { published: true, translations: { some: { locale } } } } } },
            orderBy: { name: 'asc' },
            select: { name: true, slug: true },
        }),
    ]);

    const pagination = getPaginationMeta(totalProjects, PROJECTS_PER_PAGE, requestedPage);

    const projects = await prisma.project.findMany({
        where: publishedProjectsWhere,
        orderBy: { order: 'asc' },
        skip: pagination.skip,
        take: pagination.pageSize,
        select: {
            id: true,
            coverImage: true,
            repoUrl: true,
            demoUrl: true,
            tags: { select: { tag: { select: { name: true, slug: true } } } },
            translations: {
                where: { locale },
                select: {
                    locale: true,
                    title: true,
                    slug: true,
                    description: true,
                },
            },
        },
    });

    const localizedProjects = projects.flatMap((project) => {
        const translation = getLocalizedItem(project.translations, locale);

        if (!translation) {
            return [];
        }

        return [
            {
                id: project.id,
                title: translation.title,
                slug: translation.slug,
                description: translation.description,
                coverImage: project.coverImage,
                repoUrl: project.repoUrl,
                demoUrl: project.demoUrl,
                tags: project.tags,
            },
        ];
    });

    return (
        <div className={styles.root}>
            <div className={styles.backdrop} aria-hidden='true' />
            <div className={styles.container}>
                <section className={styles.section}>
                    <PageHeader title={t('title')} description={t('description')} size='display' />

                    <FilterBar
                    title={tf('title')}
                    items={[
                        {
                            label: tf('all'),
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

                    {localizedProjects.length === 0 ? (
                        <p className={styles.empty}>{activeTag ? t('emptyFiltered') : t('empty')}</p>
                    ) : (
                        <>
                            <div className={styles.list}>
                            {localizedProjects.map((project) => (
                                <ProjectCard
                                    key={project.id}
                                    project={project}
                                    locale={locale}
                                    viewProjectLabel={t('viewProject')}
                                    viewCodeLabel={t('viewCode')}
                                    viewDemoLabel={t('viewDemo')}
                                />
                            ))}
                            </div>
                            {pagination.totalPages > 1 ? (
                            <Pagination
                                summary={tc('summary', {
                                    page: pagination.currentPage,
                                    totalPages: pagination.totalPages,
                                    totalItems: pagination.totalItems,
                                })}
                                previousLabel={tc('previous')}
                                nextLabel={tc('next')}
                                previousHref={
                                    pagination.currentPage > 1
                                        ? buildPageHref(
                                              `/${locale}/projects`,
                                              pagination.currentPage - 1,
                                              resolvedSearchParams,
                                          )
                                        : undefined
                                }
                                nextHref={
                                    pagination.currentPage < pagination.totalPages
                                        ? buildPageHref(
                                              `/${locale}/projects`,
                                              pagination.currentPage + 1,
                                              resolvedSearchParams,
                                          )
                                        : undefined
                                }
                                links={buildPaginationLinks(
                                    `/${locale}/projects`,
                                    pagination.currentPage,
                                    pagination.totalPages,
                                    resolvedSearchParams,
                                )}
                            />
                            ) : null}
                        </>
                    )}
                </section>
            </div>
        </div>
    );
}
