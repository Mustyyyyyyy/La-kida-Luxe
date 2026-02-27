"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import AdminGuard from "@/components/AdminGuard";
import { getUser, logout } from "@/lib/auth";
import BrandLogo from "@/components/BrandLogo";

type UserLite = { fullName?: string; email?: string } | null;

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminGuard>
      <AdminShell>{children}</AdminShell>
    </AdminGuard>
  );
}

function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const [user, setUser] = useState<UserLite>(null);

  useEffect(() => {
    setUser(getUser());
  }, []);

  const nav = [
    { label: "Dashboard", href: "/admin", icon: "grid_view" },
    { label: "Products", href: "/admin/products", icon: "checkroom" },
    { label: "Orders", href: "/admin/orders", icon: "receipt_long" },
    { label: "Messages", href: "/admin/messages", icon: "chat" },
    { label: "Settings", href: "/admin/settings", icon: "settings" },
  ];

  function doLogout() {
    logout();
    router.push("/login");
  }

  return (
    <div className="page">
      <div className="flex min-h-screen">
        <aside className="hidden lg:flex w-72 flex-col border-r border-white/10 bg-[rgba(18,0,24,0.55)]">
          <div className="px-6 py-6 border-b border-white/10">
            <BrandLogo size={56} />
            <div className="mt-2 text-xs tracking-[0.2em] uppercase text-white/60">
              Admin Console
            </div>
          </div>

          <nav className="p-4 space-y-1">
            {nav.map((item) => {
              const active =
                pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={[
                    "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition",
                    active
                      ? "bg-white/10 text-[color:var(--accent)] border border-white/10"
                      : "text-white/80 hover:bg-white/10",
                  ].join(" ")}
                >
                  <span className="material-symbols-outlined">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto p-4 border-t border-white/10">
            <div className="card p-4">
              <div className="text-xs uppercase tracking-[0.2em] text-white/60">
                Signed in as
              </div>
              <div className="mt-1 font-bold font-serif">
                {user?.fullName || "Admin"}
              </div>
              <div className="text-sm text-white/70">{user?.email || ""}</div>

              <button
                onClick={doLogout}
                className="mt-4 w-full btn-outline py-2.5 text-xs hover:bg-white/10"
              >
                Logout
              </button>
            </div>
          </div>
        </aside>

        <div className="flex-1 flex flex-col">
          <header className="sticky top-0 z-40 topbar">
            <div className="px-6 lg:px-10 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[color:var(--accent)]">
                  shield
                </span>
                <div>
                  <div className="font-bold font-serif">Admin</div>
                  <div className="text-xs text-white/70">
                    Manage products, orders, messages, and settings.
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href="/"
                  className="btn-outline px-4 py-2 text-xs hover:bg-white/10"
                >
                  <span className="material-symbols-outlined text-base">home</span>{" "}
                  View site
                </Link>

                <button
                  onClick={doLogout}
                  className="btn-primary px-4 py-2 text-xs hover:brightness-110"
                >
                  <span className="material-symbols-outlined text-base">logout</span>{" "}
                  Logout
                </button>
              </div>
            </div>
          </header>

          <div className="px-6 lg:px-10 py-8">{children}</div>
        </div>
      </div>
    </div>
  );
}