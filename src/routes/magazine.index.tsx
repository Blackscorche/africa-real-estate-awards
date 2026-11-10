import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { PageHead } from "@/components/site/SiteChrome";
import { FaqList } from "@/components/site/Promo";
import { SubmitButton, useFormSubmit } from "@/components/site/forms";
import { globalQuery, magazineQuery } from "@/lib/queries";
import { str } from "@/lib/settings";
import { subscribe } from "@/lib/submit.functions";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/magazine/")({
  head: () => ({
    meta: [
      { title: "Africa Real Estate Magazine — Print & Digital" },
      { name: "description", content: "Quarterly long-form journalism from Africa Real Estate Magazine: cover stories, market deep-dives and the annual awards edition. Subscribe today." },
      { property: "og:title", content: "Africa Real Estate Magazine" },
      { property: "og:type", content: "website" },
      { property: "og:description", content: "Quarterly long-form journalism on African property. Read the current issue or subscribe in print & digital." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(magazineQuery),
  component: MagazinePage,
});

function MagazinePage() {
  const { data } = useSuspenseQuery(magazineQuery);
  const { data: g } = useSuspenseQuery(globalQuery);
  const s = g.settings;
  const { user } = useAuth();
  const sub = useServerFn(subscribe);
  const form = useFormSubmit(
    (v) => sub({ data: { email: v.email ?? "", fullName: v.fullName ?? "", format: v.format ?? "", source: "magazine" } }),
    (r) => (r.already ? "You're already subscribed — thank you!" : `Subscription received. ${str(s, "magazine", "next_issue_text")}`),
  );
  const current = data.issues.find((i) => i.is_current) ?? data.issues[0];
  const lead = data.stories.find((x) => x.is_lead) ?? data.stories[0];
  const rest = data.stories.filter((x) => x.id !== lead?.id);
  const issueLabel = (id: string | null) => data.issues.find((i) => i.id === id)?.issue_label ?? "";

  return (
    <>
      <PageHead eyebrow={str(s, "magazine", "eyebrow")} title={str(s, "magazine", "title")} intro={str(s, "magazine", "intro")} />

      {current && (
        <section className="mx-auto max-w-7xl px-6 pb-8">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-lg bg-primary/15 px-3 py-1.5 font-semibold text-xs text-primary">{current.issue_label} — {current.title}</span>
            <span className="rounded-lg bg-glass px-3 py-1.5 font-semibold text-xs text-muted-foreground ring-1 ring-hairline">Quarterly</span>
            <span className="rounded-lg bg-glass px-3 py-1.5 font-semibold text-xs text-muted-foreground ring-1 ring-hairline">Print · Digital · Newsstands</span>
          </div>
        </section>
      )}

      <section className="mx-auto max-w-7xl px-6 pb-20">
        {lead && (
          <article className="glass-panel group mb-6 grid overflow-hidden md:grid-cols-[0.9fr_1.1fr]">
            {(lead.image_url || current?.cover_url) && <img src={lead.image_url || current?.cover_url || ""} alt="" width={1088} height={1440} className="h-full w-full object-cover" />}
            <div className="flex flex-col justify-center p-6 md:p-10">
              <span className="eyebrow text-primary">{lead.tag} · {issueLabel(lead.issue_id)}</span>
              <h2 className="mt-3 text-balance font-display text-4xl uppercase leading-[0.95] md:text-5xl">{lead.title}</h2>
              <p className="mt-5 max-w-[52ch] text-pretty text-muted-foreground">{lead.excerpt}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/magazine/$slug" params={{ slug: lead.slug }} className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/80">Read the cover story</Link>
                <a href="#subscribe" className="rounded-lg px-5 py-2.5 text-sm font-medium ring-1 ring-input transition-colors hover:text-primary hover:ring-primary/60">Get this issue</a>
              </div>
            </div>
          </article>
        )}
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {rest.map((x) => (
            <Link key={x.id} to="/magazine/$slug" params={{ slug: x.slug }} className="rise group overflow-hidden rounded-xl bg-glass ring-1 ring-hairline transition-colors hover:ring-ice/50">
              {x.image_url && <img src={x.image_url} alt="" loading="lazy" className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-105" />}
              <div className="p-6">
                <span className="eyebrow text-ice">{x.tag} · {issueLabel(x.issue_id)}</span>
                <h3 className="mt-3 font-display text-2xl uppercase leading-tight transition-colors group-hover:text-ice">{x.title}</h3>
                <p className="mt-3 text-sm text-muted-foreground">{x.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section id="archive" className="mx-auto max-w-7xl scroll-mt-24 px-6 pb-20">
        <h2 className="mb-6 font-display text-4xl uppercase">The issues</h2>
        <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
          {data.issues.map((i) => (
            <div key={i.id} className="group">
              <div className="overflow-hidden rounded-lg ring-1 ring-hairline">
                {i.cover_url ? <img src={i.cover_url} alt={i.title} width={1088} height={1440} loading="lazy" className="aspect-[3/4] w-full object-cover transition-transform duration-700 group-hover:scale-105" /> : <div className="stripe-bg flex aspect-[3/4] items-center justify-center bg-ice-deep/30 p-4 text-center font-display text-2xl uppercase">{i.title}</div>}
              </div>
              <p className="eyebrow mt-3 text-primary">{i.issue_label}</p>
              <p className="font-display text-lg uppercase leading-tight">{i.title}</p>
              {i.digital_url ? <a href={i.digital_url} target="_blank" rel="noreferrer" className="text-sm font-semibold text-primary">Read digital →</a> : <a href="#subscribe" className="text-sm font-semibold text-primary">Subscribe to read →</a>}
            </div>
          ))}
        </div>
      </section>

      <section id="subscribe" className="mx-auto max-w-3xl scroll-mt-24 px-6 pb-24">
        <form className="glass-panel space-y-4 p-6 md:p-8" onSubmit={form.onSubmit}>
          <p className="eyebrow text-primary">Subscribe</p>
          <h2 className="font-display text-4xl uppercase">Never miss an issue</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <input required name="fullName" placeholder="Full name" className="field" />
            <input required name="email" type="email" placeholder="Email" defaultValue={user?.email ?? ""} className="field" />
          </div>
          <select name="format" className="field" defaultValue="Print & digital">
            <option>Print & digital</option>
            <option>Digital only</option>
            <option>Print only</option>
          </select>
          <SubmitButton busy={form.busy}>Subscribe to the Magazine</SubmitButton>
          <p className="text-center text-xs text-muted-foreground">{str(s, "magazine", "subscribe_note")}</p>
        </form>
      </section>
      <FaqList faqs={data.faqs} />
    </>
  );
}
