import { NextRequest, NextResponse } from "next/server";
import { deliverContactMessage, getClientIp, validateContactInput } from "@/shared/lib/contact";
import { contactRateLimiter } from "@/shared/lib/rate-limit";

export async function POST(req: NextRequest) {
  const rateLimit = await contactRateLimiter(getClientIp(req.headers));
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

  if (typeof name !== "string" || typeof email !== "string" || typeof message !== "string") {
    return NextResponse.json({ error: "Invalid fields" }, { status: 422 });
  }

  const validationCode = validateContactInput({ name, email, message });
  if (validationCode) {
    return NextResponse.json({ error: "Invalid fields" }, { status: 422 });
  }

  const delivery = await deliverContactMessage({ name, email, message });
  if (delivery.ok) {
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json(
    { error: delivery.code === "not_configured" ? "Email delivery is not configured" : "Send failed" },
    { status: 500 }
  );
}
