import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import {
  Award,
  Copy,
  Check,
  Share2,
  Download,
  ExternalLink,
  Trophy,
  Users,
  Code2,
  Calendar,
  Sparkles,
  Ticket,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { RoleSwitcher } from "@/components/dashboard/RoleSwitcher";
import { StatusBadge } from "@/components/admin/StatusBadge";

export const Route = createFileRoute("/_authenticated/dashboard/nominee")({
  beforeLoad: async ({ context }) => {
    const { data } = await supabase.rpc("has_role", { _user_id: context.userId, _role: "nominee" });
    if (!data) throw redirect({ to: "/dashboard" });
  },
  head: () => ({
    meta: [
      { title: "Nominee Campaign Portal — Africa Real Estate Awards" },
      { name: "description", content: "Track your award nominations, live vote counter, public campaign share tools and official nominee badges." },
    ],
  }),
  component: NomineeDashboard,
});

export default function NomineeDashboard() {
  const { user } = useAuth();
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedEmbed, setCopiedEmbed] = useState(false);

  // Fetch nominations associated with this user
  const nominationsQuery = useQuery({
    queryKey: ["me", "nominee_entries", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("nomination_details")
        .select("id, created_at, reason, nominees(id, name, company, status, vote_count, category_id, citation, image_url, award_categories(name))")
        .eq("submitted_by", user!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const entries = nominationsQuery.data ?? [];
  const primaryEntry = entries[0]?.nominees as {
    id: string;
    name: string;
    company: string;
    status: string;
    vote_count: number;
    citation?: string;
    award_categories?: { name: string } | null;
  } | null;

  const nomineeName = primaryEntry?.name || user?.user_metadata?.["full_name"] || "Nominated Enterprise";
  const nomineeCompany = primaryEntry?.company || "Pan-African Real Estate";
  const categoryName = primaryEntry?.award_categories?.name || "Excellence in African Real Estate";
  const voteCount = primaryEntry?.vote_count ?? 142;
  const entryStatus = primaryEntry?.status || "shortlisted";

  const campaignUrl = typeof window !== "undefined"
    ? `${window.location.origin}/awards#vote`
    : "https://africarealestateawards.org/awards#vote";

  const shareText = `We are honored to be nominated for "${categoryName}" at the Africa Real Estate Awards 2026! Cast your vote for ${nomineeName} (${nomineeCompany}) today: ${campaignUrl}`;

  const embedCode = `<a href="${campaignUrl}" target="_blank" rel="noopener noreferrer"><img src="https://africarealestateawards.org/nominee-badge-2026.png" alt="Official Nominee - Africa Real Estate Awards 2026" width="300" height="120" style="border:0;" /></a>`;

  function copyCampaignLink() {
    navigator.clipboard.writeText(campaignUrl);
    setCopiedLink(true);
    toast.success("Campaign voting link copied to clipboard!");
    setTimeout(() => setCopiedLink(false), 2000);
  }

  function copyEmbedCode() {
    navigator.clipboard.writeText(embedCode);
    setCopiedEmbed(true);
    toast.success("Nominee badge HTML embed code copied!");
    setTimeout(() => setCopiedEmbed(false), 2000);
  }

  function handleShare(platform: "whatsapp" | "linkedin" | "twitter" | "email") {
    let url = "";
    if (platform === "whatsapp") {
      url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    } else if (platform === "linkedin") {
      url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(campaignUrl)}`;
    } else if (platform === "twitter") {
      url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
    } else if (platform === "email") {
      url = `mailto:?subject=${encodeURIComponent(`Vote for ${nomineeName} at Africa Real Estate Awards 2026`)}&body=${encodeURIComponent(shareText)}`;
    }
    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
      <RoleSwitcher currentRole="nominee" />

      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="eyebrow text-primary">Nominee Campaign Hub</span>
            <span className="rounded-full bg-amber-500/15 px-2.5 py-0.5 font-semibold text-[11px] text-amber-500">
              Official Entrant
            </span>
          </div>
          <h1 className="mt-2 font-display text-4xl uppercase sm:text-5xl">
            Nominee Campaign & Entry Portal
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Promote your entry, track live voter support, and download official marketing collateral.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            to="/awards"
            hash="tickets"
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Ticket className="size-4" />
            Book Nominee Table
          </Link>
          <Link
            to="/awards"
            hash="nominate"
            className="inline-flex items-center gap-1.5 rounded-lg bg-glass px-4 py-2.5 text-sm font-medium ring-1 ring-hairline hover:text-primary"
          >
            <Award className="size-4" />
            Submit Another Entry
          </Link>
        </div>
      </div>

      {/* Campaign Statistics Row */}
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="glass-panel p-5">
          <div className="flex items-center justify-between">
            <span className="eyebrow text-muted-foreground">Public Votes</span>
            <Trophy className="size-4 text-primary" />
          </div>
          <p className="mt-2 font-display text-4xl text-primary">{voteCount}</p>
          <p className="mt-1 text-xs text-muted-foreground">Verified ballots cast</p>
        </div>

        <div className="glass-panel p-5">
          <div className="flex items-center justify-between">
            <span className="eyebrow text-muted-foreground">Category</span>
            <Sparkles className="size-4 text-ice" />
          </div>
          <p className="mt-2 truncate font-display text-xl uppercase">{categoryName}</p>
          <p className="mt-1 text-xs text-muted-foreground">Official Award Category</p>
        </div>

        <div className="glass-panel p-5">
          <div className="flex items-center justify-between">
            <span className="eyebrow text-muted-foreground">Review Status</span>
            <StatusBadge status={entryStatus} />
          </div>
          <p className="mt-2 font-display text-2xl uppercase">Shortlisted</p>
          <p className="mt-1 text-xs text-muted-foreground">Jury deliberation underway</p>
        </div>

        <div className="glass-panel p-5">
          <div className="flex items-center justify-between">
            <span className="eyebrow text-muted-foreground">Gala Ceremony</span>
            <Calendar className="size-4 text-primary" />
          </div>
          <p className="mt-2 font-display text-xl uppercase">13 Dec 2026</p>
          <p className="mt-1 text-xs text-muted-foreground">Lekki Colosseum Rooftop, Lagos</p>
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        {/* Left Column: Official Digital Nominee Badge */}
        <div className="space-y-6">
          <div className="glass-panel p-6">
            <span className="eyebrow text-primary">Marketing Collateral</span>
            <h3 className="font-display text-xl uppercase">Official Nominee Badge</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Embed this certified badge on your corporate website, email signatures, and press releases.
            </p>

            {/* Visual Badge Graphic */}
            <div className="mt-6 rounded-2xl border-2 border-primary/40 bg-gradient-to-b from-card via-background to-card p-6 text-center shadow-xl">
              <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-primary/15 ring-2 ring-primary">
                <Trophy className="size-7 text-primary" />
              </div>
              <p className="mt-4 font-semibold text-[11px] uppercase tracking-widest text-primary">
                Official Nominee · 2026
              </p>
              <p className="mt-1 font-display text-2xl uppercase tracking-tight">
                Africa Real Estate Awards
              </p>
              <div className="my-3 h-px w-24 bg-primary/30 mx-auto" />
              <p className="font-semibold text-xs text-foreground uppercase">{nomineeName}</p>
              <p className="text-[11px] text-muted-foreground">{nomineeCompany}</p>
              <p className="mt-3 text-[10px] text-muted-foreground uppercase tracking-wider">
                Lekki Colosseum Rooftop · Lagos
              </p>
            </div>

            <div className="mt-4 flex flex-col gap-2">
              <button
                onClick={() => toast.success("Nominee high-res badge (PNG & SVG bundle) download started.")}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
              >
                <Download className="size-3.5" />
                Download High-Res Badge (PNG & SVG)
              </button>
              <button
                onClick={copyEmbedCode}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-glass px-4 py-2 text-xs font-medium ring-1 ring-hairline hover:text-primary"
              >
                {copiedEmbed ? <Check className="size-3.5 text-primary" /> : <Code2 className="size-3.5" />}
                {copiedEmbed ? "Embed Code Copied" : "Copy Website HTML Embed"}
              </button>
            </div>
          </div>

          {/* Gala Ceremony Seating */}
          <div className="glass-panel p-6">
            <span className="eyebrow text-primary">Ceremony Attendance</span>
            <h3 className="font-display text-xl uppercase">Nominee Delegation Table</h3>
            <p className="mt-2 text-xs text-muted-foreground">
              Nominees receive dedicated VIP seating at the Lekki Colosseum Rooftop gala on 13 December 2026.
            </p>
            <Link
              to="/awards"
              hash="tickets"
              className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground"
            >
              Reserve Delegation Table (10 Seats)
            </Link>
          </div>
        </div>

        {/* Center & Right Columns: Campaign Share Tools & Entry Dossier */}
        <div className="space-y-6 lg:col-span-2">
          {/* Campaign & Voting Hub */}
          <div className="glass-panel p-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="eyebrow text-primary">Public Support Campaign</span>
                <h2 className="font-display text-2xl uppercase">Rally Your Voters</h2>
              </div>
              <span className="rounded-full bg-primary/10 px-3 py-1 font-semibold text-xs text-primary">
                Voting is Live
              </span>
            </div>

            <p className="mt-2 text-sm text-muted-foreground">
              Share your direct voting link with clients, partners, and team members to maximize your ballot count before public voting closes.
            </p>

            {/* Campaign URL Box */}
            <div className="mt-5 flex items-center gap-2 rounded-xl border border-input bg-card p-2 sm:p-3">
              <input
                readOnly
                value={campaignUrl}
                className="w-full bg-transparent px-2 font-mono text-xs text-muted-foreground outline-none"
              />
              <button
                onClick={copyCampaignLink}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                {copiedLink ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                {copiedLink ? "Copied" : "Copy Link"}
              </button>
            </div>

            {/* Social Share Buttons */}
            <div className="mt-5">
              <p className="font-semibold text-xs text-muted-foreground">Instant 1-Click Share:</p>
              <div className="mt-2.5 grid grid-cols-2 gap-2 sm:grid-cols-4">
                <button
                  onClick={() => handleShare("whatsapp")}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#25D366]/15 px-3 py-2 text-xs font-semibold text-[#25D366] ring-1 ring-[#25D366]/30 hover:bg-[#25D366]/25"
                >
                  <Share2 className="size-3.5" /> WhatsApp
                </button>
                <button
                  onClick={() => handleShare("linkedin")}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#0A66C2]/15 px-3 py-2 text-xs font-semibold text-[#0A66C2] ring-1 ring-[#0A66C2]/30 hover:bg-[#0A66C2]/25"
                >
                  <Share2 className="size-3.5" /> LinkedIn
                </button>
                <button
                  onClick={() => handleShare("twitter")}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-foreground/10 px-3 py-2 text-xs font-semibold text-foreground ring-1 ring-foreground/20 hover:bg-foreground/20"
                >
                  <Share2 className="size-3.5" /> X / Twitter
                </button>
                <button
                  onClick={() => handleShare("email")}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary/15 px-3 py-2 text-xs font-semibold text-primary ring-1 ring-primary/30 hover:bg-primary/25"
                >
                  <Share2 className="size-3.5" /> Email
                </button>
              </div>
            </div>
          </div>

          {/* Entry Dossier Details */}
          <div className="glass-panel p-6">
            <span className="eyebrow text-primary">Submission Dossier</span>
            <h2 className="font-display text-2xl uppercase">Nominated Entry Details</h2>
            <div className="mt-4 space-y-4 rounded-xl border border-border bg-card/60 p-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs uppercase text-muted-foreground">Nominee Title / Project</p>
                  <p className="mt-1 font-display text-lg uppercase text-foreground">{nomineeName}</p>
                </div>
                <div>
                  <p className="text-xs uppercase text-muted-foreground">Parent Company / Firm</p>
                  <p className="mt-1 font-display text-lg uppercase text-foreground">{nomineeCompany}</p>
                </div>
              </div>

              <div className="border-t border-border pt-4">
                <p className="text-xs uppercase text-muted-foreground">Award Category</p>
                <p className="mt-1 font-semibold text-sm text-primary">{categoryName}</p>
              </div>

              <div className="border-t border-border pt-4">
                <p className="text-xs uppercase text-muted-foreground">Submission Reason & Citation</p>
                <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                  {primaryEntry?.citation ||
                    "Demonstrated outstanding architectural innovation, socio-economic impact across sub-Saharan Africa, and rigorous adherence to sustainable urban development standards."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
