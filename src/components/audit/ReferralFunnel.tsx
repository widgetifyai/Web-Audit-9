import { Check, Copy, Gift, Lock, Share2, Trophy } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { REFERRAL_TIERS, nextTier, referralLink, useReferral } from "@/lib/referral";
import { cn } from "@/lib/utils";

export function ReferralFunnel({ className }: { className?: string }) {
  const { state, recordShare } = useReferral();
  const [copied, setCopied] = useState(false);

  const link = state ? referralLink(state.code) : "";
  const count = state?.referrals ?? 0;
  const upcoming = nextTier(count);
  const target = upcoming?.count ?? REFERRAL_TIERS[REFERRAL_TIERS.length - 1]!.count;
  const progress = Math.min(100, Math.round((count / target) * 100));

  async function copy() {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      recordShare();
      toast.success("Invite link copied");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Copy failed — select the link manually.");
    }
  }

  function share() {
    const text = `I just audited my website with WebAudit — free AI report in under a minute. ${link}`;
    if (typeof navigator !== "undefined" && navigator.share) {
      navigator
        .share({ title: "WebAudit", text, url: link })
        .then(() => recordShare())
        .catch(() => undefined);
      return;
    }
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
      "_blank",
      "noopener,noreferrer",
    );
    recordShare();
  }

  return (
    <div className={cn("surface-card p-6 sm:p-8", className)}>
      <div className="flex flex-wrap items-center gap-3">
        <span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">
          <Gift className="size-5" aria-hidden />
        </span>
        <div>
          <h2 className="font-display text-xl font-bold">Your invite link</h2>
          <p className="text-sm text-muted-foreground">
            Every builder you bring moves you up a reward tier.
          </p>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Input readOnly value={link} aria-label="Your referral link" className="font-mono text-sm" />
        <div className="flex gap-2">
          <Button onClick={copy} variant="hero" className="flex-1 sm:flex-none">
            {copied ? <Check className="size-4" aria-hidden /> : <Copy className="size-4" aria-hidden />}
            {copied ? "Copied" : "Copy"}
          </Button>
          <Button onClick={share} variant="soft" className="flex-1 sm:flex-none">
            <Share2 className="size-4" aria-hidden />
            Share
          </Button>
        </div>
      </div>

      <div className="mt-7">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">
            {count} invite{count === 1 ? "" : "s"} sent
          </span>
          <span className="text-muted-foreground">
            {upcoming ? `${upcoming.count - count} to ${upcoming.name}` : "All tiers unlocked"}
          </span>
        </div>
        <Progress value={progress} className="mt-3 h-2" />
      </div>

      <ul className="mt-6 space-y-3">
        {REFERRAL_TIERS.map((tier) => {
          const unlocked = count >= tier.count;
          return (
            <li
              key={tier.name}
              className={cn(
                "flex items-start gap-3 rounded-xl border p-4",
                unlocked ? "border-primary/50 bg-primary/5" : "border-border/60",
              )}
            >
              <span
                className={cn(
                  "grid size-8 shrink-0 place-items-center rounded-lg",
                  unlocked ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground",
                )}
              >
                {unlocked ? <Trophy className="size-4" aria-hidden /> : <Lock className="size-4" aria-hidden />}
              </span>
              <div>
                <p className="text-sm font-semibold">
                  {tier.count} invite{tier.count === 1 ? "" : "s"} · {tier.name}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{tier.reward}</p>
              </div>
            </li>
          );
        })}
      </ul>

      {state?.referredBy ? (
        <p className="mt-6 rounded-xl border border-border/60 bg-surface/40 p-4 text-sm text-muted-foreground">
          You arrived through invite code{" "}
          <span className="font-mono font-medium text-foreground">{state.referredBy}</span> — thanks for
          joining.
        </p>
      ) : null}

      <p className="mt-6 text-xs text-muted-foreground">
        Invite progress is tracked privately in your browser. No account, no tracking pixels.
      </p>
    </div>
  );
}