import { useMemo, useState, type FormEvent } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Download, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { slugify, type Collection, type Field } from "@/lib/admin-config";
import { formatDate } from "@/lib/settings";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { ImageField } from "@/components/admin/ImageField";
import { StatusBadge } from "@/components/admin/StatusBadge";

type Row = Record<string, unknown> & { id: string };

// The table name comes from the admin config, so the typed client can't narrow it.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = (table: string) => supabase.from(table as any) as any;

function useRelations(fields: Field[]) {
  const rel = fields.filter((f) => f.type === "relation" && f.relation);
  return useQuery({
    queryKey: ["admin", "relations", rel.map((f) => f.relation!.table).join(",")],
    enabled: rel.length > 0,
    queryFn: async () => {
      const out: Record<string, { id: string; label: string }[]> = {};
      for (const f of rel) {
        const { data, error } = await db(f.relation!.table).select(`id, ${f.relation!.label}`).limit(1000);
        if (error) throw error;
        out[f.name] = (data as Row[]).map((r) => ({ id: r.id, label: String(r[f.relation!.label] ?? "") }));
      }
      return out;
    },
  });
}

function toInput(f: Field, v: unknown): unknown {
  if (f.type === "tags") return Array.isArray(v) ? v.join("\n") : "";
  if (f.type === "boolean") return v === undefined ? true : !!v;
  if (f.type === "datetime") return v ? new Date(String(v)).toISOString().slice(0, 16) : "";
  return v ?? "";
}

function fromInput(f: Field, v: unknown): unknown {
  if (f.type === "number") return v === "" || v == null ? 0 : Number(v);
  if (f.type === "tags") return String(v ?? "").split("\n").map((x) => x.trim()).filter(Boolean);
  if (f.type === "boolean") return !!v;
  if (f.type === "datetime") return v ? new Date(String(v)).toISOString() : new Date().toISOString();
  if (f.type === "date" || f.type === "relation") return v ? v : null;
  if (f.type === "image") return v ? v : null;
  return typeof v === "string" ? v : v ?? "";
}

export function CollectionManager({ config }: { config: Collection }) {
  const qc = useQueryClient();
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState<Row | "new" | null>(null);
  const canCreate = config.canCreate !== false;
  const canEdit = config.canEdit !== false;
  const statusField = config.fields.find((f) => f.name === "status" && f.type === "select");

  const rows = useQuery({
    queryKey: ["admin", config.table],
    queryFn: async () => {
      const { data, error } = await db(config.table).select("*").order(config.order.column, { ascending: config.order.ascending }).limit(1000);
      if (error) throw error;
      return data as Row[];
    },
  });
  const relations = useRelations(config.fields);

  const filtered = useMemo(() => {
    const list = rows.data ?? [];
    if (!q.trim()) return list;
    const needle = q.toLowerCase();
    const keys = config.search ?? config.columns;
    return list.filter((r) => keys.some((k) => String(r[k] ?? "").toLowerCase().includes(needle)));
  }, [rows.data, q, config]);

  function refresh() {
    qc.invalidateQueries({ queryKey: ["admin"] });
    qc.invalidateQueries({ queryKey: ["content"] });
  }

  async function remove(r: Row) {
    if (!confirm("Delete this item? This can't be undone.")) return;
    const { error } = await db(config.table).delete().eq("id", r.id);
    if (error) { toast.error(error.message); return; }
    toast.success("Deleted.");
    refresh();
  }

  async function setStatus(r: Row, status: string) {
    const { error } = await db(config.table).update({ status }).eq("id", r.id);
    if (error) { toast.error(error.message); return; }
    toast.success(`Marked ${status}.`);
    refresh();
  }

  function exportCsv() {
    const list = filtered;
    if (!list.length) return;
    const keys = Object.keys(list[0]!);
    const esc = (v: unknown) => `"${String(Array.isArray(v) ? v.join("; ") : v ?? "").replace(/"/g, '""')}"`;
    const csv = [keys.join(","), ...list.map((r) => keys.map((k) => esc(r[k])).join(","))].join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = `${config.key}-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  }

  function cell(col: string, r: Row) {
    const f = config.fields.find((x) => x.name === col);
    const v = r[col];
    if (col === "created_at" || f?.type === "datetime" || f?.type === "date") return <span className="font-semibold text-xs text-muted-foreground">{formatDate(v as string)}</span>;
    if (f?.type === "image") return v ? <img src={String(v)} alt="" className="size-10 rounded-lg object-cover" /> : <span className="text-muted-foreground">—</span>;
    if (f?.type === "boolean") return <span className={v ? "text-success" : "text-muted-foreground"}>{v ? "Yes" : "No"}</span>;
    if (f?.type === "relation") return relations.data?.[col]?.find((o) => o.id === v)?.label ?? "—";
    if (col === "status" && statusField) {
      return (
        <select value={String(v)} onClick={(e) => e.stopPropagation()} onChange={(e) => setStatus(r, e.target.value)} className="rounded-lg bg-well px-2 py-1 font-semibold text-[11px] ring-1 ring-hairline">
          {statusField.options!.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      );
    }
    if (col === "kind" || col === "source" || col === "panel" || col === "section") return <StatusBadge status={String(v)} />;
    const s = String(v ?? "");
    return <span className="line-clamp-2">{s.length > 90 ? s.slice(0, 90) + "…" : s || "—"}</span>;
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative w-full max-w-xs">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search…" className="field pl-9" />
        </div>
        <div className="flex gap-2">
          {config.exportable && <button onClick={exportCsv} className="inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm ring-1 ring-hairline hover:text-primary"><Download className="size-4" /> Export CSV</button>}
          {canCreate && <button onClick={() => setEditing("new")} className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"><Plus className="size-4" /> Add new</button>}
        </div>
      </div>

      <div className="glass-panel mt-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              {config.columns.map((c) => <th key={c} className="eyebrow whitespace-nowrap px-4 py-3 font-normal text-muted-foreground">{config.fields.find((f) => f.name === c)?.label ?? (c === "created_at" ? "Received" : c)}</th>)}
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {rows.isLoading && <tr><td colSpan={99} className="p-6 text-center text-muted-foreground">Loading…</td></tr>}
            {rows.error && <tr><td colSpan={99} className="p-6 text-center text-destructive">{(rows.error as Error).message}</td></tr>}
            {!rows.isLoading && !filtered.length && <tr><td colSpan={99} className="p-8 text-center text-muted-foreground">Nothing here yet.</td></tr>}
            {filtered.map((r) => (
              <tr key={r.id} onClick={() => setEditing(r)} className="cursor-pointer border-b border-border/60 transition-colors last:border-0 hover:bg-glass">
                {config.columns.map((c) => <td key={c} className="max-w-xs px-4 py-3 align-middle">{cell(c, r)}</td>)}
                <td className="whitespace-nowrap px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                  <button aria-label="Edit" onClick={() => setEditing(r)} className="rounded-lg p-2 hover:text-primary"><Pencil className="size-4" /></button>
                  <button aria-label="Delete" onClick={() => remove(r)} className="rounded-lg p-2 hover:text-destructive"><Trash2 className="size-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">{filtered.length} item{filtered.length === 1 ? "" : "s"}</p>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto border-border bg-popover">
          <DialogHeader><DialogTitle className="font-display text-2xl uppercase">{editing === "new" ? `New · ${config.label}` : `Edit · ${config.label}`}</DialogTitle></DialogHeader>
          {editing && (
            <EditForm
              config={config}
              row={editing === "new" ? null : editing}
              readOnly={editing !== "new" && !canEdit}
              relations={relations.data ?? {}}
              onDone={() => { setEditing(null); refresh(); }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function EditForm({ config, row, readOnly, relations, onDone }: { config: Collection; row: Row | null; readOnly: boolean; relations: Record<string, { id: string; label: string }[]>; onDone: () => void }) {
  const [values, setValues] = useState<Record<string, unknown>>(() => Object.fromEntries(config.fields.map((f) => [f.name, toInput(f, row?.[f.name])])));
  const [busy, setBusy] = useState(false);
  const set = (k: string, v: unknown) => setValues((s) => ({ ...s, [k]: v }));

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (readOnly) { onDone(); return; }
    const payload: Record<string, unknown> = {};
    for (const f of config.fields) {
      let v = values[f.name];
      if (f.type === "slug" && !v && f.from) v = slugify(String(values[f.from] ?? ""));
      if (f.required && (v === "" || v == null)) { toast.error(`${f.label} is required.`); return; }
      payload[f.name] = fromInput(f, v);
    }
    setBusy(true);
    const res = row ? await db(config.table).update(payload).eq("id", row.id) : await db(config.table).insert(payload);
    setBusy(false);
    if (res.error) { toast.error(res.error.message); return; }
    toast.success(row ? "Saved." : "Created.");
    onDone();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {config.fields.map((f) => (
        <label key={f.name} className="block space-y-1.5">
          <span className="text-sm font-medium">{f.label}{f.required && <span className="text-primary"> *</span>}</span>
          <FieldInput f={f} value={values[f.name]} onChange={(v) => set(f.name, v)} relations={relations[f.name]} disabled={readOnly} source={f.from ? String(values[f.from] ?? "") : ""} />
          {f.help && <span className="block text-xs text-muted-foreground">{f.help}</span>}
        </label>
      ))}
      {row?.["created_at"] != null && <p className="text-xs text-muted-foreground">Created {formatDate(String(row["created_at"]))}</p>}
      <div className="flex justify-end gap-2 pt-2">
        <button type="button" onClick={onDone} className="rounded-lg px-5 py-2.5 text-sm ring-1 ring-hairline">{readOnly ? "Close" : "Cancel"}</button>
        {!readOnly && <button disabled={busy} className="rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60">{busy ? "Saving…" : "Save"}</button>}
      </div>
    </form>
  );
}

function FieldInput({ f, value, onChange, relations, disabled, source }: { f: Field; value: unknown; onChange: (v: unknown) => void; relations?: { id: string; label: string }[] | undefined; disabled: boolean; source: string }) {
  const v = value as string;
  switch (f.type) {
    case "textarea": return <textarea disabled={disabled} rows={3} value={v} onChange={(e) => onChange(e.target.value)} className="field" />;
    case "longtext": return <textarea disabled={disabled} rows={10} value={v} onChange={(e) => onChange(e.target.value)} className="field font-semibold text-xs leading-relaxed" />;
    case "tags": return <textarea disabled={disabled} rows={4} value={v} onChange={(e) => onChange(e.target.value)} className="field" />;
    case "number": return <input disabled={disabled} type="number" step="any" value={v} onChange={(e) => onChange(e.target.value)} className="field" />;
    case "date": return <input disabled={disabled} type="date" value={v ?? ""} onChange={(e) => onChange(e.target.value)} className="field" />;
    case "datetime": return <input disabled={disabled} type="datetime-local" value={v} onChange={(e) => onChange(e.target.value)} className="field" />;
    case "boolean": return <div><Switch disabled={disabled} checked={!!value} onCheckedChange={onChange} /></div>;
    case "image": return disabled ? (v ? <img src={v} alt="" className="h-24 rounded-lg" /> : <span>—</span>) : <ImageField value={v ?? ""} onChange={onChange} />;
    case "select": return (
      <select disabled={disabled} value={v} onChange={(e) => onChange(e.target.value)} className="field">
        <option value="">—</option>
        {f.options!.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    );
    case "relation": return (
      <select disabled={disabled} value={v ?? ""} onChange={(e) => onChange(e.target.value)} className="field">
        <option value="">—</option>
        {(relations ?? []).map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}
      </select>
    );
    case "slug": return <input disabled={disabled} value={v} placeholder={slugify(source) || "auto-generated"} onChange={(e) => onChange(slugify(e.target.value))} className="field font-semibold text-xs" />;
    default: return <input disabled={disabled} value={v} onChange={(e) => onChange(e.target.value)} className="field" />;
  }
}
