import { getBadgeClassName } from "./badge.styles";
import type { BadgeProps } from "./badge.types";

export function Badge({
  variant = "muted",
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span className={getBadgeClassName(variant, className)} {...props}>
      {children}
    </span>
  );
}

export { getBadgeClassName } from "./badge.styles";
export type { BadgeProps, BadgeVariant } from "./badge.types";