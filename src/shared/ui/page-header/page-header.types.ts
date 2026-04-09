import type { ReactNode } from "react";

export type PageHeaderSize = "md" | "lg";

export type PageHeaderProps = {
  title: ReactNode;
  description?: ReactNode;
  eyebrow?: ReactNode;
  actions?: ReactNode;
  size?: PageHeaderSize;
  className?: string;
};