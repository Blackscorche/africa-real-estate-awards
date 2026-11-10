import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { storyQuery } from "@/lib/queries";
import { paragraphs } from "@/lib/settings";

export const Route = createFileRoute("/magazine/$slug")({
  loader: async ({ context, params }) => {
    const data = await context.queryClient.ensureQueryData(storyQuery(params.slug));
    if (!data.story) throw notFound();
    return { title: data.story.title, excerpt: data.story.excerpt };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.title ?? "Story"} — Africa Real Estate Magazine` },
      { name: "description", content: loaderData?.excerpt ?? "" },
      { property: "og:title", content: loaderData?.title ?? "Africa Real Estate Magazine" },
      { property: "og:description", content: loaderData?.excerpt ?? "" },
      { property: "og:type", content: "article" },
    ],
  }),
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl px-6 py-24 text-center">
      <h1 className="font-display text-5xl uppercase">Story not found</h1>
      <Link to="/magazine" className="mt-6 inline-block font-semibold text-primary">Back to the magazine →</Link>
    </div>
  ),
  component: StoryPage,
});

function StoryPage() {
  const { slug } = Route.useParams();
  const { data } = useSuspenseQuery(storyQuery(slug));
  const s = data.story!;
  const issue = s.magazine_issues as { issue_label: string; title: string } | null;
  return (
    <article className="pb-24">
      <header className="mx-auto max-w-4xl px-6 pt-12">
        <Link to="/magazine" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"><ArrowLeft className="size-4" /> Magazine</Link>
        <p className="eyebrow mt-8 text-primary">{s.tag}{issue ? ` · ${issue.issue_label}` : ""}</p>
        <h1 className="mt-4 text-balance font-display text-5xl uppercase leading-[0.95] md:text-7xl">{s.title}</h1>
        <p className="mt-6 text-xl text-muted-foreground">{s.excerpt}</p>
      </header>
      {s.image_url && (
        <div className="mx-auto mt-10 max-w-5xl px-6">
          <img src={s.image_url} alt="" className="max-h-[80vh] w-full rounded-xl object-cover ring-1 ring-hairline" />
        </div>
      )}
      <div className="prose-body mx-auto mt-12 max-w-3xl px-6">
        {paragraphs(s.body).map((p, i) => <p key={i}>{p}</p>)}
      </div>
      <div className="mx-auto mt-12 max-w-3xl px-6">
        <div className="glass-panel flex flex-wrap items-center justify-between gap-4 p-6">
          <p className="font-display text-2xl uppercase">Read the full issue in print & digital</p>
          <Link to="/magazine" hash="subscribe" className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground">Subscribe</Link>
        </div>
      </div>
      {data.more.length > 0 && (
        <section className="mx-auto mt-20 max-w-7xl px-6">
          <h2 className="mb-6 font-display text-3xl uppercase">Also in the magazine</h2>
          <div className="grid gap-5 md:grid-cols-3">
            {data.more.map((m) => (
              <Link key={m.id} to="/magazine/$slug" params={{ slug: m.slug }} className="group overflow-hidden rounded-xl bg-glass ring-1 ring-hairline hover:ring-primary/40">
                {m.image_url && <img src={m.image_url} alt="" loading="lazy" className="aspect-[16/10] w-full object-cover" />}
                <div className="p-5"><span className="eyebrow text-ice">{m.tag}</span><p className="mt-2 font-display text-xl uppercase leading-tight group-hover:text-primary">{m.title}</p></div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
