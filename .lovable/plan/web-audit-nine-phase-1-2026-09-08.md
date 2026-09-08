# Web Audit Nine — Phase 1

Turn the current app into **Web Audit Nine**: a standalone AI website auditing product, with all Widgetify branding, community gating and growth extras removed, and a new credit-efficient audit engine.

No accounts in Phase 1 — audits, credits and history live in the visitor's own browser. Credits are a free monthly allowance, structured so paid top-ups can be added later.

## 1. Strip the old product

Delete: community onboarding gate, community/social links and pages, achievements, referral funnel, growth quiz, public directory, share badges/AI share cards, Pro waitlist, Widgetify credit lines and logos.

Removed files: `community.ts`, `growth.ts`, `referral.ts`, `quiz.ts`, `share-kit.ts`, their components, and the routes `/community`, `/achievements`, `/referral`, `/quiz`, `/directory`, plus the badge and share-image endpoints.

Kept and rebranded: home, report, history, how-it-works, use-cases, roadmap, about, privacy, terms, support. New name, new logo mark, new metadata everywhere; the email report template is rebranded too.

## 2. Audit flow

```text
URL -> Crawl -> Rule engine -> Data reduction -> Batched AI -> Scores -> Prioritized issues -> Fixes -> Re-audit
```

Eight categories: Technical SEO, SEO & AEO (AI search), Performance & Core Web Vitals, Accessibility, Security, UX/CRO, Content quality, plus an Overall score.

Audit modes shown before the run, each with an estimated credit cost:

| Mode | Pages | AI |
| --- | --- | --- |
| Basic | 1 | Rules only, no AI |
| Standard | up to 5 | One batched AI pass |
| Deep | up to 20 | Batched AI per page group |

Every issue carries: Problem, Evidence (the exact element/value found), Impact, Severity, Fix. Ranking is `Impact x Severity / Effort`. Severity buckets: Critical / High / Medium / Low / Passed.

Nothing is invented: scores come from the rule engine's measured checks. AI only writes explanation, prioritisation and fix text from the findings it is handed. If AI is unavailable or credits run out, the audit still completes as a rule-only report, clearly labelled.

## 3. Credit efficiency

- Deterministic checks run without AI; whole pages are never sent to the model.
- Only a compact JSON of extracted findings goes to the model, one batched request per audit (Deep batches pages in groups).
- Responses are cached by a hash of the findings payload; an unchanged page reuses its cached analysis and costs nothing.
- Re-audit only re-analyses pages whose content hash changed.
- In-flight requests are de-duplicated; no automatic retries on terminal errors.
- Credit meter shows estimate before, and used/remaining after. Balance can never go below zero — the run downgrades to rule-only instead.

## 4. Dashboard and reports

- Score dashboard with the eight scores and severity counts.
- Page-level results for multi-page audits.
- Audit history with change detection (score delta and newly fixed/regressed issues per re-audit).
- Competitor comparison: audit a rival URL and view scores side by side.
- Printable/PDF report and a shareable encoded report link.
- Projects: group audits for a site or client, and a report header that can carry a custom name and colour (light white-label).
- Monitoring is scheduled-reminder based in Phase 1 (no server accounts yet) and flagged as a later phase for true background checks.

## 5. AI Fix Center

A panel on any report where the user spends credits deliberately, per item, to generate: SEO titles/descriptions, FAQ blocks, schema markup, image alt text, CTA rewrites, content recommendations, technical fix snippets. Each generation shows its credit cost first and is cached by the same content hash.

## Technical notes

- Rule engine and crawler run as server functions with per-request page caps, per-page fetch timeouts, sequential queueing, and total-run limits; failures degrade to partial results rather than an error page.
- AI calls use `openai/gpt-5.6-luna` through the Lovable AI Gateway with `reasoning_effort: "none"`, streamed server-side, strict JSON output schema, compact field names.
- Gateway status handling: 429/5xx back off within the cap; 402/403 stop AI and fall back to rule-only.
- Storage stays browser-local (audits, credits, projects) behind one storage module, shaped so a backend can be swapped in when accounts arrive.
- Audit types are rewritten for the new categories, evidence-bearing issues and page-level results; the report view, history and email template follow.

## Later phases (not this build)

Accounts and server-side sync, true background monitoring with alerts, full white-label domains, paid credit top-ups.
