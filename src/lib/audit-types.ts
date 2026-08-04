export type Priority = "Critical" | "High" | "Medium" | "Low";
export type Difficulty = "Easy" | "Moderate" | "Hard";

export const CATEGORY_IDS = [
  "performance",
  "seo",
  "accessibility",
  "mobile",
  "ux",
  "conversion",
  "security",
  "best-practices",
] as const;

export type CategoryId = (typeof CATEGORY_IDS)[number];

export const CATEGORY_LABELS: Record<CategoryId, string> = {
  performance: "Performance",
  seo: "SEO",
  accessibility: "Accessibility",
  mobile: "Mobile Experience",
  ux: "User Experience",
  conversion: "Conversion Optimization",
  security: "Security",
  "best-practices": "Best Practices",
};

export interface CategoryReport {
  id: CategoryId;
  name: string;
  score: number;
  summary: string;
  findings: string[];
  businessImpact: string;
  whyItMatters: string;
  improvements: string[];
  difficulty: Difficulty;
  priority: Priority;
}

export interface Recommendation {
  title: string;
  problem: string;
  explanation: string;
  solution: string;
  expectedImprovement: string;
  priority: Priority;
  timeToFix: string;
}

export interface AuditReport {
  id: string;
  url: string;
  title: string;
  createdAt: string;
  overallScore: number;
  executiveSummary: string;
  strengths: string[];
  weaknesses: string[];
  categories: CategoryReport[];
  recommendations: Recommendation[];
  aiPowered: boolean;
}

export const PRIORITY_ORDER: Record<Priority, number> = {
  Critical: 0,
  High: 1,
  Medium: 2,
  Low: 3,
};

export function scoreTone(score: number): "success" | "warning" | "danger" {
  if (score >= 80) return "success";
  if (score >= 60) return "warning";
  return "danger";
}

export function scoreLabel(score: number): string {
  if (score >= 90) return "Excellent";
  if (score >= 80) return "Good";
  if (score >= 60) return "Needs work";
  if (score >= 40) return "Poor";
  return "Critical";
}

export function normalizeUrl(input: string): string | null {
  const raw = input.trim();
  if (!raw) return null;
  const withProtocol = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  try {
    const url = new URL(withProtocol);
    if (!url.hostname.includes(".") || /\s/.test(url.hostname)) return null;
    return url.toString();
  } catch {
    return null;
  }
}