import { cx } from "@/shared/lib/classnames";
import type { SurfaceCardPadding, SurfaceCardStyleOptions } from "./surface-card.types";

const paddingClassNames: Record<SurfaceCardPadding, string> = {
  md: "p-4",
  lg: "p-6",
};

export function getSurfaceCardClassName({
  padding = "md",
  interactive = false,
}: SurfaceCardStyleOptions = {}): string {
  return cx(
    "glass",
    paddingClassNames[padding],
    interactive && "transition-colors hover:border-accent-vivid/40"
  );
}