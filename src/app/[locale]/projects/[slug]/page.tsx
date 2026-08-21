import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import type { Locale } from '@/shared/config/index';
import { toRenderableFileUrl } from '@/shared/lib/media';
import { prisma } from '@/shared/lib/prisma';
import { renderTiptap } from '@/shared/lib/tiptap';
import { ButtonLink, CoverMedia, DetailHeader, ExternalLinkIcon, GitHubIcon } from '@/shared/ui';
import { projectDetailClassNames as styles } from './project-detail.styles';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: Locale; slug: string }>;
}): Promise<Metadata> {
    const { locale, slug } = await params;

    const projectTranslation = await prisma.projectTranslation.findUnique({
        where: { locale_slug: { locale, slug } },
        select: {
            title: true,
            description: true,
            project: { select: { coverImage: true, published: true } },
        },
    });

    if (!projectTranslation || !projectTranslation.project.published) return {};

    const ogImage = projectTranslation.project.coverImage
        ? toRenderableFileUrl(projectTranslation.project.coverImage)
        : undefined;

    return {
        title: projectTranslation.title,
        description: projectTranslation.description ?? undefined,
        alternates: { canonical: `${APP_URL}/${locale}/projects/${slug}` },
        openGraph: {
            title: projectTranslation.title,
            description: projectTranslation.description ?? undefined,
            url: `${APP_URL}/${locale}/projects/${slug}`,
            type: 'article',
            ...(ogImage ? { images: [{ url: ogImage, width: 1200, height: 630, alt: projectTranslation.title }] } : {}),
        },
    };
}

export default async function ProjectPage({ params }: { params: Promise<{ locale: Locale; slug: string }> }) {
    const { locale, slug } = await params;
    const t = await getTranslations('projects');

    const projectTranslation = await prisma.projectTranslation.findUnique({
        where: { locale_slug: { locale, slug } },
        include: {
            project: {
                include: {
                    tags: { include: { tag: true } },
                },
            },
        },
    });

    if (!projectTranslation || !projectTranslation.project.published) notFound();
    const project = projectTranslation.project;

    const html = projectTranslation.content ? renderTiptap(projectTranslation.content) : null;

    return (
        <div className={styles.root}>
            <div className={styles.backdrop} aria-hidden='true' />
            <div className={styles.container}>
                <article className={styles.article}>
                    <nav className={styles.breadcrumb} aria-label={t('breadcrumbLabel')}>
                        <Link href={`/${locale}/projects`} className={styles.breadcrumbLink}>
                        projects
                        </Link>
                        <span className={styles.breadcrumbSlash} aria-hidden='true'>/</span>
                        <span className={styles.breadcrumbCurrent}>{projectTranslation.slug}</span>
                    </nav>

                    <DetailHeader
                        title={projectTranslation.title}
                        description={projectTranslation.description}
                        className='max-w-5xl'
                        tags={project.tags.map(({ tag }) => (
                            <span key={tag.slug} className={styles.tag}>
                                {tag.name}
                            </span>
                        ))}
                        actions={
                            <>
                                {project.repoUrl ? (
                                    <ButtonLink
                                        href={project.repoUrl}
                                        target='_blank'
                                        rel='noopener noreferrer'
                                        variant='secondary'
                                        className={styles.action}
                                    >
                                        <GitHubIcon width={16} height={16} />
                                        {t('viewCode')}
                                    </ButtonLink>
                                ) : null}
                                {project.demoUrl ? (
                                    <ButtonLink
                                        href={project.demoUrl}
                                        target='_blank'
                                        rel='noopener noreferrer'
                                        variant='primary'
                                        className={styles.action}
                                    >
                                        {t('viewDemo')}
                                        <ExternalLinkIcon width={14} height={14} />
                                    </ButtonLink>
                                ) : null}
                            </>
                        }
                    />

                    {project.coverImage ? (
                        <CoverMedia src={toRenderableFileUrl(project.coverImage)} alt={projectTranslation.title} priority />
                    ) : null}

                    {html ? <div className={styles.content} dangerouslySetInnerHTML={{ __html: html }} /> : null}
                </article>
            </div>
        </div>
    );
}
