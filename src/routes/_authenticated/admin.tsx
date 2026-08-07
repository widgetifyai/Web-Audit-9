import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  BarChart3,
  Database,
  Eye,
  EyeOff,
  Globe,
  Loader2,
  LogOut,
  RefreshCw,
  Search,
  Sparkles,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import {
  adminAuditStats,
  adminDeleteAudit,
  adminListAudits,
  adminSetAuditHidden,
  isCurrentUserAdmin,
} from "@/lib/audits.functions";
import { scoreTone } from "@/lib/audit-types";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Admin dashboard | WebAudit" },
      {
        name: "description",
        content: "Monitor and manage every website audit recorded on WebAudit.",
      },
      { property: "og:title", content: "Admin dashboard | WebAudit" },
      { property: "og:description", content: "Manage recorded WebAudit analyses." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminDashboard,
});

const toneClass: Record<string, string> = {
  success: "text-[hsl(var(--success,142_70%_45%))]",
  warning: "text-amber-400",
  danger: "text-destructive",
};

function AdminDashboard() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const checkAdmin = useServerFn(isCurrentUserAdmin);
  const listAudits = useServerFn(adminListAudits);
  const stats = useServerFn(adminAuditStats);
  const setHidden = useServerFn(adminSetAuditHidden);
  const removeAudit = useServerFn(adminDeleteAudit);
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");

  const adminQuery = useQuery({ queryKey: ["is-admin"], queryFn: () => checkAdmin() });
  const statsQuery = useQuery({
    queryKey: ["admin-stats"],
    queryFn: () => stats(),
    enabled: adminQuery.data === true,
  });
  const auditsQuery = useQuery({
    queryKey: ["admin-audits", query],
    queryFn: () => listAudits({ data: { search: query || undefined, limit: 200 } }),
    enabled: adminQuery.data === true,
  });

  const signOut = async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    void navigate({ to: "/auth", replace: true });
  };

  const refresh = () => {
    void queryClient.invalidateQueries({ queryKey: ["admin-audits"] });
    void queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
  };

  if (adminQuery.isLoading) {
    return (
      <div className="grid min-h-screen place-items-center bg-background">
        <Loader2 className="size-6 animate-spin text-muted-foreground" aria-hidden />
      </div>
    );
  }

  if (adminQuery.data !== true) {
    return (
      <div className="grid min-h-screen place-items-center bg-background px-5">
        <div className="max-w-sm text-center">
          <h1 className="font-display text-2xl font-bold">Not an admin account</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            This account doesn't have admin permissions for the audit database.
          </p>
          <Button className="mt-5" variant="soft" onClick={signOut}>
            Sign out
          </Button>
        </div>
      </div>
    );
  }

  const cards = [
    { label: "Audits stored", value: statsQuery.data?.total ?? 0, icon: Database },
    { label: "Unique websites", value: statsQuery.data?.uniqueSites ?? 0, icon: Globe },
    { label: "Average score", value: statsQuery.data?.averageScore ?? 0, icon: BarChart3 },
    { label: "Last 24 hours", value: statsQuery.data?.last24h ?? 0, icon: Sparkles },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/60 bg-card/40 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-4">
          <div>
            <h1 className="font-display text-xl font-bold">Admin dashboard</h1>
            <p className="text-xs text-muted-foreground">Every audit recorded on WebAudit</p>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link to="/">View site</Link>
            </Button>
            <Button variant="soft" size="sm" onClick={refresh}>
              <RefreshCw className="size-4" aria-hidden /> Refresh
            </Button>
            <Button variant="ghost" size="sm" onClick={signOut}>
              <LogOut className="size-4" aria-hidden /> Sign out
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-6 px-5 py-8">
        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card) => (
            <div key={card.label} className="rounded-xl border border-border/60 bg-card/50 p-4">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <card.icon className="size-4" aria-hidden />
                {card.label}
              </div>
              <p className="mt-2 font-display text-3xl font-bold tabular-nums">
                {statsQuery.isLoading ? "—" : card.value}
              </p>
            </div>
          ))}
        </section>

        <form
          className="flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            setQuery(search.trim());
          }}
        >
          <div className="relative flex-1">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by hostname"
              aria-label="Search audits by hostname"
              className="pl-9"
            />
          </div>
          <Button type="submit" variant="soft">
            Search
          </Button>
        </form>

        <section className="overflow-hidden rounded-xl border border-border/60">
          {auditsQuery.isLoading ? (
            <div className="grid place-items-center p-12">
              <Loader2 className="size-5 animate-spin text-muted-foreground" aria-hidden />
            </div>
          ) : auditsQuery.data && auditsQuery.data.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-sm">
                <caption className="sr-only">Recorded website audits</caption>
                <thead className="bg-card/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <tr>
                    <th scope="col" className="px-4 py-3">Website</th>
                    <th scope="col" className="px-4 py-3">Score</th>
                    <th scope="col" className="px-4 py-3">Engine</th>
                    <th scope="col" className="px-4 py-3">Recorded</th>
                    <th scope="col" className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {auditsQuery.data.map((audit) => (
                    <tr key={audit.id} className="border-t border-border/50">
                      <td className="px-4 py-3">
                        <Link
                          to="/report/$id"
                          params={{ id: audit.id }}
                          className="font-medium hover:underline"
                        >
                          {audit.hostname}
                        </Link>
                        <p className="max-w-xs truncate text-xs text-muted-foreground">
                          {audit.title || audit.url}
                        </p>
                      </td>
                      <td
                        className={`px-4 py-3 font-display text-base font-bold tabular-nums ${toneClass[scoreTone(audit.overallScore)]}`}
                      >
                        {audit.overallScore}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="secondary">
                          {audit.aiPowered ? "GPT-5.6-Sol" : "Heuristics"}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">
                        {new Date(audit.createdAt).toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            aria-label={audit.hidden ? "Unhide audit" : "Hide audit"}
                            onClick={async () => {
                              await setHidden({ data: { id: audit.id, hidden: !audit.hidden } });
                              toast.success(audit.hidden ? "Audit is public again" : "Audit hidden");
                              refresh();
                            }}
                          >
                            {audit.hidden ? (
                              <EyeOff className="size-4" aria-hidden />
                            ) : (
                              <Eye className="size-4" aria-hidden />
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            aria-label="Delete audit"
                            onClick={async () => {
                              if (!window.confirm(`Delete the audit for ${audit.hostname}?`)) return;
                              await removeAudit({ data: { id: audit.id } });
                              toast.success("Audit deleted");
                              refresh();
                            }}
                          >
                            <Trash2 className="size-4 text-destructive" aria-hidden />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center">
              <p className="font-display text-lg font-semibold">No audits recorded yet</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Completed analyses will appear here automatically.
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
