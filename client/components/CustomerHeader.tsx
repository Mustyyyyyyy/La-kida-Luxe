"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import BrandLogo from "@/components/BrandLogo";

function getUser() {
  try {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function isLoggedIn() {
  return !!localStorage.getItem("token");
}

function logout(router: any) {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  router.push("/login");
}

export default function CustomerHeader() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const loggedIn = useMemo(() => {
    if (typeof window === "undefined") return false;
    return isLoggedIn();
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const linksLoggedOut = [
    { label: "Shop", href: "/shop" },
    { label: "Login", href: "/login" },
    { label: "Register", href: "/register" },
  ];

  const linksLoggedIn = [
    { label: "Shop", href: "/shop" },
    { label: "Orders", href: "/orders" },
    { label: "Cart", href: "/cart" },
  ];

  return (
    <header className="sticky top-0 z-50 topbar px-4 sm:px-6 lg:px-20 py-3">
      <div className="flex items-center justify-between gap-3">
        <BrandLogo size={44} showText={true} />

        <nav className="hidden md:flex items-center gap-3">
          {(loggedIn ? linksLoggedIn : linksLoggedOut).map((l) => (
            <Link key={l.href} href={l.href} className="btn-outline px-4 py-2 text-xs hover:bg-white/10">
              {l.label}
            </Link>
          ))}

          {loggedIn ? (
            <button
              onClick={() => logout(router)}
              className="btn-primary px-4 py-2 text-xs hover:brightness-110 inline-flex items-center gap-2"
              aria-label="Logout"
              title="Logout"
            >
              <span className="material-symbols-outlined text-base">logout</span>
              Logout
            </button>
          ) : (
            <Link href="/shop" className="btn-primary px-4 py-2 text-xs hover:brightness-110">
              Shop Now
            </Link>
          )}
        </nav>

        <button
          className="md:hidden btn-outline px-3 py-2"
          onClick={() => setOpen((v) => !v)}
          aria-label="Open menu"
        >
          <span className="material-symbols-outlined text-xl">
            {open ? "close" : "menu"}
          </span>
        </button>
      </div>

      {open ? (
        <div className="md:hidden mt-3 card p-3">
          <div className="grid gap-2">
            {(loggedIn ? linksLoggedIn : linksLoggedOut).map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="btn-outline px-4 py-3 text-sm hover:bg-white/10"
              >
                {l.label}
              </Link>
            ))}

            {loggedIn ? (
              <button
                onClick={() => logout(router)}
                className="btn-primary px-4 py-3 text-sm hover:brightness-110 inline-flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined">logout</span>
                Logout
              </button>
            ) : (
              <Link href="/shop" className="btn-primary px-4 py-3 text-sm hover:brightness-110 text-center">
                Shop Now
              </Link>
            )}
          </div>
        </div>
      ) : null}
    </header>
  );
}