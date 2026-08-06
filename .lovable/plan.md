# WebAudit Platform Growth Suite

## Overview
Build a production-ready growth layer into WebAudit that turns every audit into a distribution, discovery, and retention loop — without relying on external data APIs. All growth features will use the existing page-fetch + GPT-5.6-Sol pipeline, localStorage state, shareable URL encoding, and a single public badge endpoint.

## Goals
1. **Increase website submissions** by making audits feel like achievements worth collecting.
2. **Improve discovery** through public directories, leaderboards, and embeddable badges.
3. **Encourage sharing** with platform-native social copy, AI-generated share cards, and one-click posts.
4. **Strengthen community** by surfacing community-audited sites and onboarding progress.
5. **Improve retention** via achievements, re-audit nudges, and a pro waitlist.

## Growth Features

### 1. Viral Share Kit
- **Dynamic OG share cards**: generate a branded preview image for each report using the Lovable AI image gateway. The image shows the audited hostname, overall score, and top category. Stored as a data URL or generated on demand when sharing.
- **One-click social posts**: add buttons in `ReportView` that copy pre-written, platform-optimised share text for Twitter/X, LinkedIn, Instagram, and WhatsApp. Each post includes the score, one strength, and the public report link.
- **Public report badge**: add a new `/api/public/badge/:id` server route that returns an SVG badge showing the score and a "Audited by WebAudit" label. Users can copy an embed snippet.

### 2. Public Audit Directory & Leaderboard
- **Opt-in public listing**: in `ReportView`, let users "Add to WebAudit Directory". This stores the report in a new `directory` localStorage bucket and appends a public directory token to the share URL.
- **Directory route**: create `/directory`, a searchable, filterable grid of publicly listed sites with scores, categories, and direct links to their reports.
- **Leaderboard tabs**: "Top Scores", "Most Recent", "Most Improved" (when the same hostname is audited twice), and "Community Picks" (favourited reports).
- **Privacy-safe**: only reports explicitly opted-in are listed; no PII is stored.

### 3. Achievement & Gamification System
- **Achievement engine**: define achievements such as "First Audit", "Community Champion" (complete onboarding), "Score Hunter" (audit 5 sites), "Sharpshooter" (share a report), "High Performer" (discover a site scoring 90+), and "Comeback" (re-audit and improve a score).
- **Achievement storage**: persist unlocked achievements in localStorage with unlock dates.
- **Achievement UI**: add a `/achievements` route and an achievement toast that fires after an audit unlocks something new. Surface a compact "Your progress" widget on the home page and history page.

### 4. Embeddable Score Badge
- **Badge generator**: the `/api/public/badge/:id` route reads the report from the URL-encoded `d` query parameter or localStorage and returns a cached-friendly SVG with the score, colour-coded by `scoreTone`.
- **Embed snippet**: in `ReportView`, provide a copyable `<img>` and Markdown snippet so users can paste the badge into GitHub readmes, Notion pages, or footers.

### 5. Re-audit Reminders & Retention Nudges
- **Re-audit tracking**: store the last audit date per hostname in localStorage.
- **Smart nudges**: on the home page and history page, show a "Re-audit [hostname] — it’s been 30 days" card when a site is due.
- **Trend line**: when a hostname has multiple audits, show a mini sparkline of score changes in history and a "+12 since last audit" badge in `ReportView`.

### 6. Pro Waitlist (Interest Capture)
- **Waitlist CTA**: add a non-intrusive "Unlock Pro audits" section on the home page and report page. Users enter an email to express interest in advanced features (competitor tracking, scheduled audits, team reports).
- **Storage**: store waitlist entries in localStorage for now, with a clear "You're on the list" confirmation. No external email provider is required in this pass.

### 7. Community Showcase on Home Page
- **Featured directory entries**: surface 3–6 opted-in public audits on the home page under a "Websites the community is improving" section.
- **Social proof counter**: show dynamic counts ("X audits run this session", "Y sites in the directory") based on localStorage and sample seed data.

## Technical Approach
- **No external APIs**: all growth data is derived from the audited page, GPT-5.6-Sol output, and browser storage.
- **Shareable state**: reuse the existing `encodeReport`/`decodeReport` base64 URL pattern for public directory entries and badge generation.
- **Public badge endpoint**: implement as a TanStack Start server route under `src/routes/api/public/badge.$id.ts` that returns an SVG `Response`.
- **AI image generation**: use the Lovable AI image gateway for share cards, with a fallback to a styled HTML card when generation is unavailable.
- **localStorage architecture**: extend `src/lib/audit-history.ts` with `directory`, `achievements`, and `waitlist` buckets, keeping the same event-based sync pattern used by community onboarding.
- **Hydration safety**: fix the existing footer hydration mismatch by moving dynamic model-name copy into a client-only wrapper or static string.

## Files to Create / Modify
- `src/lib/audit-history.ts` — add directory, achievements, waitlist, and re-audit helpers.
- `src/lib/growth.ts` — achievement definitions and unlock logic.
- `src/lib/share-kit.ts` — social copy generators and image-card helpers.
- `src/routes/api/public/badge.$id.ts` — SVG badge endpoint.
- `src/routes/directory.tsx` — public audit directory.
- `src/routes/achievements.tsx` — achievement gallery.
- `src/components/audit/ShareKit.tsx` — share card + social copy UI.
- `src/components/audit/AchievementToast.tsx` — unlock notifications.
- `src/components/audit/DirectoryCard.tsx` — directory listing card.
- `src/components/audit/ReAuditPrompt.tsx` — re-audit nudge.
- `src/components/audit/ProWaitlist.tsx` — waitlist capture.
- `src/components/audit/CommunityShowcase.tsx` — homepage showcase.
- `src/components/audit/ReportView.tsx` — integrate share kit, badge snippet, directory opt-in, and trend badge.
- `src/components/audit/SiteFooter.tsx` — fix hydration mismatch.
- `src/routes/index.tsx` — add achievements progress, community showcase, and waitlist CTA.
- `src/routes/history.tsx` — add achievements widget, re-audit prompts, and trend sparklines.
- `src/components/audit/SiteHeader.tsx` — add Directory and Achievements links.

## Success Criteria
- Users can share a report with a generated preview image and platform-specific copy.
- Users can opt a report into the public directory and browse `/directory`.
- Users can copy an embeddable SVG badge for any report.
- Achievements unlock automatically and are visible on `/achievements`.
- Re-audit nudges appear for sites older than 30 days.
- The footer hydration mismatch is resolved.
- All new features work on mobile and desktop without external API dependencies.

## Risks & Considerations
- **AI image generation cost**: share cards are generated on demand; we will cache the result in localStorage and show a styled HTML fallback if credits are exhausted.
- **Public directory privacy**: directory entries are strictly opt-in and only expose the same data already present in a public share link.
- **localStorage limits**: large report objects remain in existing storage; directory entries will store lightweight metadata only.
- **No email provider**: the waitlist captures intent locally; a future pass can wire an email connector.
