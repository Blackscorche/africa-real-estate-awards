import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Trophy, Star, Check } from "lucide-react";
import { Countdown } from "@/components/site/Countdown";
import { PageHead } from "@/components/site/SiteChrome";
import { FaqList, Partners } from "@/components/site/Promo";
import { SubmitButton, readError, useFormSubmit } from "@/components/site/forms";
import { awardsQuery, globalQuery } from "@/lib/queries";
import { bool, formatMoney, str } from "@/lib/settings";
import { bookTickets, castVote, submitNomination } from "@/lib/submit.functions";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/awards")({
  head: () => ({
    meta: [
      { title: "Awards 2026 — Africa Real Estate Magazine & Awards" },
      { name: "description", content: "13 December 2026 at Lekki Colosseum Rooftop, Lagos. Browse categories, nominate, vote and book gala tables." },
      { property: "og:title", content: "Africa Real Estate Awards 2026 — Nominations open" },
      { property: "og:type", content: "website" },
      { property: "og:description", content: "Rooftop gala, 13 Dec 2026, Lekki Colosseum, Lagos. Nominate, vote and book your table." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(awardsQuery),
  component: AwardsPage,
});

function AwardsPage() {
  const { data } = useSuspenseQuery(awardsQuery);
  const { data: g } = useSuspenseQuery(globalQuery);
  const s = g.settings;
  const qc = useQueryClient();
  const { user } = useAuth();
  const groups = useMemo(() => ["All", ...Array.from(new Set(data.categories.map((c) => c.group_name)))], [data.categories]);
  const [group, setGroup] = useState("All");
  const [picked, setPicked] = useState("");
  const [voteCat, setVoteCat] = useState<string>(data.categories[0]?.id ?? "");
  const [voting, setVoting] = useState<string | null>(null);
  const nominationsOpen = bool(s, "awards", "nominations_open");
  const votingOpen = bool(s, "awards", "voting_open");
  const showCounts = bool(s, "awards", "show_vote_counts");

  const myVotes = useQuery({
    queryKey: ["me", "votes", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data: rows, error } = await supabase.from("votes").select("category_id, nominee_id").eq("user_id", user!.id);
      if (error) throw error;
      return Object.fromEntries(rows.map((r) => [r.category_id, r.nominee_id])) as Record<string, string>;
    },
  });

  const nominate = useServerFn(submitNomination);
  const vote = useServerFn(castVote);
  const book = useServerFn(bookTickets);

  const nomForm = useFormSubmit(
    async (v) => {
      if (!v.categoryId) throw new Error("Choose a category first.");
      const r = await nominate({ data: { categoryId: v.categoryId, nominee: v.nominee ?? "", company: v.company ?? "", nominatorName: v.nominatorName ?? "", email: v.email ?? "", phone: v.phone ?? "", reason: v.reason ?? "" } });
      await qc.invalidateQueries({ queryKey: awardsQuery.queryKey });
      setVoteCat(v.categoryId);
      setPicked("");
      setTimeout(() => document.getElementById("vote")?.scrollIntoView({ behavior: "smooth" }), 200);
      return r;
    },
    (_r, v) => `Nomination published for ${v.nominee} — voting is open.`,
  );

  const ticketForm = useFormSubmit(
    async (v) => {
      const pkg = data.packages.find((p) => p.id === v.packageId);
      return book({ data: { packageId: v.packageId ?? "", packageName: pkg?.name ?? "", quantity: Number(v.quantity || 1), fullName: v.fullName ?? "", email: v.email ?? "", phone: v.phone ?? "", company: v.company ?? "" } });
    },
    () => "Booking request received. Our events team will confirm by email within 48 hours.",
  );

  async function onVote(id: string) {
    if (!user) { toast.info("Sign in to vote — it takes a minute."); return; }
    setVoting(id);
    try {
      await vote({ data: { nomineeId: id } });
      await Promise.all([qc.invalidateQueries({ queryKey: awardsQuery.queryKey }), qc.invalidateQueries({ queryKey: ["me", "votes"] })]);
      toast.success("Vote counted. Thank you!");
    } catch (e) {
      toast.error(readError(e));
    } finally {
      setVoting(null);
    }
  }

  const list = data.categories.filter((c) => group === "All" || c.group_name === group);
  const ns = data.nominees.filter((n) => n.category_id === voteCat);
  const total = ns.reduce((t, n) => t + n.vote_count, 0);
  const mine = myVotes.data?.[voteCat];
  const winners = data.nominees.filter((n) => n.status === "winner");

  return (
    <>
      <PageHead eyebrow={str(s, "awards", "eyebrow")} title={str(s, "awards", "title")} intro={str(s, "awards", "intro")} image={str(s, "awards", "hero_image") || undefined} />

      <section className="mx-auto grid max-w-7xl gap-5 px-6 pb-10 md:grid-cols-3">
        {[
          ["When", new Date(str(s, "awards", "event_date") || Date.now()).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }), "Evening gala · WAT"],
          ["Where", str(s, "awards", "venue"), str(s, "awards", "venue_detail")],
          ["Status", str(s, "awards", "status_text"), str(s, "awards", "status_detail")],
        ].map(([k, v, d]) => (
          <div key={k} className="glass-panel p-6">
            <p className="eyebrow text-muted-foreground">{k}</p>
            <p className="mt-2 font-display text-3xl uppercase">{v}</p>
            <p className="text-sm text-muted-foreground">{d}</p>
          </div>
        ))}
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="glass-panel p-6"><p className="eyebrow mb-4 text-ice">Time to the gala</p><Countdown date={str(s, "awards", "event_date")} /></div>
      </section>

      {winners.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 pb-20">
          <h2 className="mb-6 font-display text-4xl uppercase">2026 Winners</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {winners.map((w) => (
              <div key={w.id} className="rounded-xl bg-primary/10 p-6 ring-1 ring-primary/40">
                <Trophy className="size-6 text-primary" />
                <p className="eyebrow mt-3 text-muted-foreground">{data.categories.find((c) => c.id === w.category_id)?.name}</p>
                <p className="mt-1 font-display text-2xl uppercase">{w.name}</p>
                <p className="text-sm text-muted-foreground">{w.company}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {data.timeline.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 pb-20">
          <h2 className="mb-6 font-display text-4xl uppercase">Key dates</h2>
          <ol className="grid gap-3 md:grid-cols-5">
            {data.timeline.map((t, i) => (
              <li key={t.id} className="relative rounded-xl bg-glass p-5 ring-1 ring-hairline">
                <span className="font-semibold text-xs text-primary">0{i + 1}</span>
                <p className="mt-2 font-display text-xl uppercase leading-tight">{t.label}</p>
                <p className="eyebrow mt-1 text-ice">{t.date_text}</p>
                <p className="mt-2 text-sm text-muted-foreground">{t.body}</p>
              </li>
            ))}
          </ol>
        </section>
      )}

      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <h2 className="font-display text-4xl uppercase">Categories</h2>
          <div className="flex flex-wrap gap-2">
            {groups.map((x) => (
              <button key={x} onClick={() => setGroup(x)} className={`rounded-lg px-3 py-1.5 font-semibold text-xs transition-colors ${group === x ? "bg-primary text-primary-foreground" : "bg-glass text-muted-foreground ring-1 ring-hairline hover:text-foreground"}`}>{x}</button>
            ))}
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((c) => (
            <button key={c.id} onClick={() => { setPicked(c.id); document.getElementById("nominate")?.scrollIntoView({ behavior: "smooth" }); }}
              className={`group rise rounded-xl p-5 text-left ring-1 transition-colors ${picked === c.id ? "bg-primary/10 ring-primary/50" : "bg-glass ring-hairline hover:ring-primary/40"}`}>
              <span className="eyebrow text-muted-foreground">{c.group_name}</span>
              <p className="mt-2 font-display text-xl uppercase tracking-tight">{c.name}</p>
              {c.description && <p className="mt-2 text-sm text-muted-foreground">{c.description}</p>}
              <span className="mt-3 inline-block text-sm font-semibold text-primary transition-transform group-hover:translate-x-1">Nominate →</span>
            </button>
          ))}
        </div>
      </section>

      <section id="nominate" className="mx-auto max-w-3xl scroll-mt-24 px-6 pb-24">
        {nominationsOpen ? (
          <form onSubmit={nomForm.onSubmit} className="glass-panel space-y-4 p-6 md:p-8">
            <p className="eyebrow text-primary">Nomination form</p>
            <h2 className="font-display text-4xl uppercase">Put a name forward</h2>
            <select name="categoryId" value={picked} onChange={(e) => setPicked(e.target.value)} className="field">
              <option value="">Select a category</option>
              {data.categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <div className="grid gap-4 md:grid-cols-2">
              <input required name="nominee" placeholder="Nominee / project name" className="field" />
              <input required name="company" placeholder="Company" className="field" />
              <input name="nominatorName" placeholder="Your name" className="field" />
              <input required name="email" type="email" placeholder="Your email" defaultValue={user?.email ?? ""} className="field" />
              <input name="phone" placeholder="Phone (optional)" className="field md:col-span-2" />
            </div>
            <textarea required name="reason" rows={4} placeholder="Why should they win?" className="field" />
            <SubmitButton busy={nomForm.busy}>Submit nomination</SubmitButton>
          </form>
        ) : (
          <div className="glass-panel p-8 text-center"><p className="font-display text-3xl uppercase">Nominations are closed</p><p className="mt-2 text-muted-foreground">Thank you to everyone who put a name forward.</p></div>
        )}
      </section>

      <section id="vote" className="mx-auto max-w-5xl scroll-mt-24 px-6 pb-24">
        <p className="eyebrow mb-2 text-primary">Public voting · {votingOpen ? "live" : "closed"}</p>
        <h2 className="font-display text-4xl uppercase">Vote for your favourite</h2>
        <p className="mt-1 text-sm text-muted-foreground">Nominees appear here the moment they're submitted. One vote per category per account.</p>
        {!user && votingOpen && (
          <p className="mt-4 rounded-xl bg-primary/10 px-4 py-3 text-sm ring-1 ring-primary/30">
            <Link to="/auth" search={{ redirect: "/awards" }} className="font-semibold text-primary">Sign in or create an account</Link> to cast your votes.
          </p>
        )}
        <select value={voteCat} onChange={(e) => setVoteCat(e.target.value)} className="field mt-5 max-w-md">
          {data.categories.map((c) => <option key={c.id} value={c.id}>{c.name} ({data.nominees.filter((n) => n.category_id === c.id).length})</option>)}
        </select>
        {!ns.length ? (
          <p className="glass-panel mt-5 p-6 text-sm text-muted-foreground">No nominees yet in this category — be the first to nominate above.</p>
        ) : (
          <ul className="mt-5 space-y-3">
            {ns.map((n) => {
              const pct = total ? Math.round((n.vote_count / total) * 100) : 0;
              const isMine = mine === n.id;
              return (
                <li key={n.id} className="glass-panel relative overflow-hidden p-5">
                  {showCounts && <div className="absolute inset-y-0 left-0 bg-primary/15 transition-all duration-700" style={{ width: `${pct}%` }} />}
                  <div className="relative flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      {n.image_url && <img src={n.image_url} alt="" className="size-12 rounded-full object-cover" />}
                      <div>
                        <p className="flex flex-wrap items-center gap-2 font-display text-xl uppercase">
                          {n.name}
                          {n.status === "shortlisted" && <span className="inline-flex items-center gap-1 rounded-lg bg-ice/15 px-2 py-0.5 font-semibold text-[10px] text-ice"><Star className="size-3" /> Finalist</span>}
                          {n.status === "winner" && <span className="inline-flex items-center gap-1 rounded-lg bg-primary/20 px-2 py-0.5 font-semibold text-[10px] text-primary"><Trophy className="size-3" /> Winner</span>}
                        </p>
                        <p className="text-xs text-muted-foreground">{n.company}{showCounts && ` · ${n.vote_count} vote${n.vote_count === 1 ? "" : "s"} · ${pct}%`}</p>
                      </div>
                    </div>
                    <button
                      disabled={!votingOpen || !!mine || voting === n.id}
                      onClick={() => onVote(n.id)}
                      className={`shrink-0 rounded-lg px-5 py-2 text-sm font-semibold transition-colors ${isMine ? "bg-success/20 text-success" : "bg-primary text-primary-foreground hover:bg-primary/80 disabled:opacity-40"}`}
                    >
                      {isMine ? <span className="inline-flex items-center gap-1"><Check className="size-4" /> Your vote</span> : voting === n.id ? "…" : "Vote"}
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {data.judges.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 pb-24">
          <h2 className="mb-6 font-display text-4xl uppercase">The jury</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {data.judges.map((j) => (
              <article key={j.id} className="glass-panel overflow-hidden">
                {j.image_url && <img src={j.image_url} alt={j.name} width={816} height={816} loading="lazy" className="aspect-[4/3] w-full object-cover object-top" />}
                <div className="p-6">
                  <p className="eyebrow text-primary">{j.title}</p>
                  <p className="mt-1 font-display text-2xl uppercase">{j.name}</p>
                  <p className="text-sm text-ice">{j.organisation}</p>
                  <p className="mt-3 text-sm text-muted-foreground">{j.bio}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      <section id="tickets" className="mx-auto max-w-7xl scroll-mt-24 px-6 pb-24">
        <p className="eyebrow mb-2 text-primary">Gala tickets</p>
        <h2 className="font-display text-4xl uppercase">{str(s, "awards", "tickets_title")}</h2>
        <p className="mt-2 max-w-2xl text-muted-foreground">{str(s, "awards", "tickets_text")}</p>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {data.packages.map((p) => (
            <div key={p.id} className={`rounded-xl p-6 ring-1 ${p.featured ? "bg-primary/10 ring-primary/40" : "bg-glass ring-hairline"}`}>
              <span className="eyebrow text-muted-foreground">{p.featured ? "Most booked" : `${p.seats} seat${p.seats > 1 ? "s" : ""}`}</span>
              <p className="mt-2 font-display text-3xl uppercase">{p.name}</p>
              <p className="mt-1 font-display text-2xl text-primary">{formatMoney(p.price, p.currency)}</p>
              <p className="mt-2 text-sm text-muted-foreground">{p.description}</p>
              <ul className="mt-4 space-y-1.5 text-sm">{p.perks.map((x) => <li key={x} className="flex gap-2"><span className="text-primary">+</span>{x}</li>)}</ul>
            </div>
          ))}
        </div>
        <form onSubmit={ticketForm.onSubmit} className="glass-panel mx-auto mt-8 max-w-3xl space-y-4 p-6 md:p-8">
          <p className="eyebrow text-primary">Booking request</p>
          <div className="grid gap-4 md:grid-cols-2">
            <select required name="packageId" className="field" defaultValue="">
              <option value="" disabled>Choose a package</option>
              {data.packages.map((p) => <option key={p.id} value={p.id}>{p.name} — {formatMoney(p.price, p.currency)}</option>)}
            </select>
            <input required name="quantity" type="number" min={1} max={50} defaultValue={1} className="field" aria-label="Quantity" />
            <input required name="fullName" placeholder="Full name" className="field" />
            <input required name="email" type="email" placeholder="Email" defaultValue={user?.email ?? ""} className="field" />
            <input name="phone" placeholder="Phone" className="field" />
            <input name="company" placeholder="Company (for corporate tables)" className="field" />
          </div>
          <SubmitButton busy={ticketForm.busy}>Request booking</SubmitButton>
        </form>
      </section>

      <FaqList faqs={data.faqs} />
      <Partners />
    </>
  );
}
