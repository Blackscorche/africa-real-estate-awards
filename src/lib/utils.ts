import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const CURATED_IMAGES: Record<string, string> = {
  "gala-rooftop": "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=1600&q=80",
  "institute-training": "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1600&q=80",
  "lekki-skyline": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80",
  "lagos-apartments": "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1600&q=80",
  "keys-mortgage": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80",
  "green-tower-nairobi": "https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1600&q=80",
  "magazine-cover": "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
  "cover-issue-11": "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
  "cover-issue-10": "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
  "profile-adaeze": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80",
  "profile-kwame": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80",
  "profile-zanele": "https://images.unsplash.com/photo-1580894732454-d677e43e60b4?auto=format&fit=crop&w=800&q=80",
  "hero-rooftop": "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=1600&q=80",
  "hero-architecture": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80",
  "awards-trophy": "https://images.unsplash.com/photo-1578269174936-2709b6aeb913?auto=format&fit=crop&w=1200&q=80",
};

const DEFAULT_REAL_ESTATE = "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80";

/**
 * Resolves any mock or preview asset URL into a high-resolution authentic real estate image.
 */
export function resolveImageUrl(url?: string | null, fallbackKey?: string): string {
  if (!url) {
    if (fallbackKey && CURATED_IMAGES[fallbackKey]) return CURATED_IMAGES[fallbackKey];
    return DEFAULT_REAL_ESTATE;
  }

  // If it's already an external HTTP URL (Unsplash, Supabase storage, Cloudflare, etc.) and not Lovable mock path
  if ((url.startsWith("http://") || url.startsWith("https://")) && !url.includes("/__l5e/")) {
    return url;
  }

  // Match known asset names in Lovable preview path or filename
  for (const [key, curatedUrl] of Object.entries(CURATED_IMAGES)) {
    if (url.includes(key)) {
      return curatedUrl;
    }
  }

  if (fallbackKey && CURATED_IMAGES[fallbackKey]) {
    return CURATED_IMAGES[fallbackKey];
  }

  return DEFAULT_REAL_ESTATE;
}
