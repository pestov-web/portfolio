import { cx } from "@/shared/lib/classnames";

export function getCheckboxFieldInputClassName(className?: string) {
  return cx("accent-accent-vivid", className);
}

export function getCheckboxFieldLabelClassName(className?: string) {
  return cx("flex items-center gap-2 text-sm cursor-pointer", className);
}