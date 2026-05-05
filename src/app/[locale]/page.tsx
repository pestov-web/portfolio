// Главная страница — заглушка, детали будут в src/pages/home
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import type { Locale } from '@/shared/config/index';
import { prisma } from '@/shared/lib/prisma';
import { PostCard } from '@/entities/post';
import { ProjectCard } from '@/entities/project';
import { ArrowRightIcon, ButtonLink } from '@/shared/ui';

type PostTranslationPreview = {
    locale: Locale;
    title: string;
    slug: string;
    excerpt: string | null;
};

type ProjectTranslationPreview = {
    locale: Locale;
    title: string;
    slug: string;
    description: string | null;
};

export default async function HomePage({ params }: { params: Promise<{ locale: Locale }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'home' });

    // Запросы к БД параллельно
    const [latestPosts, latestProjects] = await Promise.all([
        prisma.post.findMany({
            where: { published: true, translations: { some: { locale } } },
            orderBy: { createdAt: 'desc' },
            take: 3,
            select: {
                id: true,
                coverImage: true,
                restricted: true,
                createdAt: true,
                tags: { select: { tag: { select: { name: true, slug: true } } } },
                translations: {
                    where: { locale },
                    select: {
                        locale: true,
                        title: true,
                        slug: true,
                        excerpt: true,
                    },
                },
            },
        }),
        prisma.project.findMany({
            where: { published: true, translations: { some: { locale } } },
            orderBy: { order: 'asc' },
            take: 3,
            select: {
                id: true,
                coverImage: true,
                repoUrl: true,
                demoUrl: true,
                tags: { select: { tag: { select: { name: true, slug: true } } } },
                translations: {
                    where: { locale },
                    select: {
                        locale: true,
                        title: true,
                        slug: true,
                        description: true,
                    },
                },
            },
        }),
    ]);

    const localizedPosts = latestPosts.flatMap((post) => {
        const translation = post.translations[0] as PostTranslationPreview | undefined;

        if (!translation) {
            return [];
        }

        return [
            {
                id: post.id,
                title: translation.title,
                slug: translation.slug,
                excerpt: translation.excerpt,
                coverImage: post.coverImage,
                restricted: post.restricted,
                createdAt: post.createdAt,
                tags: post.tags,
            },
        ];
    });

    const localizedProjects = latestProjects.flatMap((project) => {
        const translation = project.translations[0] as ProjectTranslationPreview | undefined;

        if (!translation) {
            return [];
        }

        return [
            {
                id: project.id,
                title: translation.title,
                slug: translation.slug,
                description: translation.description,
                coverImage: project.coverImage,
                repoUrl: project.repoUrl,
                demoUrl: project.demoUrl,
                tags: project.tags,
            },
        ];
    });

    return (
        <div className='page-container page-x fade-in'>
            {/* ─── Hero ─────────────────────────────────────────────────────── */}
            <section className='py-20 md:py-28'>
                <p className='font-mono text-sm text-muted mb-3'>
                    <span className='text-accent'>$</span> whoami
                </p>
                <h1 className='text-4xl md:text-6xl font-bold tracking-tight mb-4'>
                    {t('hero.greeting')} <span className='text-accent'>{t('hero.name')}</span>
                    <span className='text-muted'>.</span>
                </h1>
                <p className='text-xl md:text-2xl text-muted mb-4'>{t('hero.role')}</p>
                <p className='max-w-xl text-base text-faint leading-relaxed mb-8'>{t('hero.bio')}</p>
                <div className='flex flex-wrap gap-3'>
                    <ButtonLink href={`/${locale}/projects`} variant='primary'>
                        {t('latestProjects')}
                        <ArrowRightIcon />
                    </ButtonLink>
                    <ButtonLink href={`/${locale}/blog`} variant='secondary'>
                        {t('latestPosts')}
                    </ButtonLink>
                </div>
            </section>

            {/* ─── Разделитель ────────────────────────────────────────────────── */}
            <hr className='border-border' />

            {/* ─── Последние посты ─────────────────────────────────────────── */}
            <section className='py-14'>
                <div className='flex items-center justify-between mb-8'>
                    <h2 className='text-lg font-semibold accent-line'>{t('latestPosts')}</h2>
                    <Link
                        href={`/${locale}/blog`}
                        className='flex items-center gap-1 text-sm text-muted hover:text-accent no-underline transition-colors'
                    >
                        {t('viewAll')} <ArrowRightIcon />
                    </Link>
                </div>

                {/* Список постов */}
                {localizedPosts.length === 0 ? (
                    <p className='text-sm text-faint'>{t('noPosts')}</p>
                ) : (
                    <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
                        {localizedPosts.map((post) => (
                            <PostCard key={post.id} post={post} locale={locale} readMoreLabel={t('readMore')} />
                        ))}
                    </div>
                )}
            </section>

            {/* ─── Последние проекты ────────────────────────────────────────── */}
            <section className='py-14'>
                <div className='flex items-center justify-between mb-8'>
                    <h2 className='text-lg font-semibold accent-line'>{t('latestProjects')}</h2>
                    <Link
                        href={`/${locale}/projects`}
                        className='flex items-center gap-1 text-sm text-muted hover:text-accent no-underline transition-colors'
                    >
                        {t('viewAll')} <ArrowRightIcon />
                    </Link>
                </div>

                {/* Список проектов */}
                {localizedProjects.length === 0 ? (
                    <p className='text-sm text-faint'>{t('noProjects')}</p>
                ) : (
                    <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
                        {localizedProjects.map((project) => (
                            <ProjectCard
                                key={project.id}
                                project={project}
                                locale={locale}
                                viewProjectLabel={t('viewProject')}
                                viewCodeLabel={t('viewCode')}
                                viewDemoLabel={t('viewDemo')}
                            />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
