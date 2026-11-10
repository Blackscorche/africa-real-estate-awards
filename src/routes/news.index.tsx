import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { PageHead } from "@/components/site/SiteChrome";
import { globalQuery, newsQuery } from "@/lib/queries";
import { formatDate, str } from "@/lib/settings";
import { resolveImageUrl } from "@/lib/utils";

export const Route = createFileRoute("/news/")({
  head: () => ({
    meta: [
      { title: "Africa Real Estate News — Markets, Policy & Profiles" },
      { name: "description", content: "Daily coverage of African property markets, policy, finance and the people shaping the industry." },
      { property: "og:title", content: "Africa Real Estate News" },
      { property: "og:type", content: "website" },
      { property: "og:description", content: "The newsroom of the Institute of Real Estate Management, Leadership and Professionals." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(newsQuery),
  component: NewsPage,
});

function NewsPage() {
  const { data: news } = useSuspenseQuery(newsQuery);
  const { data: g } = useSuspenseQuery(globalQuery);
  const tags = useMemo(() => ["All", ...Array.from(new Set(news.map((n) => n.tag)))], [news]);
  const [tag, setTag] = useState("All");
  const [q, setQ] = useState("");
  const list = news.filter((n) => (tag === "All" || n.tag === tag) && (n.title + n.excerpt).toLowerCase().includes(q.toLowerCase()));
  const [lead, ...rest] = list;

  return (
    <>
      <PageHead eyebrow={str(g.settings, "news", "eyebrow")} title={str(g.settings, "news", "title")} intro={str(g.settings, "news", "intro")} />
      <section className="mx-auto max-w-7xl px-6 pb-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {tags.map((t) => (
              <button key={t} onClick={() => setTag(t)} className={`rounded-lg px-3 py-1.5 font-semibold text-xs transition-colors ${tag === t ? "bg-ice text-background" : "bg-glass text-muted-foreground ring-1 ring-hairline hover:text-foreground"}`}>{t}</button>
            ))}
          </div>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search stories…" className="w-full rounded-lg bg-well px-4 py-2 text-sm ring-1 ring-hairline outline-none focus:ring-ice/60 md:w-72" />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24">
        {!lead && <p className="glass-panel p-8 text-center text-muted-foreground">No stories match that search.</p>}
        {lead && (
          <Link to="/news/$slug" params={{ slug: lead.slug }} className="glass-panel group mb-6 grid overflow-hidden md:grid-cols-2">
            <img src={resolveImageUrl(lead.image_url, "lekki-skyline")} alt="" width={1600} height={1000} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="flex flex-col justify-center p-6 md:p-10">
              <span className="eyebrow text-primary">{lead.tag} · {lead.read_time} · {formatDate(lead.published_at)}</span>
              <h2 className="mt-3 text-balance font-display text-4xl uppercase leading-none transition-colors group-hover:text-primary md:text-5xl">{lead.title}</h2>
              <p className="mt-4 text-muted-foreground">{lead.excerpt}</p>
              <span className="mt-6 text-sm font-semibold text-primary">Read story →</span>
            </div>
          </Link>
        )}
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {rest.map((n) => (
            <Link key={n.id} to="/news/$slug" params={{ slug: n.slug }} className="rise group overflow-hidden rounded-xl bg-glass ring-1 ring-hairline transition-colors hover:ring-ice/50">
              <img src={resolveImageUrl(n.image_url, "lagos-apartments")} alt="" width={1600} height={1000} loading="lazy" className="aspect-[16/10] w-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="p-6">
                <span className="eyebrow text-ice">{n.tag} · {n.read_time}</span>
                <h3 className="mt-3 font-display text-2xl uppercase leading-tight transition-colors group-hover:text-ice">{n.title}</h3>
                <p className="mt-3 text-sm text-muted-foreground">{n.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
