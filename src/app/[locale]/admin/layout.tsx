import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import type { Locale } from '@/shared/config/index';
import { auth } from '@/shared/auth/server/index';
import { localizePath } from '@/shared/lib/locale';

export const metadata: Metadata = {
    robots: { index: false, follow: false },
};

export default async function AdminLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session || session.user.role !== 'ADMIN') {
        redirect(localizePath(locale as Locale, '/login'));
    }

    return <>{children}</>;
}
