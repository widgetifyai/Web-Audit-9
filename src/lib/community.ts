import type { LucideIcon } from "lucide-react";
import { Instagram, Linkedin, MessageCircle, Rocket, Slack, Youtube } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

export type CommunityStepId =
  | "instagram"
  | "linkedin"
  | "whatsapp"
  | "slack"
  | "youtube"
  | "producthunt";

export interface CommunityStep {
  id: CommunityStepId;
  name: string;
  description: string;
  cta: string;
  href: string;
  icon: LucideIcon;
  /** Tailwind text color token class for the platform accent */
  accent: string;
}

export const COMMUNITY_STEPS: CommunityStep[] = [
  {
    id: "instagram",
    name: "Instagram",
    description: "Product updates, build-in-public clips and launch news.",
    cta: "Follow",
    href: "https://www.instagram.com/widgetify.ai/",
    icon: Instagram,
    accent: "text-[oklch(0.68_0.19_10)]",
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    description: "Follow the founder for deep dives on web growth.",
    cta: "Follow",
    href: "https://www.linkedin.com/in/iamadnanvv/",
    icon: Linkedin,
    accent: "text-[oklch(0.62_0.14_245)]",
  },
  {
    id: "whatsapp",
    name: "WhatsApp Channel",
    description: "Instant alerts when new audit features ship.",
    cta: "Join",
    href: "https://www.whatsapp.com/channel/0029VbC8Q1h7dmebx5VRlF1i",
    icon: MessageCircle,
    accent: "text-[oklch(0.72_0.17_150)]",
  },
  {
    id: "slack",
    name: "Slack Community",
    description: "Get your audit reviewed by other builders.",
    cta: "Join",
    href: "https://widgetifyai.slack.com/join/shared_invite/zt-45kb5wwli-D3LIBXMkz4XVsx4g2sR7cw",
    icon: Slack,
    accent: "text-[oklch(0.68_0.15_320)]",
  },
  {
    id: "youtube",
    name: "YouTube",
    description: "Walkthroughs that turn each finding into a fix.",
    cta: "Subscribe",
    href: "https://www.youtube.com/@Widgetifyai",
    icon: Youtube,
    accent: "text-[oklch(0.63_0.22_25)]",
  },
  {
    id: "producthunt",
    name: "Product Hunt",
    description: "Support the launch so more builders find us.",
    cta: "Vote",
    href: "https://www.producthunt.com/products/widgetify-2?launch=widgetify-2",
    icon: Rocket,
    accent: "text-[oklch(0.70_0.17_45)]",
  },
];

const KEY = "webaudit.community.v1";

export function readCompleted(): CommunityStepId[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    const parsed = raw ? (JSON.parse(raw) as unknown) : [];
    if (!Array.isArray(parsed)) return [];
    const ids = COMMUNITY_STEPS.map((s) => s.id) as string[];
    return parsed.filter((x): x is CommunityStepId => typeof x === "string" && ids.includes(x));
  } catch {
    return [];
  }
}

function write(ids: CommunityStepId[]) {
  window.localStorage.setItem(KEY, JSON.stringify(ids));
  window.dispatchEvent(new CustomEvent("webaudit:community"));
}

/**
 * Confirmation-based onboarding progress. There is no reliable public API to
 * verify a follow/join/subscribe on these platforms, so completion is an
 * honest self-confirmation recorded in the visitor's own browser.
 */
export function useCommunityProgress() {
  const [completed, setCompleted] = useState<CommunityStepId[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setCompleted(readCompleted());
    setHydrated(true);
    const sync = () => setCompleted(readCompleted());
    window.addEventListener("webaudit:community", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("webaudit:community", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const toggle = useCallback((id: CommunityStepId) => {
    const current = readCompleted();
    const next = current.includes(id) ? current.filter((x) => x !== id) : [...current, id];
    write(next);
    setCompleted(next);
  }, []);

  const reset = useCallback(() => {
    write([]);
    setCompleted([]);
  }, []);

  const total = COMMUNITY_STEPS.length;
  const count = completed.length;

  return {
    completed,
    hydrated,
    toggle,
    reset,
    count,
    total,
    percent: Math.round((count / total) * 100),
    unlocked: count >= total,
  };
}