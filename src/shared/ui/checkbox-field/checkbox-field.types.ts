import type { InputHTMLAttributes, ReactNode } from "react";

export type CheckboxFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label: ReactNode;
};