export type UserRole = "USER" | "FRIEND" | "ADMIN";

export type RoleBadgeProps = {
  role: UserRole;
  label: string;
};