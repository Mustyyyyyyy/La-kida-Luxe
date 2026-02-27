"use client";

import Link from "next/link";
import { useMemo } from "react";

export default function AuthLink({
  href,
  children,
  className = "",
  requireAuth = true,
  loginHref = "/login",
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  requireAuth?: boolean;
  loginHref?: string;
}) {
  const authed = useMemo(() => {
    try {
      const token = localStorage.getItem("token");
      return Boolean(token);
    } catch {
      return false;
    }
  }, []);

  const target = requireAuth && !authed ? loginHref : href;

  return (
    <Link href={target} className={className}>
      {children}
    </Link>
  );
}