import type { ComponentPropsWithoutRef, ReactNode } from "react";

export type BadgeVariant = "muted" | "success" | "accent" | "danger";

export type BadgeProps = ComponentPropsWithoutRef<"span"> & {
  children: ReactNode;
  variant?: BadgeVariant;
};