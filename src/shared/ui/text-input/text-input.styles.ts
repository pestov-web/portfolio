import { cx } from "@/shared/lib/classnames";

export function getTextInputClassName(): string {
  return cx(
    "h-10 rounded-md border border-border bg-surface px-3 text-sm transition-colors",
    "focus:outline-none focus:ring-2 focus:ring-accent-vivid/50 focus:border-accent-vivid",
    "placeholder:text-faint"
  );
}