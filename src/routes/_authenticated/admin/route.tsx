import { createFileRoute, Link, Outlet, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { BarChart3, ExternalLink, FileText, LogOut, Menu, Users, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { collectionGroups, collections } from "@/lib/admin-config";
import { useAuth } from "@/hooks/use-auth";
import { ThemeToggle } from "@/components/site/ThemeToggle";

export const Route = createFileRoute("/_authenticated/admin")({
  beforeLoad: async ({ context }) => {
    const { data } = await supabase.rpc("has_role", { _user_id: context.userId, _role: "admin" });
    if (!data) throw redirect({ to: "/dashboard" });
  },
  head: () => ({
    meta: [
      { title: "Admin dashboard — Africa Real Estate Awards" },
      { name: "description", content: "Manage every page, award, story, image and submission." },
      { property: "og:title", content: "Admin dashboard" },
      { property: "og:type", content: "website" },
      { property: "og:description", content: "Manage every page, award, story, image and submission." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminLayout,
});

const linkCls = "flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-glass hover:text-foreground";
const activeCls = "bg-primary/10 text-primary";

function Nav({ onNav }: { onNav: () => void }) {
  return (
    <nav className="space-y-6">
      <div className="space-y-1">
        <Link to="/admin" onClick={onNav} activeOptions={{ exact: true }} className={linkCls} activeProps={{ className: activeCls }}><BarChart3 className="size-4" /> Overview</Link>
        <Link to="/admin/content" onClick={onNav} className={linkCls} activeProps={{ className: activeCls }}><FileText className="size-4" /> Page text & settings</Link>
        <Link to="/admin/users" onClick={onNav} className={linkCls} activeProps={{ className: activeCls }}><Users className="size-4" /> Users & admins</Link>
      </div>
      {collectionGroups.map((g) => (
        <div key={g}>
          <p className="eyebrow mb-2 px-3 text-muted-foreground">{g}</p>
          <div className="space-y-0.5">
            {collections.filter((c) => c.group === g).map((c) => (
              <Link key={c.key} to="/admin/$section" params={{ section: c.key }} onClick={onNav} className={linkCls} activeProps={{ className: activeCls }}>{c.label}</Link>
            ))}
          </div>
        </div>
      ))}
    </nav>
  );
}

function AdminLayout() {
  const [open, setOpen] = useState(false);
  const { user, signOut } = useAuth();
  return (
    <div className="flex min-h-screen">
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 overflow-y-auto border-r border-border bg-card p-4 transition-transform lg:static lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="mb-6 flex items-center justify-between px-3">
          <Link to="/" className="font-display text-xl">ARE<span className="text-primary">A</span> <span className="font-semibold text-[10px] uppercase tracking-wider text-muted-foreground">Admin</span></Link>
          <ThemeToggle className="ml-auto mr-2" />
          <button className="lg:hidden" aria-label="Close menu" onClick={() => setOpen(false)}><X className="size-5" /></button>
        </div>
        <Nav onNav={() => setOpen(false)} />
        <div className="mt-8 space-y-1 border-t border-border pt-4">
          <Link to="/" className={linkCls}><ExternalLink className="size-4" /> View website</Link>
          <Link to="/dashboard" className={linkCls}>My account</Link>
          <button onClick={signOut} className={`${linkCls} w-full`}><LogOut className="size-4" /> Sign out</button>
          <p className="truncate px-3 pt-2 text-xs text-muted-foreground">{user?.email}</p>
        </div>
      </aside>
      {open && <div className="fixed inset-0 z-30 bg-background/70 lg:hidden" onClick={() => setOpen(false)} />}
      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-border bg-background px-4 lg:hidden">
          <button aria-label="Open menu" onClick={() => setOpen(true)}><Menu className="size-5" /></button>
          <span className="font-display text-lg">Admin</span>
        </header>
        <main className="mx-auto max-w-6xl p-6 md:p-10"><Outlet /></main>
      </div>
    </div>
  );
}
