export const contactPageClassNames = {
  root: "relative overflow-hidden",
  backdrop: "content-backdrop pointer-events-none absolute inset-x-0 top-0 -z-10 h-[34rem]",
  container: "page-container page-x",
  section: "grid gap-10 py-12 md:grid-cols-2 md:gap-16 md:py-16",
  header: "md:pt-2",
  formPanel: "border-t border-border pt-7",
} as const;
