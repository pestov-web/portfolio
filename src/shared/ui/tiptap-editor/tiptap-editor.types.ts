import type { ReactNode } from "react";

export type TiptapEditorProps = {
  name: string;
  defaultValue?: string;
};

export type ToolButtonProps = {
  onClick: () => void;
  active?: boolean;
  title: string;
  children: ReactNode;
};

export type EditorContentState = {
  document: Record<string, unknown> | undefined;
  serialized: string;
};