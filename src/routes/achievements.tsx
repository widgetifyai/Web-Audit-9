import { Link, createFileRoute } from "@tanstack/react-router";
import { Award, RotateCcw, Trophy } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { SiteFooter } from "@/components/audit/SiteFooter";
import { SiteHeader } from "@/components/audit/SiteHeader";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { ACHIEVEMENTS, listUnlocked, resetAchievements, type UnlockedAchievement } from "@/lib/growth";
import { cn } from "@/lib/utils";

const TITLE = "Achievements — WebAudit";
const DESCRIPTION =
  "Track your WebAudit milestones, from your first audit to becoming a community champion.";

export const Route = createFileRoute("/achievements")({
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
  component: AchievementsPage,
});

function AchievementsPage() {
  const [unlocked, setUnlocked] = useState<UnlockedAchievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setUnlocked(listUnlocked());
    setLoading(false);
    const sync = () => setUnlocked(listUnlocked());
    window.addEventListener("webaudit:achievements", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("webaudit:achievements", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const unlockedIds = useMemo(() => new Set(unlocked.map((u) => u.id)), [unlocked]);
  const percent = Math.round((unlockedIds.size / ACHIEVEMENTS.length) * 100);

  return (
    <div className="min-h-dvh">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-5 py-12">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold sm:text-4xl">Achievements</h1>
            <p className="mt-2 max-w-xl text-muted-foreground">
              Every audit, share, and community action moves you forward. Unlock them all.
            </p>
          </div>
          <Button variant="soft" size="sm" onClick={() => setUnlocked(resetAchievements() ?? [])}>
            <RotateCcw className="mr-2 size-4" aria-hidden />
            Reset progress
          </Button>
        </div>

        <section className="surface-card mt-8 p-6">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <span className="grid size-14 place-items-center rounded-2xl bg-primary/10 text-primary">
                <Trophy className="size-7" aria-hidden />
              </span>
              <div>
                <p className="text-sm text-muted-foreground">Your progress</p>
                <p className="text-2xl font-bold">
                  {unlockedIds.size} <span className="text-muted-foreground">/ {ACHIEVEMENTS.length}</span>
                </p>
              </div>
            </div>
            <div className="flex-1 sm:max-w-md">
              <Progress value={percent} className="h-2" />
              <p className="mt-2 text-right text-xs text-muted-foreground">{percent}% complete</p>
            </div>
          </div>
        </section>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-48 rounded-2xl" />)
            : ACHIEVEMENTS.map((achievement) => {
                const isLocked = !unlockedIds.has(achievement.id);
                const unlockedAt = unlocked.find((u) => u.id === achievement.id)?.unlockedAt;
                const Icon = achievement.icon;
                return (
                  <div
                    key={achievement.id}
                    className={cn(
                      "surface-card flex flex-col p-6 transition-opacity",
                      isLocked && "opacity-60 grayscale",
                    )}
                  >
                    <span
                      className={cn(
                        "grid size-12 place-items-center rounded-xl",
                        isLocked ? "bg-surface-2 text-muted-foreground" : "bg-primary/10 text-primary",
                      )}
                    >
                      <Icon className="size-6" aria-hidden />
                    </span>
                    <h3 className="mt-4 text-base font-semibold">{achievement.name}</h3>
                    <p className="mt-1 flex-1 text-sm text-muted-foreground">{achievement.description}</p>
                    {isLocked ? (
                      <p className="mt-4 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                        <Award className="size-3.5" aria-hidden />
                        Locked
                      </p>
                    ) : (
                      <p className="mt-4 text-xs font-medium text-success">
                        Unlocked {unlockedAt ? new Date(unlockedAt).toLocaleDateString() : ""}
                      </p>
                    )}
                  </div>
                );
              })}
        </div>

        <div className="mt-12 text-center">
          <Button asChild variant="hero">
            <Link to="/">Run your next audit</Link>
          </Button>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
