import type { ComponentPropsWithoutRef, ReactNode } from "react";
import type { SurfaceCard } from "@/shared/ui/surface-card";

export type ListRowLayout = "between" | "responsive";
export type ListRowPadding = "compact" | "comfortable";

export type ListRowStyleOptions = {
  layout?: ListRowLayout;
  padding?: ListRowPadding;
};

export type ListRowProps = Omit<ComponentPropsWithoutRef<typeof SurfaceCard>, keyof ListRowStyleOptions> &
  ListRowStyleOptions & {
    children: ReactNode;
  };