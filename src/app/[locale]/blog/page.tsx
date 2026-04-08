import { getTranslations } from "next-intl/server";
import type { Locale } from "@/shared/config/i18n";
import { prisma } from "@/shared/lib/prisma";
import { PostCard } from "@/entities/post";

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("blog");

  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
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
        {/* Заголовок */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold mb-2">{t("title")}</h1>
          <p className="text-muted">{t("description")}</p>
        </div>

        {/* Список постов */}
        {posts.length === 0 ? (
          <p className="text-sm text-faint">{t("empty")}</p>
        ) : (
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
        )}
      </section>
    </div>
  );
}
