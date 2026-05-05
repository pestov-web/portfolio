import { forwardRef } from 'react';
import { cx } from '@/shared/lib/classnames';
import { getTextInputClassName } from './text-input.styles';
import type { TextInputProps } from './text-input.types';

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(function TextInput({ className, ...props }, ref) {
    return <input ref={ref} className={cx(getTextInputClassName(), className)} {...props} />;
});

export { getTextInputClassName } from './text-input.styles';
export type { TextInputProps } from './text-input.types';
