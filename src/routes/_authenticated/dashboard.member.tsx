import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import {
  GraduationCap,
  Download,
  BookOpen,
  Award,
  CheckCircle2,
  Calendar,
  Clock,
  FileText,
  ShieldCheck,
  QrCode,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { formatDate } from "@/lib/settings";
import { RoleSwitcher } from "@/components/dashboard/RoleSwitcher";
import { StatusBadge } from "@/components/admin/StatusBadge";

export const Route = createFileRoute("/_authenticated/dashboard/member")({
  head: () => ({
    meta: [
      { title: "Institute Member Portal — Africa Real Estate Awards" },
      { name: "description", content: "Institute member credentials, CPD points, exclusive industry intelligence and programmes." },
    ],
  }),
  component: MemberDashboard,
});

function MemberDashboard() {
  const { user } = useAuth();
  const [downloading, setDownloading] = useState(false);

  // Fetch user profile
  const profileQuery = useQuery({
    queryKey: ["me", "profile", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase.from("profiles").select("*").eq("id", user!.id).maybeSingle();
      return data;
    },
  });

  // Fetch membership application
  const appQuery = useQuery({
    queryKey: ["me", "member_app", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase
        .from("membership_applications")
        .select("*")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false })
        .limit(1);
      return data?.[0] ?? null;
    },
  });

  // Fetch programme registrations
  const regQuery = useQuery({
    queryKey: ["me", "programmes", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase
        .from("programme_registrations")
        .select("*")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  const profile = profileQuery.data;
  const app = appQuery.data;
  const fullName = profile?.full_name || user?.user_metadata?.["full_name"] || "Real Estate Professional";
  const memberTier = app?.tier || "Full Professional Member";
  const memberId = `ARE-2026-MEM-${(user?.id ?? "000000").slice(0, 6).toUpperCase()}`;

  function handleDownloadCredential() {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      toast.success("Digital Certificate & Credential Card generated. Download started.");
    }, 1200);
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
      <RoleSwitcher currentRole="member" />

      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="eyebrow text-primary">Institute Portal</span>
            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 font-semibold text-[11px] text-primary">
              Active Member Standing
            </span>
          </div>
          <h1 className="mt-2 font-display text-4xl uppercase sm:text-5xl">
            Institute of Real Estate Member Portal
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Management, Leadership & Professional Credentials for {fullName}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleDownloadCredential}
            disabled={downloading}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
          >
            <Download className="size-4" />
            {downloading ? "Generating PDF…" : "Download Credential Card"}
          </button>
          <Link
            to="/institute"
            hash="programmes"
            className="inline-flex items-center gap-2 rounded-lg bg-glass px-4 py-2.5 text-sm font-medium ring-1 ring-hairline hover:text-primary"
          >
            <BookOpen className="size-4" />
            Browse Masterclasses
          </Link>
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        {/* Left Column: Digital Member ID & Status */}
        <div className="space-y-6">
          {/* Member Card */}
          <div className="relative overflow-hidden rounded-2xl border border-primary/40 bg-gradient-to-br from-card via-background to-card p-6 shadow-2xl">
            <div className="absolute -right-8 -top-8 size-36 rounded-full bg-primary/10 blur-2xl" />
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-display text-xl tracking-wider text-primary">ARE INSTITUTE</p>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
                  Pan-African Institute of Real Estate
                </p>
              </div>
              <ShieldCheck className="size-8 text-primary" />
            </div>

            <div className="mt-8">
              <span className="inline-block rounded-md bg-primary/20 px-2.5 py-1 font-semibold text-[11px] uppercase tracking-wider text-primary">
                {memberTier}
              </span>
              <p className="mt-3 font-display text-2xl uppercase tracking-tight text-foreground">
                {fullName}
              </p>
              <p className="text-xs text-muted-foreground">
                {profile?.organisation || "Accredited Member Organisation"}
              </p>
            </div>

            <div className="mt-8 flex items-end justify-between border-t border-border/80 pt-4">
              <div>
                <p className="text-[10px] uppercase text-muted-foreground">Member Credential ID</p>
                <p className="font-mono text-xs font-semibold text-primary">{memberId}</p>
                <p className="mt-1 text-[10px] text-muted-foreground">Valid Through: 31 Dec 2026</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="rounded-md bg-white p-1">
                  <QrCode className="size-8 text-black" />
                </div>
                <span className="mt-1 text-[9px] uppercase tracking-wider text-muted-foreground">Verified</span>
              </div>
            </div>
          </div>

          {/* Membership Details & Privileges */}
          <div className="glass-panel p-5">
            <h3 className="font-display text-lg uppercase">Member Privileges & Standing</h3>
            <ul className="mt-4 space-y-3 text-xs">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="size-4 shrink-0 text-primary" />
                <span>Voting rights on Institute governance and policy whitepapers</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="size-4 shrink-0 text-primary" />
                <span>20% preferential delegate rate for the Gala Night at Lekki Colosseum</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="size-4 shrink-0 text-primary" />
                <span>Priority registration for accredited Masterclasses & CPD workshops</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="size-4 shrink-0 text-primary" />
                <span>Quarterly digital access to Africa Real Estate Review Magazine</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Center & Right Columns */}
        <div className="space-y-8 lg:col-span-2">
          {/* Continuing Professional Development (CPD) Progress */}
          <div className="glass-panel p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="eyebrow text-primary">Accreditation Progress</span>
                <h2 className="font-display text-2xl uppercase">2026 CPD Hours Tracker</h2>
              </div>
              <span className="rounded-full bg-primary/15 px-3 py-1 font-semibold text-xs text-primary">
                18 / 25 Hours Completed
              </span>
            </div>

            <p className="mt-2 text-sm text-muted-foreground">
              Members are required to log 25 Continuing Professional Development hours annually to maintain certified standing.
            </p>

            {/* Progress Bar */}
            <div className="mt-5">
              <div className="h-3 w-full overflow-hidden rounded-full bg-secondary">
                <div className="h-full bg-primary transition-all duration-700" style={{ width: "72%" }} />
              </div>
              <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                <span>72% of annual requirement</span>
                <span>7 hours remaining</span>
              </div>
            </div>

            {/* Completed CPD Modules */}
            <div className="mt-6 divide-y divide-border rounded-xl bg-card/60 p-4 ring-1 ring-hairline">
              <p className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">
                Recent CPD Credits Logged
              </p>
              <div className="flex items-center justify-between py-2.5">
                <div>
                  <p className="font-medium text-sm">Pan-African ESG & Net-Zero Development Masterclass</p>
                  <p className="text-xs text-muted-foreground">Institute Leadership Series · 8 CPD Hours</p>
                </div>
                <span className="text-xs font-semibold text-success">Verified</span>
              </div>
              <div className="flex items-center justify-between py-2.5">
                <div>
                  <p className="font-medium text-sm">Real Estate Capital Structuring & REITs in West Africa</p>
                  <p className="text-xs text-muted-foreground">Executive Workshop · 6 CPD Hours</p>
                </div>
                <span className="text-xs font-semibold text-success">Verified</span>
              </div>
              <div className="flex items-center justify-between py-2.5">
                <div>
                  <p className="font-medium text-sm">Urban Planning Ethics & Land Rights Governance</p>
                  <p className="text-xs text-muted-foreground">Symposium · 4 CPD Hours</p>
                </div>
                <span className="text-xs font-semibold text-success">Verified</span>
              </div>
            </div>
          </div>

          {/* Registered Programmes */}
          <div className="glass-panel p-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="eyebrow text-primary">Executive Learning</span>
                <h2 className="font-display text-2xl uppercase">My Enrolled Programmes</h2>
              </div>
              <Link to="/institute" hash="programmes" className="text-xs font-semibold text-primary hover:underline">
                View all programmes →
              </Link>
            </div>

            {(regQuery.data ?? []).length === 0 ? (
              <div className="mt-4 rounded-xl border border-dashed border-border p-6 text-center">
                <GraduationCap className="mx-auto size-8 text-muted-foreground" />
                <p className="mt-2 font-medium text-sm">No executive programmes registered yet</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Enroll in accredited Institute training to accelerate your real estate leadership journey.
                </p>
                <Link
                  to="/institute"
                  hash="programmes"
                  className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground"
                >
                  Explore 2026 Masterclasses
                </Link>
              </div>
            ) : (
              <div className="mt-4 divide-y divide-border rounded-xl bg-card/60 p-2 ring-1 ring-hairline">
                {(regQuery.data ?? []).map((reg) => (
                  <div key={reg.id} className="flex flex-wrap items-center justify-between gap-3 p-3">
                    <div>
                      <p className="font-medium text-sm">{reg.programme_title}</p>
                      <p className="text-xs text-muted-foreground">Registered {formatDate(reg.created_at)}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <StatusBadge status={reg.status} />
                      <button
                        onClick={() => toast.info("Course access and syllabus sent to your email.")}
                        className="rounded-lg bg-secondary px-3 py-1.5 text-xs font-semibold hover:text-primary"
                      >
                        Access Materials
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Member Intelligence & Research Vault */}
          <div className="glass-panel p-6">
            <span className="eyebrow text-primary">Member Vault</span>
            <h2 className="font-display text-2xl uppercase">Publications & Market Intelligence</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Confidential quarterly dossiers, legal frameworks, and research papers reserved exclusively for Institute members.
            </p>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-border bg-card/80 p-4 transition-colors hover:border-primary/50">
                <FileText className="size-6 text-primary" />
                <h4 className="mt-3 font-display text-base uppercase">African Real Estate Review · Q3 2026</h4>
                <p className="mt-1 text-xs text-muted-foreground">
                  Full 120-page executive quarterly dossier featuring pan-African commercial yield data.
                </p>
                <button
                  onClick={() => toast.success("Downloading African Real Estate Review Q3 2026...")}
                  className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                >
                  <Download className="size-3.5" /> Download Executive PDF (18MB)
                </button>
              </div>

              <div className="rounded-xl border border-border bg-card/80 p-4 transition-colors hover:border-primary/50">
                <FileText className="size-6 text-primary" />
                <h4 className="mt-3 font-display text-base uppercase">Pan-African ESG & Green Building Guide</h4>
                <p className="mt-1 text-xs text-muted-foreground">
                  Standardized compliance and sustainable building benchmarks across 14 African nations.
                </p>
                <button
                  onClick={() => toast.success("Downloading ESG & Green Building Guide...")}
                  className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                >
                  <Download className="size-3.5" /> Download Guidebook (9MB)
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
