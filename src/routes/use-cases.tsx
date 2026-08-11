import { Link, createFileRoute } from "@tanstack/react-router";
import {
  Briefcase,
  Building2,
  Rocket,
  ShoppingBag,
  Store,
  UserRound,
} from "lucide-react";

import { SiteFooter } from "@/components/audit/SiteFooter";
import { SiteHeader } from "@/components/audit/SiteHeader";
import { Button } from "@/components/ui/button";

const TITLE = "WebAudit Use Cases — Founders, Agencies, Stores & Teams";
const DESCRIPTION =
  "See how founders, agencies, ecommerce stores, local businesses and in-house teams use WebAudit to find and fix what's holding their site back.";

export const Route = createFileRoute("/use-cases")({
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
  component: UseCasesPage,
});

const CASES = [
  {
    icon: Rocket,
    name: "Startup founders",
    problem: "You launched fast and you're not sure what you skipped.",
    outcome: "A pre-investor checklist showing exactly which technical debt costs you signups.",
    wins: ["Ship-blocking issues surfaced before launch", "Plain-language brief for your first dev hire"],
  },
  {
    icon: Briefcase,
    name: "Agencies & freelancers",
    problem: "Prospects ask why they should switch, and audits take you hours.",
    outcome: "A branded, shareable report you can attach to any proposal in under a minute.",
    wins: ["Turn an audit into a paid scope", "Prove improvement with a follow-up re-audit"],
  },
  {
    icon: ShoppingBag,
    name: "Ecommerce stores",
    problem: "Traffic arrives but carts stay empty and pages feel heavy.",
    outcome: "Conversion and performance scores that point at the exact friction in your funnel.",
    wins: ["Speed fixes ranked by payload impact", "CTA and trust-signal gaps on product pages"],
  },
  {
    icon: Store,
    name: "Local businesses",
    problem: "Nobody finds you in search and the site looks dated on phones.",
    outcome: "Mobile and SEO findings written for a non-technical owner to hand over.",
    wins: ["Tap-target and readability checks", "Titles, descriptions and structure fixed first"],
  },
  {
    icon: Building2,
    name: "In-house marketing teams",
    problem: "You need evidence before engineering will prioritise web work.",
    outcome: "Eight scores you can track monthly and put in front of stakeholders.",
    wins: ["Quarterly score trend as a KPI", "Shared language between marketing and dev"],
  },
  {
    icon: UserRound,
    name: "Portfolio & personal sites",
    problem: "You want it to feel professional but don't know what reviewers notice.",
    outcome: "A short list of polish items that raise perceived credibility immediately.",
    wins: ["Accessibility and contrast fixes", "Security headers and HTTPS hygiene"],
  },
];

function UseCasesPage() {
  return (
    <div className="min-h-dvh">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-5 py-14">
        <h1 className="font-display text-3xl font-bold sm:text-4xl">Who WebAudit is for</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          The same eight-category engine, framed for the decision you're actually trying to make.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CASES.map(({ icon: Icon, name, problem, outcome, wins }) => (
            <article key={name} className="surface-card flex flex-col p-6">
              <span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">
                <Icon className="size-5" aria-hidden />
              </span>
              <h2 className="mt-4 text-base font-semibold">{name}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{problem}</p>
              <p className="mt-3 text-sm leading-relaxed">{outcome}</p>
              <ul className="mt-4 space-y-1.5 text-sm text-muted-foreground">
                {wins.map((win) => (
                  <li key={win} className="flex gap-2">
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
                    {win}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Button asChild variant="hero">
            <Link to="/quiz">Find my use case in 60 seconds</Link>
          </Button>
          <Button asChild variant="soft">
            <Link to="/how-it-works">How the audit works</Link>
          </Button>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}