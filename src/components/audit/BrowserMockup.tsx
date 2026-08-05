import { ScoreBar } from "@/components/audit/ScoreRing";
import { SAMPLE_REPORT } from "@/lib/sample-report";
import { scoreTone } from "@/lib/audit-types";
import { cn } from "@/lib/utils";

const TONE_TEXT = {
  success: "text-success",
  warning: "text-warning",
  danger: "text-danger",
} as const;

export function BrowserMockup() {
  const categories = SAMPLE_REPORT.categories.slice(0, 6);
  return (
    <div className="surface-card overflow-hidden shadow-[var(--shadow-elegant)]">
      <div className="flex items-center gap-2 border-b border-border/60 bg-surface-2/60 px-4 py-3">
        <span className="size-2.5 rounded-full bg-danger/70" />
        <span className="size-2.5 rounded-full bg-warning/70" />
        <span className="size-2.5 rounded-full bg-success/70" />
        <div className="ml-3 flex-1 truncate rounded-lg bg-background/70 px-3 py-1 text-xs text-muted-foreground">
          webaudit.app/report/northstar-supply
        </div>
      </div>

      <div className="grid gap-5 p-5 sm:grid-cols-[auto_minmax(0,1fr)] sm:items-center">
        <div className="flex flex-col items-center justify-center rounded-2xl bg-surface-2/50 p-5">
          <span className="font-display text-5xl font-bold text-warning tabular-nums">68</span>
          <span className="mt-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            Overall score
          </span>
        </div>
        <div className="grid gap-2.5">
          {categories.map((c) => (
            <div key={c.id} className="grid grid-cols-[minmax(0,1fr)_2.5rem] items-center gap-3">
              <div className="min-w-0">
                <p className="truncate text-xs text-muted-foreground">{c.name}</p>
                <div className="mt-1.5">
                  <ScoreBar score={c.score} />
                </div>
              </div>
              <span
                className={cn(
                  "text-right text-sm font-semibold tabular-nums",
                  TONE_TEXT[scoreTone(c.score)],
                )}
              >
                {c.score}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-border/60 px-5 py-4">
        <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          Top recommendation
        </p>
        <p className="mt-1.5 text-sm font-medium">Compress the hero imagery</p>
        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
          Roughly 2–3 seconds faster load and a noticeable drop in bounce rate.
        </p>
      </div>
    </div>
  );
}