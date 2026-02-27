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
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setUser(getUser());
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

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

  function NavLinks({ onClick }: { onClick?: () => void }) {
    return (
      <nav className="p-4 space-y-1">
        {nav.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClick}
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
    );
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

          <NavLinks />

          <div className="mt-auto p-4 border-t border-white/10">
            <div className="card p-4">
              <div className="text-xs uppercase tracking-[0.2em] text-white/60">
                Signed in as
              </div>
              <div className="mt-1 font-bold font-serif">{user?.fullName || "Admin"}</div>
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

        {mobileOpen ? (
          <div className="lg:hidden fixed inset-0 z-[80]">
            <button
              className="absolute inset-0 bg-black/60"
              aria-label="Close menu"
              onClick={() => setMobileOpen(false)}
            />

            <div className="absolute left-0 top-0 h-full w-[86%] max-w-sm border-r border-white/10 bg-[rgba(18,0,24,0.95)]">
              <div className="px-5 py-5 border-b border-white/10 flex items-center justify-between">
                <BrandLogo size={52} />
                <button
                  onClick={() => setMobileOpen(false)}
                  className="btn-outline px-3 py-2"
                  aria-label="Close"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <div className="px-5 pt-4">
                <div className="text-xs tracking-[0.2em] uppercase text-white/60">
                  Admin Console
                </div>
                <div className="mt-2 text-sm text-white/80">
                  {user?.fullName || "Admin"}{" "}
                  <span className="text-white/60">{user?.email ? `• ${user.email}` : ""}</span>
                </div>
              </div>

              <NavLinks onClick={() => setMobileOpen(false)} />

              <div className="mt-auto p-4 border-t border-white/10">
                <button
                  onClick={doLogout}
                  className="w-full btn-primary py-3 text-sm hover:brightness-110"
                >
                  <span className="material-symbols-outlined align-middle mr-2">logout</span>
                  Logout
                </button>
              </div>
            </div>
          </div>
        ) : null}

        <div className="flex-1 flex flex-col">
          <header className="sticky top-0 z-40 topbar">
            <div className="px-4 sm:px-6 lg:px-10 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  className="lg:hidden btn-outline px-3 py-2"
                  onClick={() => setMobileOpen(true)}
                  aria-label="Open menu"
                >
                  <span className="material-symbols-outlined">menu</span>
                </button>

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

              <div className="flex items-center gap-2">
                <Link href="/" className="hidden sm:inline-flex btn-outline px-4 py-2 text-xs hover:bg-white/10">
                  <span className="material-symbols-outlined text-base">home</span>{" "}
                  View site
                </Link>

                <button onClick={doLogout} className="btn-primary px-4 py-2 text-xs hover:brightness-110">
                  <span className="material-symbols-outlined text-base">logout</span>{" "}
                  Logout
                </button>
              </div>
            </div>
          </header>

          <div className="px-4 sm:px-6 lg:px-10 py-6 lg:py-8">{children}</div>
        </div>
      </div>
    </div>
  );
}