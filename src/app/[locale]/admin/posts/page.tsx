import { getTranslations } from 'next-intl/server';
import type { Locale } from '@/shared/config/index';
import { getLocalizedItem } from '@/shared/lib/content-localization';
import { prisma } from '@/shared/lib/prisma';
import { Badge, ButtonLink, ListRow, PageHeader } from '@/shared/ui';

export default async function AdminPostsPage({ params }: { params: Promise<{ locale: Locale }> }) {
    const { locale } = await params;
    const t = await getTranslations('admin');

    const posts = await prisma.post.findMany({
        orderBy: { createdAt: 'desc' },
        select: {
            id: true,
            published: true,
            restricted: true,
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
                    title={t('posts')}
                    size='md'
                    actions={
                        <ButtonLink href={`/${locale}/admin/posts/new`} variant='primary'>
                            + {t('new')}
                        </ButtonLink>
                    }
                />

                {posts.length === 0 ? (
                    <p className='text-sm text-faint'>{t('emptyPosts')}</p>
                ) : (
                    <div className='flex flex-col gap-1'>
                        {posts.map((post) => {
                            const translation = getLocalizedItem(post.translations, locale);

                            return (
                                <ListRow key={post.id}>
                                    <div className='flex items-center gap-3 min-w-0'>
                                        {/* Бейджи статуса */}
                                        <Badge variant={post.published ? 'success' : 'muted'}>
                                            {post.published ? t('published') : t('draft')}
                                        </Badge>
                                        {post.restricted && <Badge variant='accent'>{t('restricted')}</Badge>}
                                        {translation ? <Badge variant='muted'>{translation.locale.toUpperCase()}</Badge> : null}
                                        <span className='truncate text-sm'>{translation?.title ?? post.id}</span>
                                    </div>
                                    <div className='flex items-center gap-2 shrink-0'>
                                        <span className='hidden sm:block text-xs text-faint font-mono'>
                                            {new Date(post.createdAt).toLocaleDateString(
                                                locale === 'ru' ? 'ru-RU' : 'en-US',
                                            )}
                                        </span>
                                        <ButtonLink
                                            href={`/${locale}/admin/posts/${post.id}/edit`}
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
