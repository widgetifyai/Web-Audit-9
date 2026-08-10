import { useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { ArrowRight, Globe, Loader2, Lock, Mail } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { encodeReport, saveAudit } from "@/lib/audit-history";
import { emailAuditReport } from "@/lib/audit-email.functions";
import { normalizeUrl } from "@/lib/audit-types";
import { runAudit } from "@/lib/audit.functions";
import { useCommunityProgress } from "@/lib/community";
import { CommunityOnboarding } from "@/components/audit/CommunityOnboarding";
import { cn } from "@/lib/utils";

const STAGES = [
  "Resolving the address",
  "Fetching the page",
  "Measuring performance signals",
  "Reading SEO and metadata",
  "Checking accessibility",
  "Reviewing security headers",
  "Scoring conversion opportunities",
  "Writing your recommendations",
];

export function AuditForm({ className }: { className?: string }) {
  const navigate = useNavigate();
  const audit = useServerFn(runAudit);
  const sendReportEmail = useServerFn(emailAuditReport);
  const { unlocked, hydrated, count, total } = useCommunityProgress();
  const [showGate, setShowGate] = useState(false);
  const [url, setUrl] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [running, setRunning] = useState(false);
  const [stage, setStage] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearInterval(timer.current);
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (running) return;
    if (!unlocked) {
      setShowGate(true);
      return;
    }

    const normalized = normalizeUrl(url);
    if (!normalized) {
      setError("Enter a full website address, for example yourwebsite.com");
      return;
    }

    setError(null);
    setRunning(true);
    setStage(0);
    timer.current = setInterval(() => {
      setStage((s) => (s < STAGES.length - 1 ? s + 1 : s));
    }, 1600);

    try {
      const result = await audit({ data: { url: normalized } });
      if (timer.current) clearInterval(timer.current);

      if (!result.report) {
        setError(result.error ?? "Something went wrong. Please try again.");
        setRunning(false);
        return;
      }

      setStage(STAGES.length - 1);
      saveAudit(result.report);
      const report = result.report;
      toast.success("Audit complete", {
        description: `${new URL(report.url).hostname} scored ${report.overallScore}/100`,
      });

      const recipient = email.trim();
      if (recipient.includes("@")) {
        const reportUrl = `${window.location.origin}/report/${report.id}?d=${encodeReport(report)}`;
        void sendReportEmail({
          data: {
            email: recipient,
            reportUrl,
            report: {
              id: report.id,
              url: report.url,
              title: report.title,
              createdAt: report.createdAt,
              overallScore: report.overallScore,
              executiveSummary: report.executiveSummary,
              categories: report.categories.map((c) => ({ name: c.name, score: c.score })),
              recommendations: report.recommendations.map((r) => ({
                title: r.title,
                problem: r.problem,
                priority: r.priority,
                timeToFix: r.timeToFix,
              })),
            },
          },
        })
          .then((res) => {
            if (res.sent) toast.success(`Report emailed to ${recipient}`);
            else if (res.error) toast.error(res.error);
          })
          .catch(() => toast.error("We couldn't email the report."));
      }

      navigate({ to: "/report/$id", params: { id: report.id } });
    } catch {
      if (timer.current) clearInterval(timer.current);
      setError("We couldn't complete the audit. Please try again in a moment.");
      setRunning(false);
    }
  };

  const progress = running ? Math.round(((stage + 1) / STAGES.length) * 100) : 0;

  return (
    <div className={cn("w-full", className)}>
      <form onSubmit={handleSubmit} className="w-full">
        <div className="surface-card flex flex-col gap-3 p-3 sm:flex-row sm:items-center">
          <div className="flex min-w-0 flex-1 items-center gap-3 px-3">
            <Globe className="size-5 shrink-0 text-muted-foreground" aria-hidden />
            <label htmlFor="audit-url" className="sr-only">
              Website address
            </label>
            <input
              id="audit-url"
              type="text"
              inputMode="url"
              autoComplete="url"
              value={url}
              disabled={running}
              onChange={(e) => {
                setUrl(e.target.value);
                if (error) setError(null);
              }}
              placeholder="https://yourwebsite.com"
              className="h-12 w-full min-w-0 bg-transparent text-base text-foreground outline-none placeholder:text-muted-foreground disabled:opacity-60"
            />
          </div>
          <Button type="submit" size="lg" variant="hero" disabled={running} className="shrink-0">
            {!hydrated || unlocked ? null : <Lock className="size-4" aria-hidden />}
            {running ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden />
                Auditing…
              </>
            ) : hydrated && !unlocked ? (
              "Unlock free audit"
            ) : (
              <>
                Start Free Audit
                <ArrowRight className="size-4" aria-hidden />
              </>
            )}
          </Button>
        </div>

        <div className="surface-card mt-3 flex items-center gap-3 p-3">
          <div className="flex min-w-0 flex-1 items-center gap-3 px-3">
            <Mail className="size-5 shrink-0 text-muted-foreground" aria-hidden />
            <label htmlFor="audit-email" className="sr-only">
              Email address for your report
            </label>
            <input
              id="audit-email"
              type="email"
              inputMode="email"
              autoComplete="email"
              value={email}
              disabled={running}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com — email me the report (optional)"
              className="h-11 w-full min-w-0 bg-transparent text-base text-foreground outline-none placeholder:text-muted-foreground disabled:opacity-60"
            />
          </div>
        </div>
      </form>

      {hydrated && !unlocked ? (
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Lock className="size-3.5" aria-hidden />
            Community onboarding required — {count} of {total} completed
          </span>
          <button
            type="button"
            onClick={() => setShowGate((s) => !s)}
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            {showGate ? "Hide steps" : "Show the 6 steps"}
          </button>
        </div>
      ) : null}

      {hydrated && !unlocked && showGate ? (
        <CommunityOnboarding className="mt-4 animate-rise text-left" />
      ) : null}

      {error ? (
        <p role="alert" className="mt-3 text-sm text-danger">
          {error}
        </p>
      ) : null}

      {running ? (
        <div className="surface-card mt-4 animate-rise p-5">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-foreground">{STAGES[stage]}…</span>
            <span className="tabular-nums text-muted-foreground">{progress}%</span>
          </div>
          <Progress value={progress} className="mt-3 h-1.5" />
          <ul className="mt-4 grid gap-1.5 text-xs text-muted-foreground sm:grid-cols-2">
            {STAGES.map((label, index) => (
              <li
                key={label}
                className={cn(
                  "flex items-center gap-2 transition-colors",
                  index <= stage ? "text-foreground" : "opacity-50",
                )}
              >
                <span
                  className={cn(
                    "size-1.5 rounded-full",
                    index < stage ? "bg-success" : index === stage ? "bg-primary" : "bg-border",
                  )}
                />
                {label}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}