'use client';

import { useActionState } from 'react';
import { useTranslations } from 'next-intl';
import { Button, Field, FormActions, TextArea, TextInput } from '@/shared/ui';
import { initialContactActionState, submitContact } from './actions';
import type { Locale } from '@/shared/config';
import { contactFormClassNames as styles } from './contact-form.styles';

type ContactFormProps = {
    locale: Locale;
};

export function ContactForm({ locale }: ContactFormProps) {
    const tf = useTranslations('contact.form');
    const submitContactWithLocale = submitContact.bind(null, locale);
    const [state, formAction, pending] = useActionState(submitContactWithLocale, initialContactActionState);

    if (state.success) {
        return (
            <div className={styles.success}>
                <p>{tf('success')}</p>
            </div>
        );
    }

    return (
        <form action={formAction} className={styles.root}>
            <Field label={tf('name')} htmlFor='name' className={styles.field} labelClassName={styles.label}>
                <TextInput
                    id='name'
                    name='name'
                    type='text'
                    required
                    autoComplete='name'
                    maxLength={100}
                    className={styles.input}
                />
            </Field>

            <Field label={tf('email')} htmlFor='email' className={styles.field} labelClassName={styles.label}>
                <TextInput
                    id='email'
                    name='email'
                    type='email'
                    required
                    autoComplete='email'
                    spellCheck={false}
                    maxLength={320}
                    className={styles.input}
                />
            </Field>

            <Field label={tf('message')} htmlFor='message' className={styles.field} labelClassName={styles.label}>
                <TextArea id='message' name='message' rows={7} required maxLength={5000} className={styles.textarea} />
            </Field>

            {state.error ? (
                <p className={styles.error} aria-live='polite'>
                    {state.error}
                </p>
            ) : null}

            <FormActions className={styles.actions}>
                <Button type='submit' disabled={pending} variant='primary' className={styles.submit}>
                    {pending ? '…' : tf('submit')}
                </Button>
            </FormActions>
        </form>
    );
}
