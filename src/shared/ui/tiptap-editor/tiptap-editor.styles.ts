export const tiptapEditorClassNames = {
  root: "flex flex-col border border-border rounded-md",
  toolbar: "sticky top-14 z-30 flex flex-wrap gap-0.5 border-b border-border bg-subtle/95 px-2 py-1.5 backdrop-blur-sm",
  separator: "w-px bg-border mx-1",
  editor: "bg-surface min-h-48",
  status: "border-t border-border px-4 py-2 text-sm text-muted",
  editorContent: "prose min-h-48 px-4 py-3 focus:outline-none",
} as const;

export function getToolButtonClassName(active?: boolean) {
  return [
    "px-2 py-1 text-sm rounded transition-colors",
    active ? "bg-accent-vivid text-white" : "text-muted hover:text-fg hover:bg-subtle",
  ].join(" ");
}