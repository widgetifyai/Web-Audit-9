import type { AuditReport } from "./audit-types";

export const SAMPLE_REPORT: AuditReport = {
  id: "sample",
  url: "https://northstar-supply.com",
  title: "Northstar Supply — Industrial Equipment",
  createdAt: "2026-06-18T10:24:00.000Z",
  overallScore: 68,
  aiPowered: true,
  executiveSummary:
    "Northstar Supply has a solid technical foundation and secure hosting, but the site is losing potential customers before they reach the enquiry form. Pages load slowly on mobile connections, key product pages are missing the descriptions search engines rely on, and the primary call to action is buried below three screens of content. Fixing the five highest-priority items would meaningfully increase both organic visibility and the share of visitors who request a quote.",
  strengths: [
    "HTTPS is enforced site-wide with modern security headers in place",
    "Clean, consistent visual design that reads as credible and established",
    "Navigation labels are plain-language and easy to scan",
  ],
  weaknesses: [
    "Largest images are unoptimised, adding several seconds to mobile load time",
    "Half of the product pages share the same meta description",
    "Forms lack labels, making them hard to use with assistive technology",
  ],
  categories: [
    {
      id: "performance",
      name: "Performance",
      score: 54,
      summary: "Heavy images and render-blocking scripts slow the first meaningful paint.",
      findings: [
        "Hero image is 2.4 MB and served as an uncompressed PNG",
        "Six render-blocking scripts load before any content appears",
        "No browser caching headers on static assets",
      ],
      businessImpact:
        "Roughly one in four mobile visitors leaves before the page finishes loading, which directly reduces enquiries.",
      whyItMatters:
        "Speed is the first impression. Visitors judge credibility within a couple of seconds, and search engines factor load time into rankings.",
      improvements: [
        "Compress and convert hero imagery to WebP",
        "Defer non-essential third-party scripts",
        "Enable long-lived caching for images, fonts and CSS",
      ],
      difficulty: "Moderate",
      priority: "Critical",
    },
    {
      id: "seo",
      name: "SEO",
      score: 62,
      summary: "Indexing basics are present but page-level targeting is thin.",
      findings: [
        "12 pages share an identical meta description",
        "Two pages have no H1 heading",
        "No structured data for products or organisation",
      ],
      businessImpact:
        "Search engines cannot tell your pages apart, so the site competes with itself and ranks below competitors for buying-intent searches.",
      whyItMatters:
        "Most new customers start with a search. Distinct, descriptive pages are what earns those clicks.",
      improvements: [
        "Write a unique 150-character description for every page",
        "Add one clear H1 per page that matches search intent",
        "Add Organization and Product structured data",
      ],
      difficulty: "Easy",
      priority: "High",
    },
    {
      id: "accessibility",
      name: "Accessibility",
      score: 58,
      summary: "Several interactive elements are unusable without a mouse.",
      findings: [
        "18 images are missing alt text",
        "Contact form inputs have no associated labels",
        "Body text contrast falls below the 4.5:1 threshold in the footer",
      ],
      businessImpact:
        "Visitors using screen readers or keyboard navigation cannot complete an enquiry, and inaccessible sites carry legal exposure in several markets.",
      whyItMatters:
        "Accessibility improvements consistently help every visitor, not just those using assistive technology.",
      improvements: [
        "Add descriptive alt text to all content images",
        "Pair every form input with a visible label",
        "Raise footer text contrast to at least 4.5:1",
      ],
      difficulty: "Easy",
      priority: "High",
    },
    {
      id: "mobile",
      name: "Mobile Experience",
      score: 71,
      summary: "Layout adapts well, but tap targets and spacing need refinement.",
      findings: [
        "Navigation links sit closer than the 44px recommended tap size",
        "Product tables overflow horizontally on small screens",
      ],
      businessImpact:
        "Over 60% of visitors arrive on a phone; friction here is felt by the majority of your audience.",
      whyItMatters:
        "Mobile is the default browsing context, and awkward interactions read as carelessness.",
      improvements: [
        "Increase tap target size and spacing in the header",
        "Convert wide tables into stacked cards below 640px",
      ],
      difficulty: "Moderate",
      priority: "Medium",
    },
    {
      id: "ux",
      name: "User Experience",
      score: 74,
      summary: "Clear structure, but the path to enquiry is longer than it needs to be.",
      findings: [
        "Primary call to action appears only after three screens of scrolling",
        "No breadcrumb trail on deep product pages",
      ],
      businessImpact:
        "Visitors who are ready to buy have to hunt for the next step, and some simply leave.",
      whyItMatters:
        "Every extra decision costs conversions. Obvious next steps keep momentum.",
      improvements: [
        "Add a persistent enquiry button in the header",
        "Introduce breadcrumbs on category and product pages",
      ],
      difficulty: "Easy",
      priority: "Medium",
    },
    {
      id: "conversion",
      name: "Conversion Optimization",
      score: 61,
      summary: "The offer is credible but under-supported by proof and urgency.",
      findings: [
        "No customer testimonials or logos above the fold",
        "Quote form asks for nine fields before submission",
        "No clear response-time promise",
      ],
      businessImpact:
        "Shortening the form and adding proof typically lifts enquiry volume by 15–30% for B2B sites.",
      whyItMatters:
        "Buyers need reassurance that contacting you is low-risk and worth the effort.",
      improvements: [
        "Reduce the quote form to four essential fields",
        "Add three named customer testimonials near the CTA",
        "State a specific response time, e.g. 'We reply within one business day'",
      ],
      difficulty: "Easy",
      priority: "Critical",
    },
    {
      id: "security",
      name: "Security",
      score: 86,
      summary: "Strong transport security with a few missing hardening headers.",
      findings: [
        "HTTPS enforced with a valid certificate",
        "Content-Security-Policy header is not set",
      ],
      businessImpact:
        "Good security protects customer trust and prevents browser warnings that scare visitors away.",
      whyItMatters:
        "A single security warning can permanently damage confidence in a supplier.",
      improvements: [
        "Add a Content-Security-Policy header",
        "Enable HTTP Strict Transport Security preload",
      ],
      difficulty: "Moderate",
      priority: "Low",
    },
    {
      id: "best-practices",
      name: "Best Practices",
      score: 79,
      summary: "Modern markup with some legacy dependencies still loaded.",
      findings: [
        "Two deprecated JavaScript libraries still bundled",
        "Console errors on the checkout page",
      ],
      businessImpact:
        "Technical debt slows future changes and increases the chance of a visible breakage.",
      whyItMatters:
        "A tidy codebase means faster, cheaper improvements later.",
      improvements: [
        "Remove unused legacy libraries",
        "Resolve outstanding console errors",
      ],
      difficulty: "Moderate",
      priority: "Low",
    },
  ],
  recommendations: [
    {
      title: "Compress the hero imagery",
      problem: "The homepage hero image alone is 2.4 MB.",
      explanation:
        "On a typical mobile connection that single file takes around four seconds to arrive, and nothing meaningful appears on screen until it does.",
      solution:
        "Export the hero at the size it is actually displayed, convert it to WebP, and lazy-load everything below the fold.",
      expectedImprovement: "Roughly 2–3 seconds faster load and a noticeable drop in bounce rate.",
      priority: "Critical",
      timeToFix: "1–2 hours",
    },
    {
      title: "Shorten the quote request form",
      problem: "The enquiry form asks for nine fields before anyone can submit.",
      explanation:
        "Each additional field measurably reduces completion. Most of what you ask for can be collected during the follow-up conversation instead.",
      solution:
        "Keep name, email, company and requirement. Move everything else to the follow-up email.",
      expectedImprovement: "15–30% more completed enquiries from the same traffic.",
      priority: "Critical",
      timeToFix: "2–3 hours",
    },
    {
      title: "Give every page a unique description",
      problem: "Twelve pages share the same meta description.",
      explanation:
        "Search engines use descriptions to decide which page best answers a query. Identical text makes your own pages compete with each other.",
      solution:
        "Write a specific, benefit-led description for each page, mentioning the product or service it covers.",
      expectedImprovement: "Higher click-through from search within 4–6 weeks.",
      priority: "High",
      timeToFix: "3–4 hours",
    },
    {
      title: "Label your form fields properly",
      problem: "Contact form inputs rely on placeholder text alone.",
      explanation:
        "Placeholders vanish as soon as someone types, and screen readers cannot announce the field's purpose reliably.",
      solution:
        "Add a visible label above each input and connect it to the field programmatically.",
      expectedImprovement: "Fewer abandoned forms and a materially more accessible site.",
      priority: "High",
      timeToFix: "1 hour",
    },
    {
      title: "Add social proof near the call to action",
      problem: "There is no visible evidence that other businesses trust you.",
      explanation:
        "Buyers comparing three suppliers pick the one that feels safest. Proof is what makes that decision easy.",
      solution:
        "Place three named testimonials and a row of customer logos directly above the enquiry form.",
      expectedImprovement: "Higher enquiry quality and conversion rate on key pages.",
      priority: "Medium",
      timeToFix: "2 hours",
    },
    {
      title: "Make the enquiry button always reachable",
      problem: "The main call to action only appears far down the page.",
      explanation:
        "Visitors who are already convinced have to scroll back looking for a way to contact you.",
      solution:
        "Add a persistent button in the header and a sticky bar on mobile.",
      expectedImprovement: "Shorter path to conversion on every page.",
      priority: "Medium",
      timeToFix: "1–2 hours",
    },
  ],
};