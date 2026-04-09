export type ToastVariant = "info" | "success" | "error";

export type ToastInput = {
  title?: string;
  description: string;
  variant?: ToastVariant;
  duration?: number;
};

export type ToastItem = ToastInput & {
  id: string;
};

export type ToastContextValue = {
  showToast: (toast: ToastInput) => void;
  dismissToast: (id: string) => void;
};