import { Link, useRouterState } from "@tanstack/react-router";
import { Trophy, GraduationCap, Scale, Award, ShieldCheck, LogOut, ExternalLink, Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

interface RoleSwitcherProps {
  currentRole?: "voter" | "member" | "nominee" | "judge";
}

export function RoleSwitcher({ currentRole = "voter" }: RoleSwitcherProps) {
  const { user, isAdmin, roles: grantedRoles, signOut } = useAuth();
  const path = useRouterState({ select: (s) => s.location.pathname });

  const roles = [
    {
      id: "voter",
      to: "/dashboard",
      label: "Voter & Attendee",
      icon: Trophy,
      desc: "Ballot, Gala Tickets & Nominations",
      active: path === "/dashboard" || currentRole === "voter",
    },
    {
      id: "member",
      to: "/dashboard/member",
      label: "Institute Member",
      icon: GraduationCap,
      desc: "Credentials, CPD & Vault",
      active: path === "/dashboard/member" || currentRole === "member",
    },
    {
      id: "nominee",
      to: "/dashboard/nominee",
      label: "Award Nominee",
      icon: Award,
      desc: "Live Campaign & Official Badge",
      active: path === "/dashboard/nominee" || currentRole === "nominee",
    },
    {
      id: "judge",
      to: "/dashboard/judge",
      label: "Jury & Evaluation",
      icon: Scale,
      desc: "Confidential Nominee Scorecards",
      active: path === "/dashboard/judge" || currentRole === "judge",
    },
  ];

  return (
    <div className="mb-8 space-y-4">
      {/* Role Switcher Header / Bar */}
      <div className="glass-panel overflow-hidden border border-border/80 p-4 sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-2.5 py-0.5 font-semibold text-[11px] text-primary">
                <Sparkles className="size-3" /> Dedicated Dashboards
              </span>
              {isAdmin && (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2.5 py-0.5 font-semibold text-[11px] text-amber-500">
                  <ShieldCheck className="size-3" /> Admin Privileges
                </span>
              )}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Switch role view to access your personalized portal:
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {isAdmin && (
              <Link
                to="/admin"
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary/20 px-3.5 py-2 text-xs font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                <ShieldCheck className="size-3.5" />
                Admin Console
              </Link>
            )}
            <Link
              to="/awards"
              hash="vote"
              className="inline-flex items-center gap-1.5 rounded-lg bg-glass px-3 py-2 text-xs font-medium ring-1 ring-hairline hover:text-primary"
            >
              <ExternalLink className="size-3.5" />
              Public Ballot
            </Link>
            <button
              onClick={signOut}
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs ring-1 ring-hairline transition-colors hover:bg-destructive/10 hover:text-destructive"
              title="Sign out of your account"
            >
              <LogOut className="size-3.5" />
              Sign out
            </button>
          </div>
        </div>

        {/* Role Pills / Tabs */}
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {roles.filter((r) => r.id === "voter" || grantedRoles.includes(r.id === "judge" ? "jury" : r.id)).map((r) => {
            const Icon = r.icon;
            const isCurrent = r.active;
            return (
              <Link
                key={r.id}
                to={r.to}
                className={`group flex items-start gap-3 rounded-lg p-2.5 transition-all ${
                  isCurrent
                    ? "bg-primary text-primary-foreground shadow-md ring-1 ring-primary"
                    : "bg-background/40 hover:bg-glass hover:text-foreground ring-1 ring-hairline"
                }`}
              >
                <div
                  className={`mt-0.5 rounded-md p-1.5 ${
                    isCurrent ? "bg-primary-foreground/20 text-primary-foreground" : "bg-card text-primary"
                  }`}
                >
                  <Icon className="size-4" />
                </div>
                <div className="min-w-0">
                  <p className={`font-display text-sm uppercase leading-tight ${isCurrent ? "text-primary-foreground" : "text-foreground group-hover:text-primary"}`}>
                    {r.label}
                  </p>
                  <p className={`hidden truncate text-[11px] sm:block ${isCurrent ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                    {r.desc}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
