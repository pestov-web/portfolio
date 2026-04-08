import { getTranslations } from "next-intl/server";
import type { Locale } from "@/shared/config/i18n";
import { prisma } from "@/shared/lib/prisma";
import { ProjectCard } from "@/entities/project";

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
        {/* Заголовок */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold mb-2">{t("title")}</h1>
          <p className="text-muted">{t("description")}</p>
        </div>

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
