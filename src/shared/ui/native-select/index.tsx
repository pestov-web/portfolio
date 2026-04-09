import { getNativeSelectClassName } from "./native-select.styles";
import type { NativeSelectProps } from "./native-select.types";

export function NativeSelect({ className, children, ...props }: NativeSelectProps) {
  return (
    <select className={getNativeSelectClassName(className)} {...props}>
      {children}
    </select>
  );
}

export { getNativeSelectClassName } from "./native-select.styles";
export type { NativeSelectProps } from "./native-select.types";