import {
  getPageHeaderDescriptionClassName,
  getPageHeaderRootClassName,
  getPageHeaderTitleClassName,
  pageHeaderClassNames,
} from "./page-header.styles";
import type { PageHeaderProps } from "./page-header.types";

export function PageHeader({
  title,
  description,
  eyebrow,
  actions,
  size = "lg",
  className,
}: PageHeaderProps) {
  return (
    <div className={getPageHeaderRootClassName(size, Boolean(actions), className)}>
      <div className={pageHeaderClassNames.content}>
        {eyebrow ? <p className={pageHeaderClassNames.eyebrow}>{eyebrow}</p> : null}
        <h1 className={getPageHeaderTitleClassName(size)}>{title}</h1>
        {description ? <p className={getPageHeaderDescriptionClassName(size)}>{description}</p> : null}
      </div>
      {actions ? <div className={pageHeaderClassNames.actions}>{actions}</div> : null}
    </div>
  );
}

export {
  getPageHeaderDescriptionClassName,
  getPageHeaderRootClassName,
  getPageHeaderTitleClassName,
  pageHeaderClassNames,
} from "./page-header.styles";
export type { PageHeaderProps, PageHeaderSize } from "./page-header.types";