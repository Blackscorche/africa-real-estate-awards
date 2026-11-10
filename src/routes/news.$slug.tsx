import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { articleQuery } from "@/lib/queries";
import { formatDate, paragraphs } from "@/lib/settings";

export const Route = createFileRoute("/news/$slug")({
  loader: async ({ context, params }) => {
    const data = await context.queryClient.ensureQueryData(articleQuery(params.slug));
    if (!data.article) throw notFound();
    return { title: data.article.title, excerpt: data.article.excerpt };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.title ?? "Story"} — Africa Real Estate News` },
      { name: "description", content: loaderData?.excerpt ?? "" },
      { property: "og:title", content: loaderData?.title ?? "Africa Real Estate News" },
      { property: "og:description", content: loaderData?.excerpt ?? "" },
      { property: "og:type", content: "article" },
    ],
  }),
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl px-6 py-24 text-center">
      <h1 className="font-display text-5xl uppercase">Story not found</h1>
      <Link to="/news" className="mt-6 inline-block font-semibold text-primary">Back to the newsroom →</Link>
    </div>
  ),
  component: ArticlePage,
});

function ArticlePage() {
  const { slug } = Route.useParams();
  const { data } = useSuspenseQuery(articleQuery(slug));
  const a = data.article!;
  return (
    <article className="pb-24">
      <header className="mx-auto max-w-4xl px-6 pt-12">
        <Link to="/news" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"><ArrowLeft className="size-4" /> Newsroom</Link>
        <p className="eyebrow mt-8 text-primary">{a.tag} · {a.read_time} · {formatDate(a.published_at)}</p>
        <h1 className="mt-4 text-balance font-display text-5xl uppercase leading-[0.95] md:text-7xl">{a.title}</h1>
        <p className="mt-6 text-xl text-muted-foreground">{a.excerpt}</p>
        <p className="eyebrow mt-6 text-muted-foreground">By {a.author}</p>
      </header>
      {a.image_url && (
        <div className="mx-auto mt-10 max-w-6xl px-6">
          <img src={a.image_url} alt="" width={1600} height={1000} className="aspect-[16/9] w-full rounded-xl object-cover ring-1 ring-hairline" />
        </div>
      )}
      <div className="prose-body mx-auto mt-12 max-w-3xl px-6">
        {paragraphs(a.body).map((p, i) => <p key={i}>{p}</p>)}
      </div>
      {data.more.length > 0 && (
        <section className="mx-auto mt-20 max-w-7xl px-6">
          <h2 className="mb-6 font-display text-3xl uppercase">More from the newsroom</h2>
          <div className="grid gap-5 md:grid-cols-3">
            {data.more.map((m) => (
              <Link key={m.id} to="/news/$slug" params={{ slug: m.slug }} className="group overflow-hidden rounded-xl bg-glass ring-1 ring-hairline hover:ring-primary/40">
                {m.image_url && <img src={m.image_url} alt="" loading="lazy" className="aspect-[16/10] w-full object-cover" />}
                <div className="p-5">
                  <span className="eyebrow text-ice">{m.tag} · {m.read_time}</span>
                  <p className="mt-2 font-display text-xl uppercase leading-tight group-hover:text-primary">{m.title}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
