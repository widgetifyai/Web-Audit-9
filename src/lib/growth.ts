import {
  Award,
  Bookmark,
  Heart,
  Medal,
  RefreshCw,
  Share2,
  Star,
  Target,
  Trophy,
  type LucideIcon,
} from "lucide-react";

export type AchievementId =
  | "first-audit"
  | "community-champion"
  | "score-hunter"
  | "sharpshooter"
  | "high-performer"
  | "comeback"
  | "directory-contributor"
  | "regular";

export interface Achievement {
  id: AchievementId;
  name: string;
  description: string;
  icon: LucideIcon;
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first-audit",
    name: "First Audit",
    description: "Run your first website audit.",
    icon: Target,
  },
  {
    id: "community-champion",
    name: "Community Champion",
    description: "Complete the Widgetify community onboarding.",
    icon: Heart,
  },
  {
    id: "score-hunter",
    name: "Score Hunter",
    description: "Audit 5 different websites.",
    icon: Medal,
  },
  {
    id: "sharpshooter",
    name: "Sharpshooter",
    description: "Share a report with someone else.",
    icon: Share2,
  },
  {
    id: "high-performer",
    name: "High Performer",
    description: "Discover a website scoring 90 or above.",
    icon: Star,
  },
  {
    id: "comeback",
    name: "Comeback",
    description: "Re-audit a site and improve its score.",
    icon: RefreshCw,
  },
  {
    id: "directory-contributor",
    name: "Directory Contributor",
    description: "Add a report to the public audit directory.",
    icon: Bookmark,
  },
  {
    id: "regular",
    name: "Regular",
    description: "Run 10 website audits.",
    icon: Trophy,
  },
];

export interface UnlockedAchievement {
  id: AchievementId;
  unlockedAt: string;
}

const KEY = "webaudit.achievements.v1";

export function listUnlocked(): UnlockedAchievement[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    const parsed = raw ? (JSON.parse(raw) as unknown) : [];
    if (!Array.isArray(parsed)) return [];
    const validIds = new Set(ACHIEVEMENTS.map((a) => a.id));
    return parsed
      .filter(
        (x): x is { id: string; unlockedAt: string } =>
          typeof x === "object" &&
          x !== null &&
          typeof x.id === "string" &&
          typeof x.unlockedAt === "string" &&
          validIds.has(x.id as AchievementId),
      )
      .map((x) => ({ id: x.id as AchievementId, unlockedAt: x.unlockedAt }));
  } catch {
    return [];
  }
}

export function isUnlocked(id: AchievementId): boolean {
  return listUnlocked().some((a) => a.id === id);
}

export function unlock(id: AchievementId): UnlockedAchievement[] {
  if (typeof window === "undefined") return [];
  const current = listUnlocked();
  if (current.some((a) => a.id === id)) return current;
  const next = [...current, { id, unlockedAt: new Date().toISOString() }];
  window.localStorage.setItem(KEY, JSON.stringify(next));
  window.dispatchEvent(new CustomEvent("webaudit:achievements"));
  return next;
}

export function resetAchievements(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(KEY);
  window.dispatchEvent(new CustomEvent("webaudit:achievements"));
}

export function getAchievement(id: AchievementId): Achievement | undefined {
  return ACHIEVEMENTS.find((a) => a.id === id);
}
