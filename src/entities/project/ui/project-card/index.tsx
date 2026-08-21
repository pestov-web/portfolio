import Image from "next/image";
import Link from "next/link";
import { ExternalLinkIcon, GitHubIcon } from "@/shared/ui";
import { toRenderableFileUrl } from "@/shared/lib/media";
import { projectCardClassNames } from "./project-card.styles";
import type { ProjectCardProps } from "./project-card.types";

export function ProjectCard({ project, locale, viewProjectLabel, viewCodeLabel, viewDemoLabel }: ProjectCardProps) {
  const href = `/${locale}/projects/${project.slug}`;

  return (
    <article className={projectCardClassNames.root}>
      <Link href={href} className={projectCardClassNames.cover} aria-label={project.title}>
        {project.coverImage ? (
          <Image
            src={toRenderableFileUrl(project.coverImage)}
            alt={project.title}
            fill
            unoptimized
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className={projectCardClassNames.coverImage}
          />
        ) : (
          <div className={projectCardClassNames.placeholder} aria-hidden="true">
            <span className={projectCardClassNames.monogram}>{project.title.slice(0, 2).toUpperCase()}</span>
          </div>
        )}
      </Link>

      <div className={projectCardClassNames.body}>
        <h2 className={projectCardClassNames.title}>
          <Link href={href} className={projectCardClassNames.titleLink}>
            {project.title}
          </Link>
        </h2>

        {project.description ? <p className={projectCardClassNames.description}>{project.description}</p> : null}

        {project.tags.length > 0 ? (
          <div className={projectCardClassNames.tags} translate="no">
            {project.tags.slice(0, 5).map(({ tag }) => (
              <Link
                key={tag.slug}
                href={`/${locale}/projects?tag=${tag.slug}`}
                className={projectCardClassNames.tag}
              >
                {tag.name}
              </Link>
            ))}
          </div>
        ) : null}

        <div className={projectCardClassNames.actions}>
          <Link href={href} className={projectCardClassNames.mainAction}>
            {viewProjectLabel} →
          </Link>
          {project.repoUrl ? (
            <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className={projectCardClassNames.secondaryAction}>
              <GitHubIcon width={14} height={14} />
              {viewCodeLabel}
            </a>
          ) : null}
          {project.demoUrl ? (
            <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className={projectCardClassNames.secondaryAction}>
              {viewDemoLabel}
              <ExternalLinkIcon />
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}

export { projectCardClassNames } from "./project-card.styles";
export type { ProjectCardProps } from "./project-card.types";
