import { createFileRoute } from "@tanstack/react-router";

import { SiteFooter } from "@/components/audit/SiteFooter";
import { SiteHeader } from "@/components/audit/SiteHeader";

const TITLE = "Terms of Service — Widgetify";
const DESCRIPTION = "The terms that apply when you use the Widgetify website audit tool.";

export const Route = createFileRoute("/terms")({
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
  component: TermsPage,
});

function TermsPage() {
  return (
    <div className="min-h-dvh">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-5 py-16">
        <h1 className="text-4xl font-bold">Terms of Service</h1>
        <div className="mt-8 space-y-8 text-base leading-relaxed text-muted-foreground">
          <section>
            <h2 className="text-xl font-semibold text-foreground">Acceptable use</h2>
            <p className="mt-2">
              Audit websites you own or have permission to analyse. Do not use Widgetify to place
              unreasonable load on third-party servers or to gather data for abusive purposes.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-foreground">Nature of the reports</h2>
            <p className="mt-2">
              Reports are automated guidance based on signals observed at the moment of the audit.
              They are informational, not a guarantee of ranking, revenue or compliance outcomes.
              Always validate changes before deploying them to a production site.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-foreground">Availability</h2>
            <p className="mt-2">
              The service is provided as-is. We may change or interrupt features at any time, and
              we are not liable for losses arising from use of the reports.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-foreground">Contact</h2>
            <p className="mt-2">Questions about these terms: legal@widgetify.app.</p>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}