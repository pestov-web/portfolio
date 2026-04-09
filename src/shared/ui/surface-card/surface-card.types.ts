import type { AnchorHTMLAttributes, ComponentPropsWithoutRef, ReactNode } from "react";
import type { LinkProps } from "next/link";

export type SurfaceCardPadding = "md" | "lg";

export type SurfaceCardStyleOptions = {
  padding?: SurfaceCardPadding;
  interactive?: boolean;
};

export type SurfaceCardProps = ComponentPropsWithoutRef<"div"> &
  SurfaceCardStyleOptions & {
    children: ReactNode;
  };

export type SurfaceCardLinkProps = LinkProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> &
  SurfaceCardStyleOptions & {
    children: ReactNode;
  };