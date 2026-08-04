import {
  CATEGORY_LABELS,
  type AuditReport,
  type CategoryId,
  type CategoryReport,
  type Difficulty,
  type Priority,
} from "./audit-types";

export interface SiteSignals {
  url: string;
  finalUrl: string;
  status: number;
  https: boolean;
  ttfbMs: number;
  htmlBytes: number;
  title: string;
  metaDescription: string;
  h1Count: number;
  imgCount: number;
  imgMissingAlt: number;
  hasViewport: boolean;
  hasLang: boolean;
  hasCanonical: boolean;
  hasOpenGraph: boolean;
  hasStructuredData: boolean;
  scriptCount: number;
  inlineStyleCount: number;
  stylesheetCount: number;
  formCount: number;
  inputCount: number;
  labelCount: number;
  linkCount: number;
  buttonCount: number;
  hasCsp: boolean;
  hasHsts: boolean;
  hasXfo: boolean;
  ctaKeywords: string[];
  hasFavicon: boolean;
  textLength: number;
}

function count(html: string, re: RegExp): number {
  return (html.match(re) ?? []).length;
}

function attr(html: string, re: RegExp): string {
  const m = html.match(re);
  return m?.[1]?.trim() ?? "";
}

const CTA_WORDS = [
  "get started",
  "contact",
  "book a demo",
  "start free",
  "sign up",
  "request a quote",
  "buy now",
  "subscribe",
  "talk to us",
];

export async function collectSignals(url: string): Promise<SiteSignals> {
  const started = Date.now();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15000);
  let response: Response;
  try {
    response = await fetch(url, {
      redirect: "follow",
      signal: controller.signal,
      headers: {
        "user-agent": "Mozilla/5.0 (compatible; WidgetifyAudit/1.0; +https://widgetify.app)",
        accept: "text/html,application/xhtml+xml",
      },
    });
  } finally {
    clearTimeout(timer);
  }

  const ttfbMs = Date.now() - started;
  const html = (await response.text()).slice(0, 900_000);
  const headers = response.headers;
  const text = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const lower = html.toLowerCase();

  return {
    url,
    finalUrl: response.url || url,
    status: response.status,
    https: (response.url || url).startsWith("https://"),
    ttfbMs,
    htmlBytes: html.length,
    title: attr(html, /<title[^>]*>([\s\S]*?)<\/title>/i).slice(0, 200),
    metaDescription: attr(
      html,
      /<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i,
    ).slice(0, 300),
    h1Count: count(html, /<h1[\s>]/gi),
    imgCount: count(html, /<img[\s>]/gi),
    imgMissingAlt: count(html, /<img(?![^>]*\salt=)[^>]*>/gi),
    hasViewport: /<meta[^>]+name=["']viewport["']/i.test(html),
    hasLang: /<html[^>]+lang=/i.test(html),
    hasCanonical: /rel=["']canonical["']/i.test(html),
    hasOpenGraph: /property=["']og:/i.test(html),
    hasStructuredData: /application\/ld\+json/i.test(html),
    scriptCount: count(html, /<script[\s>]/gi),
    inlineStyleCount: count(html, /\sstyle=["']/gi),
    stylesheetCount: count(html, /rel=["']stylesheet["']/gi),
    formCount: count(html, /<form[\s>]/gi),
    inputCount: count(html, /<input[\s>]/gi),
    labelCount: count(html, /<label[\s>]/gi),
    linkCount: count(html, /<a[\s>]/gi),
    buttonCount: count(html, /<button[\s>]/gi),
    hasCsp: headers.has("content-security-policy"),
    hasHsts: headers.has("strict-transport-security"),
    hasXfo: headers.has("x-frame-options") || headers.has("permissions-policy"),
    ctaKeywords: CTA_WORDS.filter((w) => lower.includes(w)),
    hasFavicon: /rel=["'][^"']*icon/i.test(html),
    textLength: text.length,
  };
}

function clamp(n: number): number {
  return Math.max(5, Math.min(99, Math.round(n)));
}

export function heuristicScores(s: SiteSignals): Record<CategoryId, number> {
  const altRatio = s.imgCount ? 1 - s.imgMissingAlt / s.imgCount : 1;
  return {
    performance: clamp(
      96 -
        Math.min(35, s.ttfbMs / 40) -
        Math.min(20, s.htmlBytes / 25000) -
        Math.min(18, Math.max(0, s.scriptCount - 8) * 1.5),
    ),
    seo: clamp(
      42 +
        (s.title ? 14 : 0) +
        (s.metaDescription ? 14 : 0) +
        (s.h1Count === 1 ? 12 : s.h1Count > 1 ? 4 : 0) +
        (s.hasCanonical ? 8 : 0) +
        (s.hasOpenGraph ? 6 : 0) +
        (s.hasStructuredData ? 8 : 0),
    ),
    accessibility: clamp(
      48 +
        altRatio * 22 +
        (s.hasLang ? 12 : 0) +
        (s.inputCount === 0 || s.labelCount >= s.inputCount ? 14 : 2) +
        (s.h1Count > 0 ? 6 : 0),
    ),
    mobile: clamp(
      50 + (s.hasViewport ? 30 : 0) + (s.htmlBytes < 250000 ? 12 : 0) + (s.ttfbMs < 800 ? 8 : 0),
    ),
    ux: clamp(
      52 +
        (s.linkCount > 5 ? 12 : 0) +
        (s.textLength > 900 ? 12 : 0) +
        (s.buttonCount > 0 ? 10 : 0) +
        (s.h1Count === 1 ? 10 : 0),
    ),
    conversion: clamp(
      44 +
        s.ctaKeywords.length * 9 +
        (s.formCount > 0 ? 14 : 0) +
        (s.textLength > 1500 ? 8 : 0),
    ),
    security: clamp(
      36 + (s.https ? 30 : 0) + (s.hasHsts ? 14 : 0) + (s.hasCsp ? 14 : 0) + (s.hasXfo ? 8 : 0),
    ),
    "best-practices": clamp(
      50 +
        (s.hasFavicon ? 10 : 0) +
        (s.hasLang ? 10 : 0) +
        (s.inlineStyleCount < 15 ? 12 : 0) +
        (s.status === 200 ? 12 : 0) +
        (s.stylesheetCount < 6 ? 6 : 0),
    ),
  };
}

function priorityFor(score: number): Priority {
  if (score < 45) return "Critical";
  if (score < 65) return "High";
  if (score < 80) return "Medium";
  return "Low";
}

function difficultyFor(id: CategoryId): Difficulty {
  if (id === "seo" || id === "conversion" || id === "ux") return "Easy";
  if (id === "performance" || id === "security") return "Moderate";
  return "Moderate";
}

const FALLBACK_COPY: Record<
  CategoryId,
  { impact: string; why: string; fixes: string[] }
> = {
  performance: {
    impact: "Slow pages lose visitors before they ever see your offer.",
    why: "Load speed shapes first impressions and is a direct ranking factor.",
    fixes: [
      "Compress and modernise image formats",
      "Defer non-critical scripts",
      "Enable caching and compression on the server",
    ],
  },
  seo: {
    impact: "Weak on-page signals mean fewer people find you in search.",
    why: "Search is the cheapest, most durable source of new customers.",
    fixes: [
      "Write a unique title and description for every page",
      "Use exactly one descriptive H1 per page",
      "Add structured data describing your business",
    ],
  },
  accessibility: {
    impact: "Some visitors literally cannot complete key actions on your site.",
    why: "Accessible sites reach more people and carry less legal risk.",
    fixes: [
      "Add alt text to every meaningful image",
      "Label every form field",
      "Check colour contrast against the 4.5:1 minimum",
    ],
  },
  mobile: {
    impact: "Most of your traffic is on a phone; friction there is felt by the majority.",
    why: "Mobile is the default browsing context for nearly every audience.",
    fixes: [
      "Declare a responsive viewport",
      "Ensure tap targets are at least 44px",
      "Avoid horizontal scrolling on small screens",
    ],
  },
  ux: {
    impact: "Unclear structure makes visitors work harder than they will tolerate.",
    why: "Clarity keeps momentum; confusion ends sessions.",
    fixes: [
      "Lead with a single clear value statement",
      "Keep navigation short and plain-language",
      "Make the next step obvious on every page",
    ],
  },
  conversion: {
    impact: "Traffic that never converts is money spent without return.",
    why: "Small changes to calls to action often outperform large redesigns.",
    fixes: [
      "Place a primary call to action above the fold",
      "Reduce form fields to the essentials",
      "Add credible social proof near decision points",
    ],
  },
  security: {
    impact: "Security warnings destroy trust instantly and permanently.",
    why: "Visitors and search engines both penalise insecure sites.",
    fixes: [
      "Serve everything over HTTPS",
      "Add HSTS and a Content-Security-Policy header",
      "Keep dependencies patched",
    ],
  },
  "best-practices": {
    impact: "Technical debt makes every future improvement slower and riskier.",
    why: "A clean foundation keeps your site cheap to evolve.",
    fixes: [
      "Remove unused scripts and styles",
      "Fix console errors",
      "Declare a document language and favicon",
    ],
  },
};

export function buildFindings(s: SiteSignals, id: CategoryId): string[] {
  const out: string[] = [];
  switch (id) {
    case "performance":
      out.push(`Server responded in ${s.ttfbMs} ms`);
      out.push(`HTML document weighs ${(s.htmlBytes / 1024).toFixed(0)} KB`);
      out.push(`${s.scriptCount} script tags and ${s.stylesheetCount} stylesheets detected`);
      break;
    case "seo":
      out.push(s.title ? `Page title: "${s.title}"` : "No page title found");
      out.push(
        s.metaDescription ? "Meta description present" : "Meta description is missing",
      );
      out.push(`${s.h1Count} H1 heading${s.h1Count === 1 ? "" : "s"} on the page`);
      if (!s.hasStructuredData) out.push("No structured data (JSON-LD) detected");
      break;
    case "accessibility":
      out.push(`${s.imgMissingAlt} of ${s.imgCount} images are missing alt text`);
      out.push(`${s.inputCount} form inputs and ${s.labelCount} labels found`);
      if (!s.hasLang) out.push("The document language is not declared");
      break;
    case "mobile":
      out.push(s.hasViewport ? "Responsive viewport declared" : "No responsive viewport tag");
      out.push(`Initial payload of ${(s.htmlBytes / 1024).toFixed(0)} KB before assets`);
      break;
    case "ux":
      out.push(`${s.linkCount} links and ${s.buttonCount} buttons in the navigation and body`);
      out.push(`${s.textLength} characters of readable content`);
      break;
    case "conversion":
      out.push(
        s.ctaKeywords.length
          ? `Calls to action detected: ${s.ctaKeywords.join(", ")}`
          : "No recognisable call-to-action language found",
      );
      out.push(`${s.formCount} form${s.formCount === 1 ? "" : "s"} on the page`);
      break;
    case "security":
      out.push(s.https ? "HTTPS is enforced" : "Site is not served over HTTPS");
      out.push(s.hasHsts ? "HSTS header present" : "HSTS header missing");
      out.push(s.hasCsp ? "Content-Security-Policy present" : "Content-Security-Policy missing");
      break;
    case "best-practices":
      out.push(`HTTP status ${s.status}`);
      out.push(`${s.inlineStyleCount} inline style attributes`);
      out.push(s.hasFavicon ? "Favicon declared" : "No favicon declared");
      break;
  }
  return out;
}

export function fallbackReport(s: SiteSignals, id: string): AuditReport {
  const scores = heuristicScores(s);
  const categories: CategoryReport[] = (Object.keys(scores) as CategoryId[]).map((key) => ({
    id: key,
    name: CATEGORY_LABELS[key],
    score: scores[key],
    summary: FALLBACK_COPY[key].why,
    findings: buildFindings(s, key),
    businessImpact: FALLBACK_COPY[key].impact,
    whyItMatters: FALLBACK_COPY[key].why,
    improvements: FALLBACK_COPY[key].fixes,
    difficulty: difficultyFor(key),
    priority: priorityFor(scores[key]),
  }));

  const overall = Math.round(
    categories.reduce((sum, c) => sum + c.score, 0) / categories.length,
  );
  const sorted = [...categories].sort((a, b) => a.score - b.score);
  const best = sorted[sorted.length - 1]!;
  const worst = sorted[0]!;
  const secondWorst = sorted[1] ?? worst;

  return {
    id,
    url: s.finalUrl,
    title: s.title || new URL(s.finalUrl).hostname,
    createdAt: new Date().toISOString(),
    overallScore: overall,
    aiPowered: false,
    executiveSummary: `We analysed ${new URL(s.finalUrl).hostname} across eight categories and scored it ${overall} out of 100. The strongest area is ${best.name}, while ${worst.name} and ${secondWorst.name} are holding the site back the most. Addressing the highest-priority items below will have the clearest effect on visibility and conversions.`,
    strengths: sorted
      .slice(-3)
      .reverse()
      .map((c) => `${c.name} is performing well at ${c.score}/100`),
    weaknesses: sorted.slice(0, 3).map((c) => `${c.name} needs attention at ${c.score}/100`),
    categories,
    recommendations: sorted.slice(0, 6).map((c) => ({
      title: `Improve ${c.name.toLowerCase()}`,
      problem: c.findings[0] ?? `${c.name} scored ${c.score}/100`,
      explanation: c.businessImpact,
      solution: c.improvements.join("; "),
      expectedImprovement: `A realistic lift of ${Math.min(30, 95 - c.score)} points in ${c.name}`,
      priority: c.priority,
      timeToFix: c.difficulty === "Easy" ? "1–2 hours" : "Half a day",
    })),
  };
}

const SYSTEM_PROMPT = `You are a senior website auditor writing for business owners, not engineers.
You receive measured technical signals from a real website and heuristic scores.
Write a clear, specific, jargon-free audit. Never invent measurements that are not in the signals;
you may interpret them. Every piece of advice must be practical and tied to business value.
Respond with JSON only, no markdown fences.`;

function jsonShape(): string {
  return `{
  "executiveSummary": "4-6 sentences",
  "strengths": ["3 short bullets"],
  "weaknesses": ["3 short bullets"],
  "categories": [{"id":"performance|seo|accessibility|mobile|ux|conversion|security|best-practices","score":0-100,"summary":"one sentence","findings":["2-4 bullets"],"businessImpact":"1-2 sentences","whyItMatters":"1-2 sentences","improvements":["2-4 actions"],"difficulty":"Easy|Moderate|Hard","priority":"Critical|High|Medium|Low"}],
  "recommendations": [{"title":"short","problem":"1 sentence","explanation":"2 sentences","solution":"2 sentences","expectedImprovement":"1 sentence","priority":"Critical|High|Medium|Low","timeToFix":"e.g. 1-2 hours"}]
}`;
}

export async function aiReport(
  s: SiteSignals,
  id: string,
  apiKey: string,
): Promise<AuditReport> {
  const base = fallbackReport(s, id);
  const scores = heuristicScores(s);

  const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Lovable-API-Key": apiKey,
    },
    body: JSON.stringify({
      model: "openai/gpt-5.6-sol",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: `Website: ${s.finalUrl}
Measured signals: ${JSON.stringify(s)}
Heuristic category scores: ${JSON.stringify(scores)}

Produce exactly 8 categories (all ids listed) and 5-7 recommendations ordered by priority.
Keep scores within 8 points of the heuristic scores.
Return JSON matching this shape: ${jsonShape()}`,
        },
      ],
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`AI gateway error [${response.status}]: ${body.slice(0, 400)}`);
  }

  const payload = (await response.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const content = payload.choices?.[0]?.message?.content ?? "";
  const cleaned = content.replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();
  const parsed = JSON.parse(cleaned) as Partial<AuditReport>;

  const categories = (parsed.categories ?? []).length
    ? base.categories.map((fallbackCat) => {
        const match = parsed.categories?.find((c) => c.id === fallbackCat.id);
        return match ? { ...fallbackCat, ...match, name: fallbackCat.name } : fallbackCat;
      })
    : base.categories;

  const overall = Math.round(
    categories.reduce((sum, c) => sum + (c.score ?? 0), 0) / categories.length,
  );

  return {
    ...base,
    aiPowered: true,
    overallScore: overall,
    executiveSummary: parsed.executiveSummary || base.executiveSummary,
    strengths: parsed.strengths?.length ? parsed.strengths : base.strengths,
    weaknesses: parsed.weaknesses?.length ? parsed.weaknesses : base.weaknesses,
    categories,
    recommendations: parsed.recommendations?.length
      ? parsed.recommendations
      : base.recommendations,
  };
}