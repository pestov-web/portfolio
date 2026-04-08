import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import type { Locale } from "@/shared/config/i18n";
import { prisma } from "@/shared/lib/prisma";
import { renderTiptap } from "@/shared/lib/tiptap";

function GitHubIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483v-1.688c-2.782.6-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844a9.59 9.59 0 012.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855v2.751c0 .269.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

function ExternalIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M2 10L10 2M4 2h6v6" />
    </svg>
  );
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  const t = await getTranslations("projects");

  const project = await prisma.project.findUnique({
    where: { slug, published: true },
    include: {
      tags: { include: { tag: true } },
    },
  });

  if (!project) notFound();

  const html = project.content ? renderTiptap(project.content) : null;

  return (
    <div className="page-container page-x fade-in">
      <article className="py-14 max-w-3xl mx-auto">
        {/* Хлебные крошки */}
        <nav className="mb-8 text-sm text-faint font-mono">
          <Link href={`/${locale}/projects`} className="no-underline hover:text-accent transition-colors">
            projects
          </Link>
          <span className="mx-2 text-border">/</span>
          <span className="text-muted truncate">{project.slug}</span>
        </nav>

        {/* Шапка */}
        <header className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 leading-snug">
            {project.title}
          </h1>

          {project.description && (
            <p className="text-lg text-muted leading-relaxed mb-6">{project.description}</p>
          )}

          {/* Теги */}
          {project.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {project.tags.map(({ tag }) => (
                <span
                  key={tag.slug}
                  className="px-2.5 py-0.5 text-xs rounded-full bg-subtle text-faint font-mono"
                >
                  {tag.name}
                </span>
              ))}
            </div>
          )}

          {/* Ссылки */}
          <div className="flex flex-wrap gap-3">
            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 border border-border text-sm font-medium rounded-md no-underline hover:bg-subtle hover:border-transparent transition-colors"
              >
                <GitHubIcon />
                {t("viewCode")}
              </a>
            )}
            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-accent-vivid text-white text-sm font-medium rounded-md no-underline hover:bg-accent-dim transition-colors"
              >
                {t("viewDemo")}
                <ExternalIcon />
              </a>
            )}
          </div>
        </header>

        {/* Обложка */}
        {project.coverImage && (
          <div className="relative w-full mb-10 rounded-page overflow-hidden" style={{ aspectRatio: "16/9" }}>
            <Image
              src={project.coverImage}
              alt={project.title}
              fill
              unoptimized
              priority
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
            />
          </div>
        )}

        {/* Контент */}
        {html && (
          <div
            className="prose"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        )}
      </article>
    </div>
  );
}
