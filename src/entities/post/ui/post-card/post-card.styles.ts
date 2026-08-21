export const postCardClassNames = {
  root: "group grid min-w-0 gap-5 border-b border-border py-8 last:border-b-0 md:grid-cols-[9rem_minmax(0,1fr)] md:gap-8",
  body: "min-w-0",
  meta: "flex flex-wrap items-start gap-x-4 gap-y-2 md:flex-col md:gap-3",
  tags: "flex flex-wrap gap-x-3 gap-y-1",
  tagLink: "rounded-sm font-mono text-[0.62rem] uppercase tracking-[0.1em] text-faint no-underline transition-colors hover:text-accent-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-vivid/60",
  date: "shrink-0 font-mono text-[0.68rem] tabular-nums text-faint",
  title: "max-w-4xl text-balance text-2xl font-medium leading-tight tracking-[-0.04em] md:text-3xl",
  titleLink: "rounded-sm no-underline transition-colors hover:text-accent-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-vivid/60",
  lock: "mr-2 inline-flex items-center text-faint",
  excerpt: "mt-3 max-w-3xl text-pretty text-sm leading-7 text-muted md:text-base",
  action: "mt-5 inline-flex items-center gap-2 rounded-sm text-sm font-medium text-muted no-underline transition-colors hover:text-accent-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-vivid/60",
} as const;
