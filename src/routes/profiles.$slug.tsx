import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { profileQuery } from "@/lib/queries";
import { paragraphs } from "@/lib/settings";
import { resolveImageUrl } from "@/lib/utils";

export const Route = createFileRoute("/profiles/$slug")({
  loader: async ({ context, params }) => {
    const data = await context.queryClient.ensureQueryData(profileQuery(params.slug));
    if (!data.profile) throw notFound();
    return { name: data.profile.name, bio: data.profile.bio };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.name ?? "Profile"} — Africa Real Estate News` },
      { name: "description", content: loaderData?.bio ?? "" },
      { property: "og:title", content: `${loaderData?.name ?? "Profile"} — Africa Real Estate News` },
      { property: "og:description", content: loaderData?.bio ?? "" },
      { property: "og:type", content: "profile" },
    ],
  }),
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl px-6 py-24 text-center">
      <h1 className="font-display text-5xl uppercase">Profile not found</h1>
      <Link to="/profiles" className="mt-6 inline-block font-semibold text-primary">All profiles →</Link>
    </div>
  ),
  component: ProfilePage,
});

function ProfilePage() {
  const { slug } = Route.useParams();
  const { data } = useSuspenseQuery(profileQuery(slug));
  const p = data.profile!;
  return (
    <article className="pb-24">
      <div className="mx-auto max-w-7xl px-6 pt-12">
        <Link to="/profiles" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"><ArrowLeft className="size-4" /> Profiles</Link>
        <div className="glass-panel rise mt-8 grid overflow-hidden md:grid-cols-[1fr_1.1fr]">
          {p.image_url && <img src={resolveImageUrl(p.image_url, "profile-adaeze")} alt={p.name} width={816} height={816} className="aspect-square h-full w-full object-cover" />}
          <div className="flex flex-col justify-center p-6 md:p-12">
            <span className="eyebrow text-ice">{p.role} · {p.city}</span>
            <h1 className="mt-2 font-display text-6xl uppercase leading-none">{p.name}</h1>
            <p className="mt-6 font-display text-3xl uppercase leading-tight text-primary">“{p.quote}”</p>
            <p className="mt-6 text-muted-foreground">{p.bio}</p>
          </div>
        </div>
      </div>
      {p.body && (
        <div className="prose-body mx-auto mt-14 max-w-3xl px-6">
          {paragraphs(p.body).map((x, i) => <p key={i}>{x}</p>)}
        </div>
      )}
      {data.others.length > 0 && (
        <section className="mx-auto mt-20 max-w-7xl px-6">
          <h2 className="mb-6 font-display text-3xl uppercase">More profiles</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {data.others.map((o) => (
              <Link key={o.id} to="/profiles/$slug" params={{ slug: o.slug }} className="group flex items-center gap-3 rounded-xl bg-glass p-4 ring-1 ring-hairline hover:ring-primary/40">
                {o.image_url && <img src={resolveImageUrl(o.image_url, "profile-adaeze")} alt={o.name} loading="lazy" className="size-14 rounded-full object-cover" />}
                <div><p className="font-medium group-hover:text-primary">{o.name}</p><p className="text-xs text-muted-foreground">{o.role} · {o.city}</p></div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
