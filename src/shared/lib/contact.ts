import { Resend } from 'resend';

export type ContactInput = {
    name: string;
    email: string;
    message: string;
};

export type ContactValidationCode =
    | 'name_required'
    | 'name_too_long'
    | 'email_invalid'
    | 'email_too_long'
    | 'message_required'
    | 'message_too_long';
export type ContactDeliveryErrorCode = 'not_configured' | 'send_failed';

export const CONTACT_LIMITS = {
    name: 100,
    email: 320,
    message: 5_000,
} as const;

type HeaderSource = {
    get(name: string): string | null;
};

export function isValidEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validateContactInput(input: ContactInput): ContactValidationCode | null {
    const name = input.name.trim();
    const email = input.email.trim();
    const message = input.message.trim();

    if (name.length < 1) {
        return 'name_required';
    }

    if (name.length > CONTACT_LIMITS.name) {
        return 'name_too_long';
    }

    if (email.length > CONTACT_LIMITS.email) {
        return 'email_too_long';
    }

    if (!isValidEmail(email)) {
        return 'email_invalid';
    }

    if (message.length < 1) {
        return 'message_required';
    }

    if (message.length > CONTACT_LIMITS.message) {
        return 'message_too_long';
    }

    return null;
}

export function getClientIp(headers: HeaderSource) {
    // x-forwarded-for can be spoofed by clients — only trust it when running
    // behind a trusted reverse proxy (configured via TRUSTED_PROXY_IPS env var).
    // In all other environments fall back to x-real-ip which Nginx sets from
    // the actual TCP connection address.
    const trustedProxies = (process.env.TRUSTED_PROXY_IPS ?? '')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

    const realIp = headers.get('x-real-ip');
    const isProxied = trustedProxies.length > 0 && realIp && trustedProxies.includes(realIp);

    if (isProxied) {
        const forwardedFor = headers.get('x-forwarded-for');
        if (forwardedFor) {
            return forwardedFor.split(',')[0]?.trim() ?? 'unknown';
        }
    }

    return realIp ?? 'unknown';
}

export async function deliverContactMessage(
    input: ContactInput,
): Promise<{ ok: true } | { ok: false; code: ContactDeliveryErrorCode }> {
    const to = process.env.CONTACT_EMAIL;

    if (!to || !process.env.RESEND_API_KEY) {
        if (process.env.NODE_ENV !== 'production') {
            console.log('[contact]', input);
            return { ok: true };
        }

        return { ok: false, code: 'not_configured' };
    }

    try {
        const resend = new Resend(process.env.RESEND_API_KEY);
        await resend.emails.send({
            from: 'portfolio <onboarding@resend.dev>',
            to,
            subject: `[Portfolio] Сообщение от ${input.name.trim()}`,
            replyTo: input.email.trim(),
            text: `От: ${input.name.trim()} <${input.email.trim()}>\n\n${input.message.trim()}`,
        });

        return { ok: true };
    } catch (error) {
        console.error('[contact] Resend error:', error);
        return { ok: false, code: 'send_failed' };
    }
}
