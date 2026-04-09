import { cx } from "@/shared/lib/classnames";

export function getFieldClassName(className?: string) {
  return cx("flex flex-col gap-1.5", className);
}

export function getFieldLabelClassName(className?: string) {
  return cx("text-sm font-medium", className);
}