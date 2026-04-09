import Link from "next/link";
import { paginationClassNames, getPaginationLinkClassName } from "./pagination.styles";
import type { PaginationProps } from "./pagination.types";

export function Pagination({
  summary,
  previousLabel,
  nextLabel,
  previousHref,
  nextHref,
  links,
}: PaginationProps) {
  if (links.length === 0) {
    return null;
  }

  return (
    <div className={paginationClassNames.root}>
      <p className={paginationClassNames.summary}>{summary}</p>
      <nav className={paginationClassNames.nav} aria-label="Pagination">
        <Link href={previousHref ?? "#"} className={getPaginationLinkClassName(false, !previousHref)}>
          {previousLabel}
        </Link>
        {links.map((link) => (
          <Link
            key={link.page}
            href={link.href}
            aria-current={link.isCurrent ? "page" : undefined}
            className={getPaginationLinkClassName(link.isCurrent)}
          >
            {link.page}
          </Link>
        ))}
        <Link href={nextHref ?? "#"} className={getPaginationLinkClassName(false, !nextHref)}>
          {nextLabel}
        </Link>
      </nav>
    </div>
  );
}

export { getPaginationLinkClassName, paginationClassNames } from "./pagination.styles";
export type { PaginationLinkItem, PaginationProps } from "./pagination.types";