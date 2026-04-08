import { getTranslations } from "next-intl/server";
import Link from "next/link";
import type { Locale } from "@/shared/config/i18n";
import { prisma } from "@/shared/lib/prisma";

type StatCardProps = {
  label: string;
  count: number;
  href: string;
};

function StatCard({ label, count, href }: StatCardProps) {
  return (
    <Link href={href} className="glass p-6 flex flex-col gap-1 no-underline hover:border-accent-vivid/40 transition-colors group">
      <span className="text-3xl font-bold font-mono text-fg group-hover:text-accent transition-colors">
        {count}
      </span>
      <span className="text-sm text-muted">{label}</span>
    </Link>
  );
}

export default async function AdminPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("admin");

  const [postCount, projectCount, userCount] = await Promise.all([
    prisma.post.count(),
    prisma.project.count(),
    prisma.user.count(),
  ]);

  return (
    <div className="page-container page-x fade-in">
      <div className="py-14">
        <div className="mb-10">
          <p className="font-mono text-xs text-faint mb-2">
            <span className="text-accent">$</span> sudo dashboard
          </p>
          <h1 className="text-3xl font-bold">{t("title")}</h1>
        </div>

        {/* Статистика */}
        <div className="grid gap-4 sm:grid-cols-3 mb-12">
          <StatCard label={t("posts")} count={postCount} href={`/${locale}/admin/posts`} />
          <StatCard label={t("projects")} count={projectCount} href={`/${locale}/admin/projects`} />
          <StatCard label={t("users")} count={userCount} href={`/${locale}/admin/users`} />
        </div>

        {/* Быстрые действия */}
        <div className="flex flex-wrap gap-3">
          <Link
            href={`/${locale}/admin/posts/new`}
            className="inline-flex items-center gap-2 px-4 py-2 bg-accent-vivid text-white text-sm font-medium rounded-md no-underline hover:bg-accent-dim transition-colors"
          >
            + {t("new")} {t("posts").toLowerCase()}
          </Link>
          <Link
            href={`/${locale}/admin/projects/new`}
            className="inline-flex items-center gap-2 px-4 py-2 border border-border text-sm font-medium rounded-md no-underline hover:bg-subtle hover:border-transparent transition-colors"
          >
            + {t("new")} {t("projects").toLowerCase()}
          </Link>
        </div>
      </div>
    </div>
  );
}
