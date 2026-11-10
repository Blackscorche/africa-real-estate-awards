import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

const search = z.object({ redirect: z.string().optional() });

export const Route = createFileRoute("/auth")({
  validateSearch: (s) => search.parse(s),
  head: () => ({
    meta: [
      { title: "Sign in — Africa Real Estate Awards" },
      { name: "description", content: "Sign in or create an account to vote, track nominations, applications and gala bookings." },
      { property: "og:title", content: "Sign in — Africa Real Estate Awards" },
      { property: "og:type", content: "website" },
      { property: "og:description", content: "Your account for voting, membership and gala bookings." },
    ],
  }),
  component: AuthPage,
});

function safePath(p?: string) {
  return p && p.startsWith("/") && !p.startsWith("//") ? p : "/dashboard";
}

function AuthPage() {
  const { redirect } = Route.useSearch();
  const target = safePath(redirect);
  const navigate = useNavigate();
  const { user, ready } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup" | "forgot">("signin");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (ready && user) navigate({ to: target, replace: true });
  }, [ready, user, target, navigate]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const email = String(f.get("email") ?? "").trim();
    const password = String(f.get("password") ?? "");
    setBusy(true);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back.");
      } else if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email, password,
          options: { emailRedirectTo: `${window.location.origin}${target}`, data: { full_name: String(f.get("fullName") ?? "") } },
        });
        if (error) throw error;
        if (!data.session) toast.success("Check your inbox to confirm your email, then sign in.");
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/reset-password` });
        if (error) throw error;
        toast.success("If that email has an account, a reset link is on its way.");
        setMode("signin");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="mx-auto grid min-h-[75vh] max-w-6xl items-center gap-12 px-6 py-16 lg:grid-cols-2">
      <div className="hidden lg:block">
        <p className="eyebrow text-primary">Your account</p>
        <h1 className="mt-4 font-display text-6xl uppercase leading-[0.92]">Vote. Apply. <span className="text-primary">Book your table.</span></h1>
        <p className="mt-5 max-w-[42ch] text-muted-foreground">One account for public voting, membership applications, programme registrations and gala bookings — all tracked in your dashboard.</p>
      </div>
      <div className="glass-panel mx-auto w-full max-w-md p-6 md:p-8">
        <p className="eyebrow text-primary">{mode === "signup" ? "Create account" : mode === "forgot" ? "Reset password" : "Sign in"}</p>
        <h2 className="mt-2 font-display text-4xl uppercase">{mode === "signup" ? "Join us" : mode === "forgot" ? "Forgot password" : "Welcome back"}</h2>

        {mode !== "forgot" && (
          <>
            {/* Google sign-in — not yet live */}
            <div className="relative mt-6">
              <button
                type="button"
                disabled
                title="Google sign-in is not yet active"
                className="flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-lg bg-foreground/30 px-5 py-3 text-sm font-semibold text-background/50"
              >
                <svg viewBox="0 0 24 24" className="size-4" aria-hidden>
                  <path fill="currentColor" d="M21.35 11.1H12v2.98h5.35c-.23 1.4-1.66 4.1-5.35 4.1-3.22 0-5.85-2.67-5.85-5.96S8.78 6.26 12 6.26c1.83 0 3.06.78 3.76 1.45l2.57-2.47C16.68 3.7 14.55 2.8 12 2.8 6.92 2.8 2.8 6.92 2.8 12s4.12 9.2 9.2 9.2c5.31 0 8.83-3.73 8.83-8.99 0-.6-.07-1.06-.48-1.11z" />
                </svg>
                Continue with Google
                <span className="ml-auto rounded bg-amber-500/80 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white">Coming soon</span>
              </button>
            </div>
            <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
              <span className="h-px flex-1 bg-border" />or with email<span className="h-px flex-1 bg-border" />
            </div>
          </>
        )}

        <form onSubmit={onSubmit} className="space-y-3">
          {mode === "signup" && <input required name="fullName" placeholder="Full name" className="field" />}
          <input required name="email" type="email" placeholder="Email" autoComplete="email" className="field" />
          {mode !== "forgot" && <input required name="password" type="password" minLength={8} placeholder="Password (8+ characters)" autoComplete={mode === "signup" ? "new-password" : "current-password"} className="field" />}
          <button disabled={busy} className="w-full rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground hover:bg-primary/80 disabled:opacity-60">
            {busy ? "Please wait…" : mode === "signup" ? "Create account" : mode === "forgot" ? "Send reset link" : "Sign in"}
          </button>
        </form>

        <div className="mt-5 flex flex-wrap justify-between gap-2 text-sm text-muted-foreground">
          {mode === "signin" ? (
            <>
              <button onClick={() => setMode("signup")} className="hover:text-primary">New here? <span className="font-semibold text-primary">Create an account</span></button>
              <button onClick={() => setMode("forgot")} className="hover:text-primary">Forgot password?</button>
            </>
          ) : (
            <button onClick={() => setMode("signin")} className="hover:text-primary">Already have an account? <span className="font-semibold text-primary">Sign in</span></button>
          )}
        </div>

        <p className="mt-6 text-xs text-muted-foreground">By continuing you agree to our terms. <Link to="/" className="underline">Back to site</Link></p>
      </div>
    </section>
  );
}
