import { cx } from "@/shared/lib/classnames";

export function getDetailHeaderClassName(className?: string) {
  return cx("mb-10 md:mb-12", className);
}

export const detailHeaderClassNames = {
  tags: "mb-5 flex flex-wrap gap-2",
  title: "mb-5 break-words text-balance text-[clamp(2.8rem,6vw,5.4rem)] font-semibold leading-[0.94] tracking-[-0.065em]",
  description: "mb-7 max-w-3xl text-pretty text-base leading-7 text-muted md:text-lg md:leading-8",
  meta: "mb-5 font-mono text-[0.68rem] uppercase tracking-[0.12em] text-faint",
  actions: "flex flex-wrap gap-3",
} as const;
