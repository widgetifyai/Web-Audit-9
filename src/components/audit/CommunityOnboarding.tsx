import { Check, ExternalLink, Lock, ShieldCheck, Unlock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { COMMUNITY_STEPS, useCommunityProgress } from "@/lib/community";
import { cn } from "@/lib/utils";

export function CommunityOnboarding({
  onUnlocked,
  className,
  compact,
}: {
  onUnlocked?: () => void;
  className?: string;
  compact?: boolean;
}) {
  const { completed, hydrated, toggle, count, total, percent, unlocked } = useCommunityProgress();

  return (
    <div className={cn("surface-card p-5 sm:p-6", className)}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-lg font-bold sm:text-xl">
            Join the community to unlock your audit
          </h2>
          <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-muted-foreground">
            WebAudit is free and community-powered. Complete these six quick steps once and website
            submissions stay unlocked on this device.
          </p>
        </div>
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold",
            unlocked
              ? "border-success/40 bg-success/10 text-success"
              : "border-border bg-surface/70 text-muted-foreground",
          )}
        >
          {unlocked ? (
            <Unlock className="size-3.5" aria-hidden />
          ) : (
            <Lock className="size-3.5" aria-hidden />
          )}
          {hydrated ? `${count} of ${total} completed` : `0 of ${total} completed`}
        </span>
      </div>

      <div className="mt-4">
        <Progress
          value={hydrated ? percent : 0}
          className="h-1.5"
          aria-label={`Onboarding progress: ${count} of ${total} steps completed`}
        />
      </div>

      <ul className={cn("mt-5 grid gap-3", !compact && "sm:grid-cols-2")}>
        {COMMUNITY_STEPS.map((step) => {
          const done = hydrated && completed.includes(step.id);
          const Icon = step.icon;
          return (
            <li
              key={step.id}
              className={cn(
                "group rounded-xl border p-4 transition-all duration-200",
                done
                  ? "border-success/40 bg-success/[0.06]"
                  : "border-border bg-surface/50 hover:-translate-y-0.5 hover:border-primary/40",
              )}
            >
              <div className="flex items-start gap-3">
                <span
                  className={cn(
                    "grid size-9 shrink-0 place-items-center rounded-lg bg-background/70",
                    step.accent,
                  )}
                >
                  <Icon className="size-4" aria-hidden />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="truncate text-sm font-semibold">{step.name}</h3>
                    {done ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-success/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-success">
                        <Check className="size-3" aria-hidden /> Done
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <Button asChild size="sm" variant={done ? "ghost" : "soft"}>
                      <a
                        href={step.href}
                        target="_blank"
                        rel="noopener noreferrer nofollow"
                        onClick={() => {
                          if (!completed.includes(step.id)) toggle(step.id);
                        }}
                      >
                        {step.cta}
                        <ExternalLink className="size-3.5" aria-hidden />
                      </a>
                    </Button>
                    <button
                      type="button"
                      onClick={() => toggle(step.id)}
                      className="rounded-md px-1.5 py-1 text-xs text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      aria-pressed={done}
                    >
                      {done ? "Mark as not done" : "I've done this"}
                    </button>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="mt-6 flex flex-col gap-3 border-t border-border/60 pt-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
          <ShieldCheck className="mt-0.5 size-3.5 shrink-0 text-primary" aria-hidden />
          We can't technically verify follows on these platforms, so this runs on trust. Your
          progress is stored only in this browser.
        </p>
        <Button
          type="button"
          variant="hero"
          disabled={!unlocked}
          onClick={onUnlocked}
          className="shrink-0"
        >
          {unlocked ? "Continue to submission" : `Continue to submission (${count}/${total})`}
        </Button>
      </div>
    </div>
  );
}
