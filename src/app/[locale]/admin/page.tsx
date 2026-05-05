import { getTranslations } from "next-intl/server";
import type { Locale } from "@/shared/config/index";
import { prisma } from "@/shared/lib/prisma";
import { PageHeader } from "@/shared/ui/page-header";
import { ButtonLink } from "@/shared/ui";
import { StatCard } from "./stat-card";

export default async function AdminPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("admin");

  const [postCount, projectCount, userCount, tagCount] = await Promise.all([
    prisma.post.count(),
    prisma.project.count(),
    prisma.user.count(),
    prisma.tag.count(),
  ]);

  return (
    <div className="page-container page-x fade-in">
      <div className="py-14">
        <PageHeader
          title={t("title")}
          eyebrow={<><span className="text-accent">$</span> sudo dashboard</>}
        />

        {/* Статистика */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-12">
          <StatCard label={t("posts")} count={postCount} href={`/${locale}/admin/posts`} />
          <StatCard label={t("projects")} count={projectCount} href={`/${locale}/admin/projects`} />
          <StatCard label={t("users")} count={userCount} href={`/${locale}/admin/users`} />
          <StatCard label={t("tagsLabel")} count={tagCount} href={`/${locale}/admin/tags`} />
        </div>

        {/* Быстрые действия */}
        <div className="flex flex-wrap gap-3">
          <ButtonLink
            href={`/${locale}/admin/posts/new`}
            variant="primary"
          >
            + {t("new")} {t("posts").toLowerCase()}
          </ButtonLink>
          <ButtonLink
            href={`/${locale}/admin/projects/new`}
            variant="secondary"
          >
            + {t("new")} {t("projects").toLowerCase()}
          </ButtonLink>
          <ButtonLink
            href={`/${locale}/admin/tags`}
            variant="outline"
          >
            # {t("tagsLabel")}
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}
