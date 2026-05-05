'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { Button } from '@/shared/ui/button';
import type { ButtonProps } from '@/shared/ui/button';

type ConfirmSubmitButtonProps = Omit<ButtonProps, 'onClick'> & {
    title: string;
    description: string;
    cancelLabel: string;
    confirmLabel: string;
};

export function ConfirmSubmitButton({
    title,
    description,
    cancelLabel,
    confirmLabel,
    children,
    ...props
}: ConfirmSubmitButtonProps) {
    const [isOpen, setIsOpen] = useState(false);
    const titleId = useId();
    const descriptionId = useId();
    const formRef = useRef<HTMLFormElement | null>(null);
    const triggerRef = useRef<HTMLButtonElement | null>(null);
    const cancelRef = useRef<HTMLButtonElement | null>(null);

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        cancelRef.current?.focus();

        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === 'Escape') {
                event.preventDefault();
                setIsOpen(false);
            }
        }

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen]);

    useEffect(() => {
        if (isOpen) {
            return;
        }

        triggerRef.current?.focus();
    }, [isOpen]);

    function openDialog(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault();
        formRef.current = event.currentTarget.form;
        setIsOpen(true);
    }

    function closeDialog() {
        setIsOpen(false);
    }

    function confirmSubmit() {
        const form = formRef.current;
        setIsOpen(false);
        form?.requestSubmit();
    }

    return (
        <>
            <Button {...props} type='button' onClick={openDialog} ref={triggerRef}>
                {children}
            </Button>

            {isOpen ? (
                <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4'>
                    <div
                        role='dialog'
                        aria-modal='true'
                        aria-labelledby={titleId}
                        aria-describedby={descriptionId}
                        className='glass w-full max-w-md p-6 shadow-2xl'
                    >
                        <div className='flex flex-col gap-3'>
                            <h2 id={titleId} className='text-lg font-semibold text-fg text-balance'>
                                {title}
                            </h2>
                            <p id={descriptionId} className='text-sm leading-relaxed text-muted'>
                                {description}
                            </p>
                        </div>

                        <div className='mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end'>
                            <Button ref={cancelRef} type='button' variant='secondary' onClick={closeDialog}>
                                {cancelLabel}
                            </Button>
                            <Button type='button' variant='danger' onClick={confirmSubmit}>
                                {confirmLabel}
                            </Button>
                        </div>
                    </div>
                </div>
            ) : null}
        </>
    );
}
