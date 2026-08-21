import { getTranslations } from "next-intl/server";
import type { Metadata } from 'next';
import { PageHeader } from '@/shared/ui';
import type { Locale } from '@/shared/config';
import { locales } from '@/shared/config';
import { ContactForm } from './contact-form';
import { contactPageClassNames as styles } from './contact.styles';

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
    <div className={styles.root}>
      <div className={styles.backdrop} aria-hidden="true" />
      <div className={styles.container}>
        <section className={styles.section}>
          <div className={styles.header}>
            <PageHeader
              title={t("title")}
              description={t("description")}
              size="display"
            />
          </div>
          <div className={styles.formPanel}>
            <ContactForm locale={locale} />
          </div>
        </section>
      </div>
    </div>
  );
}
