"use client";

import { socialAuthButtonClassName } from "./social-auth-button.styles";
import type { SocialAuthButtonProps } from "./social-auth-button.types";

export function SocialAuthButton({ label, icon, disabled, onClick }: SocialAuthButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={socialAuthButtonClassName}
    >
      {icon}
      {label}
    </button>
  );
}

export { socialAuthButtonClassName } from "./social-auth-button.styles";
export type { SocialAuthButtonProps } from "./social-auth-button.types";