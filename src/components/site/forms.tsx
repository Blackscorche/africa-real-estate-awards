import { useState, type FormEvent, type ReactNode } from "react";
import { toast } from "sonner";

export const fieldClass = "field";

type FormKey = "email" | "fullName" | "phone" | "company" | "message" | "kind" | "nominee" | "nominatorName" | "reason" | "categoryId" | "packageId" | "quantity" | "organisation" | "country" | "role" | "city" | "format";
export type FormVals = Partial<Record<FormKey, string>>;

/** Wraps a form submit: collects FormData, runs the server call, shows a toast, resets on success. */
export function useFormSubmit<T>(run: (values: FormVals) => Promise<T>, success: (r: T, v: FormVals) => string | void) {
  const [busy, setBusy] = useState(false);
  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const values = Object.fromEntries(Array.from(new FormData(form).entries()).map(([k, v]) => [k, String(v)])) as FormVals;
    setBusy(true);
    try {
      const r = await run(values);
      const msg = success(r, values);
      if (msg) toast.success(msg);
      form.reset();
    } catch (err) {
      toast.error(readError(err));
    } finally {
      setBusy(false);
    }
  }
  return { busy, onSubmit };
}

export function readError(err: unknown): string {
  const raw = err instanceof Error ? err.message : String(err);
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed[0]?.message) return parsed[0].message;
  } catch { /* not zod JSON */ }
  return raw || "Something went wrong. Please try again.";
}

export function SubmitButton({ busy, children }: { busy: boolean; children: ReactNode }) {
  return (
    <button disabled={busy} className="w-full rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary/80 disabled:opacity-60">
      {busy ? "Sending…" : children}
    </button>
  );
}
