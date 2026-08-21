import Link from "next/link";
import { filterBarClassNames, getFilterBarLinkClassName } from "./filter-bar.styles";
import type { FilterBarProps } from "./filter-bar.types";

export function FilterBar({ title, items }: FilterBarProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className={filterBarClassNames.root}>
      <p className={filterBarClassNames.title}>{title}</p>
      <div className={filterBarClassNames.list}>
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            aria-current={item.isActive ? "page" : undefined}
            className={getFilterBarLinkClassName(item.isActive)}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

export { filterBarClassNames, getFilterBarLinkClassName } from "./filter-bar.styles";
export type { FilterBarItem, FilterBarProps } from "./filter-bar.types";
