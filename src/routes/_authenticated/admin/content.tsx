import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { settingsSections } from "@/lib/admin-config";
import { Switch } from "@/components/ui/switch";
import { ImageField } from "@/components/admin/ImageField";

export const Route = createFileRoute("/_authenticated/admin/content")({
  component: ContentPage,
});

function ContentPage() {
  const qc = useQueryClient();
  const [active, setActive] = useState(settingsSections[0]!.key);
  const settings = useQuery({
    queryKey: ["admin", "site_settings"],
    queryFn: async () => {
      const { data, error } = await supabase.from("site_settings").select("key, value");
      if (error) throw error;
      return Object.fromEntries(data.map((r) => [r.key, (r.value ?? {}) as Record<string, unknown>]));
    },
  });
  const section = settingsSections.find((s) => s.key === active)!;
  const [draft, setDraft] = useState<Record<string, unknown>>({});
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setDraft({ ...(settings.data?.[active] ?? {}) });
  }, [settings.data, active]);

  async function save() {
    setBusy(true);
    const { error } = await supabase.from("site_settings").upsert({ key: active, value: draft as never, updated_at: new Date().toISOString() });
    setBusy(false);
    if (error) { toast.error(error.message); return; }
    toast.success(`${section.label} saved — live on the site.`);
    qc.invalidateQueries({ queryKey: ["admin", "site_settings"] });
    qc.invalidateQueries({ queryKey: ["content"] });
  }

  return (
    <div>
      <p className="eyebrow text-primary">Website</p>
      <h1 className="mt-1 font-display text-4xl uppercase">Page text & settings</h1>
      <p className="mb-6 mt-1 text-sm text-muted-foreground">Every headline, intro, image and switch on the site's pages.</p>
      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
        <div className="flex flex-wrap gap-1 lg:flex-col">
          {settingsSections.map((s) => (
            <button key={s.key} onClick={() => setActive(s.key)} className={`rounded-lg px-3 py-2 text-left text-sm transition-colors ${active === s.key ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-glass"}`}>{s.label}</button>
          ))}
        </div>
        <div className="glass-panel space-y-4 p-6">
          {settings.isLoading ? <p className="text-muted-foreground">Loading…</p> : section.fields.map((f) => {
            const v = draft[f.name];
            const set = (nv: unknown) => setDraft((d) => ({ ...d, [f.name]: nv }));
            return (
              <label key={f.name} className="block space-y-1.5">
                <span className="text-sm font-medium">{f.label}</span>
                {f.type === "textarea" ? <textarea rows={3} value={String(v ?? "")} onChange={(e) => set(e.target.value)} className="field" />
                  : f.type === "boolean" ? <div><Switch checked={v !== false} onCheckedChange={set} /></div>
                  : f.type === "image" ? <ImageField value={String(v ?? "")} onChange={set} />
                  : f.type === "datetime" ? <input type="datetime-local" value={v ? toLocal(String(v)) : ""} onChange={(e) => set(e.target.value ? new Date(e.target.value).toISOString() : "")} className="field" />
                  : <input value={String(v ?? "")} onChange={(e) => set(e.target.value)} className="field" />}
              </label>
            );
          })}
          <div className="flex justify-end pt-2">
            <button onClick={save} disabled={busy} className="rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60">{busy ? "Saving…" : "Save changes"}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function toLocal(iso: string) {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  const off = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - off).toISOString().slice(0, 16);
}
