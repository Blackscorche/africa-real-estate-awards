import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import {
  Trophy,
  Award,
  Ticket,
  GraduationCap,
  Sparkles,
  ExternalLink,
  QrCode,
  Printer,
  CheckCircle2,
  Calendar,
  MapPin,
  Clock,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { formatDate } from "@/lib/settings";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { RoleSwitcher } from "@/components/dashboard/RoleSwitcher";
import { castVote } from "@/lib/submit.functions";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Voter & Attendee Portal — Africa Real Estate Awards" },
      { name: "description", content: "Your verified votes, award nominations, gala ticket passes and account settings." },
      { property: "og:title", content: "Voter & Attendee Portal" },
      { property: "og:type", content: "website" },
      { property: "og:description", content: "Your verified votes, award nominations, gala ticket passes and account settings." },
    ],
  }),
  component: VoterDashboard,
});

function useMine<T>(key: string, fn: (uid: string) => PromiseLike<{ data: T[] | null; error: unknown }>) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["me", key, user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await fn(user!.id);
      if (error) throw error;
      return data ?? [];
    },
  });
}

function VoterDashboard() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const vote = useServerFn(castVote);
  const [votingId, setVotingId] = useState<string | null>(null);

  const votes = useMine("votes-full", (uid) =>
    supabase
      .from("votes")
      .select("id, category_id, created_at, nominees(id, name, company), award_categories(id, name)")
      .eq("user_id", uid)
      .order("created_at", { ascending: false })
  );

  const noms = useMine("nominations", (uid) =>
    supabase
      .from("nomination_details")
      .select("id, created_at, reason, nominees(name, company, status, vote_count, award_categories(name))")
      .eq("submitted_by", uid)
      .order("created_at", { ascending: false })
  );

  const apps = useMine("applications", (uid) =>
    supabase.from("membership_applications").select("*").eq("user_id", uid).order("created_at", { ascending: false })
  );

  const regs = useMine("registrations", (uid) =>
    supabase.from("programme_registrations").select("*").eq("user_id", uid).order("created_at", { ascending: false })
  );

  const tickets = useMine("tickets", (uid) =>
    supabase.from("ticket_orders").select("*").eq("user_id", uid).order("created_at", { ascending: false })
  );

  const subs = useMine("subs", (uid) =>
    supabase.from("subscriptions").select("*").eq("user_id", uid).order("created_at", { ascending: false })
  );

  // Fetch open categories to offer instant voting
  const allCategoriesQuery = useQuery({
    queryKey: ["all_categories_voting"],
    queryFn: async () => {
      const { data } = await supabase.from("award_categories").select("id, name, description").eq("active", true).order("sort_order");
      return data ?? [];
    },
  });

  const votedCategoryIds = new Set((votes.data ?? []).map((v) => v.category_id));
  const openToVote = (allCategoriesQuery.data ?? []).filter((c) => !votedCategoryIds.has(c.id));

  const stats = [
    { label: "Votes Cast", value: votes.data?.length ?? 0, icon: Trophy, color: "text-primary" },
    { label: "My Nominations", value: noms.data?.length ?? 0, icon: Award, color: "text-amber-500" },
    { label: "Gala Bookings", value: tickets.data?.length ?? 0, icon: Ticket, color: "text-ice" },
    { label: "Institute Programmes", value: (apps.data?.length ?? 0) + (regs.data?.length ?? 0), icon: GraduationCap, color: "text-primary" },
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
      {/* Role Switcher Bar */}
      <RoleSwitcher currentRole="voter" />

      {/* Voter Header */}
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="eyebrow text-primary">Voter & Attendee Portal</span>
            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 font-semibold text-[11px] text-primary">
              Verified Voter
            </span>
          </div>
          <h1 className="mt-2 font-display text-4xl uppercase sm:text-5xl">
            Hello, {user?.user_metadata?.["full_name"] ? String(user.user_metadata["full_name"]).split(" ")[0] : "Voter"}.
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">{user?.email}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            to="/awards"
            hash="vote"
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Trophy className="size-4" />
            Vote in Awards
          </Link>
          <Link
            to="/awards"
            hash="tickets"
            className="inline-flex items-center gap-1.5 rounded-lg bg-glass px-4 py-2.5 text-sm font-medium ring-1 ring-hairline hover:text-primary"
          >
            <Ticket className="size-4" />
            Book Gala Table
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="glass-panel p-5">
              <div className="flex items-center justify-between">
                <span className="eyebrow text-muted-foreground">{s.label}</span>
                <Icon className={`size-4 ${s.color}`} />
              </div>
              <p className={`mt-2 font-display text-4xl ${s.color}`}>{s.value}</p>
              <p className="mt-1 text-xs text-muted-foreground">Active in your account</p>
            </div>
          );
        })}
      </div>

      {/* Dashboard Tabs */}
      <Tabs defaultValue="votes" className="mt-10">
        <TabsList className="flex h-auto flex-wrap justify-start gap-1 bg-glass p-1">
          {([
            ["votes", "My Votes & Ballot"],
            ["nominations", "My Nominations"],
            ["tickets", "Gala Night Passes"],
            ["programmes", "Programmes"],
            ["subs", "Subscriptions"],
            ["profile", "Profile Settings"],
          ] as const).map(([v, l]) => (
            <TabsTrigger
              key={v}
              value={v}
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs sm:text-sm"
            >
              {l}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Tab 1: Votes */}
        <TabsContent value="votes" className="space-y-6 pt-4">
          <div>
            <h3 className="font-display text-xl uppercase">Votes Cast in 2026 Awards</h3>
            <p className="text-xs text-muted-foreground">Each account is permitted one verified vote per award category.</p>
          </div>

          <List
            empty="You have not cast any votes yet. Have your say in Africa's premier real estate honors."
            cta={{ to: "/awards", hash: "vote", label: "Open Ballot & Vote" }}
            rows={(votes.data ?? []).map((v) => {
              const n = v.nominees as { name: string; company: string } | null;
              const c = v.award_categories as { name: string } | null;
              return {
                id: v.id,
                title: n?.name ?? "Nominee",
                sub: `${c?.name ?? "Award Category"} · ${n?.company ?? ""}`,
                date: v.created_at,
                badgeText: "Ballot Verified",
              };
            })}
          />

          {/* Quick Action: Categories Ready to Vote In */}
          {openToVote.length > 0 && (
            <div className="glass-panel mt-6 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <span className="eyebrow text-primary">Pending Categories</span>
                  <h4 className="font-display text-lg uppercase">You Haven't Voted in These Yet ({openToVote.length})</h4>
                </div>
                <Link to="/awards" hash="vote" className="text-xs font-semibold text-primary hover:underline">
                  View full ballot →
                </Link>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                {openToVote.slice(0, 6).map((cat) => (
                  <div key={cat.id} className="rounded-lg border border-border bg-card/60 p-3.5">
                    <p className="font-display text-sm uppercase leading-tight">{cat.name}</p>
                    <p className="mt-1 line-clamp-2 text-[11px] text-muted-foreground">{cat.description || "Public voting is active."}</p>
                    <Link
                      to="/awards"
                      hash="vote"
                      className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                    >
                      Cast vote in this category →
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}
        </TabsContent>

        {/* Tab 2: Nominations */}
        <TabsContent value="nominations" className="space-y-6 pt-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="font-display text-xl uppercase">My Submitted Nominations</h3>
              <p className="text-xs text-muted-foreground">Entries submitted under your account for technical jury review and public voting.</p>
            </div>
            <Link
              to="/awards"
              hash="nominate"
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
            >
              <Award className="size-3.5" /> Submit New Nomination
            </Link>
          </div>

          <List
            empty="No nominations submitted yet. Nominate an outstanding project, developer or leader for the 2026 Awards."
            cta={{ to: "/awards", hash: "nominate", label: "Nominate Someone" }}
            rows={(noms.data ?? []).map((v) => {
              const n = v.nominees as {
                name: string;
                company: string;
                status: string;
                vote_count: number;
                award_categories: { name: string } | null;
              } | null;
              return {
                id: v.id,
                title: n?.name ?? "Nominee",
                sub: `${n?.award_categories?.name ?? "Category"} · ${n?.company ?? ""} · ${n?.vote_count ?? 0} public votes`,
                date: v.created_at,
                status: n?.status,
              };
            })}
          />
        </TabsContent>

        {/* Tab 3: Gala Night Passes & Bookings */}
        <TabsContent value="tickets" className="space-y-6 pt-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="font-display text-xl uppercase">Gala Ceremony Passes & Bookings</h3>
              <p className="text-xs text-muted-foreground">13 December 2026 · Lekki Colosseum Rooftop, Lagos.</p>
            </div>
            <Link
              to="/awards"
              hash="tickets"
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
            >
              <Ticket className="size-3.5" /> Book Additional Seats
            </Link>
          </div>

          {(tickets.data ?? []).length === 0 ? (
            <div className="glass-panel p-8 text-center">
              <Ticket className="mx-auto size-8 text-muted-foreground" />
              <p className="mt-3 text-muted-foreground">No gala dinner table or seat bookings yet.</p>
              <Link
                to="/awards"
                hash="tickets"
                className="mt-4 inline-block rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
              >
                Reserve Your Gala Table
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {(tickets.data ?? []).map((t) => (
                <div
                  key={t.id}
                  className="relative overflow-hidden rounded-2xl border border-primary/40 bg-gradient-to-r from-card via-background to-card p-6 shadow-xl"
                >
                  <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="eyebrow text-primary">Official Gala Pass</span>
                        <StatusBadge status={t.status} />
                      </div>
                      <h4 className="mt-2 font-display text-2xl uppercase">
                        {t.quantity} × {t.package_name}
                      </h4>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {t.full_name} · {t.company || t.email}
                      </p>

                      <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="size-3.5 text-primary" /> 13 Dec 2026
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="size-3.5 text-primary" /> 6:00 PM Reception
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="size-3.5 text-primary" /> Lekki Colosseum Rooftop, Lagos
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col items-center justify-center border-t border-border pt-4 md:border-l md:border-t-0 md:pl-6 md:pt-0">
                      <div className="rounded-lg bg-white p-2">
                        <QrCode className="size-16 text-black" />
                      </div>
                      <p className="mt-2 font-mono text-[10px] text-muted-foreground">
                        PASS-ARE-{t.id.slice(0, 8).toUpperCase()}
                      </p>
                      <button
                        onClick={() => toast.success("Pass sent to printer / saved.")}
                        className="mt-2 inline-flex items-center gap-1 rounded-md bg-secondary px-2.5 py-1 text-[11px] font-medium hover:text-primary"
                      >
                        <Printer className="size-3" /> Print Pass
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Tab 4: Programmes & Institute */}
        <TabsContent value="programmes" className="space-y-6 pt-4">
          <div>
            <h3 className="font-display text-xl uppercase">Institute Programmes & Masterclasses</h3>
            <p className="text-xs text-muted-foreground">Executive real estate leadership, development finance and sustainability workshops.</p>
          </div>

          <List
            empty="No programme registrations yet. Explore accredited training offered by the Institute."
            cta={{ to: "/institute", hash: "programmes", label: "Browse Programmes" }}
            rows={(regs.data ?? []).map((a) => ({
              id: a.id,
              title: a.programme_title,
              sub: `Attendee: ${a.full_name} (${a.email})`,
              date: a.created_at,
              status: a.status,
            }))}
          />
        </TabsContent>

        {/* Tab 5: Subscriptions */}
        <TabsContent value="subs" className="space-y-6 pt-4">
          <div>
            <h3 className="font-display text-xl uppercase">Publications & Newsletters</h3>
            <p className="text-xs text-muted-foreground">Subscriptions to Africa Real Estate Magazine and industry intelligence briefings.</p>
          </div>

          <List
            empty="No subscriptions active. Subscribe to Africa Real Estate Magazine for quarterly long-form market analysis."
            cta={{ to: "/magazine", hash: "subscribe", label: "Subscribe to Magazine" }}
            rows={(subs.data ?? []).map((a) => ({
              id: a.id,
              title: a.source === "magazine" ? `Africa Real Estate Magazine · ${a.format || "Digital"}` : "Weekly Intelligence Newsletter",
              sub: a.email,
              date: a.created_at,
              badgeText: "Active Subscription",
            }))}
          />
        </TabsContent>

        {/* Tab 6: Profile */}
        <TabsContent value="profile" className="pt-4">
          <div>
            <h3 className="font-display text-xl uppercase">Account Profile Details</h3>
            <p className="text-xs text-muted-foreground">Keep your contact details up to date for award notifications and gala passes.</p>
          </div>
          <ProfileForm />
        </TabsContent>
      </Tabs>
    </section>
  );
}

function List({
  rows,
  empty,
  cta,
}: {
  rows: { id: string; title: string; sub?: string | undefined; date: string; status?: string | undefined; badgeText?: string | undefined }[];
  empty: string;
  cta: { to: string; hash?: string; label: string };
}) {
  if (!rows.length)
    return (
      <div className="glass-panel mt-4 p-8 text-center">
        <p className="text-sm text-muted-foreground">{empty}</p>
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        <Link
          to={cta.to as any}
          {...(cta.hash ? { hash: cta.hash } : {})}
          className="mt-4 inline-block rounded-lg bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground"
        >
          {cta.label}
        </Link>
      </div>
    );
  return (
    <ul className="glass-panel mt-4 divide-y divide-border">
      {rows.map((r) => (
        <li key={r.id} className="flex flex-wrap items-center justify-between gap-3 p-5">
          <div>
            <p className="font-display text-lg uppercase">{r.title}</p>
            {r.sub && <p className="text-xs text-muted-foreground">{r.sub}</p>}
          </div>
          <div className="flex items-center gap-3">
            <span className="font-semibold text-xs text-muted-foreground">{formatDate(r.date)}</span>
            {r.status && <StatusBadge status={r.status} />}
            {r.badgeText && (
              <span className="inline-flex items-center gap-1 rounded-md bg-primary/15 px-2.5 py-1 text-[11px] font-semibold text-primary">
                <CheckCircle2 className="size-3" /> {r.badgeText}
              </span>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}

function ProfileForm() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const profile = useQuery({
    queryKey: ["me", "profile", user?.id],
    enabled: !!user,
    queryFn: async () => (await supabase.from("profiles").select("*").eq("id", user!.id).maybeSingle()).data,
  });
  const [busy, setBusy] = useState(false);
  const [key, setKey] = useState(0);
  useEffect(() => setKey((k) => k + 1), [profile.data]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const g = (k: string) => String(fd.get(k) ?? "") || null;
    setBusy(true);
    const { error } = await supabase.from("profiles").upsert({
      id: user!.id,
      email: user!.email ?? null,
      full_name: g("full_name"),
      phone: g("phone"),
      organisation: g("organisation"),
      country: g("country"),
    });
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Profile saved successfully.");
    qc.invalidateQueries({ queryKey: ["me", "profile"] });
  }

  const p = profile.data;
  return (
    <form key={key} onSubmit={onSubmit} className="glass-panel mt-4 grid max-w-2xl gap-4 p-6 md:grid-cols-2">
      <div>
        <label className="text-[11px] uppercase tracking-wider text-muted-foreground">Full Name</label>
        <input name="full_name" defaultValue={p?.full_name ?? ""} placeholder="e.g. Adebayo Ogunlesi" className="field mt-1" />
      </div>
      <div>
        <label className="text-[11px] uppercase tracking-wider text-muted-foreground">Phone Number</label>
        <input name="phone" defaultValue={p?.phone ?? ""} placeholder="e.g. +234 800 000 0000" className="field mt-1" />
      </div>
      <div>
        <label className="text-[11px] uppercase tracking-wider text-muted-foreground">Company / Organisation</label>
        <input name="organisation" defaultValue={p?.organisation ?? ""} placeholder="e.g. West Africa Property Holdings" className="field mt-1" />
      </div>
      <div>
        <label className="text-[11px] uppercase tracking-wider text-muted-foreground">Country</label>
        <input name="country" defaultValue={p?.country ?? ""} placeholder="e.g. Nigeria, Ghana, Kenya" className="field mt-1" />
      </div>
      <div className="md:col-span-2 pt-2">
        <button
          disabled={busy}
          className="rounded-lg bg-primary px-6 py-2.5 text-xs font-semibold text-primary-foreground disabled:opacity-60"
        >
          {busy ? "Saving…" : "Save Profile Details"}
        </button>
      </div>
    </form>
  );
}
