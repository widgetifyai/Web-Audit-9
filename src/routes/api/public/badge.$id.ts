import { createFileRoute } from "@tanstack/react-router";

import { decodeReport } from "@/lib/audit-history";
import { scoreTone } from "@/lib/audit-types";

export const Route = createFileRoute("/api/public/badge/$id")({
  server: {
    handlers: {
      GET: async ({ request, params }) => {
        const { searchParams } = new URL(request.url);
        const encoded = searchParams.get("d") ?? "";
        const report = encoded ? decodeReport(encoded) : null;

        if (!report) {
          return new Response("Report not found", { status: 404 });
        }

        const hostname = (() => {
          try {
            return new URL(report.url).hostname;
          } catch {
            return report.url;
          }
        })();

        const score = report.overallScore;
        const tone = scoreTone(score);
        const fill = tone === "success" ? "#22c55e" : tone === "warning" ? "#f59e0b" : "#ef4444";
        const bg = "#0f172a";
        const text = "#f8fafc";
        const muted = "#94a3b8";

        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="240" height="80" role="img" aria-label="WebAudit score for ${hostname}: ${score} out of 100">
  <rect width="240" height="80" rx="12" fill="${bg}" stroke="#1e293b" stroke-width="1"/>
  <text x="16" y="26" font-family="system-ui, sans-serif" font-size="11" font-weight="600" fill="${muted}">AUDITED BY WEBAUDIT</text>
  <text x="16" y="52" font-family="system-ui, sans-serif" font-size="15" font-weight="700" fill="${text}" textLength="140" lengthAdjust="spacingAndGlyphs">${hostname}</text>
  <circle cx="204" cy="40" r="24" fill="none" stroke="${fill}" stroke-width="4"/>
  <text x="204" y="45" font-family="system-ui, sans-serif" font-size="16" font-weight="800" fill="${fill}" text-anchor="middle">${score}</text>
</svg>`;

        return new Response(svg, {
          headers: {
            "Content-Type": "image/svg+xml; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
