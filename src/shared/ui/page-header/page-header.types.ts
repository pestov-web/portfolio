import type { ReactNode } from "react";

export type PageHeaderSize = "md" | "lg" | "display";

export type PageHeaderProps = {
  title: ReactNode;
  description?: ReactNode;
  eyebrow?: ReactNode;
  actions?: ReactNode;
  size?: PageHeaderSize;
  className?: string;
};
