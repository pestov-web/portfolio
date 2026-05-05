import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { auth } from '@/shared/auth/server/index';
import type { Locale } from '@/shared/config/index';
import { toRenderableFileUrl } from '@/shared/lib/media';
import { prisma } from '@/shared/lib/prisma';
import { renderTiptap } from '@/shared/lib/tiptap';
import { ButtonLink } from '@/shared/ui';
import { CoverMedia } from '@/shared/ui/cover-media';
import { DetailHeader } from '@/shared/ui/detail-header';
import { CommentsSection } from './comments-section';

function formatDate(date: Date, locale: string) {
    return new Intl.DateTimeFormat(locale === 'ru' ? 'ru-RU' : 'en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    }).format(date);
}

export default async function BlogPostPage({ params }: { params: Promise<{ locale: Locale; slug: string }> }) {
    const { locale, slug } = await params;
    const t = await getTranslations('blog');

    const postTranslation = await prisma.postTranslation.findUnique({
        where: { locale_slug: { locale, slug } },
        include: {
            post: {
                include: {
                    tags: { include: { tag: true } },
                    comments: {
                        orderBy: { createdAt: 'asc' },
                        include: { user: { select: { id: true, name: true, image: true } } },
                    },
                },
            },
        },
    });

    if (!postTranslation || !postTranslation.post.published) notFound();
    const post = postTranslation.post;

    // Если пост закрытый — проверяем роль
    if (post.restricted) {
        const session = await auth.api.getSession({ headers: await headers() });
        const role = session?.user.role;
        if (!role || (role !== 'FRIEND' && role !== 'ADMIN')) {
            return (
                <div className='page-container page-x fade-in'>
                    <div className='py-20 flex flex-col items-center gap-4 text-center'>
                        <div className='text-3xl'>🔒</div>
                        <h1 className='text-xl font-semibold'>{t('restrictedPost')}</h1>
                        <ButtonLink href={`/${locale}/login`} variant='primary' className='mt-2'>
                            {t('loginToRead')}
                        </ButtonLink>
                    </div>
                </div>
            );
        }
    }

    const html = renderTiptap(postTranslation.content);

    return (
        <div className='page-container page-x fade-in'>
            <article className='py-14 max-w-3xl mx-auto'>
                {/* Хлебные крошки */}
                <nav className='mb-8 text-sm text-faint font-mono'>
                    <Link href={`/${locale}/blog`} className='no-underline hover:text-accent transition-colors'>
                        blog
                    </Link>
                    <span className='mx-2 text-border'>/</span>
                    <span className='text-muted truncate'>{postTranslation.slug}</span>
                </nav>

                <DetailHeader
                    title={postTranslation.title}
                    tags={post.tags.map(({ tag }) => (
                        <Link
                            key={tag.slug}
                            href={`/${locale}/blog?tag=${tag.slug}`}
                            className='px-2.5 py-0.5 text-xs rounded-full bg-subtle text-muted no-underline hover:text-accent transition-colors'
                        >
                            {tag.name}
                        </Link>
                    ))}
                    meta={<time dateTime={post.createdAt.toISOString()}>{formatDate(post.createdAt, locale)}</time>}
                />

                {/* Обложка */}
                {post.coverImage && (
                    <CoverMedia src={toRenderableFileUrl(post.coverImage)} alt={postTranslation.title} priority />
                )}

                {/* Контент */}
                {html ? (
                    <div className='prose' dangerouslySetInnerHTML={{ __html: html }} />
                ) : (
                    <p className='text-faint text-sm'>{t('emptyContent')}</p>
                )}
            </article>

            {/* Комментарии */}
            <div className='max-w-3xl mx-auto pb-16'>
                <CommentsSection postId={post.id} comments={post.comments} locale={locale} />
            </div>
        </div>
    );
}
