import { Link } from "@tanstack/react-router";
import { ExternalLink, Star } from "lucide-react";

import { ScoreBar } from "@/components/audit/ScoreRing";
import { Badge } from "@/components/ui/badge";
import { encodeReport, type DirectoryEntry } from "@/lib/audit-history";
import { scoreTone } from "@/lib/audit-types";
import { cn } from "@/lib/utils";

const TONE_TEXT = {
  success: "text-success",
  warning: "text-warning",
  danger: "text-danger",
} as const;

export function DirectoryCard({ entry }: { entry: DirectoryEntry }) {
  const reportUrl = `/report/${entry.id}?d=${encodeURIComponent(encodeReport({ ...entry, categories: entry.categories.map((c) => ({ ...c, summary: "", findings: [], businessImpact: "", whyItMatters: "", improvements: [], difficulty: "Easy", priority: "Low" })), recommendations: [], strengths: [], weaknesses: [], executiveSummary: "", aiPowered: false } as never))}`;

  return (
    <article className="surface-card flex flex-col p-5 transition-transform duration-200 hover:-translate-y-1">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold">{entry.hostname}</h3>
          <p className="truncate text-xs text-muted-foreground">{entry.title}</p>
        </div>
        <span
          className={cn(
            "font-display text-2xl font-bold tabular-nums",
            TONE_TEXT[scoreTone(entry.overallScore)],
          )}
        >
          {entry.overallScore}
        </span>
      </div>

      <div className="mt-3">
        <ScoreBar score={entry.overallScore} />
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {entry.categories
          .sort((a, b) => b.score - a.score)
          .slice(0, 3)
          .map((cat) => (
            <Badge key={cat.id} variant="secondary" className="text-[10px] font-normal">
              {cat.name} {cat.score}
            </Badge>
          ))}
      </div>

      <div className="mt-5 flex flex-1 items-end justify-between gap-3">
        <Link
          to="/report/$id"
          params={{ id: entry.id }}
          search={{ d: encodeReport({ ...entry, categories: entry.categories.map((c) => ({ ...c, summary: "", findings: [], businessImpact: "", whyItMatters: "", improvements: [], difficulty: "Easy", priority: "Low" })), recommendations: [], strengths: [], weaknesses: [], executiveSummary: "", aiPowered: false } as never) }}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
        >
          View report
          <ExternalLink className="size-3.5" aria-hidden />
        </Link>
        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
          <Star className={cn("size-3.5", entry.favorite && "fill-warning text-warning")} aria-hidden />
          {entry.favorite ? "Community pick" : "Directory entry"}
        </span>
      </div>
    </article>
  );
}
