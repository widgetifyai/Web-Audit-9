import type { AuditReport } from "./audit-types";

export interface SharePlatform {
  id: "twitter" | "linkedin" | "facebook" | "whatsapp" | "copy";
  name: string;
}

export const SHARE_PLATFORMS: SharePlatform[] = [
  { id: "twitter", name: "X / Twitter" },
  { id: "linkedin", name: "LinkedIn" },
  { id: "facebook", name: "Facebook" },
  { id: "whatsapp", name: "WhatsApp" },
  { id: "copy", name: "Copy link" },
];

export function generateShareText(report: AuditReport, link: string): Record<SharePlatform["id"], string> {
  const hostname = hostnameFromUrl(report.url);
  const score = report.overallScore;
  const topStrength = report.strengths[0] ?? "Strong overall health.";
  const topWeakness = report.weaknesses[0] ?? "A few areas to improve.";

  const short = `I just audited ${hostname} with WebAudit and it scored ${score}/100. ${topStrength} See the full report:`;

  return {
    twitter: `${short}\n\n${link}\n\n#WebAudit #WebsiteAudit #SEO`,
    linkedin: `Website audit results for ${hostname}\n\nOverall score: ${score}/100\n${topStrength}\n${topWeakness}\n\nFull report: ${link}\n\n#WebAudit #WebsiteOptimization #DigitalMarketing`,
    facebook: `I ran a free website audit for ${hostname} using WebAudit. It scored ${score}/100. Check out the full report here: ${link}`,
    whatsapp: `Check out this website audit for ${hostname}: ${score}/100. ${topStrength} Full report: ${link}`,
    copy: link,
  };
}

export function generateShareHtml(report: AuditReport, link: string): string {
  const hostname = hostnameFromUrl(report.url);
  const score = report.overallScore;
  const tone = score >= 80 ? "success" : score >= 60 ? "warning" : "danger";
  const toneColor = tone === "success" ? "#22c55e" : tone === "warning" ? "#f59e0b" : "#ef4444";

  return `
    <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 520px; border-radius: 16px; overflow: hidden; background: #0f172a; color: #f8fafc; border: 1px solid #1e293b;">
      <div style="padding: 24px;">
        <div style="display: flex; align-items: center; justify-content: space-between; gap: 16px;">
          <div>
            <p style="margin: 0; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; color: #94a3b8;">Website audit</p>
            <h3 style="margin: 4px 0 0; font-size: 20px; font-weight: 700; word-break: break-all;">${hostname}</h3>
          </div>
          <div style="width: 72px; height: 72px; border-radius: 50%; border: 4px solid ${toneColor}; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
            <span style="font-size: 24px; font-weight: 800; color: ${toneColor};">${score}</span>
          </div>
        </div>
        <p style="margin: 16px 0 0; font-size: 14px; line-height: 1.5; color: #cbd5e1;">${report.executiveSummary.slice(0, 140)}...</p>
      </div>
      <div style="background: #1e293b; padding: 12px 24px; display: flex; align-items: center; justify-content: space-between;">
        <span style="font-size: 13px; font-weight: 600; color: #f8fafc;">Audited by WebAudit</span>
        <a href="${link}" style="font-size: 13px; color: #38bdf8; text-decoration: none;">View report →</a>
      </div>
    </div>
  `.trim();
}

export function generateBadgeEmbed(report: AuditReport, badgeUrl: string): { html: string; markdown: string } {
  const alt = `WebAudit score: ${report.overallScore}/100 for ${hostnameFromUrl(report.url)}`;
  return {
    html: `<a href="${badgeUrl}" target="_blank" rel="noopener noreferrer"><img src="${badgeUrl}" alt="${alt}" /></a>`,
    markdown: `[![${alt}](${badgeUrl})](${badgeUrl})`,
  };
}

export function generateImagePrompt(report: AuditReport): string {
  const hostname = hostnameFromUrl(report.url);
  const score = report.overallScore;
  const tone = score >= 80 ? "green" : score >= 60 ? "amber" : "red";
  const topCategory = [...report.categories].sort((a, b) => b.score - a.score)[0];

  return `A premium, dark-themed social share card for a website audit. 
Background: deep navy/slate gradient with subtle glow.
Center: large bold number "${score}" out of 100 in ${tone} color.
Below the score: the website "${hostname}" in clean white sans-serif typography.
Below that: a small badge that says "${topCategory?.name ?? "Overall"} ${topCategory?.score ?? score}/100".
Top-right corner: a small "Audited by WebAudit" wordmark in white.
Style: modern SaaS marketing asset, minimal, high contrast, no extra clutter, no photographs of people.`;
}

function hostnameFromUrl(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}
