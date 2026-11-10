/** Site-wide editable text lives in the site_settings table as one JSON object per key. */
export type SettingValue = string | number | boolean | null;
export type SettingsMap = Record<string, Record<string, SettingValue>>;

export function str(settings: SettingsMap | undefined, key: string, field: string, fallback = ""): string {
  const v = settings?.[key]?.[field];
  return typeof v === "string" ? v : v == null ? fallback : String(v);
}

export function bool(settings: SettingsMap | undefined, key: string, field: string, fallback = true): boolean {
  const v = settings?.[key]?.[field];
  return typeof v === "boolean" ? v : fallback;
}

export function formatMoney(amount: number | string | null | undefined, currency = "NGN") {
  const n = Number(amount ?? 0);
  if (!n) return "Free";
  try {
    return new Intl.NumberFormat("en-NG", { style: "currency", currency, maximumFractionDigits: 0 }).format(n);
  } catch {
    return `${currency} ${n.toLocaleString()}`;
  }
}

export function formatDate(d: string | null | undefined) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export function paragraphs(body: string | null | undefined) {
  return (body ?? "").split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
}
