import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { formatDate } from "@/lib/settings";
import { StatusBadge } from "@/components/admin/StatusBadge";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: Overview,
});

type CountTable = "votes" | "nominees" | "membership_applications" | "ticket_orders" | "subscriptions" | "enquiries" | "profiles" | "programme_registrations";

async function count(table: CountTable, filter?: [string, string]) {
  let q = supabase.from(table).select("id", { count: "exact", head: true });
  if (filter) q = q.eq(filter[0] as never, filter[1] as never);
  const { count: c } = await q;
  return c ?? 0;
}

function Overview() {
  const stats = useQuery({
    queryKey: ["admin", "overview"],
    queryFn: async () => {
      const [votes, nominees, apps, pendingApps, bookings, pendingBookings, subs, newEnq, users, regs] = await Promise.all([
        count("votes"), count("nominees"), count("membership_applications"), count("membership_applications", ["status", "pending"]),
        count("ticket_orders"), count("ticket_orders", ["status", "pending"]), count("subscriptions"), count("enquiries", ["status", "new"]),
        count("profiles"), count("programme_registrations", ["status", "pending"]),
      ]);
      return { votes, nominees, apps, pendingApps, bookings, pendingBookings, subs, newEnq, users, regs };
    },
  });
  const results = useQuery({
    queryKey: ["admin", "results"],
    queryFn: async () => {
      const [cats, noms] = await Promise.all([
        supabase.from("award_categories").select("id, name").order("sort_order"),
        supabase.from("nominees").select("id, name, company, category_id, vote_count, status").order("vote_count", { ascending: false }),
      ]);
      return (cats.data ?? []).map((c) => ({ ...c, nominees: (noms.data ?? []).filter((n) => n.category_id === c.id) }));
    },
  });
  const recent = useQuery({
    queryKey: ["admin", "recent"],
    queryFn: async () => {
      const [a, t, e] = await Promise.all([
        supabase.from("membership_applications").select("id, full_name, tier, status, created_at").order("created_at", { ascending: false }).limit(5),
        supabase.from("ticket_orders").select("id, full_name, package_name, quantity, status, created_at").order("created_at", { ascending: false }).limit(5),
        supabase.from("enquiries").select("id, full_name, kind, status, created_at").order("created_at", { ascending: false }).limit(5),
      ]);
      return [
        ...(a.data ?? []).map((x) => ({ id: x.id, who: x.full_name, what: `${x.tier} membership`, status: x.status, at: x.created_at, to: "applications" })),
        ...(t.data ?? []).map((x) => ({ id: x.id, who: x.full_name, what: `${x.quantity} × ${x.package_name}`, status: x.status, at: x.created_at, to: "bookings" })),
        ...(e.data ?? []).map((x) => ({ id: x.id, who: x.full_name, what: x.kind.replace("_", " "), status: x.status, at: x.created_at, to: "enquiries" })),
      ].sort((x, y) => y.at.localeCompare(x.at)).slice(0, 8);
    },
  });

  const s = stats.data;
  const cards = [
    ["Votes cast", s?.votes, "nominees"], ["Nominees", s?.nominees, "nominees"], ["Accounts", s?.users, null],
    ["Subscribers", s?.subs, "subscribers"], ["Pending applications", s?.pendingApps, "applications"], ["Pending bookings", s?.pendingBookings, "bookings"],
    ["Pending registrations", s?.regs, "registrations"], ["New enquiries", s?.newEnq, "enquiries"],
  ] as const;
  const chart = (results.data ?? []).map((c) => ({ name: c.name.length > 18 ? c.name.slice(0, 18) + "…" : c.name, votes: c.nominees.reduce((t, n) => t + n.vote_count, 0) }));

  return (
    <div className="space-y-10">
      <div>
        <p className="eyebrow text-primary">Admin</p>
        <h1 className="mt-1 font-display text-5xl uppercase">Overview</h1>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {cards.map(([label, v, to]) => {
          const body = <><p className="font-display text-4xl text-primary">{v ?? "–"}</p><p className="eyebrow mt-1 text-muted-foreground">{label}</p></>;
          return to
            ? <Link key={label} to="/admin/$section" params={{ section: to }} className="glass-panel block p-5 transition-colors hover:bg-primary/5">{body}</Link>
            : <Link key={label} to="/admin/users" className="glass-panel block p-5 transition-colors hover:bg-primary/5">{body}</Link>;
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <div className="glass-panel p-6">
          <p className="eyebrow mb-4 text-muted-foreground">Votes by category</p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chart} layout="vertical" margin={{ left: 10 }}>
                <XAxis type="number" allowDecimals={false} stroke="var(--muted-foreground)" fontSize={11} />
                <YAxis type="category" dataKey="name" width={140} interval={0} stroke="var(--muted-foreground)" fontSize={11} />
                <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 12 }} cursor={{ fill: "var(--glass)" }} />
                <Bar dataKey="votes" fill="var(--primary)" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="glass-panel p-6">
          <p className="eyebrow mb-4 text-muted-foreground">Latest activity</p>
          <ul className="divide-y divide-border">
            {(recent.data ?? []).map((r) => (
              <li key={r.id}>
                <Link to="/admin/$section" params={{ section: r.to }} className="flex items-center justify-between gap-3 py-3 hover:text-primary">
                  <div><p className="text-sm font-medium">{r.who}</p><p className="text-xs capitalize text-muted-foreground">{r.what} · {formatDate(r.at)}</p></div>
                  <StatusBadge status={r.status} />
                </Link>
              </li>
            ))}
            {recent.data && !recent.data.length && <li className="py-6 text-center text-sm text-muted-foreground">No submissions yet.</li>}
          </ul>
        </div>
      </div>

      <div>
        <div className="mb-4 flex items-end justify-between">
          <h2 className="font-display text-3xl uppercase">Live results</h2>
          <Link to="/admin/$section" params={{ section: "nominees" }} className="text-sm font-semibold text-primary">Manage nominees →</Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {(results.data ?? []).map((c) => {
            const total = c.nominees.reduce((t, n) => t + n.vote_count, 0);
            return (
              <div key={c.id} className="glass-panel p-5">
                <p className="font-display text-lg uppercase leading-tight">{c.name}</p>
                <p className="eyebrow mt-1 text-muted-foreground">{c.nominees.length} nominees · {total} votes</p>
                <ul className="mt-3 space-y-2">
                  {c.nominees.slice(0, 3).map((n, i) => (
                    <li key={n.id} className="relative overflow-hidden rounded-lg bg-well px-3 py-2 text-sm">
                      <div className="absolute inset-y-0 left-0 bg-primary/15" style={{ width: `${total ? (n.vote_count / total) * 100 : 0}%` }} />
                      <span className="relative flex justify-between gap-2"><span className="truncate">{i + 1}. {n.name}</span><span className="font-semibold text-xs">{n.vote_count}</span></span>
                    </li>
                  ))}
                  {!c.nominees.length && <li className="text-sm text-muted-foreground">No nominees yet.</li>}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
