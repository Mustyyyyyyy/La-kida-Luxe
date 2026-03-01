"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

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
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    try {
      setAuthed(Boolean(localStorage.getItem("token")));
    } catch {
      setAuthed(false);
    }
  }, []);

  const target = requireAuth && !authed ? loginHref : href;

  return (
    <Link href={target} className={className}>
      {children}
    </Link>
  );
}