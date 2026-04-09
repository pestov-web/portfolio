import { cx } from "@/shared/lib/classnames";

export const themeToggleClassNames = {
  placeholder: "size-8",
} as const;

export function getThemeToggleButtonClassName(className?: string) {
  return cx(
    "size-8 flex items-center justify-center rounded-md text-muted hover:text-fg hover:bg-subtle transition-colors",
    className
  );
}