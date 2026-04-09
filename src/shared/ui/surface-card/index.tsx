import Link from "next/link";
import { cx } from "@/shared/lib/classnames";
import { getSurfaceCardClassName } from "./surface-card.styles";
import type { SurfaceCardLinkProps, SurfaceCardProps } from "./surface-card.types";

export function SurfaceCard({
  padding,
  interactive,
  className,
  children,
  ...props
}: SurfaceCardProps) {
  return (
    <div className={cx(getSurfaceCardClassName({ padding, interactive }), className)} {...props}>
      {children}
    </div>
  );
}

export function SurfaceCardLink({
  padding,
  interactive = true,
  className,
  children,
  ...props
}: SurfaceCardLinkProps) {
  return (
    <Link
      className={cx(
        getSurfaceCardClassName({ padding, interactive }),
        interactive && "group",
        "no-underline",
        className
      )}
      {...props}
    >
      {children}
    </Link>
  );
}

export { getSurfaceCardClassName } from "./surface-card.styles";
export type {
  SurfaceCardLinkProps,
  SurfaceCardPadding,
  SurfaceCardProps,
  SurfaceCardStyleOptions,
} from "./surface-card.types";