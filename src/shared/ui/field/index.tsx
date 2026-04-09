import { getFieldClassName, getFieldLabelClassName } from "./field.styles";
import type { FieldProps } from "./field.types";

export function Field({
  label,
  htmlFor,
  children,
  className,
  labelClassName,
  ...props
}: FieldProps) {
  return (
    <div className={getFieldClassName(className)} {...props}>
      {label ? (
        <label htmlFor={htmlFor} className={getFieldLabelClassName(labelClassName)}>
          {label}
        </label>
      ) : null}
      {children}
    </div>
  );
}

export { getFieldClassName, getFieldLabelClassName } from "./field.styles";
export type { FieldProps } from "./field.types";