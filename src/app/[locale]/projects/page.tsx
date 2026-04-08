import { getTranslations } from "next-intl/server";
import type { Locale } from "@/shared/config/i18n";

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  await params; // Используем locale для будущей локализации метаданных
  const t = await getTranslations("projects");

  return (
    <div className="page-container page-x fade-in">
      <section className="py-14">
        {/* Заголовок */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold mb-2">{t("title")}</h1>
          <p className="text-muted">{t("description")}</p>
        </div>

        {/* Сетка проектов */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="glass p-6 flex flex-col gap-4 animate-pulse">
              <div className="h-5 w-1/2 bg-subtle rounded" />
              <div className="h-3 w-full bg-subtle rounded" />
              <div className="h-3 w-3/4 bg-subtle rounded" />
              <div className="flex gap-2 mt-2">
                <div className="h-5 w-12 bg-subtle rounded-full" />
                <div className="h-5 w-10 bg-subtle rounded-full" />
                <div className="h-5 w-14 bg-subtle rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
