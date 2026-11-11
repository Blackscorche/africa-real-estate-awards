import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { PageHead } from "@/components/site/SiteChrome";
import { SubmitButton, useFormSubmit } from "@/components/site/forms";
import { globalQuery, profilesQuery } from "@/lib/queries";
import { str } from "@/lib/settings";
import { resolveImageUrl } from "@/lib/utils";
import { sendEnquiry } from "@/lib/submit.functions";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/profiles/")({
  head: () => ({
    meta: [
      { title: "Profiles — Africa Real Estate News" },
      { name: "description", content: "In-depth profiles of the developers, architects and investors shaping African real estate. Request your own feature." },
      { property: "og:title", content: "Profiles — the people behind Africa's real estate" },
      { property: "og:type", content: "website" },
      { property: "og:description", content: "Long-form profiles from Africa Real Estate News. Request a profile feature." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(profilesQuery),
  component: ProfilesPage,
});

function ProfilesPage() {
  const { data: profiles } = useSuspenseQuery(profilesQuery);
  const { data: g } = useSuspenseQuery(globalQuery);
  const { user } = useAuth();
  const send = useServerFn(sendEnquiry);
  const form = useFormSubmit(
    (v) => send({ data: { kind: "profile_request", fullName: v.fullName ?? "", email: v.email ?? "", company: [v.role, v.city].filter(Boolean).join(" · "), phone: "", message: v.message ?? "" } }),
    () => "Profile request received. Our editors will be in touch.",
  );
  return (
    <>
      <PageHead eyebrow={str(g.settings, "profiles", "eyebrow")} title={str(g.settings, "profiles", "title")} intro={str(g.settings, "profiles", "intro")} />
      <section className="mx-auto grid max-w-7xl gap-6 px-6 pb-20 sm:grid-cols-2 lg:grid-cols-3">
        {profiles.map((p) => (
          <Link key={p.id} to="/profiles/$slug" params={{ slug: p.slug }} className="glass-panel rise group overflow-hidden">
              {p.image_url && <img src={resolveImageUrl(p.image_url, "profile-adaeze")} alt={p.name} width={816} height={816} loading="lazy" className="aspect-square w-full object-cover transition-transform duration-700 group-hover:scale-105" />}
            <div className="p-6">
              <span className="eyebrow text-ice">{p.role} · {p.city}</span>
              <h2 className="mt-2 font-display text-3xl uppercase leading-none transition-colors group-hover:text-primary">{p.name}</h2>
              <p className="mt-4 font-display text-lg uppercase leading-tight text-primary">“{p.quote}”</p>
              <p className="mt-3 text-sm text-muted-foreground">{p.bio}</p>
            </div>
          </Link>
        ))}
      </section>

      <section className="mx-auto max-w-3xl px-6 pb-24">
        <form className="glass-panel space-y-4 p-6 md:p-8" onSubmit={form.onSubmit}>
          <p className="eyebrow text-primary">Get profiled</p>
          <h2 className="font-display text-4xl uppercase">Request a feature</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <input required name="fullName" placeholder="Full name" className="field" />
            <input required name="email" type="email" placeholder="Email" defaultValue={user?.email ?? ""} className="field" />
            <input name="role" placeholder="Role & company" className="field" />
            <input name="city" placeholder="City" className="field" />
          </div>
          <textarea required name="message" rows={3} placeholder="Tell us your story in a few lines" className="field" />
          <SubmitButton busy={form.busy}>Send request</SubmitButton>
        </form>
      </section>
    </>
  );
}
