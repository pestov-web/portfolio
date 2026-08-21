export const blogPageClassNames = {
  root: "relative overflow-hidden",
  backdrop: "content-backdrop pointer-events-none absolute inset-x-0 top-0 -z-10 h-[34rem]",
  container: "page-container page-x",
  section: "py-12 md:py-16",
  list: "border-y border-border",
  empty: "border-y border-dashed border-border py-8 text-sm text-faint",
} as const;
