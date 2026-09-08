import { useCallback, useEffect, useState } from "react";

import { CREDITS_PER_FIX, MODE_CONFIG, type AuditMode } from "./audit-types";

const KEY = "wan.credits.v1";
const EVENT = "wan:credits";

/** Free monthly allowance. Paid top-ups can extend this later. */
export const MONTHLY_ALLOWANCE = 120;

export interface CreditState {
  /** Month key, e.g. "2026-09". Allowance resets when this changes. */
  period: string;
  used: number;
  allowance: number;
}

function currentPeriod(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

function fresh(): CreditState {
  return { period: currentPeriod(), used: 0, allowance: MONTHLY_ALLOWANCE };
}

export function readCredits(): CreditState {
  if (typeof window === "undefined") return fresh();
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return fresh();
    const parsed = JSON.parse(raw) as CreditState;
    if (parsed.period !== currentPeriod()) return fresh();
    return {
      period: parsed.period,
      used: Math.max(0, Math.min(parsed.allowance ?? MONTHLY_ALLOWANCE, parsed.used ?? 0)),
      allowance: parsed.allowance ?? MONTHLY_ALLOWANCE,
    };
  } catch {
    return fresh();
  }
}

function write(state: CreditState): CreditState {
  if (typeof window === "undefined") return state;
  window.localStorage.setItem(KEY, JSON.stringify(state));
  window.dispatchEvent(new CustomEvent(EVENT));
  return state;
}

export function remainingCredits(): number {
  const state = readCredits();
  return Math.max(0, state.allowance - state.used);
}

/** Spends credits, never letting the balance go negative. Returns what was actually spent. */
export function spendCredits(amount: number): number {
  if (amount <= 0) return 0;
  const state = readCredits();
  const spendable = Math.max(0, Math.min(amount, state.allowance - state.used));
  if (spendable > 0) write({ ...state, used: state.used + spendable });
  return spendable;
}

export function estimateForMode(mode: AuditMode): number {
  return MODE_CONFIG[mode].credits;
}

export function canAfford(cost: number): boolean {
  return remainingCredits() >= cost;
}

export const FIX_COST = CREDITS_PER_FIX;

export function useCredits() {
  const [state, setState] = useState<CreditState>(() => fresh());
  const [hydrated, setHydrated] = useState(false);

  const refresh = useCallback(() => setState(readCredits()), []);

  useEffect(() => {
    refresh();
    setHydrated(true);
    const onChange = () => refresh();
    window.addEventListener(EVENT, onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener(EVENT, onChange);
      window.removeEventListener("storage", onChange);
    };
  }, [refresh]);

  return {
    hydrated,
    used: state.used,
    allowance: state.allowance,
    remaining: Math.max(0, state.allowance - state.used),
    refresh,
  };
}
