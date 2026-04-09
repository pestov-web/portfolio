import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { contactRateLimiter } from "@/shared/lib/rate-limit";

// Простая валидация на сервере
function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function getClientIp(req: NextRequest) {
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() ?? "unknown";
  }

  return req.headers.get("x-real-ip") ?? "unknown";
}

export async function POST(req: NextRequest) {
  const rateLimit = contactRateLimiter(getClientIp(req));
  if (!rateLimit.success) {
    return NextResponse.json(
      { error: "Too many requests" },
      {
        status: 429,
        headers: { "Retry-After": String(rateLimit.retryAfter) },
      }
    );
  }

  let body: unknown;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (
    typeof body !== "object" ||
    body === null ||
    !("name" in body) ||
    !("email" in body) ||
    !("message" in body)
  ) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const { name, email, message } = body as Record<string, unknown>;

  if (
    typeof name !== "string" || name.trim().length < 1 ||
    typeof email !== "string" || !isValidEmail(email) ||
    typeof message !== "string" || message.trim().length < 1
  ) {
    return NextResponse.json({ error: "Invalid fields" }, { status: 422 });
  }

  const to = process.env.CONTACT_EMAIL;

  if (!to || !process.env.RESEND_API_KEY) {
    if (process.env.NODE_ENV !== "production") {
      // В dev без настроенного Resend просто логируем
      console.log("[contact]", { name, email, message });
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ error: "Email delivery is not configured" }, { status: 500 });
  }

  try {
    // Создаём клиент только здесь (RESEND_API_KEY может быть не задан в dev)
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: "portfolio <onboarding@resend.dev>",
      to,
      subject: `[Portfolio] Сообщение от ${name.trim()}`,
      replyTo: email.trim(),
      text: `От: ${name.trim()} <${email.trim()}>\n\n${message.trim()}`,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contact] Resend error:", err);
    return NextResponse.json({ error: "Send failed" }, { status: 500 });
  }
}
