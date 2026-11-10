import { queryOptions } from "@tanstack/react-query";
import {
  getArticle, getAwardsContent, getGlobalContent, getHomeContent, getInstituteContent,
  getMagazineContent, getNewsList, getProfile, getProfilesList, getStory,
} from "@/lib/content.functions";

export const globalQuery = queryOptions({ queryKey: ["content", "global"], queryFn: () => getGlobalContent(), staleTime: 60_000 });
export const homeQuery = queryOptions({ queryKey: ["content", "home"], queryFn: () => getHomeContent(), staleTime: 30_000 });
export const awardsQuery = queryOptions({ queryKey: ["content", "awards"], queryFn: () => getAwardsContent(), staleTime: 10_000 });
export const instituteQuery = queryOptions({ queryKey: ["content", "institute"], queryFn: () => getInstituteContent(), staleTime: 30_000 });
export const newsQuery = queryOptions({ queryKey: ["content", "news"], queryFn: () => getNewsList(), staleTime: 30_000 });
export const articleQuery = (slug: string) => queryOptions({ queryKey: ["content", "article", slug], queryFn: () => getArticle({ data: { slug } }), staleTime: 30_000 });
export const magazineQuery = queryOptions({ queryKey: ["content", "magazine"], queryFn: () => getMagazineContent(), staleTime: 30_000 });
export const storyQuery = (slug: string) => queryOptions({ queryKey: ["content", "story", slug], queryFn: () => getStory({ data: { slug } }), staleTime: 30_000 });
export const profilesQuery = queryOptions({ queryKey: ["content", "profiles"], queryFn: () => getProfilesList(), staleTime: 30_000 });
export const profileQuery = (slug: string) => queryOptions({ queryKey: ["content", "profile", slug], queryFn: () => getProfile({ data: { slug } }), staleTime: 30_000 });
