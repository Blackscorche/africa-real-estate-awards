import { createServerOnlyFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

/**
 * Server-only database client using the public key. When the caller is signed in
 * (bearer token attached by the browser), the token is forwarded so database rules
 * apply as that user; otherwise requests run as an anonymous visitor.
 */
export const getServerSupabase = createServerOnlyFn((forwardUser: boolean = false) => {
  const url = process.env["SUPABASE_URL"];
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"];
  if (!url || !key) throw new Error("Backend is not configured");

  let token: string | undefined;
  if (forwardUser) {
    const auth = getRequest()?.headers.get("authorization") ?? "";
    const t = auth.startsWith("Bearer ") ? auth.slice(7) : "";
    if (t.split(".").length === 3) token = t;
  }

  return createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false, storage: undefined },
    global: {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) h.delete("Authorization");
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
});

export const getCallerId = createServerOnlyFn(async (sb: ReturnType<typeof getServerSupabase>) => {
  const auth = getRequest()?.headers.get("authorization") ?? "";
  const t = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  if (t.split(".").length !== 3) return null;
  const { data } = await sb.auth.getClaims(t);
  return (data?.claims?.sub as string | undefined) ?? null;
});
