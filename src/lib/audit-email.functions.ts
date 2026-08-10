import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const Input = z.object({
  email: z.string().email().max(320),
  reportUrl: z.string().url().max(20000),
  report: z.object({
    id: z.string().max(200),
    url: z.string().max(2048),
    title: z.string().max(300),
    createdAt: z.string().max(64),
    overallScore: z.number().min(0).max(100),
    executiveSummary: z.string().max(4000),
    categories: z
      .array(z.object({ name: z.string().max(120), score: z.number().min(0).max(100) }))
      .max(20),
    recommendations: z
      .array(
        z.object({
          title: z.string().max(200),
          problem: z.string().max(1000),
          priority: z.string().max(40),
          timeToFix: z.string().max(80),
        }),
      )
      .max(20),
  }),
});

export const emailAuditReport = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => Input.parse(data))
  .handler(async ({ data }): Promise<{ sent: boolean; error: string | null }> => {
    const { sendAuditEmailViaResend } = await import("./audit-email.server");
    try {
      return await sendAuditEmailViaResend(
        data.email,
        data.report as never,
        data.reportUrl,
      );
    } catch (error) {
      console.error("Audit email failed:", error);
      return { sent: false, error: "We couldn't send the email right now." };
    }
  });
