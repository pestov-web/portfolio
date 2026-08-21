export const projectDetailClassNames = {
  root: "relative overflow-hidden",
  backdrop: "content-backdrop pointer-events-none absolute inset-x-0 top-0 -z-10 h-[34rem]",
  container: "page-container page-x",
  article: "py-12 md:py-16",
  breadcrumb: "mb-9 flex min-w-0 items-center font-mono text-[0.68rem] uppercase tracking-[0.14em] text-faint",
  breadcrumbLink: "shrink-0 rounded-sm py-1 no-underline transition-colors hover:text-accent-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-vivid/60",
  breadcrumbSlash: "mx-3 text-border",
  breadcrumbCurrent: "truncate text-muted",
  tag: "rounded-full bg-subtle px-3 py-1 font-mono text-[0.62rem] uppercase tracking-[0.08em] text-faint",
  action: "rounded-full px-5 py-2.5",
  content: "prose mx-auto max-w-3xl",
} as const;
