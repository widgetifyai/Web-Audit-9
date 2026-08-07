import { createFileRoute } from "@tanstack/react-router";

const ADMIN_EMAIL = "admin@123.com";
const ADMIN_PASSWORD = "admin123";

/**
 * One-shot admin bootstrap. Self-disables permanently once an admin exists,
 * so it cannot be used to mint additional admins later.
 */
export const Route = createFileRoute("/api/public/bootstrap-admin")({
  server: {
    handlers: {
      POST: async () => {
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

        const { count } = await supabaseAdmin
          .from("user_roles")
          .select("id", { count: "exact", head: true })
          .eq("role", "admin");

        if ((count ?? 0) > 0) {
          return new Response(JSON.stringify({ ok: false, reason: "already_bootstrapped" }), {
            status: 409,
            headers: { "content-type": "application/json" },
          });
        }

        const { data: created, error } = await supabaseAdmin.auth.admin.createUser({
          email: ADMIN_EMAIL,
          password: ADMIN_PASSWORD,
          email_confirm: true,
        });

        let userId = created?.user?.id;
        if (error || !userId) {
          const { data: list } = await supabaseAdmin.auth.admin.listUsers();
          userId = list?.users.find((u) => u.email === ADMIN_EMAIL)?.id;
        }
        if (!userId) {
          return new Response(JSON.stringify({ ok: false, reason: "create_failed" }), {
            status: 500,
            headers: { "content-type": "application/json" },
          });
        }

        const { error: roleError } = await supabaseAdmin
          .from("user_roles")
          .insert({ user_id: userId, role: "admin" });
        if (roleError) {
          return new Response(JSON.stringify({ ok: false, reason: roleError.message }), {
            status: 500,
            headers: { "content-type": "application/json" },
          });
        }

        return new Response(JSON.stringify({ ok: true }), {
          headers: { "content-type": "application/json" },
        });
      },
    },
  },
});
