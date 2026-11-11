import { Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  Menu,
  X,
  UserRound,
  LayoutDashboard,
  Trophy,
  GraduationCap,
  Award,
  Scale,
  ShieldCheck,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { globalQuery } from "@/lib/queries";
import { str } from "@/lib/settings";
import { useAuth } from "@/hooks/use-auth";
import { SmartLink } from "@/components/site/SmartLink";
import { ThemeToggle } from "@/components/site/ThemeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Logo() {
  const { data } = useSuspenseQuery(globalQuery);
  return (
    <span className="font-display text-xl tracking-tight">
      {str(data.settings, "brand", "short_mark", "ARE")}
      <span className="text-primary">{str(data.settings, "brand", "short_accent", "A")}</span>
    </span>
  );
}

function AccountButton({ onNav }: { onNav?: () => void }) {
  const { user, isAdmin, roles, ready, signOut } = useAuth();
  if (!ready) return <span className="hidden w-20 md:block" />;
  if (!user)
    return (
      <Link
        to="/auth"
        onClick={onNav}
        className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-muted-foreground ring-1 ring-hairline transition-colors hover:text-primary"
      >
        <UserRound className="size-4" /> Sign in
      </Link>
    );

  const displayName = user.user_metadata?.["full_name"]
    ? String(user.user_metadata["full_name"]).split(" ")[0]
    : "Account";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-muted-foreground ring-1 ring-hairline transition-colors hover:text-primary focus:outline-none"
        >
          <UserRound className="size-4 text-primary" />
          <span>{displayName}</span>
          <ChevronDown className="size-3 text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 bg-card border-border">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-xs font-semibold leading-none">{user.email}</p>
            <p className="text-[10px] leading-none text-muted-foreground">Select your portal</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/dashboard" onClick={onNav} className="flex items-center gap-2 cursor-pointer">
            <Trophy className="size-4 text-primary" />
            <div>
              <p className="text-xs font-medium">Voter & Attendee</p>
              <p className="text-[10px] text-muted-foreground">Ballot, tickets & entries</p>
            </div>
          </Link>
        </DropdownMenuItem>
        {roles.includes("member") && <DropdownMenuItem asChild>
          <Link to="/dashboard/member" onClick={onNav} className="flex items-center gap-2 cursor-pointer">
            <GraduationCap className="size-4 text-primary" />
            <div>
              <p className="text-xs font-medium">Institute Member</p>
              <p className="text-[10px] text-muted-foreground">Credentials & CPD vault</p>
            </div>
          </Link>
        </DropdownMenuItem>}
        {roles.includes("nominee") && <DropdownMenuItem asChild>
          <Link to="/dashboard/nominee" onClick={onNav} className="flex items-center gap-2 cursor-pointer">
            <Award className="size-4 text-primary" />
            <div>
              <p className="text-xs font-medium">Award Nominee</p>
              <p className="text-[10px] text-muted-foreground">Campaign hub & badge</p>
            </div>
          </Link>
        </DropdownMenuItem>}
        {roles.includes("jury") && <DropdownMenuItem asChild>
          <Link to="/dashboard/judge" onClick={onNav} className="flex items-center gap-2 cursor-pointer">
            <Scale className="size-4 text-primary" />
            <div>
              <p className="text-xs font-medium">Jury & Evaluation</p>
              <p className="text-[10px] text-muted-foreground">Nominee scorecards</p>
            </div>
          </Link>
        </DropdownMenuItem>}
        {isAdmin && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/admin" onClick={onNav} className="flex items-center gap-2 cursor-pointer text-amber-500">
                <ShieldCheck className="size-4" />
                <div>
                  <p className="text-xs font-medium">Admin Console</p>
                  <p className="text-[10px] text-muted-foreground">Site & data management</p>
                </div>
              </Link>
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            if (onNav) onNav();
            signOut();
          }}
          className="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive"
        >
          <LogOut className="size-4" />
          <span className="text-xs">Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function AnnouncementBar() {
  const { data } = useSuspenseQuery(globalQuery);
  const a = data.settings["announcement"];
  if (!a || a["enabled"] === false) return null;
  return (
    <div className="relative z-10 mx-auto max-w-7xl px-6 pt-4">
      <SmartLink to={str(data.settings, "announcement", "link_url", "/advertise")} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-card px-5 py-3 text-sm transition-colors hover:border-primary">
        <span className="eyebrow text-muted-foreground">{str(data.settings, "announcement", "label")}</span>
        <span className="font-medium">{str(data.settings, "announcement", "text")}</span>
        <span className="font-semibold text-primary">{str(data.settings, "announcement", "link_label", "Learn more")} →</span>
      </SmartLink>
    </div>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const { data } = useSuspenseQuery(globalQuery);
  const s = data.settings;
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-6">
        <Link to="/" className="flex items-baseline gap-2" onClick={() => setOpen(false)}>
          <Logo />
          <span className="hidden font-semibold text-[10px] uppercase tracking-wider text-muted-foreground xl:block">Institute of Real Estate</span>
        </Link>
        <nav className="hidden items-center gap-7 text-sm lg:flex">
          {data.nav.map((l) => (
            <SmartLink key={l.id} to={l.url} className="text-muted-foreground transition-colors duration-200 hover:text-primary" activeClassName="text-primary">
              {l.label}
            </SmartLink>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <div className="hidden md:block"><AccountButton /></div>
          <SmartLink to={str(s, "brand", "header_cta_link", "/awards#nominate")} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors duration-200 hover:bg-primary/80">
            {str(s, "brand", "header_cta_label", "Nominate")}
          </SmartLink>
          <button aria-label="Menu" className="lg:hidden" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
        </div>
      </div>
      {open && (
        <nav className="flex flex-col gap-1 border-t border-border px-6 py-4 lg:hidden">
          {data.nav.map((l) => (
            <SmartLink key={l.id} to={l.url} onClick={() => setOpen(false)} className="py-2 font-display text-2xl uppercase" activeClassName="text-primary">{l.label}</SmartLink>
          ))}
          <div className="pt-3 md:hidden"><AccountButton onNav={() => setOpen(false)} /></div>
        </nav>
      )}
    </header>
  );
}

export function Footer() {
  const { data } = useSuspenseQuery(globalQuery);
  const s = data.settings;
  const socials = (["instagram", "linkedin", "x", "facebook"] as const).filter((k) => str(s, "brand", k));
  return (
    <footer className="relative z-10 border-t border-border">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <span className="text-2xl"><Logo /></span>
          <p className="mt-3 max-w-[38ch] text-pretty text-sm text-muted-foreground">{str(s, "footer", "about")}</p>
        </div>
        <div>
          <p className="eyebrow mb-3 text-muted-foreground">Explore</p>
          <ul className="space-y-2 text-sm">
            {data.nav.map((l) => <li key={l.id}><SmartLink to={l.url} className="transition-colors hover:text-primary">{l.label}</SmartLink></li>)}
          </ul>
        </div>
        <div>
          <p className="eyebrow mb-3 text-muted-foreground">Contact</p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {str(s, "brand", "email") && <li><a className="hover:text-primary" href={`mailto:${str(s, "brand", "email")}`}>{str(s, "brand", "email")}</a></li>}
            {str(s, "brand", "phone") && <li>{str(s, "brand", "phone")}</li>}
            {str(s, "brand", "address") && <li>{str(s, "brand", "address")}</li>}
            {socials.map((k) => <li key={k}><a className="capitalize hover:text-primary" href={str(s, "brand", k)} target="_blank" rel="noreferrer">{k}</a></li>)}
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <p className="eyebrow mx-auto max-w-7xl px-6 py-5 text-muted-foreground">{str(s, "footer", "bottom_line")}</p>
      </div>
    </footer>
  );
}

export function PageHead({ eyebrow, title, intro, image }: { eyebrow: string; title: string; intro: string; image?: string | undefined }) {
  return (
    <section className="relative z-10 mx-auto max-w-7xl px-6 pb-12 pt-16">
      <div className={image ? "grid items-end gap-10 lg:grid-cols-[1.2fr_0.8fr]" : ""}>
        <div>
          <p className="eyebrow rise mb-4 text-primary">{eyebrow}</p>
          <h1 className="rise max-w-4xl text-balance font-display text-5xl uppercase leading-[0.92] tracking-tight md:text-7xl" style={{ animationDelay: "80ms" }}>{title}</h1>
          <p className="rise mt-5 max-w-[56ch] text-pretty text-lg text-muted-foreground" style={{ animationDelay: "160ms" }}>{intro}</p>
        </div>
        {image && (
          <div className="rise relative overflow-hidden rounded-xl ring-1 ring-hairline" style={{ animationDelay: "200ms" }}>
            <img src={image} alt="" width={1600} height={1000} className="aspect-[4/3] w-full object-cover" />
          </div>
        )}
      </div>
    </section>
  );
}
