import { Link, createFileRoute } from "@tanstack/react-router";
import {
  Accessibility,
  BadgeCheck,
  Gauge,
  Lock,
  MousePointerClick,
  Search,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Target,
  Timer,
  Zap,
} from "lucide-react";

import { AuditForm } from "@/components/audit/AuditForm";
import { BrowserMockup } from "@/components/audit/BrowserMockup";
import { CommunityShowcase } from "@/components/audit/CommunityShowcase";
import { ProWaitlist } from "@/components/audit/ProWaitlist";
import { SiteFooter } from "@/components/audit/SiteFooter";
import { SiteHeader } from "@/components/audit/SiteHeader";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const TITLE = "WebAudit — AI Website Audit in Under a Minute";
const DESCRIPTION =
  "Analyze any website and get an actionable report covering performance, SEO, accessibility, mobile, UX, conversion and security.";

export const Route = createFileRoute("/")({
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
  component: Index,
});

const CATEGORIES = [
  { icon: Zap, name: "Performance", copy: "Load speed, payload weight and render blockers." },
  { icon: Search, name: "SEO", copy: "Titles, descriptions, headings and structured data." },
  { icon: Accessibility, name: "Accessibility", copy: "Alt text, labels, contrast and semantics." },
  { icon: Smartphone, name: "Mobile Experience", copy: "Responsive layout and tap-target comfort." },
  { icon: MousePointerClick, name: "User Experience", copy: "Clarity, navigation and content depth." },
  { icon: Target, name: "Conversion", copy: "Calls to action, forms and persuasive proof." },
  { icon: ShieldCheck, name: "Security", copy: "HTTPS, HSTS and hardening headers." },
  { icon: BadgeCheck, name: "Best Practices", copy: "Markup hygiene and technical debt." },
];

const TRUST = [
  { icon: Sparkles, title: "Powered by GPT-5.6-Sol", copy: "Real signals from your live site, interpreted in plain English by OpenAI's GPT-5.6-Sol." },
  { icon: Target, title: "Actionable recommendations", copy: "Every finding comes with a specific next step, not a vague warning." },
  { icon: Gauge, title: "Business-focused insights", copy: "We explain what each issue costs you, not just what it is." },
  { icon: Timer, title: "Fast report generation", copy: "A full eight-category report in well under a minute." },
  { icon: Lock, title: "Privacy-first approach", copy: "We only read publicly available pages. Reports stay on your device." },
  { icon: BadgeCheck, title: "No unnecessary complexity", copy: "One input, one report. No dashboards to learn." },
];

const FAQS = [
  {
    q: "How does the audit work?",
    a: "You give us a public web address. We fetch the page exactly as a visitor's browser would, measure dozens of technical and content signals, then use OpenAI's GPT-5.6-Sol model to turn those measurements into a prioritised, plain-language report across eight categories.",
  },
  {
    q: "How long does an audit take?",
    a: "Most audits finish in under a minute. Larger or slower sites can take a little longer because we wait for the real server response rather than guessing.",
  },
  {
    q: "Is my website data private?",
    a: "We only read pages that are already public. Nothing is stored on our servers, and your finished reports are saved locally in your own browser until you choose to share them.",
  },
  {
    q: "Can I audit multiple websites?",
    a: "Yes. Run as many audits as you like. Every report is kept in your history so you can search, compare and revisit them.",
  },
  {
    q: "What happens after the audit?",
    a: "You get a prioritised action list. Start at the top: critical items usually take a couple of hours each and deliver the largest measurable improvement.",
  },
];

function Index() {
  return (
    <div className="min-h-dvh">
      <SiteHeader />

      <main>
        <section className="hero-glow relative overflow-hidden">
          <div className="mx-auto max-w-6xl px-5 pb-20 pt-16 sm:pt-24">
            <div className="mx-auto max-w-3xl text-center">
              <span className="inline-flex animate-rise items-center gap-2 rounded-full border border-border bg-surface/70 px-3.5 py-1.5 text-xs font-medium text-muted-foreground">
                <Sparkles className="size-3.5 text-primary" aria-hidden />
                Website audits powered by GPT-5.6-Sol
              </span>
              <h1 className="mt-6 animate-rise text-4xl font-bold leading-[1.08] sm:text-6xl">
                Know Exactly What's{" "}
                <span className="text-gradient">Holding Your Website Back.</span>
              </h1>
              <p className="mx-auto mt-6 max-w-2xl animate-rise text-base leading-relaxed text-muted-foreground sm:text-lg">
                Analyze your website in under a minute and receive a detailed report covering
                performance, SEO, accessibility, user experience, security, and conversion
                opportunities.
              </p>
            </div>

            <div className="mx-auto mt-10 max-w-2xl animate-rise">
              <AuditForm />
              <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
                <Button asChild variant="soft" size="sm">
                  <Link to="/report/$id" params={{ id: "sample" }}>
                    View Sample Report
                  </Link>
                </Button>
                <span className="text-xs text-muted-foreground">
                  No account needed · No credit card
                </span>
              </div>
            </div>

            <div className="mx-auto mt-16 max-w-3xl animate-rise">
              <BrowserMockup />
            </div>
          </div>
        </section>

        <section className="border-t border-border/60 py-20">
          <div className="mx-auto max-w-6xl px-5">
            <h2 className="max-w-2xl text-3xl font-bold sm:text-4xl">
              Eight categories. One clear score.
            </h2>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              Every audit grades your site across the areas that actually change how many visitors
              you win — and keep.
            </p>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {CATEGORIES.map(({ icon: Icon, name, copy }) => (
                <div
                  key={name}
                  className="surface-card p-5 transition-transform duration-200 hover:-translate-y-1"
                >
                  <span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <h3 className="mt-4 text-base font-semibold">{name}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{copy}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-border/60 bg-surface/30 py-20">
          <div className="mx-auto max-w-6xl px-5">
            <h2 className="max-w-2xl text-3xl font-bold sm:text-4xl">
              Built to be trusted, not just impressive.
            </h2>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {TRUST.map(({ icon: Icon, title, copy }) => (
                <div key={title} className="surface-card p-6">
                  <Icon className="size-5 text-primary" aria-hidden />
                  <h3 className="mt-4 text-base font-semibold">{title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{copy}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <CommunityShowcase />

        <section className="border-t border-border/60 bg-surface/30 py-20">
          <div className="mx-auto max-w-6xl px-5">
            <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
              <div>
                <h2 className="max-w-2xl text-3xl font-bold sm:text-4xl">Grow as you audit</h2>
                <p className="mt-3 max-w-2xl text-muted-foreground">
                  Complete audits, share reports, and join the community to unlock achievements and
                  track your progress.
                </p>
              </div>
              <Button asChild variant="hero">
                <Link to="/achievements">View achievements</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="border-t border-border/60 py-20">
          <div className="mx-auto grid max-w-6xl gap-10 px-5 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
            <div>
              <h2 className="text-3xl font-bold sm:text-4xl">Frequently asked questions</h2>
              <p className="mt-3 text-muted-foreground">
                Still unsure? Take a look at a{" "}
                <Link
                  to="/report/$id"
                  params={{ id: "sample" }}
                  className="text-primary underline-offset-4 hover:underline"
                >
                  full sample report
                </Link>
                .
              </p>
            </div>
            <Accordion type="single" collapsible className="space-y-3">
              {FAQS.map((faq) => (
                <AccordionItem
                  key={faq.q}
                  value={faq.q}
                  className="surface-card border-b-0 px-6"
                >
                  <AccordionTrigger className="py-5 text-left text-base font-semibold hover:no-underline">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="pb-5 text-sm leading-relaxed text-muted-foreground">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        <ProWaitlist />
      </main>

      <SiteFooter />
    </div>
  );
}
