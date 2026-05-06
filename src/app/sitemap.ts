import type { MetadataRoute } from 'next';
import { prisma } from '@/shared/lib/prisma';
import { locales } from '@/shared/config';

export const dynamic = 'force-dynamic';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

const STATIC_PATHS = ['', '/blog', '/projects', '/contact'] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const staticEntries: MetadataRoute.Sitemap = STATIC_PATHS.flatMap((path) =>
        locales.map((locale) => ({
            url: `${APP_URL}/${locale}${path}`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: path === '' ? 1.0 : 0.8,
            alternates: {
                languages: Object.fromEntries(
                    locales.map((l) => [l, `${APP_URL}/${l}${path}`])
                ),
            },
        }))
    );

    const [postTranslations, projectTranslations] = await Promise.all([
        prisma.postTranslation.findMany({
            where: { post: { published: true, restricted: false } },
            select: { locale: true, slug: true, updatedAt: true },
            orderBy: { updatedAt: 'desc' },
        }),
        prisma.projectTranslation.findMany({
            where: { project: { published: true } },
            select: { locale: true, slug: true, updatedAt: true },
        }),
    ]);

    const postEntries: MetadataRoute.Sitemap = postTranslations.map((t) => ({
        url: `${APP_URL}/${t.locale}/blog/${t.slug}`,
        lastModified: t.updatedAt,
        changeFrequency: 'monthly' as const,
        priority: 0.7,
    }));

    const projectEntries: MetadataRoute.Sitemap = projectTranslations.map((t) => ({
        url: `${APP_URL}/${t.locale}/projects/${t.slug}`,
        lastModified: t.updatedAt,
        changeFrequency: 'monthly' as const,
        priority: 0.6,
    }));

    return [...staticEntries, ...postEntries, ...projectEntries];
}
