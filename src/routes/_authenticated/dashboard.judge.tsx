import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import {
  Scale,
  Award,
  CheckCircle2,
  Sliders,
  FileText,
  Shield,
  HelpCircle,
  Save,
  Check,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { RoleSwitcher } from "@/components/dashboard/RoleSwitcher";

export const Route = createFileRoute("/_authenticated/dashboard/judge")({
  head: () => ({
    meta: [
      { title: "Jury & Evaluation Portal — Africa Real Estate Awards" },
      { name: "description", content: "Confidential technical scoring portal for jury panel members of the Africa Real Estate Awards." },
    ],
  }),
  component: JudgeDashboard,
});

export default function JudgeDashboard() {
  const { user } = useAuth();

  // Fetch categories and nominees
  const categoriesQuery = useQuery({
    queryKey: ["judge", "categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("award_categories")
        .select("*")
        .eq("active", true)
        .order("sort_order");
      if (error) throw error;
      return data ?? [];
    },
  });

  const nomineesQuery = useQuery({
    queryKey: ["judge", "nominees"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("nominees")
        .select("id, name, company, category_id, citation, status")
        .neq("status", "hidden")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const categories = categoriesQuery.data ?? [];
  const allNominees = nomineesQuery.data ?? [];

  const [selectedCatId, setSelectedCatId] = useState<string>("");
  const activeCatId = selectedCatId || categories[0]?.id || "";

  const categoryNominees = allNominees.filter((n) => n.category_id === activeCatId);
  const [selectedNomineeId, setSelectedNomineeId] = useState<string>("");
  const activeNominee = categoryNominees.find((n) => n.id === selectedNomineeId) || categoryNominees[0];

  // Scoring Criteria (1 - 10)
  const [scoreDesign, setScoreDesign] = useState<number>(8);
  const [scoreSustainability, setScoreSustainability] = useState<number>(8);
  const [scoreInnovation, setScoreInnovation] = useState<number>(9);
  const [scoreImpact, setScoreImpact] = useState<number>(8);
  const [jurorNotes, setJurorNotes] = useState<string>("");
  const [savedStatus, setSavedStatus] = useState<Record<string, boolean>>({});

  // Weighted total: each is 25%, scale 1-10 -> max 100
  const weightedScore = Math.round((scoreDesign + scoreSustainability + scoreInnovation + scoreImpact) * 2.5);

  function handleSaveScore(isFinal = false) {
    if (!activeNominee) {
      toast.error("Please select a nominee first.");
      return;
    }
    setSavedStatus((prev) => ({ ...prev, [activeNominee.id]: true }));
    toast.success(
      isFinal
        ? `Final score of ${weightedScore}/100 submitted for ${activeNominee.name}.`
        : `Draft evaluation saved for ${activeNominee.name} (${weightedScore}/100).`
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
      <RoleSwitcher currentRole="judge" />

      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="eyebrow text-primary">Jury Workspace</span>
            <span className="rounded-full bg-ice/15 px-2.5 py-0.5 font-semibold text-[11px] text-ice">
              Technical Evaluation Panel
            </span>
          </div>
          <h1 className="mt-2 font-display text-4xl uppercase sm:text-5xl">
            Jury & Technical Evaluation Portal
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Confidential multi-criteria evaluation matrix for the 2026 Africa Real Estate Awards.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-xl bg-card p-3 ring-1 ring-hairline">
          <Shield className="size-5 text-primary" />
          <div className="text-xs">
            <p className="font-semibold text-foreground">Confidential Juror Access</p>
            <p className="text-muted-foreground">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Jury Integrity Pledge Banner */}
      <div className="mt-6 rounded-xl border border-primary/30 bg-primary/5 p-4 text-xs text-muted-foreground">
        <p className="font-semibold text-primary uppercase tracking-wide">
          Jury Code of Conduct & Ethics Statement
        </p>
        <p className="mt-1">
          By evaluating submissions, you attest that you have no commercial conflict of interest with the assigned nominees and agree to maintain strict confidentiality until official announcement at the Lekki Colosseum Rooftop ceremony.
        </p>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-12">
        {/* Left Column: Category & Nominees Navigation */}
        <div className="space-y-6 lg:col-span-4">
          <div className="glass-panel p-5">
            <label className="eyebrow text-primary">1. Select Award Category</label>
            <select
              value={activeCatId}
              onChange={(e) => {
                setSelectedCatId(e.target.value);
                setSelectedNomineeId("");
              }}
              className="field mt-2 w-full text-xs font-medium"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            <div className="mt-5 border-t border-border pt-4">
              <div className="flex items-center justify-between">
                <span className="eyebrow text-muted-foreground">Nominees to Evaluate</span>
                <span className="text-xs font-semibold text-primary">{categoryNominees.length} entries</span>
              </div>

              {categoryNominees.length === 0 ? (
                <p className="mt-3 text-xs text-muted-foreground">No nominees in this category yet.</p>
              ) : (
                <div className="mt-3 space-y-2">
                  {categoryNominees.map((nom) => {
                    const isSelected = (activeNominee?.id ?? "") === nom.id;
                    const isEvaluated = savedStatus[nom.id];
                    return (
                      <button
                        key={nom.id}
                        onClick={() => setSelectedNomineeId(nom.id)}
                        className={`flex w-full items-center justify-between rounded-lg p-3 text-left transition-colors ring-1 ${
                          isSelected
                            ? "bg-primary/15 ring-primary font-medium"
                            : "bg-card ring-hairline hover:bg-glass"
                        }`}
                      >
                        <div className="min-w-0 pr-2">
                          <p className="truncate font-display text-sm uppercase">{nom.name}</p>
                          <p className="truncate text-xs text-muted-foreground">{nom.company}</p>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          {isEvaluated ? (
                            <span className="inline-flex items-center gap-1 rounded-md bg-success/15 px-2 py-0.5 text-[10px] font-semibold text-success">
                              <Check className="size-3" /> Scored
                            </span>
                          ) : (
                            <span className="rounded-md bg-secondary px-2 py-0.5 text-[10px] text-muted-foreground">
                              Pending
                            </span>
                          )}
                          <ChevronRight className="size-4 text-muted-foreground" />
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Center/Right Column: Interactive Scorecard */}
        <div className="space-y-6 lg:col-span-8">
          {activeNominee ? (
            <div className="glass-panel p-6 sm:p-8">
              {/* Nominee Dossier Preview */}
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border pb-6">
                <div>
                  <span className="eyebrow text-primary">Candidate Evaluation</span>
                  <h2 className="mt-1 font-display text-3xl uppercase">{activeNominee.name}</h2>
                  <p className="text-sm text-muted-foreground">{activeNominee.company}</p>
                </div>
                <div className="rounded-xl border border-primary/40 bg-card/80 p-4 text-center">
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Weighted Score</span>
                  <p className="font-display text-4xl text-primary">{weightedScore}<span className="text-base text-muted-foreground">/100</span></p>
                </div>
              </div>

              {activeNominee.citation && (
                <div className="mt-4 rounded-lg bg-card/60 p-4 ring-1 ring-hairline">
                  <p className="text-xs uppercase text-muted-foreground">Submission Abstract & Citation:</p>
                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{activeNominee.citation}</p>
                </div>
              )}

              {/* 4 Pillars of Scoring */}
              <div className="mt-6 space-y-6">
                {/* Pillar 1 */}
                <div className="rounded-xl border border-border/80 bg-card/40 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-sm">1. Architectural & Structural Quality</p>
                      <p className="text-xs text-muted-foreground">Design integrity, structural durability, spatial efficiency</p>
                    </div>
                    <span className="font-display text-xl text-primary">{scoreDesign}/10</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={10}
                    value={scoreDesign}
                    onChange={(e) => setScoreDesign(Number(e.target.value))}
                    className="mt-3 w-full accent-primary"
                  />
                </div>

                {/* Pillar 2 */}
                <div className="rounded-xl border border-border/80 bg-card/40 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-sm">2. Sustainability & Pan-African ESG Impact</p>
                      <p className="text-xs text-muted-foreground">Energy efficiency, local material sourcing, carbon footprint</p>
                    </div>
                    <span className="font-display text-xl text-primary">{scoreSustainability}/10</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={10}
                    value={scoreSustainability}
                    onChange={(e) => setScoreSustainability(Number(e.target.value))}
                    className="mt-3 w-full accent-primary"
                  />
                </div>

                {/* Pillar 3 */}
                <div className="rounded-xl border border-border/80 bg-card/40 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-sm">3. Innovation & PropTech Integration</p>
                      <p className="text-xs text-muted-foreground">Modern construction techniques, smart building IoT, financing model</p>
                    </div>
                    <span className="font-display text-xl text-primary">{scoreInnovation}/10</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={10}
                    value={scoreInnovation}
                    onChange={(e) => setScoreInnovation(Number(e.target.value))}
                    className="mt-3 w-full accent-primary"
                  />
                </div>

                {/* Pillar 4 */}
                <div className="rounded-xl border border-border/80 bg-card/40 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-sm">4. Socio-Economic & Community Contribution</p>
                      <p className="text-xs text-muted-foreground">Local job creation, inclusive access, civic impact across Africa</p>
                    </div>
                    <span className="font-display text-xl text-primary">{scoreImpact}/10</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={10}
                    value={scoreImpact}
                    onChange={(e) => setScoreImpact(Number(e.target.value))}
                    className="mt-3 w-full accent-primary"
                  />
                </div>

                {/* Qualitative Juror Notes */}
                <div className="space-y-2">
                  <label className="font-semibold text-xs uppercase text-muted-foreground">
                    Confidential Juror Notes & Technical Feedback
                  </label>
                  <textarea
                    rows={3}
                    value={jurorNotes}
                    onChange={(e) => setJurorNotes(e.target.value)}
                    placeholder="Enter confidential technical observations for the final jury deliberation session..."
                    className="field w-full text-xs"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-border">
                  <button
                    onClick={() => handleSaveScore(false)}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-glass px-4 py-2.5 text-xs font-semibold ring-1 ring-hairline hover:text-primary"
                  >
                    <Save className="size-3.5" />
                    Save Draft
                  </button>
                  <button
                    onClick={() => handleSaveScore(true)}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-6 py-2.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
                  >
                    <Check className="size-3.5" />
                    Submit Final Score ({weightedScore}/100)
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="glass-panel p-12 text-center text-muted-foreground">
              <Scale className="mx-auto size-12 text-muted-foreground" />
              <p className="mt-4 font-display text-xl uppercase">No Nominee Selected</p>
              <p className="mt-1 text-xs">Choose a category and nominee from the left panel to begin evaluation.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
