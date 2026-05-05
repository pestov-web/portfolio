import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { getLocale } from 'next-intl/server';
import { ThemeProvider } from '@/shared/ui/theme-provider';
import './globals.css';

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin', 'cyrillic'],
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
});

export const metadata: Metadata = {
    title: {
        template: '%s | Portfolio',
        default: 'Portfolio',
    },
    description: 'Full-Stack Developer Portfolio',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    const locale = await getLocale();
    const skipToContentLabel = locale === 'ru' ? 'Перейти к содержимому' : 'Skip to content';

    return (
        <html
            lang={locale}
            suppressHydrationWarning
            data-scroll-behavior='smooth'
            className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
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
