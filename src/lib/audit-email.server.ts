import type { AuditReport } from "./audit-types";

const GATEWAY_URL = "https://connector-gateway.lovable.dev/resend";
const FROM = "WebAudit <onboarding@resend.dev>";

const esc = (v: string) =>
  v.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function tone(score: number): string {
  if (score >= 80) return "#0f9d6e";
  if (score >= 60) return "#c98a12";
  return "#d64545";
}

export function renderAuditEmail(report: AuditReport, reportUrl: string): string {
  let hostname = report.url;
  try {
    hostname = new URL(report.url).hostname;
  } catch {
    /* keep raw */
  }

  const categories = report.categories
    .map(
      (c) => `<tr>
        <td style="padding:8px 0;font:14px/1.4 Arial,sans-serif;color:#20242b;">${esc(c.name)}</td>
        <td align="right" style="padding:8px 0;font:600 14px/1.4 Arial,sans-serif;color:${tone(c.score)};">${c.score}/100</td>
      </tr>`,
    )
    .join("");

  const recommendations = report.recommendations
    .slice(0, 5)
    .map(
      (r) => `<li style="margin:0 0 10px;font:14px/1.6 Arial,sans-serif;color:#3a4049;">
        <strong style="color:#20242b;">${esc(r.title)}</strong> — ${esc(r.problem)}
        <span style="color:#6b7280;">(${esc(r.priority)} · ${esc(r.timeToFix)})</span>
      </li>`,
    )
    .join("");

  return `<!doctype html><html><body style="margin:0;background:#ffffff;">
  <div style="display:none;max-height:0;overflow:hidden;">Your WebAudit report for ${esc(hostname)} — score ${report.overallScore}/100.</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff;">
    <tr><td align="center" style="padding:32px 16px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;border:1px solid #e6e8ec;border-radius:14px;overflow:hidden;">
        <tr><td style="padding:24px 28px;background:#0e1116;">
          <div style="font:700 18px/1.2 Arial,sans-serif;color:#ffffff;">WebAudit</div>
          <div style="font:13px/1.5 Arial,sans-serif;color:#9aa3b2;margin-top:4px;">AI website audit · powered by gpt-5.6-sol</div>
        </td></tr>
        <tr><td style="padding:28px;">
          <h1 style="margin:0 0 6px;font:700 22px/1.3 Arial,sans-serif;color:#0e1116;">Your audit for ${esc(hostname)}</h1>
          <p style="margin:0 0 20px;font:14px/1.6 Arial,sans-serif;color:#6b7280;">Completed ${esc(new Date(report.createdAt).toUTCString())}</p>
          <div style="text-align:center;padding:18px;border:1px solid #e6e8ec;border-radius:12px;">
            <div style="font:700 40px/1 Arial,sans-serif;color:${tone(report.overallScore)};">${report.overallScore}<span style="font-size:18px;color:#6b7280;">/100</span></div>
            <div style="margin-top:6px;font:13px/1.4 Arial,sans-serif;color:#6b7280;">Overall score</div>
          </div>
          <p style="margin:22px 0 0;font:14px/1.7 Arial,sans-serif;color:#3a4049;">${esc(report.executiveSummary)}</p>
          <h2 style="margin:26px 0 6px;font:700 16px/1.3 Arial,sans-serif;color:#0e1116;">Category scores</h2>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${categories}</table>
          <h2 style="margin:26px 0 10px;font:700 16px/1.3 Arial,sans-serif;color:#0e1116;">Top priorities</h2>
          <ul style="margin:0;padding-left:18px;">${recommendations}</ul>
          <div style="text-align:center;margin:30px 0 6px;">
            <a href="${esc(reportUrl)}" style="display:inline-block;background:#0e1116;color:#ffffff;text-decoration:none;font:600 15px/1 Arial,sans-serif;padding:14px 26px;border-radius:10px;">View &amp; download full report</a>
          </div>
          <p style="margin:16px 0 0;font:12px/1.6 Arial,sans-serif;color:#9aa3b2;text-align:center;">You received this because you requested an audit on WebAudit.<br/>The platform created by <a href="https://widgetifyai.vercel.app/" style="color:#6b7280;">Widgetify</a>.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
  </body></html>`;
}

export async function sendAuditEmailViaResend(
  to: string,
  report: AuditReport,
  reportUrl: string,
): Promise<{ sent: boolean; error: string | null }> {
  const lovableKey = process.env["LOVABLE_API_KEY"];
  const resendKey = process.env["RESEND_API_KEY"];
  if (!lovableKey || !resendKey) {
    return { sent: false, error: "Email sending is not configured." };
  }

  let hostname = report.url;
  try {
    hostname = new URL(report.url).hostname;
  } catch {
    /* keep raw */
  }

  const response = await fetch(`${GATEWAY_URL}/emails`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${lovableKey}`,
      "X-Connection-Api-Key": resendKey,
    },
    body: JSON.stringify({
      from: FROM,
      to: [to],
      subject: `Your website audit for ${hostname} — ${report.overallScore}/100`,
      html: renderAuditEmail(report, reportUrl),
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    console.error(`Resend send failed [${response.status}]: ${body}`);
    return { sent: false, error: `Email provider error [${response.status}]` };
  }

  return { sent: true, error: null };
}
