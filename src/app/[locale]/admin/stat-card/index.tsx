import { SurfaceCardLink } from "@/shared/ui";
import { statCardClassNames } from "./stat-card.styles";
import type { StatCardProps } from "./stat-card.types";

export function StatCard({ label, count, href }: StatCardProps) {
  return (
    <SurfaceCardLink href={href} padding="lg" className={statCardClassNames.root}>
      <span className={statCardClassNames.count}>{count}</span>
      <span className={statCardClassNames.label}>{label}</span>
    </SurfaceCardLink>
  );
}

export { statCardClassNames } from "./stat-card.styles";
export type { StatCardProps } from "./stat-card.types";