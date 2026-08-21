import { cx } from "@/shared/lib/classnames";

export const filterBarClassNames = {
  root: "mb-10 grid gap-3 border-y border-border py-4 md:grid-cols-[8rem_minmax(0,1fr)] md:items-center",
  title: "font-mono text-[0.66rem] uppercase tracking-[0.16em] text-faint",
  list: "flex flex-wrap gap-2",
  link: "inline-flex min-h-9 touch-manipulation items-center rounded-full border px-3.5 py-1.5 text-sm no-underline transition-[color,background-color,border-color] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-vivid/60 focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
  inactiveLink: "border-border/80 bg-surface/60 text-muted hover:border-accent-vivid/30 hover:bg-subtle hover:text-fg",
  activeLink: "border-action-primary bg-action-primary text-on-primary shadow-sm hover:border-action-primary-hover hover:bg-action-primary-hover hover:text-on-primary",
} as const;

export function getFilterBarLinkClassName(isActive: boolean) {
  return cx(
    filterBarClassNames.link,
    isActive ? filterBarClassNames.activeLink : filterBarClassNames.inactiveLink,
  );
}
