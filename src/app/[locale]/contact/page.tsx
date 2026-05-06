import { getTranslations } from "next-intl/server";
import type { Metadata } from 'next';
import { PageHeader } from '@/shared/ui';
import type { Locale } from '@/shared/config';
import { locales } from '@/shared/config';
import { ContactForm } from './contact-form';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'contact' });

    return {
        title: t('title'),
        description: t('description'),
        alternates: {
            canonical: `${APP_URL}/${locale}/contact`,
            languages: Object.fromEntries(locales.map((l) => [l, `${APP_URL}/${l}/contact`])),
        },
        openGraph: {
            title: t('title'),
            description: t('description'),
            url: `${APP_URL}/${locale}/contact`,
        },
    };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });

  return (
    <div className="page-container page-x fade-in">
      <section className="py-14 max-w-xl">
        <PageHeader
          title={t("title")}
          description={t("description")}
        />
        <ContactForm locale={locale} />
      </section>
    </div>
  );
}
