"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import AdminGuard from "@/components/AdminGuard";
import { getUser, logout } from "@/lib/auth";

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
    { label: "Settings", href: "/admin/settings", icon: "settings" },
  ];

  return (
    <div className="min-h-screen bg-[#f8f8f5] text-slate-900 dark:bg-[#221f10] dark:text-slate-100">
      <div className="flex min-h-screen">
        <aside className="hidden lg:flex w-72 flex-col border-r border-[#f2d00d]/15 bg-white/70 dark:bg-white/5">
          <div className="px-6 py-6 border-b border-[#f2d00d]/15">
            <Link href="/" className="flex items-center gap-2 text-[#f2d00d]">
              <span className="material-symbols-outlined text-3xl">diamond</span>
              <div>
                <div className="text-lg font-bold tracking-widest font-serif uppercase">
                  LA&apos;KIDA
                </div>
                <div className="text-xs tracking-[0.2em] uppercase text-slate-500 dark:text-slate-400">
                  Admin Console
                </div>
              </div>
            </Link>
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
                      ? "bg-[#f2d00d]/15 text-[#f2d00d] border border-[#f2d00d]/25"
                      : "text-slate-700 dark:text-slate-200 hover:bg-[#f2d00d]/10",
                  ].join(" ")}
                >
                  <span className="material-symbols-outlined">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto p-4 border-t border-[#f2d00d]/15">
            <div className="rounded-xl border border-[#f2d00d]/15 bg-white/60 dark:bg-white/5 p-4">
              <div className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                Signed in as
              </div>
              <div className="mt-1 font-bold font-serif">
                {user?.fullName || "Admin"}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-300">
                {user?.email || ""}
              </div>

              <button
                onClick={() => {
                  logout();
                  router.push("/login");
                }}
                className="mt-4 w-full border border-[#f2d00d]/40 text-[#f2d00d] py-2.5 rounded-lg font-bold uppercase tracking-widest text-xs hover:bg-[#f2d00d]/10"
              >
                Logout
              </button>
            </div>
          </div>
        </aside>

        <div className="flex-1 flex flex-col">
          <header className="sticky top-0 z-40 border-b border-[#f2d00d]/15 bg-white/70 dark:bg-[#221f10]/80 backdrop-blur-md">
            <div className="px-6 lg:px-10 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[#f2d00d]">
                  shield
                </span>
                <div>
                  <div className="font-bold font-serif">Admin</div>
                  <div className="text-xs text-slate-600 dark:text-slate-300">
                    Manage products, orders, and the brand.
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href="/"
                  className="hidden sm:inline-flex items-center gap-2 border border-[#f2d00d]/30 text-[#f2d00d] px-4 py-2 rounded-lg font-bold uppercase tracking-widest text-xs hover:bg-[#f2d00d]/10"
                >
                  <span className="material-symbols-outlined text-base">home</span>
                  View site
                </Link>

                <button
                  onClick={() => {
                    logout();
                    router.push("/login");
                  }}
                  className="inline-flex items-center gap-2 bg-[#f2d00d] text-[#221f10] px-4 py-2 rounded-lg font-bold uppercase tracking-widest text-xs hover:brightness-110"
                >
                  <span className="material-symbols-outlined text-base">logout</span>
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