"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import AdminGuard from "@/components/AdminGuard";
import { getUser, logout } from "@/lib/auth";
import BrandLogo from "@/components/BrandLogo";

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
  const user = getUser();

  const nav = [
    { label: "Dashboard", href: "/admin", icon: "grid_view" },
    { label: "Products", href: "/admin/products", icon: "checkroom" },
    { label: "Orders", href: "/admin/orders", icon: "receipt_long" },
    { label: "Messages", href: "/admin/messages", icon: "chat" },
    { label: "Settings", href: "/admin/settings", icon: "settings" },
  ];

  return (
    <div className="page">
      <div className="flex min-h-screen">
        <aside className="hidden lg:flex w-72 flex-col border-r border-white/10 bg-[rgba(255,255,255,0.04)]">
          <div className="px-6 py-6 border-b border-white/10">
            <div className="flex items-center justify-between">
              <BrandLogo />
            </div>

            <div className="mt-3 text-xs tracking-[0.2em] uppercase muted">
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
                    "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition border",
                    active
                      ? "bg-[rgba(242,208,13,0.14)] text-[color:var(--accent)] border-[rgba(242,208,13,0.22)]"
                      : "border-transparent text-white/80 hover:bg-white/5 hover:border-white/10",
                  ].join(" ")}
                >
                  <span className="material-symbols-outlined">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto p-4 border-t border-white/10">
            <div className="card-soft p-4">
              <div className="text-xs uppercase tracking-[0.2em] muted">
                Signed in as
              </div>
              <div className="mt-1 font-bold font-serif">
                {user?.fullName || "Admin"}
              </div>
              <div className="text-sm muted">{user?.email || ""}</div>

              <button
                onClick={() => {
                  logout();
                  router.push("/login");
                }}
                className="mt-4 w-full btn-outline py-2.5 text-xs"
              >
                Logout
              </button>
            </div>
          </div>
        </aside>

        <div className="flex-1 flex flex-col">
          <header className="sticky top-0 z-40 border-b border-white/10 bg-[rgba(20,0,31,0.78)] backdrop-blur-md">
            <div className="px-6 lg:px-10 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[color:var(--accent)]">
                  shield
                </span>
                <div>
                  <div className="font-bold font-serif">Admin</div>
                  <div className="text-xs muted">
                    Manage products, orders, messages, and settings.
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href="/"
                  className="hidden sm:inline-flex items-center gap-2 btn-outline px-4 py-2 text-xs"
                >
                  <span className="material-symbols-outlined text-base">home</span>
                  View site
                </Link>

                <button
                  onClick={() => {
                    logout();
                    router.push("/login");
                  }}
                  className="inline-flex items-center gap-2 btn-primary px-4 py-2 text-xs"
                >
                  <span className="material-symbols-outlined text-base">
                    logout
                  </span>
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