import { getTranslations } from "next-intl/server";
import type { Locale } from "@/shared/config/index";
import { prisma } from "@/shared/lib/prisma";
import { ProjectCard } from "@/entities/project";
import { PageHeader } from "@/shared/ui/page-header";

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("projects");

  const projects = await prisma.project.findMany({
    where: { published: true },
    orderBy: { order: "asc" },
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

        {/* Сетка проектов */}
        {projects.length === 0 ? (
          <p className="text-sm text-faint">{t("empty")}</p>
        ) : (
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
        )}
      </section>
    </div>
  );
}
