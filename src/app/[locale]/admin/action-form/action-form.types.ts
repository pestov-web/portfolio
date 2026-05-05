import type { ReactNode } from "react";
import type { AdminActionState } from "../action-state";

export type AdminAction<FormResult = AdminActionState> = (
  state: AdminActionState | void,
  formData: FormData
) => Promise<FormResult | void>;

export type ActionFormProps = {
  action: AdminAction;
  className?: string;
  children: ReactNode;
};