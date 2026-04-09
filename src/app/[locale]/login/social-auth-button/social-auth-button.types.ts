import type { ReactNode } from "react";

export type SocialAuthButtonProps = {
  label: string;
  icon: ReactNode;
  disabled?: boolean;
  onClick: () => void;
};