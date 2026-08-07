import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

import type { AuditReport } from "./audit-types";

export interface StoredAudit {
  id: string;
  url: string;
  hostname: string;
  title: string;
  overallScore: number;
  categories: { id: string; name: string; score: number }[];
  aiPowered: boolean;
  hidden: boolean;
  createdAt: string;
}

interface AuditRow {
  id: string;
  url: string;
  hostname: string;
  title: string;
  overall_score: number;
  categories: unknown;
  ai_powered: boolean;
  hidden: boolean;
  created_at: string;
}

function toStored(row: AuditRow): StoredAudit {
  return {
    id: row.id,
    url: row.url,
    hostname: row.hostname,
    title: row.title,
    overallScore: row.overall_score,
    categories: Array.isArray(row.categories)
      ? (row.categories as StoredAudit["categories"])
      : [],
    aiPowered: row.ai_powered,
    hidden: row.hidden,
    createdAt: row.created_at,
  };
}

const SELECT_COLS = "id,url,hostname,title,overall_score,categories,ai_powered,hidden,created_at";

async function publicClient() {
  const { createClient } = await import("@supabase/supabase-js");
  const url = process.env["SUPABASE_URL"]!;
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input: RequestInfo | URL, init?: RequestInit) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) {
          h.delete("Authorization");
        }
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

/** Public: most recent audits saved to the database. */
export const listRecentAudits = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) => z.object({ limit: z.number().min(1).max(60).default(24) }).parse(data ?? {}))
  .handler(async ({ data }): Promise<StoredAudit[]> => {
    const supabase = await publicClient();
    const { data: rows, error } = await supabase
      .from("audits")
      .select(SELECT_COLS)
      .eq("hidden", false)
      .order("created_at", { ascending: false })
      .limit(data.limit);
    if (error) {
      console.error("listRecentAudits failed:", error.message);
      return [];
    }
    return (rows as AuditRow[]).map(toStored);
  });

/** Public: fetch one stored report so shared links survive a cleared browser. */
export const getStoredReport = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) => z.object({ id: z.string().min(1).max(200) }).parse(data))
  .handler(async ({ data }): Promise<AuditReport | null> => {
    const supabase = await publicClient();
    const { data: row, error } = await supabase
      .from("audits")
      .select("report")
      .eq("id", data.id)
      .eq("hidden", false)
      .maybeSingle();
    if (error || !row) return null;
    return (row as { report: AuditReport }).report;
  });

async function assertAdmin(context: { supabase: { rpc: (fn: string, args: Record<string, unknown>) => Promise<{ data: unknown }> }; userId: string }) {
  const { data } = await context.supabase.rpc("has_role", {
    _user_id: context.userId,
    _role: "admin",
  });
  if (data !== true) throw new Error("Forbidden");
}

export const isCurrentUserAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<boolean> => {
    const { data } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    return data === true;
  });

export const adminListAudits = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z
      .object({
        search: z.string().max(200).optional(),
        limit: z.number().min(1).max(500).default(200),
      })
      .parse(data ?? {}),
  )
  .handler(async ({ data, context }): Promise<StoredAudit[]> => {
    await assertAdmin(context as never);
    let query = context.supabase
      .from("audits")
      .select(SELECT_COLS)
      .order("created_at", { ascending: false })
      .limit(data.limit);
    if (data.search) query = query.ilike("hostname", `%${data.search}%`);
    const { data: rows, error } = await query;
    if (error) throw new Error(error.message);
    return (rows as AuditRow[]).map(toStored);
  });

export const adminAuditStats = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context as never);
    const { data: rows, error } = await context.supabase
      .from("audits")
      .select("overall_score,hidden,ai_powered,hostname,created_at");
    if (error) throw new Error(error.message);
    const list = (rows ?? []) as {
      overall_score: number;
      hidden: boolean;
      ai_powered: boolean;
      hostname: string;
      created_at: string;
    }[];
    const dayAgo = Date.now() - 24 * 60 * 60 * 1000;
    return {
      total: list.length,
      hidden: list.filter((r) => r.hidden).length,
      aiPowered: list.filter((r) => r.ai_powered).length,
      uniqueSites: new Set(list.map((r) => r.hostname)).size,
      last24h: list.filter((r) => new Date(r.created_at).getTime() > dayAgo).length,
      averageScore: list.length
        ? Math.round(list.reduce((sum, r) => sum + r.overall_score, 0) / list.length)
        : 0,
    };
  });

export const adminSetAuditHidden = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z.object({ id: z.string().min(1).max(200), hidden: z.boolean() }).parse(data),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context as never);
    const { error } = await context.supabase
      .from("audits")
      .update({ hidden: data.hidden })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

export const adminDeleteAudit = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => z.object({ id: z.string().min(1).max(200) }).parse(data))
  .handler(async ({ data, context }) => {
    await assertAdmin(context as never);
    const { error } = await context.supabase.from("audits").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });
