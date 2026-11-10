import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Megaphone, Newspaper, Trophy } from "lucide-react";
import { PageHead } from "@/components/site/SiteChrome";
import { Partners } from "@/components/site/Promo";
import { SubmitButton, useFormSubmit } from "@/components/site/forms";
import { globalQuery } from "@/lib/queries";
import { str } from "@/lib/settings";
import { sendEnquiry } from "@/lib/submit.functions";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/advertise")({
  head: () => ({
    meta: [
      { title: "Advertise & Sponsor — Africa Real Estate Awards" },
      { name: "description", content: "Sponsor the Africa Real Estate Awards, advertise in the Magazine and newsroom, or partner with the Institute." },
      { property: "og:title", content: "Advertise & Sponsor — Africa Real Estate Awards" },
      { property: "og:type", content: "website" },
      { property: "og:description", content: "Reach Africa's property leaders through the Awards, Magazine and newsroom." },
    ],
  }),
  component: AdvertisePage,
});

const icons = [Trophy, Newspaper, Megaphone];

function AdvertisePage() {
  const { data: g } = useSuspenseQuery(globalQuery);
  const s = g.settings;
  const { user } = useAuth();
  const send = useServerFn(sendEnquiry);
  const form = useFormSubmit(
    (v) => send({ data: { kind: (v.kind as "advertising" | "sponsorship" | "contact") || "advertising", fullName: v.fullName ?? "", email: v.email ?? "", phone: v.phone ?? "", company: v.company ?? "", message: v.message ?? "" } }),
    () => "Thanks — our partnerships team will reply within two working days.",
  );
  return (
    <>
      <PageHead eyebrow={str(s, "advertise", "eyebrow")} title={str(s, "advertise", "title")} intro={str(s, "advertise", "intro")} />
      <section className="mx-auto grid max-w-7xl gap-5 px-6 pb-20 md:grid-cols-3">
        {[1, 2, 3].map((n, i) => {
          const Icon = icons[i]!;
          return (
            <div key={n} className="glass-panel p-6">
              <Icon className="size-6 text-primary" />
              <p className="mt-4 font-display text-2xl uppercase">{str(s, "advertise", `option${n}_title`)}</p>
              <p className="mt-2 text-sm text-muted-foreground">{str(s, "advertise", `option${n}_text`)}</p>
            </div>
          );
        })}
      </section>
      <section id="enquire" className="mx-auto max-w-3xl px-6 pb-24">
        <form onSubmit={form.onSubmit} className="glass-panel space-y-4 p-6 md:p-8">
          <p className="eyebrow text-primary">Enquiry</p>
          <h2 className="font-display text-4xl uppercase">Let's talk</h2>
          <select name="kind" className="field" defaultValue="advertising">
            <option value="advertising">Advertising</option>
            <option value="sponsorship">Awards sponsorship</option>
            <option value="contact">General enquiry</option>
          </select>
          <div className="grid gap-4 md:grid-cols-2">
            <input required name="fullName" placeholder="Full name" className="field" />
            <input required name="email" type="email" placeholder="Email" defaultValue={user?.email ?? ""} className="field" />
            <input name="phone" placeholder="Phone" className="field" />
            <input name="company" placeholder="Company" className="field" />
          </div>
          <textarea required name="message" rows={4} placeholder="What would you like to achieve?" className="field" />
          <SubmitButton busy={form.busy}>Send enquiry</SubmitButton>
        </form>
      </section>
      <Partners />
    </>
  );
}
