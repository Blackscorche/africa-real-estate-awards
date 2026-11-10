import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { HeroSlider, MagazineAd, Partners } from "@/components/site/Promo";
import { AnnouncementBar } from "@/components/site/SiteChrome";
import { SmartLink } from "@/components/site/SmartLink";
import { globalQuery, homeQuery } from "@/lib/queries";
import { str } from "@/lib/settings";
import { resolveImageUrl } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Africa Real Estate Awards 2026 — Institute of Real Estate" },
      { name: "description", content: "Membership, leadership training, the Africa Real Estate Awards (13 Dec 2026, Lekki Colosseum Rooftop, Lagos), Africa Real Estate News and Magazine." },
      { property: "og:title", content: "Africa Real Estate Awards 2026" },
      { property: "og:type", content: "website" },
      { property: "og:description", content: "The continent's finest in real estate, honoured. 13 Dec 2026 · Lekki Colosseum Rooftop, Lagos." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(homeQuery),
  component: Index,
});

function Index() {
  const { data } = useSuspenseQuery(homeQuery);
  const { data: g } = useSuspenseQuery(globalQuery);
  const s = g.settings;
  const [feature, ...moreNews] = data.news;
  const stats = [1, 2, 3, 4].map((n) => [str(s, "home", `stat${n}_value`), str(s, "home", `stat${n}_label`)] as const).filter(([v]) => v);

  return (
    <>
      <AnnouncementBar />
      <HeroSlider slides={data.slides} tiers={data.tiers} />

      {stats.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 pb-20">
          <div className="glass-panel grid grid-cols-2 divide-border md:grid-cols-4 md:divide-x">
            {stats.map(([v, l]) => (
              <div key={l} className="p-6 text-center">
                <p className="font-display text-5xl text-primary">{v}</p>
                <p className="eyebrow mt-2 text-muted-foreground">{l}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {data.cards.map((w, i) => (
            <SmartLink key={w.id} to={w.link} className={`group rise relative block overflow-hidden rounded-xl p-6 ring-1 transition-colors duration-300 ${w.highlighted ? "bg-primary/10 ring-primary/30 hover:bg-primary/15" : "bg-glass ring-hairline hover:ring-primary/50"}`}>
              <span className={`eyebrow ${w.highlighted ? "text-primary" : "text-muted-foreground"}`} style={{ animationDelay: `${120 + i * 60}ms` }}>{w.tag}</span>
              <h3 className="mt-3 font-display text-2xl uppercase tracking-tight">{w.title}</h3>
              <p className="mt-2 text-pretty text-sm text-muted-foreground">{w.body}</p>
              <span className="mt-5 inline-block text-sm font-semibold text-primary transition-transform duration-300 group-hover:translate-x-1">{w.cta_label} →</span>
            </SmartLink>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="relative overflow-hidden rounded-xl ring-1 ring-hairline">
          <img src={resolveImageUrl(str(s, "home", "gala_image"), "gala-rooftop")} alt="Gala Rooftop Ceremony" width={1600} height={1000} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background/10" />
          <div className="relative max-w-xl p-8 md:p-14">
            <p className="eyebrow text-primary">{str(s, "home", "gala_eyebrow")}</p>
            <h2 className="mt-3 text-balance font-display text-5xl uppercase leading-[0.95] md:text-6xl">{str(s, "home", "gala_title")}</h2>
            <p className="mt-4 text-muted-foreground">{str(s, "home", "gala_text")}</p>
            <p className="eyebrow mt-6 text-ice">{str(s, "awards", "venue")} · {str(s, "awards", "venue_detail")}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/awards" hash="tickets" className="rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground hover:bg-primary/80">Book a table</Link>
              <Link to="/awards" hash="vote" className="rounded-lg px-6 py-3 font-medium ring-1 ring-input hover:text-primary hover:ring-primary/60">Vote now</Link>
            </div>
          </div>
        </div>
      </section>

      <MagazineAd />

      <section className="mx-auto grid max-w-7xl gap-6 px-6 pb-24 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          {feature && (
            <Link to="/news/$slug" params={{ slug: feature.slug }} className="group relative block overflow-hidden rounded-xl">
              <img src={resolveImageUrl(feature.image_url, "lekki-skyline")} alt={feature.title} width={1600} height={912} loading="lazy" className="aspect-[16/9] w-full object-cover transition-transform duration-700 ease-glide group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6">
                <span className="font-semibold text-[10px] uppercase tracking-wider text-primary">{feature.tag} · {feature.read_time}</span>
                <h3 className="mt-1 text-balance font-display text-3xl uppercase tracking-tight md:text-4xl">{feature.title}</h3>
              </div>
            </Link>
          )}
          <div className="grid gap-4 md:grid-cols-3">
            {moreNews.map((n) => (
              <Link key={n.id} to="/news/$slug" params={{ slug: n.slug }} className="group rounded-xl bg-glass p-5 ring-1 ring-hairline transition-colors hover:ring-primary/40">
                <span className="eyebrow text-ice">{n.tag}</span>
                <p className="mt-2 font-display text-lg uppercase leading-tight transition-colors group-hover:text-primary">{n.title}</p>
              </Link>
            ))}
          </div>
        </div>
        <aside className="glass-panel self-start p-6">
          <p className="eyebrow text-muted-foreground">Profiles</p>
          <ul className="mt-4 divide-y divide-border">
            {data.profiles.map((p) => (
              <li key={p.id}>
                <Link to="/profiles/$slug" params={{ slug: p.slug }} className="group flex items-center gap-3 py-3">
                  {p.image_url && <img src={p.image_url} alt={p.name} width={96} height={96} loading="lazy" className="size-12 rounded-full object-cover ring-1 ring-hairline" />}
                  <div>
                    <p className="text-sm font-medium transition-colors group-hover:text-primary">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.role} · {p.city}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
          <Link to="/profiles" className="mt-4 inline-block text-sm font-semibold text-ice">All profiles →</Link>
          {data.issue && (
            <Link to="/magazine" className="group mt-6 block overflow-hidden rounded-lg ring-1 ring-hairline">
              {data.issue.cover_url && <img src={data.issue.cover_url} alt={data.issue.title} width={1088} height={1440} loading="lazy" className="aspect-[3/4] w-full object-cover transition-transform duration-700 group-hover:scale-105" />}
              <div className="p-4">
                <p className="eyebrow text-primary">{data.issue.issue_label}</p>
                <p className="mt-1 font-display text-xl uppercase">{data.issue.title}</p>
              </div>
            </Link>
          )}
        </aside>
      </section>
      <Partners />
    </>
  );
}
