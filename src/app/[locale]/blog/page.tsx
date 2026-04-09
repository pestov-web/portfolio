import { getTranslations } from "next-intl/server";
import {
  BLOG_POSTS_PER_PAGE,
  type Locale,
} from "@/shared/config/index";
import { prisma } from "@/shared/lib/prisma";
import {
  buildPageHref,
  buildPaginationLinks,
  getPaginationMeta,
  parsePageParam,
} from "@/shared/lib/pagination";
import { PostCard } from "@/entities/post";
import { FilterBar, Pagination, PageHeader } from "@/shared/ui";

export default async function BlogPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { locale } = await params;
  const resolvedSearchParams = await searchParams;
  const t = await getTranslations({ locale, namespace: "blog" });
  const tc = await getTranslations({ locale, namespace: "common.pagination" });
  const tf = await getTranslations({ locale, namespace: "common.filters" });
  const requestedPage = parsePageParam(resolvedSearchParams.page);
  const activeTag = Array.isArray(resolvedSearchParams.tag)
    ? resolvedSearchParams.tag[0]
    : resolvedSearchParams.tag;

  const publishedPostsWhere = {
    published: true,
    ...(activeTag ? { tags: { some: { tag: { slug: activeTag } } } } : {}),
  } as const;

  const [totalPosts, availableTags] = await Promise.all([
    prisma.post.count({ where: publishedPostsWhere }),
    prisma.tag.findMany({
      where: { posts: { some: { post: { published: true } } } },
      orderBy: { name: "asc" },
      select: { name: true, slug: true },
    }),
  ]);

  const pagination = getPaginationMeta(totalPosts, BLOG_POSTS_PER_PAGE, requestedPage);

  const posts = await prisma.post.findMany({
    where: publishedPostsWhere,
    orderBy: { createdAt: "desc" },
    skip: pagination.skip,
    take: pagination.pageSize,
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

        {posts.length === 0 ? (
          <p className="text-sm text-faint">{activeTag ? t("emptyFiltered") : t("empty")}</p>
        ) : (
              <>
                <div className="flex flex-col gap-6 sm:grid sm:grid-cols-2 lg:grid-cols-3">
                  {posts.map((post) => (
                    <PostCard
                      key={post.id}
                      post={post}
                      locale={locale}
                      readMoreLabel={t("readMore")}
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
                      ? buildPageHref(`/${locale}/blog`, pagination.currentPage - 1, resolvedSearchParams)
                      : undefined}
                    nextHref={pagination.currentPage < pagination.totalPages
                      ? buildPageHref(`/${locale}/blog`, pagination.currentPage + 1, resolvedSearchParams)
                      : undefined}
                    links={buildPaginationLinks(
                      `/${locale}/blog`,
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
