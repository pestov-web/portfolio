import { cx } from "@/shared/lib/classnames";

export const filterBarClassNames = {
  root: "mb-8 flex flex-col gap-3",
  title: "text-sm text-muted",
  list: "flex flex-wrap gap-2",
  link: "inline-flex items-center rounded-full border border-border px-3 py-1.5 text-sm no-underline transition-colors hover:border-accent-vivid hover:text-accent",
  activeLink: "border-accent-vivid bg-subtle text-accent",
} as const;

export function getFilterBarLinkClassName(isActive: boolean) {
  return cx(filterBarClassNames.link, isActive && filterBarClassNames.activeLink);
}