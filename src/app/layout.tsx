import type { Metadata, Viewport } from 'next';
import { Inter, Geist_Mono } from 'next/font/google';
import { getLocale } from 'next-intl/server';
import { ThemeProvider } from '@/shared/ui/theme-provider';
import './globals.css';

const inter = Inter({
    variable: '--font-inter',
    subsets: ['latin', 'cyrillic'],
    display: 'swap',
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
});

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    themeColor: [
        { media: '(prefers-color-scheme: light)', color: '#ffffff' },
        { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
    ],
};

export const metadata: Metadata = {
    metadataBase: new URL(APP_URL),
    title: {
        template: '%s | Portfolio',
        default: 'Portfolio',
    },
    description: 'Full-Stack Developer Portfolio',
    authors: [{ name: 'Владимир', url: APP_URL }],
    creator: 'Владимир',
    robots: { index: true, follow: true },
    openGraph: {
        type: 'website',
        siteName: 'Portfolio',
    },
    twitter: {
        card: 'summary_large_image',
    },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    const locale = await getLocale();
    const skipToContentLabel = locale === 'ru' ? 'Перейти к содержимому' : 'Skip to content';

    return (
        <html
            lang={locale}
            suppressHydrationWarning
            data-scroll-behavior='smooth'
            className={`${inter.variable} ${geistMono.variable} h-full antialiased`}
        >
            <body className='min-h-full flex flex-col bg-bg text-fg font-sans'>
                <a
                    href='#main-content'
                    className='sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-bg focus:px-3 focus:py-2 focus:text-sm focus:text-fg'
                >
                    {skipToContentLabel}
                </a>
                <ThemeProvider>{children}</ThemeProvider>
            </body>
        </html>
    );
}
