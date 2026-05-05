'use server';

import { headers } from 'next/headers';
import { getTranslations } from 'next-intl/server';
import type { Locale } from '@/shared/config';
import { deliverContactMessage, getClientIp, validateContactInput } from '@/shared/lib/contact';
import { contactRateLimiter } from '@/shared/lib/rate-limit';

export type ContactActionState = {
    error: string | null;
    success: boolean;
};

export const initialContactActionState: ContactActionState = {
    error: null,
    success: false,
};

export async function submitContact(
    locale: Locale,
    _state: ContactActionState | void,
    formData: FormData,
): Promise<ContactActionState> {
    const t = await getTranslations({ locale, namespace: 'contact.form' });
    const headerStore = await headers();
    const rateLimit = await contactRateLimiter(getClientIp(headerStore));

    if (!rateLimit.success) {
        return { error: t('rateLimited'), success: false };
    }

    const input = {
        name: String(formData.get('name') ?? '').trim(),
        email: String(formData.get('email') ?? '').trim(),
        message: String(formData.get('message') ?? '').trim(),
    };

    const validationCode = validateContactInput(input);
    if (validationCode === 'name_required') {
        return { error: t('nameRequired'), success: false };
    }
    if (validationCode === 'name_too_long') {
        return { error: t('nameTooLong'), success: false };
    }
    if (validationCode === 'email_invalid') {
        return { error: t('emailInvalid'), success: false };
    }
    if (validationCode === 'email_too_long') {
        return { error: t('emailTooLong'), success: false };
    }
    if (validationCode === 'message_required') {
        return { error: t('messageRequired'), success: false };
    }
    if (validationCode === 'message_too_long') {
        return { error: t('messageTooLong'), success: false };
    }

    const delivery = await deliverContactMessage(input);
    if (!delivery.ok) {
        if (delivery.code === 'not_configured') {
            return { error: t('notConfigured'), success: false };
        }

        return { error: t('error'), success: false };
    }

    return { error: null, success: true };
}
