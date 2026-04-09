import { SurfaceCard } from "@/shared/ui/surface-card";
import { errorStateClassNames } from "./error-state.styles";
import type { ErrorStateProps } from "./error-state.types";

export function ErrorState({ code, title, description, actions, details }: ErrorStateProps) {
  return (
    <div className={errorStateClassNames.wrapper}>
      <SurfaceCard padding="lg" className={errorStateClassNames.card}>
        <div className={errorStateClassNames.content}>
          <p className={errorStateClassNames.code}>{code}</p>
          <h1 className={errorStateClassNames.title}>{title}</h1>
          <p className={errorStateClassNames.description}>{description}</p>
          {actions ? <div className={errorStateClassNames.actions}>{actions}</div> : null}
          {details ? <pre className={errorStateClassNames.details}>{details}</pre> : null}
        </div>
      </SurfaceCard>
    </div>
  );
}

export { errorStateClassNames } from "./error-state.styles";
export type { ErrorStateProps } from "./error-state.types";