import { Award, Lock } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ACHIEVEMENTS, listUnlocked, type AchievementId } from "@/lib/growth";
import { cn } from "@/lib/utils";

export function AchievementsWidget({ className }: { className?: string }) {
  const [unlocked, setUnlocked] = useState<AchievementId[]>([]);

  useEffect(() => {
    setUnlocked(listUnlocked().map((u) => u.id));
    const handler = () => setUnlocked(listUnlocked().map((u) => u.id));
    window.addEventListener("webaudit:achievements", handler);
    return () => window.removeEventListener("webaudit:achievements", handler);
  }, []);

  const progress = Math.round((unlocked.length / ACHIEVEMENTS.length) * 100);

  return (
    <div className={cn("surface-card p-5", className)}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">
            <Award className="size-5" aria-hidden />
          </span>
          <div>
            <h3 className="font-semibold">Achievements</h3>
            <p className="text-xs text-muted-foreground">
              {unlocked.length} of {ACHIEVEMENTS.length} unlocked
            </p>
          </div>
        </div>
        <Button asChild variant="soft" size="sm">
          <a href="/achievements">View all</a>
        </Button>
      </div>
      <div className="mt-4">
        <Progress value={progress} className="h-2" />
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {ACHIEVEMENTS.slice(0, 5).map((a) => {
          const Icon = a.icon;
          const done = unlocked.includes(a.id);
          return (
            <span
              key={a.id}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
                done
                  ? "border-primary/30 bg-primary/10 text-primary"
                  : "border-border bg-surface-2 text-muted-foreground",
              )}
              title={a.description}
            >
              {done ? <Icon className="size-3" aria-hidden /> : <Lock className="size-3" aria-hidden />}
              {a.name}
            </span>
          );
        })}
      </div>
    </div>
  );
}
