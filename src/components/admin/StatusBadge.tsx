const tone: Record<string, string> = {
  pending: "bg-warning/15 text-warning",
  new: "bg-warning/15 text-warning",
  approved: "bg-success/15 text-success",
  confirmed: "bg-success/15 text-success",
  handled: "bg-success/15 text-success",
  winner: "bg-primary/20 text-primary",
  shortlisted: "bg-ice/15 text-ice",
  published: "bg-glass text-muted-foreground",
  rejected: "bg-destructive/15 text-destructive",
  cancelled: "bg-destructive/15 text-destructive",
  hidden: "bg-destructive/15 text-destructive",
};

export function StatusBadge({ status }: { status: string }) {
  return <span className={`rounded-lg px-2.5 py-1 font-semibold text-[10px] uppercase tracking-wider ${tone[status] ?? "bg-glass text-muted-foreground"}`}>{status}</span>;
}
