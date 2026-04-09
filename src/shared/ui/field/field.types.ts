import type { ComponentPropsWithoutRef, ReactNode } from "react";

export type FieldProps = ComponentPropsWithoutRef<"div"> & {
  label?: ReactNode;
  htmlFor?: string;
  children: ReactNode;
  labelClassName?: string;
};