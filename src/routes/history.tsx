import { Link, createFileRoute } from "@tanstack/react-router";
import { History, Search, Star, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { AchievementsWidget } from "@/components/audit/AchievementsWidget";
import { ReAuditPrompt } from "@/components/audit/ReAuditPrompt";
import { ScoreBar } from "@/components/audit/ScoreRing";
import { SiteFooter } from "@/components/audit/SiteFooter";
import { SiteHeader } from "@/components/audit/SiteHeader";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { deleteAudit, listAudits, listFavorites, toggleFavorite } from "@/lib/audit-history";
import { scoreTone, type AuditReport } from "@/lib/audit-types";
import { cn } from "@/lib/utils";

const TITLE = "Audit History — WebAudit";
const DESCRIPTION =
  "Browse, search, favourite and compare every website audit you've run with WebAudit.";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HistoryPage,
});

const TONE_TEXT = {
  success: "text-success",
  warning: "text-warning",
  danger: "text-danger",
} as const;

function HistoryPage() {
  const [audits, setAudits] = useState<AuditReport[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [compare, setCompare] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setAudits(listAudits());
    setFavorites(listFavorites());
    setLoading(false);
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return audits.filter((a) => {
      if (onlyFavorites && !favorites.includes(a.id)) return false;
      if (!q) return true;
      return `${a.url} ${a.title}`.toLowerCase().includes(q);
    });
  }, [audits, favorites, onlyFavorites, query]);

  const comparing = audits.filter((a) => compare.includes(a.id));

  const toggleCompare = (id: string) => {
    setCompare((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id].slice(-3),
    );
  };

  return (
    <div className="min-h-dvh">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-5 py-12">
        <h1 className="text-3xl font-bold sm:text-4xl">Audit history</h1>
        <p className="mt-2 text-muted-foreground">
          Every report you've run, stored privately in this browser.
        </p>

        <AchievementsWidget className="mt-6" />

        <div className="mt-6 grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by website address"
              aria-label="Search reports"
              className="h-11 rounded-xl pl-9"
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <Checkbox
              checked={onlyFavorites}
              onCheckedChange={(v) => setOnlyFavorites(v === true)}
            />
            Favourites only
          </label>
        </div>

        {comparing.length >= 2 ? (
          <section className="surface-card mt-6 animate-rise p-6">
            <h2 className="text-lg font-semibold">Comparison</h2>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[520px] text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground">
                    <th className="pb-3 pr-4 font-semibold">Category</th>
                    {comparing.map((a) => (
                      <th key={a.id} className="pb-3 pr-4 font-semibold">
                        {new URL(a.url).hostname}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-border">
                    <td className="py-3 pr-4 font-semibold">Overall</td>
                    {comparing.map((a) => (
                      <td
                        key={a.id}
                        className={cn("py-3 pr-4 font-bold tabular-nums", TONE_TEXT[scoreTone(a.overallScore)])}
                      >
                        {a.overallScore}
                      </td>
                    ))}
                  </tr>
                  {(comparing[0]?.categories ?? []).map((cat, index) => (
                    <tr key={cat.id} className="border-t border-border/60">
                      <td className="py-2.5 pr-4 text-muted-foreground">{cat.name}</td>
                      {comparing.map((a) => {
                        const score = a.categories[index]?.score ?? 0;
                        return (
                          <td
                            key={a.id}
                            className={cn("py-2.5 pr-4 tabular-nums", TONE_TEXT[scoreTone(score)])}
                          >
                            {score}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ) : null}

        <div className="mt-6 space-y-3">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-28 w-full rounded-2xl" />
            ))
          ) : filtered.length === 0 ? (
            <div className="surface-card px-6 py-16 text-center">
              <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-surface-2 text-muted-foreground">
                <History className="size-6" aria-hidden />
              </span>
              <h2 className="mt-6 text-xl font-semibold">
                {audits.length === 0 ? "No audits yet" : "Nothing matches that search"}
              </h2>
              <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
                {audits.length === 0
                  ? "Run your first audit and it will appear here, ready to revisit and compare."
                  : "Try a different website address or clear the favourites filter."}
              </p>
              {audits.length === 0 ? (
                <Button asChild variant="hero" className="mt-6">
                  <Link to="/">Start a free audit</Link>
                </Button>
              ) : null}
            </div>
          ) : (
            filtered.map((audit) => (
              <article
                key={audit.id}
                className="surface-card grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 p-5 transition-transform duration-200 hover:-translate-y-0.5"
              >
                <div className="min-w-0">
                  <div className="flex min-w-0 items-center gap-3">
                    <span
                      className={cn(
                        "font-display text-2xl font-bold tabular-nums",
                        TONE_TEXT[scoreTone(audit.overallScore)],
                      )}
                    >
                      {audit.overallScore}
                    </span>
                    <Link
                      to="/report/$id"
                      params={{ id: audit.id }}
                      className="truncate font-semibold hover:text-primary"
                    >
                      {new URL(audit.url).hostname}
                    </Link>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {new Date(audit.createdAt).toLocaleString()}
                  </p>
                  <div className="mt-3 max-w-sm">
                    <ScoreBar score={audit.overallScore} />
                  </div>
                  <div className="mt-3">
                    <ReAuditPrompt hostname={new URL(audit.url).hostname} url={audit.url} />
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <label className="mr-2 flex items-center gap-2 text-xs text-muted-foreground">
                    <Checkbox
                      checked={compare.includes(audit.id)}
                      onCheckedChange={() => toggleCompare(audit.id)}
                      aria-label={`Compare ${audit.url}`}
                    />
                    Compare
                  </label>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Save to favourites"
                    onClick={() => setFavorites(toggleFavorite(audit.id))}
                  >
                    <Star
                      className={cn(
                        "size-4",
                        favorites.includes(audit.id) && "fill-warning text-warning",
                      )}
                      aria-hidden
                    />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Delete report"
                    onClick={() => {
                      deleteAudit(audit.id);
                      setAudits(listAudits());
                    }}
                  >
                    <Trash2 className="size-4" aria-hidden />
                  </Button>
                </div>
              </article>
            ))
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}