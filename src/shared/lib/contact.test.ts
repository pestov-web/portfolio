import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { sendMailMock, createTransportMock } = vi.hoisted(() => {
    const sendMailMock = vi.fn();
    const createTransportMock = vi.fn(() => ({
        sendMail: sendMailMock,
    }));

    return {
        sendMailMock,
        createTransportMock,
    };
});

vi.mock('nodemailer', () => ({
    default: {
        createTransport: createTransportMock,
    },
}));

import { CONTACT_LIMITS, deliverContactMessage, getClientIp, validateContactInput } from './contact';

describe('validateContactInput', () => {
    it('accepts valid trimmed contact payload', () => {
        expect(
            validateContactInput({
                name: '  Владимир  ',
                email: '  test@example.com ',
                message: ' Привет ',
            }),
        ).toBeNull();
    });

    it('validates all boundary error codes', () => {
        expect(validateContactInput({ name: '', email: 'test@example.com', message: 'Hi' })).toBe('name_required');
        expect(
            validateContactInput({
                name: 'a'.repeat(CONTACT_LIMITS.name + 1),
                email: 'test@example.com',
                message: 'Hi',
            }),
        ).toBe('name_too_long');
        expect(
            validateContactInput({
                name: 'Test',
                email: 'a'.repeat(CONTACT_LIMITS.email + 1),
                message: 'Hi',
            }),
        ).toBe('email_too_long');
        expect(validateContactInput({ name: 'Test', email: 'bad-email', message: 'Hi' })).toBe('email_invalid');
        expect(validateContactInput({ name: 'Test', email: 'test@example.com', message: '   ' })).toBe(
            'message_required',
        );
        expect(
            validateContactInput({
                name: 'Test',
                email: 'test@example.com',
                message: 'a'.repeat(CONTACT_LIMITS.message + 1),
            }),
        ).toBe('message_too_long');
    });
});

describe('getClientIp', () => {
    it('prefers first x-forwarded-for entry when proxy is trusted', () => {
        const originalEnv = process.env.TRUSTED_PROXY_IPS;
        process.env.TRUSTED_PROXY_IPS = '127.0.0.1';
        const headers = new Headers({ 'x-forwarded-for': '203.0.113.10, 203.0.113.11', 'x-real-ip': '127.0.0.1' });

        expect(getClientIp(headers)).toBe('203.0.113.10');

        process.env.TRUSTED_PROXY_IPS = originalEnv;
    });

    it('ignores x-forwarded-for when proxy is not trusted', () => {
        const headers = new Headers({ 'x-forwarded-for': '203.0.113.10, 203.0.113.11', 'x-real-ip': '127.0.0.1' });

        expect(getClientIp(headers)).toBe('127.0.0.1');
    });

    it('falls back to x-real-ip and then unknown', () => {
        expect(getClientIp(new Headers({ 'x-real-ip': '198.51.100.5' }))).toBe('198.51.100.5');
        expect(getClientIp(new Headers())).toBe('unknown');
    });
});

describe('deliverContactMessage', () => {
    const originalEnv = { ...process.env };
    const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => undefined);
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    function setNodeEnv(value: 'development' | 'production' | 'test') {
        process.env = {
            ...process.env,
            NODE_ENV: value,
        };
    }

    beforeEach(() => {
        sendMailMock.mockReset();
        createTransportMock.mockClear();
        process.env = { ...originalEnv };
    });

    afterEach(() => {
        process.env = { ...originalEnv };
    });

    afterEach(() => {
        consoleLogSpy.mockClear();
        consoleErrorSpy.mockClear();
    });

    it('returns ok in development when delivery is not configured', async () => {
        delete process.env.CONTACT_EMAIL;
        delete process.env.SMTP_HOST;
        setNodeEnv('development');

        await expect(
            deliverContactMessage({ name: 'Test', email: 'test@example.com', message: 'Hello' }),
        ).resolves.toEqual({ ok: true });

        expect(consoleLogSpy).toHaveBeenCalled();
    });

    it('returns not_configured in production when env is missing', async () => {
        delete process.env.CONTACT_EMAIL;
        delete process.env.SMTP_HOST;
        setNodeEnv('production');

        await expect(
            deliverContactMessage({ name: 'Test', email: 'test@example.com', message: 'Hello' }),
        ).resolves.toEqual({ ok: false, code: 'not_configured' });
    });

    it('sends message through SMTP when env is configured', async () => {
        process.env.CONTACT_EMAIL = 'owner@example.com';
        process.env.CONTACT_FROM_EMAIL = 'pw@pestov-web.ru';
        process.env.CONTACT_FROM_NAME = 'Portfolio';
        process.env.SMTP_HOST = '192.168.1.100';
        process.env.SMTP_PORT = '587';
        process.env.SMTP_TLS_SERVERNAME = 'mail.pestov-web.ru';
        process.env.SMTP_USER = 'pw@pestov-web.ru';
        process.env.SMTP_PASSWORD = 'secret';
        setNodeEnv('production');
        sendMailMock.mockResolvedValue({ messageId: 'email-id' });

        await expect(
            deliverContactMessage({ name: ' Test ', email: 'user@example.com ', message: ' Hello ' }),
        ).resolves.toEqual({ ok: true });

        expect(createTransportMock).toHaveBeenCalledWith({
            host: '192.168.1.100',
            port: 587,
            secure: false,
            auth: {
                user: 'pw@pestov-web.ru',
                pass: 'secret',
            },
            tls: {
                servername: 'mail.pestov-web.ru',
            },
        });

        expect(sendMailMock).toHaveBeenCalledWith(
            expect.objectContaining({
                to: 'owner@example.com',
                from: {
                    name: 'Portfolio',
                    address: 'pw@pestov-web.ru',
                },
                replyTo: 'user@example.com',
                subject: '[Portfolio] Сообщение от Test',
                text: 'От: Test <user@example.com>\n\nHello',
            }),
        );
    });

    it('returns send_failed when SMTP transport throws', async () => {
        process.env.CONTACT_EMAIL = 'owner@example.com';
        process.env.SMTP_HOST = '192.168.1.100';
        process.env.SMTP_USER = 'pw@pestov-web.ru';
        process.env.SMTP_PASSWORD = 'secret';
        setNodeEnv('production');
        sendMailMock.mockRejectedValue(new Error('boom'));

        await expect(
            deliverContactMessage({ name: 'Test', email: 'user@example.com', message: 'Hello' }),
        ).resolves.toEqual({ ok: false, code: 'send_failed' });

        expect(consoleErrorSpy).toHaveBeenCalled();
    });
});
