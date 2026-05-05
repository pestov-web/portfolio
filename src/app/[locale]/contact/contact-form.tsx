'use client';

import { useActionState } from 'react';
import { useTranslations } from 'next-intl';
import { Button, Field, FormActions, SurfaceCard, TextArea, TextInput } from '@/shared/ui';
import { initialContactActionState, submitContact } from './actions';
import type { Locale } from '@/shared/config';

type ContactFormProps = {
    locale: Locale;
};

export function ContactForm({ locale }: ContactFormProps) {
    const tf = useTranslations('contact.form');
    const submitContactWithLocale = submitContact.bind(null, locale);
    const [state, formAction, pending] = useActionState(submitContactWithLocale, initialContactActionState);

    if (state.success) {
        return (
            <SurfaceCard padding='lg' className='text-center'>
                <p className='text-accent font-medium'>{tf('success')}</p>
            </SurfaceCard>
        );
    }

    return (
        <form action={formAction} className='flex flex-col gap-5'>
            <Field label={tf('name')} htmlFor='name'>
                <TextInput
                    id='name'
                    name='name'
                    type='text'
                    required
                    autoComplete='name'
                    maxLength={100}
                    className='w-full'
                />
            </Field>

            <Field label={tf('email')} htmlFor='email'>
                <TextInput
                    id='email'
                    name='email'
                    type='email'
                    required
                    autoComplete='email'
                    spellCheck={false}
                    maxLength={320}
                    className='w-full'
                />
            </Field>

            <Field label={tf('message')} htmlFor='message'>
                <TextArea id='message' name='message' rows={6} required maxLength={5000} className='w-full' />
            </Field>

            {state.error ? (
                <p className='text-sm text-red-500' aria-live='polite'>
                    {state.error}
                </p>
            ) : null}

            <FormActions className='pt-0'>
                <Button type='submit' disabled={pending} variant='primary' className='h-10 px-5 self-start'>
                    {pending ? '…' : tf('submit')}
                </Button>
            </FormActions>
        </form>
    );
}
