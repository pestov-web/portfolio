import { getFormActionsClassName } from "./form-actions.styles";
import type { FormActionsProps } from "./form-actions.types";

export function FormActions({ className, ...props }: FormActionsProps) {
  return <div className={getFormActionsClassName(className)} {...props} />;
}

export { getFormActionsClassName } from "./form-actions.styles";
export type { FormActionsProps } from "./form-actions.types";