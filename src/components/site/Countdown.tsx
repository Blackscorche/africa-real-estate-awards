import { useEffect, useState } from "react";

function diff(target: number) {
  const ms = Math.max(0, target - Date.now());
  return {
    days: Math.floor(ms / 86400000),
    hrs: Math.floor(ms / 3600000) % 24,
    min: Math.floor(ms / 60000) % 60,
    sec: Math.floor(ms / 1000) % 60,
  };
}

export function Countdown({ date }: { date: string }) {
  const target = new Date(date || "2026-12-13T18:00:00+01:00").getTime();
  const [t, setT] = useState<ReturnType<typeof diff> | null>(null);
  useEffect(() => {
    setT(diff(target));
    const id = setInterval(() => setT(diff(target)), 1000);
    return () => clearInterval(id);
  }, [target]);
  const cells: [string, number | undefined][] = [
    ["days", t?.days], ["hrs", t?.hrs], ["min", t?.min], ["sec", t?.sec],
  ];
  return (
    <div className="grid grid-cols-4 gap-2 text-center">
      {cells.map(([label, v], i) => (
        <div key={label} className="rounded-xl bg-well py-4 ring-1 ring-hairline">
          <span key={v} className={`tick block font-display text-4xl tabular-nums ${i === 3 ? "text-primary" : ""}`}>
            {v === undefined ? "--" : String(v).padStart(2, "0")}
          </span>
          <span className="font-semibold text-[10px] uppercase tracking-wider text-muted-foreground">{label}</span>
        </div>
      ))}
    </div>
  );
}
