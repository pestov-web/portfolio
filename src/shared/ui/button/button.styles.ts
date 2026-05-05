import { cx } from "@/shared/lib/classnames";
import type { ButtonSize, ButtonStyleOptions, ButtonVariant } from "./button.types";

const baseClassName =
  "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-vivid/60 focus-visible:ring-offset-2 focus-visible:ring-offset-bg";

const variantClassNames: Record<ButtonVariant, string> = {
  primary: "bg-accent-vivid text-white hover:bg-accent-dim",
  secondary: "border border-border hover:bg-subtle hover:border-transparent",
  outline: "border border-border hover:bg-subtle",
  danger: "border border-red-500/30 text-red-500 hover:bg-red-500/10",
};

const sizeClassNames: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-xs",
  md: "px-4 py-2 text-sm",
};

export function getButtonClassName({
  variant = "primary",
  size = "md",
  fullWidth = false,
}: ButtonStyleOptions = {}): string {
  return cx(
    baseClassName,
    variantClassNames[variant],
    sizeClassNames[size],
    fullWidth && "w-full"
  );
}