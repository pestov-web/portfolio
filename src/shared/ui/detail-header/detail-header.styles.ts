import { cx } from "@/shared/lib/classnames";

export function getDetailHeaderClassName(className?: string) {
  return cx("mb-10", className);
}

export const detailHeaderClassNames = {
  tags: "flex flex-wrap gap-2 mb-4",
  title: "text-3xl md:text-4xl font-bold tracking-tight mb-4 leading-snug",
  description: "text-lg text-muted leading-relaxed mb-6",
  meta: "text-sm text-faint font-mono mb-4",
  actions: "flex flex-wrap gap-3",
} as const;