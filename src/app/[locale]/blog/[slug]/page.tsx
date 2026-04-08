import { notFound } from "next/navigation";
import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import type { Locale } from "@/shared/config/i18n";
import { prisma } from "@/shared/lib/prisma";
import { auth } from "@/shared/config/auth";
import { renderTiptap } from "@/shared/lib/tiptap";
import { CommentsSection } from "@/features/comments/ui/comments-section";

function formatDate(date: Date, locale: string) {
  return new Intl.DateTimeFormat(locale === "ru" ? "ru-RU" : "en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  const t = await getTranslations("blog");

  const post = await prisma.post.findUnique({
    where: { slug, published: true },
    include: {
      tags: { include: { tag: true } },
      comments: {
        orderBy: { createdAt: "asc" },
        include: { user: { select: { id: true, name: true, image: true } } },
      },
    },
  });

  if (!post) notFound();

  // Если пост закрытый — проверяем роль
  if (post.restricted) {
    const session = await auth.api.getSession({ headers: await headers() });
    const role = session?.user.role;
    if (!role || (role !== "FRIEND" && role !== "ADMIN")) {
      return (
        <div className="page-container page-x fade-in">
          <div className="py-20 flex flex-col items-center gap-4 text-center">
            <div className="text-3xl">🔒</div>
            <h1 className="text-xl font-semibold">{t("restrictedPost")}</h1>
            <Link
              href={`/${locale}/login`}
              className="mt-2 px-4 py-2 bg-accent-vivid text-white text-sm font-medium rounded-md no-underline hover:bg-accent-dim transition-colors"
            >
              {t("loginToRead")}
            </Link>
          </div>
        </div>
      );
    }
  }

  const html = renderTiptap(post.content);

  return (
    <div className="page-container page-x fade-in">
      <article className="py-14 max-w-3xl mx-auto">
        {/* Хлебные крошки */}
        <nav className="mb-8 text-sm text-faint font-mono">
          <Link href={`/${locale}/blog`} className="no-underline hover:text-accent transition-colors">
            blog
          </Link>
          <span className="mx-2 text-border">/</span>
          <span className="text-muted truncate">{post.slug}</span>
        </nav>

        {/* Шапка */}
        <header className="mb-10">
          {/* Теги */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map(({ tag }) => (
                <Link
                  key={tag.slug}
                  href={`/${locale}/blog?tag=${tag.slug}`}
                  className="px-2.5 py-0.5 text-xs rounded-full bg-subtle text-muted no-underline hover:text-accent transition-colors"
                >
                  {tag.name}
                </Link>
              ))}
            </div>
          )}

          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 leading-snug">
            {post.title}
          </h1>

          <time
            dateTime={post.createdAt.toISOString()}
            className="text-sm text-faint font-mono"
          >
            {formatDate(post.createdAt, locale)}
          </time>
        </header>

        {/* Обложка */}
        {post.coverImage && (
          <div className="relative w-full mb-10 rounded-page overflow-hidden" style={{ aspectRatio: "16/9" }}>
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              unoptimized
              priority
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
            />
          </div>
        )}

        {/* Контент */}
        {html ? (
          <div
            className="prose"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        ) : (
          <p className="text-faint text-sm">{t("emptyContent")}</p>
        )}
      </article>

      {/* Комментарии */}
      <div className="max-w-3xl mx-auto pb-16">
        <CommentsSection
          postId={post.id}
          comments={post.comments}
          locale={locale}
        />
      </div>
    </div>
  );
}
