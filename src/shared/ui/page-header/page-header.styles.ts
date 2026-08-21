import { cx } from "@/shared/lib/classnames";
import type { PageHeaderSize } from "./page-header.types";

const rootClassNames: Record<PageHeaderSize, string> = {
  md: "mb-8",
  lg: "mb-10",
  display: "mb-12 md:mb-14",
};

const titleClassNames: Record<PageHeaderSize, string> = {
  md: "text-2xl font-bold",
  lg: "text-3xl font-bold",
  display: "max-w-4xl text-balance text-[clamp(3.75rem,8vw,6.8rem)] font-semibold leading-[0.86] tracking-[-0.07em]",
};

const descriptionClassNames: Record<PageHeaderSize, string> = {
  md: "mt-1 text-sm text-muted",
  lg: "text-muted",
  display: "mt-6 max-w-2xl text-pretty text-base leading-7 text-muted md:text-lg",
};

export function getPageHeaderRootClassName(size: PageHeaderSize, hasActions: boolean, className?: string) {
  return cx(
    rootClassNames[size],
    hasActions && "flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between",
    className
  );
}

export function getPageHeaderTitleClassName(size: PageHeaderSize) {
  return titleClassNames[size];
}

export function getPageHeaderDescriptionClassName(size: PageHeaderSize) {
  return descriptionClassNames[size];
}

export const pageHeaderClassNames = {
  content: "min-w-0",
  eyebrow: "mb-3 font-mono text-[0.68rem] uppercase tracking-[0.2em] text-accent-strong",
  actions: "shrink-0",
} as const;
