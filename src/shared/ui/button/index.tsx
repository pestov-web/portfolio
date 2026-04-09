import Link from "next/link";
import { cx } from "@/shared/lib/classnames";
import { getButtonClassName } from "./button.styles";
import type { ButtonLinkProps, ButtonProps } from "./button.types";

export function Button({
  variant,
  size,
  fullWidth,
  className,
  type = "button",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cx(getButtonClassName({ variant, size, fullWidth }), className)}
      {...props}
    >
      {children}
    </button>
  );
}

export function ButtonLink({
  variant,
  size,
  fullWidth,
  className,
  children,
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      className={cx(getButtonClassName({ variant, size, fullWidth }), "no-underline", className)}
      {...props}
    >
      {children}
    </Link>
  );
}

export { getButtonClassName } from "./button.styles";
export type {
  ButtonLinkProps,
  ButtonProps,
  ButtonSize,
  ButtonStyleOptions,
  ButtonVariant,
} from "./button.types";