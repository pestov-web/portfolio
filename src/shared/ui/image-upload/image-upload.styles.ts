export const imageUploadClassNames = {
  root: "flex flex-col gap-2",
  label: "text-sm font-medium",
  previewWrapper: "relative w-full max-w-sm",
  previewFrame: "relative aspect-video w-full rounded-md overflow-hidden border border-border bg-surface",
  loadingOverlay: "absolute inset-0 bg-bg/70 flex items-center justify-center text-xs text-muted",
  removeButton: "mt-1.5 text-xs text-muted hover:text-red-500 transition-colors",
  emptyLabel: "flex items-center justify-center w-full max-w-sm aspect-video rounded-md border-2 border-dashed border-border bg-surface hover:border-accent-vivid hover:bg-subtle transition-colors cursor-pointer",
  emptyContent: "flex flex-col items-center gap-1 text-muted text-sm select-none",
  hint: "text-xs text-faint",
  error: "text-xs text-red-500",
} as const;