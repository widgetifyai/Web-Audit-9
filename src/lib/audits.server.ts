import { supabaseAdmin } from "@/integrations/supabase/client.server";

import type { AuditReport } from "./audit-types";

export async function persistAudit(report: AuditReport): Promise<void> {
  let hostname = report.url;
  try {
    hostname = new URL(report.url).hostname;
  } catch {
    /* keep raw url */
  }

  const { error } = await supabaseAdmin.from("audits").upsert(
    {
      id: report.id,
      url: report.url,
      hostname,
      title: report.title,
      overall_score: report.overallScore,
      categories: report.categories.map((c) => ({ id: c.id, name: c.name, score: c.score })),
      report: JSON.parse(JSON.stringify(report)),
      ai_powered: report.aiPowered,
    },
    { onConflict: "id" },
  );

  if (error) console.error("Failed to persist audit:", error.message);
}
