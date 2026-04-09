import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";
import { GitHubIcon } from "@/shared/ui";
import { footerClassNames } from "./ui.styles";

export async function Footer() {
  const t = await getTranslations("common");
  const locale = await getLocale();
  const year = new Date().getFullYear();

  return (
    <footer className={footerClassNames.root}>
      <div className={footerClassNames.container}>
        <div className={footerClassNames.row}>
          <p className={footerClassNames.copyright}>
            <span className={footerClassNames.accent}>©</span>{" "}
            {year} — {t("author")}
          </p>

          <div className={footerClassNames.links}>
            <Link href={`/${locale}/blog/rss.xml`} className={footerClassNames.rss}>
              rss
            </Link>
            <a
              href="https://github.com/mwkeay"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className={footerClassNames.github}
            >
              <GitHubIcon />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export { footerClassNames } from "./ui.styles";