import { Link, createFileRoute } from "@tanstack/react-router";
import { Crown, History, Search, Star, TrendingUp } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { DirectoryCard } from "@/components/audit/DirectoryCard";
import { SiteFooter } from "@/components/audit/SiteFooter";
import { SiteHeader } from "@/components/audit/SiteHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { listDirectory, type DirectoryEntry } from "@/lib/audit-history";

const TITLE = "Website Audit Directory — WebAudit";
const DESCRIPTION =
  "Discover websites the WebAudit community has audited. Browse top scores, recent submissions, and most-improved sites.";

type Tab = "recent" | "top" | "improved" | "favorites";

export const Route = createFileRoute("/directory")({
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
  component: DirectoryPage,
});

function DirectoryPage() {
  const [entries, setEntries] = useState<DirectoryEntry[]>([]);
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<Tab>("recent");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setEntries(listDirectory());
    setLoading(false);
    const sync = () => setEntries(listDirectory());
    window.addEventListener("webaudit:directory", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("webaudit:directory", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = entries;
    if (q) {
      list = entries.filter(
        (e) =>
          e.hostname.toLowerCase().includes(q) ||
          e.title.toLowerCase().includes(q) ||
          e.categories.some((c) => c.name.toLowerCase().includes(q)),
      );
    }

    switch (tab) {
      case "top":
        return [...list].sort((a, b) => b.overallScore - a.overallScore);
      case "improved":
        return [...list].filter((e) => e.favorite).sort((a, b) => b.overallScore - a.overallScore);
      case "favorites":
        return [...list].filter((e) => e.favorite);
      case "recent":
      default:
        return [...list].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
  }, [entries, query, tab]);

  const counts = {
    recent: entries.length,
    top: entries.length,
    improved: entries.filter((e) => e.favorite).length,
    favorites: entries.filter((e) => e.favorite).length,
  };

  return (
    <div className="min-h-dvh">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-5 py-12">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold sm:text-4xl">Audit directory</h1>
            <p className="mt-2 max-w-xl text-muted-foreground">
              Websites the community has chosen to share. Discover top performers, recent submissions, and
              inspiration for your own site.
            </p>
          </div>
          <Button asChild variant="hero">
            <Link to="/">Audit your site</Link>
          </Button>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto]">
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by website or category"
              aria-label="Search directory"
              className="h-11 rounded-xl pl-9"
            />
          </div>
        </div>

        <Tabs value={tab} onValueChange={(v) => setTab(v as Tab)} className="mt-6">
          <TabsList>
            <TabsTrigger value="recent" className="gap-2">
              <History className="size-4" aria-hidden />
              Recent
              <Badge variant="secondary" className="ml-1 px-1.5 py-0 text-[10px]">
                {counts.recent}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="top" className="gap-2">
              <Crown className="size-4" aria-hidden />
              Top scores
              <Badge variant="secondary" className="ml-1 px-1.5 py-0 text-[10px]">
                {counts.top}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="improved" className="gap-2">
              <TrendingUp className="size-4" aria-hidden />
              Community picks
              <Badge variant="secondary" className="ml-1 px-1.5 py-0 text-[10px]">
                {counts.improved}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="favorites" className="gap-2">
              <Star className="size-4" aria-hidden />
              Favorites
              <Badge variant="secondary" className="ml-1 px-1.5 py-0 text-[10px]">
                {counts.favorites}
              </Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value={tab} className="mt-5">
            {loading ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-56 w-full rounded-2xl" />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="surface-card px-6 py-16 text-center">
                <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-surface-2 text-muted-foreground">
                  <Search className="size-6" aria-hidden />
                </span>
                <h2 className="mt-6 text-xl font-semibold">
                  {entries.length === 0 ? "The directory is empty" : "Nothing matches that search"}
                </h2>
                <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
                  {entries.length === 0
                    ? "Be the first to add a report to the directory from any audit report page."
                    : "Try a different website address or switch tabs."}
                </p>
                {entries.length === 0 ? (
                  <Button asChild variant="hero" className="mt-6">
                    <Link to="/">Run an audit</Link>
                  </Button>
                ) : null}
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((entry) => (
                  <DirectoryCard key={entry.id} entry={entry} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
      <SiteFooter />
    </div>
  );
}
