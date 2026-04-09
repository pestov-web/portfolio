import { cx } from "@/shared/lib/classnames";

export function getTextAreaClassName(): string {
  return cx(
    "rounded-md border border-border bg-surface px-3 py-2 text-sm transition-colors resize-none",
    "focus:outline-none focus:ring-2 focus:ring-accent-vivid/50 focus:border-accent-vivid",
    "placeholder:text-faint"
  );
}