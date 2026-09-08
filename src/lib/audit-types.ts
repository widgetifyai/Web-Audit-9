export type Severity = "Critical" | "High" | "Medium" | "Low" | "Passed";
export type Effort = "Low" | "Medium" | "High";
export type AuditMode = "basic" | "standard" | "deep";

export const CATEGORY_IDS = [
  "technical-seo",
  "seo-aeo",
  "performance",
  "accessibility",
  "security",
  "ux-cro",
  "content",
] as const;

export type CategoryId = (typeof CATEGORY_IDS)[number];

export const CATEGORY_LABELS: Record<CategoryId, string> = {
  "technical-seo": "Technical SEO",
  "seo-aeo": "SEO & AI Search",
  performance: "Performance",
  accessibility: "Accessibility",
  security: "Security",
  "ux-cro": "UX & Conversion",
  content: "Content Quality",
};

export const CATEGORY_BLURBS: Record<CategoryId, string> = {
  "technical-seo": "Crawlability, indexing, canonicals, sitemaps and metadata plumbing.",
  "seo-aeo": "How well search engines and AI assistants can quote and cite your pages.",
  performance: "Response time, payload weight and Core Web Vitals signals.",
  accessibility: "Alt text, labels, landmarks, language and keyboard semantics.",
  security: "HTTPS, transport security and browser hardening headers.",
  "ux-cro": "Clarity, navigation, calls to action and form friction.",
  content: "Depth, structure and readability of what visitors actually read.",
};

export const SEVERITY_ORDER: Record<Severity, number> = {
  Critical: 0,
  High: 1,
  Medium: 2,
  Low: 3,
  Passed: 4,
};

export const SEVERITY_WEIGHT: Record<Severity, number> = {
  Critical: 30,
  High: 18,
  Medium: 9,
  Low: 4,
  Passed: 0,
};

export const IMPACT_WEIGHT: Record<Severity, number> = {
  Critical: 10,
  High: 7,
  Medium: 4,
  Low: 2,
  Passed: 0,
};

export const EFFORT_WEIGHT: Record<Effort, number> = {
  Low: 1,
  Medium: 2,
  High: 4,
};

export interface Issue {
  /** Stable rule id, e.g. "title-missing". */
  ruleId: string;
  category: CategoryId;
  page: string;
  title: string;
  /** Exact measured value or element found on the page. Never invented. */
  evidence: string;
  impact: string;
  severity: Severity;
  effort: Effort;
  fix: string;
  /** Impact x Severity / Effort — used to rank the action list. */
  priorityScore: number;
  /** True when the impact/fix wording was expanded by the AI layer. */
  aiEnhanced?: boolean;
}

export interface PassedCheck {
  ruleId: string;
  category: CategoryId;
  page: string;
  title: string;
  evidence: string;
}

export interface PageResult {
  url: string;
  status: number;
  ttfbMs: number;
  bytes: number;
  /** Content hash used for change detection and cache reuse. */
  hash: string;
  score: number;
  issueCount: number;
  /** True when this page was reused from a previous audit (unchanged). */
  reused?: boolean;
  error?: string;
}

export interface AuditReport {
  id: string;
  url: string;
  hostname: string;
  title: string;
  mode: AuditMode;
  createdAt: string;
  overallScore: number;
  scores: Record<CategoryId, number>;
  summary: string;
  strengths: string[];
  risks: string[];
  pages: PageResult[];
  issues: Issue[];
  passed: PassedCheck[];
  aiPowered: boolean;
  aiNote?: string;
  creditsUsed: number;
}

export const MODE_LABELS: Record<AuditMode, string> = {
  basic: "Basic",
  standard: "Standard",
  deep: "Deep",
};

export const MODE_CONFIG: Record<
  AuditMode,
  { pages: number; aiBatches: number; credits: number; blurb: string }
> = {
  basic: {
    pages: 1,
    aiBatches: 0,
    credits: 0,
    blurb: "One page, full rule engine, no AI. Always free.",
  },
  standard: {
    pages: 5,
    aiBatches: 1,
    credits: 3,
    blurb: "Up to 5 pages with a single batched AI analysis pass.",
  },
  deep: {
    pages: 20,
    aiBatches: 3,
    credits: 9,
    blurb: "Up to 20 pages, batched AI analysis across page groups.",
  },
};

export const CREDITS_PER_AI_BATCH = 3;
export const CREDITS_PER_FIX = 1;

export function severityTone(severity: Severity): "success" | "warning" | "danger" | "muted" {
  if (severity === "Critical" || severity === "High") return "danger";
  if (severity === "Medium") return "warning";
  if (severity === "Passed") return "success";
  return "muted";
}

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

export function priorityScore(severity: Severity, effort: Effort): number {
  return Math.round((IMPACT_WEIGHT[severity] * (5 - SEVERITY_ORDER[severity])) / EFFORT_WEIGHT[effort]);
}

export function countBySeverity(issues: Issue[]): Record<Severity, number> {
  const out: Record<Severity, number> = {
    Critical: 0,
    High: 0,
    Medium: 0,
    Low: 0,
    Passed: 0,
  };
  for (const issue of issues) out[issue.severity] += 1;
  return out;
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

export function hostnameOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}
