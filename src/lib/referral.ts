import { useCallback, useEffect, useState } from "react";

export interface ReferralState {
  code: string;
  referrals: number;
  referredBy?: string;
}

export interface ReferralTier {
  count: number;
  name: string;
  reward: string;
}

export const REFERRAL_TIERS: ReferralTier[] = [
  { count: 1, name: "Advocate", reward: "Your audits get a permanent shareable report link." },
  { count: 3, name: "Connector", reward: "Priority placement in the public audit directory." },
  { count: 5, name: "Amplifier", reward: "Branded share cards with your own logo lockup." },
  { count: 10, name: "Partner", reward: "Early access to every new audit category we ship." },
];

const KEY = "webaudit.referral";

function makeCode(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < 6; i += 1) {
    out += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return out;
}

function read(): ReferralState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as ReferralState) : null;
  } catch {
    return null;
  }
}

function write(state: ReferralState): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* storage unavailable */
  }
}

export function referralLink(code: string): string {
  const origin = typeof window === "undefined" ? "" : window.location.origin;
  return `${origin}/?ref=${code}`;
}

export function nextTier(count: number): ReferralTier | undefined {
  return REFERRAL_TIERS.find((tier) => tier.count > count);
}

export function unlockedTiers(count: number): ReferralTier[] {
  return REFERRAL_TIERS.filter((tier) => tier.count <= count);
}

/** Client-only referral state. Codes and counts live in this browser. */
export function useReferral() {
  const [state, setState] = useState<ReferralState | null>(null);

  useEffect(() => {
    let current = read();
    if (!current) {
      current = { code: makeCode(), referrals: 0 };
      write(current);
    }

    const params = new URLSearchParams(window.location.search);
    const ref = params.get("ref");
    if (ref && ref !== current.code && !current.referredBy) {
      current = { ...current, referredBy: ref };
      write(current);
    }

    setState(current);
  }, []);

  const recordShare = useCallback(() => {
    setState((prev) => {
      if (!prev) return prev;
      const next = { ...prev, referrals: prev.referrals + 1 };
      write(next);
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    const next: ReferralState = { code: makeCode(), referrals: 0 };
    write(next);
    setState(next);
  }, []);

  return { state, recordShare, reset };
}