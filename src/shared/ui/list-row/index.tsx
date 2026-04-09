import { cx } from "@/shared/lib/classnames";
import { SurfaceCard } from "@/shared/ui/surface-card";
import { getListRowClassName } from "./list-row.styles";
import type { ListRowProps } from "./list-row.types";

export function ListRow({
  layout,
  padding,
  className,
  children,
  ...props
}: ListRowProps) {
  return (
    <SurfaceCard className={cx(getListRowClassName({ layout, padding }), className)} {...props}>
      {children}
    </SurfaceCard>
  );
}

export { getListRowClassName } from "./list-row.styles";
export type { ListRowLayout, ListRowPadding, ListRowProps, ListRowStyleOptions } from "./list-row.types";