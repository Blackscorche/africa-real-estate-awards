import { useRef, useState } from "react";
import { toast } from "sonner";
import { ImagePlus, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const TEN_YEARS = 60 * 60 * 24 * 365 * 10;

/** Uploads an image to file storage and returns a long-lived link that is saved with the content. */
export async function uploadImage(file: File): Promise<string> {
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${new Date().getFullYear()}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from("media").upload(path, file, { contentType: file.type, upsert: false });
  if (error) throw error;
  const { data, error: e2 } = await supabase.storage.from("media").createSignedUrl(path, TEN_YEARS);
  if (e2 || !data) throw e2 ?? new Error("Could not create image link");
  return data.signedUrl;
}

export function ImageField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  async function pick(file?: File) {
    if (!file) return;
    if (!file.type.startsWith("image/")) { toast.error("Please choose an image file."); return; }
    if (file.size > 10 * 1024 * 1024) { toast.error("Images must be under 10 MB."); return; }
    setBusy(true);
    try {
      onChange(await uploadImage(file));
      toast.success("Image uploaded.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="flex items-start gap-3">
      <div className="relative size-24 shrink-0 overflow-hidden rounded-xl bg-well ring-1 ring-hairline">
        {value ? <img src={value} alt="" className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center text-muted-foreground"><ImagePlus className="size-6" /></div>}
        {value && <button type="button" aria-label="Remove image" onClick={() => onChange("")} className="absolute right-1 top-1 rounded-lg bg-background/80 p-1"><X className="size-3" /></button>}
      </div>
      <div className="flex-1 space-y-2">
        <button type="button" disabled={busy} onClick={() => ref.current?.click()} className="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground disabled:opacity-60">{busy ? "Uploading…" : value ? "Replace image" : "Upload image"}</button>
        <input ref={ref} type="file" accept="image/*" className="hidden" onChange={(e) => pick(e.target.files?.[0])} />
        <input value={value} onChange={(e) => onChange(e.target.value)} placeholder="…or paste an image link" className="field text-xs" />
      </div>
    </div>
  );
}
