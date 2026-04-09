import { cx } from "@/shared/lib/classnames";
import type { BadgeVariant } from "./badge.types";

const variantClassNames: Record<BadgeVariant, string> = {
  muted: "bg-subtle text-faint",
  success: "bg-green-500/10 text-green-500",
  accent: "bg-indigo-500/10 text-accent",
  danger: "bg-red-500/10 text-red-400",
};

export function getBadgeClassName(variant: BadgeVariant = "muted", className?: string) {
  return cx(
    "shrink-0 rounded-full px-2 py-0.5 text-xs font-mono font-medium",
    variantClassNames[variant],
    className
  );
}