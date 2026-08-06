import { Award } from "lucide-react";
import { useEffect, useState } from "react";

import { getAchievement, listUnlocked, type AchievementId } from "@/lib/growth";

export function AchievementToast() {
  const [recent, setRecent] = useState<AchievementId | null>(null);

  useEffect(() => {
    const initial = new Set(listUnlocked().map((u) => u.id));

    const handler = (event: Event) => {
      const detail = (event as CustomEvent).detail as AchievementId | undefined;
      if (detail && !initial.has(detail)) {
        setRecent(detail);
        window.setTimeout(() => setRecent(null), 5000);
      }
    };

    window.addEventListener("webaudit:achievement-unlocked", handler);
    return () => window.removeEventListener("webaudit:achievement-unlocked", handler);
  }, []);

  if (!recent) return null;

  const achievement = getAchievement(recent);
  if (!achievement) return null;

  const Icon = achievement.icon;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-rise">
      <div className="surface-card flex max-w-sm items-center gap-4 border border-primary/20 p-4 shadow-xl">
        <span className="grid size-12 place-items-center rounded-xl bg-primary/10 text-primary">
          <Icon className="size-6" aria-hidden />
        </span>
        <div>
          <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
            <Award className="size-3.5" aria-hidden />
            Achievement unlocked
          </p>
          <h4 className="mt-0.5 font-semibold">{achievement.name}</h4>
          <p className="text-xs text-muted-foreground">{achievement.description}</p>
        </div>
      </div>
    </div>
  );
}
