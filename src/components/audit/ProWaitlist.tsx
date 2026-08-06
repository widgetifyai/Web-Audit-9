import { Check, Mail, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { joinWaitlist, listWaitlist } from "@/lib/audit-history";

interface ProWaitlistProps {
  variant?: "card" | "inline";
}

export function ProWaitlist({ variant = "card" }: ProWaitlistProps) {
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(() => listWaitlist().length > 0);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const normalized = email.trim().toLowerCase();
    if (!normalized || !normalized.includes("@")) {
      toast.error("Enter a valid email address");
      return;
    }
    joinWaitlist(normalized);
    setJoined(true);
    setEmail("");
    toast.success("You're on the list", {
      description: "We'll reach out when Pro audits are ready.",
    });
  };

  if (joined) {
    return (
      <div className={variant === "card" ? "surface-card p-6 text-center" : "inline-flex items-center gap-2"}>
        <span className="grid size-10 place-items-center rounded-full bg-success/10 text-success">
          <Check className="size-5" aria-hidden />
        </span>
        <div className={variant === "card" ? "mt-3" : ""}>
          <p className="font-semibold">You're on the Pro waitlist</p>
          <p className="text-sm text-muted-foreground">We'll notify you when advanced features ship.</p>
        </div>
      </div>
    );
  }

  if (variant === "inline") {
    return (
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <Input
          type="email"
          placeholder="you@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-10 rounded-lg"
        />
        <Button type="submit" variant="hero" size="sm">
          Join waitlist
        </Button>
      </form>
    );
  }

  return (
    <div className="surface-card p-6">
      <div className="flex items-start gap-4">
        <span className="grid size-12 place-items-center rounded-xl bg-primary/10 text-primary">
          <Sparkles className="size-6" aria-hidden />
        </span>
        <div className="flex-1">
          <h3 className="font-semibold">Unlock Pro audits</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Get competitor tracking, scheduled re-audits, team reports, and priority AI analysis.
          </p>
          <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-2 sm:flex-row">
            <div className="relative flex-1">
              <Mail
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden
              />
              <Input
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11 rounded-xl pl-9"
              />
            </div>
            <Button type="submit" variant="hero" className="h-11">
              Join waitlist
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
