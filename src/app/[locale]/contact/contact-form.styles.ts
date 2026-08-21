export const contactFormClassNames = {
  root: "flex flex-col gap-6",
  field: "gap-2",
  label: "font-mono text-[0.66rem] uppercase tracking-[0.14em] text-muted",
  input: "h-12 w-full rounded-xl bg-surface/70 px-4 text-base",
  textarea: "min-h-48 w-full rounded-xl bg-surface/70 p-4 text-base leading-7",
  error: "text-sm text-red-500",
  actions: "pt-0",
  submit: "h-11 self-start rounded-full px-6",
  success: "border-y border-border py-8 text-sm font-medium text-accent-strong",
} as const;
