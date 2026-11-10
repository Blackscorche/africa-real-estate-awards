import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { PageHead } from "@/components/site/SiteChrome";
import { FaqList } from "@/components/site/Promo";
import { SubmitButton, useFormSubmit } from "@/components/site/forms";
import { globalQuery, instituteQuery } from "@/lib/queries";
import { formatDate, formatMoney, str } from "@/lib/settings";
import { applyMembership, registerProgramme } from "@/lib/submit.functions";
import { useAuth } from "@/hooks/use-auth";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export const Route = createFileRoute("/institute")({
  head: () => ({
    meta: [
      { title: "The Institute — Real Estate Management, Leadership & Professionals" },
      { name: "description", content: "Membership tiers, accredited training and leadership programmes for Africa's real estate professionals." },
      { property: "og:title", content: "Institute of Real Estate Management, Leadership and Professionals" },
      { property: "og:type", content: "website" },
      { property: "og:description", content: "Join Africa's network of real estate professionals. Training, CPD and leadership." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(instituteQuery),
  component: InstitutePage,
});

function InstitutePage() {
  const { data } = useSuspenseQuery(instituteQuery);
  const { data: g } = useSuspenseQuery(globalQuery);
  const s = g.settings;
  const { user } = useAuth();
  const featured = data.tiers.find((t) => t.featured)?.name ?? data.tiers[0]?.name ?? "";
  const [tier, setTier] = useState(featured);
  const [prog, setProg] = useState<{ id: string; title: string } | null>(null);
  const apply = useServerFn(applyMembership);
  const register = useServerFn(registerProgramme);

  const join = useFormSubmit(
    (v) => apply({ data: { tier, fullName: v.fullName ?? "", email: v.email ?? "", phone: v.phone ?? "", organisation: v.organisation ?? "", country: v.country ?? "", message: v.message ?? "" } }),
    () => `Application for ${tier} membership received. Track it in your dashboard.`,
  );
  const reg = useFormSubmit(
    async (v) => { const r = await register({ data: { programmeId: prog!.id, programmeTitle: prog!.title, fullName: v.fullName ?? "", email: v.email ?? "", phone: v.phone ?? "" } }); setProg(null); return r; },
    () => "Registration received. We'll email joining details.",
  );

  return (
    <>
      <PageHead eyebrow={str(s, "institute", "eyebrow")} title={str(s, "institute", "title")} intro={str(s, "institute", "intro")} image={str(s, "institute", "hero_image") || undefined} />

      <section className="mx-auto max-w-7xl px-6 pb-20">
        <h2 className="mb-6 font-display text-4xl uppercase">Membership</h2>
        <div className="grid gap-5 md:grid-cols-3">
          {data.tiers.map((t) => (
            <button key={t.id} onClick={() => { setTier(t.name); document.getElementById("join")?.scrollIntoView({ behavior: "smooth" }); }} className={`rounded-xl p-6 text-left ring-1 transition-colors ${tier === t.name ? "bg-primary/10 ring-primary/50" : "bg-glass ring-hairline hover:ring-primary/30"}`}>
              <span className="eyebrow text-muted-foreground">{t.featured ? "Most chosen" : "Tier"}</span>
              <p className="mt-2 font-display text-3xl uppercase">{t.name}</p>
              <p className="text-sm text-muted-foreground">{t.audience}</p>
              <p className="mt-3 font-display text-2xl text-primary">{formatMoney(t.price, t.currency)}<span className="font-body text-xs text-muted-foreground"> / year</span></p>
              <ul className="mt-4 space-y-1.5 text-sm">
                {t.perks.map((p) => <li key={p} className="flex gap-2"><span className="text-primary">+</span>{p}</li>)}
              </ul>
            </button>
          ))}
        </div>
      </section>

      <section id="programmes" className="mx-auto max-w-7xl scroll-mt-24 px-6 pb-20">
        <h2 className="mb-6 font-display text-4xl uppercase">Programmes</h2>
        <div className="glass-panel divide-y divide-border">
          {data.programmes.map((p) => (
            <div key={p.id} className="group grid items-center gap-4 p-5 md:grid-cols-[1fr_auto_auto]">
              <div>
                <p className="font-display text-xl uppercase transition-colors group-hover:text-primary">{p.title}</p>
                {p.description && <p className="mt-1 text-sm text-muted-foreground">{p.description}</p>}
              </div>
              <div className="flex flex-wrap gap-2 font-semibold text-xs">
                <span className="rounded-lg bg-glass px-3 py-1 text-ice">{p.duration}</span>
                <span className="rounded-lg bg-glass px-3 py-1 text-muted-foreground">{p.mode}</span>
                {p.starts_on && <span className="rounded-lg bg-glass px-3 py-1 text-muted-foreground">Starts {formatDate(p.starts_on)}</span>}
                <span className="rounded-lg bg-glass px-3 py-1 text-primary">{formatMoney(p.price, p.currency)}</span>
              </div>
              <button onClick={() => setProg({ id: p.id, title: p.title })} className="rounded-lg px-4 py-2 text-sm font-semibold ring-1 ring-primary/50 transition-colors hover:bg-primary hover:text-primary-foreground">Register</button>
            </div>
          ))}
        </div>
      </section>

      <section id="join" className="mx-auto max-w-3xl scroll-mt-24 px-6 pb-24">
        <form className="glass-panel space-y-4 p-6 md:p-8" onSubmit={join.onSubmit}>
          <p className="eyebrow text-primary">Apply · {tier}</p>
          <h2 className="font-display text-4xl uppercase">Join the Institute</h2>
          <div className="flex flex-wrap gap-2">
            {data.tiers.map((t) => (
              <button type="button" key={t.id} onClick={() => setTier(t.name)} className={`rounded-lg px-3 py-1.5 font-semibold text-xs ${tier === t.name ? "bg-primary text-primary-foreground" : "bg-glass text-muted-foreground ring-1 ring-hairline"}`}>{t.name}</button>
            ))}
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <input required name="fullName" placeholder="Full name" className="field" />
            <input required name="email" type="email" placeholder="Email" defaultValue={user?.email ?? ""} className="field" />
            <input name="phone" placeholder="Phone" className="field" />
            <input name="organisation" placeholder="Organisation" className="field" />
            <input name="country" placeholder="Country" className="field md:col-span-2" />
          </div>
          <textarea name="message" rows={3} placeholder="Experience, qualifications or anything we should know" className="field" />
          <SubmitButton busy={join.busy}>Submit application</SubmitButton>
        </form>
      </section>

      <FaqList faqs={data.faqs} />

      <Dialog open={!!prog} onOpenChange={(o) => !o && setProg(null)}>
        <DialogContent className="border-border bg-popover">
          <DialogHeader><DialogTitle className="font-display text-2xl uppercase">Register · {prog?.title}</DialogTitle></DialogHeader>
          <form onSubmit={reg.onSubmit} className="space-y-3">
            <input required name="fullName" placeholder="Full name" className="field" />
            <input required name="email" type="email" placeholder="Email" defaultValue={user?.email ?? ""} className="field" />
            <input name="phone" placeholder="Phone" className="field" />
            <SubmitButton busy={reg.busy}>Confirm registration</SubmitButton>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
