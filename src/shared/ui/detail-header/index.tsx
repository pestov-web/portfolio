import { detailHeaderClassNames, getDetailHeaderClassName } from "./detail-header.styles";
import type { DetailHeaderProps } from "./detail-header.types";

export function DetailHeader({
  title,
  description,
  meta,
  tags,
  actions,
  className,
}: DetailHeaderProps) {
  return (
    <header className={getDetailHeaderClassName(className)}>
      {tags ? <div className={detailHeaderClassNames.tags}>{tags}</div> : null}
      <h1 className={detailHeaderClassNames.title}>{title}</h1>
      {description ? <p className={detailHeaderClassNames.description}>{description}</p> : null}
      {meta ? <div className={detailHeaderClassNames.meta}>{meta}</div> : null}
      {actions ? <div className={detailHeaderClassNames.actions}>{actions}</div> : null}
    </header>
  );
}

export { detailHeaderClassNames, getDetailHeaderClassName } from "./detail-header.styles";
export type { DetailHeaderProps } from "./detail-header.types";