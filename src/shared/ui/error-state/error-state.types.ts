import type { ReactNode } from "react";

export type ErrorStateProps = {
  code: string;
  title: string;
  description: string;
  actions?: ReactNode;
  details?: string | null;
};