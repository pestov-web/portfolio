import { cx } from "@/shared/lib/classnames";

export const themeToggleClassNames = {
  placeholder: "size-8",
} as const;

export function getThemeToggleButtonClassName(className?: string) {
  return cx(
    "size-8 flex items-center justify-center rounded-md text-muted hover:text-fg hover:bg-subtle transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-vivid/60 focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
    className
  );
}