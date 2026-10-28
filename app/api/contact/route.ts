import { contactContent } from "@/src/data/portfolio";

const RESEND_API_URL = "https://api.resend.com/emails";
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const LIMITS = {
  name: 120,
  email: 200,
  message: 5000,
} as const;

const DEFAULT_FROM = "Portfolio Contact <onboarding@resend.dev>";

function reply(status: number, error: string) {
  return Response.json({ ok: false, error }, { status });
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => {
    switch (character) {
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case '"':
        return "&quot;";
      default:
        return "&#39;";
    }
  });
}

export async function POST(request: Request) {
  const copy = contactContent.form;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return reply(400, copy.invalidRequest);
  }

  if (!body || typeof body !== "object") {
    return reply(400, copy.invalidRequest);
  }

  const record = body as Record<string, unknown>;
  const rawName = typeof record.name === "string" ? record.name.trim() : "";
  const rawEmail = typeof record.email === "string" ? record.email.trim() : "";
  const rawMessage =
    typeof record.message === "string" ? record.message.trim() : "";

  const name = rawName.replace(/\s+/g, " ");

  if (name.length < 2 || name.length > LIMITS.name) {
    return reply(400, copy.validation.name);
  }

  if (
    rawEmail.length > LIMITS.email ||
    !EMAIL_PATTERN.test(rawEmail)
  ) {
    return reply(400, copy.validation.email);
  }

  if (
    rawMessage.length < 10 ||
    rawMessage.length > LIMITS.message
  ) {
    return reply(400, copy.validation.message);
  }

  const apiKey = process.env.RESEND_API_KEY?.trim();
  const recipients = (process.env.CONTACT_TO_EMAIL ?? "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
  const from = process.env.CONTACT_FROM_EMAIL?.trim() || DEFAULT_FROM;

  if (!apiKey || recipients.length === 0) {
    return reply(503, copy.unconfigured);
  }

  const subject = `Portfolio message from ${name}`;
  const text = `New portfolio message\n\nName: ${name}\nEmail: ${rawEmail}\n\n${rawMessage}`;
  const html = `
    <h2>New portfolio message</h2>
    <p><strong>Name:</strong> ${escapeHtml(name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(rawEmail)}</p>
    <p style="white-space:pre-wrap">${escapeHtml(rawMessage).replace(/\n/g, "<br />")}</p>
  `;

  try {
    const response = await fetch(RESEND_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: recipients,
        reply_to: rawEmail,
        subject,
        text,
        html,
      }),
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      console.error(
        "Contact email failed",
        response.status,
        detail.slice(0, 300),
      );
      return reply(502, copy.errorFallback);
    }

    return Response.json({ ok: true });
  } catch (error) {
    console.error("Contact route error", error);
    return reply(500, copy.errorFallback);
  }
}
