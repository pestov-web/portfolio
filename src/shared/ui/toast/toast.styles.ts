import type { ToastVariant } from "./toast.types";

export const toastClassNames = {
  viewport: "pointer-events-none fixed right-4 top-4 z-50 flex w-[min(24rem,calc(100vw-2rem))] flex-col gap-3",
  item: "pointer-events-auto rounded-xl border bg-surface/95 px-4 py-3 shadow-lg backdrop-blur-sm",
  header: "flex items-start justify-between gap-3",
  body: "flex flex-col gap-1",
  title: "text-sm font-medium",
  description: "text-sm text-muted leading-relaxed",
  closeButton: "text-faint transition-colors hover:text-fg",
} as const;

export function getToastVariantClassName(variant: ToastVariant) {
  switch (variant) {
    case "success":
      return "border-emerald-500/30";
    case "error":
      return "border-red-500/30";
    default:
      return "border-border";
  }
}