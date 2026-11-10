import { useEffect, useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { Countdown } from "@/components/site/Countdown";
import { SmartLink } from "@/components/site/SmartLink";
import { globalQuery } from "@/lib/queries";
import { str } from "@/lib/settings";
import { resolveImageUrl } from "@/lib/utils";
import { subscribe } from "@/lib/submit.functions";
import { useFormSubmit } from "@/components/site/forms";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import type { Tables } from "@/integrations/supabase/types";

export function HeroSlider({ slides, tiers }: { slides: Tables<"hero_slides">[]; tiers: { name: string }[] }) {
  const { data } = useSuspenseQuery(globalQuery);
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused || slides.length < 2) return;
    const t = setInterval(() => setI((v) => (v + 1) % slides.length), 7000);
    return () => clearInterval(t);
  }, [paused, slides.length]);
  if (!slides.length) return null;
  const s = slides[i % slides.length]!;
  const eventDate = str(data.settings, "awards", "event_date");
  return (
    <section onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} className="mx-auto grid max-w-7xl items-center gap-14 px-6 pb-16 pt-12 lg:grid-cols-[1.1fr_0.9fr]">
      <div key={s.id}>
        <p className="rise eyebrow mb-5 text-primary">{s.eyebrow}</p>
        <h1 className="rise text-balance font-display text-6xl uppercase leading-[0.92] tracking-tight md:text-8xl" style={{ animationDelay: "80ms" }}>
          {s.title} {s.highlight && <span className="text-primary">{s.highlight}</span>}
        </h1>
        <p className="rise mt-6 max-w-[46ch] text-pretty text-lg text-muted-foreground" style={{ animationDelay: "160ms" }}>{s.body}</p>
        <div className="rise mt-8 flex flex-wrap gap-3" style={{ animationDelay: "240ms" }}>
          {s.cta_label && <SmartLink to={s.cta_link} className="rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary/80">{s.cta_label}</SmartLink>}
          {s.alt_label && <SmartLink to={s.alt_link} className="rounded-lg px-6 py-3 font-medium ring-1 ring-input transition-colors hover:text-primary hover:ring-primary/60">{s.alt_label}</SmartLink>}
        </div>
        {slides.length > 1 && (
          <div className="mt-10 flex items-center gap-3">
            <button aria-label="Previous slide" onClick={() => setI((i + slides.length - 1) % slides.length)} className="rounded-lg p-2 ring-1 ring-hairline hover:text-primary"><ChevronLeft className="size-4" /></button>
            {slides.map((x, n) => (
              <button key={x.id} aria-label={`Slide ${n + 1}`} onClick={() => setI(n)} className={`h-1.5 rounded-full transition-all ${n === i ? "w-10 bg-primary" : "w-5 bg-hairline"}`} />
            ))}
            <button aria-label="Next slide" onClick={() => setI((i + 1) % slides.length)} className="rounded-lg p-2 ring-1 ring-hairline hover:text-primary"><ChevronRight className="size-4" /></button>
          </div>
        )}
      </div>
      <div className="relative">
        <div key={s.id} className="rise relative overflow-hidden rounded-xl ring-1 ring-hairline">
          {s.image_url && <img src={resolveImageUrl(s.image_url, "hero-rooftop")} alt="" width={1600} height={1000} className="aspect-[4/5] w-full object-cover md:aspect-[5/6]" />}
          {s.panel !== "image" && (
            <div className="glass-panel absolute inset-x-4 bottom-4 p-5 shadow-lg">
              {s.panel === "countdown" ? (
                <>
                  <p className="eyebrow text-ice">Gala countdown · {str(data.settings, "awards", "venue", "Lagos")}</p>
                  <div className="mt-3"><Countdown date={eventDate} /></div>
                </>
              ) : (
                <>
                  <p className="eyebrow text-ice">Membership tracks</p>
                  <ul className="mt-2 flex flex-wrap gap-2">
                    {tiers.map((m) => <li key={m.name} className="rounded-lg bg-well px-3 py-1.5 font-display text-lg uppercase ring-1 ring-hairline">{m.name}</li>)}
                  </ul>
                  <p className="mt-3 text-sm text-muted-foreground">CPD-accredited · Pan-African network</p>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export function MagazineAd() {
  const { data } = useSuspenseQuery(globalQuery);
  const sub = useServerFn(subscribe);
  const { busy, onSubmit } = useFormSubmit(
    (v) => sub({ data: { email: v.email ?? "", source: "newsletter", fullName: "", format: "Digital only" } }),
    (r) => (r.already ? "You're already subscribed — thank you!" : "You're subscribed to Africa Real Estate Magazine."),
  );
  const s = data.settings;
  return (
    <section className="mx-auto max-w-7xl px-6 pb-20">
      <div className="glass-panel flex flex-col items-start justify-between gap-6 p-6 md:flex-row md:items-center md:p-8">
        <div>
          <p className="eyebrow text-primary">{str(s, "home", "magazine_eyebrow")}</p>
          <h2 className="mt-2 font-display text-3xl uppercase md:text-4xl">{str(s, "home", "magazine_title")}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{str(s, "home", "magazine_text")}</p>
        </div>
        <form onSubmit={onSubmit} className="flex w-full max-w-md gap-2">
          <input required type="email" name="email" placeholder="Your email" className="min-w-0 flex-1 rounded-lg bg-well px-4 py-3 text-sm ring-1 ring-hairline outline-none focus:ring-primary/60" />
          <button disabled={busy} className="rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/80 disabled:opacity-60">{busy ? "…" : "Subscribe"}</button>
        </form>
      </div>
    </section>
  );
}

export function Partners() {
  const { data } = useSuspenseQuery(globalQuery);
  if (!data.partners.length) return null;
  return (
    <section className="mx-auto max-w-7xl px-6 pb-20">
      <p className="eyebrow mb-5 text-center text-muted-foreground">Our partners</p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {data.partners.map((p) => {
          const inner = p.logo_url
            ? <img src={p.logo_url} alt={p.name} className="max-h-10 w-auto object-contain" loading="lazy" />
            : <span className="font-display text-lg uppercase leading-none tracking-tight">{p.mark || p.name}<span className="text-primary">{p.accent}</span></span>;
          const cls = "flex h-20 items-center justify-center rounded-lg bg-glass px-3 text-center ring-1 ring-hairline grayscale transition hover:grayscale-0 hover:ring-primary/40";
          return p.website
            ? <a key={p.id} href={p.website} target="_blank" rel="noreferrer" className={cls}>{inner}</a>
            : <div key={p.id} className={cls}>{inner}</div>;
        })}
      </div>
    </section>
  );
}

export function FaqList({ faqs, title = "Questions, answered" }: { faqs: Tables<"faqs">[]; title?: string }) {
  if (!faqs.length) return null;
  return (
    <section className="mx-auto max-w-4xl px-6 pb-24">
      <h2 className="mb-6 font-display text-4xl uppercase">{title}</h2>
      <Accordion type="single" collapsible className="glass-panel px-6">
        {faqs.map((f) => (
          <AccordionItem key={f.id} value={f.id} className="border-border">
            <AccordionTrigger className="text-left text-base hover:text-primary hover:no-underline">{f.question}</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">{f.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
