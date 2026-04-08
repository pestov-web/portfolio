import Link from "next/link";
import Image from "next/image";
import type { ProjectPreview } from "../model";

// Иконки
function GitHubIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483v-1.688c-2.782.6-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844a9.59 9.59 0 012.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855v2.751c0 .269.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

function ExternalIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M2 10L10 2M4 2h6v6" />
    </svg>
  );
}

type Props = {
  project: ProjectPreview;
  locale: string;
  viewProjectLabel: string;
  viewCodeLabel: string;
  viewDemoLabel: string;
};

export function ProjectCard({ project, locale, viewProjectLabel, viewCodeLabel, viewDemoLabel }: Props) {
  const href = `/${locale}/projects/${project.slug}`;

  return (
    <article className="glass flex flex-col overflow-hidden group">
      {/* Обложка */}
      {project.coverImage && (
        <div className="relative h-44 overflow-hidden">
          <Image
            src={project.coverImage}
            alt={project.title}
            fill
            unoptimized
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      )}

      <div className="flex flex-col gap-3 p-5 flex-1">
        {/* Заголовок */}
        <h2 className="text-base font-semibold leading-snug">
          <Link href={href} className="no-underline hover:text-accent transition-colors">
            {project.title}
          </Link>
        </h2>

        {/* Описание */}
        {project.description && (
          <p className="text-sm text-muted line-clamp-3 leading-relaxed flex-1">
            {project.description}
          </p>
        )}

        {/* Теги технологий */}
        {project.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {project.tags.slice(0, 5).map(({ tag }) => (
              <span
                key={tag.slug}
                className="px-2 py-0.5 text-xs rounded-full bg-subtle text-faint font-mono"
              >
                {tag.name}
              </span>
            ))}
          </div>
        )}

        {/* Ссылки */}
        <div className="mt-auto flex items-center gap-3 pt-1">
          <Link
            href={href}
            className="text-xs font-medium text-accent hover:text-accent-vivid no-underline transition-colors"
          >
            {viewProjectLabel} →
          </Link>
          {project.repoUrl && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-faint hover:text-fg no-underline transition-colors"
            >
              <GitHubIcon />
              {viewCodeLabel}
            </a>
          )}
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-faint hover:text-fg no-underline transition-colors"
            >
              {viewDemoLabel}
              <ExternalIcon />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
