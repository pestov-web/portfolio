'use client';

import { startTransition, useEffect, useRef, useState } from 'react';
import { toSlug } from '@/shared/lib/slug';
import { cx } from '@/shared/lib/classnames';
import { Button, TextInput } from '@/shared/ui';

type AutoSlugFieldProps = {
    sourceFieldName: string;
    generateLabel: string;
    ariaLabel?: string;
    className?: string;
    defaultValue?: string;
    id: string;
    inputClassName?: string;
    maxLength?: number;
    name?: string;
    placeholder?: string;
    required?: boolean;
};

export function AutoSlugField({
    sourceFieldName,
    generateLabel,
    ariaLabel,
    className,
    defaultValue = '',
    id,
    inputClassName,
    maxLength,
    name = 'slug',
    placeholder,
    required,
}: AutoSlugFieldProps) {
    const [value, setValue] = useState(defaultValue);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const lastGeneratedSlugRef = useRef('');

    useEffect(() => {
        const slugInput = inputRef.current;
        const sourceInput = slugInput?.form?.elements.namedItem(sourceFieldName);

        if (!slugInput || !(sourceInput instanceof HTMLInputElement)) {
            return;
        }

        const initialGeneratedSlug = toSlug(sourceInput.value);
        lastGeneratedSlugRef.current = initialGeneratedSlug;

        if (!slugInput.value && initialGeneratedSlug) {
            startTransition(() => setValue(initialGeneratedSlug));
        }

        const handleSourceInput = () => {
            const nextGeneratedSlug = toSlug(sourceInput.value);

            setValue((currentValue) => {
                const shouldSync = currentValue.length === 0 || currentValue === lastGeneratedSlugRef.current;
                lastGeneratedSlugRef.current = nextGeneratedSlug;

                if (!shouldSync) {
                    return currentValue;
                }

                return nextGeneratedSlug;
            });
        };

        sourceInput.addEventListener('input', handleSourceInput);

        return () => {
            sourceInput.removeEventListener('input', handleSourceInput);
        };
    }, [sourceFieldName]);

    function handleGenerateClick() {
        const sourceInput = inputRef.current?.form?.elements.namedItem(sourceFieldName);

        if (!(sourceInput instanceof HTMLInputElement)) {
            return;
        }

        const nextGeneratedSlug = toSlug(sourceInput.value);
        lastGeneratedSlugRef.current = nextGeneratedSlug;
        setValue(nextGeneratedSlug);
    }

    return (
        <div className={cx('flex flex-col gap-2 sm:flex-row', className)}>
            <TextInput
                ref={inputRef}
                id={id}
                name={name}
                type='text'
                value={value}
                required={required}
                maxLength={maxLength}
                placeholder={placeholder}
                aria-label={ariaLabel}
                onChange={(event) => setValue(event.target.value)}
                className={cx('min-w-0 flex-1', inputClassName)}
            />
            <Button type='button' variant='secondary' size='sm' className='shrink-0' onClick={handleGenerateClick}>
                {generateLabel}
            </Button>
        </div>
    );
}