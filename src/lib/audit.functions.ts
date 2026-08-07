import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import type { AuditReport } from "./audit-types";
import { aiReport, collectSignals, fallbackReport } from "./audit.server";

const RunAuditInput = z.object({ url: z.string().min(3).max(2048) });

export const runAudit = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => RunAuditInput.parse(data))
  .handler(async ({ data }): Promise<{ report: AuditReport | null; error: string | null }> => {
    const target = /^https?:\/\//i.test(data.url) ? data.url : `https://${data.url}`;
    let parsed: URL;
    try {
      parsed = new URL(target);
    } catch {
      return { report: null, error: "That doesn't look like a valid website address." };
    }
    if (!parsed.hostname.includes(".")) {
      return { report: null, error: "Please enter a full domain, for example yourwebsite.com" };
    }

    const id = `${parsed.hostname.replace(/[^a-z0-9]/gi, "-")}-${Date.now().toString(36)}`;

    try {
      const signals = await collectSignals(parsed.toString());
      const apiKey = process.env["LOVABLE_API_KEY"];
      const { persistAudit } = await import("./audits.server");
      if (apiKey) {
        try {
          const report = await aiReport(signals, id, apiKey);
          await persistAudit(report);
          return { report, error: null };
        } catch (aiError) {
          console.error("AI audit failed, falling back to heuristics:", aiError);
        }
      }
      const report = fallbackReport(signals, id);
      await persistAudit(report);
      return { report, error: null };
    } catch (error) {
      console.error("Audit fetch failed:", error);
      return {
        report: null,
        error:
          "We couldn't reach that website. Check the address is public and online, then try again.",
      };
    }
  });