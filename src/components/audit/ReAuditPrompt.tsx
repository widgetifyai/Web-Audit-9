import { Link } from "@tanstack/react-router";
import { RefreshCw, TrendingDown, TrendingUp } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getScoreTrend, isDueForReAudit } from "@/lib/audit-history";
import { cn } from "@/lib/utils";

interface ReAuditPromptProps {
  hostname: string;
  url: string;
}

export function ReAuditPrompt({ hostname, url }: ReAuditPromptProps) {
  const due = isDueForReAudit(hostname);
  const trend = getScoreTrend(hostname);

  if (!due && trend.change === null) return null;

  return (
    <div className="surface-card flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h3 className="font-semibold">{hostname}</h3>
        {trend.change !== null ? (
          <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
            {trend.change >= 0 ? (
              <>
                <TrendingUp className="size-4 text-success" aria-hidden />
                <span className="text-success">+{trend.change} points</span>
              </>
            ) : (
              <>
                <TrendingDown className="size-4 text-danger" aria-hidden />
                <span className="text-danger">{trend.change} points</span>
              </>
            )}
            {" "}since the last audit
          </p>
        ) : (
          <p className="mt-1 text-sm text-muted-foreground">
            Last audit was over 30 days ago. A lot can change.
          </p>
        )}
      </div>
      <Button asChild variant="hero" size="sm">
        <Link to="/" search={{ url }}>
          <RefreshCw className="mr-1.5 size-4" aria-hidden />
          Re-audit now
        </Link>
      </Button>
    </div>
  );
}
