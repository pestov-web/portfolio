export const headerClassNames = {
  root: "sticky top-0 z-40 border-b border-border bg-bg/90 backdrop-blur-sm",
  container: "page-container page-x",
  row: "flex h-14 items-center justify-between gap-4",
  brand: "font-mono text-sm font-medium text-fg no-underline rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-vivid/60 focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
  brandAccent: "text-accent",
  desktopNav: "hidden md:flex items-center gap-1",
  desktopExternalLink: "flex items-center gap-1 px-3 py-1.5 text-sm text-muted hover:text-fg hover:bg-subtle rounded-md no-underline transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-vivid/60 focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
  controls: "flex items-center gap-1",
  localeSwitch: "px-2 py-1 text-xs font-mono text-faint hover:text-fg hover:bg-subtle rounded-md no-underline transition-colors uppercase focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-vivid/60 focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
  authLink: "px-3 py-1.5 text-xs font-medium text-accent hover:bg-subtle rounded-md no-underline transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-vivid/60 focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
  authButton: "px-3 py-1.5 text-xs text-muted hover:text-fg hover:bg-subtle rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-vivid/60 focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
  desktopAuth: "hidden md:flex items-center gap-1",
  mobileMenuButton: "md:hidden size-8 flex items-center justify-center text-muted hover:text-fg hover:bg-subtle rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-vivid/60 focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
  mobileMenu: "md:hidden border-t border-border bg-bg",
  mobileNav: "page-container page-x py-3 flex flex-col gap-1",
  mobileExternalLink: "flex items-center gap-1.5 px-3 py-2 text-sm text-muted hover:text-fg hover:bg-subtle rounded-md no-underline transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-vivid/60 focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
  mobileAuth: "pt-2 mt-1 border-t border-border flex flex-col gap-1",
  mobileAuthButton: "text-left px-3 py-2 text-sm text-muted hover:text-fg hover:bg-subtle rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-vivid/60 focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
} as const;

export function getHeaderNavLinkClassName(active: boolean) {
  return [
    "px-3 py-1.5 text-sm rounded-md no-underline transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-vivid/60 focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
    active ? "text-fg bg-subtle font-medium" : "text-muted hover:text-fg hover:bg-subtle",
  ].join(" ");
}

export function getHeaderMobileNavLinkClassName(active: boolean) {
  return [
    "px-3 py-2 text-sm rounded-md no-underline transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-vivid/60 focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
    active ? "text-fg bg-subtle font-medium" : "text-muted hover:text-fg hover:bg-subtle",
  ].join(" ");
}