import type { ReactNode } from "react";

export type DetailHeaderProps = {
  title: ReactNode;
  description?: ReactNode;
  meta?: ReactNode;
  tags?: ReactNode;
  actions?: ReactNode;
  className?: string;
};