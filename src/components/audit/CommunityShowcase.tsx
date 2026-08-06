import { Link } from "@tanstack/react-router";
import { ArrowRight, Users } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { ScoreRing } from "@/components/audit/ScoreRing";
import { Button } from "@/components/ui/button";
import { listAudits, listDirectory, type DirectoryEntry } from "@/lib/audit-history";

export function CommunityShowcase() {
  const [entries, setEntries] = useState<DirectoryEntry[]>([]);
  const [auditCount, setAuditCount] = useState(0);

  useEffect(() => {
    setEntries(listDirectory().slice(0, 6));
    setAuditCount(listAudits().length);
    const sync = () => {
      setEntries(listDirectory().slice(0, 6));
      setAuditCount(listAudits().length);
    };
    window.addEventListener("webaudit:directory", sync);
    window.addEventListener("webaudit:achievements", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("webaudit:directory", sync);
      window.removeEventListener("webaudit:achievements", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const stats = useMemo(() => {
    const directoryCount = entries.length;
    const highScoreCount = entries.filter((e) => e.overallScore >= 80).length;
    return { directoryCount, highScoreCount };
  }, [entries]);

  if (entries.length === 0) {
    return (
      <section className="border-t border-border/60 bg-surface/30 py-20">
        <div className="mx-auto max-w-6xl px-5 text-center">
          <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-primary/10 text-primary">
            <Users className="size-6" aria-hidden />
          </span>
          <h2 className="mt-6 text-3xl font-bold sm:text-4xl">Websites the community is improving</h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            No public audits yet. Be the first to share your report and inspire other builders.
          </p>
          <Button asChild variant="hero" className="mt-6">
            <Link to="/">Run your audit</Link>
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="border-t border-border/60 bg-surface/30 py-20">
      <div className="mx-auto max-w-6xl px-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-3xl font-bold sm:text-4xl">Websites the community is improving</h2>
            <p className="mt-3 max-w-xl text-muted-foreground">
              Public audits shared by the community. {stats.highScoreCount} sites are already scoring 80+.
            </p>
          </div>
          <Button asChild variant="soft">
            <Link to="/directory">
              View directory
              <ArrowRight className="ml-1.5 size-4" aria-hidden />
            </Link>
          </Button>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {entries.map((entry) => (
            <Link
              key={entry.id}
              to="/report/$id"
              params={{ id: entry.id }}
              search={{ d: encodeReportLight(entry) }}
              className="surface-card flex items-center gap-4 p-4 transition-transform duration-200 hover:-translate-y-1"
            >
              <ScoreRing score={entry.overallScore} size={72} />
              <div className="min-w-0 flex-1">
                <h3 className="truncate font-semibold">{entry.hostname}</h3>
                <p className="text-xs text-muted-foreground">
                  {entry.overallScore}/100 · {entry.categories.length} categories
                </p>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-2">
            <Users className="size-4" aria-hidden />
            {stats.directoryCount} sites in the directory
          </span>
          <span className="inline-flex items-center gap-2">
            {auditCount} audits run this session
          </span>
        </div>
      </div>
    </section>
  );
}

function encodeReportLight(entry: DirectoryEntry): string {
  const minimal = {
    id: entry.id,
    url: entry.url,
    title: entry.title,
    createdAt: entry.createdAt,
    overallScore: entry.overallScore,
    executiveSummary: "",
    strengths: [],
    weaknesses: [],
    categories: entry.categories.map((c) => ({
      id: c.id,
      name: c.name,
      score: c.score,
      summary: "",
      findings: [],
      businessImpact: "",
      whyItMatters: "",
      improvements: [],
      difficulty: "Easy",
      priority: "Low",
    })),
    recommendations: [],
    aiPowered: false,
  };

  const json = JSON.stringify(minimal);
  const bytes = new TextEncoder().encode(json);
  let binary = "";
  bytes.forEach((b) => {
    binary += String.fromCharCode(b);
  });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
