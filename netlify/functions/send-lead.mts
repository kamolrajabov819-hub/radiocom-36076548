import type { Config } from "@netlify/functions";

/**
 * Forwards a lead to the sales Telegram chat.
 *
 * Besides the visitor's name and phone, the message now says where the lead
 * came from — which form, which call to action, which product and page, and
 * the first and last campaign touch — so a manager can tell a Google Ads lead
 * from an Instagram one, and the click ID can be uploaded back to the ad
 * platform as an offline conversion.
 *
 * Everything from the client is untrusted: only whitelisted fields are read,
 * each is capped in length, and the message is sent as plain text (no
 * `parse_mode`), so nothing in it is interpreted by Telegram.
 */

/** The honeypot field the forms render off-screen. See `src/lib/lead.ts`. */
const HONEYPOT_FIELD = "website";
/** Per-value cap; Telegram's hard limit for the whole message is 4096. */
const MAX_FIELD = 300;
const MAX_MESSAGE = 4000;

const str = (v: unknown, max = MAX_FIELD): string =>
  typeof v === "string" ? v.trim().slice(0, max) : "";

type Touch = { params?: Record<string, unknown>; landing?: unknown; referrer?: unknown };

const TOUCH_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "gclid",
  "gbraid",
  "wbraid",
  "yclid",
  "fbclid",
] as const;

/** One touch as message lines, or nothing when it carries nothing. */
function touchLines(label: string, raw: unknown): string[] {
  if (!raw || typeof raw !== "object") return [];
  const touch = raw as Touch;
  const params = touch.params && typeof touch.params === "object" ? touch.params : {};
  const parts = TOUCH_KEYS.map((k) => {
    const v = str(params[k], 200);
    return v ? `${k}=${v}` : "";
  }).filter(Boolean);
  const landing = str(touch.landing);
  const referrer = str(touch.referrer);
  if (!parts.length && !landing && !referrer) return [];
  return [
    `${label}: ${parts.length ? parts.join(", ") : "direct / organic"}`,
    landing && `  landing: ${landing}`,
    referrer && `  referrer: ${referrer}`,
  ].filter((l): l is string => Boolean(l));
}

export default async (req: Request) => {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }

  // A filled honeypot is a bot. Answer exactly as a success would, so it has
  // no signal to adapt to, and forward nothing.
  if (str(body[HONEYPOT_FIELD])) {
    return Response.json({ ok: true });
  }

  const botToken = Netlify.env.get("TELEGRAM_BOT_TOKEN");
  const chatId = Netlify.env.get("TELEGRAM_CHAT_ID");

  if (!botToken || !chatId) {
    console.error("[send-lead] Telegram env vars not configured");
    return Response.json({ error: "Telegram not configured" }, { status: 500 });
  }

  const name = str(body.name, 120);
  const phone = str(body.phone, 40);
  if (!name || !phone) {
    return Response.json({ error: "Missing required fields" }, { status: 400 });
  }

  const company = str(body.company, 120);
  const qty = str(body.qty, 20);
  const message = str(body.message, 1000);
  const form = str(body.source, 40);
  const cta = str(body.cta, 160);
  const product = str(body.product, 160);
  const page = str(body.page, 200);
  const lang = str(body.lang, 5);
  const attribution =
    body.attribution && typeof body.attribution === "object"
      ? (body.attribution as { first?: unknown; last?: unknown })
      : {};

  const who = [
    "🆕 New lead — Radiocom",
    `Name: ${name}`,
    company && `Company: ${company}`,
    `Phone: ${phone}`,
    qty && `Quantity: ${qty}`,
    message && `Message: ${message}`,
  ];
  const where = [
    product && `Product: ${product}`,
    cta && `CTA: ${cta}`,
    form && `Form: ${form}`,
    page && `Page: ${page}${lang ? ` (${lang})` : ""}`,
    ...touchLines("Last touch", attribution.last),
    ...touchLines("First touch", attribution.first),
  ];
  const block = (ls: (string | false)[]) => ls.filter(Boolean).join("\n");
  const text = [block(who), block(where)].filter(Boolean).join("\n\n").slice(0, MAX_MESSAGE);

  const telegramRes = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text }),
  });

  if (!telegramRes.ok) {
    const errText = await telegramRes.text();
    console.error("[send-lead] Telegram API error", telegramRes.status, errText);
    return Response.json({ error: "Failed to send notification" }, { status: 502 });
  }

  return Response.json({ ok: true });
};

export const config: Config = {
  path: "/api/send-lead",
  method: "POST",
  // Ad traffic brings bots. Twenty leads a minute from one IP is far beyond
  // anything a person does and well inside what a script does.
  rateLimit: { windowLimit: 20, windowSize: 60, aggregateBy: ["ip", "domain"] },
};
