import type { AuditReport } from "./audit-types";

const KEY = "webaudit.audits.v1";
const FAV_KEY = "webaudit.audits.favorites.v1";

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