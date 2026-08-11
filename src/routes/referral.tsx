import { Link, createFileRoute } from "@tanstack/react-router";
import { Megaphone, Repeat, Users } from "lucide-react";

import { ReferralFunnel } from "@/components/audit/ReferralFunnel";
import { SiteFooter } from "@/components/audit/SiteFooter";
import { SiteHeader } from "@/components/audit/SiteHeader";
import { Button } from "@/components/ui/button";

const TITLE = "Refer WebAudit — Unlock Rewards for Every Invite";
const DESCRIPTION =
  "Share your WebAudit invite link, help other builders fix their websites and unlock directory placement, branded share cards and early features.";

export const Route = createFileRoute("/referral")({
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
  component: ReferralPage,
});

const STEPS = [
  {
    icon: Megaphone,
    title: "1. Share your link",
    copy: "Copy your unique invite link or post it straight to your feed in one tap.",
  },
  {
    icon: Users,
    title: "2. They run a free audit",
    copy: "Your invite lands them on a report in under a minute — no account required.",
  },
  {
    icon: Repeat,
    title: "3. You both level up",
    copy: "Each invite moves you up a reward tier and keeps every audit free for the community.",
  },
];

function ReferralPage() {
  return (
    <div className="min-h-dvh">
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-5 py-14">
        <h1 className="font-display text-3xl font-bold sm:text-4xl">
          Grow WebAudit, unlock rewards
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          WebAudit stays free because builders share it. Every person you bring unlocks a new perk
          for your own reports.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {STEPS.map(({ icon: Icon, title, copy }) => (
            <div key={title} className="surface-card p-5">
              <Icon className="size-5 text-primary" aria-hidden />
              <h2 className="mt-3 text-sm font-semibold">{title}</h2>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{copy}</p>
            </div>
          ))}
        </div>

        <ReferralFunnel className="mt-8" />

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button asChild variant="hero">
            <Link to="/">Run an audit to share</Link>
          </Button>
          <Button asChild variant="soft">
            <Link to="/quiz">Take the growth quiz</Link>
          </Button>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}