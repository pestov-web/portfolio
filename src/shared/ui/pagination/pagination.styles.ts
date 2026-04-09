import { cx } from "@/shared/lib/classnames";

export const paginationClassNames = {
  root: "mt-10 flex flex-col items-center gap-4",
  summary: "text-sm text-muted",
  nav: "flex flex-wrap items-center justify-center gap-2",
  link: "inline-flex h-9 min-w-9 items-center justify-center rounded-md border border-border px-3 text-sm no-underline transition-colors hover:border-accent-vivid hover:text-accent",
  currentLink: "border-accent-vivid bg-subtle text-accent",
  disabledLink: "pointer-events-none opacity-50",
} as const;

export function getPaginationLinkClassName(isCurrent = false, disabled = false) {
  return cx(
    paginationClassNames.link,
    isCurrent && paginationClassNames.currentLink,
    disabled && paginationClassNames.disabledLink
  );
}