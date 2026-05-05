"use client";

import { useActionState } from "react";
import { initialAdminActionState } from "../action-state";
import { actionFormClassNames } from "./action-form.styles";
import type { ActionFormProps } from "./action-form.types";

export function ActionForm({ action, className, children }: ActionFormProps) {
  const [state, formAction] = useActionState(action, initialAdminActionState);
  const error = state?.error ?? null;

  return (
    <form action={formAction} className={className}>
      {children}
      {error ? (
        <p className={actionFormClassNames.error} aria-live="polite">
          {error}
        </p>
      ) : null}
    </form>
  );
}

export { actionFormClassNames } from "./action-form.styles";
export type { ActionFormProps, AdminAction } from "./action-form.types";