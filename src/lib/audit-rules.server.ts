import {
  CATEGORY_IDS,
  SEVERITY_WEIGHT,
  priorityScore,
  type CategoryId,
  type Effort,
  type Issue,
  type PassedCheck,
  type Severity,
} from "./audit-types";

export interface PageSnapshot {
  url: string;
  finalUrl: string;
  status: number;
  ttfbMs: number;
  bytes: number;
  hash: string;
  html: string;
  headers: Record<string, string>;
  error?: string;
}

const UA = "Mozilla/5.0 (compatible; WebAuditNine/1.0; +https://webauditnine.lovable.app)";

/** Small, fast, dependency-free content hash used for change detection and cache keys. */
export function hashString(input: string): string {
  let h1 = 0x9e3779b9;
  let h2 = 0x85ebca6b;
  for (let i = 0; i < input.length; i += 1) {
    const c = input.charCodeAt(i);
    h1 = Math.imul(h1 ^ c, 2654435761);
    h2 = Math.imul(h2 ^ c, 1597334677);
  }
  h1 = (h1 ^ (h1 >>> 16)) >>> 0;
  h2 = (h2 ^ (h2 >>> 13)) >>> 0;
  return `${h1.toString(36)}${h2.toString(36)}`;
}

export async function fetchPage(url: string, timeoutMs = 12000): Promise<PageSnapshot> {
  const started = Date.now();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      redirect: "follow",
      signal: controller.signal,
      headers: { "user-agent": UA, accept: "text/html,application/xhtml+xml" },
    });
    const ttfbMs = Date.now() - started;
    const raw = await response.text();
    const html = raw.slice(0, 900_000);
    const headers: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      headers[key.toLowerCase()] = value;
    });
    return {
      url,
      finalUrl: response.url || url,
      status: response.status,
      ttfbMs,
      bytes: html.length,
      hash: hashString(html),
      html,
      headers,
    };
  } catch (error) {
    return {
      url,
      finalUrl: url,
      status: 0,
      ttfbMs: Date.now() - started,
      bytes: 0,
      hash: "",
      html: "",
      headers: {},
      error: error instanceof Error ? error.message : "Request failed",
    };
  } finally {
    clearTimeout(timer);
  }
}

function count(html: string, re: RegExp): number {
  return (html.match(re) ?? []).length;
}

function attr(html: string, re: RegExp): string {
  return (html.match(re)?.[1] ?? "").trim();
}

export interface PageFacts {
  url: string;
  status: number;
  ttfbMs: number;
  bytes: number;
  title: string;
  titleLength: number;
  description: string;
  descriptionLength: number;
  h1Count: number;
  h2Count: number;
  headingOutlineOk: boolean;
  imgCount: number;
  imgMissingAlt: number;
  inputCount: number;
  labelCount: number;
  formCount: number;
  linkCount: number;
  buttonCount: number;
  scriptCount: number;
  stylesheetCount: number;
  inlineStyleCount: number;
  hasViewport: boolean;
  hasLang: boolean;
  hasCanonical: boolean;
  hasOpenGraph: boolean;
  hasStructuredData: boolean;
  structuredDataTypes: string[];
  hasFaqSchema: boolean;
  hasNoindex: boolean;
  hasFavicon: boolean;
  hasMain: boolean;
  hasNav: boolean;
  https: boolean;
  hasHsts: boolean;
  hasCsp: boolean;
  hasXcto: boolean;
  hasFrameProtection: boolean;
  hasReferrerPolicy: boolean;
  serverHeaderLeak: string;
  wordCount: number;
  avgSentenceWords: number;
  ctaMatches: string[];
  hasLazyImages: boolean;
  usesModernImages: boolean;
  hasContactSignal: boolean;
  hasProofSignal: boolean;
}

const CTA_WORDS = [
  "get started",
  "start free",
  "book a demo",
  "contact us",
  "request a quote",
  "sign up",
  "buy now",
  "subscribe",
  "talk to us",
  "get a quote",
];

export function extractFacts(page: PageSnapshot): PageFacts {
  const html = page.html;
  const text = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z#0-9]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
  const words = text ? text.split(" ").filter(Boolean) : [];
  const sentences = text.split(/[.!?]+\s/).filter((s) => s.trim().length > 0);
  const lower = html.toLowerCase();
  const title = attr(html, /<title[^>]*>([\s\S]*?)<\/title>/i).slice(0, 300);
  const description = attr(
    html,
    /<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i,
  ).slice(0, 400);
  const ldTypes = Array.from(html.matchAll(/"@type"\s*:\s*"([^"]+)"/g))
    .map((m) => m[1] ?? "")
    .filter(Boolean)
    .slice(0, 12);
  const h1Count = count(html, /<h1[\s>]/gi);
  const h2Count = count(html, /<h2[\s>]/gi);

  return {
    url: page.finalUrl,
    status: page.status,
    ttfbMs: page.ttfbMs,
    bytes: page.bytes,
    title,
    titleLength: title.length,
    description,
    descriptionLength: description.length,
    h1Count,
    h2Count,
    headingOutlineOk: h1Count === 1 && h2Count >= 1,
    imgCount: count(html, /<img[\s>]/gi),
    imgMissingAlt: count(html, /<img(?![^>]*\salt=)[^>]*>/gi),
    inputCount: count(html, /<input[\s>]/gi),
    labelCount: count(html, /<label[\s>]/gi),
    formCount: count(html, /<form[\s>]/gi),
    linkCount: count(html, /<a[\s>]/gi),
    buttonCount: count(html, /<button[\s>]/gi),
    scriptCount: count(html, /<script[\s>]/gi),
    stylesheetCount: count(html, /rel=["']stylesheet["']/gi),
    inlineStyleCount: count(html, /\sstyle=["']/gi),
    hasViewport: /<meta[^>]+name=["']viewport["']/i.test(html),
    hasLang: /<html[^>]+lang=/i.test(html),
    hasCanonical: /rel=["']canonical["']/i.test(html),
    hasOpenGraph: /property=["']og:/i.test(html),
    hasStructuredData: /application\/ld\+json/i.test(html),
    structuredDataTypes: ldTypes,
    hasFaqSchema: /"@type"\s*:\s*"FAQPage"/i.test(html),
    hasNoindex: /<meta[^>]+name=["']robots["'][^>]+content=["'][^"']*noindex/i.test(html),
    hasFavicon: /rel=["'][^"']*icon/i.test(html),
    hasMain: /<main[\s>]/i.test(html),
    hasNav: /<nav[\s>]/i.test(html),
    https: page.finalUrl.startsWith("https://"),
    hasHsts: Boolean(page.headers["strict-transport-security"]),
    hasCsp: Boolean(page.headers["content-security-policy"]),
    hasXcto: page.headers["x-content-type-options"] === "nosniff",
    hasFrameProtection: Boolean(
      page.headers["x-frame-options"] ||
        (page.headers["content-security-policy"] ?? "").includes("frame-ancestors"),
    ),
    hasReferrerPolicy: Boolean(page.headers["referrer-policy"]),
    serverHeaderLeak: page.headers["x-powered-by"] ?? "",
    wordCount: words.length,
    avgSentenceWords: sentences.length ? Math.round(words.length / sentences.length) : 0,
    ctaMatches: CTA_WORDS.filter((w) => lower.includes(w)),
    hasLazyImages: /loading=["']lazy["']/i.test(html),
    usesModernImages: /\.(webp|avif)\b/i.test(html) || /<picture[\s>]/i.test(html),
    hasContactSignal: /mailto:|tel:|\/contact/i.test(html),
    hasProofSignal: /testimonial|review|trusted by|case stud|rating/i.test(lower),
  };
}

interface RuleResult {
  ruleId: string;
  category: CategoryId;
  title: string;
  passed: boolean;
  evidence: string;
  severity: Severity;
  effort: Effort;
  impact: string;
  fix: string;
}

function rule(
  ruleId: string,
  category: CategoryId,
  title: string,
  passed: boolean,
  evidence: string,
  severity: Severity,
  effort: Effort,
  impact: string,
  fix: string,
): RuleResult {
  return { ruleId, category, title, passed, evidence, severity, effort, impact, fix };
}

export function runRules(f: PageFacts): RuleResult[] {
  const kb = (f.bytes / 1024).toFixed(0);
  const altRatioText = `${f.imgMissingAlt} of ${f.imgCount} images have no alt attribute`;

  return [
    // Technical SEO
    rule(
      "status-ok",
      "technical-seo",
      "Page returns a successful response",
      f.status >= 200 && f.status < 300,
      `HTTP status ${f.status}`,
      "Critical",
      "Medium",
      "A non-200 response means search engines and visitors may never see this page.",
      "Fix the server response or redirect chain so the page returns 200 directly.",
    ),
    rule(
      "noindex",
      "technical-seo",
      "Page is indexable",
      !f.hasNoindex,
      f.hasNoindex ? "robots meta tag contains noindex" : "No noindex directive found",
      "Critical",
      "Low",
      "A noindex directive removes the page from search results entirely.",
      "Remove the noindex value from the robots meta tag on pages you want found.",
    ),
    rule(
      "canonical",
      "technical-seo",
      "Canonical URL declared",
      f.hasCanonical,
      f.hasCanonical ? "rel=canonical present" : "No rel=canonical link found",
      "Medium",
      "Low",
      "Without a canonical, duplicate versions of the page can split ranking signals.",
      "Add <link rel=\"canonical\"> pointing at the preferred URL for this page.",
    ),
    rule(
      "viewport",
      "technical-seo",
      "Responsive viewport declared",
      f.hasViewport,
      f.hasViewport ? "viewport meta tag present" : "No viewport meta tag",
      "High",
      "Low",
      "Without a viewport tag mobile browsers render a zoomed-out desktop layout.",
      "Add <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">.",
    ),
    rule(
      "favicon",
      "technical-seo",
      "Favicon declared",
      f.hasFavicon,
      f.hasFavicon ? "Icon link present" : "No icon link found",
      "Low",
      "Low",
      "A missing favicon looks unfinished in tabs, bookmarks and search results.",
      "Add a favicon link to the document head.",
    ),

    // SEO & AEO
    rule(
      "title-present",
      "seo-aeo",
      "Page title present and well sized",
      f.titleLength >= 15 && f.titleLength <= 65,
      f.title ? `Title is ${f.titleLength} characters: "${f.title}"` : "No <title> found",
      f.title ? "Medium" : "Critical",
      "Low",
      "The title is the single strongest on-page signal and the clickable line in search results.",
      "Write a 40–60 character title that names the page's topic and the brand.",
    ),
    rule(
      "description-present",
      "seo-aeo",
      "Meta description present and well sized",
      f.descriptionLength >= 70 && f.descriptionLength <= 165,
      f.description
        ? `Description is ${f.descriptionLength} characters`
        : "No meta description found",
      f.description ? "Low" : "High",
      "Low",
      "The description drives click-through from search and is often quoted by AI assistants.",
      "Write a unique 120–155 character description that states the page's value.",
    ),
    rule(
      "single-h1",
      "seo-aeo",
      "Exactly one H1 heading",
      f.h1Count === 1,
      `${f.h1Count} H1 heading${f.h1Count === 1 ? "" : "s"} found`,
      f.h1Count === 0 ? "High" : "Medium",
      "Low",
      "Search engines and AI summarisers use the H1 to decide what the page is about.",
      "Use one descriptive H1 per page and demote the rest to H2.",
    ),
    rule(
      "structured-data",
      "seo-aeo",
      "Structured data present",
      f.hasStructuredData,
      f.hasStructuredData
        ? `JSON-LD types: ${f.structuredDataTypes.join(", ") || "present"}`
        : "No JSON-LD structured data found",
      "High",
      "Medium",
      "Schema markup is how AI search engines identify and cite your business, products and answers.",
      "Add JSON-LD for Organization plus the page's main entity (Product, Article or Service).",
    ),
    rule(
      "faq-schema",
      "seo-aeo",
      "Answer-ready FAQ markup",
      f.hasFaqSchema,
      f.hasFaqSchema ? "FAQPage schema present" : "No FAQPage schema found",
      "Low",
      "Medium",
      "FAQ markup gives AI assistants directly quotable question-and-answer pairs.",
      "Add an FAQ section with FAQPage JSON-LD covering the questions buyers actually ask.",
    ),
    rule(
      "open-graph",
      "seo-aeo",
      "Social share metadata",
      f.hasOpenGraph,
      f.hasOpenGraph ? "Open Graph tags present" : "No Open Graph tags found",
      "Low",
      "Low",
      "Without Open Graph tags shared links appear as bare URLs with no title or image.",
      "Add og:title, og:description and og:image tags.",
    ),

    // Performance
    rule(
      "ttfb",
      "performance",
      "Server responds quickly",
      f.ttfbMs < 800,
      `Server responded in ${f.ttfbMs} ms`,
      f.ttfbMs > 2000 ? "Critical" : f.ttfbMs > 1200 ? "High" : "Medium",
      "Medium",
      "Slow first response delays everything after it and directly hurts Core Web Vitals.",
      "Enable server caching or a CDN in front of the origin to cut time to first byte.",
    ),
    rule(
      "html-weight",
      "performance",
      "HTML document is lean",
      f.bytes < 150_000,
      `HTML document is ${kb} KB`,
      f.bytes > 400_000 ? "High" : "Medium",
      "Medium",
      "Oversized HTML delays parsing and first paint, especially on mobile connections.",
      "Move inline data and markup bloat out of the document and compress the response.",
    ),
    rule(
      "script-count",
      "performance",
      "Script count under control",
      f.scriptCount <= 12,
      `${f.scriptCount} script tags detected`,
      f.scriptCount > 25 ? "High" : "Medium",
      "Medium",
      "Each blocking script postpones interactivity, which is what visitors actually feel.",
      "Defer or remove non-critical third-party scripts and bundle the rest.",
    ),
    rule(
      "lazy-images",
      "performance",
      "Below-the-fold images are lazy loaded",
      f.imgCount === 0 || f.hasLazyImages,
      f.hasLazyImages ? "loading=\"lazy\" in use" : `${f.imgCount} images with no lazy loading`,
      "Medium",
      "Low",
      "Eagerly loading every image competes with the content visitors are waiting for.",
      "Add loading=\"lazy\" to images below the fold.",
    ),
    rule(
      "modern-images",
      "performance",
      "Modern image formats in use",
      f.imgCount === 0 || f.usesModernImages,
      f.usesModernImages ? "WebP/AVIF or <picture> in use" : "No WebP or AVIF sources found",
      "Medium",
      "Medium",
      "Legacy formats are typically 30–60% heavier than WebP for the same visual quality.",
      "Serve WebP or AVIF with a fallback via <picture>.",
    ),

    // Accessibility
    rule(
      "img-alt",
      "accessibility",
      "Images have alt text",
      f.imgMissingAlt === 0,
      f.imgCount ? altRatioText : "No images on the page",
      f.imgMissingAlt > 5 ? "High" : "Medium",
      "Low",
      "Screen reader users get nothing from an unlabelled image, and search engines lose context.",
      "Add descriptive alt text to meaningful images and alt=\"\" to decorative ones.",
    ),
    rule(
      "form-labels",
      "accessibility",
      "Form inputs are labelled",
      f.inputCount === 0 || f.labelCount >= f.inputCount,
      `${f.inputCount} inputs and ${f.labelCount} labels found`,
      "High",
      "Low",
      "Unlabelled fields are unusable with assistive technology and cause form abandonment.",
      "Pair every input with a visible <label for=\"...\">.",
    ),
    rule(
      "html-lang",
      "accessibility",
      "Document language declared",
      f.hasLang,
      f.hasLang ? "lang attribute present on <html>" : "No lang attribute on <html>",
      "Medium",
      "Low",
      "Screen readers need the language to choose the right pronunciation.",
      "Add lang=\"en\" (or the correct language) to the <html> element.",
    ),
    rule(
      "landmarks",
      "accessibility",
      "Semantic landmarks present",
      f.hasMain && f.hasNav,
      `main: ${f.hasMain ? "yes" : "no"}, nav: ${f.hasNav ? "yes" : "no"}`,
      "Low",
      "Low",
      "Landmarks let keyboard and screen reader users skip straight to the content.",
      "Wrap primary content in <main> and navigation in <nav>.",
    ),

    // Security
    rule(
      "https",
      "security",
      "Served over HTTPS",
      f.https,
      f.https ? "HTTPS enforced" : "Page served over plain HTTP",
      "Critical",
      "Medium",
      "Browsers mark non-HTTPS pages as Not secure, which destroys trust instantly.",
      "Install a TLS certificate and redirect all HTTP traffic to HTTPS.",
    ),
    rule(
      "hsts",
      "security",
      "HSTS header set",
      f.hasHsts,
      f.hasHsts ? "Strict-Transport-Security present" : "No Strict-Transport-Security header",
      "Medium",
      "Low",
      "Without HSTS the first request can still be downgraded to plain HTTP.",
      "Send Strict-Transport-Security with a max-age of at least one year.",
    ),
    rule(
      "csp",
      "security",
      "Content Security Policy set",
      f.hasCsp,
      f.hasCsp ? "Content-Security-Policy present" : "No Content-Security-Policy header",
      "High",
      "High",
      "A CSP is the main defence against injected scripts stealing customer data.",
      "Add a Content-Security-Policy header, starting in report-only mode.",
    ),
    rule(
      "x-content-type",
      "security",
      "MIME sniffing disabled",
      f.hasXcto,
      f.hasXcto ? "X-Content-Type-Options: nosniff" : "No X-Content-Type-Options header",
      "Low",
      "Low",
      "MIME sniffing lets a browser execute a file you never intended as script.",
      "Send X-Content-Type-Options: nosniff.",
    ),
    rule(
      "frame-protection",
      "security",
      "Clickjacking protection",
      f.hasFrameProtection,
      f.hasFrameProtection ? "Frame protection present" : "No X-Frame-Options or frame-ancestors",
      "Medium",
      "Low",
      "Without it your pages can be framed by an attacker to hijack clicks.",
      "Send X-Frame-Options: SAMEORIGIN or a CSP frame-ancestors directive.",
    ),
    rule(
      "powered-by",
      "security",
      "No stack disclosure header",
      !f.serverHeaderLeak,
      f.serverHeaderLeak ? `X-Powered-By: ${f.serverHeaderLeak}` : "No X-Powered-By header",
      "Low",
      "Low",
      "Advertising your stack version helps attackers pick a matching exploit.",
      "Remove the X-Powered-By header at the server or proxy.",
    ),

    // UX & CRO
    rule(
      "cta-present",
      "ux-cro",
      "Clear call to action",
      f.ctaMatches.length > 0,
      f.ctaMatches.length
        ? `Detected: ${f.ctaMatches.join(", ")}`
        : "No recognisable call-to-action wording found",
      "High",
      "Low",
      "Visitors who are ready to act will leave if the next step is not obvious.",
      "Add one primary, action-worded button above the fold and repeat it at the end.",
    ),
    rule(
      "contact-path",
      "ux-cro",
      "Contact route available",
      f.hasContactSignal,
      f.hasContactSignal ? "Contact link, phone or email found" : "No contact link, phone or email",
      "Medium",
      "Low",
      "Buyers who cannot reach you quickly go to a competitor who is easier to contact.",
      "Add a visible contact link with an email address or phone number.",
    ),
    rule(
      "form-friction",
      "ux-cro",
      "Forms stay short",
      f.formCount === 0 || f.inputCount <= 6,
      `${f.formCount} form(s) with ${f.inputCount} inputs`,
      "Medium",
      "Low",
      "Every extra required field measurably reduces completed enquiries.",
      "Cut the form to the fields you truly need before the first reply.",
    ),
    rule(
      "social-proof",
      "ux-cro",
      "Social proof present",
      f.hasProofSignal,
      f.hasProofSignal ? "Testimonial or review wording found" : "No testimonials or reviews found",
      "Medium",
      "Medium",
      "Proof is what makes a first-time visitor confident enough to act.",
      "Add named testimonials, review scores or client logos near the main call to action.",
    ),
    rule(
      "navigation",
      "ux-cro",
      "Navigable link structure",
      f.linkCount >= 5,
      `${f.linkCount} links found on the page`,
      "Low",
      "Low",
      "Too few links leaves visitors with nowhere obvious to go next.",
      "Provide a clear navigation with links to the pages buyers look for.",
    ),

    // Content
    rule(
      "content-depth",
      "content",
      "Enough substantive content",
      f.wordCount >= 300,
      `${f.wordCount} words of readable text`,
      f.wordCount < 120 ? "High" : "Medium",
      "Medium",
      "Thin pages rarely rank and give AI assistants nothing worth quoting.",
      "Expand the page to at least 300 words that answer a real buyer question.",
    ),
    rule(
      "readability",
      "content",
      "Sentences stay readable",
      f.avgSentenceWords === 0 || f.avgSentenceWords <= 25,
      `Average sentence length is ${f.avgSentenceWords} words`,
      "Low",
      "Low",
      "Long sentences slow comprehension and increase the chance a visitor gives up.",
      "Break sentences above 25 words into shorter ones.",
    ),
    rule(
      "heading-structure",
      "content",
      "Content is broken up by headings",
      f.headingOutlineOk,
      `${f.h1Count} H1 and ${f.h2Count} H2 headings`,
      "Medium",
      "Low",
      "A flat wall of text is hard to scan and hard for AI to extract sections from.",
      "Add descriptive H2 subheadings that map to the questions the page answers.",
    ),
    rule(
      "inline-style-debt",
      "content",
      "Markup stays maintainable",
      f.inlineStyleCount <= 25,
      `${f.inlineStyleCount} inline style attributes`,
      "Low",
      "Medium",
      "Heavy inline styling makes every future content change slower and riskier.",
      "Move repeated inline styles into stylesheet classes.",
    ),
  ];
}

export interface PageAnalysis {
  issues: Issue[];
  passed: PassedCheck[];
  scores: Record<CategoryId, number>;
  score: number;
}

export function analyzePage(facts: PageFacts): PageAnalysis {
  const results = runRules(facts);
  const issues: Issue[] = [];
  const passed: PassedCheck[] = [];

  for (const r of results) {
    if (r.passed) {
      passed.push({
        ruleId: r.ruleId,
        category: r.category,
        page: facts.url,
        title: r.title,
        evidence: r.evidence,
      });
    } else {
      issues.push({
        ruleId: r.ruleId,
        category: r.category,
        page: facts.url,
        title: r.title,
        evidence: r.evidence,
        impact: r.impact,
        severity: r.severity,
        effort: r.effort,
        fix: r.fix,
        priorityScore: priorityScore(r.severity, r.effort),
      });
    }
  }

  const scores = {} as Record<CategoryId, number>;
  for (const cat of CATEGORY_IDS) {
    const catResults = results.filter((r) => r.category === cat);
    const penalty = catResults
      .filter((r) => !r.passed)
      .reduce((sum, r) => sum + SEVERITY_WEIGHT[r.severity], 0);
    const cap = catResults.length * 30;
    scores[cat] = Math.max(0, Math.round(100 - (penalty / Math.max(1, cap)) * 100 * 1.6));
  }

  const score = Math.round(
    CATEGORY_IDS.reduce((sum, c) => sum + scores[c], 0) / CATEGORY_IDS.length,
  );

  return { issues, passed, scores, score };
}

/** Same-origin links found in the page, used for crawling. */
export function extractLinks(page: PageSnapshot, limit: number): string[] {
  if (!page.html) return [];
  let origin: URL;
  try {
    origin = new URL(page.finalUrl);
  } catch {
    return [];
  }
  const found = new Set<string>();
  for (const match of page.html.matchAll(/<a[^>]+href=["']([^"'#]+)["']/gi)) {
    const href = match[1];
    if (!href) continue;
    if (/^(mailto:|tel:|javascript:|data:)/i.test(href)) continue;
    let resolved: URL;
    try {
      resolved = new URL(href, origin);
    } catch {
      continue;
    }
    if (resolved.hostname !== origin.hostname) continue;
    if (/\.(pdf|jpg|jpeg|png|gif|svg|webp|zip|mp4|css|js|xml|ico)$/i.test(resolved.pathname)) continue;
    resolved.hash = "";
    resolved.search = "";
    const clean = resolved.toString().replace(/\/$/, "") || resolved.toString();
    if (clean === page.finalUrl.replace(/\/$/, "")) continue;
    found.add(clean);
    if (found.size >= limit) break;
  }
  return Array.from(found);
}
