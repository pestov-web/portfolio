import { getTranslations } from 'next-intl/server';
import type { Locale } from '@/shared/config/index';
import { getLocalizedItem } from '@/shared/lib/content-localization';
import { prisma } from '@/shared/lib/prisma';
import { PageHeader } from '@/shared/ui/page-header';
import { ListRow } from '@/shared/ui/list-row';
import { Badge, ButtonLink } from '@/shared/ui';

export default async function AdminProjectsPage({ params }: { params: Promise<{ locale: Locale }> }) {
    const { locale } = await params;
    const t = await getTranslations('admin');

    const projects = await prisma.project.findMany({
        orderBy: { order: 'asc' },
        select: {
            id: true,
            published: true,
            order: true,
            createdAt: true,
            translations: {
                select: {
                    locale: true,
                    title: true,
                    slug: true,
                },
            },
        },
    });

    return (
        <div className='page-container page-x fade-in'>
            <div className='py-14'>
                <PageHeader
                    title={t('projects')}
                    size='md'
                    actions={
                        <ButtonLink href={`/${locale}/admin/projects/new`} variant='primary'>
                            + {t('new')}
                        </ButtonLink>
                    }
                />

                {projects.length === 0 ? (
                    <p className='text-sm text-faint'>{t('emptyProjects')}</p>
                ) : (
                    <div className='flex flex-col gap-1'>
                        {projects.map((project) => {
                            const translation = getLocalizedItem(project.translations, locale);

                            return (
                                <ListRow key={project.id}>
                                    <div className='flex items-center gap-3 min-w-0'>
                                        <Badge variant={project.published ? 'success' : 'muted'}>
                                            {project.published ? t('published') : t('draft')}
                                        </Badge>
                                        {translation ? <Badge variant='muted'>{translation.locale.toUpperCase()}</Badge> : null}
                                        <span className='truncate text-sm'>{translation?.title ?? project.id}</span>
                                    </div>
                                    <div className='flex items-center gap-2 shrink-0'>
                                        <span className='hidden sm:block text-xs text-faint font-mono'>
                                            #{project.order}
                                        </span>
                                        <ButtonLink
                                            href={`/${locale}/admin/projects/${project.id}/edit`}
                                            variant='outline'
                                            size='sm'
                                        >
                                            {t('edit')}
                                        </ButtonLink>
                                    </div>
                                </ListRow>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
