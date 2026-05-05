type SearchParamValue = string | string[] | undefined;

export type PaginationMeta = {
  currentPage: number;
  pageSize: number;
  skip: number;
  totalItems: number;
  totalPages: number;
};

export type PaginationLinkItem = {
  page: number;
  href: string;
  isCurrent: boolean;
};

export function parsePageParam(value: SearchParamValue) {
  const rawValue = Array.isArray(value) ? value[0] : value;
  const parsed = Number(rawValue);

  if (!Number.isInteger(parsed) || parsed < 1) {
    return 1;
  }

  return parsed;
}

export function getPaginationMeta(totalItems: number, pageSize: number, requestedPage: number): PaginationMeta {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const currentPage = Math.min(requestedPage, totalPages);

  return {
    currentPage,
    pageSize,
    skip: (currentPage - 1) * pageSize,
    totalItems,
    totalPages,
  };
}

export function buildPaginationRange(currentPage: number, totalPages: number, maxVisible = 5) {
  if (totalPages <= maxVisible) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const half = Math.floor(maxVisible / 2);
  const start = Math.max(1, Math.min(currentPage - half, totalPages - maxVisible + 1));
  const end = Math.min(totalPages, start + maxVisible - 1);

  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
}

export function buildPageHref(
  pathname: string,
  page: number,
  searchParams: Record<string, SearchParamValue>
) {
  const nextSearchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(searchParams)) {
    if (key === "page" || value === undefined) {
      continue;
    }

    if (Array.isArray(value)) {
      for (const entry of value) {
        nextSearchParams.append(key, entry);
      }
      continue;
    }

    nextSearchParams.set(key, value);
  }

  if (page > 1) {
    nextSearchParams.set("page", String(page));
  }

  const query = nextSearchParams.toString();
  return query ? `${pathname}?${query}` : pathname;
}

export function buildPaginationLinks(
  pathname: string,
  currentPage: number,
  totalPages: number,
  searchParams: Record<string, SearchParamValue>
): PaginationLinkItem[] {
  return buildPaginationRange(currentPage, totalPages).map((page) => ({
    page,
    href: buildPageHref(pathname, page, searchParams),
    isCurrent: page === currentPage,
  }));
}