import { cx } from "@/shared/lib/classnames";
import type { ListRowLayout, ListRowPadding, ListRowStyleOptions } from "./list-row.types";

const layoutClassNames: Record<ListRowLayout, string> = {
  between: "items-center justify-between",
  responsive: "flex-col sm:flex-row sm:items-center",
};

const paddingClassNames: Record<ListRowPadding, string> = {
  compact: "px-4 py-3",
  comfortable: "px-5 py-4",
};

export function getListRowClassName({
  layout = "between",
  padding = "compact",
}: ListRowStyleOptions = {}) {
  return cx("flex gap-4", layoutClassNames[layout], paddingClassNames[padding]);
}