import { cx } from "@/shared/lib/classnames";
import type { ButtonSize, ButtonStyleOptions, ButtonVariant } from "./button.types";

const baseClassName =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-vivid/60 focus-visible:ring-offset-2 focus-visible:ring-offset-bg";

const variantClassNames: Record<ButtonVariant, string> = {
  primary: "bg-action-primary text-on-primary hover:bg-action-primary-hover shadow-sm",
  secondary: "border border-border bg-action-secondary text-on-secondary hover:bg-action-secondary-hover hover:border-border",
  outline: "border border-border bg-transparent text-fg hover:bg-subtle",
  inverse: "bg-white text-zinc-950 hover:bg-violet-100 shadow-sm",
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
