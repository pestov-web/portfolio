import { cx } from "@/shared/lib/classnames";
import { getTextInputClassName } from "./text-input.styles";
import type { TextInputProps } from "./text-input.types";

export function TextInput({ className, ...props }: TextInputProps) {
  return <input className={cx(getTextInputClassName(), className)} {...props} />;
}

export { getTextInputClassName } from "./text-input.styles";
export type { TextInputProps } from "./text-input.types";