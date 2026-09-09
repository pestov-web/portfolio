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
    const dialogRef = useRef<HTMLDialogElement | null>(null);

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        const dialog = dialogRef.current;
        const trigger = triggerRef.current;
        const previousOverflow = document.body.style.overflow;
        dialog?.showModal();
        cancelRef.current?.focus();
        document.body.style.overflow = 'hidden';
        return () => {
            dialog?.close();
            document.body.style.overflow = previousOverflow;
            trigger?.focus({ preventScroll: true });
        };
    }, [isOpen]);

    function openDialog(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault();
        formRef.current = event.currentTarget.form;
        setIsOpen(true);
    }

    function closeDialog() {
        setIsOpen(false);
    }

    function trapFocus(event: React.KeyboardEvent<HTMLDialogElement>) {
        if (event.key !== 'Tab') return;
        const buttons = event.currentTarget.querySelectorAll<HTMLButtonElement>('button:not(:disabled)');
        const first = buttons[0];
        const last = buttons[buttons.length - 1];
        if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first?.focus();
        }
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
                    <dialog
                        ref={dialogRef}
                        onCancel={closeDialog}
                        onKeyDown={trapFocus}
                        aria-modal='true'
                        aria-labelledby={titleId}
                        aria-describedby={descriptionId}
                        className='glass fixed inset-0 m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-md overflow-y-auto overscroll-contain p-6 text-fg shadow-2xl backdrop:bg-black/60'
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
                    </dialog>
            ) : null}
        </>
    );
}
