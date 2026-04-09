import { cx } from "@/shared/lib/classnames";

export function getNativeSelectClassName(className?: string) {
  return cx(
    "h-8 rounded-md border border-border bg-surface px-2 text-xs transition-colors focus:outline-none focus:ring-2 focus:ring-accent-vivid/50 focus:border-accent-vivid",
    className
  );
}