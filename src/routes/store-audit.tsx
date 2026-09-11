import { Link, createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  BadgeCheck,
  CreditCard,
  Gauge,
  LineChart,
  PackageSearch,
  Search,
  ShieldCheck,
  ShoppingCart,
  Smartphone,
  Sparkles,
  Truck,
} from "lucide-react";

import { AuditForm } from "@/components/audit/AuditForm";
import { SiteFooter } from "@/components/audit/SiteFooter";
import { SiteHeader } from "@/components/audit/SiteHeader";
import { Button } from "@/components/ui/button";

const TITLE = "Online Store Audit — Fix What Costs You Sales | WebAudit";
const DESCRIPTION =
  "A dedicated ecommerce audit for online stores: product pages, checkout friction, speed, trust signals, mobile buying and search visibility, scored and prioritised.";

export const Route = createFileRoute("/store-audit")({
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
  component: StoreAuditPage,
});

const ANALYSED = [
  {
    icon: PackageSearch,
    title: "Product pages",
    copy: "Titles, descriptions, imagery, alt text, pricing clarity and product structured data.",
  },
  {
    icon: ShoppingCart,
    title: "Cart & checkout friction",
    copy: "Steps to purchase, form fields, guest checkout, error handling and abandonment triggers.",
  },
  {
    icon: Gauge,
    title: "Store speed",
    copy: "Load time, payload weight and render blockers on the pages that carry your revenue.",
  },
  {
    icon: Smartphone,
    title: "Mobile buying experience",
    copy: "Tap targets, sticky buy buttons, image sizing and thumb-reach navigation.",
  },
  {
    icon: Search,
    title: "Ecommerce & AI search visibility",
    copy: "Category structure, canonical handling, metadata and how assistants can quote your catalogue.",
  },
  {
    icon: ShieldCheck,
    title: "Trust & security signals",
    copy: "HTTPS, hardening headers, payment badges, reviews, returns and contact transparency.",
  },
  {
    icon: CreditCard,
    title: "Conversion & CRO",
    copy: "Calls to action, urgency, upsells, social proof and where buyers hesitate.",
  },
  {
    icon: Truck,
    title: "Shipping & policy clarity",
    copy: "Delivery expectations, returns policy and the answers buyers look for before paying.",
  },
];

const BENEFITS = [
  {
    icon: LineChart,
    title: "Revenue-first priorities",
    copy: "Findings are ranked by likely impact on sales, not by how technical they sound.",
  },
  {
    icon: Sparkles,
    title: "Plain-language fixes",
    copy: "Each issue comes with evidence from your own store and a specific next step.",
  },
  {
    icon: BadgeCheck,
    title: "Works with any platform",
    copy: "Shopify, WooCommerce, Wix, custom builds — we read your live store like a shopper does.",
  },
];

const PROCESS = [
  { step: "1", title: "Share your store URL", copy: "Paste your storefront address. No install, no plugin, no account." },
  { step: "2", title: "We read your live store", copy: "We fetch key pages exactly as a shopper's browser would and measure real signals." },
  { step: "3", title: "Deterministic checks run", copy: "Dozens of ecommerce-specific rules produce measured evidence, not guesses." },
  { step: "4", title: "AI interprets the findings", copy: "Signals are turned into problem, evidence, impact, severity and fix." },
  { step: "5", title: "You get a ranked action plan", copy: "Start at the top and work down — biggest sales impact first." },
];

const OUTCOMES = [
  "A scored report across speed, SEO, accessibility, trust, mobile and conversion",
  "A prioritised list of what is costing you orders right now",
  "Specific fixes your developer or agency can action the same week",
  "A shareable report link and history so you can prove the improvement",
];

function StoreAuditPage() {
  return (
    <div className="min-h-dvh">
      <SiteHeader />
      <main>
        <section className="hero-glow relative overflow-hidden border-b border-border/60">
          <div className="mx-auto max-w-6xl px-5 pb-16 pt-16 sm:pt-20">
            <div className="mx-auto max-w-3xl text-center">
              <span className="inline-flex animate-rise items-center gap-2 rounded-full border border-border bg-surface/70 px-3.5 py-1.5 text-xs font-medium text-muted-foreground">
                <ShoppingCart className="size-3.5 text-primary" aria-hidden />
                Built for online stores
              </span>
              <h1 className="mt-6 animate-rise text-4xl font-bold leading-[1.08] sm:text-5xl">
                Find Exactly Where Your Store{" "}
                <span className="text-gradient">Loses Sales.</span>
              </h1>
              <p className="mx-auto mt-6 max-w-2xl animate-rise text-base leading-relaxed text-muted-foreground sm:text-lg">
                The Online Store Audit examines your product pages, checkout flow, speed, trust
                signals and search visibility, then hands you a ranked list of fixes that move
                revenue.
              </p>
            </div>
            <div className="mx-auto mt-10 max-w-2xl animate-rise">
              <AuditForm />
              <p className="mt-3 text-center text-xs text-muted-foreground">
                Paste your storefront URL to start your Online Store Audit — free, no account needed.
              </p>
            </div>
          </div>
        </section>

        <section className="border-b border-border/60 py-20">
          <div className="mx-auto max-w-6xl px-5">
            <h2 className="max-w-2xl text-3xl font-bold sm:text-4xl">Why store owners run it</h2>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              Traffic is expensive. This audit makes sure the visitors you already pay for actually
              reach checkout.
            </p>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {BENEFITS.map(({ icon: Icon, title, copy }) => (
                <div key={title} className="surface-card p-6">
                  <Icon className="size-5 text-primary" aria-hidden />
                  <h3 className="mt-4 text-base font-semibold">{title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{copy}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-border/60 bg-surface/30 py-20">
          <div className="mx-auto max-w-6xl px-5">
            <h2 className="max-w-2xl text-3xl font-bold sm:text-4xl">What we analyse</h2>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              Every check is measured against your live store, with the evidence shown in the report.
            </p>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {ANALYSED.map(({ icon: Icon, title, copy }) => (
                <div
                  key={title}
                  className="surface-card p-5 transition-transform duration-200 hover:-translate-y-1"
                >
                  <span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <h3 className="mt-4 text-base font-semibold">{title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{copy}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-border/60 py-20">
          <div className="mx-auto grid max-w-6xl gap-10 px-5 lg:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold sm:text-4xl">The audit process</h2>
              <ol className="mt-8 space-y-5 border-l border-border/60 pl-6">
                {PROCESS.map((item) => (
                  <li key={item.step} className="relative">
                    <span
                      className="absolute -left-[31px] grid size-6 place-items-center rounded-full bg-primary/15 text-xs font-semibold text-primary"
                      aria-hidden
                    >
                      {item.step}
                    </span>
                    <p className="text-sm font-semibold">{item.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.copy}</p>
                  </li>
                ))}
              </ol>
            </div>
            <div className="surface-card h-fit p-6 sm:p-8">
              <h2 className="text-xl font-bold">What you walk away with</h2>
              <ul className="mt-5 space-y-3">
                {OUTCOMES.map((line) => (
                  <li key={line} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
                    <BadgeCheck className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
                    {line}
                  </li>
                ))}
              </ul>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Button asChild variant="hero" className="flex-1">
                  <Link to="/store-audit" hash="top">
                    Start my store audit
                    <ArrowRight className="size-4" aria-hidden />
                  </Link>
                </Button>
                <Button asChild variant="soft" className="flex-1">
                  <Link to="/report/$id" params={{ id: "sample" }}>
                    See a sample report
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-surface/30 py-20">
          <div className="mx-auto max-w-3xl px-5 text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">Ready to audit your store?</h2>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
              It takes under a minute and costs nothing. You will know exactly what to fix first.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Button asChild variant="hero" size="lg">
                <Link to="/store-audit" hash="top">
                  Request an Online Store Audit
                  <ArrowRight className="size-4" aria-hidden />
                </Link>
              </Button>
              <Button asChild variant="soft" size="lg">
                <Link to="/how-it-works">How it works</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
