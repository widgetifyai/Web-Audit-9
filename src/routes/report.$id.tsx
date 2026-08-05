import { Link, createFileRoute, useParams, useSearch } from "@tanstack/react-router";
import { FileSearch } from "lucide-react";
import { useEffect, useState } from "react";

import { ReportView } from "@/components/audit/ReportView";
import { SiteFooter } from "@/components/audit/SiteFooter";
import { SiteHeader } from "@/components/audit/SiteHeader";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { decodeReport, getAudit } from "@/lib/audit-history";
import type { AuditReport } from "@/lib/audit-types";
import { SAMPLE_REPORT } from "@/lib/sample-report";

const TITLE = "Website Audit Report — WebAudit";
const DESCRIPTION =
  "A full WebAudit audit report with overall score, category breakdown, executive summary and prioritised AI recommendations.";

export const Route = createFileRoute("/report/$id")({
  validateSearch: (search: Record<string, unknown>): { d?: string } =>
    typeof search["d"] === "string" ? { d: search["d"] as string } : {},
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ReportPage,
});

function ReportSkeleton() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <Skeleton className="h-56 w-full rounded-2xl" />
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-36 rounded-2xl" />
        ))}
      </div>
      <Skeleton className="mt-6 h-52 w-full rounded-2xl" />
    </div>
  );
}

function ReportPage() {
  const { id } = useParams({ from: "/report/$id" });
  const { d } = useSearch({ from: "/report/$id" });
  const [report, setReport] = useState<AuditReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id === "sample") {
      setReport(SAMPLE_REPORT);
    } else if (d) {
      setReport(decodeReport(d) ?? getAudit(id));
    } else {
      setReport(getAudit(id));
    }
    setLoading(false);
  }, [id, d]);

  return (
    <div className="min-h-dvh">
      <SiteHeader />
      <main>
        {loading ? (
          <ReportSkeleton />
        ) : report ? (
          <ReportView report={report} />
        ) : (
          <div className="mx-auto max-w-md px-5 py-24 text-center">
            <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-surface-2 text-muted-foreground">
              <FileSearch className="size-6" aria-hidden />
            </span>
            <h1 className="mt-6 text-2xl font-bold">Report not found</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              This report isn't saved in this browser. Reports are stored locally, so a link
              without share data won't open on another device.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Button asChild variant="hero">
                <Link to="/">Run a new audit</Link>
              </Button>
              <Button asChild variant="soft">
                <Link to="/report/$id" params={{ id: "sample" }}>
                  View sample
                </Link>
              </Button>
            </div>
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}