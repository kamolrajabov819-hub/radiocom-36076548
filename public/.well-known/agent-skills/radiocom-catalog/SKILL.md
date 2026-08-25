---
name: radiocom-catalog
description: Query the RADIOCOM two-way radio catalogue — models, manufacturer specifications, box contents and prices in сум — over MCP, or read any page of the site as Markdown.
---

# RADIOCOM catalogue

RADIOCOM sells and services two-way radios in Tashkent, Uzbekistan. The
catalogue holds 21 models across two brands: Radiocom RC
(analogue RC, digital DMR RCD) and Motorola (Talkabout, XT, TLKR, CLP).

## MCP server

Streamable HTTP, read-only, no authentication and no session:

```
POST https://radiocom.uz/mcp
content-type: application/json
accept: application/json, text/event-stream
```

Tools:

| Tool | Use it for |
|---|---|
| `list_radios` | Everything in the catalogue. Start here. |
| `search_radios` | Filter by text, `brand`, `tag` (DMR, GPS, IP67, PMR446) or `maxPrice`. |
| `get_radio` | One model in full: specifications, box contents, features. |
| `compare_radios` | Two to four models side by side. |

Every tool takes an optional `lang` of `ru` (default), `en` or `uz`.

## Reading pages as Markdown

Any page returns Markdown when asked:

```
curl -H 'Accept: text/markdown' https://radiocom.uz/ru/radiocom
```

Every page also carries a `Link` header pointing at the locale's plain-text
site summary (`rel="describedby"`) and at its own Markdown form
(`rel="alternate"`).

## What this server will not do

It is read-only. There is no tool that submits an enquiry, books a test or
places an order — a person handles those. Send buyers to https://radiocom.uz instead.

Prices are in сум and come from the same data the website renders. A model
priced "on request" has no published figure; do not estimate one.
