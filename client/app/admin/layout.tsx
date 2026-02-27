"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import AdminGuard from "@/components/AdminGuard";
import { getUser, logout } from "@/lib/auth";
import BrandLogo from "@/components/BrandLogo";

type UserLite = { fullName?: string; email?: string } | null;

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AdminGuard>
      <AdminShell>{children}</AdminShell>
    </AdminGuard>
  );
}

function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const [user, setUser] = useState<UserLite>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setUser(getUser());
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const nav = [
    { label: "Dashboard", href: "/admin", icon: "grid_view" },
    { label: "Products", href: "/admin/products", icon: "checkroom" },
    { label: "Orders", href: "/admin/orders", icon: "receipt_long" },
    { label: "Messages", href: "/admin/messages", icon: "chat" },
    { label: "Settings", href: "/admin/settings", icon: "settings" },
  ];

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(href + "/");
  }

  function doLogout() {
    logout();
    router.push("/login");
  }

  return (
    <div className="page">
      <header className="sticky top-0 z-40 topbar px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            className="lg:hidden btn-outline px-3 py-2"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            type="button"
          >
            <span className="material-symbols-outlined">menu</span>
          </button>

          <BrandLogo size={44} />
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin"
            className="btn-outline px-4 py-2 text-xs hover:bg-white/10"
            aria-label="Admin Dashboard"
            title="Admin Dashboard"
          >
            <span className="material-symbols-outlined text-base">grid_view</span>
            <span className="ml-2 hidden sm:inline">Dashboard</span>
          </Link>

          <Link
            href="/"
            className="hidden sm:inline-flex btn-outline px-4 py-2 text-xs hover:bg-white/10"
          >
            <span className="material-symbols-outlined text-base">home</span>
            <span className="ml-2">View site</span>
          </Link>

          <button
            onClick={doLogout}
            className="btn-primary px-4 py-2 text-xs hover:brightness-110"
          >
            <span className="material-symbols-outlined text-base">logout</span>
            <span className="ml-2 hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      <div className="flex min-h-screen">
        <aside className="hidden lg:flex w-72 flex-col border-r border-white/10 bg-[rgba(18,0,24,0.55)]">
          <div className="px-6 py-6 border-b border-white/10">
            <div className="text-xs tracking-[0.2em] uppercase text-white/60">
              Admin Console
            </div>
            <div className="mt-3 text-sm text-white/70">
              {user?.fullName || "Admin"} {user?.email ? `• ${user.email}` : ""}
            </div>
          </div>

          <nav className="p-4 space-y-1">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition",
                  isActive(item.href)
                    ? "bg-white/10 text-[color:var(--accent)] border border-white/10"
                    : "text-white/80 hover:bg-white/10",
                ].join(" ")}
              >
                <span className="material-symbols-outlined">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          <div className="mt-auto p-4 border-t border-white/10">
            <button
              onClick={doLogout}
              className="w-full btn-outline py-2.5 text-xs hover:bg-white/10"
            >
              Logout
            </button>
          </div>
        </aside>

        {open ? (
          <div className="lg:hidden fixed inset-0 z-50">
            <div
              className="absolute inset-0 bg-black/60"
              onClick={() => setOpen(false)}
            />
            <div className="absolute left-0 top-0 h-full w-[85%] max-w-sm bg-[#120018] border-r border-white/10 p-4">
              <div className="flex items-center justify-between">
                <BrandLogo size={44} />
                <button
                  className="btn-outline px-3 py-2"
                  onClick={() => setOpen(false)}
                  aria-label="Close menu"
                  type="button"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <div className="mt-3 text-sm text-white/70">
                {user?.fullName || "Admin"} {user?.email ? `• ${user.email}` : ""}
              </div>

              <nav className="mt-6 space-y-1">
                {nav.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)} 
                    className={[
                      "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition",
                      isActive(item.href)
                        ? "bg-white/10 text-[color:var(--accent)] border border-white/10"
                        : "text-white/80 hover:bg-white/10",
                    ].join(" ")}
                  >
                    <span className="material-symbols-outlined">{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                ))}

                <Link
                  href="/"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-white/80 hover:bg-white/10"
                >
                  <span className="material-symbols-outlined">home</span>
                  <span>View site</span>
                </Link>
              </nav>

              <button
                onClick={doLogout}
                className="mt-6 w-full btn-primary py-3 text-xs hover:brightness-110"
              >
                Logout
              </button>
            </div>
          </div>
        ) : null}

        <main className="flex-1 px-4 sm:px-6 lg:px-10 py-8">{children}</main>
      </div>
    </div>
  );
}