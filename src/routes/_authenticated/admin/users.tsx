import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Search, ShieldCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { formatDate } from "@/lib/settings";

export const Route = createFileRoute("/_authenticated/admin/users")({
  component: UsersPage,
});

function UsersPage() {
  const qc = useQueryClient();
  const { user } = useAuth();
  const [q, setQ] = useState("");
  const data = useQuery({
    queryKey: ["admin", "users"],
    queryFn: async () => {
      const [p, r] = await Promise.all([
        supabase.from("profiles").select("*").order("created_at", { ascending: false }).limit(1000),
        supabase.from("user_roles").select("user_id, role"),
      ]);
      if (p.error) throw p.error;
      if (r.error) throw r.error;
      const admins = new Set(r.data.filter((x) => x.role === "admin").map((x) => x.user_id));
      return p.data.map((x) => ({ ...x, isAdmin: admins.has(x.id) }));
    },
  });

  async function toggle(id: string, makeAdmin: boolean) {
    const res = makeAdmin
      ? await supabase.from("user_roles").insert({ user_id: id, role: "admin" })
      : await supabase.from("user_roles").delete().eq("user_id", id).eq("role", "admin");
    if (res.error) { toast.error(res.error.message); return; }
    toast.success(makeAdmin ? "Admin access granted." : "Admin access removed.");
    qc.invalidateQueries({ queryKey: ["admin", "users"] });
  }

  const list = (data.data ?? []).filter((u) => `${u.full_name ?? ""} ${u.email ?? ""}`.toLowerCase().includes(q.toLowerCase()));

  return (
    <div>
      <p className="eyebrow text-primary">People</p>
      <h1 className="mt-1 font-display text-4xl uppercase">Users & admins</h1>
      <p className="mb-6 mt-1 text-sm text-muted-foreground">Everyone with an account. Admins can edit the whole site and see all submissions.</p>
      <div className="relative mb-4 max-w-xs">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name or email…" className="field pl-9" />
      </div>
      <div className="glass-panel divide-y divide-border">
        {data.isLoading && <p className="p-6 text-muted-foreground">Loading…</p>}
        {list.map((u) => (
          <div key={u.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
            <div>
              <p className="flex items-center gap-2 font-medium">{u.full_name || "—"} {u.isAdmin && <span className="inline-flex items-center gap-1 rounded-lg bg-primary/15 px-2 py-0.5 font-semibold text-[10px] text-primary"><ShieldCheck className="size-3" /> Admin</span>}</p>
              <p className="text-sm text-muted-foreground">{u.email} · joined {formatDate(u.created_at)}</p>
            </div>
            {u.id !== user?.id && (
              <button onClick={() => toggle(u.id, !u.isAdmin)} className={`rounded-lg px-4 py-2 text-sm ring-1 ${u.isAdmin ? "ring-destructive/40 hover:text-destructive" : "ring-primary/40 hover:text-primary"}`}>
                {u.isAdmin ? "Remove admin" : "Make admin"}
              </button>
            )}
          </div>
        ))}
      </div>
      <p className="mt-3 text-xs text-muted-foreground">New people get an account by signing up on the website.</p>
    </div>
  );
}
