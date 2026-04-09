"use client";

import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { cx } from "@/shared/lib/classnames";
import { getToastVariantClassName, toastClassNames } from "./toast.styles";
import type { ToastContextValue, ToastInput, ToastItem } from "./toast.types";

const ToastContext = createContext<ToastContextValue | null>(null);

type ToastProviderProps = {
  children: ReactNode;
};

const DEFAULT_DURATION = 4000;

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timeoutsRef = useRef(new Map<string, ReturnType<typeof setTimeout>>());

  useEffect(() => {
    const timeouts = timeoutsRef.current;

    return () => {
      for (const timeout of timeouts.values()) {
        clearTimeout(timeout);
      }
    };
  }, []);

  const contextValue = useMemo<ToastContextValue>(() => ({
    showToast(toast: ToastInput) {
      const id = crypto.randomUUID();
      const duration = toast.duration ?? DEFAULT_DURATION;
      const item: ToastItem = {
        id,
        variant: toast.variant ?? "info",
        ...toast,
      };

      setToasts((current) => [...current, item]);

      const timeout = setTimeout(() => {
        setToasts((current) => current.filter((entry) => entry.id !== id));
        timeoutsRef.current.delete(id);
      }, duration);

      timeoutsRef.current.set(id, timeout);
    },
    dismissToast(id: string) {
      const timeout = timeoutsRef.current.get(id);
      if (timeout) {
        clearTimeout(timeout);
        timeoutsRef.current.delete(id);
      }

      setToasts((current) => current.filter((entry) => entry.id !== id));
    },
  }), []);

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <div className={toastClassNames.viewport} aria-live="polite" aria-atomic="true">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={cx(toastClassNames.item, getToastVariantClassName(toast.variant ?? "info"))}
            role="status"
          >
            <div className={toastClassNames.header}>
              <div className={toastClassNames.body}>
                {toast.title ? <p className={toastClassNames.title}>{toast.title}</p> : null}
                <p className={toastClassNames.description}>{toast.description}</p>
              </div>
              <button
                type="button"
                className={toastClassNames.closeButton}
                onClick={() => contextValue.dismissToast(toast.id)}
                aria-label="Close notification"
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }

  return context;
}

export { getToastVariantClassName, toastClassNames } from "./toast.styles";
export type { ToastContextValue, ToastInput, ToastItem, ToastVariant } from "./toast.types";