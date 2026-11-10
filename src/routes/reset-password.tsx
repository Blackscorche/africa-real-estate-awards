import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Set a new password — Africa Real Estate Awards" },
      { name: "description", content: "Choose a new password for your account." },
      { property: "og:title", content: "Set a new password" },
      { property: "og:type", content: "website" },
      { property: "og:description", content: "Choose a new password for your account." },
    ],
  }),
  component: ResetPage,
});

function ResetPage() {
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const password = String(f.get("password") ?? "");
    if (password !== String(f.get("confirm") ?? "")) { toast.error("Passwords don't match."); return; }
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Password updated.");
    navigate({ to: "/dashboard" });
  }
  return (
    <section className="mx-auto flex min-h-[70vh] max-w-md items-center px-6 py-16">
      <form onSubmit={onSubmit} className="glass-panel w-full space-y-3 p-6 md:p-8">
        <p className="eyebrow text-primary">Account</p>
        <h1 className="font-display text-4xl uppercase">New password</h1>
        <input required name="password" type="password" minLength={8} placeholder="New password" className="field" />
        <input required name="confirm" type="password" minLength={8} placeholder="Confirm password" className="field" />
        <button disabled={busy} className="w-full rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground disabled:opacity-60">{busy ? "Saving…" : "Save password"}</button>
      </form>
    </section>
  );
}
