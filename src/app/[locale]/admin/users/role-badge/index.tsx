import { Badge } from "@/shared/ui";
import { roleBadgeClassName, roleBadgeVariantByRole } from "./role-badge.styles";
import type { RoleBadgeProps } from "./role-badge.types";

export function RoleBadge({ role, label }: RoleBadgeProps) {
  return (
    <Badge variant={roleBadgeVariantByRole[role]} className={roleBadgeClassName}>
      {label}
    </Badge>
  );
}

export { roleBadgeClassName, roleBadgeVariantByRole } from "./role-badge.styles";
export type { RoleBadgeProps, UserRole } from "./role-badge.types";