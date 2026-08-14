import type { Config } from "@netlify/functions";

export default async (req: Request) => {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  const botToken = Netlify.env.get("TELEGRAM_BOT_TOKEN");
  const chatId = Netlify.env.get("TELEGRAM_CHAT_ID");

  if (!botToken || !chatId) {
    console.error("[send-lead] Telegram env vars not configured");
    return Response.json({ error: "Telegram not configured" }, { status: 500 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const phone = typeof body.phone === "string" ? body.phone.trim() : "";
  const company = typeof body.company === "string" ? body.company.trim() : "";
  const qty = typeof body.qty === "string" ? body.qty.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";
  const product = typeof body.product === "string" ? body.product.trim() : "";
  const source = typeof body.source === "string" ? body.source.trim() : "";

  if (!name || !phone) {
    return Response.json({ error: "Missing required fields" }, { status: 400 });
  }

  const lines = [
    "🆕 New lead — Radiocom",
    source && `Source: ${source}`,
    product && `Product: ${product}`,
    `Name: ${name}`,
    company && `Company: ${company}`,
    `Phone: ${phone}`,
    qty && `Quantity: ${qty}`,
    message && `Message: ${message}`,
  ].filter(Boolean);

  const telegramRes = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text: lines.join("\n") }),
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
};
