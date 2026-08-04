import { createFileRoute } from "@tanstack/react-router";

import { SiteFooter } from "@/components/audit/SiteFooter";
import { SiteHeader } from "@/components/audit/SiteHeader";

const TITLE = "About Widgetify — Website Audits Without the Jargon";
const DESCRIPTION =
  "Widgetify turns technical website measurements into clear, prioritised actions for founders, marketers and developers.";

export const Route = createFileRoute("/about")({
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
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="min-h-dvh">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-5 py-16">
        <h1 className="text-4xl font-bold">About Widgetify</h1>
        <div className="mt-6 space-y-5 text-base leading-relaxed text-muted-foreground">
          <p>
            Most website audit tools produce a wall of technical warnings and leave you to work out
            what matters. Widgetify exists to do the opposite: measure carefully, then explain
            plainly.
          </p>
          <p>
            We fetch your page exactly as a visitor's browser would, measure dozens of real signals
            across performance, SEO, accessibility, mobile experience, user experience, conversion,
            security and technical hygiene, and use AI to translate those measurements into a
            prioritised action list written for decision-makers.
          </p>
          <p>
            The result is a report you can hand to a developer, an agency or a marketing lead and
            have everyone agree on what to fix first.
          </p>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}