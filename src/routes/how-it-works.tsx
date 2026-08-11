import { Link, createFileRoute } from "@tanstack/react-router";
import { BrainCircuit, Download, Globe, ListChecks, Radar } from "lucide-react";

import { SiteFooter } from "@/components/audit/SiteFooter";
import { SiteHeader } from "@/components/audit/SiteHeader";
import { Button } from "@/components/ui/button";

const TITLE = "How WebAudit Works — From URL to Action Plan";
const DESCRIPTION =
  "See exactly how WebAudit fetches your page, measures eight categories of real signals and turns them into a prioritised plan with GPT-5.6-Sol.";

export const Route = createFileRoute("/how-it-works")({
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
  component: HowItWorksPage,
});

const STEPS = [
  {
    icon: Globe,
    title: "You paste a public URL",
    copy: "No plugin, no script, no account. If a visitor can open the page, we can measure it.",
    detail: "We request the page exactly as a real browser would, including headers and redirects.",
  },
  {
    icon: Radar,
    title: "We measure real signals",
    copy: "Dozens of checks across performance, SEO, accessibility, mobile, UX, conversion, security and technical hygiene.",
    detail: "Response timing, payload weight, meta tags, heading structure, alt coverage, viewport, HTTPS and security headers.",
  },
  {
    icon: BrainCircuit,
    title: "GPT-5.6-Sol interprets them",
    copy: "OpenAI's GPT-5.6-Sol converts raw measurements into plain-language findings with business impact.",
    detail: "The model never invents metrics — it only explains and prioritises what we actually measured.",
  },
  {
    icon: ListChecks,
    title: "You get a ranked action list",
    copy: "Eight category scores, one overall score, and every finding paired with a specific next step.",
    detail: "Critical items sit at the top so a single afternoon of work delivers the biggest measurable lift.",
  },
  {
    icon: Download,
    title: "Share, print or re-audit",
    copy: "Send the report to a developer or agency, export it, and re-run later to prove the change worked.",
    detail: "Reports are stored in your own browser and shared only through links you generate.",
  },
];

function HowItWorksPage() {
  return (
    <div className="min-h-dvh">
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-5 py-14">
        <h1 className="font-display text-3xl font-bold sm:text-4xl">How WebAudit works</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Five steps, under a minute, zero setup. Here is exactly what happens between pasting a URL
          and reading your action plan.
        </p>

        <ol className="mt-10 space-y-4">
          {STEPS.map(({ icon: Icon, title, copy, detail }, index) => (
            <li key={title} className="surface-card flex gap-4 p-5 sm:p-6">
              <div className="flex flex-col items-center gap-2">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="size-5" aria-hidden />
                </span>
                <span className="text-xs font-semibold text-muted-foreground">0{index + 1}</span>
              </div>
              <div>
                <h2 className="text-base font-semibold">{title}</h2>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{copy}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground/80">{detail}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Button asChild variant="hero">
            <Link to="/">Run my first audit</Link>
          </Button>
          <Button asChild variant="soft">
            <Link to="/report/$id" params={{ id: "sample" }}>
              See a sample report
            </Link>
          </Button>
          <Button asChild variant="ghost">
            <Link to="/use-cases">Who it's for</Link>
          </Button>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}