import type { BadgeVariant } from "@/shared/ui/badge";
import type { UserRole } from "./role-badge.types";

export const roleBadgeVariantByRole: Record<UserRole, BadgeVariant> = {
  USER: "muted",
  FRIEND: "accent",
  ADMIN: "danger",
};

export const roleBadgeClassName = "rounded text-xs";