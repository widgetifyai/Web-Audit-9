import { Link, createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, CircleDashed, Loader2 } from "lucide-react";

import { SiteFooter } from "@/components/audit/SiteFooter";
import { SiteHeader } from "@/components/audit/SiteHeader";
import { Button } from "@/components/ui/button";

const TITLE = "WebAudit Product Roadmap — What's Shipped and What's Next";
const DESCRIPTION =
  "Track what WebAudit has shipped, what's in progress and what's planned next across audits, sharing, community and reporting.";

export const Route = createFileRoute("/roadmap")({
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
  component: RoadmapPage,
});

type Status = "shipped" | "building" | "planned";

const STATUS_META: Record<Status, { label: string; icon: typeof CheckCircle2; className: string }> = {
  shipped: { label: "Shipped", icon: CheckCircle2, className: "border-primary/50 bg-primary/10 text-primary" },
  building: { label: "In progress", icon: Loader2, className: "border-border bg-surface/60 text-foreground" },
  planned: { label: "Planned", icon: CircleDashed, className: "border-border/60 bg-transparent text-muted-foreground" },
};

const PHASES: { period: string; status: Status; items: { title: string; copy: string }[] }[] = [
  {
    period: "Shipped",
    status: "shipped",
    items: [
      { title: "Eight-category audit engine", copy: "Performance, SEO, accessibility, mobile, UX, conversion, security and best practices." },
      { title: "GPT-5.6-Sol reporting", copy: "Plain-language findings with business impact and a prioritised action list." },
      { title: "Report history & sharing", copy: "Local history, shareable report links, score badges and branded share cards." },
      { title: "Community onboarding & directory", copy: "Six-step unlock flow plus a public directory of audited sites." },
      { title: "Emailed reports", copy: "A branded summary lands in your inbox as soon as the report finalises." },
    ],
  },
  {
    period: "Now building",
    status: "building",
    items: [
      { title: "Growth quiz & referral funnel", copy: "Personalised recommendations and tiered rewards for inviting other builders." },
      { title: "Multi-page crawling", copy: "Audit a handful of key pages instead of one, with a combined site score." },
      { title: "Score trend charts", copy: "Visualise how each category moves across repeat audits." },
    ],
  },
  {
    period: "Next up",
    status: "planned",
    items: [
      { title: "Competitor comparison", copy: "Run your site next to a rival and see the score gap per category." },
      { title: "Scheduled monitoring", copy: "Weekly automatic re-audits with an alert when a score drops." },
      { title: "White-label agency reports", copy: "Your logo, your colours, exportable as a client-ready PDF." },
      { title: "Team workspaces", copy: "Shared history, assigned findings and per-owner progress." },
    ],
  },
];

function RoadmapPage() {
  return (
    <div className="min-h-dvh">
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-5 py-14">
        <h1 className="font-display text-3xl font-bold sm:text-4xl">Product roadmap</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          WebAudit is built in the open with the Widgetify community. Here's what exists today and
          what we're working towards.
        </p>

        <div className="mt-10 space-y-10">
          {PHASES.map((phase) => {
            const meta = STATUS_META[phase.status];
            const Icon = meta.icon;
            return (
              <section key={phase.period}>
                <div className="flex items-center gap-3">
                  <h2 className="font-display text-xl font-bold">{phase.period}</h2>
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${meta.className}`}
                  >
                    <Icon className="size-3.5" aria-hidden />
                    {meta.label}
                  </span>
                </div>
                <ul className="mt-4 space-y-3 border-l border-border/60 pl-5">
                  {phase.items.map((item) => (
                    <li key={item.title} className="relative">
                      <span
                        className="absolute -left-[26px] top-2 size-2 rounded-full bg-primary/70"
                        aria-hidden
                      />
                      <p className="text-sm font-semibold">{item.title}</p>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.copy}</p>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>

        <div className="mt-12 surface-card p-6">
          <h2 className="text-base font-semibold">Shape what ships next</h2>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Roadmap priority follows community demand. Tell us what you need in the Widgetify Slack
            or WhatsApp channel.
          </p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <Button asChild variant="hero">
              <Link to="/community">Join the community</Link>
            </Button>
            <Button asChild variant="soft">
              <Link to="/referral">Refer a builder</Link>
            </Button>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}