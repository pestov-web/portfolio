import { getCheckboxFieldInputClassName, getCheckboxFieldLabelClassName } from "./checkbox-field.styles";
import type { CheckboxFieldProps } from "./checkbox-field.types";

export function CheckboxField({ label, className, ...props }: CheckboxFieldProps) {
  return (
    <label className={getCheckboxFieldLabelClassName()}>
      <input type="checkbox" className={getCheckboxFieldInputClassName(className)} {...props} />
      {label}
    </label>
  );
}

export { getCheckboxFieldInputClassName, getCheckboxFieldLabelClassName } from "./checkbox-field.styles";
export type { CheckboxFieldProps } from "./checkbox-field.types";