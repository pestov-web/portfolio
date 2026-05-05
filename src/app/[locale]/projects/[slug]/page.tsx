import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import type { Locale } from '@/shared/config/index';
import { toRenderableFileUrl } from '@/shared/lib/media';
import { prisma } from '@/shared/lib/prisma';
import { renderTiptap } from '@/shared/lib/tiptap';
import { ButtonLink, ExternalLinkIcon, GitHubIcon } from '@/shared/ui';
import { CoverMedia } from '@/shared/ui/cover-media';
import { DetailHeader } from '@/shared/ui/detail-header';

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
        <div className='page-container page-x fade-in'>
            <article className='py-14 max-w-3xl mx-auto'>
                {/* Хлебные крошки */}
                <nav className='mb-8 text-sm text-faint font-mono'>
                    <Link href={`/${locale}/projects`} className='no-underline hover:text-accent transition-colors'>
                        projects
                    </Link>
                    <span className='mx-2 text-border'>/</span>
                    <span className='text-muted truncate'>{projectTranslation.slug}</span>
                </nav>

                <DetailHeader
                    title={projectTranslation.title}
                    description={projectTranslation.description}
                    tags={project.tags.map(({ tag }) => (
                        <span
                            key={tag.slug}
                            className='px-2.5 py-0.5 text-xs rounded-full bg-subtle text-faint font-mono'
                        >
                            {tag.name}
                        </span>
                    ))}
                    actions={
                        <>
                            {project.repoUrl && (
                                <ButtonLink
                                    href={project.repoUrl}
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    variant='secondary'
                                >
                                    <GitHubIcon width={16} height={16} />
                                    {t('viewCode')}
                                </ButtonLink>
                            )}
                            {project.demoUrl && (
                                <ButtonLink
                                    href={project.demoUrl}
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    variant='primary'
                                >
                                    {t('viewDemo')}
                                    <ExternalLinkIcon width={14} height={14} />
                                </ButtonLink>
                            )}
                        </>
                    }
                />

                {/* Обложка */}
                {project.coverImage && (
                    <CoverMedia src={toRenderableFileUrl(project.coverImage)} alt={projectTranslation.title} priority />
                )}

                {/* Контент */}
                {html && <div className='prose' dangerouslySetInnerHTML={{ __html: html }} />}
            </article>
        </div>
    );
}
