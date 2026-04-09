import { cx } from "@/shared/lib/classnames";
import type { PageHeaderSize } from "./page-header.types";

const rootClassNames: Record<PageHeaderSize, string> = {
  md: "mb-8",
  lg: "mb-10",
};

const titleClassNames: Record<PageHeaderSize, string> = {
  md: "text-2xl font-bold",
  lg: "text-3xl font-bold",
};

const descriptionClassNames: Record<PageHeaderSize, string> = {
  md: "mt-1 text-sm text-muted",
  lg: "text-muted",
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
  eyebrow: "font-mono text-xs text-faint mb-2",
  actions: "shrink-0",
} as const;