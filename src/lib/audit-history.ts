import type { AuditReport } from "./audit-types";

const KEY = "webaudit.audits.v1";
const FAV_KEY = "webaudit.audits.favorites.v1";
const DIR_KEY = "webaudit.directory.v1";
const WAITLIST_KEY = "webaudit.waitlist.v1";
const IMAGE_CACHE_KEY = "webaudit.share-image.v1";

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function listAudits(): AuditReport[] {
  if (typeof window === "undefined") return [];
  return safeParse<AuditReport[]>(window.localStorage.getItem(KEY), []);
}

export function getAudit(id: string): AuditReport | null {
  return listAudits().find((a) => a.id === id) ?? null;
}

export function saveAudit(report: AuditReport): void {
  if (typeof window === "undefined") return;
  const all = listAudits().filter((a) => a.id !== report.id);
  all.unshift(report);
  window.localStorage.setItem(KEY, JSON.stringify(all.slice(0, 50)));
}

export function deleteAudit(id: string): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(listAudits().filter((a) => a.id !== id)));
}

export function listFavorites(): string[] {
  if (typeof window === "undefined") return [];
  return safeParse<string[]>(window.localStorage.getItem(FAV_KEY), []);
}

export function toggleFavorite(id: string): string[] {
  const current = listFavorites();
  const next = current.includes(id) ? current.filter((x) => x !== id) : [...current, id];
  window.localStorage.setItem(FAV_KEY, JSON.stringify(next));
  return next;
}

export function encodeReport(report: AuditReport): string {
  const json = JSON.stringify(report);
  const bytes = new TextEncoder().encode(json);
  let binary = "";
  bytes.forEach((b) => {
    binary += String.fromCharCode(b);
  });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function decodeReport(encoded: string): AuditReport | null {
  try {
    const base = encoded.replace(/-/g, "+").replace(/_/g, "/");
    const binary = atob(base);
    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
    return JSON.parse(new TextDecoder().decode(bytes)) as AuditReport;
  } catch {
    return null;
  }
}

export interface DirectoryEntry {
  id: string;
  url: string;
  title: string;
  hostname: string;
  overallScore: number;
  categories: { id: string; name: string; score: number }[];
  createdAt: string;
  favorite?: boolean;
}

export function listDirectory(): DirectoryEntry[] {
  if (typeof window === "undefined") return [];
  return safeParse<DirectoryEntry[]>(window.localStorage.getItem(DIR_KEY), []);
}

export function addToDirectory(report: AuditReport): DirectoryEntry[] {
  if (typeof window === "undefined") return [];
  const all = listDirectory().filter((d) => d.id !== report.id);
  const entry: DirectoryEntry = {
    id: report.id,
    url: report.url,
    title: report.title,
    hostname: new URL(report.url).hostname,
    overallScore: report.overallScore,
    categories: report.categories.map((c) => ({ id: c.id, name: c.name, score: c.score })),
    createdAt: report.createdAt,
    favorite: listFavorites().includes(report.id),
  };
  all.unshift(entry);
  const next = all.slice(0, 100);
  window.localStorage.setItem(DIR_KEY, JSON.stringify(next));
  window.dispatchEvent(new CustomEvent("webaudit:directory"));
  return next;
}

export function removeFromDirectory(id: string): DirectoryEntry[] {
  if (typeof window === "undefined") return [];
  const next = listDirectory().filter((d) => d.id !== id);
  window.localStorage.setItem(DIR_KEY, JSON.stringify(next));
  window.dispatchEvent(new CustomEvent("webaudit:directory"));
  return next;
}

export function isInDirectory(id: string): boolean {
  return listDirectory().some((d) => d.id === id);
}

export interface WaitlistEntry {
  email: string;
  joinedAt: string;
}

export function listWaitlist(): WaitlistEntry[] {
  if (typeof window === "undefined") return [];
  return safeParse<WaitlistEntry[]>(window.localStorage.getItem(WAITLIST_KEY), []);
}

export function joinWaitlist(email: string): WaitlistEntry[] {
  if (typeof window === "undefined") return [];
  const normalized = email.trim().toLowerCase();
  if (!normalized || !normalized.includes("@")) return listWaitlist();
  const all = listWaitlist().filter((e) => e.email !== normalized);
  all.unshift({ email: normalized, joinedAt: new Date().toISOString() });
  const next = all.slice(0, 500);
  window.localStorage.setItem(WAITLIST_KEY, JSON.stringify(next));
  window.dispatchEvent(new CustomEvent("webaudit:waitlist"));
  return next;
}

export function getShareImageCache(reportId: string): string | null {
  if (typeof window === "undefined") return null;
  const cache = safeParse<Record<string, string>>(window.localStorage.getItem(IMAGE_CACHE_KEY), {});
  return cache[reportId] ?? null;
}

export function setShareImageCache(reportId: string, dataUrl: string): void {
  if (typeof window === "undefined") return;
  const cache = safeParse<Record<string, string>>(window.localStorage.getItem(IMAGE_CACHE_KEY), {});
  cache[reportId] = dataUrl;
  window.localStorage.setItem(IMAGE_CACHE_KEY, JSON.stringify(cache));
}

export function getAuditsByHostname(hostname: string): AuditReport[] {
  return listAudits().filter((a) => {
    try {
      return new URL(a.url).hostname === hostname;
    } catch {
      return false;
    }
  });
}

export function getLastAuditDate(hostname: string): Date | null {
  const audits = getAuditsByHostname(hostname);
  if (audits.length === 0) return null;
  return new Date(audits[0].createdAt);
}

export function getScoreTrend(hostname: string): { previous: number | null; current: number | null; change: number | null } {
  const audits = getAuditsByHostname(hostname);
  if (audits.length === 0) return { previous: null, current: null, change: null };
  const current = audits[0].overallScore;
  const previous = audits[1]?.overallScore ?? null;
  return { previous, current, change: previous === null ? null : current - previous };
}

export function isDueForReAudit(hostname: string, days = 30): boolean {
  const last = getLastAuditDate(hostname);
  if (!last) return false;
  const diffMs = Date.now() - last.getTime();
  return diffMs > days * 24 * 60 * 60 * 1000;
}
