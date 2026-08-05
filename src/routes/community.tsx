import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Heart, MessagesSquare, Users } from "lucide-react";

import { CommunityOnboarding } from "@/components/audit/CommunityOnboarding";
import { SiteFooter } from "@/components/audit/SiteFooter";
import { SiteHeader } from "@/components/audit/SiteHeader";
import { Button } from "@/components/ui/button";

const TITLE = "Community Onboarding — WebAudit by Widgetify";
const DESCRIPTION =
  "Complete six quick community steps to unlock free AI website audits and join the Widgetify builder community.";

export const Route = createFileRoute("/community")({
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
  component: CommunityPage,
});

const PERKS = [
  { icon: Users, title: "Peer reviews", copy: "Share a report and get real feedback from builders." },
  { icon: MessagesSquare, title: "Feature drops", copy: "Hear about new audit checks the day they ship." },
  { icon: Heart, title: "Free forever", copy: "Community support keeps every audit free to run." },
];

function CommunityPage() {
  return (
    <div className="min-h-dvh">
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-5 py-14">
        <h1 className="font-display text-3xl font-bold sm:text-4xl">
          Unlock audits by joining the community
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          WebAudit is built and funded by the Widgetify community. Six quick steps, once, and
          website submissions stay unlocked.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {PERKS.map(({ icon: Icon, title, copy }) => (
            <div key={title} className="surface-card p-5">
              <Icon className="size-5 text-primary" aria-hidden />
              <h2 className="mt-3 text-sm font-semibold">{title}</h2>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{copy}</p>
            </div>
          ))}
        </div>

        <CommunityOnboarding className="mt-8" />

        <div className="mt-8">
          <Button asChild variant="soft">
            <Link to="/">
              Back to the audit form
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </Button>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
