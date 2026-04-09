export const projectCardClassNames = {
  root: "glass flex flex-col overflow-hidden group",
  cover: "relative h-44 overflow-hidden",
  coverImage: "object-cover transition-transform duration-500 group-hover:scale-105",
  body: "flex flex-col gap-3 p-5 flex-1",
  title: "text-base font-semibold leading-snug",
  titleLink: "no-underline hover:text-accent transition-colors",
  description: "text-sm text-muted line-clamp-3 leading-relaxed flex-1",
  tags: "flex flex-wrap gap-1.5",
  tag: "px-2 py-0.5 text-xs rounded-full bg-subtle text-faint font-mono",
  actions: "mt-auto flex items-center gap-3 pt-1",
  mainAction: "text-xs font-medium text-accent hover:text-accent-vivid no-underline transition-colors",
  secondaryAction: "flex items-center gap-1 text-xs text-faint hover:text-fg no-underline transition-colors",
} as const;