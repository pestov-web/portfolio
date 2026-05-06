import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { BLOG_POSTS_PER_PAGE, type Locale } from '@/shared/config/index';
import { locales } from '@/shared/config/index';
import { prisma } from '@/shared/lib/prisma';
import { buildPageHref, buildPaginationLinks, getPaginationMeta, parsePageParam } from '@/shared/lib/pagination';
import { getLocalizedItem } from '@/shared/lib/content-localization';
import { PostCard } from '@/entities/post';
import { FilterBar, Pagination, PageHeader } from '@/shared/ui';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'blog' });

    return {
        title: t('title'),
        description: t('description'),
        alternates: {
            canonical: `${APP_URL}/${locale}/blog`,
            languages: Object.fromEntries(locales.map((l) => [l, `${APP_URL}/${l}/blog`])),
        },
        openGraph: {
            title: t('title'),
            description: t('description'),
            url: `${APP_URL}/${locale}/blog`,
        },
    };
}

export default async function BlogPage({
    params,
    searchParams,
}: {
    params: Promise<{ locale: Locale }>;
    searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
    const { locale } = await params;
    const resolvedSearchParams = await searchParams;
    const t = await getTranslations({ locale, namespace: 'blog' });
    const tc = await getTranslations({ locale, namespace: 'common.pagination' });
    const tf = await getTranslations({ locale, namespace: 'common.filters' });
    const requestedPage = parsePageParam(resolvedSearchParams.page);
    const activeTag = Array.isArray(resolvedSearchParams.tag) ? resolvedSearchParams.tag[0] : resolvedSearchParams.tag;

    const publishedPostsWhere = {
        published: true,
        translations: { some: { locale } },
        ...(activeTag ? { tags: { some: { tag: { slug: activeTag } } } } : {}),
    } as const;

    const [totalPosts, availableTags] = await Promise.all([
        prisma.post.count({ where: publishedPostsWhere }),
        prisma.tag.findMany({
            where: { posts: { some: { post: { published: true, translations: { some: { locale } } } } } },
            orderBy: { name: 'asc' },
            select: { name: true, slug: true },
        }),
    ]);

    const pagination = getPaginationMeta(totalPosts, BLOG_POSTS_PER_PAGE, requestedPage);

    const posts = await prisma.post.findMany({
        where: publishedPostsWhere,
        orderBy: { createdAt: 'desc' },
        skip: pagination.skip,
        take: pagination.pageSize,
        select: {
            id: true,
            coverImage: true,
            restricted: true,
            createdAt: true,
            tags: { select: { tag: { select: { name: true, slug: true } } } },
            translations: {
                where: { locale },
                select: {
                    locale: true,
                    title: true,
                    slug: true,
                    excerpt: true,
                },
            },
        },
    });

    const localizedPosts = posts.flatMap((post) => {
        const translation = getLocalizedItem(post.translations, locale);

        if (!translation) {
            return [];
        }

        return [
            {
                id: post.id,
                title: translation.title,
                slug: translation.slug,
                excerpt: translation.excerpt,
                coverImage: post.coverImage,
                restricted: post.restricted,
                createdAt: post.createdAt,
                tags: post.tags,
            },
        ];
    });

    return (
        <div className='page-container page-x fade-in'>
            <section className='py-14'>
                <PageHeader title={t('title')} description={t('description')} />

                <FilterBar
                    title={tf('title')}
                    items={[
                        {
                            label: tf('all'),
                            href: buildPageHref(`/${locale}/blog`, 1, { ...resolvedSearchParams, tag: undefined }),
                            isActive: !activeTag,
                        },
                        ...availableTags.map((tag) => ({
                            label: tag.name,
                            href: buildPageHref(`/${locale}/blog`, 1, { ...resolvedSearchParams, tag: tag.slug }),
                            isActive: tag.slug === activeTag,
                        })),
                    ]}
                />

                {localizedPosts.length === 0 ? (
                    <p className='text-sm text-faint'>{activeTag ? t('emptyFiltered') : t('empty')}</p>
                ) : (
                    <>
                        <div className='flex flex-col gap-6 sm:grid sm:grid-cols-2 lg:grid-cols-3'>
                            {localizedPosts.map((post) => (
                                <PostCard key={post.id} post={post} locale={locale} readMoreLabel={t('readMore')} />
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
                                              `/${locale}/blog`,
                                              pagination.currentPage - 1,
                                              resolvedSearchParams,
                                          )
                                        : undefined
                                }
                                nextHref={
                                    pagination.currentPage < pagination.totalPages
                                        ? buildPageHref(
                                              `/${locale}/blog`,
                                              pagination.currentPage + 1,
                                              resolvedSearchParams,
                                          )
                                        : undefined
                                }
                                links={buildPaginationLinks(
                                    `/${locale}/blog`,
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
    );
}
