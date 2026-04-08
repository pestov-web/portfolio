import { getTranslations } from "next-intl/server";
import Link from "next/link";
import type { Locale } from "@/shared/config/i18n";
import { prisma } from "@/shared/lib/prisma";

export default async function AdminPostsPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("admin");

  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      slug: true,
      published: true,
      restricted: true,
      createdAt: true,
    },
  });

  return (
    <div className="page-container page-x fade-in">
      <div className="py-14">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">{t("posts")}</h1>
          <Link
            href={`/${locale}/admin/posts/new`}
            className="px-4 py-2 bg-accent-vivid text-white text-sm font-medium rounded-md no-underline hover:bg-accent-dim transition-colors"
          >
            + {t("new")}
          </Link>
        </div>

        {posts.length === 0 ? (
          <p className="text-sm text-faint">Нет постов.</p>
        ) : (
          <div className="flex flex-col gap-1">
            {posts.map((post) => (
              <div key={post.id} className="glass flex items-center justify-between gap-4 px-4 py-3">
                <div className="flex items-center gap-3 min-w-0">
                  {/* Бейджи статуса */}
                  <span className={[
                    "shrink-0 text-xs px-2 py-0.5 rounded-full font-mono",
                    post.published ? "bg-green-500/10 text-green-500" : "bg-subtle text-faint",
                  ].join(" ")}>
                    {post.published ? t("published") : t("draft")}
                  </span>
                  {post.restricted && (
                    <span className="shrink-0 text-xs px-2 py-0.5 rounded-full bg-indigo-500/10 text-accent font-mono">
                      {t("restricted")}
                    </span>
                  )}
                  <span className="truncate text-sm">{post.title}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="hidden sm:block text-xs text-faint font-mono">
                    {new Date(post.createdAt).toLocaleDateString("ru-RU")}
                  </span>
                  <Link
                    href={`/${locale}/admin/posts/${post.id}/edit`}
                    className="px-3 py-1 text-xs border border-border rounded-md no-underline hover:bg-subtle transition-colors"
                  >
                    {t("edit")}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
