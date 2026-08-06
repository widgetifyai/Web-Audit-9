import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  Bookmark,
  Check,
  Copy,
  Download,
  Eye,
  Printer,
  Share2,
  Sparkles,
  Star,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { DifficultyBadge, PriorityBadge } from "@/components/audit/PriorityBadge";
import { ReAuditPrompt } from "@/components/audit/ReAuditPrompt";
import { ScoreBar, ScoreRing } from "@/components/audit/ScoreRing";
import { ShareKit } from "@/components/audit/ShareKit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  addToDirectory,
  encodeReport,
  getScoreTrend,
  isInDirectory,
  listAudits,
  listFavorites,
  toggleFavorite,
} from "@/lib/audit-history";
import { PRIORITY_ORDER, scoreLabel, scoreTone, type AuditReport } from "@/lib/audit-types";
import { evaluateAuditAchievements, unlockAndNotify } from "@/lib/growth";
import { cn } from "@/lib/utils";

const TONE_TEXT = {
  success: "text-success",
  warning: "text-warning",
  danger: "text-danger",
} as const;

export function ReportView({ report }: { report: AuditReport }) {
  const [favorites, setFavorites] = useState<string[]>(() => listFavorites());
  const [shareOpen, setShareOpen] = useState(false);
  const [inDirectory, setInDirectory] = useState(() => isInDirectory(report.id));
  const [badgeCopied, setBadgeCopied] = useState(false);
  const isFavorite = favorites.includes(report.id);
  const hostname = (() => {
    try {
      return new URL(report.url).hostname;
    } catch {
      return report.url;
    }
  })();

  const trend = useMemo(() => getScoreTrend(hostname), [hostname]);
  const badgeSnippet = useMemo(
    () =>
      `<a href="${typeof window !== "undefined" ? window.location.origin : ""}/report/${report.id}?d=${encodeReport(report)}" target="_blank" rel="noopener"><img src="${typeof window !== "undefined" ? window.location.origin : ""}/api/public/badge/${report.id}?d=${encodeReport(report)}" alt="WebAudit score: ${report.overallScore}/100" /></a>`,
    [report],
  );

  useEffect(() => {
    const auditCount = listAudits().length;
    const newIds = evaluateAuditAchievements(report, auditCount);
    newIds.forEach((id) => unlockAndNotify(id));
  }, [report]);

  const sortedRecommendations = [...report.recommendations].sort(
    (a, b) => (PRIORITY_ORDER[a.priority] ?? 3) - (PRIORITY_ORDER[b.priority] ?? 3),
  );

  const copyRecommendations = async () => {
    const text = sortedRecommendations
      .map(
        (r, i) =>
          `${i + 1}. [${r.priority}] ${r.title}\nProblem: ${r.problem}\nWhy: ${r.explanation}\nFix: ${r.solution}\nExpected: ${r.expectedImprovement}\nTime: ${r.timeToFix}`,
      )
      .join("\n\n");
    await navigator.clipboard.writeText(text);
    toast.success("Recommendations copied to your clipboard");
  };

  const toggleDirectory = () => {
    if (inDirectory) {
      import("@/lib/audit-history").then(({ removeFromDirectory }) => {
        removeFromDirectory(report.id);
        setInDirectory(false);
        toast.success("Removed from public directory");
      });
    } else {
      addToDirectory(report);
      setInDirectory(true);
      unlockAndNotify("directory-contributor");
      toast.success("Added to public directory", {
        description: "Your audit is now discoverable by the community.",
      });
    }
  };

  const copyBadge = async () => {
    await navigator.clipboard.writeText(badgeSnippet);
    setBadgeCopied(true);
    toast.success("Badge embed code copied");
    setTimeout(() => setBadgeCopied(false), 2000);
  };

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <div className="no-print mb-6 flex items-center justify-between gap-4">
        <Button asChild variant="ghost" size="sm">
          <Link to="/">
            <ArrowLeft className="size-4" aria-hidden />
            New audit
          </Link>
        </Button>
        <div className="flex flex-wrap items-center justify-end gap-2">
          <Button
            variant="soft"
            size="sm"
            onClick={() => setFavorites(toggleFavorite(report.id))}
            aria-pressed={isFavorite}
          >
            <Star className={cn("size-4", isFavorite && "fill-warning text-warning")} aria-hidden />
            {isFavorite ? "Saved" : "Save"}
          </Button>
          <Button variant="soft" size="sm" onClick={copyRecommendations}>
            <Copy className="size-4" aria-hidden />
            Copy
          </Button>
          <Dialog open={shareOpen} onOpenChange={setShareOpen}>
            <DialogTrigger asChild>
              <Button variant="soft" size="sm">
                <Share2 className="size-4" aria-hidden />
                Share
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Share this audit</DialogTitle>
              </DialogHeader>
              <ShareKit report={report} onClose={() => setShareOpen(false)} />
            </DialogContent>
          </Dialog>
          <Button variant="soft" size="sm" onClick={() => window.print()}>
            <Printer className="size-4" aria-hidden />
            Print
          </Button>
          <Button variant="hero" size="sm" onClick={() => window.print()}>
            <Download className="size-4" aria-hidden />
            Download PDF
          </Button>
        </div>
      </div>

      <section className="surface-card animate-rise overflow-hidden">
        <div className="hero-glow grid gap-8 p-8 md:grid-cols-[auto_minmax(0,1fr)] md:items-center md:p-10">
          <div className="flex justify-center">
            <ScoreRing score={report.overallScore} size={200} />
          </div>
          <div className="min-w-0">
            {report.aiPowered ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                <Sparkles className="size-3" aria-hidden />
                Analysis by GPT-5.6-Sol
              </span>
            ) : null}
            <h1 className="mt-3 truncate text-3xl font-bold sm:text-4xl">{hostname}</h1>
            <p className="mt-1 truncate text-sm text-muted-foreground">{report.url}</p>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
              Overall health is{" "}
              <span className={cn("font-semibold", TONE_TEXT[scoreTone(report.overallScore)])}>
                {scoreLabel(report.overallScore).toLowerCase()}
              </span>
              . Audited {new Date(report.createdAt).toLocaleString()}.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {report.categories.map((category, index) => (
          <div
            key={category.id}
            className="surface-card animate-rise p-5 transition-transform duration-200 hover:-translate-y-1"
            style={{ animationDelay: `${index * 45}ms` }}
          >
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-sm font-semibold">{category.name}</h3>
              <span
                className={cn(
                  "font-display text-2xl font-bold tabular-nums",
                  TONE_TEXT[scoreTone(category.score)],
                )}
              >
                {category.score}
              </span>
            </div>
            <div className="mt-3">
              <ScoreBar score={category.score} />
            </div>
            <p className="mt-3 line-clamp-3 text-xs leading-relaxed text-muted-foreground">
              {category.summary}
            </p>
            <div className="mt-3">
              <PriorityBadge priority={category.priority} />
            </div>
          </div>
        ))}
      </section>

      <section className="surface-card mt-6 p-8">
        <h2 className="text-xl font-bold">Executive summary</h2>
        <p className="mt-3 max-w-4xl text-base leading-relaxed text-muted-foreground">
          {report.executiveSummary}
        </p>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div>
            <h3 className="flex items-center gap-2 text-sm font-semibold text-success">
              <TrendingUp className="size-4" aria-hidden />
              What's working
            </h3>
            <ul className="mt-3 space-y-2">
              {report.strengths.map((item) => (
                <li key={item} className="flex gap-2 text-sm text-muted-foreground">
                  <Check className="mt-0.5 size-4 shrink-0 text-success" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="flex items-center gap-2 text-sm font-semibold text-danger">
              <TrendingDown className="size-4" aria-hidden />
              What's holding you back
            </h3>
            <ul className="mt-3 space-y-2">
              {report.weaknesses.map((item) => (
                <li key={item} className="flex gap-2 text-sm text-muted-foreground">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-danger" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="surface-card mt-6 p-6 no-print">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex-1">
            <h2 className="flex items-center gap-2 text-lg font-bold">
              <Eye className="size-5 text-primary" aria-hidden />
              Grow this audit
            </h2>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">
              Add this report to the public directory, embed a score badge, or share it with your community to drive discovery.
            </p>
            <ReAuditPrompt hostname={hostname} />
          </div>
          <div className="flex min-w-[18rem] flex-col gap-4">
            <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-surface-2 p-4">
              <div className="flex items-center gap-3">
                <Bookmark className={cn("size-5", inDirectory ? "fill-primary text-primary" : "text-muted-foreground")} aria-hidden />
                <div>
                  <Label htmlFor="directory-toggle" className="text-sm font-semibold">
                    Public directory
                  </Label>
                  <p className="text-xs text-muted-foreground">{inDirectory ? "Listed" : "Not listed"}</p>
                </div>
              </div>
              <Switch
                id="directory-toggle"
                checked={inDirectory}
                onCheckedChange={toggleDirectory}
                aria-label="Add to public directory"
              />
            </div>
            <div className="rounded-xl border border-border bg-surface-2 p-4">
              <Label className="text-sm font-semibold">Score badge</Label>
              <div className="mt-2 flex items-center gap-2">
                <Input readOnly value={badgeSnippet} className="h-9 text-[10px]" />
                <Button size="icon" variant="soft" onClick={copyBadge} aria-label="Copy badge code">
                  {badgeCopied ? <Check className="size-4 text-success" /> : <Copy className="size-4" />}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Tabs defaultValue="recommendations" className="mt-8">
        <TabsList className="no-print">
          <TabsTrigger value="recommendations">AI recommendations</TabsTrigger>
          <TabsTrigger value="detail">Detailed analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="recommendations" className="mt-5 space-y-4">
          {sortedRecommendations.map((rec, index) => (
            <article key={`${rec.title}-${index}`} className="surface-card p-6">
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4">
                <h3 className="text-lg font-semibold">{rec.title}</h3>
                <PriorityBadge priority={rec.priority} />
              </div>
              <dl className="mt-4 grid gap-4 md:grid-cols-2">
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Problem
                  </dt>
                  <dd className="mt-1 text-sm leading-relaxed">{rec.problem}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Why it happens
                  </dt>
                  <dd className="mt-1 text-sm leading-relaxed">{rec.explanation}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Suggested solution
                  </dt>
                  <dd className="mt-1 text-sm leading-relaxed">{rec.solution}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Expected improvement
                  </dt>
                  <dd className="mt-1 text-sm leading-relaxed text-success">
                    {rec.expectedImprovement}
                  </dd>
                </div>
              </dl>
              <p className="mt-4 text-xs text-muted-foreground">
                Estimated time to fix: <span className="text-foreground">{rec.timeToFix}</span>
              </p>
            </article>
          ))}
        </TabsContent>

        <TabsContent value="detail" className="mt-5">
          <Accordion type="multiple" className="space-y-3">
            {report.categories.map((category) => (
              <AccordionItem
                key={category.id}
                value={category.id}
                className="surface-card border-b-0 px-6"
              >
                <AccordionTrigger className="py-5 hover:no-underline">
                  <div className="grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-4 pr-3 text-left">
                    <span className="truncate text-base font-semibold">{category.name}</span>
                    <span
                      className={cn(
                        "font-display text-xl font-bold tabular-nums",
                        TONE_TEXT[scoreTone(category.score)],
                      )}
                    >
                      {category.score}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-6">
                  <div className="flex flex-wrap gap-2">
                    <PriorityBadge priority={category.priority} />
                    <DifficultyBadge difficulty={category.difficulty} />
                  </div>
                  <div className="mt-5 grid gap-5 md:grid-cols-2">
                    <div>
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Findings
                      </h4>
                      <ul className="mt-2 space-y-1.5">
                        {category.findings.map((f) => (
                          <li key={f} className="flex gap-2 text-sm text-muted-foreground">
                            <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent" />
                            {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Recommended improvements
                      </h4>
                      <ul className="mt-2 space-y-1.5">
                        {category.improvements.map((f) => (
                          <li key={f} className="flex gap-2 text-sm text-muted-foreground">
                            <Check className="mt-0.5 size-4 shrink-0 text-success" aria-hidden />
                            {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Business impact
                      </h4>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        {category.businessImpact}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Why it matters
                      </h4>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        {category.whyItMatters}
                      </p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </TabsContent>
      </Tabs>
    </div>
  );
}