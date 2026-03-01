"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

export default function AuthLink({
  href,
  children,
  className = "",
  requireAuth = true,
  loginHref = "/login",
  preserveNext = true,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  requireAuth?: boolean;
  loginHref?: string;
  preserveNext?: boolean; 
}) {
  const [authed, setAuthed] = useState<boolean | null>(null);

  useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      setAuthed(Boolean(token));
    } catch {
      setAuthed(false);
    }
  }, []);

  const target = useMemo(() => {

    if (!requireAuth) return href;
    if (authed === null) return href;

    if (authed) return href;

    if (!preserveNext) return loginHref;

    const next = encodeURIComponent(href);
    return `${loginHref}?next=${next}`;
  }, [authed, href, loginHref, preserveNext, requireAuth]);

  return (
    <Link href={target} className={className}>
      {children}
    </Link>
  );
}