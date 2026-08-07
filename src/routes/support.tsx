import { createFileRoute } from "@tanstack/react-router";
import { LifeBuoy, Mail, MessageSquare } from "lucide-react";

import { SiteFooter } from "@/components/audit/SiteFooter";
import { HelpVideo } from "@/components/audit/HelpVideo";
import { SiteHeader } from "@/components/audit/SiteHeader";

const TITLE = "Contact & Support — WebAudit";
const DESCRIPTION = "Get help with a WebAudit audit report, billing question or feature request.";

export const Route = createFileRoute("/support")({
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
  component: SupportPage,
});

const CHANNELS = [
  { icon: Mail, title: "Email us", copy: "support@webaudit.app — we reply within one business day." },
  { icon: MessageSquare, title: "Report an issue", copy: "Send the share link of the report and what looked wrong." },
  { icon: LifeBuoy, title: "Feature requests", copy: "Tell us which category you want analysed more deeply." },
];

function SupportPage() {
  return (
    <div className="min-h-dvh">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-5 py-16">
        <h1 className="text-4xl font-bold">Contact &amp; support</h1>
        <p className="mt-3 text-muted-foreground">
          Real people, plain answers. Here's the fastest way to reach us.
        </p>
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {CHANNELS.map(({ icon: Icon, title, copy }) => (
            <div key={title} className="surface-card p-6">
              <Icon className="size-5 text-primary" aria-hidden />
              <h2 className="mt-4 text-base font-semibold">{title}</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{copy}</p>
            </div>
          ))}
        </div>
        <section className="surface-card mt-10 flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-semibold">New here? Watch the walkthrough</h2>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
              A 23-second tour of running an audit, reading the report and sharing your score.
            </p>
          </div>
          <HelpVideo label="Play tutorial" variant="hero" />
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}