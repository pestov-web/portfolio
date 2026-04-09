import { cx } from "@/shared/lib/classnames";
import { getTextAreaClassName } from "./text-area.styles";
import type { TextAreaProps } from "./text-area.types";

export function TextArea({ className, ...props }: TextAreaProps) {
  return <textarea className={cx(getTextAreaClassName(), className)} {...props} />;
}

export { getTextAreaClassName } from "./text-area.styles";
export type { TextAreaProps } from "./text-area.types";