import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { auth } from '@/shared/auth/index.server';
import type { Locale } from '@/shared/config/index';
import { toRenderableFileUrl } from '@/shared/lib/media';
import { prisma } from '@/shared/lib/prisma';
import { renderTiptap } from '@/shared/lib/tiptap';
import { ButtonLink, CoverMedia, DetailHeader } from '@/shared/ui';
import { CommentsSection } from './comments-section';
import { articlePageClassNames as styles } from './article.styles';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: Locale; slug: string }>;
}): Promise<Metadata> {
    const { locale, slug } = await params;

    const postTranslation = await prisma.postTranslation.findUnique({
        where: { locale_slug: { locale, slug } },
        select: {
            title: true,
            excerpt: true,
            post: { select: { coverImage: true, published: true, restricted: true } },
        },
    });

    if (!postTranslation || !postTranslation.post.published) return {};

    if (postTranslation.post.restricted) {
        return {
            title: postTranslation.title,
            robots: { index: false, follow: false },
        };
    }

    const ogImage = postTranslation.post.coverImage
        ? toRenderableFileUrl(postTranslation.post.coverImage)
        : undefined;

    return {
        title: postTranslation.title,
        description: postTranslation.excerpt ?? undefined,
        alternates: { canonical: `${APP_URL}/${locale}/blog/${slug}` },
        openGraph: {
            title: postTranslation.title,
            description: postTranslation.excerpt ?? undefined,
            url: `${APP_URL}/${locale}/blog/${slug}`,
            type: 'article',
            ...(ogImage ? { images: [{ url: ogImage, width: 1200, height: 630, alt: postTranslation.title }] } : {}),
        },
    };
}

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
                <div className={styles.root}>
                    <div className={styles.backdrop} aria-hidden='true' />
                    <div className={styles.container}>
                        <div className={styles.restricted}>
                            <p className={styles.restrictedIndex}>401 / private</p>
                            <h1 className={styles.restrictedTitle}>{t('restrictedPost')}</h1>
                            <ButtonLink href={`/${locale}/login`} variant='primary' className={styles.restrictedAction}>
                                {t('loginToRead')}
                            </ButtonLink>
                        </div>
                    </div>
                </div>
            );
        }
    }

    const html = renderTiptap(postTranslation.content);

    return (
        <div className={styles.root}>
            <div className={styles.backdrop} aria-hidden='true' />
            <div className={styles.container}>
                <article className={styles.article}>
                    <nav className={styles.breadcrumb} aria-label={t('breadcrumbLabel')}>
                        <Link href={`/${locale}/blog`} className={styles.breadcrumbLink}>
                        blog
                        </Link>
                        <span className={styles.breadcrumbSlash} aria-hidden='true'>/</span>
                        <span className={styles.breadcrumbCurrent}>{postTranslation.slug}</span>
                    </nav>

                    <DetailHeader
                        title={postTranslation.title}
                        description={postTranslation.excerpt}
                        className='max-w-5xl'
                        tags={post.tags.map(({ tag }) => (
                            <Link
                                key={tag.slug}
                                href={`/${locale}/blog?tag=${tag.slug}`}
                                className={styles.tag}
                            >
                                {tag.name}
                            </Link>
                        ))}
                        meta={<time dateTime={post.createdAt.toISOString()}>{formatDate(post.createdAt, locale)}</time>}
                    />

                    {post.coverImage ? (
                        <CoverMedia src={toRenderableFileUrl(post.coverImage)} alt={postTranslation.title} priority />
                    ) : null}

                    {html ? (
                        <div className={`${styles.content} prose`} dangerouslySetInnerHTML={{ __html: html }} />
                    ) : (
                        <p className={styles.emptyContent}>{t('emptyContent')}</p>
                    )}
                </article>

                <div className={styles.comments}>
                    <CommentsSection postId={post.id} comments={post.comments} locale={locale} />
                </div>
            </div>
        </div>
    );
}
