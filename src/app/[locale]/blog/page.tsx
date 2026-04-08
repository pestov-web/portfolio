import { getTranslations } from "next-intl/server";
import Link from "next/link";
import type { Locale } from "@/shared/config/i18n";

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("blog");

  return (
    <div className="page-container page-x fade-in">
      <section className="py-14">
        {/* Заголовок */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold mb-2">{t("title")}</h1>
          <p className="text-muted">{t("description")}</p>
        </div>

        {/* Список постов загружается через серверный компонент с Prisma */}
        {/* Заглушка */}
        <div className="flex flex-col gap-6">
          {[1, 2, 3, 4, 5].map((i) => (
            <article key={i} className="glass p-6 flex flex-col gap-3 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="h-5 w-20 bg-subtle rounded-full" />
                <div className="h-3 w-24 bg-subtle rounded" />
              </div>
              <div className="h-5 w-2/3 bg-subtle rounded" />
              <div className="h-3 w-full bg-subtle rounded" />
              <div className="h-3 w-4/5 bg-subtle rounded" />
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
