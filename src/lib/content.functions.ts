import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getServerSupabase } from "@/lib/server-supabase";
import type { SettingValue, SettingsMap } from "@/lib/settings";

function must<T>(res: { data: T | null; error: { message: string } | null }): T {
  if (res.error) throw new Error(res.error.message);
  return (res.data ?? []) as T;
}

export const getGlobalContent = createServerFn({ method: "GET" }).handler(async () => {
  const sb = getServerSupabase();
  const [settings, nav, partners] = await Promise.all([
    sb.from("site_settings").select("key, value"),
    sb.from("nav_links").select("*").order("sort_order"),
    sb.from("partners").select("*").order("sort_order"),
  ]);
  const map: SettingsMap = {};
  for (const row of must(settings)) map[row.key] = (row.value ?? {}) as Record<string, SettingValue>;
  return { settings: map, nav: must(nav), partners: must(partners) };
});

export const getHomeContent = createServerFn({ method: "GET" }).handler(async () => {
  const sb = getServerSupabase();
  const [slides, cards, news, profiles, tiers, issue] = await Promise.all([
    sb.from("hero_slides").select("*").order("sort_order"),
    sb.from("home_cards").select("*").order("sort_order"),
    sb.from("news_articles").select("id, slug, title, tag, excerpt, image_url, read_time, featured, published_at").order("featured", { ascending: false }).order("published_at", { ascending: false }).limit(4),
    sb.from("people_profiles").select("id, slug, name, role, city, image_url").order("sort_order").limit(4),
    sb.from("membership_tiers").select("name").order("sort_order"),
    sb.from("magazine_issues").select("*").order("is_current", { ascending: false }).order("sort_order").limit(1),
  ]);
  return { slides: must(slides), cards: must(cards), news: must(news), profiles: must(profiles), tiers: must(tiers), issue: must(issue)[0] ?? null };
});

export const getAwardsContent = createServerFn({ method: "GET" }).handler(async () => {
  const sb = getServerSupabase();
  const [categories, nominees, timeline, judges, faqs, packages] = await Promise.all([
    sb.from("award_categories").select("*").order("sort_order"),
    sb.from("nominees").select("id, category_id, name, company, citation, image_url, status, vote_count, created_at").neq("status", "hidden").order("vote_count", { ascending: false }),
    sb.from("award_timeline").select("*").order("sort_order"),
    sb.from("judges").select("*").order("sort_order"),
    sb.from("faqs").select("*").eq("section", "awards").order("sort_order"),
    sb.from("ticket_packages").select("*").order("sort_order"),
  ]);
  return { categories: must(categories), nominees: must(nominees), timeline: must(timeline), judges: must(judges), faqs: must(faqs), packages: must(packages) };
});

export const getInstituteContent = createServerFn({ method: "GET" }).handler(async () => {
  const sb = getServerSupabase();
  const [tiers, programmes, faqs] = await Promise.all([
    sb.from("membership_tiers").select("*").order("sort_order"),
    sb.from("programmes").select("*").order("sort_order"),
    sb.from("faqs").select("*").eq("section", "institute").order("sort_order"),
  ]);
  return { tiers: must(tiers), programmes: must(programmes), faqs: must(faqs) };
});

export const getNewsList = createServerFn({ method: "GET" }).handler(async () => {
  const sb = getServerSupabase();
  const res = await sb.from("news_articles").select("id, slug, title, tag, excerpt, image_url, author, read_time, featured, published_at").order("featured", { ascending: false }).order("published_at", { ascending: false });
  return must(res);
});

export const getArticle = createServerFn({ method: "GET" })
  .inputValidator((d: { slug: string }) => z.object({ slug: z.string().min(1).max(200) }).parse(d))
  .handler(async ({ data }) => {
    const sb = getServerSupabase();
    const [article, more] = await Promise.all([
      sb.from("news_articles").select("*").eq("slug", data.slug).maybeSingle(),
      sb.from("news_articles").select("id, slug, title, tag, image_url, read_time").neq("slug", data.slug).order("published_at", { ascending: false }).limit(3),
    ]);
    if (article.error) throw new Error(article.error.message);
    return { article: article.data, more: must(more) };
  });

export const getMagazineContent = createServerFn({ method: "GET" }).handler(async () => {
  const sb = getServerSupabase();
  const [issues, stories, faqs] = await Promise.all([
    sb.from("magazine_issues").select("*").order("is_current", { ascending: false }).order("sort_order"),
    sb.from("magazine_stories").select("id, issue_id, slug, title, tag, excerpt, image_url, is_lead, sort_order").order("is_lead", { ascending: false }).order("sort_order"),
    sb.from("faqs").select("*").eq("section", "magazine").order("sort_order"),
  ]);
  return { issues: must(issues), stories: must(stories), faqs: must(faqs) };
});

export const getStory = createServerFn({ method: "GET" })
  .inputValidator((d: { slug: string }) => z.object({ slug: z.string().min(1).max(200) }).parse(d))
  .handler(async ({ data }) => {
    const sb = getServerSupabase();
    const story = await sb.from("magazine_stories").select("*, magazine_issues(issue_label, title)").eq("slug", data.slug).maybeSingle();
    if (story.error) throw new Error(story.error.message);
    const more = await sb.from("magazine_stories").select("id, slug, title, tag, image_url").neq("slug", data.slug).order("sort_order").limit(3);
    return { story: story.data, more: must(more) };
  });

export const getProfilesList = createServerFn({ method: "GET" }).handler(async () => {
  const sb = getServerSupabase();
  return must(await sb.from("people_profiles").select("*").order("sort_order"));
});

export const getProfile = createServerFn({ method: "GET" })
  .inputValidator((d: { slug: string }) => z.object({ slug: z.string().min(1).max(200) }).parse(d))
  .handler(async ({ data }) => {
    const sb = getServerSupabase();
    const [p, others] = await Promise.all([
      sb.from("people_profiles").select("*").eq("slug", data.slug).maybeSingle(),
      sb.from("people_profiles").select("id, slug, name, role, city, image_url").neq("slug", data.slug).order("sort_order").limit(4),
    ]);
    if (p.error) throw new Error(p.error.message);
    return { profile: p.data, others: must(others) };
  });
