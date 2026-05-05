export const MAX_CONTENT_ITEMS_PER_PAGE = 9;

function readPageSize(value: string | undefined, fallback: number) {
  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed < 1) {
    return fallback;
  }

  return Math.min(parsed, MAX_CONTENT_ITEMS_PER_PAGE);
}

export const BLOG_POSTS_PER_PAGE = readPageSize(
  process.env.BLOG_POSTS_PER_PAGE,
  MAX_CONTENT_ITEMS_PER_PAGE
);

export const PROJECTS_PER_PAGE = readPageSize(
  process.env.PROJECTS_PER_PAGE,
  MAX_CONTENT_ITEMS_PER_PAGE
);