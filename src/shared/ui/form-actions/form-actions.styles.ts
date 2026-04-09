import { cx } from "@/shared/lib/classnames";

export function getFormActionsClassName(className?: string) {
  return cx("flex gap-3 pt-2", className);
}