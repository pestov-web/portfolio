import { Resend } from "resend";

export type ContactInput = {
  name: string;
  email: string;
  message: string;
};

export type ContactValidationCode = "name_required" | "email_invalid" | "message_required";
export type ContactDeliveryErrorCode = "not_configured" | "send_failed";

type HeaderSource = {
  get(name: string): string | null;
};

export function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validateContactInput(input: ContactInput): ContactValidationCode | null {
  if (input.name.trim().length < 1) {
    return "name_required";
  }

  if (!isValidEmail(input.email.trim())) {
    return "email_invalid";
  }

  if (input.message.trim().length < 1) {
    return "message_required";
  }

  return null;
}

export function getClientIp(headers: HeaderSource) {
  const forwardedFor = headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() ?? "unknown";
  }

  return headers.get("x-real-ip") ?? "unknown";
}

export async function deliverContactMessage(input: ContactInput): Promise<{ ok: true } | { ok: false; code: ContactDeliveryErrorCode }> {
  const to = process.env.CONTACT_EMAIL;

  if (!to || !process.env.RESEND_API_KEY) {
    if (process.env.NODE_ENV !== "production") {
      console.log("[contact]", input);
      return { ok: true };
    }

    return { ok: false, code: "not_configured" };
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: "portfolio <onboarding@resend.dev>",
      to,
      subject: `[Portfolio] Сообщение от ${input.name.trim()}`,
      replyTo: input.email.trim(),
      text: `От: ${input.name.trim()} <${input.email.trim()}>\n\n${input.message.trim()}`,
    });

    return { ok: true };
  } catch (error) {
    console.error("[contact] Resend error:", error);
    return { ok: false, code: "send_failed" };
  }
}