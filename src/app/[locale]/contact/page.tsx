"use client";

import { use } from "react";
import { useTranslations } from "next-intl";
import { PageHeader } from "@/shared/ui/page-header";
import type { Locale } from "@/shared/config";
import { ContactForm } from "./contact-form";

export default function ContactPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const t = useTranslations("contact");
  const { locale } = use(params);

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
