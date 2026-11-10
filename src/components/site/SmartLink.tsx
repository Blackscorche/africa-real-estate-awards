import { Link, useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";

/**
 * Renders an editable URL from the database: internal paths (optionally with #hash)
 * use client navigation, everything else (http, mailto, tel) is a normal anchor.
 */
export function SmartLink({ to, className = "", activeClassName = "", children, onClick }: { to: string; className?: string; activeClassName?: string; children: ReactNode; onClick?: () => void }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const url = to || "/";
  if (!url.startsWith("/")) {
    const external = url.startsWith("http");
    return <a href={url} onClick={onClick} className={className} {...(external ? { target: "_blank", rel: "noreferrer" } : {})}>{children}</a>;
  }
  const [pathname, hash] = url.split("#");
  const active = activeClassName && pathname !== "/" && path.startsWith(pathname!);
  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Link to={pathname as any} {...(hash ? { hash } : {})} {...(onClick ? { onClick } : {})} className={`${className} ${active ? activeClassName : ""}`}>
      {children}
    </Link>
  );
}
