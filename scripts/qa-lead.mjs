/**
 * Lead-form gate: a lead is never lost, and never counted twice.
 *
 * Both forms used to show «Заявка отправлена» whatever `/api/send-lead`
 * answered, so a failed request lost the lead while the visitor was told it had
 * arrived — and the ads would have been credited with a conversion that never
 * happened. This drives the real forms with the endpoint stubbed, and checks:
 *
 *   1. opening the sheet pushes `lead_form_open` with the button's label;
 *   2. a 500 keeps the form filled, shows the error with a phone and a Telegram
 *      link, and pushes `lead_error` — not `generate_lead`;
 *   3. a 200 pushes `generate_lead` once, even if the button is pressed twice,
 *      and only one request leaves the browser;
 *   4. the payload carries the CTA, the page, the language and the landing
 *      page's campaign parameters — first and last touch;
 *   5. a filled honeypot still gets a 200, but no `generate_lead`.
 *
 * Usage: node scripts/qa-lead.mjs [base-url]
 */
import { chromium } from "playwright-core";

const CHROME = "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";
const BASE = process.argv[2] ?? "http://127.0.0.1:4173";
const problems = [];
const check = (cond, msg) => {
  if (!cond) problems.push(msg);
};

const browser = await chromium.launch({ executablePath: CHROME });

async function openPage(stub) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  const requests = [];
  await page.route("**/api/send-lead", async (route) => {
    requests.push(JSON.parse(route.request().postData() ?? "{}"));
    await new Promise((r) => setTimeout(r, 300));
    await route.fulfill({
      status: stub,
      contentType: "application/json",
      body: JSON.stringify(stub < 300 ? { ok: true } : { error: "stub" }),
    });
  });
  await page.goto(`${BASE}/ru?utm_source=qa&utm_medium=cpc&gclid=QA-GCLID`, {
    waitUntil: "networkidle",
  });
  const events = () => page.evaluate(() => (window.dataLayer ?? []).map((e) => e.event));
  return { ctx, page, requests, events };
}

async function fillSheet(page) {
  await page.getByRole("button", { name: "Забронировать тест" }).first().click();
  const sheet = page.locator('[data-placement="lead-sheet"]');
  await sheet.waitFor();
  await sheet.locator('input[name="name"]').fill("QA");
  await sheet.locator('input[name="phone"]').pressSequentially("901234567");
  return sheet;
}

// 1 + 2: failure keeps the lead.
{
  const { ctx, page, requests, events } = await openPage(500);
  const sheet = await fillSheet(page);
  const opened = await page.evaluate(() =>
    (window.dataLayer ?? []).find((e) => e.event === "lead_form_open"),
  );
  check(opened?.cta, `lead_form_open carried no cta: ${JSON.stringify(opened)}`);
  await sheet.locator('button[type="submit"]').click();
  await sheet
    .getByRole("alert")
    .waitFor({ timeout: 5000 })
    .catch(() => {});
  const alert = sheet.getByRole("alert");
  check(await alert.isVisible(), "500: no error shown");
  check(
    (await alert.locator('a[href^="tel:"]').count()) > 0 &&
      (await alert.locator('a[href*="t.me/"]').count()) > 0,
    "500: error offers no phone and Telegram",
  );
  check(
    (await sheet.locator('input[name="name"]').inputValue()) === "QA",
    "500: the form was cleared",
  );
  const ev = await events();
  check(ev.includes("lead_error"), "500: no lead_error pushed");
  check(!ev.includes("generate_lead"), "500: generate_lead pushed for a failed lead");
  check(requests.length === 1, `500: ${requests.length} requests`);
  await ctx.close();
}

// 3 + 4: success counts once, and carries its source.
{
  const { ctx, page, requests, events } = await openPage(200);
  const sheet = await fillSheet(page);
  const submit = sheet.locator('button[type="submit"]');
  await submit.click();
  await submit.click({ force: true }).catch(() => {});
  await page.waitForTimeout(1200);
  const ev = await events();
  check(
    ev.filter((e) => e === "generate_lead").length === 1,
    `200: generate_lead × ${ev.filter((e) => e === "generate_lead").length}`,
  );
  check(requests.length === 1, `200: double click sent ${requests.length} requests`);
  const body = requests[0] ?? {};
  check(body.cta === "Забронировать тест", `payload cta = ${body.cta}`);
  check(body.page === "/ru", `payload page = ${body.page}`);
  check(body.lang === "ru", `payload lang = ${body.lang}`);
  check(body.source === "lead-sheet", `payload source = ${body.source}`);
  check(body.attribution?.last?.params?.gclid === "QA-GCLID", "payload last touch has no gclid");
  check(
    body.attribution?.first?.params?.utm_source === "qa",
    "payload first touch has no utm_source",
  );
  check(
    !JSON.stringify(await page.evaluate(() => window.dataLayer)).includes("901234567"),
    "phone number leaked into the dataLayer",
  );
  await ctx.close();
}

// 5: the honeypot.
{
  const { ctx, page, events } = await openPage(200);
  const sheet = await fillSheet(page);
  await sheet.locator('input[name="website"]').evaluate((el) => {
    el.value = "http://spam.example";
  });
  await sheet.locator('button[type="submit"]').click();
  await page.waitForTimeout(1200);
  check(!(await events()).includes("generate_lead"), "honeypot: generate_lead pushed for a bot");
  await ctx.close();
}

await browser.close();
if (problems.length) {
  console.log(`qa-lead: ${problems.length} problem(s)\n  ${problems.join("\n  ")}`);
  process.exit(1);
}
console.log(
  "qa-lead: ok — failures keep the lead, successes count once, every lead carries its source",
);
