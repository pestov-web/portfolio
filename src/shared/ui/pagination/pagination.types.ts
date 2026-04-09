export type PaginationLinkItem = {
  page: number;
  href: string;
  isCurrent: boolean;
};

export type PaginationProps = {
  summary: string;
  previousLabel: string;
  nextLabel: string;
  previousHref?: string;
  nextHref?: string;
  links: PaginationLinkItem[];
};