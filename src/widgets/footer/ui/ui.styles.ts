export const footerClassNames = {
  root: "mt-auto border-t border-border/70",
  container: "page-container page-x py-8",
  row: "flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-faint",
  copyright: "font-mono",
  accent: "text-accent",
  links: "flex items-center gap-4",
  rss: "no-underline text-faint hover:text-fg transition-colors font-mono rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-vivid/60 focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
  github: "text-faint hover:text-fg transition-colors rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-vivid/60 focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
} as const;
